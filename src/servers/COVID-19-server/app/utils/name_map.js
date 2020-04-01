"use strict";
/**
 * 中文城市名到拼音/英文名的映射工具
 * 依赖pinyin_map.hjson和world_name.hjson
 * 无需映射的情况下不配置这两个配置文件即可
 */
const config = require("../config");
const nameMap = config["namemap"] || {};
const _nameMap = config["namemap_r"] || {};
const abbrMap = config["abbrmap"] || {};
const WorldNameMap = {};



for (let key in _nameMap) {
    if (nameMap[_nameMap[key]]) {
        delete nameMap[_nameMap[key]];
    }
    WorldNameMap[_nameMap[key]] = key;
}
function getAbbrName(name) {
    return abbrMap[name] || "";
}
function getNameMap(name) {
    return nameMap[name] || WorldNameMap[name] || name;
}
function replace(rows, arr) {
    for (let field of arr) {
        for (let row of rows) {
            if (row[field]) {
                try {
                    row[field] = getNameMap(row[field]);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
}
module.exports = {
    getNameMap,
    replace,
    getAbbrName
};
