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
    <ve-line
        :data="lineData"
        :width="width"
        :height="height"
        :colors="colors"
        :extend="config"
        :tooltip-visible="true"
        :legend-visible="false"
        :style="isReport ? '' : 'margin-top: 20px; padding-bottom:20px'"
    >
    </ve-line>
</template>

<script>
// LUNGLINE IS TO BE DROPED
// COMPONENT EASYLINE IS RECOMMENDED
import VeLine from 'v-charts/lib/line.common'
import merge from 'merge-dictionaries'
import { createTooltipContent } from '@/components/charts/config/nanhaiConfig'

export default {
    name: 'lungLine',
    components: {
        VeLine
    },
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        width: {
            type: String,
            default: `${window.innerWidth * 0.9}px`
        },
        height: {
            type: String,
            default: `${(window.innerWidth * 0.9 * 10) / 21}px`
        },
        // 配色集
        colors: {
            type: Array,
            default: () => ['#DE5E5B', '#FFA317', '#333333']
        },
        // extend config
        extend: {
            type: Object,
            default: () => {}
        },
        isReport: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            config: {
                xAxis: {
                    boundaryGap: false,
                    axisLabel: {
                        fontSize: 9,
                        showMaxLabel: true,
                        padding: [0, 1.5, 0, 0]
                    }
                },
                yAxis: {
                    // 最小刻度间隔
                    minInterval: 1,
                    splitLine: {
                        lineStyle: {
                            color: '#CACACA',
                            width: 0.5
                        }
                    },
                    // 纵坐标样式
                    axisLabel: {
                        fontSize: 9
                    }
                },
                // 图例
                legend: {
                    show: true,
                    icon: 'roundRect',
                    itemWidth: 9,
                    itemHeight: 9,
                    bottom: 0,
                    // 待优化
                    formatter: function (name) {
                        const legendMap = {
                            confirm: '累计确诊',
                            suspect: '现有疑似',
                            heal: '累计治愈',
                            dead: '累计死亡',
                            heavy: '累计在治疗重症'
                        }
                        return legendMap[name]
                    }
                },
                grid: {
                    left: '0%',
                    right: '8%',
                    bottom: '15%',
                    top: '5%',
                    containLabel: true
                },
                series: {
                    type: 'line',
                    // symbol: 'circle',
                    symbolSize: 1,
                    lineStyle: { width: 1.5 }
                },
                itemStyle: {
                    borderColor: '#fff'
                },
                emphasis: {
                    itemStyle: {
                        opacity: 0
                    }
                },
                // 待优化
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    backgroundColor: '#fff',
                    axisPointer: {
                        lineStyle: {
                            type: 'dotted',
                            color: '#888888'
                        }
                    },
                    textStyle: {
                        color: '#333',
                        fontSize: 9,
                        lineHeight: 20
                    },
                    extraCssText:
                        `border: 1px solid #DFDFDF;box-shadow: 0 2px 14px 0 rgba(0,0,0,0.05);
                        border-radius: 6px; padding: 6px; text-align: left; z-index: 900;`,
                    formatter: function (params) {
                        const labelMap = {
                            confirm: '累计确诊',
                            suspect: '现有疑似',
                            heal: '累计治愈',
                            dead: '累计死亡',
                            heavy: '累计在治疗重症'
                        }
                        const colors = ['#DE5E5B', '#FFA317', '#000000']
                        const ret = createTooltipContent(params, labelMap, colors)
                        return ret
                    }
                }
            }
        }
    },
    computed: {
        lineData () {
            let lineData = { columns: this.data.columns }
            let rows = JSON.parse(JSON.stringify(this.data.rows))
            rows.forEach((item) => {
                for (let key in item) {
                    if (item[key] === -999999) {
                        delete item[key]
                    }
                }
            })
            lineData.rows = rows
            return lineData
        }
    },
    watch: {
        extend () {
            this.config = merge(this.config, this.extend)
        },
        data () {
            // 数据更新，重置横坐标显示
            this.setaxisLabelInterval()
        }
    },
    mounted () {
        this.setaxisLabelInterval()
        /**
         * 合并配置（深度遍历）
         */
        this.config = merge(this.config, this.extend)
    },
    methods: {
        /**
         * @description 优化横坐标显示
         * @description 设置横坐标最大显示个数，
         * @description 并且显示最后一项数值的横坐标
         * @param {number} maxNum 横坐标最大显示个数
         */
        setaxisLabelInterval () {
            let maxNum = 8
            let length = this.data.rows.length
            let delta = Math.ceil(length / maxNum)
            this.config.xAxis.axisLabel.interval = (index, value) => {
                return (index + 1) % delta === length % delta
            }
        }
    }
}
</script>
