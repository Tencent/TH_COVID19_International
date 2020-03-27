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
    <div v-if="dataList.length" class="chart-box-item">
        <swiper :options="swiperOption" ref="_chart-swiper" class="chart-swiper">
            <swiper-slide v-for="(item, index) in dataList" :key="index">
                <div class="chart-box-wrap">
                    <div class="tt-bar">
                        <p class="tt">{{ item.title }}</p>
                        <span v-if="item.popDesc" @click="popWin(item.popDesc)">
                            <svg
                                width="12px"
                                height="12px"
                                viewBox="0 0 22 22"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                            >
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.495954241">
                                    <g
                                        transform="translate(-35.000000, -304.000000)"
                                        class="svg-path-tips"
                                        fill-rule="nonzero"
                                    >
                                        <g transform="translate(35.000000, 301.000000)">
                                            <path
                                                d="M11.1382112,9.00466166 C10.2928327,8.95794371 9.46594627,9.26399172
                                                8.85464663,9.84985679 C8.27104159,10.4532457 7.96299119,11.2711912
                                                8.00355433,12.1097047 L9.40006493,12.1097047 C9.36814645,11.6298671
                                                9.49218835,11.1525667 9.7536878,10.7490005 C10.0684165,10.357161
                                                10.5604152,10.151762 11.0602943,10.20352 C11.4683901,10.1785771
                                                11.8689542,10.3214973 12.1691117,10.5991432 C12.4324942,10.895175
                                                12.5701013,11.2822392 12.5527026,11.6781157 C12.5459923,12.02848
                                                12.4214138,12.3663585 12.1990798,12.6372024 L11.9773163,12.8889626
                                                C11.3945551,13.3536799 10.8871016,13.9056744 10.4729207,14.5254043
                                                C10.2931374,14.9178759 10.2069625,15.3467475 10.2211892,15.7782112
                                                L10.2211892,16 L11.599719,16 L11.599719,15.7782112 C11.5933227,
                                                15.4714011 11.665539,15.1680581 11.8094952,14.8970503 C11.9452248,
                                                14.6411544 12.1282703,14.4133385 12.3489199,14.2256897 C12.7526038,
                                                13.9072691 13.136881,13.5649832 13.4996926,13.2006658 C13.8417485,
                                                12.7319617 14.0168957,12.1621407 13.9971621,11.5822071 C14.0319065,
                                                10.8681052 13.746205,10.1757494 13.2179931,9.69400521 C12.6365834,
                                                9.20991816 11.8936207,8.96366323 11.1382112,9.00466166 Z M10.9998056,
                                                17.007477 C10.7381768,16.994838 10.4837146,17.0967576 10.3004843,
                                                17.2875759 C10.0998131,17.4666842 9.98959579,17.7288805 10.0007752,
                                                18.0005551 C10.0174612,18.5527396 10.4579799,18.9934407 10.9998056,
                                                19 C11.2618875,19.0003602 11.5150534,18.9030028 11.7116148,18.7262659
                                                C11.9013742,18.5350648 12.0052997,18.2724803 11.998836,18.0005551
                                                C12.0123802,17.7292272 11.9071792,17.4657516 11.7116148,17.2812101
                                                C11.5162199,17.08943 11.2519998,16.9881246 10.9810738,17.0011111
                                                L10.9998056,17.007477 Z M11,4 C16.5228475,4 21,8.4771525 21,14
                                                C21,19.5228475 16.5228475,24 11,24 C5.4771525,24 1,19.5228475
                                                1,14 C1,8.4771525 5.4771525,4 11,4 M11,3 C4.92486775,3 0,7.92486775
                                                0,14 C0,20.0751322 4.92486775,25 11,25 C17.0751322,25 22,20.0751322
                                                22,14 C22,11.0826186 20.8410748,8.28472557 18.7781746,6.22182541
                                                C16.7152744,4.15892524 13.9173814,3 11,3 Z"
                                            ></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div class="chart-box">
                        <EasyLine
                            class="chart-img"
                            :easyData="item.easyData"
                            :customConfigs="currentCustomConfigs"
                            :height="height"
                            :width="width"
                        />
                    </div>
                </div>
            </swiper-slide>
            <div
                @click="reportNavBtnClick('prev')"
                class="swiper-button-prev swiper-button-black"
                slot="button-prev"
            ></div>
            <div
                @click="reportNavBtnClick('next')"
                class="swiper-button-next swiper-button-black"
                slot="button-next"
            ></div>
        </swiper>
        <!-- 分页按钮 -->
        <div class="chart-pagination">
            <div
                v-for="(item, index) in dataList"
                :key="index"
                :class="activeIndex === index ? 'active' : ''"
                class="pagination"
                @click="switchTabClick(index)"
                style="white-space: pre-line;"
            >
                {{ item.tabName }}
            </div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import EasyLine from '@/components/charts/EasyLine/line'
