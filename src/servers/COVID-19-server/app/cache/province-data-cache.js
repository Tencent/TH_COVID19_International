"use strict";
const DataDao = require("../dao/data_dao");
const { CommonConf } = require("../config").app;
const moment = require("moment");
const CityCache = require("./city-cache");

const NationDataCache = require("./nation-data-cache");

let _real = [];                          // 当前确诊数由多到少的 省份列表信息
let _provinceCode2Real = {};             // <省份Code， 省份当前累计+新增>
let _province2Real = {};                 // <省份名，省份当前累计+新增>
let _otherProvinceCode2Real = {};        // <省份Code，, 本省以外的当前累计+新增>  目前只有湖北省有数据
let _otherProvince2Real = {};            // <省份名， 本省以外的当前累计+新增>  目前只有湖北省有数据
let _totalHistory = {};                  // <省份名, 由老到近的历史累计>
let _modifyHistory = {};                 // <省份名, 由老到近的历史新增>
let _otherTotalHistory = {};             // <省份名, 本省外由老到近的历史累计>
let _otherModifyHistory = {};            // <省份名, 本省外由老到近的历史新增>

function calcOther(n, p) {
    if (n === CommonConf.noDataVal) return CommonConf.noDataVal;
    if (p === CommonConf.noDataVal) return CommonConf.noDataVal;

    if (n > p) return n - p;
    return 0;
}

