"use strict";
/**
 * city-data-cache
 * 分城市更新的缓存
 * 有针对重点城市的逻辑
 */
const DataDao = require("../dao/data_dao");
const { CommonConf } = require("../config").app;
const moment = require("moment");
const CityCache = require("./city-cache");

let _real = {};                  // <省名，[确诊数由多到少的城市 累计+新增信息]>  当前 累计+新增
let _cityCode2Real = {};         // <cityCode, 城市的 累计+新增信息>
let _totalHistory = {};          // <省名， [城市列表[从老到近的累计历史列表]]>
let _modifyHistory = {};         // <省名， [城市列表[从老到近的新增历史列表]]>
async function updateCityData() {
    // #lizard forgives
    let minDate = moment().subtract(CommonConf.maxHistoryDay, "days").format("YYYYMMDD");
    if (CommonConf.startDate && CommonConf.startDate > minDate) minDate = CommonConf.startDate;

    let tmpReal = {};
    let rawTotal = await DataDao.getCityTotal("CityDataCache");
    for (let o of rawTotal) {
        o.country = "China";
        o.area = o.province;
        let cityInfo = CityCache.getMapCityInfo(o.province + "_" + o.city);
        if (cityInfo) {
            o.mapCity = cityInfo.sMapCity;
            o.city = cityInfo.sCity;
            o.cityCode = cityInfo.sCityCode;
            o.provinceCode = cityInfo.sProvinceCode;
        }
        //重点地区逻辑，对应前端页面显示的">"选项
        //深圳、广州、武汉三地可查看具体信息
        //前端读取keyCity字段判断是否显示">"标志
        if (o.city == "Shenzhen" || o.city == "Guangzhou" || o.city == "Wuhan") {
            o.keyCity = 1;
        }

        o.nowConfirm = o.nowConfirm || Math.max(o.confirm - o.heal - o.dead, 0);
        o.nowConfirmDesc = o.nowConfirmDesc || o.nowConfirm.toString();
        o.modifyConfirm = 0;
        o.modifySuspect = 0;
        o.modifyDead = 0;
        o.modifyHeal = 0;
        o.modifyConfirmDesc = "--";
        o.modifySuspectDesc = "--";
        o.modifyDeadDesc = "--";
        o.modifyHealDesc = "--";

        if (!tmpReal[o.province]) tmpReal[o.province] = [];
        tmpReal[o.province].push(o);
    }

    let rawModify = await DataDao.getCityModify("CityDataCache");
    for (let o of rawModify) {
        o.country = "China";
        o.area = o.province;
        let cityInfo = CityCache.getMapCityInfo(o.province + "_" + o.city);
        if (cityInfo) {
            o.mapCity = cityInfo.sMapCity;
            o.city = cityInfo.sCity;
            o.cityCode = cityInfo.sCityCode;
            o.provinceCode = cityInfo.sProvinceCode;
        }

        if (tmpReal[o.province]) {
            for (let oc of tmpReal[o.province]) {
                if (oc.city == o.city) {
                    oc.modifyConfirm = o.confirm;
                    oc.modifySuspect = o.suspect;
                    oc.modifyDead = o.dead;
                    oc.modifyHeal = o.heal;
                    oc.import = o.import;
                    oc.modifyConfirmDesc = o.confirmDesc;
                    oc.modifySuspectDesc = o.suspectDesc;
                    oc.modifyDeadDesc = o.deadDesc;
                    oc.modifyHealDesc = o.healDesc;
                    oc.importDesc = o.importDesc;
                    oc.showAdd = o.showAdd;
                }
            }
        }
    }

    let tmpCityCode2Real = {};
    for (let ok in tmpReal) {
        for (let o of tmpReal[ok]) {
            if (o.cityCode) tmpCityCode2Real[o.cityCode] = o;
        }
    }

    let tmpTotalHistory = {};
    let rawTotalHistory = await DataDao.getCityTotalHistory("CityDataCache");
    rawTotalHistory = rawTotalHistory.filter(o => o.date >= minDate);
    for (let o of rawTotalHistory) {
        o.area = o.province;
        if (!tmpTotalHistory[o.province]) {
            tmpTotalHistory[o.province] = [{
                area: o.province,
                city: o.city,
                history: [o]
            }];
            continue;
        }
        else {
            let last = tmpTotalHistory[o.province][tmpTotalHistory[o.province].length - 1];
            if (last.city == o.city) {
                last.history.push(o);
            }
            else {
                tmpTotalHistory[o.province].push({
                    area: o.province,
                    city: o.city,
                    history: [o]
                });
            }
        }
    }

    let tmpModifyHistory = {};
    let rawModifyHistory = await DataDao.getCityModifyHistory("CityDataCache");
    rawModifyHistory = rawModifyHistory.filter(o => o.date >= minDate);
    for (let o of rawModifyHistory) {
        o.area = o.province;
        if (!tmpModifyHistory[o.province]) {
            tmpModifyHistory[o.province] = [{
                area: o.province,
                city: o.city,
                history: [o]
            }];
            continue;
        }
        else {
            let last = tmpModifyHistory[o.province][tmpModifyHistory[o.province].length - 1];
            if (last.city == o.city) {
                last.history.push(o);
            }
            else {
                tmpModifyHistory[o.province].push({
                    area: o.province,
                    city: o.city,
                    history: [o]
                });
            }
        }
    }
    // console.log(tmpReal);
    // console.log(tmpCityCode2Real);
    // console.log(tmpTotalHistory);
    // console.log(tmpModifyHistory);
    _real = tmpReal;
    _cityCode2Real = tmpCityCode2Real;
    _totalHistory = tmpTotalHistory;
    _modifyHistory = tmpModifyHistory;

}

function getReal() {
    return _real;
}

function getCityCode2Real() {
    return _cityCode2Real;
}

function getTotalHistory() {
    return _totalHistory;
}

function getModifyHistory() {
    return _modifyHistory;
}

exports.updateCityData = updateCityData;

exports.getReal = getReal;
exports.getCityCode2Real = getCityCode2Real;
exports.getTotalHistory = getTotalHistory;
exports.getModifyHistory = getModifyHistory;