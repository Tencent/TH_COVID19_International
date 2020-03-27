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
    <div class="tabs-component">
        <!-- 固定 tab -->
        <div class="__tablist tab-list tab-four">
            <div
                :class="tab === 'shishitongbao' ? 'active' : ''"
                v-if="pageConfig['isShowTab1']"
                class="tab-item"
                @click="clickTab('shishitongbao')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab1_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                {{ globalConfig.wording.home['tab1_title'] }}
            </div>
            <div
                :class="tab === 'chengshiyiqing' ? 'active' : ''"
                v-if="pageConfig['isShowTab2']"
                class="tab-item"
                @click="clickTab('chengshiyiqing')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab2_1_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                {{ globalConfig.wording.home['tab2_1_title'] }}
            </div>
            <div
                :class="tab === 'haiwaiyiqing' ? 'active' : ''"
                v-if="pageConfig['isShowTab2']"
                class="tab-item"
                @click="clickTab('haiwaiyiqing')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab2_2_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                {{ globalConfig.wording.home['tab2_2_title'] }}
            </div>
            <!-- PENDING -->
            <!-- <div
                :class="tab === 'zhuanjiajiedu' ? 'active' : ''"
                v-if="pageConfig['isShowTab3']"
                class="tab-item"
                @click="clickTab('zhuanjiajiedu')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab3_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                {{ globalConfig.wording.home['tab3_title'] }}
            </div> -->
        </div>
        <!--吸顶 tab-->
        <div
            v-if="isTabFixed"
            class="tab-list tab-four"
            style="z-index: 999; position: fixed; top: -5px; left: 0; right: 0; padding-top: 5px;"
        >
            <div
                :class="tab === 'shishitongbao' ? 'active' : ''"
                v-if="pageConfig['isShowTab1']"
                class="tab-item"
                @click="clickTab('shishitongbao')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab1_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                {{ globalConfig.wording.home['tab1_title'] }}
            </div>
            <div
                :class="tab === 'chengshiyiqing' ? 'active' : ''"
                v-if="pageConfig['isShowTab2']"
                class="tab-item"
                @click="clickTab('chengshiyiqing')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab2_1_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                <!-- <div class="dot-hot" v-if="pageConfig['show_tab2_1_title_dot']"></div> -->
                {{ globalConfig.wording.home['tab2_1_title'] }}
            </div>
            <div
                :class="tab === 'haiwaiyiqing' ? 'active' : ''"
                v-if="pageConfig['isShowTab2']"
                class="tab-item"
                @click="clickTab('haiwaiyiqing')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab2_2_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                {{ globalConfig.wording.home['tab2_2_title'] }}
            </div>
            <!-- PENDING -->
            <!-- <div
                :class="tab === 'zhuanjiajiedu' ? 'active' : ''"
                v-if="pageConfig['isShowTab3']"
                class="tab-item"
                @click="clickTab('zhuanjiajiedu')"
            >
                <img
                    class="img"
                    v-if="pageConfig['show_tab3_title_dot']"
                    src="https://static.wecity.qq.com/wuhan/icon-new-47994290b109960d1e7c82e7339a12c1.png"
                />
                {{ globalConfig.wording.home['tab3_title'] }}
            </div> -->
        </div>
    </div>
</template>

<script>

export default {
    name: 'Tabs',
    props: {
        // tab吸顶状态
        isTabFixed: {
            type: Boolean,
            default: () => false
        },
        // 当前tab
        /**
         * @value shishitongbao
         * @value chengshiyiqing
         * @value haiwaiyiqing
         * @value zhuanjiajiedu (Pending)
         */
        tab: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            // 屏幕尺寸
            screenWidth: 375,
            screenHeight: 667
        }
    },
    mounted () {
        // 屏幕尺寸
        this.screenWidth = window.screen.width || document.body.offsetWidth
        this.screenHeight = window.screen.height || document.body.offsetHeight
        // 修复IOS下返回时部分组件未渲染的问题
        window.scrollTo(0, window.pageYOffset + 1)
        // 监听滚动事件
        window.addEventListener('scroll', this.onPageScroll)
    },
    // vue 销毁时候调用移除监听事件
    destroyed () {
        window.removeEventListener('scroll', this.onPageScroll)
    },
    methods: {
        // 点击tab item的事件
        clickTab (id) {
            // 当点击当前高亮的tab item 直接返回
            if (id === this.tab) return
            this.$emit('update:clickedTab', id)
        },
        onPageScroll (e) {
            // 信息流滚动的边界值， 大于就SIDE_HEIGHT加载下一个tab
            // 处理TAB
            let tablist = document.querySelector('.__tablist')
            let rect = tablist.getBoundingClientRect()
            // console.log('rect: ', rect)
            let top = rect && rect.top
            // console.log('top: ', top)
            // 奇怪bug：测试环境top值为0.25，会将吸顶状态清掉，本地环境top为-0.23正常
            if (top < 1) {
                if (!this.isTabFixed) {
                    // console.log('update:isTabFixed')
                    this.$emit('update:isTabFixed', true)
                }
            } else {
                if (this.isTabFixed) {
                    // console.log('update:isTabFixed')
                    this.$emit('update:isTabFixed', false)
                }
            }
        }
    }
}
</script>
