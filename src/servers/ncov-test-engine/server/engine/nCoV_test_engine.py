#!/usr/bin/env python3
# coding: utf-8
import traceback

from loguru import logger as o_logger
import yaml

from server.protobufs.gen.pb_python import nCoV_diagnosis_engine_pb2

# from elasticsearch import ElasticsearchException
# from server.engine.es_helper import Q2AElasticObj
from server.utils.latency_recoder import log_latency
from server.utils.errors import *
# from server.utils.rainbow_config import get_rainbow_config


def replace_str_counter(counter):
    if counter==0:
        replace_str=='but'
    elif counter==1:
        replace_str='and',
    else:
        replace_str='and'
    return replace_str

def check_advance_reason(conds, advance_reason, and_flag):
    flag_set = set()
    for op in advance_reason:
        if type(op) is dict and 'and' in op:
            tag = check_advance_reason(conds, op['and'], and_flag=True)
            flag_set.add(tag)
        elif type(op) is dict and  'or' in op:
            tag = check_advance_reason(conds, op['or'], and_flag=False)
            flag_set.add(tag)
        elif op not in conds:
            flag_set.add(False)
        else:
            flag_set.add(True)

    if and_flag and True in flag_set and False not in flag_set:
        return True
    elif and_flag is False and True in flag_set:
        return True

    return False


