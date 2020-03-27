<template>
    <div class="statement" id="feedbackStatement" v-if="show" @touchmove.prevent>
        <div class="statement-content statement-content--form">
            <!-- 关闭按钮 S  -->
            <a class="state-icon-close" @click.prevent="closeFeedback"></a>
            <!-- 关闭按钮 E  -->
            <div class="statement-content-bd">
                <!-- 内容分组 S  -->
                <div class="statement-content-box">
                    <h4 class="statement-content-box-tit">
                        <span>反馈意见类型</span>
                        <span class="tips-important">*</span>
                    </h4>
                    <div class="statement-content-box-bd">
                        <div class="statement-label-box">
                            <div class="statement-label-item">
                                <label class="statement-label" for="checkbox1">
                                    <input
                                        type="checkbox"
                                        name="checkbox1"
                                        v-model="communityOpinions"
                                        value="有遗漏确诊小区"
                                    />
                                    <span class="statement-label-txt">有遗漏确诊小区</span>
                                </label>
                            </div>
                            <div class="statement-label-item cur">
                                <label class="statement-label" for="checkbox2">
                                    <input
                                        type="checkbox"
                                        name="checkbox2"
                                        v-model="communityOpinions"
                                        value="小区并没有确诊"
                                    />
                                    <span class="statement-label-txt">小区并没有确诊</span>
                                </label>
                            </div>
                            <div class="statement-label-item">
                                <label class="statement-label" for="checkbox3">
                                    <input
                                        type="checkbox"
                                        name="checkbox3"
                                        v-model="communityOpinions"
                                        value="小区地址信息有误"
                                    />
                                    <span class="statement-label-txt">小区地址信息有误</span>
                                </label>
                            </div>
                            <div class="statement-label-item">
                                <label class="statement-label" for="checkbox4">
                                    <input
                                        type="checkbox"
                                        name="checkbox4"
                                        v-model="communityOpinions"
                                        value="小区坐标有误"
                                    />
                                    <span class="statement-label-txt">小区坐标有误</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="statement-form-tips">
                        <span v-show="communityError.opinions">反馈类型未选择</span>
                    </div>
                </div>
                <!-- 内容分组 E  -->
                <div class="statement-content-box">
                    <h4 class="statement-content-box-tit">
                        <span>反馈小区名称</span>
                        <span class="tips-important">*</span>
                    </h4>
                    <div class="statement-content-box-bd">
                        <div class="statement-form">
                            <div class="statement-form-row row--tips">
                                <div class="statement-form-row-inner">
                                    <div class="statement-form-cell cell--city">
                                        <input
                                            type="text"
                                            class="feedbackInput"
                                            v-model="communityCityName"
                                            maxlength="20"
                                            placeholder="请输入城市"
                                        />
                                    </div>
                                    <div class="statement-form-cell">
                                        <input
                                            type="text"
                                            class="feedbackInput"
                                            v-model="communityName"
                                            maxlength="20"
                                            placeholder="请输入小区名称"
                                        />
                                    </div>
                                </div>
                                <div class="statement-form-tips">
                                    <span v-show="communityError.cityName && !communityError.name">所在城市未填写</span>
                                    <span v-show="communityError.name && !communityError.cityName">小区名称未填写</span>
                                    <span v-show="communityError.name && communityError.cityName"
                                        >所在城市及小区名称未填写</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="statement-content-box">
                    <h4 class="statement-content-box-tit">
                        <span>小区详细地址</span>
                    </h4>
                    <div class="statement-content-box-bd">
                        <div class="statement-form">
                            <div class="statement-form-row">
                                <div class="statement-form-row-inner">
                                    <div class="statement-form-cell">
                                        <input
                                            type="text"
                                            class="feedbackInput"
                                            v-model="communityAddress"
                                            placeholder="XX市XX区XX路100号"
                                        />
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="statement-form-tips">
                                  小区名称未填写
              </div>-->
                        </div>
                    </div>
                </div>
                <div class="statement-content-box">
                    <h4 class="statement-content-box-tit">
                        <span>反馈意见权威来源</span>
                    </h4>
                    <div class="statement-content-box-bd">
                        <div class="statement-form">
                            <div class="statement-form-row">
                                <div class="statement-form-row-inner">
                                    <div class="statement-form-cell">
                                        <input
                                            type="text"
                                            class="feedbackInput"
                                            v-model="communitySource"
                                            placeholder="网页链接/新闻/组织"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 禁用状态：btn disabled  -->
            <!-- <div class="btn" @click="hideStatement">知道了</div> -->
            <div class="btn" :class="[feedbackDisabled ? 'disabled' : '']" @click="submitFeedback">提交</div>
        </div>
    </div>
