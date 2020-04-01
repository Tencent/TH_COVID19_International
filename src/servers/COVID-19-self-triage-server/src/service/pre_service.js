const logger = require('../util/log_util')('ncovdiagnosis')
const BaseService = require('../common/base_service')
const {ErrorInfo, PackError} = require('../util/error-info')
const config = require('../config/index')
const aiEngineProxy = new (require('../proxy/ai-engine-proxy'))

// 自查服务逻辑实现
class PreService extends BaseService {
    // 自诊引擎接口
    async NewCovDiagnosis(loggerPrefix, header, req) {
        logger.info(`${loggerPrefix}|NewCovDiagnosis|req|${JSON.stringify(req)}`)
        const requestId = header.requestId

        // 引擎请求req
        let resp = {}
        let engineReq = {} 
        try {
            engineReq.common_req = {
                request_id: requestId,
                session_id: 'sessionId'
            }
            engineReq.user_profile = {}
            engineReq.strategy =  req.strategy || config.strategy.strategy
            if (req.questions) {
                engineReq.questions = req.questions
            } else {
                engineReq.questions = []
            }
      
            // 请求引擎
            let engineRsp = await aiEngineProxy.NCovDiagnosisEngine(requestId, engineReq)
            const retcode = engineRsp.common_rep.ret_code
            if (retcode === 0) {
                //resp.question.readFromObject(engineRsp.question)
                if (engineRsp.reply_type === 0 && engineRsp.conclusions) {
                    let details = {}
                    for (let detail of engineRsp.conclusions.details) {
                        details[detail.type] = detail
                    }
                    engineRsp.conclusions.details = details
                    engineRsp.conclusions.report_time = Date.now() + ''
                }
                //resp = engineRsp
                resp.question = engineRsp.question
                resp.status = engineRsp.reply_type
                resp.answer = engineRsp.answer
                resp.severity_level = engineRsp.severity_level
                resp.answer_index = engineRsp.answer_index
                resp.conclusions = engineRsp.conclusions
            } else {
                resp.code = -1
                resp.message = engineRsp.common_rep.ret_message
                logger.error(`${loggerPrefix}|NewCovDiagnosis|common_rep|${JSON.stringify(engineRsp.common_rep)}`)
            }
            return resp
        } catch (e) {
            logger.error(`${loggerPrefix}|NewCovDiagnosis|e|code|${e.code}|message|${e.message}`)
            throw ErrorInfo(-1, e.message)
        }
    }

    // 请求前端个性化配置
    async GetPreDiagnosisConfig(loggerPrefix, header, req) {
        let resp = {}
        let config_temp = 'ncovdiagnosis'
        if (req.hospitalId) {
            config_temp = config_temp + '_' + req.hospitalId
        }
        try {
            resp.config = JSON.stringify(config[config_temp])
        } catch (e) {
            resp.config = ''
        }
        return resp
    }

}

module.exports = new PreService()
