"use strict";
const DataDao = require("../dao/data_dao");
/**
 * foreign-data-cache
 * 海外数据的cache方法
 */
let _real = [];             //确诊数从多到少的 国外累计+新增列表
let _summary = {};          //海外疫情总数，包括confirm累计确诊、modifyConfirm新增确诊
let _totalHistory = {};     //历史累计
let _totalCity = {};        //海外国家省州数据
let _totalCountry = {};     //各个国家的数据累计
let _summaryHistory = [];   //
async function updateForeignData() {

    let tmpTotalCountry = {};
    let tmpReal = await DataDao.getForeignReal("ForeignDataCache");
    for (let o of tmpReal) {
        tmpTotalCountry[o.country] = o;
    }
    _real = tmpReal;
    _totalCountry = tmpTotalCountry;


    let tmpSummary = await DataDao.getSummaryForign("SummaryForeignCache");
    _summary = tmpSummary || _summary;

    //console.error(`get summary: ${JSON.stringify(_summary)}`);

    let tmpTotalHistory = {};
    let rawTotalHistory = await DataDao.getForeignTotalHistory("ForeignHistoryCache");
    for (let o of rawTotalHistory) {
        if (!tmpTotalHistory[o.country]) tmpTotalHistory[o.country] = [];
        tmpTotalHistory[o.country].push(o);
    }

    _totalHistory = tmpTotalHistory;

    let tmpSummaryHistory = await DataDao.getSummaryForeignHistory("SummaryForeignHistoryCache");
    _summaryHistory = tmpSummaryHistory || _summaryHistory;

    let tmpTotalCity = {};
    let needConfirm = {};
    let rowTotalCity = await DataDao.getForeignCity("ForeignCityCache");
    for (let o of rowTotalCity) {
        if (o.city == "地区待确认") {
            needConfirm[o.country] = o;
            continue;
        }

        if (!tmpTotalCity[o.country]) {
            tmpTotalCity[o.country] = [];
        }
        tmpTotalCity[o.country].push(o);
    }

    for (let country in tmpTotalCity) {
        if (needConfirm[country] === null) continue;
        tmpTotalCity[country].push(needConfirm[country]);
    }

    _totalCity = tmpTotalCity;
    //console.error(tmpTotalCity);
}

function getReal() { return _real; }

function getSummary() { return _summary; }

function getTotalHistory() { return _totalHistory; }

function getTotalCity() { return _totalCity; }

function getDataUpdateTime() { return _summary.dataTime || ""; }

function getTotalCountry() { return _totalCountry; }

function getSummaryHistory() { return _summaryHistory; }

function getForeignTotal() {
    return {
        confirm: _summary.confirm,
        dead: _summary.dead,
        foreignTotalUpdateTime: _summary.dataTime,
        showAdd: _summary.showAdd,
        addNoShowText: _summary.addNoShowText,
        foreignTotal: {
            confirm: _summary.confirm,
            suspect: _summary.suspect,
            dead: _summary.dead,
            heal: _summary.heal,
            heavy: _summary.heavy,
            nowConfirm: _summary.nowConfirm,
            confirmDesc: _summary.confirmDesc || _summary.confirm.toString(),
            suspectDesc: _summary.suspectDesc || _summary.suspect.toString(),
            deadDesc: _summary.deadDesc || _summary.dead.toString(),
            healDesc: _summary.healDesc || _summary.heal.toString(),
            heavyDesc: _summary.heavyDesc || _summary.heavy.toString(),
            nowConfirmDesc: _summary.nowConfirmDesc || _summary.nowConfirm.toString(),
            showAdd: _summary.showAdd
        },
        foreignDayModify: {
            confirm: _summary.modifyConfirm,
            confirmDesc: _summary.modifyConfirmDesc,
            nowConfirm: _summary.modifyNowConfirm,
            nowConfirmDesc: _summary.modifyNowConfirmDesc,
            heal: _summary.modifyHeal,
            healDesc: _summary.modifyHealDesc,
            dead: _summary.modifyDead,
            deadDesc: _summary.modifyDeadDesc,
            showAdd: _summary.showAdd
        }
    };
}

exports.updateForeignData = updateForeignData;
exports.getReal = getReal;
exports.getSummary = getSummary;
exports.getTotalHistory = getTotalHistory;
exports.getTotalCity = getTotalCity;
exports.getDataUpdateTime = getDataUpdateTime;
exports.getTotalCountry = getTotalCountry;
exports.getSummaryHistory = getSummaryHistory;
exports.getForeignTotal = getForeignTotal;
