/* eslint-disable no-unused-vars */
"use strict";
/**
 * 数据逻辑服务
 */
const BaseService = require("../base/base_service");
const config = require("../config");
const { CommonConf } = config.app;
const PageConf = config.page;
const Cache = require("../cache");
const moment = require("moment");
const nameMap = require("../utils/name_map");
class DataService extends BaseService {

    constructor(...args) {
        super(...args);
        this.conf = CommonConf;
    }

    async init() {
        await Cache.initUpdateDataCache();
    }

    async getForeignCountry(ctx, req) {
        let totalHistory = Cache.ForeignDataCache.getTotalHistory();
        let totalCity = Cache.ForeignDataCache.getTotalCity();
        let totalCountry = Cache.ForeignDataCache.getTotalCountry();

        let newDay = moment().subtract(1, "days").format("YYYY-MM-DD") + " 24:00:00";
        if (totalHistory[req.country]) {
            let index = totalHistory[req.country].length - 1;
            newDay = totalHistory[req.country][index].newDay + " 24:00:00";
        }
        // console.log(totalHistory);
        // console.log(totalCity[req.country]);
        // console.log(totalCountry);
        return {
            city: totalCity[req.country] ? totalCity[req.country].filter(city => city) : [],
            countryHistory: totalHistory[req.country] || [],
            countryInfo: totalCountry[req.country] || {},
            recentTime: Cache.ForeignDataCache.getDataUpdateTime(),
            newDay: newDay,
            isFocus: CommonConf.focusList.indexOf(req.country) != -1 ? true : false
        };
    }

    async getForeignTotal(ctx, req) {
        let data = Cache.ForeignDataCache.getForeignTotal();
        return {
            data: data
        };
    }

    async getForeignHistory(ctx, req) {
        let history = {}, summaryHistory = [];
        let totalHistory = Cache.ForeignDataCache.getTotalHistory();

        //注意日本国家名称替换了
        let focusList = config.app.CommonConf.focusList;
        focusList.forEach(country => {
            history[country] = totalHistory[country] ? totalHistory[country] : [];
        });

        summaryHistory = Cache.ForeignDataCache.getSummaryHistory() || [];

        return {
            totalHistorys: history,
            summaryHistory
        };
    }

    buildContent(oc) {
        // getContent 和 getAreaContent的共用逻辑
        return {
            id: oc.id,
            title: oc.title,
            desc: oc.text,
            from: oc.src,
            area: oc.area,
            garea: CommonConf.areaChinaList.includes(oc.area)
                ? "国内"
                : (CommonConf.areaForeignList.includes(oc.area) ? "国外" : "国内"),
            publicTime: moment(oc.publicTime).format("YYYY-MM-DD HH:mm"),
            timeShaftDesc: moment(oc.publicTime).format("YYYY-MM-DD HH:mm"),
            imgUrl: oc.imgUrl,
            jumpLink: {
                type: oc.urlType,
                url: oc.url,
                appId: oc.urlAppId,
                appVer: oc.urlAppVer
            }
        };
    }

    async getContents(ctx, req) {
        let contents = [];
        let cs = Cache.ContentCache.getContents(req.tab || "shishitongbao");
        for (let oc of cs) {
            if (req.readIds.includes(oc.id)) {
                contents = [];
                continue;
            }

            let o = this.buildContent(oc);

            contents.push(o);
        }

        contents = contents.slice(0, CommonConf.contentNumPerPage
            ? CommonConf.contentNumPerPage
            : contents.length);

        return { contents, totalCnt: cs.length };
    }

