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
    GRPC server class
    '''
    def __init__(self):
        '''
        load config and load model
        '''
        config = load_config()
        self.engine = nCoVTestEngine(config)

    @log_latency()
    def predict(self, request, c):
        '''
        grpc request
        :param request: grpc
        :param c: grpc context
        :return: grpc result
        '''

        with Session(request, c) as context:

            context.logger.info('req:{}'.format(MessageToDict(request)))
            # call predict function
            ret_code, ret_msg, results = self.engine.predict(context, 
                                        request.questions, request.strategy)
            # generate gen_common_resp
            common_reply = CommonPbHelper.gen_common_resp(ret_code, ret_msg)
            resp = nCoV_diagnosis_engine_pb2.DPReply()
            resp.common_rep.CopyFrom(common_reply)
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
            # return flag
            context.mark_succ('Query', 1 if ret_code == 0 else 0, ret_code)

            # print log
            context.logger.info('rep:{}'.format(MessageToDict(resp)))

        return resp


def serve(port=50051, worker=10):
    '''
    :param port: 
    :param worker: 
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
