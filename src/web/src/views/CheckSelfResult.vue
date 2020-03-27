<template>
    <div class="container" v-if="!isLoading">
        <div class="article-box">
            <div class="article-box-hd">
                <h3 class="article-box-tit">根据您的回答，您患新冠肺炎可能性：</h3>
            </div>
            <div class="article-box-bd">
                <div class="article-box-group">
                    <h4 class="article-box-group-tit txt-error" v-if="checkSelfResult.level === 1">风险较高</h4>
                    <h4 class="article-box-group-tit txt-wraning" v-if="checkSelfResult.level === 0">风险较低</h4>
                </div>
            </div>
        </div>
        <div class="article-box">
            <div class="article-box-hd">
                <h3 class="article-box-tit">医院就诊建议：</h3>
            </div>
            <div class="article-box-bd">
                <div class="article-box-group">
                    <div class="article-box-group-item">
                        <p>{{ checkSelfResult.advice === '' ? '无' : checkSelfResult.advice }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footbar-btn-full">
            <span class="footbar-btn" @click="toHosIndex">返回医院主页</span>
        </div>
        <div class="notification" v-if="isShowError">
            <div class="notification-cont">
                <i class="notification-icon"></i>
                <div class="notification-text">
                    <h3>{{ error.title }}</h3>
                    <p>{{ error.desc }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { MAP_REQUEST_BASEURL } from '@/config/constant'
import logUtils from '@/utils/log_util'
export default {
    name: 'checkSelfResult',
    data () {
        return {
            checkSelfResult: {},
            isLoading: true,
            isShowError: false,
            error: {
                title: '发生错误',
                desc: '请稍后重试'
            }
        }
    },
    async created () {
        document.title = '疑似症状自查及就诊指引'
        const loadingToast = this.$loadingToast({
            message: '加载中',
            showTime: 30000
        })
        try {
            let hospitalId = this.$route.query.id
            let user = logUtils.getUserId()
            let selected = sessionStorage.getItem('check_self_qa')
            if (!selected) {
                this.isShowError = true
                return
            }
            const [rsp] = await Promise.all([
                axios.post(`${MAP_REQUEST_BASEURL}/feverHosp/feverLevelSort?hospitalId=${hospitalId}`, {
                    user,
                    answers: JSON.parse(selected)
                })
            ])
            let { retcode, retmsg, data } = rsp.data
            if (retcode === 0) {
                this.checkSelfResult = data
            } else {
                this.error.title = retmsg
                this.isShowError = true
                return
            }

            loadingToast.close()
            this.isLoading = false
        } catch (e) {
            this.$toast({
                type: 'default',
                message: '出现了小问题，请稍后重试',
                showTime: 1500
            })
            console.log(e)
        }
    },
    methods: {
        toHosIndex () {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'CheckSelfResult.toHospital'
            })
            this.$router.push({
                path: '/hospital',
                query: this.$route.query
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/disease/doctors/guide';
@import '~styles/components/notificaton';
</style>
