const Koa = require('koa')
const app = module.exports = new Koa()
const logger = require('./util/log_util')('Web')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const serve = require('koa-static')

// body parser
app.use(bodyparser({jsonLimit: '300mb'}))

// serve static
let staticPath = path.join(__dirname, '..', 'dist', 'public')
logger.info(staticPath)
app.use(serve(staticPath))

// routes
const router = require('./router')
// cors
const cors = require('koa2-cors')
app.use(cors({
    origin: function () {
        return '*'
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS']
}))
app.use(router.routes())

// error event listening
app.on('error', (err, ctx) => {
    logger.error(`Web|server error: ${err}`)
})

// start the server
const port = process.env.PORT || 3000
const ip =  process.env.IP || '127.0.0.1'
app.listen(port, ip)
logger.info(`Web|server listening on port: ${port}, ip: ${ip}`)
