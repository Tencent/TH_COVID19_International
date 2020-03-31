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

def gen_req():
    req = nCoV_diagnosis_engine_pb2.DPRequest()
    req.common_req.CopyFrom(
        CommonPbHelper.hard_code_common_req(version='0.1.0', 
            request_id='1', user_id='2', session_id='3', trace_id='4'))
    req.strategy = 'v3_en'
    return req

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = nCoV_diagnosis_engine_pb2_grpc.nCoVDiagnosisServiceStub(channel)
        req = gen_req()
        metadata = (('version', '1.0.0'), ('version2', '1.0.0'))
        resp, call = stub.predict.with_call(request=req, metadata=metadata)

    print(MessageToDict(resp))

if __name__ == '__main__':
    run()