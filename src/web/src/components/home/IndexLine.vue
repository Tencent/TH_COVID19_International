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
<style lang="scss">
@import '~styles/views/disease/widget/currentReport/widget-chart-list-swiper';
</style>

<template>
    <div class="chart-box-list">
        <SwitchLine :dataList="chart1" />
        <SwitchLine :dataList="chart2" />
        <SwitchLine :dataList="chart3" />
        <SwitchLine :dataList="chart4" :customConfigs="['rate']" />
        <div class="explain-bar">
            <p class="txt">Updated {{ timeStr }}</p>
            <div class="explain-box" @click="popWin('dataFromDesc')">
                <svg
                    width="11px"
                    height="11px"
                    viewBox="0 0 22 22"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.495954241">
                        <g transform="translate(-35.000000, -304.000000)" class="svg-path-tips" fill-rule="nonzero">
                            <g transform="translate(35.000000, 301.000000)">
                                <path
                                    d="M11.1382112,9.00466166 C10.2928327,8.95794371 9.46594627,9.26399172 8.85464663,
                                    9.84985679 C8.27104159,10.4532457 7.96299119,11.2711912 8.00355433,12.1097047
                                    L9.40006493,12.1097047 C9.36814645,11.6298671 9.49218835,11.1525667 9.7536878,
                                    10.7490005 C10.0684165,10.357161 10.5604152,10.151762 11.0602943,10.20352
                                    C11.4683901,10.1785771 11.8689542,10.3214973 12.1691117,10.5991432 C12.4324942,
                                    10.895175 12.5701013,11.2822392 12.5527026,11.6781157 C12.5459923,12.02848
                                    12.4214138,12.3663585 12.1990798,12.6372024 L11.9773163,12.8889626 C11.3945551,
                                    13.3536799 10.8871016,13.9056744 10.4729207,14.5254043 C10.2931374,14.9178759
                                    10.2069625,15.3467475 10.2211892,15.7782112 L10.2211892,16 L11.599719,16
                                    L11.599719,15.7782112 C11.5933227,15.4714011 11.665539,15.1680581 11.8094952,
                                    14.8970503 C11.9452248,14.6411544 12.1282703,14.4133385 12.3489199,14.2256897
                                    C12.7526038,13.9072691 13.136881,13.5649832 13.4996926,13.2006658 C13.8417485,
                                    12.7319617 14.0168957,12.1621407 13.9971621,11.5822071 C14.0319065,10.8681052
                                    13.746205,10.1757494 13.2179931,9.69400521 C12.6365834,9.20991816 11.8936207,
                                    8.96366323 11.1382112,9.00466166 Z M10.9998056,17.007477 C10.7381768,16.994838
                                    10.4837146,17.0967576 10.3004843,17.2875759 C10.0998131,17.4666842 9.98959579,
                                    17.7288805 10.0007752,18.0005551 C10.0174612,18.5527396 10.4579799,18.9934407
                                    10.9998056,19 C11.2618875,19.0003602 11.5150534,18.9030028 11.7116148,18.7262659
                                    C11.9013742,18.5350648 12.0052997,18.2724803 11.998836,18.0005551 C12.0123802,
                                    17.7292272 11.9071792,17.4657516 11.7116148,17.2812101 C11.5162199,17.08943
                                    11.2519998,16.9881246 10.9810738,17.0011111 L10.9998056,17.007477 Z M11,4
                                    C16.5228475,4 21,8.4771525 21,14 C21,19.5228475 16.5228475,24 11,24 C5.4771525,
                                    24 1,19.5228475 1,14 C1,8.4771525 5.4771525,4 11,4 M11,3 C4.92486775,3 0,
                                    7.92486775 0,14 C0,20.0751322 4.92486775,25 11,25 C17.0751322,25 22,20.0751322
                                    22,14 C22,11.0826186 20.8410748,8.28472557 18.7781746,6.22182541 C16.7152744,
                                    4.15892524 13.9173814,3 11,3 Z"
                                ></path>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
import SwitchLine from '@/components/home/SwitchLine'
// 弹窗事件
import { EventBus } from '@/utils/event-bus'
import { mapState } from 'vuex'
// 图表标题和tab文案
// 兼容中英文配置
import { indexLineConfig } from '@/config/SwitchLine/index'

