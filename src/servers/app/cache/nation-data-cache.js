"use strict";
/**
 * nation-data-cache
 * 依赖app.hjson中的CommonConf属性
 * 需配置的字段如下：
 * maxHistoryDay
 * startDate
 */
const DataDao = require("../dao/data_dao");
const { CommonConf } = require("../config").app;
const moment = require("moment");

// 当前累计
let _totalReal = {
    confirm: 0, suspect: 0, dead: 0,
    heal: 0, showAdd: 0, dataTime: "",
    dataFrom: "", notice: "", addNoShowText: "",
    virusInfo: []
};
// 当前新增
let _modifyReal = {
    confirm: 0, suspect: 0, dead: 0,
    heal: 0, confirmDesc: "--", suspectDesc: "--",
    deadDesc: "--", healDesc: "--"
};
let _otherReal = {};             // 湖北省外的 累计与新增 描述
let _totalHistory = [];          // 历史累计
let _modifyHistory = [];         // 历史新增
async function updateNationData() {

    let minDate = moment().subtract(CommonConf.maxHistoryDay, "days").format("YYYYMMDD");
    if (CommonConf.startDate && CommonConf.startDate > minDate) minDate = CommonConf.startDate;
    let tmpTotalReal = await DataDao.getChinaTotal("NationDataCache");
    if (tmpTotalReal) tmpTotalReal.virusInfo = tmpTotalReal.virusInfo.split("|||")
        .filter(o => { if (o) return true; return false; });
    let tmpModifyReal = await DataDao.getChinaModify("NationDataCache");
    let tmpOtherReal = await DataDao.getOtherProvince("NationDataCache");
    let tmpTotalHistory = await DataDao.getChinaTotalHisotry("NationDataCache");
    tmpTotalHistory = tmpTotalHistory.filter(o => o.date >= minDate);
    let tmpModifyHistory = await DataDao.getChinaModifyHisotry("NationDataCache");
    tmpModifyHistory = tmpModifyHistory.filter(o => o.date >= minDate);
    _totalReal = tmpTotalReal || _totalReal;
    _modifyReal = tmpModifyReal || _modifyReal;
    _otherReal = tmpOtherReal || _otherReal;
    _totalHistory = tmpTotalHistory;
    _modifyHistory = tmpModifyHistory;
}

function getChinaTotal() {
    return {
        chinaTotalUpdateTime: _totalReal.dataTime || "",
        chinaTotal: _totalReal,
        virusInfo: _totalReal.virusInfo || [],
        dataFrom: _totalReal.dataFrom || "",
        chinaDayModify: _modifyReal,
        notice: _totalReal.notice || "",
        addNoShowText: _totalReal.addNoShowText || "",
        showAdd: _modifyReal.showAdd || 0,

        otherTotal: _otherReal,
        otherModify: {
            confirmDesc: _otherReal.modifyConfirmDesc || "",
            suspectDesc: _otherReal.modifySuspectDesc || "",
            deadDesc: _otherReal.modifyDeadDesc || "",
            healDesc: _otherReal.modifyHealDesc || "",
            heavyDesc: _otherReal.modifyHeavyDesc || "",
            nowConfirmDesc: _otherReal.modifyNowConfirmDesc || "",
            nowHeavyDesc: _otherReal.modifyNowHeavyDesc || "",
            showAdd: _otherReal.showAdd || 0
        },
        otherShowAdd: _otherReal.showAdd || 0,
        otherAddNoShowText: _otherReal.addNoShowText || ""
    };
}

function getTotalHistory() {
    return _totalHistory;
}

function getModifyHistory() {
    return _modifyHistory;
}

function getDataUpdateTime() {
    return _totalReal.dataTime || "";
}

function getTotalReal() {
    return _totalReal;
}

function getModifyReal() {
    return _modifyReal;
}

exports.updateNationData = updateNationData;
exports.getChinaTotal = getChinaTotal;
exports.getTotalHistory = getTotalHistory;
exports.getModifyHistory = getModifyHistory;
exports.getDataUpdateTime = getDataUpdateTime;
exports.getTotalReal = getTotalReal;
exports.getModifyReal = getModifyReal;