class nCoVTestEngine(object):
    def __init__(self, config):

        self.questions_map = {}
        self.answers = {}

        self.load_yml(config.QUESTION_V1_DATA, 'wuhan')
        self.load_yml(config.QUESTION_V2_DATA, 'beijing')
        self.load_yml(config.QUESTION_V3_DATA, 'v3')
        self.load_yml(config.QUESTION_V3_EN_DATA, 'v3_en')


    def load_yml(self, path, key):
        with open(path, 'r', encoding='utf-8') as f:
            temp = yaml.load(f.read(), Loader=yaml.FullLoader)
        self.questions_map[key] = temp['questions']
        self.answers[key] = temp['answers']


    def get_answers(self, his_questions, strategy):
        conds, person, symptom = self._deal_user_questions(his_questions, strategy)

        if 'no_use' in conds:
                conds.remove('no_use')

        hit_answer = {'answer':'', 'level':0, 'index':0}
        for answer_info in self.answers[strategy]:
            if 'advance_reason' in answer_info and len(answer_info['advance_reason']) > 0:
                if check_advance_reason(conds, answer_info['advance_reason'], and_flag=True):
                    hit_answer = answer_info
                    break
            elif len(set(answer_info['reason']) - conds) == 0 \
                    and len(conds - set(answer_info['reason'])) == 0:
                hit_answer = answer_info
                break

        answer = hit_answer['answer']
        level = hit_answer['level']
        answer_index = hit_answer['index']

        answer = self._gen_answer_by_replace(answer, conds, person, strategy, symptom)

        return answer, level, answer_index

    def _deal_user_questions(self, his_questions, strategy):
        # lizard forgives
        symptom = ''
        person = ''
        conds = set()
        for question in his_questions:
            no = question.no
            question_info = self.questions_map[strategy][no]
            q_type = question_info['type']
            q_answers = question.symp_list
            if strategy == 'wuhan' and no == 3:
                symptom = '、'.join(q_answers)
            if strategy == 'beijing' and no == 3:
                symptom = '、'.join(q_answers)
            if strategy == 'v3' and no == 7:
                symptom = '、'.join(q_answers)

            q_answers = [answer for answer in q_answers if len(answer) > 0]
            if len(q_answers) == 0 and (q_type == 'single' or q_type == 'multi'):
                q_answers = [question_info['suggested_answers'][-1]]

            for answer in q_answers:
                conds.add(question_info['conclusions'][answer])

                if strategy == 'beijing' and no == 6:
                    if answer == 'under 5':
                        person = 'child'
                    elif answer == 'over 60':
                        person = 'elderly'

                if strategy == 'v3' and no == 1:
                    if answer == 'Under 5':
                        person = 'child'
                    elif answer == 'Over 60':
                        person = 'elderly'
        return conds, person, symptom

    def _gen_answer_by_replace(self, answer, conds, person, strategy, symptom):
        counter = 0
        if len(symptom) > 0:
            counter = counter + 1
            answer = answer.replace('#symptom#', symptom)
        if strategy == 'beijing':
            if person:
                answer = answer.replace('#childOld#', person)
        if strategy == 'v3':
            if 'contact_condition_yes' in conds:
                answer = answer.replace('#contact#',
                                        'and you have contact history in past 2 weeks, ')

            if 'fever_condition_yes' in conds:
                counter = counter + 1
            if 'getSevere_condition_yes' in conds:
                counter = counter + 1
                answer = answer.replace('#getSevere#',
                                        'the symptoms did not relieve after rest, ')
            else:
                answer = answer.replace('#getSevere#', '')

            if 'chronicDisease_condition_yes' in conds:
                counter = counter + 1
                if counter == 1:
                    answer = answer.replace('#chronicDisease#',
                                            'but you suffered from chronic disorders, ')
                else:
                    answer = answer.replace('#chronicDisease#',
                                            'and you suffered from chronic disorders, ')
            else:
                answer = answer.replace('#chronicDisease#', '')

            if 'pregnant_condition_yes' in conds:
                counter = counter + 1
                if counter == 1:
                    answer = answer.replace('#pregnant#', 'but you are pregnant, ')
                else:
                    answer = answer.replace('#pregnant#', 'and you are pregnant, ')
            else:
                answer = answer.replace('#pregnant#', '')

            if 'childOld_condition_yes' in conds:
                counter = counter + 1
                if counter == 1:
                    answer = answer.replace('#childOld#',
                                            'but you are #person#，').replace('#person#', person)
                else:
                    answer = answer.replace('#childOld#',
                                            'and you are #person#，').replace('#person#', person)
            else:
                answer = answer.replace('#childOld#', '')

            if 'getSevere_condition_yes' in conds:
                counter = counter + 1
                answer = answer.replace('#getSevere_condition_yes#',
                                        'the symptoms did not relieve after rest')
            else:
                answer = answer.replace('#getSevere_condition_yes#', '')
        return answer

    def package_question(self, question_info):
        if question_info['type'] == 'single':
            question_type = nCoV_diagnosis_engine_pb2.SINGLE
        else:
            question_type = nCoV_diagnosis_engine_pb2.MULTI
        r = {
            'question_type': question_type,
            'question_query': question_info['q'],
            'candidate_symp': question_info['suggested_answers'],
            'no': question_info['no']
        }
        return r

    def _pack_conclusion_detail(self, type, yes_or_no, str_yes, str_no):
        if type == 'symp_severe':
            if yes_or_no:
                str_yes = 'the symptoms get severe or did not relieve after rest'
            else:
                str_yes = 'the symptoms did not get severe'
        elif type == 'his_contact':
            str_yes = '\\n'.join(['{}、{}'.format(i+1, s) \
                for i, s in enumerate(str_yes.split('\\n'))]) if len(str_yes) > 0 else ''
            str_no = '\\n'.join(['{}、{}'.format(i+1, s) \
                for i, s in enumerate(str_no.split('\\n'))]) if len(str_no) > 0 else ''
        return {
            'type': type,
            'yes_or_no': yes_or_no,
            'str_yes': str_yes,
            'str_no': str_no
        }

    def get_conclusions(self, strategy, his_questions, answer_index, answer):
        if strategy != 'v3':
            return {}
        details = self._deal_real_conclusions(his_questions, strategy)

        age_question = [q for q in his_questions if q.no == 1]
        pregnant_question = [q for q in his_questions if q.no == 2]

        age = age_question[0].symp_list[0] if len(age_question) == 1 else ''
        is_pregnant = age_question[0].symp_list[0] == 'Yes' \
                                            if len(pregnant_question) == 1 else False

        answer_info = [a for a in self.answers[strategy] if a['index'] == answer_index].pop()

        return {
            'age': age,
            'is_pregnant': is_pregnant,
            'details': details,
            'title': answer_info['title'],
            'answer': answer.replace(answer_info['title'], '').strip()
        }

    def _deal_real_conclusions(self, his_questions, strategy):
        # lizard forgives
        details = []
        temp_questions = [q for q in his_questions if q.no >= 2]
        for question in temp_questions:
            no = question.no
            question_info = self.questions_map[strategy][no]
            q_answers = [answer for answer in question.symp_list if len(answer) > 0]

            spilt_symb = '、' if no != 4 else '\\n'
            set_yes = set(q_answers)
            set_no = set(question_info['suggested_answers']) - set(q_answers)
            yes_or_no = False if len(set_yes) == 1 and \
                                 ('No' in set_yes or 'None of the above' in set_yes or '≤ 37.3℃' in set_yes) \
                else True

            set_yes = set_yes - {'None of the above'}
            set_no = set_no - {'None of the above'}

            str_yes = spilt_symb.join(set_yes)
            str_no = spilt_symb.join(set_no)

            details.append(self._pack_conclusion_detail(question_info['con_type'],
                                                        yes_or_no, str_yes, str_no))
        if len([q for q in his_questions if q.no == 2]) == 0:
            question_info = self.questions_map[strategy][2]
            details.append(self._pack_conclusion_detail(question_info['con_type'],
                                                        False, 'No', 'Yes'))
        if len([q for q in his_questions if q.no == 6]) == 0:
            question_info = self.questions_map[strategy][6]
            details.append(self._pack_conclusion_detail(question_info['con_type'],
                                                        False, '≤ 37.3℃', '> 37.3℃'))
        if len([q for q in his_questions if q.no == 8]) == 0:
            question_info = self.questions_map[strategy][8]
            details.append(self._pack_conclusion_detail(question_info['con_type'],
                                                        False, 'the symptoms did not get severe',
                                                        'Yes'))
        return details

    @log_latency()
    def predict(self, context, his_questions, strategy):
        logger_c = context.logger if context.logger else o_logger
        try:
            if strategy not in self.questions_map or strategy not in self.answers:
                raise NoSupportVersion(self.questions_map.keys())

            question_info = self.questions_map[strategy][0]
            answer = ''
            answer_index = 0
            severity_level = 0
            conclusions = {}
            if len(his_questions) == 0:
                question_info = self.questions_map[strategy][1]
            else:
                pre_question = his_questions[-1]
                pre_question_info = self.questions_map[strategy][pre_question.no]

                next_jump = pre_question_info['jump_cond']['default']
                if pre_question_info['is_jump']:
                    answers = pre_question.symp_list
                    answers = [answer for answer in answers if len(answer) > 0]
                    if len(answers) == 0 and \
                            (pre_question.question_type == nCoV_diagnosis_engine_pb2.SINGLE \
                                or pre_question.question_type == nCoV_diagnosis_engine_pb2.MULTI):
                        answers = [pre_question.candidate_symp[-1]]
                    for answer in answers:
                        if answer in pre_question_info['jump_cond']:
                            next_jump = pre_question_info['jump_cond'][answer]

                question_info = self.questions_map[strategy][next_jump]

            if question_info['no'] == 0:
                question_type = nCoV_diagnosis_engine_pb2.NO_NEED
                answer, severity_level, answer_index = self.get_answers(his_questions, strategy)
                conclusions = self.get_conclusions(strategy, his_questions, answer_index, answer)
            else:
                question_type = nCoV_diagnosis_engine_pb2.NEED_DETAILED_QUESTION

            result = {
                'reply_type': question_type,
                'answer': answer,
                'severity_level': severity_level,
                'answer_index': answer_index,
                'question': self.package_question(question_info),
                'conclusions': conclusions
            }
            
            return 0, 'success', result
        except CustomError as e:
            logger_c.error('q2a fail. {}'.format(e))
            logger_c.exception(traceback.format_exc(limit=5))
            return e.ret_code, e.ret_msg, None
        except Exception as e:
            logger_c.error('q2a fail. {}'.format(e))
            logger_c.exception(traceback.format_exc(limit=5))
            return -1, 'inter error', None

