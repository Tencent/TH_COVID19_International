#!/usr/bin/env python
# encoding: utf-8

from concurrent import futures
import grpc
import time
from google.protobuf.json_format import ParseDict, MessageToDict

from server.protobufs.gen.pb_python import nCoV_diagnosis_engine_pb2
from server.protobufs.gen.pb_python import nCoV_diagnosis_engine_pb2_grpc
from loguru import logger

# from server.utils.logger import logger
from server.utils.latency_recoder import log_latency
from server.config.config import load_config
from server.utils.common_help import CommonPbHelper, Session

from server.engine.nCoV_test_engine import nCoVTestEngine

_ONE_DAY_IN_SECONDS = 60 * 60 * 24

class nCoVTest(nCoV_diagnosis_engine_pb2_grpc.nCoVDiagnosisServiceStub):
    '''
    本地的GRPC server类
    '''
    def __init__(self):
        '''
        初始化函数
        在这里做具体的模型加载或者处理程序加载
        '''
        config = load_config()
        self.engine = nCoVTestEngine(config)

    @log_latency()
    def predict(self, request, c):
        '''
        具体的grpc请求处理
        :param request: grpc请求
        :param c: grpc context
        :return: grpc返回结果
        '''

        with Session(request, c) as context:

            # 打印请求日志
            context.logger.info('req:{}'.format(MessageToDict(request)))
            # 真实处理请求的地方
            ret_code, ret_msg, results = self.engine.predict(context, 
                                        request.questions, request.strategy)
            # 生成gen_common_resp
            common_reply = CommonPbHelper.gen_common_resp(ret_code, ret_msg)
            resp = nCoV_diagnosis_engine_pb2.DPReply()
            resp.common_rep.CopyFrom(common_reply)
            # 填充返回结果
            if ret_code == 0:
                if type(results) is dict:
                    if 'reply_type' in results:
                        resp.reply_type = results['reply_type']
                    if 'answer' in results:
                        resp.answer = results['answer']
                    if 'severity_level' in results:
                        resp.severity_level = results['severity_level']
                    if 'answer_index' in results:
                        resp.answer_index = results['answer_index']
                    if 'question' in results:
                        ParseDict(results['question'], resp.question)
                    if 'conclusions' in results:
                        ParseDict(results['conclusions'], resp.conclusions)
            # 填充返回结果的标志，供后续的监控平台使用
            context.mark_succ('Query', 1 if ret_code == 0 else 0, ret_code)

            # 打印返回结果日志
            context.logger.info('rep:{}'.format(MessageToDict(resp)))

        return resp


def serve(port=50051, worker=10):
    '''
    服务真实启动地方
    :param port: 服务端口
    :param worker: 服务线程数
    :return:
    '''
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=worker))
    nCoV_diagnosis_engine_pb2_grpc.add_nCoVDiagnosisServiceServicer_to_server(nCoVTest(), server)
    server.add_insecure_port('[::]:{}'.format(port))
    server.start()
    logger.info('waiting...')
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        logger.info('KeyboardInterrupt stop')
        server.stop(0)


if __name__ == '__main__':
    config = load_config()
    serve(config.SERVER_PORT, config.SERVER_THREAD_WORK)