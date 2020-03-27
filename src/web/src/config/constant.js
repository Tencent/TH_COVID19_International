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
console.log('🌟 process.env.CDN_ENV', process.env.CDN_ENV)

if (!process.env.CDN_ENV) {
    console.error('找不到 process.env.CDN_ENV, 请检查编译配置！')
}

const BASE_URL_MAP = {
    development: '/haiwai-test/dist',
    pre: '/covid-19trend/dist',
    production: '/covid-19trend/dist'
}
const BASE_URL = BASE_URL_MAP[process.env.CDN_ENV]

console.log('🌟 BASE_URL', BASE_URL)

const FEIYANMAP_REQUEST_BASEURL_MAP = {
    development: 'https://mitest.wecity.qq.com',
    pre: 'https://mitest.wecity.qq.com',
    production: 'https://card.wecity.qq.com'
}
const MAP_REQUEST_BASEURL = FEIYANMAP_REQUEST_BASEURL_MAP[process.env.CDN_ENV]

module.exports = {
    BASE_URL,
    MAP_REQUEST_BASEURL
}