</template>
<script>
import logUtils from '@/utils/log_util'
import weui from 'weui.js'
import axios from 'axios'
import { MAP_REQUEST_BASEURL } from '@/config/constant'

export default {
    data () {
        return {
            communityOpinions: [],
            communityCityName: '',
            communityName: '',
            communityAddress: '',
            communitySource: '',
            communityError: {
                opinions: false,
                cityName: false,
                name: false
            }
        }
    },
    props: {
        show: Boolean,
        commuCityName: String,
        commuAddress: String,
        commuName: String
    },
    methods: {
        closeFeedback () {
            this.resetFeedback()
            this.$emit('close')
            this.reportStatLog({
                actionType: 'event',
                actionName: 'feiyanActivity.closeFeedback'
            })
        },
        resetFeedback () {
            this.communityOpinions = []
            this.communityCityName = ''
            this.communityName = ''
            this.communityAddress = ''
            this.communitySource = ''
            this.communityError = {
                opinions: false,
                cityName: false,
                name: false
            }
        },
        async submitFeedback () {
            this.communityError = {
                opinions: false,
                cityName: false,
                name: false
            }
            let errorFlag = false
            if (this.communityOpinions.length === 0) {
                this.communityError.opinions = true
                errorFlag = true
            }
            if (this.communityCityName === '') {
                this.communityError.cityName = true
                errorFlag = true
            }
            if (this.communityName === '') {
                this.communityError.name = true
                errorFlag = true
            }
            if (errorFlag) {
                return
            }

            let user = logUtils.getUserId()
            this.reportStatLog({
                actionType: 'event',
                actionName: 'feiyanActivity.submitFeedback'
            })
            try {
                const [feedbackRsp] = await Promise.all([
                    axios.post(`${MAP_REQUEST_BASEURL}/feverHosp/feedbackCommit`, {
                        user,
                        communityOpinions: this.communityOpinions,
                        communityCityName: this.communityCityName,
                        communityName: this.communityName,
                        communityAddress: this.communityAddress,
                        communitySource: this.communitySource
                    })
                ])
                let rsp = feedbackRsp.data
                let that = this
                if (rsp.retcode === 0) {
                    weui.toast('感谢您的宝贵意见', {
                        duration: 2000,
                        callback: function () {
                            // that.isShowFeedback = false;
                            that.$emit('feedbak-success')
                            that.closeFeedback()
                            that.resetFeedback()
                        }
                    })
                } else {
                    weui.toast('发生错误，请重试', {
                        duration: 2000,
                        callback: function () {
                            console.log('close')
                        }
                    })
                }
            } catch (e) {
                weui.toast('发生错误，请重试', {
                    duration: 2000,
                    callback: function () {
                        console.log('close')
                    }
                })
                // todo: 错误处理
                console.log(e)
            }
        }
    },
    watch: {
        commuCityName (val, oldVal) {
            console.log('cccc', val, oldVal)
            this.communityCityName = val
        },
        commuName (val, oldVal) {
            this.communityName = val
        },
        commuAddress (val, oldVal) {
            this.communityAddress = val
        },
        show (show) {
            if (show) {
                if (!this.commuCityName && !this.commuAddress && !this.commuName) {
                    this.resetFeedback()
                }
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'feiyanActivity.showFeedback'
                })
                // 解决 ios 关闭键盘按钮点击不了
                this.$nextTick(() => {
                    let feedbackInput = document.getElementsByClassName('feedbackInput')
                    let feedbackStatement = document.getElementById('feedbackStatement')
                    for (let i = 0, len = feedbackInput.length; i < len; i++) {
                        feedbackInput[i].onblur = function () {
                            window.scroll(0, 0)
                            feedbackStatement.scroll(0, 0)
                            document.body.scroll(0, 0)
                        }
                    }
                })
            }
        }
    },
    computed: {
        feedbackDisabled () {
            return this.communityOpinions.length === 0 || !this.communityCityName || !this.communityName
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/disease/widget/nearby/widget-statement';
</style>
