"use strict";
/**
 * 日志工具
 * 基于Winston封装，打印name_YYYYMMDD格式的按天日志
 * 日志分为info/debug/warn/error四个等级
 */
const { createLogger, format, transports } = require("winston");
const callsite = require("callsite");                   //用于行号打印，可关闭
const path = require("path");
const logPath = process.env.LOG_PATH || "./app_log/";   //通过环境变量配置日志路径，默认在运行目录下新建app_log文件夹
const moment = require("moment");
function lineno() {
    let stack = callsite()[3];
    return `${path.basename(stack.getFileName())}:${stack.getLineNumber()}`;
}
class logger {
    constructor(name) {
        this.name = name;
        this.options = {};
        this.date = moment().format("YYYYMMDD");
        this._initCommon(name);
    }
    _dateUpdate() {
        let nowDate = moment().format("YYYYMMDD");
        if (this.date != nowDate) {
            this.date = nowDate;
            this._initCommon(this.name);
        }
    }
    _initCommon(name) {
        this._commonLogger = createLogger({
            format: format.combine(
                format.errors({ stack: false }),
                format.simple(),
                format.colorize()
            ),
            transports: [
                new transports.File({
                    filename: path.join(logPath, `${name}_${this.date}.log`),
                    level: "info"
                }),
                new transports.File({
                    filename: path.join(logPath, `${name}_error_${this.date}.log`),
                    level: "error"
                }),
                new transports.File({
                    filename: path.join(logPath, "debug.log"),
                    level: "debug",
                    maxsize: 1024 * 1024 * 10
                })
            ]
        });
        /*本地调试部署情况下打印到命令行*/
        if (process.env.NODE_ENV !== "formal") {
            this._commonLogger.add(new transports.Console({
                format: format.combine(
                    format.errors({ stack: false }),
                    format.simple()
                ),
            }));
        }
    }
    _log(level, args) {
        this._dateUpdate();
        if (args.length === 0) {
            return false;
        }
        let argsStr = [
            moment().format("YYYY-MM-DD HH:mm:ss"), //时间
            lineno(),                               //行号
            level.toUpperCase(),                    //日志等级
            process.pid,                            //进程ID
            ...args]                                //参数
            .join("|");                             //以上数据以"|"分割
        this._commonLogger[level](argsStr);
    }
    _buildArgs() {
        let argsLen = arguments.length;
        let args = new Array(argsLen);
        for (var i = 0; i < argsLen; i += 1) {
            args[i] = arguments[i];
        }
        return args;
    }
    info() {
        this._log("info", this._buildArgs(...arguments));
    }
    debug() {
        this._log("debug", this._buildArgs(...arguments));
    }
    warn() {
        this._log("warn", this._buildArgs(...arguments));
    }
    error() {
        this._log("error", this._buildArgs(...arguments));
    }


}
const logInstances = {};
module.exports = (name) => {
    if (!logInstances[name]) {
        logInstances[name] = new logger(name);
    }
    return logInstances[name];
};