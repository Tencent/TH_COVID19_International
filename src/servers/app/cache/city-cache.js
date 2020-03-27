"use strict";
/**
 * city-cache
 * cityCode和城市名相关的cache
 * 会缓存城市名->cityCode的映射以及别名到内存中
 */
const DataDao = require("../dao/data_dao");

let _mapProvince = {};            // 省名 -> 省Code
let _mapCityAndProvinceCode = {}; // 城市Code -> 省Code
let _mCityMapInfo = {};           // 省名_城市名 -> 城市信息 {provinceName cityName provinceCode cityCode}
let _mCode = {};                  // code -> code信息 {provinceCode cityCode}
let _mapScreen = {};             // cityCode -> 是否屏蔽

async function updateCity() {
    // #lizard forgives
    let tmpMapProvince = {}, tmpMapCityAndProvinceCode = {}, tmpMapScreen = {}, tmpMCityMapInfo = {};
    let rawCityMap = await DataDao.getCityMap("CityCache");
    for (let ocm of rawCityMap) {
        if (ocm.province && ocm.provinceCode) tmpMapProvince[ocm.province] = ocm.provinceCode;

        if (ocm.provinceCode) {
            tmpMapCityAndProvinceCode[ocm.provinceCode] = ocm.provinceCode;
        }

        if (ocm.provinceCode && ocm.cityCode) {
            tmpMapCityAndProvinceCode[ocm.cityCode] = ocm.provinceCode;
            tmpMapScreen[ocm.cityCode] = ocm.screen || 0;
        }

        let cityInfo = {
            sArea: ocm.province || "",
            sMapCity: ocm.city || "",
            sCity: ocm.city1 || ocm.city || "",
            sCityCode: ocm.cityCode || "",
            sProvinceCode: ocm.provinceCode || ""
        };
        tmpMCityMapInfo[ocm.province + "_" + (ocm.city || "")] = cityInfo;

        if (ocm.city1) tmpMCityMapInfo[ocm.province + "_" + ocm.city1] = cityInfo;
        if (ocm.city2) tmpMCityMapInfo[ocm.province + "_" + ocm.city1] = cityInfo;
        if (ocm.city3) tmpMCityMapInfo[ocm.province + "_" + ocm.city1] = cityInfo;
        if (ocm.city4) tmpMCityMapInfo[ocm.province + "_" + ocm.city1] = cityInfo;
        if (ocm.city5) tmpMCityMapInfo[ocm.province + "_" + ocm.city1] = cityInfo;
        if (ocm.city6) tmpMCityMapInfo[ocm.province + "_" + ocm.city1] = cityInfo;
    }

    let tmpMCode = {};
    let rawCityCode = await DataDao.getCityCode("CityCache");
    for (let occ of rawCityCode) {
        if (!occ.code) continue;

        tmpMCode[occ.code] = { code: occ.code, cityCode: occ.cityCode || "", provinceCode: occ.provinceCode || "" };
    }

    _mapProvince = tmpMapProvince;
    _mapCityAndProvinceCode = tmpMapCityAndProvinceCode;
    _mCityMapInfo = tmpMCityMapInfo;
    _mapScreen = tmpMapScreen;

    _mCode = tmpMCode;

}

function getMapCityInfo(province_city) {
    return _mCityMapInfo[province_city];
}

function getProvinceCode(province) {
    return _mapProvince[province];
}

function getCodeInfo(code) {
    return _mCode[code];
}

function getScreen(cityCode) {
    return _mapScreen[cityCode];
}

function getCityProvinceCode(cityCode) {
    return _mapCityAndProvinceCode[cityCode];
}

exports.updateCity = updateCity;
exports.getMapCityInfo = getMapCityInfo;
exports.getCodeInfo = getCodeInfo;
exports.getProvinceCode = getProvinceCode;
exports.getScreen = getScreen;
exports.getCityProvinceCode = getCityProvinceCode;