if __name__ == '__main__':

    from server.test.test_v3 import _real_test

    from server.config.config import load_config
    config = load_config()

    from google.protobuf.json_format import ParseDict, MessageToDict
    from server.utils.common_help import Session
    engine = nCoVTestEngine(config)

    temp_req = nCoV_diagnosis_engine_pb2.DPRequest()
    # temp_req.strategy = 'wuhan'
    # temp_req.strategy = 'beijing'
    temp_req.strategy = 'v3'

    with Session(temp_req, None) as context:

        his_question = []
        ret_code, ret_msg, result = engine.predict(context, his_question, temp_req.strategy)
        while result['reply_type'] == nCoV_diagnosis_engine_pb2.NEED_DETAILED_QUESTION:
            question_info = result['question']
            print('\nq_no:{}'.format(question_info['no']))
            print('q_type:{}'.format(question_info['question_type']))
            print('q:{}'.format(question_info['question_query']))
            print('s_a:{}'.format(question_info['candidate_symp']))

            answer = input()
            question_info['symp_list'] = [answer]

            question = nCoV_diagnosis_engine_pb2.DetailedQuestions()
            ParseDict(question_info, question, ignore_unknown_fields=True)

            his_question.append(question)

            ret_code, ret_msg, result = engine.predict(context, his_question, temp_req.strategy)

        context.mark_succ('Quiz', 1 if ret_code == 0 else 0, ret_code)

        print('\n\nanswer:{}'.format(result))

        for q in his_question:
            print(MessageToDict(q))