export default {
    /**
     * 业务组件：
     * @description 首页曲线趋势图
     * @description 包含4组轮播趋势图
     * @description 轮播趋势图实现使用SwitchLine业务组件
     * @description 趋势图实现使用EasyLine基础组件
     */
    name: 'IndexLine',
    components: {
        SwitchLine
    },
    computed: {
        ...mapState({
            info: (state) => state.initData.getHubeiInfo || null
        }),
        // 数据更新时间，文案通过配置读取
        timeStr () {
            let chinaSummary = JSON.parse(window.localStorage.chinaSummary)
            if (chinaSummary && chinaSummary.chinaTotalUpdateTime) {
                let str = chinaSummary.chinaTotalUpdateTime
                return str.substring(0, str.length - 3)
            } else {
                return ''
            }
        },
        // 全国
        chart1 () {
            return this.info
                ? [
                    {
                        title: indexLineConfig.chart1[0].title,
                        tabName: indexLineConfig.chart1[0].tabName,
                        easyData: [
                            [this.info.chinaModifyTotal, 'confirm', 'china-modify-confirm', 'day'],
                            [this.info.chinaModifyTotal, 'suspect', 'china-modify-suspect', 'day']
                        ]
                    },
                    {
                        title: indexLineConfig.chart1[1].title,
                        tabName: indexLineConfig.chart1[1].tabName,
                        easyData: [
                            [this.info.chinaHistoryTotal, 'confirm', 'china-total-confirm', 'day'],
                            [this.info.chinaHistoryTotal, 'suspect', 'china-total-suspect', 'day']
                        ]
                    },
                    {
                        title: indexLineConfig.chart1[2].title,
                        tabName: indexLineConfig.chart1[2].tabName,
                        easyData: [
                            [this.info.chinaModifyTotal, 'heal', 'china-modify-heal', 'day'],
                            [this.info.chinaModifyTotal, 'dead', 'china-modify-dead', 'day']
                        ]
                    },
                    {
                        title: indexLineConfig.chart1[3].title,
                        tabName: indexLineConfig.chart1[3].tabName,
                        easyData: [
                            [this.info.chinaHistoryTotal, 'heal', 'china-total-heal', 'day'],
                            [this.info.chinaHistoryTotal, 'dead', 'china-total-dead', 'day']
                        ]
                    }
                ]
                : []
        },
        // 湖北省外
        chart2 () {
            return this.info
                ? [
                    {
                        title: indexLineConfig.chart2[0].title,
                        tabName: indexLineConfig.chart2[0].tabName,
                        easyData: [[this.info.otherModifyHistory, 'confirm', 'other-modify-confirm', 'day']]
                    },
                    {
                        title: indexLineConfig.chart2[1].title,
                        tabName: indexLineConfig.chart2[1].tabName,
                        easyData: [[this.info.otherTotalHistory, 'confirm', 'other-total-confirm', 'day']]
                    },
                    {
                        title: indexLineConfig.chart2[2].title,
                        tabName: indexLineConfig.chart2[2].tabName,
                        easyData: [
                            [this.info.otherModifyHistory, 'heal', 'other-modify-heal', 'day'],
                            [this.info.otherModifyHistory, 'dead', 'other-modify-dead', 'day']
                        ]
                    },
                    {
                        title: indexLineConfig.chart2[3].title,
                        tabName: indexLineConfig.chart2[3].tabName,
                        easyData: [
                            [this.info.otherTotalHistory, 'heal', 'other-total-heal', 'day'],
                            [this.info.otherTotalHistory, 'dead', 'other-total-dead', 'day']
                        ]
                    }
                ]
                : []
        },
        // 湖北
        chart3 () {
            return this.info
                ? [
                    {
                        title: indexLineConfig.chart3[0].title,
                        tabName: indexLineConfig.chart3[0].tabName,
                        easyData: [[this.info.hubeiModifyHistory, 'confirm', 'hubei-modify-confirm', 'day']]
                    },
                    {
                        title: indexLineConfig.chart3[1].title,
                        tabName: indexLineConfig.chart3[1].tabName,
                        easyData: [[this.info.hubeiTotalHistory, 'confirm', 'hubei-total-confirm', 'day']]
                    },
                    {
                        title: indexLineConfig.chart3[2].title,
                        tabName: indexLineConfig.chart3[2].tabName,
                        easyData: [
                            [this.info.hubeiModifyHistory, 'heal', 'hubei-modify-heal', 'day'],
                            [this.info.hubeiModifyHistory, 'dead', 'hubei-modify-dead', 'day']
                        ]
                    },
                    {
                        title: indexLineConfig.chart3[3].title,
                        tabName: indexLineConfig.chart3[3].tabName,
                        easyData: [
                            [this.info.hubeiTotalHistory, 'heal', 'hubei-total-heal', 'day'],
                            [this.info.hubeiTotalHistory, 'dead', 'hubei-total-dead', 'day']
                        ]
                    }
                ]
                : []
        },
        // 率
        chart4 () {
            return this.info
                ? [
                    {
                        title: indexLineConfig.chart4[0].title,
                        tabName: indexLineConfig.chart4[0].tabName,
                        easyData: [
                            [this.info.chinaRateHistory, 'heal', 'heal-rate-china', 'day'],
                            [this.info.otherRateHistory, 'heal', 'heal-rate-other', 'day'],
                            [this.info.hubeiRateHistory, 'heal', 'heal-rate-hubei', 'day']
                        ]
                    },
                    {
                        title: indexLineConfig.chart4[1].title,
                        tabName: indexLineConfig.chart4[1].tabName,
                        easyData: [
                            [this.info.chinaRateHistory, 'dead', 'dead-rate-china', 'day'],
                            [this.info.otherRateHistory, 'dead', 'dead-rate-other', 'day'],
                            [this.info.hubeiRateHistory, 'dead', 'dead-rate-hubei', 'day']
                        ]
                        // popDesc: 'deadRateDesc'
                    },
                    {
                        title: indexLineConfig.chart4[2].title,
                        tabName: indexLineConfig.chart4[2].tabName,
                        easyData: [
                            [this.info.chinaRateHistory, 'heavy', 'heavy-rate-china', 'day'],
                            [this.info.otherRateHistory, 'heavy', 'heavy-rate-other', 'day'],
                            [this.info.hubeiRateHistory, 'heavy', 'heavy-rate-hubei', 'day']
                        ]
                        // popDesc: 'heavyRateDesc'
                    }
                ]
                : []
        }
    },
    // created () {},
    // mounted () {},
    methods: {
        /**
         * 数据说明弹窗可配置
         * @property popDesc
         * @example popDesc: 'heavyRateDesc'
         */
        popWin (descKey) {
            EventBus.$emit('showPopWin', descKey)
        }
    }
}
</script>
