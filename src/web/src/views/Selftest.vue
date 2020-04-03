<template>
    <div class="selftest-page">
        <div class="selftest-page-content">
            <div class="chartboard" id="chartboard">
                <img
                    class="header-banner"
                    :src="
                        hospitalConfig.banner ||
                            'https://static.wecity.qq.com/h5/2020-2/Banner-3c2de6fd934ecb3d27bc86e98e207dca.png'
                    "
                />
                <div class="body" id="body">
                    <div id="dialog" class="dialog clearfix">
                        <div
                            :id="`dialog-item-${index}`"
                            class="dialog-item"
                            :class="`${item.isQuestion ? 'left' : 'right'} ${item.isLoading ? 'loading' : ''}`"
                            v-for="(item, index) of messages"
                            :key="index"
                        >
                            <blockquote v-if="item.isLoading">
                                <div class="bounce bounce1"></div>
                                <div class="bounce bounce2"></div>
                                <div class="bounce bounce3"></div>
                            </blockquote>
                            <blockquote v-if="!item.isLoading">
                                <p class="chat">{{ item.content }}</p>
                            </blockquote>
                        </div>
                    </div>
                    <!-- 自查结果 和 居家隔离/就诊指南 -->
                    <ResultCard
                        id="result-card"
                        :show="typeof severityLevel === 'number'"
                        :hospitalConfig="hospitalConfig"
                        :answerIndex="answerIndex"
                        :severityLevel="severityLevel"
                        :content="resultContent"
                        @getCityCode="handleCityCode"
                        @jumpout="showWhiteMask = true"
                        @getNoLocation="handleNoLocation"
                    />
                    <!-- 疫情科普 和 疫情资讯 -->
                    <Recommend
                        :show="typeof severityLevel === 'number' && answerIndex > 0"
                        :cityCode="cityCode"
                        :noLocation="noLocation"
                        :hospitalConfig="hospitalConfig"
                        :answerIndex="answerIndex"
                        @jumpout="showWhiteMask = true"
                    />
                    <div class="place-holder" v-if="ifShowBottomBtn"></div>
                </div>
            </div>
            <!-- 答题面板 -->
            <QuestionPanel
                v-show="!ifShowBottomBtn"
                id="question-panel"
                :show.sync="ifShowPanel"
                :type="questionType"
                :options="questionOptions"
                :leftBtnText="leftBtnText"
                @confirm="handleConfirm"
            />
        </div>
        <div class="fixed-footer" v-if="ifShowBottomBtn">
            <div class="button-style single">
                <div class="retry" @click="handleRestart">{{$t('selftest.Retest')}}</div>
            </div>
        </div>
        <div class="white-mask" v-show="showWhiteMask"></div>
    </div>
</template>
<script>
import smoothscroll from 'smoothscroll-polyfill'
import httpUtils from '@/api'
import logUtils from '@/utils/log_util'
import { getQuestionType, getQuestionOptions, globalData, reportData } from './modules/selftest/util'

import ResultCard from './modules/selftest/result-card'
import QuestionPanel from './modules/selftest/panel'
import Recommend from './modules/selftest/recommend'

const getQuestionItem = content => ({ content, isQuestion: true })

