const logger = require('../util/log_util')('ncovdiagnosis')

//引擎proto地址
var PROTO_PATH = __dirname + '/covid19_engine.proto'
// grpc
var grpc = require('@grpc/grpc-js')
var protoLoader = require('@grpc/proto-loader')
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: Number,
        defaults: true,
        oneofs: true
    })
var engine_proto = grpc.loadPackageDefinition(packageDefinition).TencentJarvis.MedicalDiagnosis.nCoV.v1
// engine addr
const config = require('../config/index')

class EngineProxy {
    // 自诊AI引擎接口
    async NCovDiagnosisEngine(requestId, req) {
        logger.info(`${requestId}|NCovDiagnosisEngine|req|${JSON.stringify(req)}`)
        //  cofig.router.engine_addr 引擎ip地址, 线上部署需要自行做负载均衡
        var client = new engine_proto.nCoVDiagnosisService(config.router.engine_addr,
            grpc.credentials.createInsecure())

        // predict
        const rsp = await new Promise((resolve, reject)=>{
            client.predict(req, function(err, response) {
                if (err) {
                    logger.error(`${requestId}|NCovDiagnosisEngine|Engine return error.${err}`)
                    reject(err)
                }
                resolve(response) 
            })
        })
        logger.info(`${requestId}|NCovDiagnosisEngine|rsp|${JSON.stringify(rsp)}`)
        return rsp
    }
}

module.exports = EngineProxy

