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
    <div class="float-toolbtn-box" :class="[fade ? 'slideOut' : 'slideIn']">
        <div class="float-toolbtn-box-inner">
            <div class="float-toolbtn-list">
                <!-- 工具箱组件常规入口，可配置 -->
                <a class="float-toolbtn" v-if="showTool" @click="toMoreTools">
                    <span class="float-toolbtn-icon">
                        <img
                            :src="toolBoxImg"
                            alt
                        />
                    </span>
                    <span class="float-toolbtn-txt">工具箱</span>
                </a>
                <!-- 工具箱组件常规入口，可配置 -->
                <a class="float-toolbtn" v-if="showFeedback" @click="handleFeedback">
                    <span class="float-toolbtn-icon">
                        <img
                            :src="feedbackImg"
                            alt
                        />
                    </span>
                    <span class="float-toolbtn-txt">反馈</span>
                </a>
            </div>
        </div>
        <!-- 反馈 -->
        <FeedbackDialog v-if="showFeedback" :show="showFeedbackDialog" @close="closeFeedbackDialog" />
    </div>
</template>
<script>
import FeedbackDialog from './FeedbackDialog'
export default {
    props: {
        query: Object,
        reportPageId: String,
        disableDefaultFeedback: Boolean
    },
    components: {
        FeedbackDialog
    },
    data () {
        return {
            fade: false,
            topValue: 0,
            interval: null,
            showFeedbackDialog: false,
            // icon配置
            toolBoxImg: 'https://static.wecity.qq.com/wapdisease/ico-toolbox-8aa07dab8207380d5e07badf78093747.png',
            feedbackImg: 'https://static.wecity.qq.com/wapdisease/ico-feedback-c1aed0b1c91685124ee2fbf202c52c73.png'
        }
    },
    methods: {
        // 跳转更多工具
        toMoreTools () {
            // this.reportStatLog({
            //     actionType: 'event',
            //     actionName: `${this.reportPageId}.toMoreTools`
            // })
            this.$router.push({
                path: 'feiyan-more-tools',
                query: this.query
            })
        },
        // 反馈工具箱
        handleFeedback () {
            if (!this.disableDefaultFeedback) {
                this.showFeedbackDialog = true
            }
            this.$emit('feedbackClick')
        },
        // 关闭反馈窗口
        closeFeedbackDialog () {
            this.showFeedbackDialog = false
        },
        debounce (fn, delay) {
            // console.log('call debounce')
            var timer
            return function () {
                var context = this
                var args = arguments
                clearTimeout(timer)
                timer = setTimeout(function () {
                    fn.apply(context, args)
                }, delay)
            }
        },
        // 滚动监听
        scrollListener () {
            this.fade = true
        },
        scrollListener2 () {
            return this.debounce(() => {
                this.fade = false
            }, 400)
        }
    },
    mounted () {
        this.$nextTick(() => {
            document.addEventListener('scroll', this.scrollListener)
            document.addEventListener('scroll', this.scrollListener2())
        })
    },
    // 组件销毁时卸载监听器
    destroyed () {
        document.removeEventListener('scroll', this.scrollListener)
        document.removeEventListener('scroll', this.scrollListener2())
    },
    computed: {
        // 根据reportPageId读取配置
        config () {
            if (this.$route.path !== '/feiyan-act' && !this.pageConfig[`toolKit${this.reportPageId}`]) {
                return ['tool']
            } else if (this.$route.path === '/feiyan-act' && !this.pageConfig[`toolKit${this.reportPageId}`]) {
                return ['tool']
            }
            return this.pageConfig[`toolKit${this.reportPageId}`]
        },
        // 工具箱组件常规入口，可配置
        showTool () {
            return this.config && this.config.findIndex((i) => i === 'tool') > -1
        },
        // 工具箱组件常规入口，可配置
        showFeedback () {
            return this.config && this.config.findIndex((i) => i === 'feedback') > -1
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/disease/widget/common/widget-toolbtn';
</style>
