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
import chinaCityName from '@/config/chinaCityName'

let defaultVisualMap = {
    // 左下角的颜色区域
    type: 'piecewise', // 定义为分段型 visualMap
    min: 0,
    max: 100000,
    itemWidth: 10,
    itemHeight: 10,
    bottom: 10,
    left: 'center',
    // right: 0,
    textGap: 2,
    itemGap: 8,
    orient: 'horizontal',
    pieces: [
        // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
        { gte: 1000, label: '1000+', color: '#9A0000' },
        { gte: 100, lt: 999, label: '100-999', color: '#C7211C' },
        { gte: 10, lt: 100, label: '10-99', color: '#E16F5D' },
        { gte: 1, lt: 10, label: '1-9', color: '#FEB99B' }
    ],
    textStyle: {
        fontSize: 8,
        color: '#888'
    },
    hoverLink: false
}

let defaultVisualMapReport = {
    show: false,
    type: 'piecewise',
    min: 0,
    max: 100000
}

let confirmPiecesPhaseOne = [
    { gte: 100, lt: 999, label: '100-999', color: '#C7211C' },
    { gte: 10, lt: 100, label: '10-99', color: '#E16F5D' },
    { gte: 1, lt: 10, label: '1-9', color: '#FEB99B' }
]
let confirmPiecesPhaseTwo = [
    { gte: 1000, label: '1000+', color: '#9A0000' },
    { gte: 500, lt: 1000, label: '500-999', color: '#C7211C' },
    { gte: 100, lt: 500, label: '100-499', color: '#E16F5D' },
    { gte: 10, lt: 100, label: '10-99', color: '#FEB99B' },
    { gte: 1, lt: 10, label: '1-9', color: '#FED89B' }
]
let confirmPiecesPhaseThree = [
    { gte: 10000, label: '10000+', color: '#9A0000' },
    { gte: 1000, lt: 10000, label: '1000-9999', color: '#C7211C' },
    { gte: 500, lt: 1000, label: '500-999', color: '#E16F5D' },
    { gte: 100, lt: 500, label: '100-499', color: '#FEB99B' },
    { gte: 1, lt: 100, label: '1-99', color: '#FED89B' }
]

let healPiecesPhaseOne = [
    { gte: 100, lt: 999, label: '100-999', color: '#0DA1B4' },
    { gte: 10, lt: 100, label: '10-99', color: '#00B9D1' },
    { gte: 1, lt: 10, label: '1-9', color: '#71DCEA' },
    { gte: 0, lt: 0, label: '0', color: '#EBFCFE ' }
]
let healPiecesPhaseTwo = [
    { gte: 1000, label: '1000+', color: '#0390A2 ' },
    { gte: 500, lt: 1000, label: '500-999', color: '#0DA1B4' },
    { gte: 100, lt: 500, label: '100-499', color: '#00B9D1' },
    { gte: 10, lt: 100, label: '10-99', color: '#71DCEA' },
    { gte: 1, lt: 10, label: '1-9', color: '#D4EDF0' },
    { gte: 0, lt: 0, label: '0', color: '#EBFCFE ' }
]
let healPiecesPhaseThree = [
    { gte: 10000, label: '10000+', color: '#0390A2 ' },
    { gte: 1000, lt: 10000, label: '1000-9999', color: '#0DA1B4' },
    { gte: 500, lt: 1000, label: '500-999', color: '#00B9D1' },
    { gte: 100, lt: 500, label: '100-499', color: '#71DCEA' },
    { gte: 1, lt: 100, label: '1-99', color: '#D4EDF0' },
    { gte: 0, lt: 0, label: '0', color: '#EBFCFE ' }
]

let deafultChartExtend = {
    selectedMode: 'single',
    legend: {
        show: false // 图例展示
    },
    aspectScale: 0.76,
    series: {
        type: 'map',
        roam: false,
        label: {
            normal: {
                show: false
            }
        },
        showLegendSymbol: false, // 去掉地图小圆点
        itemStyle: {
            normal: {
                areaColor: '#ffffff',
                borderColor: '#888888'
            },
            emphasis: {
                // areaColor: 'red'
                label: {
                    show: false,
                    color: '#000000'
                }
            }
        }
    }
}

