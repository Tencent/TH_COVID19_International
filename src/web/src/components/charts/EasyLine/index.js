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
import { LOCALE } from '@/config'
// eslint-disable-next-line camelcase
import legend_zh from '@/lang/zh/legend_zh.js'
// eslint-disable-next-line camelcase
import legend_en from '@/lang/en/legend_en.js'
import { colorsMap } from './config/color.js'

const legendMap = {
    zh: legend_zh,
    en: legend_en
}[LOCALE]

/**
 * @description 获取颜色集合
 * @param {*} columns 根据columns的值和colorsMap表生成颜色集合
 */
export function getColors (columns = ['day', 'confirm', 'suspect', 'dead']) {
    let colors = []
    columns.forEach((v) => {
        if (colorsMap[v]) {
            colors.push(colorsMap[v])
        } else {
            let keys = v.split('-').reverse()
            for (let k of keys) {
                if (colorsMap[k]) {
                    colors.push(colorsMap[k])
                    break
                }
            }
        }
    })
    return colors
}

export function createTooltipContent (params, labelMap, colors, isRate) {
    let ret = '<div>'
    const titleContent = params[0] ? params[0].name : new Date().getMonth() + 1 + '.' + new Date().getDate()
    const title = '<div style="color: #888888; line-height: 20px">' + titleContent + '</div>'
    ret += title
    params.forEach(function (parm, index) {
        const color = colors[index] || '#333'
        const label = parm && parm.seriesName ? labelMap[parm.seriesName] : ''
        let value = parm && parm.value && parm.value[1] !== null ? parm.value[1] : 'TO Be Updated'
        if (value !== 'TO Be Updated' && isRate) value = `${Math.round(value * 10000) / 100}%`
        const row = `
        <div style="line-height: 20px;">
            <div style="display:inline-block; vertical-align: middle; background: ${color};
            width: 4px; height: 4px; border-radius: 50%; margin-right: 10px "></div>
            <div style="display:inline-block; vertical-align: middle; line-height: 20px; ">
            ${label}:  <span style="color: ${color}">${value}</span>
            </div>
        </div>
        `
        ret += row
    })
    ret += '</div>'
    return ret
}

/**
 * @param {*} rows
 * @param {*} originData 原始数据，无副作用
 * @param {*} originKey 原始数据key
 * @param {*} targetKey 生成数据key
 * @param {*} _axisKey 缺省值为_index
 */
export function generateRowsData (rows = [], originData = [], originKey, targetKey, _axisKey) {
    let rowsObj = {}
    rows.forEach((item) => {
        rowsObj[item[_axisKey]] = item
    })
    originData.forEach((item, index) => {
        let _item = JSON.parse(JSON.stringify(item))
        _item._index = index
        let _axisValue = _item[_axisKey]
        if (rowsObj[_axisValue]) {
            rowsObj[_axisValue][targetKey] = _item[originKey]
        } else {
            rowsObj[_axisValue] = {}
            rowsObj[_axisValue][_axisKey] = _axisValue
            rowsObj[_axisValue][targetKey] = _item[originKey]
        }
    })
    rows = Object.values(rowsObj)
    rows.sort((a, b) => a.day - b.day)
    return rows
}

export function getExtend (fn, columns, rows) {
    return EXTEND_FN[fn] ? EXTEND_FN[fn](columns, rows) : {}
}

const EXTEND_FN = {
    /**
     * 默认配置
     */
    default: (columns, rows) => {
        return {
            grid: {
                left: '1%',
                right: '3.5%',
                bottom: '7%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                boundaryGap: false,
                axisLabel: {
                    fontSize: 9,
                    showMaxLabel: true,
                    padding: [0, 1.5, 0, 0],
                    interval: (index) => {
                        let maxNum = 8
                        let length = rows.length
                        if (length <= maxNum) return true
                        let delta = Math.ceil(length / maxNum)
                        return (index + 1) % delta === length % delta
                    }
                }
            },
            yAxis: {
                minInterval: 1,
                splitLine: {
                    lineStyle: {
                        color: '#CACACA',
                        width: 0.5
                    }
                },
                axisLabel: {
                    fontSize: 9
                }
            },
            legend: {
                show: true,
                icon: 'roundRect',
                itemWidth: 9,
                itemHeight: 9,
                top: 0,
                right: '2%',
                textStyle: {
                    color: 'rgba(1,6,4,0.57)',
                    fontSize: 10
                },
                formatter: (name) => legendMap[name]
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                triggerOn: 'click',
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
                formatter: (params) => createTooltipContent(params, legendMap, getColors(columns))
            },
            itemStyle: {
                borderColor: '#fff'
            },
            emphasis: {
                itemStyle: {
                    opacity: 0
                }
            },
            series: {
                type: 'line',
                symbolSize: 1,
                lineStyle: { width: 1.5 }
            },
            color: getColors(columns)
        }
    },
    /**
     * Add custom configs below
     * Custom config selected will be merged to the default config
     */
    demo: (columns, rows) => {
        return {}
    },
    /**
     * 百分率曲线拓展配置
     * 优化y轴数值单位
     * 优化tooltip显示
     */
    rate: (columns, rows) => {
        return {
            yAxis: {
                minInterval: 0.01,
                axisLabel: {
                    formatter: (v) => {
                        return `${v * 100}%`
                    }
                }
            },
            tooltip: {
                formatter: (params) => createTooltipContent(params, legendMap, getColors(columns), true)
            }
        }
    },
    /**
     * 图例居中拓展配置
     */
    centerLegend: (columns, rows) => {
        return {
            grid: {
                left: '5%',
                bottom: '15%'
            },
            legend: {
                bottom: 0,
                top: 'auto',
                right: 'auto'
            }
        }
    },
    /**
     * 单图例图表拓展配置
     * 优化规则：图例不可取消选择
     */
    singleLegend: (columns, rows) => {
        return {
            legend: {
                selectedMode: false
            }
        }
    }
}