    async getAreaContents(ctx, req) {

        let locationCodeMap = Cache.ContentCache.getLocationCodeMap();

        let { reqType, tab, limit, offset, areaName, locationCode, readIds } = req;
        offset = offset || 0;
        limit = limit || 0;
        readIds = readIds || [];
        this.logger.info(`getAreaContents|req: ${JSON.stringify(req)}`);

        let contents = []; // 最终返回给前端的结果
        let finalAreaName;
        if (reqType === 1) {
            finalAreaName = locationCodeMap[locationCode]
                ? locationCodeMap[locationCode].area
                : "";
        } else {
            finalAreaName = areaName;
        }

        this.logger.info(`getAreaContents|finalAreaName: ${finalAreaName}`);

        let cs = Cache.ContentCache.getContents(tab || "shishitongbao");
        let targetAreaContents;
        if (finalAreaName) {
            // 如果finalAreaName不为''则过滤出目标省份，如果为空，则返回全部列表
            targetAreaContents = cs.filter(oc => {
                if (finalAreaName === "国内") {
                    return CommonConf.areaChinaList.includes(oc.area);
                } else if (finalAreaName === "国外") {
                    return CommonConf.areaForeignList.includes(oc.area);
                }

                return oc.area === finalAreaName;
            });
        } else {
            targetAreaContents = cs;
        }

        for (let oc of targetAreaContents) {
            if (readIds.includes(oc.id)) {
                contents = [];
                continue;
            }

            let o = this.buildContent(oc);
            contents.push(o);
        }

        if (limit !== 0) {
            // 有传limit和offset则分页
            contents = contents.slice(offset, offset + limit);
        }
        this.logger.info(`getAreaContents|contents.length: ${contents.length}`);

        return { contents, totalCnt: targetAreaContents.length };
    }

    async getChinaTotal(ctx, req) {
        return { data: Cache.NationDataCache.getChinaTotal() };
    }

    async getAreaInfo(ctx, req) {

        let chinaReal = Cache.NationDataCache.getChinaTotal();
        return {
            areaTotal: Cache.ProvinceDataCache.getReal(),
            recentTime: Cache.NationDataCache.getDataUpdateTime(),
            displayHistory: CommonConf.displayHistory,
            chinaHistoryTotal: Cache.NationDataCache.getTotalHistory(),
            dataFrom: chinaReal.dataFrom,
            notice: chinaReal.notice,
            chinaTotalUpdateTime: Cache.NationDataCache.getDataUpdateTime(),
            modifyHistoryTotal: Cache.NationDataCache.getModifyHistory()
        };
    }

    async getCityInfo(ctx, req) {

        let areaCitys = Cache.CityDataCache.getReal();
        let areas = Cache.ProvinceDataCache.getProvince2Real();
        let areasTotalHis = Cache.ProvinceDataCache.getTotalHistory();
        if (req.city) {
            req.city = nameMap.getNameMap(req.city);
            return {
                city: areaCitys[req.area].filter(cityInfo =>
                    nameMap.getNameMap(cityInfo.city) == req.city) || [],
                recentTime: Cache.NationDataCache.getDataUpdateTime(),
                areaHistory: areasTotalHis[req.area] || [],
                areaInfo: areas[req.area] || {}
            };
        }
        return {
            city: areaCitys[req.area] || [],
            recentTime: Cache.NationDataCache.getDataUpdateTime(),
            areaHistory: areasTotalHis[req.area] || [],
            areaInfo: areas[req.area] || {}
        };
    }

    async getCityInfoByCode(ctx, req) {
        let rsp = {
            areaInfo: {},
            cityInfo: {},
            recentTime: Cache.NationDataCache.getDataUpdateTime(),
            otherAreaInfo: {}
        };

        let cityCode = (Cache.CityCache.getCodeInfo(req.cityCode) || {}).cityCode || req.cityCode;

        if (Cache.CityCache.getScreen(cityCode) === 0) {
            rsp.cityInfo = Cache.CityDataCache.getCityCode2Real()[cityCode] || {};
        }

        let provinceCode = Cache.CityCache.getCityProvinceCode(cityCode);
        if (!provinceCode) return rsp;

        rsp.areaInfo = Cache.ProvinceDataCache.getProvinceCode2Real()[provinceCode] || {};
        rsp.otherAreaInfo = Cache.ProvinceDataCache.getOtherProvinceCode2Real()[provinceCode] || {};

        return rsp;
    }