async function updateProvinceData() {
    // #lizard forgives
    let minDate = moment().subtract(CommonConf.maxHistoryDay, "days").format("YYYYMMDD");
    if (CommonConf.startDate && CommonConf.startDate > minDate) minDate = CommonConf.startDate;

    let tmpProvinceCode2Real = {};
    let tmpProvince2Real = {};
    let tmpReal = await DataDao.getProvinceReal("ProvinceDataCache");
    for (let o of tmpReal) {

        o.nowConfirm = o.nowConfirm || Math.max(o.confirm - o.heal - o.dead, 0);
        o.nowConfirmDesc = o.nowConfirmDesc || o.nowConfirm.toString();

        o.modifyConfirmDesc = o.modifyConfirmDesc || o.modifyConfirm.toString();
        o.modifySuspectDesc = o.modifySuspectDesc || o.modifySuspect.toString();
        o.modifyDeadDesc = o.modifyDeadDesc || o.modifyDead.toString();
        o.modifyHealDesc = o.modifyHealDesc || o.modifyHeal.toString();

        o.country = "China";
        o.area = o.province;
        o.cityinfo = 1;
        if (o.province == "Hubei" || o.province == "Guangdong") {
            o.keyCity = 1;
        }

        let provinceCode = CityCache.getProvinceCode(o.province);
        if (provinceCode) {
            o.provinceCode = provinceCode;
            tmpProvinceCode2Real[provinceCode] = o;
        }

        if (o.province) tmpProvince2Real[o.province] = o;
    }

    let tmpOtherProvinceCode2Real = {};
    let tmpOtherProvince2Real = {};
    let nationTotalReal = NationDataCache.getTotalReal();
    let nationModifyReal = NationDataCache.getModifyReal();
    for (let o of tmpReal) {
        let ot = {
            country: o.country,
            area: o.area,

            confirm: nationTotalReal.confirm > o.confirm ? nationTotalReal.confirm - o.confirm : 0,
            suspect: nationTotalReal.suspect > o.suspect ? nationTotalReal.suspect - o.suspect : 0,
            dead: nationTotalReal.dead > o.dead ? nationTotalReal.dead - o.dead : 0,
            heal: nationTotalReal.heal > o.heal ? nationTotalReal.heal - o.heal : 0,

            modifyConfirm: nationModifyReal.confirm > o.modifyConfirm
                ? nationModifyReal.confirm - o.modifyConfirm
                : 0,
            modifySuspect: nationModifyReal.suspect > o.modifySuspect
                ? nationModifyReal.suspect - o.modifySuspect
                : 0,
            modifyDead: nationModifyReal.dead > o.modifyDead
                ? nationModifyReal.dead - o.modifyDead
                : 0,
            modifyHeal: nationModifyReal.heal > o.modifyHeal
                ? nationModifyReal.heal - o.modifyHeal
                : 0
        };

        ot.nowConfirm = Math.max(ot.confirm - ot.heal - ot.dead, 0);

        if (o.provinceCode) tmpOtherProvinceCode2Real[o.provinceCode] = ot;
        if (o.province) tmpOtherProvince2Real[o.province] = ot;
    }

    let tmpTotalHistory = {};
    let rawTotalHistory = await DataDao.getProvinceTotalHistory("ProvinceDataCache");
    rawTotalHistory = rawTotalHistory.filter(o => o.date >= minDate);
    for (let o of rawTotalHistory) {
        if (!tmpTotalHistory[o.province]) tmpTotalHistory[o.province] = [];
        tmpTotalHistory[o.province].push(o);
    }

    let tmpModifyHistory = {};
    let rawModifyHistory = await DataDao.getProvinceModifyHistory("ProvinceDataCache");
    rawModifyHistory = rawModifyHistory.filter(o => o.date >= minDate);
    for (let o of rawModifyHistory) {
        if (!tmpModifyHistory[o.province]) tmpModifyHistory[o.province] = [];
        tmpModifyHistory[o.province].push(o);
    }

    let tmpOtherTotalHistory = {};
    let nationTotalHistory = NationDataCache.getTotalHistory();
    for (let op in tmpTotalHistory) {
        if (op != "Hubei") continue;
        for (let oph of tmpTotalHistory[op]) {
            for (let onh of nationTotalHistory) {
                if (oph.day === onh.day) {
                    if (!tmpOtherTotalHistory[op]) tmpOtherTotalHistory[op] = [];
                    tmpOtherTotalHistory[op].push({
                        day: oph.day,
                        date: oph.date,
                        confirm: calcOther(onh.confirm, oph.confirm),
                        suspect: calcOther(onh.suspect, oph.suspect),
                        dead: calcOther(onh.dead, oph.dead),
                        heal: calcOther(onh.heal, oph.heal),
                        heavy: calcOther(onh.heavy, oph.heavy),
                    });
                }
            }
        }
    }

    let tmpOtherModifyHistory = {};
    let nationModifyHistory = NationDataCache.getModifyHistory();
    for (let op in tmpModifyHistory) {
        if (op != "Hubei") continue;
        for (let oph of tmpModifyHistory[op]) {
            for (let onh of nationModifyHistory) {
                if (oph.day === onh.day) {
                    if (!tmpOtherModifyHistory[op]) tmpOtherModifyHistory[op] = [];
                    tmpOtherModifyHistory[op].push({
                        day: oph.day,
                        date: oph.date,
                        confirm: calcOther(onh.confirm, oph.confirm),
                        suspect: calcOther(onh.suspect, oph.suspect),
                        dead: calcOther(onh.dead, oph.dead),
                        heal: calcOther(onh.heal, oph.heal),
                        heavy: calcOther(onh.heavy, oph.heavy),
                    });
                }
            }
        }
    }
    // console.log(tmpReal);
    // console.log(tmpProvinceCode2Real);
    // console.log(tmpProvince2Real);
    // console.log(tmpOtherProvinceCode2Real);
    // console.log(tmpOtherProvince2Real);
    // console.log(tmpTotalHistory);
    // console.log(tmpOtherTotalHistory);
    // console.log(tmpOtherModifyHistory);
    _real = tmpReal;
    _provinceCode2Real = tmpProvinceCode2Real;
    _province2Real = tmpProvince2Real;
    _otherProvinceCode2Real = tmpOtherProvinceCode2Real;
    _otherProvince2Real = tmpOtherProvince2Real;
    _totalHistory = tmpTotalHistory;
    _modifyHistory = tmpModifyHistory;
    _otherTotalHistory = tmpOtherTotalHistory;
    _otherModifyHistory = tmpOtherModifyHistory;
    
}

function getReal() {
    return _real;
}

function getProvinceCode2Real() {
    return _provinceCode2Real;
}

function getProvince2Real() {
    return _province2Real;
}

function getOtherProvinceCode2Real() {
    return _otherProvinceCode2Real;
}

function getOtherProvince2Real() {
    return _otherProvince2Real;
}

function getTotalHistory() {
    return _totalHistory;
}

function getModifyHistory() {
    return _modifyHistory;
}

function getOtherTotalHistory() {
    return _otherTotalHistory;
}

function getOtherModifyHistory() {
    return _otherModifyHistory;
}

exports.updateProvinceData = updateProvinceData;
exports.getReal = getReal;
exports.getProvinceCode2Real = getProvinceCode2Real;
exports.getProvince2Real = getProvince2Real;
exports.getOtherProvinceCode2Real = getOtherProvinceCode2Real;
exports.getOtherProvince2Real = getOtherProvince2Real;
exports.getTotalHistory = getTotalHistory;
exports.getModifyHistory = getModifyHistory;
exports.getOtherTotalHistory = getOtherTotalHistory;
exports.getOtherModifyHistory = getOtherModifyHistory;