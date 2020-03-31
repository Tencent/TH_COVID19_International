#!/usr/bin/env python3
# coding: utf-8

import os

from server.utils.singleton import Singleton
#from server.utils.l5_helper import get_l5_ip_port, is_l5_address


BASE_PATH = os.path.abspath(os.path.dirname(__file__))

class BaseConfig(object, metaclass=Singleton):
    '''
    配置基类，全局唯一
    '''
    def __init__(self):
        '''
        默认配置
        APP_MODE 区分环境
        '''
        self.APP_MODE = os.getenv('APP_MODE', default='dev')
        self.VERSION = '0.1.0'
        self.SERVER_NAME = 'nCoV_test_engine'
        self.GROUP_NAME = 'TencareAI'
        self.SERVER_PORT = 50051
        self.SERVER_THREAD_WORK = 10

        self.QUESTION_V1_DATA = os.path.join(BASE_PATH, '..', 'data', 'question_config_v1.yml')
        self.QUESTION_V2_DATA = os.path.join(BASE_PATH, '..', 'data', 'question_config_v2.yml')
        self.QUESTION_V3_DATA = os.path.join(BASE_PATH, '..', 'data', 'question_config_v3.yml')
        self.QUESTION_V3_EN_DATA = os.path.join(BASE_PATH, '..', 'data', 'question_config_v3_en.yml')

        self.QUESTION_TEST_DATA = os.path.join(BASE_PATH, '..', 'data', 'test.yml')

        self.MDB_DNS = ['8.8.8.8']
        self.MDB_HOST_NAME = '127.0.0.1'
        self.MDB_PORT = '3306'
        self.MDB_USER = 'root'
        self.MDB_PASSWORD = '1234'
        self.MDB_DB = 'db_diagnosis_guide'

        self.INFLUXDB_HOST = '127.0.0.1'
        self.INFLUXDB_PORT = 4444
        self.INFLUXDB_DB = 'test'

        self.XXX_SERVER_URL = 'localhost:50051'

        self.RAINBOW_APP_ID = '00cd2b78-5eaf-4177-9328-7071d86e0e38'
        self.RAINBOW_REGULAR_MAP_GROUP = 'TencareAI.xxxx.' + self.APP_MODE

    def update_from_env(self):
        '''
        通过环境变量里的特殊值，替换配置里的特定值
        '''
        keys = self.__dict__.keys()
        keys = [key for key in keys if not key.startswith('_')]
        for key in keys:
            self.__dict__[key] = os.getenv(key, self.__dict__[key])
        return self

    def do_something(self):
        '''
        配置中做一些额外的事情
        :return:
        '''
        # if is_l5_address(self.XXX_SERVER_URL):
        #     get_l5_ip_port(self.XXX_SERVER_URL)

        return self

class ProductConfig(BaseConfig):
    '''
    正式环境配置
    '''
    def __init__(self):
        super().__init__()

        self.INFLUXDB_HOST = '127.0.0.1'
        self.INFLUXDB_PORT = 8094
        self.INFLUXDB_DB = 'telegraf'


class TestConfig(BaseConfig):
    '''
    测试环境配置
    '''
    def __init__(self):
        super().__init__()

        self.INFLUXDB_HOST = '127.0.0.1'
        self.INFLUXDB_PORT = 8094
        self.INFLUXDB_DB = 'telegraf'

        self.XXX_SERVER_URL = 'l5://xxx:xxx'

class DevConfig(BaseConfig):
    '''
    开发环境配置
    '''
    def __init__(self):
        super().__init__()

def load_config():
    '''
    加载配置，根据环境变量APP_MODE区分环境
    '''
    APP_MODE = os.getenv('APP_MODE', default='dev')

    if APP_MODE == 'product':
        return ProductConfig().update_from_env().do_something()
    elif APP_MODE == 'test':
        return TestConfig().update_from_env().do_something()
    else:
        return DevConfig().update_from_env().do_something()

if __name__ == '__main__':
    s = load_config()
    print(s)