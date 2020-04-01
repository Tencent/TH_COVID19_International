'use strict'

class AIDiagnosisError extends Error {
    constructor(...args) {
        super(...args)
        this.name = this.constructor.name
        if (args[0] instanceof Error) {
            const err = args[0]
            this.code = err.code || 0
            this.message = err.message
            this.stack = err.stack
            return
        }
        if (args[0].response) {
            this.code = args[0].response.error.code
            this.message = args[0].response.error.message
        } else if (args.length > 1) {
            [this.code, this.message] = args
        } else {
            this.message = args[0]
            this.code = -1
        }
    }

}


const errorModuleInfo = {
    9527: '',
    2020: '分诊导诊服务异常',
}

const errorDetailInfo = {
    952701: '非法的appid',
    952713: '参数错误',

    202001: '后台服务接口调用异常',
    202002: 'ai引擎接口返回值非0'

    // 100001: '内部错误',
    // 100002: '外部错误',
    // 100003: '超时',
    // 100004: '参数错误',
    // 100006: '未知错误',
    // 100008: '禁止访问',
    // 100010: '调用引擎错误',
    // 200001: 'session已过期',
}

const ErrorInfo = (code, ext) => {
    if (!(code in errorDetailInfo)) {
        return new AIDiagnosisError(code, ext)
    }
    const moduleMsg = errorModuleInfo[Math.floor(code / 100)]
    const detail = errorDetailInfo[code]
    if (ext != undefined && ext instanceof Error) {
        let message = `${moduleMsg} | ${detail} | ${ext.message}`
        const err = new AIDiagnosisError(code, message)
        err.stack = ext.stack
        return err
    } else {
        ext = ext || ''
        let message = `${moduleMsg} | ${detail} | ${ext}`
        return new AIDiagnosisError(code, message)
    }
}

const PackError = (err, code) => {
    if (err.code && err.code > 0) {
        return err
    }

    const aiErr = ErrorInfo(code, err.code + '|' + err.message)
    aiErr.stack = err.stack
    return aiErr
}

module.exports = {
    ErrorInfo,
    PackError,
}
