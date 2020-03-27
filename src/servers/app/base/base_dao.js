"use strict";
/**
 * 数据库基础类
 */
const BaseClass = require("./base_class");
class BaseDao extends BaseClass {
    constructor() {
        super(...arguments);
    }
}

module.exports = BaseDao;