    async getForeignInfo(ctx, req) {

        return {
            recentTime: Cache.NationDataCache.getDataUpdateTime(),
            foreignTotal: Cache.ForeignDataCache.getReal()
        };
    }

    async getHubeiInfo(ctx, req) {
        // 拉取湖北地区数据
        let rsp = {
            hubeiTotalHistory: Cache.ProvinceDataCache.getTotalHistory()["Hubei"] || [],
            hubeiModifyHistory: Cache.ProvinceDataCache.getModifyHistory()["Hubei"] || [],
            wuhanTotalHistory: [], wuhanModifyHistory: [],
            otherTotalHistory: Cache.ProvinceDataCache.getOtherTotalHistory()["Hubei"] || [],
            otherModifyHistory: Cache.ProvinceDataCache.getOtherModifyHistory()["Hubei"] || [],
            chinaHistoryTotal: Cache.NationDataCache.getTotalHistory(),
            chinaModifyTotal: Cache.NationDataCache.getModifyHistory(),
            hubeiRateHistory: [], wuhanRateHistory: [], chinaRateHistory: [], otherRateHistory: []
        };

        let citysTotalHisotry = Cache.CityDataCache.getTotalHistory()["Hubei"];
        if (citysTotalHisotry) {
            let wuhan = citysTotalHisotry.filter(o => o.city === "Wuhan")[0];
            if (wuhan) rsp.wuhanTotalHistory = wuhan.history;
        }

        let citysModifyHisotry = Cache.CityDataCache.getModifyHistory()["Hubei"];
        if (citysModifyHisotry) {
            let wuhan = citysModifyHisotry.filter(o => o.city === "Wuhan")[0];
            if (wuhan) rsp.wuhanModifyHistory = wuhan.history;
        }

        let calcRate = (base) => {
            const heavy = (base && base.heavy > 0 && base.confirm > 0 && base.dead > 0 && base.heal > 0)
                ? (base.heavy / (base.confirm - base.dead - base.heal))
                : 0;
            const dead = (base && base.confirm > 0 && base.dead > 0) ? (base.dead / base.confirm) : 0;
            const heal = (base && base.confirm > 0 && base.heal > 0) ? (base.heal / base.confirm) : 0;

            let valid = false;
            if (base.confirm > 0 && base.dead > 0 && base.heal > 0 && base.heavy >= 0) valid = true;
            return { date: base.date, day: base.day, heavy, dead, heal, valid };
        };
        for (let o of rsp.hubeiTotalHistory) {
            if (rsp.otherTotalHistory.length == 0) break;
            if (o.date < rsp.otherTotalHistory[0].date) continue;
            if (o.date > rsp.otherTotalHistory[rsp.otherTotalHistory.length - 1].date) break;
            rsp.hubeiRateHistory.push(calcRate(o));
        }
        for (let o of rsp.wuhanTotalHistory) {
            if (rsp.otherTotalHistory.length == 0) break;
            if (o.date < rsp.otherTotalHistory[0].date) continue;
            if (o.date > rsp.otherTotalHistory[rsp.otherTotalHistory.length - 1].date) break;
            rsp.wuhanRateHistory.push(calcRate(o));
        }
        for (let o of rsp.chinaHistoryTotal) {
            if (rsp.otherTotalHistory.length == 0) break;
            if (o.date < rsp.otherTotalHistory[0].date) continue;
            if (o.date > rsp.otherTotalHistory[rsp.otherTotalHistory.length - 1].date) break;
            rsp.chinaRateHistory.push(calcRate(o));
        }
        for (let o of rsp.otherTotalHistory) {
            rsp.otherRateHistory.push(calcRate(o));
        }

        if (rsp.otherRateHistory.length > 0) {
            if (!rsp.hubeiRateHistory[rsp.hubeiRateHistory.length - 1].valid
                || !rsp.chinaRateHistory[rsp.chinaRateHistory.length - 1].valid) {
                rsp.hubeiRateHistory = rsp.hubeiRateHistory.slice(0, rsp.hubeiRateHistory.length - 1);
                rsp.chinaRateHistory = rsp.chinaRateHistory.slice(0, rsp.chinaRateHistory.length - 1);
                rsp.otherRateHistory = rsp.otherRateHistory.slice(0, rsp.otherRateHistory.length - 1);
            }
        }

        return rsp;
    }

