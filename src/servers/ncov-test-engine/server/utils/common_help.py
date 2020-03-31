#!/usr/bin/env python3
# coding: utf-8
import time
import sys
from collections import namedtuple
from loguru import logger, _defaults as loguru_defaults

from server.protobufs.gen.pb_python import common_pb2
from server.config.config import load_config
from server.utils.latency_recoder import RemoteInfluxDB

# Context = namedtuple('Context', 
#           ['version','request_id','user_id','session_id','trace_id','logger'])

cf = load_config()
logger.remove()

# log format 
# 处理请求中的log带上函数名、行号、服务名和请求id等
# 其他的log格式默认
# 通过'log_req'来判断
def log_format(record):
    if 'log_req' in record["extra"]:
        return """{time:YYYY-MM-DD HH:mm:ss.SSS}|{level: <8}
            |{name}:{function}:{line}|{extra[log_req]}|{extra[server_name]}
            |{extra[user_id]}|{extra[request_id]}|{extra[session_id]}|{extra[trace_id]}
            |{message}\n"""
    else:
        return loguru_defaults.LOGURU_FORMAT+'\n'

logger.add(sys.stdout, format=log_format)

if cf.APP_MODE != 'dev':
    logger.add("/data/nCoV_test_engine/log/out.log", 
                format=log_format, retention="20 days", encoding='utf-8')


class CommonPbHelper(object):
    '''
        公共PB处理函数，处理CommonReq\CommonResp\Context
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
        生成CommonResponse， cf.VERSION为服务版本号
        '''
        return common_pb2.CommonResponse(version=cf.VERSION, 
                ret_code=ret_code, ret_message=ret_message)

class Session(object):
    '''
    类似于context的存在
    '''
    def __init__(self, req, grpc_context):
        self.req = req
        self.grpc_context = grpc_context

    def __enter__(self):
        '''
        初始化好context
        logger.bind提前将server_name、user_id等绑定到logger里，后续打印的log都会带上server_name、user_id等
        metadata存储临时值，方便后续grpc服务调用时候填充context
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
        请求处理结束后，将结果和耗时统一上报监控平台
        异常情况下，打印下异常堆栈
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
        需要在__exit__之前调用，填充好请求结果标志
        '''
        self.api_name = api_name
        self.succ = succ
        self.ret_code = ret_code