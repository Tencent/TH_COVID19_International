import axios from 'axios'
import { getEnv, getQueryString } from '@/utils'
// eslint-disable-next-line camelcase
import API_Data_Static from '@/config/staticInterfaceData'
import SERVICE_PATH_MAP from './service-path-map'
import logUtil from '@/utils/log_util'
const env = getEnv()

const baseURLMap = {
    development: 'https://mitest.wecity.qq.com',
    pre: 'https://mitest.wecity.qq.com',
    production: 'https://mitest.wecity.qq.com'
}

const baseURL = baseURLMap[env]

/**
 * 需要兜底的无授权接口
 */
const CDNStaticWhiteList = ['getContents', 'getChinaTotal', 'getAreaInfo', 'getForeignInfo']

/**
 * 请求遇到403或400时需自动跳转授权的函数
 */

const httpUtils = async (func, req = {}, service = 'THPneumoniaService', context, headers) => {
    try {
        let res = await _httpUtils(func, req, service, context, headers)
        return res
    } catch (e) {
        // 单独做接口兜底策略
        if (~CDNStaticWhiteList.indexOf(func)) {
            // 该 API 在兜底白名单中
            // Step 1   TODO 使用 CDN 数据

            // Step 2 使用 本地数据
            if (API_Data_Static[func]) {
                return API_Data_Static[func]
            }
        }
        throw e
    }
}
const _httpUtils = (func, req = {}, service = 'THPneumoniaService', context = {}, headers) => {
    const config = {
        timeout: 10000,
        headers: {
            businessid: 'tencent-health-h5',
            'sub-businessid': 'th-activity'
        }
    }

    context.userId = logUtil.getUserId()
    context.channel = context.channel || getQueryString('channel') || undefined
    context = JSON.parse(JSON.stringify(context))
    const instance = axios.create({
        ...config,
        baseURL
    })

    let realService = service
    if (!service || service === 'THPneumoniaService') {
        realService = 'THPneumoniaOuterService'
    }

    const body = {
        args: { req },
        service: realService,
        func,
        context
    }

    if (['Diagnosis_NCOVQAServer_NCOVQAServant', 'DiagnosisPreServer_NCovDiagnosis'].includes(service)) {
        body.args.header = {
            requestId: Math.random()
                .toFixed(16)
                .substr(2)
        }
    }

    if (!SERVICE_PATH_MAP[service]) console.error(SERVICE_PATH_MAP[service], service, '不存在！')

    return instance
        .post(`/${SERVICE_PATH_MAP[service]}/${service}/${func}`, body, { headers })
        .then(res => res.data.args.rsp || JSON.parse(res.data.args.sRsp))
        .catch(e => {
            console.log(e, `${service}/${func}`)
        })
}

export default httpUtils
