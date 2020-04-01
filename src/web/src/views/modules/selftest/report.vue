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
  <div class="report-page" id="report-page">
    <div class='report-page-main' id='report'>
      <div class="header">
        <img class="background-banner" :src="$i18n.locale === 'zh' ? 'https://static.wecity.qq.com/h5/2020-2/bg-5944ec5ec78658b127c2ed5d6131d6f2.png' : 'https://static.wecity.qq.com/h5/2020-2/background-76b49e3f591a09803c0074d0da40ccf9.png'" alt='' srcset=''>
        <p class="time">{{$t('selftest.Report_Time')}}{{handleReportTime(conclusion.report_time)}}</p>
      </div>
      <div class="content">
        <div class="report-block">
          <h2 class="report-block-title">{{$t('selftest.Report_Title_Basic_Information')}}</h2>
          <div class="row">
            <div class="report-item" :class="$i18n.locale === 'en' ? 'col-6' : 'col-7'">
                <label class="large" v-html="$t('selftest.Report_Title_Age')"></label>
                <p class="report-item-result">{{conclusion.age}}</p>
            </div>
            <div class="report-item" :class="$i18n.locale === 'en' ? 'col-4' : 'col-3'">
                <label  :class="$i18n.locale === 'en' ? 'middle' : 'small'" v-html="$t('selftest.Report_Title_Pregnant')"></label>
                <p class="report-item-result">{{conclusion.details.is_pregnant.str_yes}}</p>
            </div>
          </div>
          <div class="row">
            <div class="report-item col-10">
                <label class="large" v-html="$t('selftest.Report_Title_History')"></label>
                <p class="report-item-result">
                  <span v-html="handleBreakLine(conclusion.details.his_diesase.str_yes)"></span>
                  <br/>
                  <span class="assist-text"
                    v-if="conclusion.details.his_diesase.str_no"
                    v-html="handleBreakLine(`${$i18n.t('selftest.Deny')}${conclusion.details.his_diesase.str_no}`)"
                  ></span>
                </p>
            </div>
          </div>
        </div>
        <div class="report-block">
          <h2 class="report-block-title">{{$t('selftest.Report_Title_Epidemiological')}}</h2>
          <div class="row">
            <div class="report-item col-10">
              <label class="large" v-html="$t('selftest.Report_Title_Contacts')"></label>
              <p class="report-item-result"
                v-html="handleBreakLine(conclusion.details.his_contact.str_yes)"
              ></p>
            </div>
          </div>
          <div class="row">
            <div class="report-item col-10">
              <label class="large" v-html="$t('selftest.Report_Title_Contacts_Denied')"></label>
              <p class="report-item-result assist-text"
                v-html="handleBreakLine(conclusion.details.his_contact.str_no)"
              ></p>
            </div>
          </div>
        </div>
        <div class="report-block">
          <h2 class="report-block-title" v-html="$t('selftest.Report_Title_Symptoms')"></h2>
          <div class="row">
            <div class="report-item col-5">
              <label class="large" v-html="$t('selftest.Report_Title_Fever')"></label>
              <p class="report-item-result">{{conclusion.details.fever.str_yes}}</p>
            </div>
            <div class="report-item col-5" v-if="conclusion.details.fever.yes_or_no">
              <label :class="$i18n.locale === 'en' ? 'huge' : 'large'"  v-html="$t('selftest.Report_Title_Temperature')"></label>
              <p class="report-item-result">{{conclusion.details.fever_temp.str_yes}}</p>
            </div>
          </div>
          <div class="row">
            <div class="report-item col-10">
              <label class="large" v-html="$t('selftest.Report_Title_Others')"></label>
              <p class="report-item-result">
                <span v-html="handleBreakLine(conclusion.details.symp.str_yes)"></span>
                <br/>
                <span class="assist-text"
                  v-if="conclusion.details.symp.str_no"
                  v-html="handleBreakLine(`${$i18n.t('selftest.Deny')}${conclusion.details.symp.str_no}`)"
                ></span>
              </p>
            </div>
          </div>
          <div class="row">
            <div class="report-item col-10">
              <label class="large" v-html="$t('selftest.Report_Title_Conclusion')"></label>
              <p class="report-item-result" v-html="handleBreakLine(conclusion.details.symp_severe.str_yes)"></p>
            </div>
          </div>
        </div>
        <div class="report-block">
          <h2 class="report-block-title" v-html="$t('selftest.Report_Title_Recommendation')"></h2>
          <p class="result-comment">{{conclusion.title}}</p>
          <p class="result-summary" v-html="handleDesc(conclusion.answer)"></p>
          <p class="statement" v-html="$t('selftest.Report_Title_Recommendation_Authority')"></p>
        </div>
      </div>
    </div>
    <div class="place-holder" id="place-holder"></div>
    <div class="btn-group">
      <div class="btn primary mid" v-if="reportConfig.ifShowSubBtn" @click="handleMainBtn">{{$t('selftest.Report_Photo_Btn')}}</div>
    </div>
    <div class="share-dialog" id="share-dialog" v-show="ifShowDialog" style="bottom: 0">
      <p v-show="imgtype === 'screenShot'" class="share-guide">{{$t('selftest.Report_Photo_Tip')}}</p>
      <div class="dialog-close" @click="handleCloseShareDialog"></div>
      <div class="img-wrap">
          <img class="share-img" :src="screenSrc" />
      </div>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
