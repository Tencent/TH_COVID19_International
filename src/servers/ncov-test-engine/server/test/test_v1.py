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
        ret_code, _, result = engine.predict(context, his_questions=his, strategy='wuhan')
        assert ret_code == 0
        assert result['reply_type'] == nCoV_diagnosis_engine_pb2.NO_NEED
        assert result['answer_index'] == answer_index

        context.mark_succ('Quiz', 1 if ret_code == 0 else 0, ret_code)

# def test_case1():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['≤ 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                  'sympList': ['以上都没有'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 5}
#     ]
#     _real_test(qs, 1)
#
# def test_case2():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['> 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                 'sympList': ['以上都没有'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 5}
#     ]
#     _real_test(qs, 2)
#
# def test_case3():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['≤ 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                 'sympList': ['流鼻涕'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'], 'sympList': ['否'],
#                 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 5}
#     ]
#     _real_test(qs, 3)
#
# def test_case4():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['≤ 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                 'sympList': ['以上都没有'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 5}
#     ]
#     _real_test(qs, 4)
#
# def test_case5():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['> 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['否'], 'no': 5}
#     ]
#     _real_test(qs, 5)
#
# def test_case6():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['> 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                 'sympList': ['以上都没有'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 5}
#     ]
#     _real_test(qs, 6)
#
# def test_case7():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['≤ 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                 'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 5}
#     ]
#     _real_test(qs, 7)
#
# def test_case8():
#     qs = [{'questionQuery': '请问您是否发热？', 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 1},
#             {'questionQuery': '请问发热到多少度？', 'candidateSymp': ['> 37.3℃', '≤ 37.3℃'],
#                 'sympList': ['> 37.3℃'], 'no': 2},
#             {'questionType': 'MULTI', 'questionQuery': '请问是否还有其它症状？',
#                 'candidateSymp': ['乏力', '干咳', '鼻塞', '流鼻涕', '咽痛', '头痛', '浑身酸痛', '腹泻', '以上都没有'],
#                     'sympList': ['腹泻'], 'no': 3},
#             {'questionQuery': '最近两周是否居住在武汉或去过武汉？', 'candidateSymp': ['是', '否'],
#                 'sympList': ['否'], 'no': 4},
#             {'questionQuery': '最近两周是否接触过来自武汉（或其他病例持续传播地区）的发热或有呼吸道症状的患者，或有聚集性发病？',
#                 'candidateSymp': ['是', '否'], 'sympList': ['是'], 'no': 5}
#     ]
#     _real_test(qs, 8)