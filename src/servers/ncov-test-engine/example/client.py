#!/usr/bin/env python3
# coding: utf-8

import asyncio
import random
from loguru import logger
import concurrent.futures

import grpc
from google.protobuf.json_format import MessageToDict

from server.protobufs.gen.pb_python import nCoV_diagnosis_engine_pb2_grpc
from server.protobufs.gen.pb_python import nCoV_diagnosis_engine_pb2

from server.utils.common_help import CommonPbHelper
from server.utils.async_grpc_call import async_grpc_call, call_async_funcs

def gen_req(query):
    req = nCoV_diagnosis_engine_pb2.DPRequest()
    req.common_req.CopyFrom(
        CommonPbHelper.hard_code_common_req(version='0.1.0', 
            request_id='1', user_id='2', session_id='3', trace_id='4'))
    req.strategy = 'wuhan'
    return req

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = nCoV_diagnosis_engine_pb2_grpc.nCoVDiagnosisServiceStub(channel)
        req = gen_req('怎么缴费')
        # resp = stub.Quiz(req)
        metadata = (('version', '1.0.0'), ('version2', '1.0.0'))
        resp, call = stub.predict.with_call(request=req, metadata=metadata)

    print(MessageToDict(resp))


# def async_run():
#     reqs = [gen_req('骨科怎么走'), gen_req('怎么缴费')]
#     metadata = (('version', '1.0.0'), ('version2', '1.0.0'))
#     threadpool = concurrent.futures.ThreadPoolExecutor(10)
#     calls = [async_grpc_call('localhost:50051', 
#                   nCoV_diagnosis_engine_pb2_grpc.nCoVDiagnosisServiceStub,
#                  'predict', req, threadpool, metadata) for req in reqs]
#     resps = call_async_funcs(*calls)
#     # resps = loop.run_until_complete(async_grpc_call('localhost:50051', 
#           nCoV_test_engine_pb2_grpc.Question2AnswerStub, 'Quiz', gen_req('怎么缴费')))
#     for resp in resps:
#         print(MessageToDict(resp[0]))


if __name__ == '__main__':
    run()
    # async_run()