import { EventBus } from '@/utils/event-bus'

export default {
    name: 'SwitchLine',
    components: {
        swiper,
        swiperSlide,
        EasyLine
    },
    props: {
        // 默认选择的tab序号
        defaultIndex: {
            type: Number,
            default: 0
        },
        dataList: {
            type: Array,
            default: () => []
        },
        customConfigs: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        // customConfigs merge
        currentCustomConfigs () {
            if (this.dataList[this.activeIndex].customConfigs) {
                return [...this.customConfigs, ...this.dataList[this.activeIndex].customConfigs]
            } else {
                return this.customConfigs
            }
        }
    },
    data () {
        return {
            activeIndex: 0,
            // vue-awesome-swiper的on事件监听有坑
            // 部分swiper事件不触发
            swiperOption: {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    slideChange: () => {
                        this.activeIndex = this.$refs['_chart-swiper'].swiper.activeIndex
                        // 已区分上报事件：点击tab，点击左右导航按钮，划动切换
                        // this.reportStatLog({
                        //   actionType: 'event',
                        //   actionName: 'index.switchLine.slideChange',
                        //   extra: {
                        //     title: this.dataList[this.activeIndex].title
                        //   }
                        // })
                    },
                    touchEnd: () => {
                        setTimeout(() => {
                            let extra = {
                                title: this.dataList[this.activeIndex].title,
                                direction: this.$refs['_chart-swiper'].swiper.swipeDirection
                            }
                            if (!extra.direction) return
                            // console.log(extra)
                            // this.reportStatLog({
                            //     actionType: 'event',
                            //     actionName: 'index.switchLine.slideEnd',
                            //     extra
                            // })
                        }, 0)
                    }
                }
            },
            width: `${window.innerWidth * 0.82}px`,
            height: `${window.innerWidth * 0.54}px`
        }
    },
    methods: {
        switchTabClick (index) {
            this.activeIndex = index
            this.$refs['_chart-swiper'].swiper.slideTo(index)
            setTimeout(() => {
                let extra = {
                    title: this.dataList[index].title,
                    tab: this.dataList[index].tabName
                }
                console.log(extra)
                // this.reportStatLog({
                //     actionType: 'event',
                //     actionName: 'index.switchLine.tabClick',
                //     extra
                // })
            }, 0)
        },
        reportNavBtnClick (btn) {
            // console.log(btn)
            setTimeout(() => {
                let index = this.$refs['_chart-swiper'].swiper.activeIndex
                let extra = {
                    title: this.dataList[index].title,
                    navBtn: btn
                }
                console.log(extra)
                // this.reportStatLog({
                //     actionType: 'event',
                //     actionName: 'index.switchLine.navBtnClick',
                //     extra
                // })
            }, 0)
        },
        popWin (descKey) {
            EventBus.$emit('showPopWin', descKey)
        }
    },
    mounted () {
        this.activeIndex = this.defaultIndex
        // 某些机型上偶现不会更新视图，怀疑是组件层级太深的原因
        this.$forceUpdate()
    }
}
</script>
