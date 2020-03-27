/**
 * Tencent is pleased to support the open source community by making outerdata-opensouce available.
 * Copyright (C) 2019 Limited, Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
const CONSTANT = require('@/config/constant')

export function getEnv () {
    return process.env.CDN_ENV
}
export function getQueryStringOld (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = (window.location.hash || window.location.search).substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

export function getQueryString (name) {
    let urlObj = new URL(location.href)

    if (urlObj.hash && urlObj.hash.indexOf('?') !== -1) {
        let searchObj = new URLSearchParams(urlObj.hash.split('?')[1] || '')
        if (searchObj.get(name)) return searchObj.get(name)
    }

    if (urlObj.search && urlObj.searchParams.get(name)) {
        return urlObj.searchParams.get(name)
    }

    return null
}

export const BASE_URL = CONSTANT.BASE_URL

/* 向url追加query串 */
export function appendQuery (url, queryObj) {
    let urlObj = new URL(url)

    if (urlObj.hash) {
        let hashData = urlObj.hash.split('?')
        let searchObj = new URLSearchParams(hashData[1] || '')
        for (let k in queryObj) {
            searchObj.set(k, queryObj[k])
        }
        urlObj.hash = `${hashData[0]}?${searchObj.toString()}`
    }

    if (urlObj.search) {
        for (let k in queryObj) {
            if (urlObj.searchParams.get(k)) {
                urlObj.searchParams.set(k, queryObj[k])
            }
        }
    }

    return urlObj.href
}

export function getDay (num, str) {
    var today = new Date()
    var nowTime = today.getTime()
    var ms = 24 * 3600 * 1000 * num
    today.setTime(parseInt(nowTime + ms))
    var oYear = today.getFullYear()
    var oMoth = (today.getMonth() + 1).toString()
    if (oMoth.length <= 1) oMoth = '0' + oMoth
    var oDay = today.getDate().toString()
    if (oDay.length <= 1) oDay = '0' + oDay
    return oYear + str + oMoth + str + oDay
}
