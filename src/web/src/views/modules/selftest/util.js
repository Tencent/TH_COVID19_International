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
const QUESTION_TYPE_MAP = {
    1: 'multi',
    0: 'single'
}

export function getQuestionType (questionType) {
    return QUESTION_TYPE_MAP[questionType] || questionType.toLowerCase()
}

export function getEleHeight (ele) {
    return ele.getBoundingClientRect().height
}

export function getQuestionOptions (questionOptions, questionType) {
    const options = [...questionOptions]
    const leftBtnText = questionType === 'multi' ? options.pop() : ''

    console.log('🐞 || options: ', options)
    return { options, leftBtnText }
}

export async function reportData ({ actionName, actionType = 'event', extra = {} }) {
    if (!this.reportStatLog || !this.$route) return
    try {
        const extraData = {
            ...extra,
            from: this.$route.query,
            cityCode: window.localStorage.getItem('SELFTEST_CITYCODE')
        }
        await this.reportStatLog({
            actionType,
            actionName,
            extra: extraData
        })
    } catch (error) {
        console.log('❌ 上报失败', error)
    }
}

export async function jump ({ url = '', query = {}, report = {} }) {
    try {
        if (!url) return
        // 上报
        const { actionType = 'event', actionName, extra = {} } = report
        if (actionName) {
            await reportData.call(this, {
                actionType, actionName, extra
            })
        }
        // 跳转
        if (url.indexOf('http') >= 0) {
            location.href = url
        } else {
            this.$router.push({
                path: url,
                query: {
                    ...this.$getRouteKeepQuery(this.$route.query),
                    random: new Date().getTime(),
                    ...query
                }
            })
        }
    } catch (error) {
        console.log('❌ 跳转失败', error)
    }
}

export const DEFAULT_HOSPITAL_CONFIG = {
    resultCard: {
        hospitalList: []
    },
    report: {},
    bottomBtnRight: {},
    ifShowSource: true,
    sourceUrl: '',
    ifShowSourceBtn: true,
    sourceDoctor: '',
    strategy: 'v3',
    freeDiagnosis: {},
    recommend: [],
    resultSource: {},
    recommendCard: {
        modules: [],
        disease: {}
    }
}
class GlobalData {
    _store = {
        hospitalConfig: DEFAULT_HOSPITAL_CONFIG,
        selftestResult: { details: {} }
    }

    get (key) {
        if (!key) return this._store
        return this._store[key]
    }
    set (key, value) {
        this._store[key] = value
        return this._store
    }
}

export const globalData = new GlobalData()
