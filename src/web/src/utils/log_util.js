import Vue from 'vue'
import axios from 'axios'
import uuid from 'uuid/v4'
import Cookies from 'js-cookie'

let httpUtil = null
// 默认配置项
let logOption = {
    // 当前上报的时间间隔
    delayTime: 0,
    // 最大容量
    batchMax: 10,
    // 发送失败时最大重发数量（查过数量的之前旧的会被忽略）
    retryMaxCount: 0,
    // 丢弃大于该时长的日志
    retryIgnoreTime: 0,
    // 日志的bizId
    logBizId: '',
    // 日志文件名称
    statFilename: ''
}

/** 工具方法 */
// 替换上报字段的中的竖线符号
function encodeVerticalBar (text) {
    if (typeof text === 'string') {
        return text.replace(/\|/g, '\\u007c')
    }
    return text
}
// extra数据不可控
// 如果字符串中包含|会导致日志格式错乱，这里强制使用Object，并且这里做转义
function checkExtraType (extra) {
    let _extra = extra
    if (typeof extra === 'object') {
        extra = JSON.stringify(extra)
    } else if (extra) {
        try {
            extra = JSON.parse(extra)
            if (typeof extra === 'object') {
                extra = JSON.stringify(extra)
            } else {
                // 非对象
                // eslint-disable-next-line no-throw-literal
                throw {}
            }
        } catch (e) {
            console.error(`reportStatLog error: param extra[${_extra}] must be a object`)
            extra = ''
        }
    } else {
        extra = ''
    }
    extra = encodeVerticalBar(extra)
    return extra
}

/* 默认生成当前用户的userId */
let __userId = ''
function getUserId () {
    if (__userId) return __userId

    const oldKey = '_txjk_whl_uuid_aa5df0c5'
    const newKey = '_txjk_whl_uuid_aa5wayli'

    if (Cookies.get(oldKey) && !Cookies.get(newKey)) {
        console.log('🍓 sync uuid cookie')
        Cookies.set(newKey, Cookies.get(oldKey), {
            domain: '.qq.com',
            path: '/',
            expires: 31 * 6
        })
    }

    __userId = Cookies.get(newKey) || ''
    if (!__userId) {
        __userId = uuid().replace(/-/g, '')
        Cookies.set(newKey, __userId, {
            domain: '.qq.com',
            path: '/',
            expires: 31 * 6
        })
    }
    return __userId
}

/** 日志上报 */
function reportStatLog ({ channel = '', userId = '', path = '', actionType = '', actionName = '', extra = {} }) {
    try {
        userId = userId || getUserId()
        extra = checkExtraType(extra)
        // eslint-disable-next-line no-template-curly-in-string
        const openId = window._msdk ? window._msdk.userInfo.openId : '${openId}'
        let content = [
            // eslint-disable-next-line no-template-curly-in-string
            '${time}',
            // eslint-disable-next-line no-template-curly-in-string
            '${clientIP}',
            '${IPCityCode}',
            encodeVerticalBar(window.navigator.userAgent),
            // eslint-disable-next-line no-template-curly-in-string
            getUserId(),
            channel,
            openId,
            '${userId}',
            // eslint-disable-next-line no-template-curly-in-string
            '${requestId}',
            '${traceId}',
            actionType,
            actionName,
            path,
            checkExtraType(extra),
            location.origin,
            location.pathname,
            location.search,
            location.hash
        ]
        // console.warn('log report:', content)
        batchLog({
            filename: logOption.statFilename,
            content,
            timestamp: new Date().getTime()
        })
    } catch (e) {
        console.error(e)
    }
}

/**
 * 批量上报日志
 */
// 日志计时器
let logTimer = null
// 上报失败的日志
let failureLogs = []

