#!/usr/bin/env python3
# coding: utf-8

from functools import wraps
from server.utils.singleton import Singleton
import time
import influxdb

from loguru import logger


class RemoteInfluxDB(object, metaclass=Singleton):
    '''
    监控平台client端
    单例
    '''
    def __init__(self):
        from server.config.config import load_config
        config = load_config()
        self.client = influxdb.InfluxDBClient(config.INFLUXDB_HOST, 
            database=config.INFLUXDB_DB, use_udp=True, udp_port=config.INFLUXDB_PORT)
        self.measurement = '.'.join([config.GROUP_NAME, config.SERVER_NAME])
        self.env = config.APP_MODE

    def insert(self, api_name, request_id, succ, ret_code, value):
        '''
        :param api_name: 服务接口名
        :param request_id: 请求id
        :param succ: 标志位，是否成功
        :param ret_code: 详细的return code
        :param value: 耗时
        :return:
        '''
        body = [{
            'measurement': self.measurement+'.'+api_name,
            'tags':{
                'env': self.env,
                'request_id': request_id
            },
            'fields': {
                'succ': succ,
                'ret_code': ret_code,
                'latency': value,
            },
            # 'time': int(time.time())
        }]

        self.client.write_points(body)

def log_latency():
    '''
    以装饰器的形式提供打印耗时接口
    耗时格式为 模块.函数|时间
    输出到log中
    '''
    def wrapper(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):

            start_time = time.time()
            ret = fn(*args, **kwargs)
            end_time = time.time()
            resp_time = (end_time - start_time) * 1000

            logger.info("{}.{}|{}".format(fn.__module__, fn.__name__, resp_time))
            return ret
        return wrapped
    return wrapper