"use strict";
/**
 * 基础类定义
 * 所有继承子类内都含有一个同名的logger
 */
const createLogger = require("../utils/log_util");
const logInstances = {};
class ExtError extends Error {
    constructor() {
        super(...arguments);
        if (arguments.length === 2) {
            this.code = arguments[0];
            this.message = arguments[1];
        } else {
            this.code = -1;
            this.message = arguments[0];
        }
    }
}
class BaseClass {
    constructor() {
        this.Error = ExtError;
        let filename = this.constructor.name;
        if (logInstances[filename] !== undefined) {
            this.logger = logInstances[filename];
        } else {
            this.logger = createLogger(filename);
        }
    }
}

module.exports = BaseClass;