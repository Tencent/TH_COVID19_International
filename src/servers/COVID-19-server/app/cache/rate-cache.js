"use strict";
/**
 * rate-cache
 */
const DataDao = require("../dao/data_dao");

let _rate = [];
let _rateDesc = "";
async function updateRate() {
    let tmpRate = await DataDao.getRate("RateCache");
    _rate = tmpRate;
    for (let o of tmpRate) {
        if (!o.rateDesc) continue;
        _rateDesc = o.rateDesc;
        break;
    }
}

function getRate() {
    return _rate;
}

function getRateDesc() {
    return _rateDesc;
}

exports.updateRate = updateRate;
exports.getRate = getRate;
exports.getRateDesc = getRateDesc;