import html2canvas from 'html2canvas'
import httpUtils from '@/api'
import logUtils from '@/utils/log_util'
import { jump, reportData, globalData, DEFAULT_HOSPITAL_CONFIG } from './util'

const FREE_DIAGNOSIS_URL = 'https://cmda.qq.com/pages/clinic.html?sfr=yidian&VNK=a56f8567&adtag=op.co.kdzfy.fygj'
const DEFAULT_CONCLUSION = {
    age: '',
    is_pregnant: false,
    details: {
        is_pregnant: {},
        his_diesase: {},
        his_contact: {},
        fever: {},
        symp: {},
        symp_severe: {},
        fever_temp: {}
    },
    title: '',
    answer: '',
    report_time: ''
}

export default {
    data () {
        return {
            hospitalConfig: DEFAULT_HOSPITAL_CONFIG,
            reportConfig: { freeDiagnosis: {} },
            screenSrc: '',
            conclusion: DEFAULT_CONCLUSION,
            loading: false,
            imgtype: 'screenShot',
            ifShowDialog: false
        }
    },
    watch: {
        hospitalConfig (hospitalConfig = DEFAULT_HOSPITAL_CONFIG) {
            this.reportConfig = {
                freeDiagnosis: hospitalConfig.freeDiagnosis,
                ...hospitalConfig.report
            }
        },
        loading (ifLoading) {
            if (ifLoading) {
                this.loadingToast = this.$loadingToast({
                    message: 'loading'
                })
            } else if (this.loadingToast) {
                this.loadingToast.close()
            }
        },
        screenSrc (val) {
            this.ifShowDialog = !!val
        }
    },
    methods: {

        handleClose () {
            this.$emit('close')
        },

        handleDiagnosis () {
            const freeDiagnosisUrl = this.reportConfig.freeDiagnosis
                ? this.reportConfig.freeDiagnosis.jumpUrl || FREE_DIAGNOSIS_URL
                : FREE_DIAGNOSIS_URL

            jump.call(this, {
                url: freeDiagnosisUrl,
                report: {
                    actionName: 'selftest.report.screenshot.click.diagnosis'
                }
            })
        },

        async handleMainBtn () {
            reportData.call(this, {
                actionName: 'selftest.report.click.screenshot'
            })

            this.imgtype = 'screenShot'
            await this.handleScreenShot()
        },

        handleCloseShareDialog () {
            reportData.call(this, {
                actionName: 'selftest.report.screenshot.click.close'
            })
            this.screenSrc = null
        },

        async handleScreenShot () {
            if (this.screenSrc) return
            this.loading = true
            const target = document.getElementById('report')
            this.$nextTick(async () => {
                const imgSrc = await this.generateImgSrc(target)
                this.screenSrc = imgSrc
                this.loading = false
            })
        },
        async generateImgSrc (target) {
            return new Promise(async (resolve, reject) => {
                // 重置窗口位置
                window.pageYOffset = 0
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0

                try {
                    const canvas = await html2canvas(target, { useCORS: true })
                    resolve(canvas.toDataURL())
                } catch (error) {
                    console.log('❌ html2canvas failed', error)
                }
            })
        },

        handleDesc (content) {
            if (typeof content !== 'string') return
            let result = content
            if (content.indexOf('\\n') === 0) {
                result = result.substr(2)
            }

            return result.replace(/\\n/g, '<br>')
        },

        handleReportTime (timeDate) {
            // 时区，增加8小时
            const time = new Date(+timeDate + 8 * 3600 * 1000)
            return time.toJSON()
                ? time.toJSON().substr(0, 19).replace('T', ' ')
                : '-'
        },

        handleBreakLine (content) {
            if (typeof content !== 'string' || content.length === 0) return this.$i18n.t('selftest.None')
            return content
                .split('\\n')
                .map(item => `<span class="result-row">${item}</span>`)
                .join('<br>')
        },

        async saveConclusion () {
            // 直接打开报告页的，说明是分享出去的，不用再存
            if (this.$route.query.caseId) return
            try {
                const conclusions = globalData.get('selftestResult')
                const req = {
                    caseId: logUtils.getUserId(),
                    conclusions
                }
                await httpUtils('SetConclusion', req, 'DiagnosisPreServer_NCovDiagnosis')
            } catch (error) {
                console.log('❌ saveConclusion error', error)
            }
        },

        async initData () {
            this.loadingToast = this.$loadingToast({
                message: 'loading'
            })
            try {
                const selftestResult = globalData.get('selftestResult')
                // 从内存数据拉到数据
                if (selftestResult && selftestResult.age) {
                    const { selftestResult, hospitalConfig = DEFAULT_HOSPITAL_CONFIG } = globalData.get()
                    this.conclusion = selftestResult
                    this.hospitalConfig = hospitalConfig
                }
                // 内存数据为空，从sessionStorage恢复或者重新请求接口
                else {
                    // 从sessionStorage读回数据
                    const SELFTEST_RESULT_DATA = sessionStorage.getItem('SELFTEST_RESULT_DATA')
                    const selftestResultData = JSON.parse(SELFTEST_RESULT_DATA)
                    if (SELFTEST_RESULT_DATA && selftestResultData) {
                        const { globalData: cacheGlobalData } = selftestResultData
                        globalData.set('selftestResult', cacheGlobalData.selftestResult)
                        globalData.set('hospitalConfig', cacheGlobalData.hospitalConfig)

                        this.conclusion = cacheGlobalData.selftestResult
                        this.hospitalConfig = cacheGlobalData.hospitalConfig
                    }
                    // 请求接口
                    else {
                        const { caseId = logUtils.getUserId() } = this.$route.query
                        const req = { caseId }
                        const result = await httpUtils('GetConclusion', req, 'DiagnosisPreServer_NCovDiagnosis')

                        if (~~result.code !== 0) {
                            this.handleNoReport()
                            return
                        }

                        this.conclusion = result.conclusions
                        this.hospitalConfig = await this.initConfig()
                    }
                }
            } catch (error) {
                console.log('❌ report initData error', error)
                this.handleNoReport()
            }

            this.loadingToast.close()
        },

        handleNoReport () {
            if (this.loadingToast) this.loadingToast.close()
            this.$networkErrorToast({
                message: '没有找到你的报告，请重新自查～'
            })
            setTimeout(() => {
                this.$router.push({
                    path: '/selftest',
                    query: {
                        // ...this.$getRouteKeepQuery(this.$route.query),
                        ...this.$route.query
                    }
                })
            }, 1000)
        },

        async initConfig () {
            const { cfgid, from } = this.$route.query
            const req = {
                partnerId: '',
                appId: '',
                hospitalId: cfgid || from,
                type: 0
            }
            try {
                const result = await httpUtils('GetPreDiagnosisConfig', req, 'DiagnosisPreServer_NCovDiagnosis')
                const hospitalConfig = JSON.parse(result.config)
                if (hospitalConfig.webConfig) {
                    const configData = hospitalConfig.webConfig
                    globalData.set('hospitalConfig', configData)
                    console.log('🐞 || config: ', { ...configData })
                    return configData
                }
            } catch (error) {
                console.log('❌ initConfig error', error)
            }
        }
    },
    async created () {
        await this.initData()

        console.log('🐞 || selftestResult: ', this.conclusion, globalData.get())
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/exam/report';

html body .report-page {
  .report-page-main {
    background-image: none;

    .header {
      .background-banner {
        position: absolute;
        top: 0;
        left: -15px;
        width: calc(100% + 30px);
        z-index: 0;
      }
    }

    .content {
      position: relative;
      z-index: 1;
    }
  }
  .share-dialog {
    transform: none;
    left: 0;
    right: 0;
  }
  .btn-group {
    z-index: 3;
    justify-content: center;

    .btn.mr-6 {
      margin-right: .6rem;
    }
  }
}
</style>
