"use strict";
/**
 * Cache服务总入口
 * 加载所有的cache组件并执行init操作
 * 新增cache时需要在本文件中追加内容
 */
const { updateInerval } = require("../config").app;
const CityCache = require("./city-cache");
const CityDataCache = require("./city-data-cache");
const ForeignDataCache = require("./foreign-data-cache");
const NationDataCache = require("./nation-data-cache");
const ProvinceDataCache = require("./province-data-cache");
const RateCache = require("./rate-cache");
const ContentCache = require("./contents-cache");
const CacheLogger = require("../utils/log_util")("cache");
async function updateDataCache() {
    let tasks = [];
    tasks.push(CityCache.updateCity);
    tasks.push(NationDataCache.updateNationData);
    tasks.push(ForeignDataCache.updateForeignData);
    tasks.push(ProvinceDataCache.updateProvinceData);
    tasks.push(CityDataCache.updateCityData);
    tasks.push(RateCache.updateRate);
    tasks.push(ContentCache.updatePneumonia);
    for (let task of tasks) {
        try {
            await task();
        } catch (err) {
            CacheLogger.error(err);
        }
    }
    CacheLogger.info("update cache successful.");
}
let loopCnt = 0;
async function timedUpdate() {
    try {
        await updateDataCache();
    }
    catch (err) {
        //console.error(err);
        if (loopCnt === 0) throw err;
    }
    loopCnt++;
    setTimeout(timedUpdate, updateInerval || 10 * 60 * 1000);
}
async function initUpdateDataCache() {
    await timedUpdate();
}
exports.updateDataCache = updateDataCache;
exports.initUpdateDataCache = initUpdateDataCache;
exports.CityCache = CityCache;
exports.CityDataCache = CityDataCache;
exports.ForeignDataCache = ForeignDataCache;
exports.NationDataCache = NationDataCache;
exports.ProvinceDataCache = ProvinceDataCache;
exports.RateCache = RateCache;
exports.ContentCache = ContentCache;
