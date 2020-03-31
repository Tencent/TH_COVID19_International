

class CustomError(Exception):
    '''
    请求异常基类
    '''
    def __init__(self, ret_code, ret_msg):
        super().__init__(ret_code, ret_msg)
        self.ret_code = ret_code
        self.ret_msg = ret_msg

class NoSupportVersion(CustomError):
    '''
    不支持的策略版本
    '''
    def __init__(self, version_lis):
        super().__init__(ret_code=-2, 
            ret_msg='no support version. support version:{}'.format(version_lis))
