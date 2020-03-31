"use strict";
const BaseHandler = require("../base/base_handler");
const DataService = require("../service/data_service");


class DataHandler extends BaseHandler {

    constructor(...args) {
        super(...args);
        DataService.init();
    }
    /**
     * @function getForeignCountry
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 按国家拉取海外疫情数据
     * @return {Object}
     */
    async getForeignCountry(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getForeignCountry(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getForeignTotal
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 拉取海外疫情合计数据
     * @return {Object}
     */
    async getForeignTotal(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getForeignTotal(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getForeignHistory
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 拉取海外疫情历史
     * @return {Object}
     */
    async getForeignHistory(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getForeignHistory(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getContents
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 拉取最新通报 不分地区
     * @return {Object}
     */
    async getContents(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getContents(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getAreaContents
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 按地区拉取通报
     * @return {Object}
     */
    async getAreaContents(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getAreaContents(ctx, req);
        return Object.assign(rsp, result);
    }
    // /**
    //  * @function getBaike
    //  * @param {koaContext} ctx 
    //  * @param {Object} req 
    //  * @description 百科接口
    //  * @return {Object}
    //  */
    // async getBaike(ctx, req) {
    //     const rsp = {};
    //     rsp.code = 0;
    //     rsp.message = "SUCCESS";
    //     const result = await DataService.getBaike(ctx, req);
    //     return Object.assign(rsp, result);
    // }
    async getMapIll(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getMapIll(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getChinaTotal
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 获取中国地区统计数据
     * @return {Object}
     */
    async getChinaTotal(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getChinaTotal(ctx, req);
        return Object.assign(rsp, result);

    }
    /**
     * @function getAreaInfo
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 按地区（省份）拉取疫情数据
     * @return {Object}
     */
    async getAreaInfo(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getAreaInfo(ctx, req);
        return Object.assign(rsp, result);

    }
    /**
     * @function getCityInfo
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 按城市名拉取疫情数据
     * @return {Object}
     */
    async getCityInfo(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getCityInfo(ctx, req);
        return Object.assign(rsp, result);

    }
    /**
     * @function getCityInfoByCode
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 按cityCode拉取疫情数据
     * @return {Object}
     */
    async getCityInfoByCode(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getCityInfoByCode(ctx, req);
        return Object.assign(rsp, result);

    }
    /**
     * @function getForeignInfo
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 海外疫情实时数据
     * @return {Object}
     */
    async getForeignInfo(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getForeignInfo(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getHubeiInfo
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 湖北实时数据
     * @return {Object}
     */
    async getHubeiInfo(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getHubeiInfo(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getRate
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 各地数据增长率
     * @return {Object}
     */
    async getRate(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getRate(ctx, req);
        return Object.assign(rsp, result);
    }

    /**
     * @function getKeyCity
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 按城市名拉取历史数据
     * @return {Object}
     */
    async getKeyCity(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getKeyCity(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getInfoBatch
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 批量调用接口
     * @return {Object}
     */
    async getInfoBatch(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getInfoBatch(ctx, req);
        return Object.assign(rsp, result);

    }

    async getModifyTrend(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getModifyTrend(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getAllProvinceInfo
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 拉取全部省份的疫情信息
     * @return {Object}
     */
    async getAllProvinceInfo(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getAllProvinceInfo(ctx, req);
        return Object.assign(rsp, result);
    }
    /**
     * @function getCfg
     * @param {koaContext} ctx 
     * @param {Object} req 
     * @description 配置下发接口
     * @return {Object}
     */
    async getCfg(ctx, req) {
        const rsp = {};
        rsp.code = 0;
        rsp.message = "SUCCESS";
        const result = await DataService.getCfg(ctx, req);
        return Object.assign(rsp, result);
    }
}

module.exports = new DataHandler();
