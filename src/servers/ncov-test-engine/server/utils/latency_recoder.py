#!/usr/bin/env python3
# coding: utf-8

from functools import wraps
from server.utils.singleton import Singleton
import time
import influxdb

from loguru import logger


class RemoteInfluxDB(object, metaclass=Singleton):
    '''
    Monitoring platform client
    Singleton
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
        :param api_name: service api name
        :param request_id: request id
        :param succ: Flag bit, success
        :param ret_code: detail return code
        :param value: time cost
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
        }]

        self.client.write_points(body)

def log_latency():
    '''
    Provides time-consuming printing interface as a decorator
    The time-consuming format is module.function | time
    Output to log
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