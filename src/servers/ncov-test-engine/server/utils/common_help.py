#!/usr/bin/env python3
# coding: utf-8
import time
import sys
from collections import namedtuple
from loguru import logger, _defaults as loguru_defaults

from server.protobufs.gen.pb_python import common_pb2
from server.config.config import load_config
from server.utils.latency_recoder import RemoteInfluxDB

cf = load_config()
logger.remove()

# log format 
# Process the log in the request with the function name, line number, service name, request id, etc.
# Other default log formats
# Judging by 'log_req'
def log_format(record):
    if 'log_req' in record["extra"]:
        return '{time:YYYY-MM-DD HH:mm:ss.SSS}|{level: <8}\
            |{name}:{function}:{line}|{extra[log_req]}|{extra[server_name]}\
            |{extra[user_id]}|{extra[request_id]}|{extra[session_id]}|{extra[trace_id]}\
            |{message}\n'
    else:
        return loguru_defaults.LOGURU_FORMAT+'\n'

logger.add(sys.stdout, format=log_format)

if cf.APP_MODE != 'dev':
    logger.add("/data/nCoV_test_engine/log/out.log", 
                format=log_format, retention="20 days", encoding='utf-8')


class CommonPbHelper(object):
    '''
        Public PB processing function, process CommonReq\CommonResp\Context
    '''
    @staticmethod
    def parse_req(req):
        return req.common_req

    @staticmethod
    def gen_common_req(req, context):
        common_req = common_pb2.CommonRequest(version=cf.VERSION, 
            request_id=context.request_id, user_id=context.user_id, 
            session_id=context.session_id, trace_id=context.trace_id)
        return common_req

    @staticmethod
    def hard_code_common_req(version, request_id, user_id, session_id, trace_id):
        return common_pb2.CommonRequest(version=version,
            request_id=request_id, user_id=user_id, session_id=session_id, trace_id=trace_id)

    @staticmethod
    def gen_common_resp(ret_code, ret_message):
        '''
        generate CommonResponse， cf.VERSION is sevice version number
        '''
        return common_pb2.CommonResponse(version=cf.VERSION, 
                ret_code=ret_code, ret_message=ret_message)

class Session(object):
    '''
    like context 
    '''
    def __init__(self, req, grpc_context):
        self.req = req
        self.grpc_context = grpc_context

    def __enter__(self):
        '''
        initializing context
        logger.bind binds server_name, user_id, etc. to the logger in advance, and subsequent printed logs will take server_name, user_id, etc.
        metadata stores temporary values, which is convenient for filling the context when subsequent grpc service calls
        :return:
        '''
        self.start_time = time.time()
        common_req = CommonPbHelper.parse_req(self.req)
        logger_c = logger.bind(log_req=True, server_name=cf.SERVER_NAME, 
                user_id=common_req.user_id, request_id=common_req.request_id, 
                session_id=common_req.session_id, trace_id=common_req.trace_id)
        self.version = common_req.version
        self.request_id = common_req.request_id
        self.user_id = common_req.user_id
        self.session_id = common_req.session_id
        self.trace_id = common_req.trace_id
        self.logger = logger_c
        self.metadata = (('version', self.version), ('request_id', self.request_id), 
                        ('user_id', self.user_id), ('session_id', self.session_id),
                         ('trace_id', self.trace_id, ('server_name', cf.SERVER_NAME)))

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        '''
        After the request is processed, the results and time will be reported to the monitoring platform.
        Under abnormal conditions, print the exception stack
        '''
        end_time = time.time()
        resp_time = (end_time - self.start_time) * 1000
        remote_influx = RemoteInfluxDB()
        if exc_type is None:
            remote_influx.insert(self.api_name, self.request_id, 
                                    self.succ, self.ret_code, resp_time)
        else:
            import traceback
            self.logger.error(traceback.format_exc(limit=5))
            remote_influx.insert('_exception', self.request_id, False, 99, resp_time)

    def mark_succ(self, api_name, succ, ret_code):
        '''
        Need to be called before __exit__, fill in the request result flag
        '''
        self.api_name = api_name
        self.succ = succ
        self.ret_code = ret_code