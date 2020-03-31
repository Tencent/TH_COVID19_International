#!/usr/bin/env python3
# coding: utf-8

import os

from server.utils.singleton import Singleton
#from server.utils.l5_helper import get_l5_ip_port, is_l5_address


BASE_PATH = os.path.abspath(os.path.dirname(__file__))

class BaseConfig(object, metaclass=Singleton):
    '''
    base class
    '''
    def __init__(self):
        '''
        default config
        APP_MODE environment
        '''
        self.APP_MODE = os.getenv('APP_MODE', default='dev')
        self.VERSION = '0.1.0'
        self.SERVER_NAME = 'nCoV_test_engine'
        self.GROUP_NAME = 'TencareAI'
        self.SERVER_PORT = 50051
        self.SERVER_THREAD_WORK = 10

        self.QUESTION_V3_EN_DATA = os.path.join(BASE_PATH, '..', 'data', 'question_config_v3_en.yml')

        self.INFLUXDB_HOST = '127.0.0.1'
        self.INFLUXDB_PORT = 4444
        self.INFLUXDB_DB = 'test'

    def update_from_env(self):
        '''
        update environment variables
        '''
        keys = self.__dict__.keys()
        keys = [key for key in keys if not key.startswith('_')]
        for key in keys:
            self.__dict__[key] = os.getenv(key, self.__dict__[key])
        return self

    def do_something(self):
        '''
        :return:
        '''

        return self

class ProductConfig(BaseConfig):
    '''
    production config 
    '''
    def __init__(self):
        super().__init__()

        self.INFLUXDB_HOST = '127.0.0.1'
        self.INFLUXDB_PORT = 8094
        self.INFLUXDB_DB = 'telegraf'


class TestConfig(BaseConfig):
    '''
    testing config
    '''
    def __init__(self):
        super().__init__()

        self.INFLUXDB_HOST = '127.0.0.1'
        self.INFLUXDB_PORT = 8094
        self.INFLUXDB_DB = 'telegraf'

class DevConfig(BaseConfig):
    '''
    development config
    '''
    def __init__(self):
        super().__init__()

def load_config():
    '''
    load config
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