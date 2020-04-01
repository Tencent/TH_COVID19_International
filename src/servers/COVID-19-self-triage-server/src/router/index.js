'use strict'
/**
 * KOA路由中间件
 */
const router = require('koa-router')()
const config = require('../config')
const handlers = require('../handler')
const logger = require('../util/log_util')('router')
router.post(`/${config.router.path || 'api'}*`, async (ctx, next) => {
    try {
        let reqBody = ctx.request.body
        let { func, service, args } = reqBody
        logger.info(`req|requestId=${ctx.requestId}|body=${JSON.stringify(reqBody)}`)
        let handler = handlers.getHandler(service)
        let { header, req } = args
        let loggerPrefix = `${ctx.requestId}|${func}`
        let result = await handler[func](loggerPrefix, header, req)
        let rsp = {
            args: { rsp: result },
            code: 0,
            msg: 'success',
            ret: 0
        }
        logger.info(`rsp|requestId=${ctx.requestId}|body=${JSON.stringify(rsp)}`)
        ctx.body = rsp
        //console.log(rsp);
    } catch (err) {
        if (err.code) {
            ctx.body = {
                args: {},
                code: err.code,
                msg: err.message,
                ret: 0
            }
        } else {
            ctx.body = {
                args: {},
                code: -1,
                msg: err.message,
                ret: 0
            }
        }
        logger.error(`err|requestId=${ctx.requestId}|code=${err.code || -1}|message=${err.message}`)
        //console.log(err);
    }
    next()
})
router.get('/*', async ctx => {
    ctx.body = 'Good luck to you ! \nThis is an API server and does not provide web services.'
})
module.exports = router