    async getRate(ctx, req) {

        return {
            data: Cache.RateCache.getRate(),
            desc: Cache.RateCache.getRateDesc()
        };
    }

    // async getSubscribe(ctx, req) {

    //     let subscribe = [];
    //     for (let op of req.areas) {
    //         subscribe.push({
    //             area: op,
    //             cities: Cache.CityDataCache.getReal()[op] || [],
    //             areaInfo: Cache.ProvinceDataCache.getProvince2Real()[op] || {},
    //             areaHistory: Cache.ProvinceDataCache.getTotalHistory()[op] || []
    //         });
    //     }

    //     return { subscribe };
    // }

    async getKeyCity(ctx, req) {
        // 根据城市名拉取数据
        // 要求前后端使用同一份映射
        if (req.city) {
            req.city = nameMap.getNameMap(req.city);
            return {
                cityHistory: Cache.CityDataCache.getTotalHistory()[req.area]
                    .filter(cityHistory => nameMap.getNameMap(cityHistory.city) == req.city) || [],
                cityModifyHistory: Cache.CityDataCache.getModifyHistory()[req.area]
                    .filter(cityHistory => nameMap.getNameMap(cityHistory.city) == req.city) || [],
                areaHistory: Cache.ProvinceDataCache.getTotalHistory()[req.area] || [],
                areaModifyHistory: Cache.ProvinceDataCache.getModifyHistory()[req.area] || []
            };
        }
        return {
            cityHistory: Cache.CityDataCache.getTotalHistory()[req.area] || [],
            cityModifyHistory: Cache.CityDataCache.getModifyHistory()[req.area] || [],
            areaHistory: Cache.ProvinceDataCache.getTotalHistory()[req.area] || [],
            areaModifyHistory: Cache.ProvinceDataCache.getModifyHistory()[req.area] || []
        };
    }

    async getInfoBatch(ctx, req) {
        let rsp = {};

        for (let fn in req.batchReq) {
            let strArg = req.batchReq[fn];
            let arg = {};
            if (strArg !== "") {
                try {
                    arg = JSON.parse(strArg);
                } catch (err) {
                    this.logger.error(`getInfoBatch parse arg failed arg: ${strArg} err: ${err}`);
                }
            }
            let fRsp = {};
            try {
                fRsp = await this[fn](ctx, arg);
                fRsp.code = 0;
                fRsp.message = "success";
                rsp[fn] = JSON.stringify(fRsp);
            } catch (err) {
                fRsp.code = err.code || -1;
                fRsp.message = err.message;
                rsp[fn] = JSON.stringify(fRsp);
            }
        }

        return { batchRsp: rsp };
    }


    async getAllProvinceInfo(ctx, req) {

        let mapReal = {};
        let arrReal = Cache.ProvinceDataCache.getReal();
        for (let o of arrReal) mapReal[o.province || ""] = o;
        return {
            recentTime: Cache.NationDataCache.getDataUpdateTime(),
            realDatas: mapReal,
            totalHistorys: Cache.ProvinceDataCache.getTotalHistory(),
            modifyHistorys: (req.needModifyHistory && CommonConf.provinceReturnModifyHistory)
                ? Cache.ProvinceDataCache.getModifyHistory()
                : {}
        };
    }
    /**
     * @function getCfg
     * @param {Object} ctx 
     * @param {Object} req 
     * @description 配置接口
     * 前端如果需要定制配置需求可重写该方法
     * 目前会直接返回page.hjson中的内容
     */
    async getCfg(ctx, req) {

        let rsp = {
            cfgTag: 0,
            strCfg: JSON.stringify(PageConf || {}),
            abTest: "",
            code: 0,
            message: "SUCCESS"
        };
        return rsp;
    }
}

module.exports = new DataService();
