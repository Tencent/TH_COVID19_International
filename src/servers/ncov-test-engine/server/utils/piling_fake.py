
from functools import wraps

from loguru import logger
from google.protobuf.json_format import ParseDict

from server.utils.common_help import CommonPbHelper
from server.protobufs.gen.pb_python import nCoV_diagnosis_engine_pb2

def piling_fake_diagnosis(req):
    resp = nCoV_diagnosis_engine_pb2.DiagnosisReply()
    common_reply = CommonPbHelper.gen_common_resp(0, 'success')
    resp.common_rep.CopyFrom(common_reply)

    query = req.query
    if query.startswith('2'):
        resp.reply_type = nCoV_diagnosis_engine_pb2.NO_MEDICAL_QUERY
        resp.help_msg = 'Hi～我是咨询助手。可以帮您找到合适的医生问诊。请描述身体哪里不适，有什么症状，持续了多久？'
    elif query.startswith('3'):
        resp.reply_type = nCoV_diagnosis_engine_pb2.NEED_DETAILED_QUESTION
        ParseDict({'question_type': 1, 'question_rounds': 1, 'candidate_symp': [],
                   'symp_list': ["头疼", "便秘", "胃胀", "稀便", "消化不良", "尿频", "发烧", "受凉", "腰痛"]},
                  resp.symp_list)
    else:
        resp.reply_type = nCoV_diagnosis_engine_pb2.NO_NEED
    resp.ner_list.extend(['感冒', '发烧'])
    # resp.disease_list.extend([ParseDict({'disease_name':'感冒', 'probability':'0.9'},
    #                                      diagnosis_engine_pb2.Disease)])
    # disease = resp.disease_list.add()
    # disease.disease_name = '感冒'
    # disease.probability = 0.9
    # resp.dept_list.extend([ParseDict({'department_id':'1', 'department_name':'呼吸内科'},
    #                                   diagnosis_engine_pb2.StandardDept)])
    # depart = resp.dept_list.add()
    # depart.department_id = '1'
    # depart.department_name = '呼吸内科'

    return resp


async def piling_fake(server_url, func_name, req):
    '''
    根据服务接口名，打桩不同的测试数据
    '''
    if func_name == 'Diagnosis':
        return piling_fake_diagnosis(req)
    else:
        return None

def piling_fake_wrap():
    '''
    注入到async_grpc_call中
    根据server_url来判断是否填充打桩数据
    '''
    def wrapper(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            server_url = kwargs['server_url'] if 'server_url' in kwargs else args[0]
            if  server_url.startswith('test://'):
                service_func = kwargs['service_func'] if 'service_func' in kwargs else args[1]
                func_name = kwargs['func_name'] if 'func_name' in kwargs else args[2]
                req = kwargs['req'] if 'req' in kwargs else args[3]
                ret = piling_fake(server_url, func_name, req)
            else:
                ret = fn(*args, **kwargs)
            return ret
        return wrapped
    return wrapper

