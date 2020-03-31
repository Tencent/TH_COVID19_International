"use strict";
/**
 * 数据DAO层
 */
const dbUtil = require("../utils/mysql_util");
const BaseDao = require("../base/base_dao");
const dbConf = require("../config").db;
const moment = require("moment");
const nameMapUtil = require("../utils/name_map");
class DataDao extends BaseDao {

    constructor(...args) {
        super(...args);
        this.dbOuterData = dbUtil.getPool(dbConf);
    }
    /**
     * @function getContent
     * @return {Array}
     */
    async getContent() {

        const sql = `
        select 
            id as id, 
            ctype as type, 
            area as area, 
            public_time as publicTime, 
            src as src, 
            title as title, 
            text as text, 
            img_url as imgUrl, 
            url as url, 
            url_type as urlType, 
            url_appid as urlAppId, 
            url_appver as urlAppVer, 
            priority as priority 
        from t_content 
            where status = 1 order by ctype ASC, priority DESC, publicTime DESC`;
        const contentData = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(contentData, ["area"]);
        return contentData;
    }
    /**
     * @function getLocationCodeMap
     * @return {Array}
     */
    async getLocationCodeMap() {
        const sql = `
        select 
            f_code as locationCode, 
            f_city_code as cityCode, 
            f_province_code as provinceCode, 
            f_area as area 
        from t_city_code`;
        const locationCodeMapData = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(locationCodeMapData, ["area"]);
        return locationCodeMapData;
    }
    /**
     * @function getCityMap
     * @return {Array}
     */
    async getCityMap() {

        const sql = `
        select f_area as province, 
            f_city as city, f_city_1 as city1, 
            f_city_2 as city2, 
            f_city_3 as city3, 
            f_city_4 as city4, 
            f_city_5 as city5, 
            f_city_6 as city6, 
            f_city_code as cityCode, 
            f_province_code as provinceCode, 
            f_screen as screen 
        from t_city_map`;
        const cityMapData = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(cityMapData,
            ["province", "city", "city1", "city2", "city3", "city4", "city5", "city6"]);
        return cityMapData;
    }
    /**
     * @function getCityCode
     * @return {Array}
     */
    async getCityCode() {

        const sql = `
        select 
            f_code as code,
            f_city_code as cityCode,
            f_province_code as provinceCode 
        from t_city_code`;
        const cityCodeData = await dbUtil.query(sql, [], dbConf);

        return cityCodeData;
    }
    /**
     * @function getChinaTotal
     * @return {Array}
     */
    async getChinaTotal() {

        const sql = `
        select 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_now_confirm as nowConfirm, 
            f_now_heavy as nowHeavy, 
            f_now_confirm_desc as nowConfirmDesc, 
            f_now_heavy_desc as nowHeavyDesc, 
            f_is_show_add as showAdd, 
            f_data_time as dataTime, 
            f_data_from as dataFrom, 
            f_notice as notice, 
            f_add_no_show_text as addNoShowText, 
            f_import as import, 
            f_import_desc as importDesc, 
            f_virus_info as virusInfo 
        from t_summery_china`;
        const chinaTotalData = await dbUtil.query(sql, [], dbConf);

        for (let o of chinaTotalData) {
            for (let attr of ["confirm", "suspect", "dead",
                "heal", "nowConfirm", "nowHeavy",
                "showAdd", "import"])
                o[attr] = o[attr] || 0;
            for (let attr of ["nowConfirmDesc", "nowHeavyDesc", "dataTime",
                "addNoShowText", "notice", "importDesc"])
                o[attr] = o[attr] || "";
        }

        if (chinaTotalData.length == 0) return null;
        return chinaTotalData[0];
    }
    /**
     * @function getChinaModify
     * @return {Array}
     */
    async getChinaModify() {

        const sql = `
        select
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_is_updated as showAdd, 
            f_confirm_desc as confirmDesc, 
            f_suspect_desc as suspectDesc,
            f_dead_desc as deadDesc, 
            f_heal_desc as healDesc, 
            f_now_confirm as nowConfirm, 
            f_now_heavy as nowHeavy, 
            f_now_confirm_desc as nowConfirmDesc, 
            f_now_heavy_desc as nowHeavyDesc, 
            f_import as import, 
            f_import_desc as importDesc 
        from t_city_modify 
        where f_country = '中国' and (f_area = '' or f_area is NULL) and (f_city = '' or f_city is NULL)`;
        const chinaModifyData = await dbUtil.query(sql, [], dbConf);
        let filter1 = ["confirm", "suspect", "dead", "heal",
            "showAdd", "nowConfirm", "nowHeavy", "import"];
        let filter2 = ["confirmDesc", "suspectDesc", "deadDesc",
            "healDesc", "nowConfirmDesc", "nowHeavyDesc", "importDesc"];
        for (let o of chinaModifyData) {
            for (let attr of filter1)
                o[attr] = o[attr] || 0;
            for (let attr of filter2)
                o[attr] = o[attr] || "";
        }

        if (chinaModifyData.length == 0) return null;
        return chinaModifyData[0];
    }
    /**
     * @function getOtherProvince
     * @return {Array}
     */
    async getOtherProvince() {

        const sql = `
        select f_confirm_desc as confirmDesc, 
            f_suspect_desc as suspectDesc, f_dead_desc as deadDesc, 
            f_heal_desc as healDesc, 
            f_heavy_desc as heavyDesc, 
            f_now_confirm_desc as nowConfirmDesc,
            f_now_heavy_desc as nowHeavyDesc, 
            f_confirm_add_desc as modifyConfirmDesc, 
            f_suspect_add_desc as modifySuspectDesc, 
            f_dead_add_desc as modifyDeadDesc, 
            f_heal_add_desc as modifyHealDesc, 
            f_heavy_add_desc as modifyHeavyDesc, 
            f_now_confirm_add_desc as modifyNowConfirmDesc, 
            f_now_heavy_add_desc as modifyNowHeavyDesc, 
            f_is_show_add as showAdd, 
            f_add_no_show_text as addNoShowText 
        from t_base_data 
        where f_base = 'not_hubei'`;
        const otherProvinceData = await dbUtil.query(sql, [], dbConf);

        for (let o of otherProvinceData) {
            for (let attr of ["showAdd"])
                o[attr] = o[attr] || 0;
            for (let attr of ["confirmDesc", "suspectDesc", "deadDesc",
                "healDesc", "heavyDesc", "nowConfirmDesc",
                "nowHeavyDesc", "modifyConfirmDesc", "modifySuspectDesc",
                "modifyDeadDesc", "modifyHealDesc", "modifyHeavyDesc",
                "modifyNowConfirmDesc", "modifyNowHeavyDesc", "addNoShowText"])
                o[attr] = o[attr] || "";
        }

        if (otherProvinceData.length == 0) return null;
        return otherProvinceData[0];
    }
    /**
     * @function getChinaTotalHisotry
     * @return {Array}
     */
    async getChinaTotalHisotry() {

        const sql = `
        select 
            f_confirm as confirm, 
            f_suspect as suspect,
            f_dead as dead, 
            f_heal as heal, 
            f_heavy as heavy,
            f_date as date 
        from t_total_history order by date ASC`;
        const chinaTotalHistoryData = await dbUtil.query(sql, [], dbConf);

        for (let o of chinaTotalHistoryData) {
            for (let attr of ["confirm", "suspect", "dead", "heal", "showAdd", "heavy"])
                o[attr] = o[attr] || 0;
            for (let attr of ["date"])
                o[attr] = o[attr] || "";
            o.day = o.date;
            o.date = "2020" + o.day.substr(0, 2) + o.day.substr(3, 2);
        }

        return chinaTotalHistoryData;
    }
    /**
     * @function getChinaModifyHisotry
     * @return {Array}
     */
    async getChinaModifyHisotry() {

        const sql = `
        select 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_heavy as heavy, 
            f_date as date 
        from t_total_add_history order by date ASC`;
        const modifyHistory = await dbUtil.query(sql, [], dbConf);

        for (let o of modifyHistory) {
            for (let attr of ["confirm", "suspect", "dead", "heal", "showAdd", "heavy"])
                o[attr] = o[attr] || 0;
            for (let attr of ["date"]) o[attr] = o[attr] || "";
            o.day = o.date;
            o.date = "2020" + o.day.substr(0, 2) + o.day.substr(3, 2);
        }

        return modifyHistory;
    }
    /**
     * @function getProvinceReal
     * @return {Array}
     */
    async getProvinceReal() {

        const sql = `
        select 
            f_area as province, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_confirm_add as modifyConfirm, 
            f_suspect_add as modifySuspect, 
            f_dead_add as modifyDead, 
            f_heal_add as modifyHeal, 
            f_confirm_add_desc as modifyConfirmDesc, 
            f_is_updated as showAdd, 
            f_is_show_heal as showHeal 
        from t_area order by confirm DESC`;
        const provinceReal = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(provinceReal, ["province"]);
        for (let o of provinceReal) {
            for (let attr of ["confirm", "suspect", "dead",
                "heal", "modifyConfirm", "modifySuspect",
                "modifyDead", "modifyHeal", "showAdd",
                "showHeal"])
                o[attr] = o[attr] || 0;
            for (let attr of ["province", "modifyConfirmDesc"])
                o[attr] = o[attr] || "";
        }

        return provinceReal;
    }
    /**
     * @function getProvinceTotalHistory
     * @return {Array}
     */
    async getProvinceTotalHistory() {

        const sql = `
        select 
            f_area as province, 
            f_date as date, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_heavy as heavy 
        from t_area_history order by province ASC, date ASC`;
        const provinceTotalHistory = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(provinceTotalHistory, ["province"]);
        for (let o of provinceTotalHistory) {
            for (let attr of ["confirm", "suspect", "dead", "heal", "heavy"])
                o[attr] = o[attr] || 0;
            for (let attr of ["province", "date"])
                o[attr] = o[attr] || "";
            o.day = o.date.substr(4, 2) + "." + o.date.substr(6, 2);
        }

        return provinceTotalHistory;
    }
    /**
     * @function getProvinceModifyHistory
     * @return {Array}
     */
    async getProvinceModifyHistory() {

        const sql = `
        select 
            f_area as province, 
            f_date as date, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_heavy as heavy 
        from t_area_add_history order by province ASC, date ASC`;
        const provinceModifyHistory = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(provinceModifyHistory, ["province"]);
        for (let o of provinceModifyHistory) {
            for (let attr of ["confirm", "suspect", "dead", "heal", "heavy"])
                o[attr] = o[attr] || 0;
            for (let attr of ["province", "date"])
                o[attr] = o[attr] || "";
            o.day = o.date.substr(4, 2) + "." + o.date.substr(6, 2);
        }

        return provinceModifyHistory;
    }
    /**
     * @function getCityTotal
     * @return {Array}
     */
    async getCityTotal() {

        const sql = `
        select f_country as country, 
            f_area as province, 
            f_city as city, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, f_heal as heal,
            f_is_show_heal as showHeal 
        from t_city where f_country = '中国' order by country ASC, province ASC, confirm DESC`;
        const cityTotal = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(cityTotal, ["country", "province", "city"]);
        for (let o of cityTotal) {
            for (let attr of ["confirm", "suspect", "dead", "heal", "showHeal"])
                o[attr] = o[attr] || 0;
            for (let attr of ["country", "province", "city"])
                o[attr] = o[attr] || "";
        }

        return cityTotal;
    }
    /**
     * @function getCityModify
     * @return {Array}
     */
    async getCityModify() {

        const sql = `
        select 
            f_country as country, 
            f_area as province, 
            f_city as city, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead,
            f_heal as heal, 
            f_confirm_desc as confirmDesc, 
            f_suspect_desc as suspectDesc, 
            f_dead_desc as deadDesc, 
            f_heal_desc as healDesc, 
            f_now_confirm as nowConfirm, 
            f_now_heavy as nowHeavy, 
            f_now_confirm_desc as nowConfirmDesc, 
            f_now_heavy_desc as nowHeavyDesc, 
            f_import as import, 
            f_import_desc as importDesc, 
            f_is_updated as showAdd 
        from t_city_modify 
        where f_country = '中国' order by country ASC, province ASC, confirm DESC`;
        const cityModify = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(cityModify, ["country", "province", "city"]);
        for (let o of cityModify) {
            for (let attr of ["confirm", "suspect", "dead", "heal",
                "nowConfirm", "nowHeavy", "import",
                "showAdd"])
                o[attr] = o[attr] || 0;
            for (let attr of ["country", "province", "city",
                "confirmDesc", "suspectDesc", "deadDesc",
                "healDesc", "nowConfirmDesc", "nowHeavyDesc",
                "importDesc"])
                o[attr] = o[attr] || "";
        }

        return cityModify;
    }
    /**
     * @function getCityTotalHistory
     * @return {Array}
     */
    async getCityTotalHistory() {

        const sql = `
        select 
            f_area as province, 
            f_city as city, 
            f_date as date, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_heavy as heavy 
        from t_city_history 
        order by province ASC, city ASC, date ASC`;
        const cityTotalHistory = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(cityTotalHistory, ["province", "city"]);
        for (let o of cityTotalHistory) {
            for (let attr of ["confirm", "suspect", "dead",
                "heal", "heavy"])
                o[attr] = o[attr] || 0;
            for (let attr of ["province", "date"])
                o[attr] = o[attr] || "";
            o.day = o.date.substr(4, 2) + "." + o.date.substr(6, 2);
        }

        return cityTotalHistory;
    }
    /**
     * @function getCityModifyHistory
     * @return {Array}
     */
    async getCityModifyHistory() {

        const sql = `
        select 
            f_area as province, 
            f_city as city, 
            f_date as date, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_heavy as heavy 
        from t_city_add_history 
        order by province ASC, city ASC, date ASC`;
        const cityModifyHistory = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(cityModifyHistory, ["province", "city"]);
        for (let o of cityModifyHistory) {
            for (let attr of ["confirm", "suspect", "dead",
                "heal", "heavy"])
                o[attr] = o[attr] || 0;
            for (let attr of ["province", "date"])
                o[attr] = o[attr] || "";
            o.day = o.date.substr(4, 2) + "." + o.date.substr(6, 2);
        }

        return cityModifyHistory;
    }
    /**
     * @function getForeignReal
     * @return {Array}
     */
    async getForeignReal() {

        const sql = `
        select 
            f_country as country, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_confirm_modify as modifyConfirm, 
            f_suspect_modify as modifySuspect, 
            f_dead_modify as modifyDead, 
            f_heal_modify as modifyHeal, 
            f_confirm_modify_desc as modifyConfirmDesc, 
            f_suspect_modify_desc as modifySuspectDesc, 
            f_dead_modify_desc as modifyDeadDesc, 
            f_heal_modify_desc as modifyHealDesc 
        from t_foreign_country 
        order by confirm DESC`;
        const foreignReal = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(foreignReal, ["country"]);
        for (let o of foreignReal) {
            for (let attr of ["confirm", "suspect", "dead",
                "heal", "modifyConfirm", "modifySuspect",
                "modifyDead", "modifyHeal"])
                o[attr] = o[attr] || 0;
            for (let attr of ["country", "modifyConfirmDesc", "modifySuspectDesc",
                "modifyDeadDesc", "modifyHealDesc"])
                o[attr] = o[attr] || "";
        }

        return foreignReal;
    }
    /**
     * @function getSummaryForign
     * @return {Array}
     */
    async getSummaryForign() {
        const sql = `
        select 
            f_confirm as confirm, 
            f_suspect as suspect,
            f_dead as dead, 
            f_heal as heal, 
            f_heavy as heavy, 
            f_now_confirm as nowConfirm, 
            f_now_confirm_desc as nowConfirmDesc, 
            f_now_heavy as nowHeavy, 
            f_now_heavy_desc as nowHeavyDesc, 
            f_add_confirm as modifyConfirm, 
            f_add_suspect as modifySuspect, 
            f_add_dead as modifyDead, 
            f_add_heal as modifyHeal, 
            f_add_heavy as modifyHeavy, 
            f_add_confirm_desc as modifyConfirmDesc, 
            f_add_suspect_desc as modifySuspectDesc, 
            f_add_dead_desc as modifyDeadDesc, 
            f_add_heal_desc as modifyHealDesc, 
            f_add_heavy_desc as modifyHeavyDesc, 
            f_add_now_confirm as modifyNowConfirm, 
            f_add_now_confirm_desc as modifyNowConfirmDesc, 
            f_data_time as dataTime, 
            f_is_show_add as showAdd, 
            f_add_no_show_text as addNoShowText 
        from t_summary_foreign 
        order by f_create_time DESC`;
        const summaryForeign = await dbUtil.query(sql, [], dbConf);

        for (let o of summaryForeign) {
            for (let attr of ["confirm", "suspect", "dead",
                "heal", "heavy", "nowConfirm",
                "nowHeavy", "modifyConfirm", "modifyDead",
                "modifySuspect", "modifyHeal", "modifyHeavy"])
                o[attr] = o[attr] || 0;
            for (let attr of ["nowConfirmDesc", "nowHeavyDesc", "modifyConfirmDesc",
                "modifySuspectDesc", "modifyDeadDesc", "modifyHealDesc",
                "modifyHeavyDesc", "addNoShowText"])
                o[attr] = o[attr] || "";
        }

        if (summaryForeign.length == 0)
            return null;
        return summaryForeign[0];
    }
    /**
     * @function getRate
     * @return {Array}
     */
    async getRate() {

        const sql = `
        select 
            f_seq as rateSeq, 
            f_desc as rateDesc, 
            f_base as name, 
            f_dead_rate_desc as deadRate, 
            f_heavy_rate_desc as heavyRate, 
            f_heal_rate_desc as healRate 
        from t_rate order by rateSeq ASC`;
        const rateData = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(rateData, ["name"]);
        for (let o of rateData) {
            for (let attr of ["rateSeq"])
                o[attr] = o[attr] || 0;
            for (let attr of ["rateDesc", "name", "deadRate",
                "heavyRate", "healRate"])
                o[attr] = o[attr] || "";
        }

        return rateData;
    }
    /**
     * @function getForeignTotalHistory
     * @return {Array}
     */
    async getForeignTotalHistory() {
        const sql = `
        select 
            f_country as country, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_dead as dead, 
            f_heal as heal, 
            f_add_confirm as modifyConfirm, 
            f_date as day, 
            date_format(f_update_time, "%Y-%m-%d %H:%i:%s") as updateTime 
        from t_foreign_history_fromnews 
        where f_date != '${moment().format("YYYYMMDD")}'`;
        const foreignTotalHistory = await dbUtil.query(sql, [], dbConf);
        nameMapUtil.replace(foreignTotalHistory, ["country"]);
        for (let o of foreignTotalHistory) {
            for (let attr of ["confirm", "name", "suspect",
                "dead", "heal", "modifyConfirm"])
                o[attr] = o[attr] || 0;

            if (o["day"] && o["day"].length == 8) {
                o["newDay"] = o["day"].substr(0, 4) + "-" + o["day"].substr(4, 2) + "-" + o["day"].substr(6, 2);
                o["day"] = o["day"].substr(4, 2) + "." + o["day"].substr(6, 2);
            }

        }
        return foreignTotalHistory;
    }
    /**
     * @function getForeignCity
     * @return {Array}
     */
    async getForeignCity() {
        const sql = `
        select 
            f_country as country, 
            f_city as city, 
            f_city_en as cityEn, 
            f_confirm as confirm, 
            f_suspect as suspect, 
            f_heal as heal, 
            f_dead as dead, 
            f_heavy as heavy, 
            f_now_confirm as nowConfirm, 
            f_now_confirm_desc as nowConfirmDesc, 
            f_now_heavy as nowHeavy, 
            f_now_heavy_desc as nowHeavyDesc, 
            f_add_confirm as modifyConfirm, 
            f_add_suspect as modifySuspect, 
            f_add_dead as modifyDead, 
            f_add_heal as modifyHeal, 
            f_add_heavy as modifyHeavy, 
            f_add_confirm_desc as modifyConfirmDesc, 
            f_add_suspect_desc as modifySuspectDesc, 
            f_add_dead_desc as modifyDeadDesc, 
            f_add_heal_desc as modifyHealDesc, 
            f_add_heavy_desc as modifyHeavyDesc 
        from t_foreign_city 
        order by country ASC, confirm DESC`;

        const foreignCity = await dbUtil.query(sql, [], dbConf);
        foreignCity.forEach(row => {
            row.cityEnShort = nameMapUtil.getAbbrName(row.city);
        });
        nameMapUtil.replace(foreignCity, ["country", "city"]);
        for (let o of foreignCity) {
            for (let attr of ["confirm", "suspect", "heal",
                "head", "heavy", "nowConfirm", "nowHeavy",
                "modifyConfirm", "modifySuspect", "modifyDead",
                "modifyHeal", "modifyHeavy"]) {
                o[attr] = o[attr] || 0;
            }
            for (let attr of ["nowConfirmDesc", "nowHeavyDesc", "modifyConfirmDesc",
                "modifySuspectDesc", "modifyDeadDesc", "modifyHealDesc",
                "modifyHeavyDesc"]) {
                o[attr] = o[attr] || "";
            }

            o["showHeal"] = 1;
        }

        return foreignCity;
    }
    /**
     * @function getSummaryForeignHistory
     * @return {Array}
     */
    async getSummaryForeignHistory() {
        let sql = `
        select 
            f_date as day, 
            f_confirm as confirm,
            f_dead as dead, 
            f_heal as heal, 
            f_add_confirm as modifyConfirm, 
            f_dead_rate as deadRate, 
            f_heal_rate as healRate, 
            date_format(f_update_time, "%Y-%m-%d %H:%i:%s") as updateTime 
        from t_summary_foreign_history`;

        const summaryForeignHistory = await dbUtil.query(sql, [], dbConf);
        for (let o of summaryForeignHistory) {
            for (let attr of ["confirm", "dead", "heal", "modifyConfirm"])
                o[attr] = o[attr] || 0;
            for (let attr of ["deadRate", "healRate"])
                o[attr] = o[attr] || "0.0";

            if (o["day"] && o["day"].length == 8) {
                o["day"] = o["day"].substr(4, 2) + "." + o["day"].substr(6, 2);
            }
        }

        return summaryForeignHistory;
    }
}

module.exports = new DataDao();