export default {
    components: { ResultCard, QuestionPanel, Recommend },
    data () {
        return {
            hospitalConfig: globalData.get('hospitalConfig'),
            messages: [],
            questionOptions: [],
            questionType: 'single',
            ifShowPanel: false,
            severityLevel: null,
            resultContent: '',
            // conclusion: {},
            leftBtnText: '',
            ifShowBottomBtn: false,
            // 结果分支
            answerIndex: 0,
            cityCode: '440000',
            showWhiteMask: false,
            noLocation: false
        }
    },
    watch: {
        messages (val, old) {
            if (!Array.isArray(val)) return
            sessionStorage.setItem('SELFTEST_MESSAGES', JSON.stringify(val))
            if (val.length > old.length) this.scrollToBottom('chartboard')
        }
    },
    methods: {
        async initSelfTest () {
            this.loadingToast = this.$loadingToast({ message: 'loading', showTime: 30000 })

            // 用于保留历史
            this.historyAnswer = []

            try {
                await this.getQuestion()
            } catch (error) {
                console.log('❌ initSelfTest error', error)
            }

            this.loadingToast.close()
        },
        async getQuestion ({ lastQuestion } = {}) {
            const req = { questions: this.historyAnswer, caseId: logUtils.getUserId() }

            if (this.hospitalConfig.strategy) {
                req.strategy = this.hospitalConfig.strategy
            }
            try {
                const result = await httpUtils('NewCovDiagnosis', req, 'DiagnosisPreServer_NCovDiagnosis')
                console.log('❌ result', result)

                // 接口错误
                if (~~result.status === 0 && !result.answer && (!result.question || ~~result.question.no === 0)) {
                    this.$networkErrorToast({ message: 'network error' })
                    return
                }

                // 继续
                if (~~result.status === 1) {
                    const { question } = result
                    this.questionType = getQuestionType(question.question_type)

                    const { options, leftBtnText } = getQuestionOptions(question.candidate_symp, this.questionType)

                    this.sendMessage(question.question_query).then(() => {
                        this.ifShowPanel = true
                        this.questionOptions = options
                        this.leftBtnText = leftBtnText
                        this.scrollToBottom('chartboard')
                    })

                    // 缓存 question 不绑定到view
                    this.cacheResult = result
                    console.log('🐞 || question: ', question)
                }
                // 结束
                else if (~~result.status === 0) {
                    // 发一条空消息来触发loading
                    this.sendMessage('', true).then(() => {
                        this.messages = this.messages.slice(0, -1)
                        this.severityLevel = result.severity_level
                        this.resultContent = result.answer
                        this.ifShowBottomBtn = true
                        this.answerIndex = result.answer_index
                        // this.conclusion = result.conclusions
                        result.conclusions && globalData.set('selftestResult', result.conclusions)

                        this.saveToSessionStorage()
                        this.scrollToResultCard()
                    })

                    reportData.call(this, {
                        actionType: 'event',
                        actionName: 'selftest.end',
                        extra: {
                            result: result.answer,
                            answerIndex: result.answer_index,
                            ifNeedDiagnosis: ~~this.severityLevel === 1,
                            strategy: this.hospitalConfig.strategy
                        }
                    })
                }
            } catch (error) {
                this.loadingToast.close()
                this.$networkErrorToast({
                    message: 'network error'
                })
                console.log('❌ error', error)
            }
        },
        handleConfirm (selected) {
            console.log('🐞 || selected: ', selected)
            this.ifShowPanel = false
            const resultContent = selected.length > 0 ? selected.join('，') : this.leftBtnText || '以上都没有'
            this.sendMessage(resultContent, false)

            const { question: lastQuestion } = this.cacheResult
            lastQuestion.symp_list = selected.length > 0 ? selected : [this.leftBtnText || '以上都没有']
            this.historyAnswer.push(lastQuestion)

            this.getQuestion({ lastQuestion })

            reportData.call(this, {
                actionType: 'event',
                actionName: 'selftest.answer',
                extra: { question: lastQuestion.question_query, answer: lastQuestion.symp_list, index: lastQuestion.no }
            })
        },
        handleRestart () {
            this.messages = [getQuestionItem(this.hospitalConfig.guideText || this.$i18n.t('selftest.Report_Guide_Text'))]
            // this.sendMessage(this.$i18n.t('selftest.Report_Guide_Text'), true)
            this.severityLevel = null
            this.ifShowBottomBtn = false
            this.initSelfTest()
            sessionStorage.setItem('SELFTEST_END', 'false')

            reportData.call(this, {
                actionType: 'event',
                actionName: 'selftest.restart'
            })
        },
        sendMessage (content, isQuestion = true) {
            // 用户发的右侧消息不需要loading
            if (!isQuestion) {
                return new Promise((resolve, reject) => {
                    this.messages = [...this.messages, { content, isQuestion, isLoading: false }]
                    setTimeout(() => resolve(), 400)
                })
            }

            // 已有 loading 中的消息，等待，每200ms尝试发一次
            const DELAY_TIME = 200
            if (this.sendingMessage) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.sendMessage(content, isQuestion).then(() => {
                            resolve()
                        })
                    }, DELAY_TIME)
                })
            }

            // loading 800ms
            const LOADING_TIME = 800
            return new Promise((resolve, reject) => {
                const oldMessages = this.messages
                this.messages = [...oldMessages, { content, isQuestion, isLoading: true }]

                this.sendingMessage = setTimeout(() => {
                    clearTimeout(this.sendingMessage)
                    this.sendingMessage = null
                    this.messages = [...oldMessages, { content, isQuestion, isLoading: false }]
                    resolve()
                }, LOADING_TIME)
            })
        },
        scrollToResultCard () {
            this.$nextTick(() => {
                document
                    .getElementById(`dialog-item-${Math.max(0, this.messages.length - 2)}`)
                    .scrollIntoView({ behavior: 'smooth' })
            })
        },
        scrollToBottom (id, config = {}) {
            this.$nextTick(() => {
                const ele = document.getElementById(id)
                const top = ele.scrollHeight
                if (config.noSmooth) {
                    ele.scrollTop = top
                    return
                }

                const scrollParams = { top, behavior: 'smooth' }
                ele.scroll(scrollParams)
            })
        },
        saveToSessionStorage () {
            sessionStorage.setItem('SELFTEST_END', 'true')
            sessionStorage.setItem(
                'SELFTEST_RESULT_DATA',
                JSON.stringify({
                    severityLevel: this.severityLevel,
                    resultContent: this.resultContent,
                    answerIndex: this.answerIndex,
                    globalData: globalData.get(),
                    ifShowBottomBtn: true
                })
            )
        },
        handleCityCode ({ cityCode }) {
            this.cityCode = cityCode
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
                const result = await httpUtils(
                    'GetPreDiagnosisConfig',
                    req,
                    'DiagnosisPreServer_NCovDiagnosis'
                )
                const hospitalConfig = JSON.parse(result.config)
                if (hospitalConfig.webConfig) {
                    const configData = hospitalConfig.webConfig
                    this.hospitalConfig = configData
                    globalData.set('hospitalConfig', configData)
                    console.log('🐞 || config: ', { ...configData })
                }
            } catch (error) {
                console.log('❌ initConfig error', error)
            }
        },
        handleNoLocation () {
            this.noLocation = true
        }
    },
    created () {
        // 手动遮罩
        this.showWhiteMask = true
        smoothscroll.polyfill()
    },
    beforeDestroy () {
        this.showWhiteMask = true
    },
    async mounted () {
        setTimeout(() => {
            this.showWhiteMask = false
        }, 50)
        const sessionMessages = JSON.parse(sessionStorage.getItem('SELFTEST_MESSAGES'))
        const selftestEnded = sessionStorage.getItem('SELFTEST_END')
        await this.initConfig()
        document.title = this.hospitalConfig.pageTitle || '新冠病毒感染肺炎自查'

        // 恢复之前的记录
        if (sessionMessages && selftestEnded === 'true') {
            const SELFTEST_RESULT_DATA = sessionStorage.getItem('SELFTEST_RESULT_DATA')
            const {
                severityLevel,
                resultContent,
                ifShowBottomBtn,
                answerIndex,
                globalData: cacheGlobalData
            } = JSON.parse(SELFTEST_RESULT_DATA)
            this.severityLevel = severityLevel
            this.resultContent = resultContent
            this.ifShowBottomBtn = ifShowBottomBtn
            this.answerIndex = answerIndex
            globalData.set('selftestResult', cacheGlobalData.selftestResult)
            // this.conclusion = conclusion

            this.scrollToBottom('chartboard', { noSmooth: true })

            this.messages = sessionMessages
        } else {
            // 请求配置内容
            // this.sendMessage(this.$i18n.t('selftest.Report_Guide_Text'), true)
            this.messages = [getQuestionItem(this.hospitalConfig.guideText || this.$i18n.t('selftest.Report_Guide_Text'))]
            this.initSelfTest()
        }

        // chrome safari 100vh问题
        document.getElementsByClassName('selftest-page')[0].style.height = `${window.innerHeight}px`
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/exam/selftest';

.white-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
}

.dialog {
    overflow-x: hidden;
}
.dialog-item {
    &.right {
        animation: 400ms fadeInRight ease;
    }
    &.left {
        animation: 400ms fadeInLeft ease;
    }
}
@keyframes fadeInLeft {
    from {
        transform: translate3d(-100%, 0, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}
@keyframes fadeInRight {
    from {
        transform: translate3d(100%, 0, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}
</style>
