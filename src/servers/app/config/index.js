"use strict";
/**
 * 配置组件
 * 需要在服务启动时调用init方法
 * 新增配置需要在本文件进行添加
 */
const hjson = require("hjson");
const path = require("path");
const fs = require("fs");
const BaseClass = require("../base/base_class");
let cfgPath = __dirname;
if (process.env.NODE_ENV || process.env.DOCKER_ENV) {
    cfgPath = path.join(__dirname, "../../config/formal");
} else {
    cfgPath = path.join(__dirname, "../../config/test");
}
class ConfigLoader extends BaseClass {
    constructor() {
        super(...arguments);
    }
    async add(filename) {
        let name = filename.slice(0, filename.lastIndexOf("."));
        let text = fs.readFileSync(path.join(cfgPath, filename), "utf8");
        module.exports[name] = await hjson.parse(text);
        this.logger.info(`configName ${filename} load success|context=${JSON.stringify(module.exports[name])}`);
    }
}

async function init() {
    let configLoader = new ConfigLoader();
    await configLoader.add("app.hjson");
    await configLoader.add("db.hjson");
    await configLoader.add("page.hjson");
    await configLoader.add("namemap_r.hjson");
    await configLoader.add("namemap.hjson");
    await configLoader.add("abbrmap.hjson");
}
module.exports = {
    init
};