let provinceConfigMap = {
    world: {
        chartExtendExtra: {
            roam: false,
            zoom: 1.2,
            // 长宽比
            aspectScale: 0.75,
            // tooltip: {
            //   trigger: 'item',
            //   showDelay: 0,
            //   transitionDuration: 0.2,
            //   formatter: function (params) {
            //     if (params.data) {
            //       return params.name + '<br/>' + '累计确诊: ' + params.value;
            //     }
            //   }
            // },
            series: {
                showLegendSymbol: false, // 去掉地图小圆点
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#ffffff',
                        borderColor: '#888888'
                    },
                    // 定制地图选中区域的样式
                    emphasis: {
                        // areaColor: 'red',
                        label: {
                            color: '#000000',
                            fontSize: 8,
                            show: true,
                            padding: [0, 0, 0, 15]
                        }
                    }
                }
            }
        },
        visualMapExtra: {
            orient: 'horizontal',
            bottom: 0,
            show: false,
            left: 'center',
            textGap: 2,
            itemGap: 8
        }
    },
    Japan: {
        chartExtendExtra: {
            selectedMode: false,
            series: {
                showLegendSymbol: false, // 去掉地图小圆点
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#ffffff',
                        borderColor: '#888888'
                    },
                    // 定制地图选中区域的样式
                    emphasis: {
                        // areaColor: 'red',
                        label: {
                            color: '#000',
                            fontSize: 10,
                            show: true,
                            formatter (params) {
                                return params.city || ''
                            },
                            padding: [0, 0, 0, 15]
                        }
                    }
                }
            }
        }
    },
    'South Korea': {
        chartExtendExtra: {
            selectedMode: false,
            series: {
                showLegendSymbol: false, // 去掉地图小圆点
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#ffffff',
                        borderColor: '#888888'
                    },
                    // 定制地图选中区域的样式
                    emphasis: {
                        // areaColor: 'red',
                        label: {
                            color: '#000',
                            fontSize: 10,
                            show: true,
                            formatter (params) {
                                return params.city || ''
                            },
                            padding: [0, 0, 0, 15]
                        }
                    }
                }
            }
        }
    },
    Italy: {
        chartExtendExtra: {
            selectedMode: false,
            series: {
                showLegendSymbol: false, // 去掉地图小圆点
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#ffffff',
                        borderColor: '#888888'
                    },
                    // 定制地图选中区域的样式
                    emphasis: {
                        // areaColor: 'red',
                        label: {
                            color: '#000',
                            fontSize: 10,
                            show: true,
                            formatter (params) {
                                return params.city || ''
                            },
                            padding: [0, 0, 0, 15]
                        }
                    }
                }
            }
        }
    },
    USA: {
        chartExtendExtra: {
            selectedMode: false,
            series: {
                showLegendSymbol: false, // 去掉地图小圆点
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#ffffff',
                        borderColor: '#888888'
                    },
                    // 定制地图选中区域的样式
                    emphasis: {
                        // areaColor: 'red',
                        label: {
                            color: '#000',
                            fontSize: 10,
                            show: true,
                            formatter (params) {
                                return params.city || ''
                            },
                            padding: [0, 0, 0, 15]
                        }
                    }
                }
            }
        }
    },
    Iran: {
        chartExtendExtra: {
            selectedMode: false,
            series: {
                showLegendSymbol: false, // 去掉地图小圆点
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#ffffff',
                        borderColor: '#888888'
                    },
                    // 定制地图选中区域的样式
                    emphasis: {
                        // areaColor: 'red',
                        label: {
                            color: '#000',
                            fontSize: 10,
                            show: true,
                            formatter (params) {
                                return params.city || ''
                            },
                            padding: [0, 0, 0, 15]
                        }
                    }
                }
            }
        }
    },
    china: {
        visualMapExtra: {
            orient: 'vertical',
            bottom: 35,
            left: 0,
            itemGap: 3
        },
        chartExtendExtra: {
            selectedMode: 'single',
            legend: {
                show: false // 图例展示
            },
            zoom: 1.25,
            center: [104.5, 33],
            series: {
                nameMap: chinaCityName,
                type: 'map',
                map: 'china',
                roam: false,
                label: {
                    normal: {
                        show: false,
                        fontSize: 8
                    }
                },
                showLegendSymbol: false, // 去掉地图小圆点
                itemStyle: {
                    normal: {
                        areaColor: '#ffffff',
                        borderColor: '#888888'
                    },
                    // 定制地图选中区域的样式
                    emphasis: {
                        // areaColor: 'red',
                        label: {
                            color: '#000000'
                        }
                    }
                }
            }
        }
    },
    Hainan: {
        chartExtendExtra: {
            roam: true,
            zoom: 6,
            // layoutCenter: ['0%', '10%'],
            center: [109.525499, 19.04404],
            // 长宽比
            aspectScale: 0.85
        }
    },
    Anhui: {
        chartExtendExtra: {
            aspectScale: 0.75
        }
    },
    Hunan: {
        chartExtendExtra: {
            aspectScale: 0.8,
            zoom: 0.8,
            center: [112, 27]
        }
    },
    Hubei: {
        chartExtendExtra: {
            zoom: 1.2
        }
    },
    Neimenggu: {
        chartExtendExtra: {
            zoom: 1.2
        }
    },
    Shandong: {
        chartExtendExtra: {
            zoom: 1.2
        }
    },
    Jilin: {
        chartExtendExtra: {
            zoom: 1.2
        }
    },
    Gansu: {
        chartExtendExtra: {
            zoom: 1.2
        }
    },
    Yunnan: {
        chartExtendExtra: {
            aspectScale: 1.2
        }
    },
    Zhejiang: {
        chartExtendExtra: {
            // 长宽比
            aspectScale: 0.9
        }
    }
}

export {
    provinceConfigMap,
    confirmPiecesPhaseOne,
    confirmPiecesPhaseTwo,
    confirmPiecesPhaseThree,
    healPiecesPhaseOne,
    healPiecesPhaseTwo,
    healPiecesPhaseThree,
    defaultVisualMapReport,
    defaultVisualMap,
    deafultChartExtend
}
