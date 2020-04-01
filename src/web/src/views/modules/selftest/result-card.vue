<!--
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
-->
<template>
    <div class="result-card" v-show="show">
        <div class="result">
            <!-- 不需要就诊的结果卡片 -->
            <div class="result-board not-need" v-if="~~severityLevel === 0">
                <div class="result-title" :class="{bigger: $i18n.locale === 'en'}">
                    <h4 v-html="content.split('\\n')[0] || '新冠肺炎可能性较小'"></h4>
                </div>
                <div class="result-content">
                    <p
                        class="result-desc"
                        v-html="
                            handleResultDesc(
                                content
                                    .split('\\n')
                                    .slice(1)
                                    .join('<br>')
                            )
                        "
                    ></p>
                    <span class="source-inner" v-if="resultConfig.resultSource && resultConfig.resultSource.ifShow">{{
                        resultConfig.resultSource.text
                    }}</span>
                    <!-- 查看报告 -->
                    <div class="entry align-top mt-15" v-if="resultConfig.ifShowReportBtn" @click="handleReport">
                        <img
                            class="entry-icon yz"
                            src="https://static.wecity.qq.com/h5/2020-2/report-3f083a22dd27dd7384e41b2cf2675b23.png"
                        />
                        <p class="entry-name">
                            {{ resultConfig.reportBtnTitle || $t('selftest.Report_Title') }} <br /><span class="note">{{
                                resultConfig.reportBtnSubTitle
                            }}</span>
                        </p>
                    </div>
                    <!-- 免费义诊 -->
                    <div
                        class="entry"
                        v-if="resultConfig.freeDiagnosis && resultConfig.freeDiagnosis.ifShow && ~~answerIndex !== 1"
                        @click="handleFreeDiagnosis"
                    >
                        <img
                            class="entry-icon yz"
                            src="https://static.wecity.qq.com/h5/2020-2/yz-d4a1fcf1602935a340eb0908b435ea2a.png"
                        />
                        <p class="entry-name">{{ resultConfig.freeDiagnosis.text }}</p>
                    </div>
                </div>
            </div>
            <!-- 需要就诊的结果卡片 -->
            <div class="result-board need" v-if="~~severityLevel === 1">
                <div class="result-title bad" :class="{bigger: $i18n.locale === 'en'}" >
                    <h4 v-html="$t('selftest.High_Level_Suggestion')"></h4>
                </div>
                <div class="result-content">
                    <p class="result-desc" v-html="handleResultDesc(content.replace(/\\n/g, '<br>'))"></p>
                    <span class="source-inner" v-if="resultConfig.resultSource && resultConfig.resultSource.ifShow">{{
                        resultConfig.resultSource.text
                    }}</span>

                    <!-- 查看报告 -->
                    <div class="entry align-top mt-15" v-if="resultConfig.ifShowReportBtn" @click="handleReport">
                        <img
                            class="entry-icon yz"
                            src="https://static.wecity.qq.com/h5/2020-2/report-3f083a22dd27dd7384e41b2cf2675b23.png"
                        />
                        <p class="entry-name">
                            {{ resultConfig.reportBtnTitle || $t('selftest.Report_Title') }} <br /><span class="note">{{
                                resultConfig.reportBtnSubTitle
                            }}</span>
                        </p>
                    </div>

                    <!-- 免费义诊 -->
                    <div
                        class="entry"
                        :class="{ 'border-b': resultConfig.ifShowNearby }"
                        @click="handleFreeDiagnosis"
                        v-show="resultConfig.freeDiagnosis && resultConfig.freeDiagnosis.ifShow"
                    >
                        <img
                            class="entry-icon yz"
                            src="https://static.wecity.qq.com/h5/2020-2/yz-d4a1fcf1602935a340eb0908b435ea2a.png"
                        />
                        <p class="entry-name">{{ resultConfig.freeDiagnosis.text }}</p>
                    </div>

                    <!-- 查找附近的发热门诊，代替原来的标题上的箭头 -->
                    <div
                        class="entry"
                        v-if="resultConfig.ifShowNearby"
                        @click="handleNearby"
                    >
                        <img
                            class="entry-icon"
                            src="https://static.wecity.qq.com/h5/2020-2/location-027380a712dad22324abbe660a9efe49.png"
                        />
                        <p class="entry-name">{{ resultConfig.nearbyBtnText }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="keep-safe"
            v-if="
                ~~answerIndex < 6 &&
                    resultConfig.recommendCard &&
                    resultConfig.recommendCard.ifShowIsolationText &&
                    resultConfig.recommendCard.isolationText
            "
        >
            <h4>{{$t('selftest.Result_Title_Observation')}}</h4>
            <p v-html="resultConfig.recommendCard.isolationText"></p>
            <span v-if="resultConfig.recommendCard.ifShowIsolationAuth" class="source-inner">{{
                resultConfig.recommendCard.isolationAuth || $t('selftest.High_Level_Suggestion_Authority')
            }}</span>
        </div>
        <div
            class="keep-safe"
            v-if="
                ~~answerIndex > 7 &&
                    resultConfig.recommendCard.ifShowDiagnosisText &&
                    resultConfig.recommendCard.diagnosisText
            "
        >
            <h4>{{$t('selftest.Result_Title_Patient')}}</h4>
            <p v-html="resultConfig.recommendCard.diagnosisText"></p>
            <span v-if="resultConfig.recommendCard.ifShowDiagnosisAuth" class="source-inner">{{
                resultConfig.recommendCard.diagnosisAuth || $t('selftest.High_Level_Suggestion_Authority')
            }}</span>
        </div>
    </div>
</template>
<script>
import { reportData, jump } from './util'

const FREE_DIAGNOSIS_URL = 'https://cmda.qq.com/pages/clinic.html?sfr=yidian&VNK=a56f8567&adtag=op.co.kdzfy.fygj'

export default {
    props: {
        severityLevel: Number,
        answerIndex: Number,
        content: String,
        hospitalConfig: Object,
        show: Boolean
    },
    data () {
        return {
            resultConfig: {},
            totalHospitals: 0,
            cityName: ''
        }
    },
    watch: {
        hospitalConfig (hospitalConfig) {
            const config = hospitalConfig ? hospitalConfig.resultCard || {} : {}
            config.freeDiagnosis = hospitalConfig.freeDiagnosis || {}
            config.resultSource = hospitalConfig.resultSource || {}
            config.recommendCard = hospitalConfig.recommendCard || {}
            this.resultConfig = config
        }
    },
    methods: {
        // 替换结果卡片内需要支持跳转的链接
        handleResultDesc (content) {
            // const onlineText = content.replace(/<online.*?>(.*?)<\/online>/g, 'online')
            let result = content
            const onlineLink = this.resultConfig.freeDiagnosis
                ? this.resultConfig.freeDiagnosis.jumpUrl || FREE_DIAGNOSIS_URL
                : FREE_DIAGNOSIS_URL

            // 替换线上义诊
            const ifRepalceOnline = this.resultConfig.freeDiagnosis && this.resultConfig.freeDiagnosis.ifShow
            result = result
                .replace('<online>', ifRepalceOnline ? `<a href="${onlineLink}">` : '')
                .replace('</online>', ifRepalceOnline ? '</a>' : '')

            return result
        },

        // 查看自查报告
        handleReport () {
            reportData.call(this, {
                actionName: 'selftest.click.report.entry'
            })
            this.$router.push({
                path: '/selftest-report',
                query: {
                    ...this.$route.query
                }
            })
        },

        // 点击 附近的发热门诊
        async handleNearby () {
            const nearbyBtnLink = this.resultConfig.nearbyBtnLink
            this.jump({
                url: nearbyBtnLink || '/map-landing',
                report: {
                    actionName: 'selftest.afterend.click.nearby'
                }
            })
        },

        // 跳转免费义诊
        async handleFreeDiagnosis () {
            const freeDiagnosisUrl =
                (this.resultConfig.freeDiagnosis && this.resultConfig.freeDiagnosis.jumpUrl) || FREE_DIAGNOSIS_URL
            this.jump({
                url: freeDiagnosisUrl,
                report: {
                    actionName: 'selftest.free.diagnosis'
                }
            })
        },

        async jump (...params) {
            jump.call(this, ...params)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/exam/selftest';

.result-card {
    animation: 400ms fadeInLeft ease;
}

.result-desc {
    a {
        color: #4875f6;
        font-weight: bold;
    }
}
@keyframes fadeInLeft {
    from {
        opacity: 1;
        transform: translate3d(-100%, 0, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}
</style>
