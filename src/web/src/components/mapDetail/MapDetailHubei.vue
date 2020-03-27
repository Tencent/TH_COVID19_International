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
    <div v-if="modifyChartLine.rows.length" class="ve-table-box">
        <p class="ve-tt" style="margin-top: 0;">
            {{ $t('common.New_Cases') }} - {{ province }}
            <!-- 国家口径改变，临时去掉 -->
            <span
                @click="popWin('addConfirmCaseDesc')"
                v-if="pageConfig.wording.common.dialog.addConfirmCaseDesc.show"
                class="tt-svg-ico"
                style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; font-size: 0;"
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 22 22"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g transform="translate(-35.000000, -304.000000)" fill="#ccc" fill-rule="nonzero">
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
            </span>
        </p>
        <div class="chat-tab">
            <div :class="curTab === 'confirm' ? 'cur' : ''" class="chat-tab-item" @click="switchTab('confirm')">
                <span>Confirmed</span>
            </div>
            <div :class="curTab === 'heal' ? 'cur' : ''" class="chat-tab-item" @click="switchTab('heal')">
                <span>Recovered/Deaths</span>
            </div>
        </div>
        <lung-line :data="modifyChartLine" :extend="modifyChartConfig"></lung-line>
    </div>
</template>

<script>
import LungLine from '@/components/charts/lungLine'
import { generateRowsData, createTooltipContent } from '@/components/charts/config/nanhaiConfig'
import { EventBus } from '@/utils/event-bus'

export default {
    // 湖北地图详情
    name: 'MapDetailHubei',
    components: { LungLine },
    data () {
        return {
            province: '湖北',
            curTab: 'confirm',
            confirmModifyChartLine: { rows: [] },
            healModifyChartLine: { rows: [] },
            // 曲线配置信息
            confirmModifyChartConfig: {
                // 说明配置
                legend: {
                    formatter: function (name) {
                        const legendMap = {
                            hubeiModifyConfirm: '湖北新增确诊',
                            wuhanModifyConfirm: '武汉新增确诊'
                        }
                        return legendMap[name]
                    }
                },
                // 提示配置
                tooltip: {
                    formatter: function (params) {
                        const labelMap = {
                            hubeiModifyConfirm: '湖北新增确诊',
                            wuhanModifyConfirm: '武汉新增确诊'
                        }
                        const colors = ['#DE5E5B', '#FF971F']
                        return createTooltipContent(params, labelMap, colors)
                    }
                },
                // 颜色配置
                color: ['#DE5E5B', '#FF971F']
            },
            // 曲线配置信息
            healModifyChartConfig: {
                // 说明配置
                legend: {
                    formatter: function (name) {
                        const legendMap = {
                            heal: '湖北新增治愈',
                            dead: '湖北新增死亡'
                        }
                        return legendMap[name]
                    }
                },
                // 提示配置
                tooltip: {
                    formatter: function (params) {
                        const labelMap = {
                            heal: '湖北新增治愈',
                            dead: '湖北新增死亡'
                        }
                        const colors = ['#62c298', '#888888']
                        return createTooltipContent(params, labelMap, colors)
                    }
                },
                // 颜色配置
                color: ['#62c298', '#888888']
            },
            // 确诊图例
            confirmLegends: [
                { name: '湖北新增确诊', color: '#DE5E5B', iconStyle: 'background: #DE5E5B' },
                { name: '武汉新增确诊', color: '#FF971F', iconStyle: 'background: #FF971F' }
            ],
            // 治愈/死亡图例
            healLegends: [
                { name: '湖北新增治愈', color: '#62c298', iconStyle: 'background: #62c298' },
                { name: '湖北新增死亡', color: '#888888', iconStyle: 'background: #888888' }
            ]
        }
    },
    computed: {
        // 修改趋势图配置
        modifyChartLine () {
            return this[`${this.curTab}ModifyChartLine`] || { rows: [] }
        },
        // 修改配置
        modifyChartConfig () {
            return this[`${this.curTab}ModifyChartConfig`] || {}
        },
        // 切换说明
        modifyLegends () {
            return this[`${this.curTab}Legends`] || []
        }
    },
    // 使用批量数据拉取缓存，不重复拉取数据
    // mounted () {
    //     // this.fetchHubeiData()
    // },
    methods: {
        // 通知父组件弹出窗口
        popWin (descKey) {
            EventBus.$emit('showPopWin', descKey)
        },
        // 切换tab
        switchTab (tab) {
            this.curTab = tab
            this.reportStatLog({
                actionType: 'event',
                actionName: 'province.map.switchHubeiTab.click',
                extra: { tab: tab }
            })
        },
        // 初始化值
        initData (data) {
            try {
                const { code, wuhanModifyHistory = [], hubeiModifyHistory = [] } = data
                if (code === 0) {
                    let modifyConfirm = []
                    modifyConfirm = generateRowsData(modifyConfirm, hubeiModifyHistory, 'confirm', 'hubeiModifyConfirm')
                    modifyConfirm = generateRowsData(modifyConfirm, wuhanModifyHistory, 'confirm', 'wuhanModifyConfirm')
                    this.confirmModifyChartLine = {
                        columns: ['day', 'hubeiModifyConfirm', 'wuhanModifyConfirm'],
                        rows: modifyConfirm
                    }
                    this.healModifyChartLine = {
                        columns: ['day', 'heal', 'dead'],
                        rows: hubeiModifyHistory
                    }
                }
            } catch (e) {
                console.log('getHubeiInfo 接口异常', e)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~Styles/views/disease/city-detail';
@import '~Styles/views/disease/city-detail-en';
.ve-table-box {
    margin-top: -25px !important;
}
</style>