async function pushLog () {
    let batchLog = Vue.prototype.batchLog || []
    Vue.prototype.batchLog = []

    if (batchLog.length === 0 && failureLogs.length === 0) return
    let _failureLogs = failureLogs
    failureLogs = []
    batchLog = _failureLogs.concat(batchLog)

    const req = {
        bizId: logOption.logBizId,
        currentTimestamp: new Date().getTime(),
        logList: batchLog
    }
    // PENDING REPORT
    // try {
    //   let res = await httpUtil.post('httplog/statLog', req)
    //   if (!res) throw new Error()
    // } catch (e) {
    //   let currentTime = Date.now()
    //   let statLogs = batchLog.filter(log => {
    //     return currentTime - Number(log.timestamp) <= logOption.retryIgnoreTime * 1000
    //   })
    //   failureLogs = failureLogs.concat(statLogs)
    //   failureLogs.splice(0, failureLogs.length - logOption.retryMaxCount)
    // }
}
function batchLog (obj) {
    if (!logTimer) {
        clearInterval(logTimer)
        logTimer = setInterval(pushLog, logOption.delayTime * 1000)
    }

    if (!obj) {
        // 不传参数则直接上报现有日志
        if (Vue.prototype.batchLog) {
            pushLog()
        }
    } else {
        // 传参数则加入参数后再上报
        if (!Vue.prototype.batchLog) {
            Vue.prototype.batchLog = [obj]
        } else {
            Vue.prototype.batchLog.push(obj)
        }
        const costTime = obj.timestamp - Vue.prototype.batchLog[0].timestamp || 0
        if (Vue.prototype.batchLog.length >= logOption.batchMax || costTime > logOption.delayTime * 1000) {
            pushLog()
        }
    }
}

/** */
let currentRoute = null
let startTime = 0
let isRegisterLeave = false
let isReportCosttime = false

function onPageEnter (actionName = '') {
    isReportCosttime = false
    startTime = Date.now()
    let channel = Vue.prototype.channel
    if (!channel) {
        channel = currentRoute && currentRoute.query && currentRoute.query.channel
        Vue.prototype.channel = channel
    }
    Vue.prototype.reportStatLog({
        channel,
        path: currentRoute.path,
        actionType: 'page',
        actionName
    })
}
function onPageLease (actionName = '') {
    if (!currentRoute) return
    if (isReportCosttime) return
    isReportCosttime = true
    try {
        if (startTime > 0) {
            let channel = Vue.prototype.channel
            if (!channel) {
                channel = currentRoute && currentRoute.query && currentRoute.query.channel
                Vue.prototype.channel = channel
            }
            Vue.prototype.reportStatLog({
                channel,
                path: currentRoute.path,
                actionType: 'visittime',
                actionName,
                extra: { costtime: Date.now() - startTime }
            })
        }
    } catch (e) {
        console.error(e)
    } finally {
        setTimeout(() => {
            isReportCosttime = false
        }, 50)
    }
}

export default {
    getUserId,
    init (options = {}) {
        const config = {
            baseURL: options.baseURL,
            timeout: 10000
            // headers: {
            //   'businessid': 'tencent-health-h5',
            //   'sub-businessid': 'th-activity'
            // }
        }
        httpUtil = axios.create(config)
        logOption = Object.assign({}, logOption, options)
    },
    reportStatLog,
    mixin: {
        beforeCreate () {
            if (isRegisterLeave === true) return
            isRegisterLeave = true

            document.addEventListener('visibilitychange', function (event) {
                // console.log('visibilitychange', document.hidden, document.visibilityState, Date.now())
                // 隐藏
                if (document.hidden || document.visibilityState === 'hidden') {
                    onPageLease('visibilitychange')
                } else {
                    // 显示
                    onPageEnter('visibilitychange')
                }
            })
            window.addEventListener('beforeunload', () => {
                console.log('beforeunload', Date.now())
                onPageLease('beforeunload')
            })
            window.addEventListener('unload', () => {
                console.log('unload')
            })
        },
        beforeRouteEnter (to, from, next) {
            currentRoute = to
            onPageEnter('beforeRouteEnter')
            next()
        },
        beforeRouteUpdate (to, from, next) {
            currentRoute = to
            onPageEnter('beforeRouteUpdate')
            next()
        },
        beforeRouteLeave (to, from, next) {
            onPageLease('beforeRouteLeave')
            next()
        }
    }
}
