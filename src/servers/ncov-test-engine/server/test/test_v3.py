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


def test_and_or():

    with open(config.QUESTION_TEST_DATA, 'r', encoding='utf-8') as f:
        temp = yaml.load(f.read())

    assert False is check_advance_reason([1,2,3], temp['advance_reason'], and_flag=True)
    assert True is check_advance_reason([1,2,3,7,8], temp['advance_reason'], and_flag=True)
    assert False is check_advance_reason([1,3,4,8], temp['advance_reason'], and_flag=True)
    assert False is check_advance_reason([1,3], temp['advance_reason'], and_flag=True)
    assert False is check_advance_reason([1,7], temp['advance_reason'], and_flag=True)
    assert False is check_advance_reason([3,7], temp['advance_reason'], and_flag=True)


def _real_test(qs, answer_index):
    his = []
    for q in qs:
        question = nCoV_diagnosis_engine_pb2.DetailedQuestions()
        ParseDict(q, question, ignore_unknown_fields=True)
        his.append(question)
    with Session(temp_req, None) as context:
        ret_code, _, result = engine.predict(context, his_questions=his, strategy='v3')
        assert ret_code == 0
        assert result['reply_type'] == nCoV_diagnosis_engine_pb2.NO_NEED
        assert result['answer_index'] == answer_index

        context.mark_succ('Quiz', 1 if ret_code == 0 else 0, ret_code)

        print(result['conclusions'])


# def test_case1():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#             {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#                 'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 3},
#             {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#                 'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                 '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例', '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#             {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 5},
#             {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#                 'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                                   '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 7},
#             ]
#
#     _real_test(qs, 1)
#
#
# def test_case2():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                                     '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 5},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                              '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['以上都没有'], 'no': 7},
#           ]
#
#     _real_test(qs, 1)
#
# def test_case3():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['其它慢性病'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 5},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 7},
#           ]
#
#     _real_test(qs, 1)
#
# def test_case4():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 5},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 7},
#           ]
#
#     _real_test(qs, 1)
#
# def test_case5():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['有武汉及周边地区的旅行或居住史'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 5},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 7},
#           ]
#
#     _real_test(qs, 2)
#
# def test_case6():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['有武汉及周边地区的旅行或居住史'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
# 				'sympList': ['> 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 7},
#           ]
#
#     _real_test(qs, 11)
#
# def test_case7():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['有武汉及周边地区的旅行或居住史'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
# 				'sympList': ['≤ 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['鼻塞'], 'no': 7},
#           {'questionQuery': '请问上述症状是否有加重或休息后仍不见好转？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 8}
#           ]
#
#     _real_test(qs, 12)
#
# def test_case8():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['有武汉及周边地区的旅行或居住史'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
# 				'sympList': ['> 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['鼻塞'], 'no': 7},
#           {'questionQuery': '请问上述症状是否有加重或休息后仍不见好转？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 8}
#           ]
#
#     _real_test(qs, 13)
#
# def test_case9():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
# 				'sympList': ['> 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['以上都没有'], 'no': 7},
#           {'questionQuery': '请问上述症状是否休息后无好转，或逐渐加重？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 8}
#           ]
#
#     _real_test(qs, 8)
#
# def test_case10():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
# 				'sympList': ['≤ 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['乏力'], 'no': 7},
#           {'questionQuery': '请问上述症状是否有加重或休息后仍不见好转？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 8}
#           ]
#
#     _real_test(qs, 9)
#
#
# def test_case11():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '> 37.3'],
# 				'sympList': ['> 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['乏力'], 'no': 7},
#           {'questionQuery': '请问上述症状是否有加重或休息后仍不见好转？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 8}
#           ]
#
#     _real_test(qs, 5)
#
# def test_case12():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '> 37.3'],
# 				'sympList': ['> 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['胸闷、憋喘或呼吸困难'], 'no': 7}
#           ]
#
#     _real_test(qs, 15)
#
# def test_case13():
#     qs = [{'questionQuery': '请问您的年龄阶段是？', 'candidateSymp': ['小于5岁', '5~14岁', '15～60岁', '60岁以上'],
# 				'sympList': ['15～60岁'], 'no': 1},
#           {'questionQuery': '好的，请问您是否为孕妇？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['否'], 'no': 2},
#           {'questionType': 'MULTI', 'questionQuery': '了解，请问您是否患有以下慢性疾病？',
#            'candidateSymp': ['慢性心脑血管疾病', '慢性呼吸道疾病', '慢性肝、肾病', '免疫力低下', '其它慢性病', '以上都没有'],
# 				'sympList': ['以上都没有'],
#            'no': 3},
#           {'questionType': 'MULTI', 'questionQuery': '好的，最近两周内，是否有以下相关情况或接触史？',
#            'candidateSymp': ['有武汉及周边地区的旅行或居住史', '接触过武汉及周边（或其他病例聚集区）发热伴呼吸道症状的患者',
#                             '接触过的家人、同事或朋友同时出现发热或呼吸道症状', '接触、探视过疑似病例或确诊病例',
#                              '与疑似病例或确诊病例同乘一趟交通工具', '以上都没有'],
# 				'sympList': ['以上都没有'], 'no': 4},
#           {'questionQuery': '了解，请问您是否发热？', 'candidateSymp': ['是', '否'],
# 				'sympList': ['是'], 'no': 5},
#           {'questionQuery': '请问您体温最高达到多少度？', 'candidateSymp': ['> 37.3℃', '> 37.3'],
# 				'sympList': ['≤ 37.3℃'], 'no': 6},
#           {'questionType': 'MULTI', 'questionQuery': '收到，请问最近两周内是否还有其它症状？',
#            'candidateSymp': ['乏力', '咳嗽', '胸闷、憋喘或呼吸困难', '鼻塞', '流鼻涕',
#                             '咽痛', '头痛', '肌肉酸痛', '腹泻', '结膜炎', '以上都没有'],
#
# 				'sympList': ['胸闷、憋喘或呼吸困难'], 'no': 7}
#           ]
#
#     _real_test(qs, 14)