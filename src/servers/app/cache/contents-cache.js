"use strict";
/**
 * contents-cache
 * 首页疫情新闻板块的cache
 * 根据app.hjson的CommonConf.updateInerval属性进行更新
 * 默认刷新时间300秒一次
 */
const DataDao = require("../dao/data_dao");
const { CommonConf } = require("../config").app;

let lstUpdate = 0;
let contents = {};
let locationCodeMap = {};

async function updatePneumonia() {

    lstUpdate = Date.now();

    let rawLocationCodeMapInfo = await DataDao.getLocationCodeMap();
    let tmpLocationCodeMap = {};
    for (let record of rawLocationCodeMapInfo) {
        let { locationCode, cityCode, provinceCode, area } = record;
        tmpLocationCodeMap[locationCode] = {
            locationCode,
            cityCode,
            provinceCode,
            area
        };
    }
    locationCodeMap = tmpLocationCodeMap;

    let tmpContents = {};
    let rawContents = await DataDao.getContent();
    for (let oc of rawContents) {
        if (!tmpContents[oc.type]) tmpContents[oc.type] = [];
        tmpContents[oc.type].push(oc);
    }
    contents = tmpContents;
    //console.log(tmpContents);

    lstUpdate = Date.now();

}

let loopCnt = 0;
async function timedUpdate() {

    try {
        await updatePneumonia();
    }
    catch (err) {
        if (loopCnt === 0) throw err;
    }

    loopCnt++;
    setTimeout(timedUpdate, CommonConf.updateInerval || (5 * 60 * 1000));
}

async function initUpdatePneumonia() {
    await timedUpdate();
}

function getContents(type) { return contents[type] || []; }
function getLstUpdate() { return lstUpdate; }
function getLocationCodeMap() { return locationCodeMap; }

exports.updatePneumonia = updatePneumonia;
exports.initUpdatePneumonia = initUpdatePneumonia;
exports.getContents = getContents;
exports.getLstUpdate = getLstUpdate;
exports.getLocationCodeMap = getLocationCodeMap;
