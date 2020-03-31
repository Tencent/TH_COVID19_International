#!/usr/bin/env python3
# coding: utf-8
import grpc
import asyncio
import time

def _real_grpc_call(server_url, service_func, func_name, req, metadata=None, timeout=60):

    with grpc.insecure_channel(server_url) as channel:
        print('calling')
        stub = service_func(channel)
        call_func = getattr(stub, func_name)
        resp, call = call_func.with_call(req, timeout=timeout, metadata=metadata)

    return resp, call


def call_async_funcs(*calls):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        asyncio.set_event_loop(asyncio.new_event_loop())
        loop = asyncio.get_event_loop()
    resps = loop.run_until_complete(asyncio.gather(*calls))
    return resps

async def async_grpc_call(server_url, service_func, func_name, req, 
                                    threadpool=None, metadata=None, timeout=60):
    """
    :param server_url: service domain name eg:localhost:50051
    :param service_func: initial function of service Stub eg: question2answer_pb2_grpc.Question2AnswerStub
    :param func_name: api function name, string eg:'Quiz'
    :param req: service request eg:question2answer_pb2.QuizRequest()
    :return:

    eg:
    def async_run():
        reqs = [gen_req('where is endocine department'), gen_req('how to pay')]
        calls = [async_grpc_call('localhost:50051', 
                    question2answer_pb2_grpc.Question2AnswerStub, 'Quiz', req) for req in reqs]
        resps = call_async_funcs(*calls)
    """
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(threadpool, _real_grpc_call, 
                        server_url, service_func, func_name, req, metadata, timeout)
    return result

def sync_grpc_call(server_url, service_func, func_name, req, metadata=None, timeout=60):
    """
    :param server_url: service domain name eg:localhost:50051
    :param service_func: initial function of service Stub eg: question2answer_pb2_grpc.Question2AnswerStub
    :param func_name: api function name, string eg:'Quiz'
    :param req: service request eg:question2answer_pb2.QuizRequest()
    :return:

    eg:
    def sync_run():
        resps = [sync_grpc_call('localhost:50051', 
                    question2answer_pb2_grpc.Question2AnswerStub, 'Quiz', req) for req in reqs]
    """
    return _real_grpc_call(server_url, service_func, func_name, req, metadata, timeout)
