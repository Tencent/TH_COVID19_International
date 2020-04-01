'use strict'
/**
 * 根据req.args.service中的值进行路由
 * 建议根据需求改为通过配置文件进行配置的模式
 */
const handlers = {}

function getHandler(handlerName) {
    if (handlers[handlerName]) {
        return handlers[handlerName]
    } else {
        throw new Error('handler not found!')
    }
}

handlers['DiagnosisPreServer_NCovDiagnosis'] = require('../service/pre_service')
module.exports = { getHandler }
