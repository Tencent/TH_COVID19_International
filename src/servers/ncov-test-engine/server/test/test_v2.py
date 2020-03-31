import pytest
import yaml

from server.protobufs.gen.pb_python import nCoV_diagnosis_engine_pb2
from server.config.config import load_config
from server.engine.nCoV_test_engine import nCoVTestEngine, check_advance_reason
from server.utils.common_help import Session

config = load_config()
engine = nCoVTestEngine(config)

from google.protobuf.json_format import ParseDict, MessageToDict
temp_req = nCoV_diagnosis_engine_pb2.DPRequest()


def _real_test(qs, answer_index):
    his = []
    for q in qs:
        question = nCoV_diagnosis_engine_pb2.DetailedQuestions()
        ParseDict(q, question, ignore_unknown_fields=True)
        his.append(question)
    with Session(temp_req, None) as context:
        ret_code, _, result = engine.predict(context, his_questions=his, strategy='beijing')
        assert ret_code == 0
        assert result['reply_type'] == nCoV_diagnosis_engine_pb2.NO_NEED
        assert result['answer_index'] == answer_index

        context.mark_succ('Quiz', 1 if ret_code == 0 else 0, ret_code)

# def test_case1():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['以上都没有'], 'no': 3}]
#
#     _real_test(qs, 1)
#
# def test_case2():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['>=38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['以上都没有'], 'no': 3}]
#
#     _real_test(qs, 2)
#
# def test_case3():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '是否有明显的气喘或憋喘等症状？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['是'], 'no': 4}]
#
#     _real_test(qs, 3)
#
# def test_case4():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '是否有明显的气喘或憋喘等症状？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '是否休息1～2天病情无好转，或逐渐加重？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['是'], 'no': 5}]
#
#     _real_test(qs, 4)
#
# def test_case5():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '是否有明显的气喘或憋喘等症状？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '是否休息1～2天病情无好转，或逐渐加重？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 5},
#             {'questionQuery': '年龄？', 'candidateSymp': ['小于5岁', '5～60岁', '60岁以上'],
#                 'sympList': ['60岁以上'], 'no': 6}]
#
#     _real_test(qs, 5)
#
# def test_case6():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '是否有明显的气喘或憋喘等症状？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '是否休息1～2天病情无好转，或逐渐加重？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 5},
#             {'questionQuery': '年龄？', 'candidateSymp': ['小于5岁', '5～60岁', '60岁以上'],
#                 'sympList': ['5～60岁'], 'no': 6},
#             {'questionQuery': '是否为孕妇？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['是'], 'no': 7}]
#
#     _real_test(qs, 6)
#
# def test_case7():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '是否有明显的气喘或憋喘等症状？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '是否休息1～2天病情无好转，或逐渐加重？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 5},
#             {'questionQuery': '年龄？', 'candidateSymp': ['小于5岁', '5～60岁', '60岁以上'],
#                 'sympList': ['5～60岁'], 'no': 6},
#             {'questionQuery': '是否为孕妇？', 'candidateSymp': ['是', '否'],
#                  'sympList': ['否'], 'no': 7},
#             {'questionQuery': '是否患有心脏病、慢性肺病、慢性肝肾病、肥胖等慢性病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 8}]
#
#     _real_test(qs, 7)
#
# def test_case8():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '是否有明显的气喘或憋喘等症状？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '是否休息1～2天病情无好转，或逐渐加重？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 5},
#             {'questionQuery': '年龄？', 'candidateSymp': ['小于5岁', '5～60岁', '60岁以上'],
#                 'sympList': ['5～60岁'], 'no': 6},
#             {'questionQuery': '是否为孕妇？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 7},
#             {'questionQuery': '是否患有心脏病、慢性肺病、慢性肝肾病、肥胖等慢性病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 8},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 9},
#             {'questionQuery': '最近两周是否接触过来自武汉的发热伴有呼吸道症状的患者，或有与他人聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 10}]
#
#     _real_test(qs, 8)
#
# def test_case9():
#     qs = [{'questionQuery': '是否发烧？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 1},
#             {'questionQuery': '发烧体温是多少度？', 'candidateSymp': ['<38', '>=38'],
#                 'sympList': ['<38'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '是否有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '咽痛', '干咳', '腹泻', '以上都没有'],
#                     'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '是否有明显的气喘或憋喘等症状？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '是否休息1～2天病情无好转，或逐渐加重？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 5},
#             {'questionQuery': '年龄？', 'candidateSymp': ['小于5岁', '5～60岁', '60岁以上'],
#                 'sympList': ['5～60岁'], 'no': 6},
#             {'questionQuery': '是否为孕妇？', 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 7},
#             {'questionQuery': '是否患有心脏病、慢性肺病、慢性肝肾病、肥胖等慢性病？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 8},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 9},
#             {'questionQuery': '最近两周是否接触过来自武汉的发热伴有呼吸道症状的患者，或有与他人聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 10}]
#
#     _real_test(qs, 9)