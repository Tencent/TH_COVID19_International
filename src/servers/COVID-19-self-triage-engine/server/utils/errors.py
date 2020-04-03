

class CustomError(Exception):
    '''
    Request exception base class
    '''
    def __init__(self, ret_code, ret_msg):
        super().__init__(ret_code, ret_msg)
        self.ret_code = ret_code
        self.ret_msg = ret_msg

class NoSupportVersion(CustomError):
    '''
    Unsupported policy version
    '''
    def __init__(self, version_lis):
        super().__init__(ret_code=-2, 
            ret_msg='no support version. support version:{}'.format(version_lis))
