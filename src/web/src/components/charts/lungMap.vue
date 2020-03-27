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
    <div class="ve-map-canvas" :class="{ disabled: disabled }">
        <ve-map
            :data="data"
            :settings="settings"
            :extend="chartExtend"
            :visual-map="realVisualMap"
            :width="width"
            :height="height"
            style="margin: auto;"
            :tooltip-visible="false"
            :set-option-opts="true"
            :events="events"
            ref="lungMap"
        ></ve-map>
        <div
            class="ve-map-hainan"
            v-if="!isReport && (settings.position === 'china' || settings.position === 'province/hainan')"
        >
            <img :src="locale === 'en'? nanhaiImgEn: nanhaiImg" alt="" id="nanhaiMap" />
        </div>
    </div>
</template>
<script>
import VeMap from 'v-charts/lib/map.common'
import 'echarts/lib/component/visualMap'
import 'v-charts/lib/style.css'
import mockMap from '@/config/mockMap'
import chinaCityName from '@/config/chinaCityName'
import { pickNanHaiImg } from '@/components/charts/config/nanhaiConfig'
import {
    defaultVisualMap,
    defaultVisualMapReport,
    deafultChartExtend,
    provinceConfigMap,
    confirmPiecesPhaseOne,
    confirmPiecesPhaseTwo,
    confirmPiecesPhaseThree,
    healPiecesPhaseOne,
    healPiecesPhaseTwo,
    healPiecesPhaseThree
} from '@/config/mapConfig'

export default {
    name: 'lungMap',
    components: {
        VeMap
    },
    props: {
        width: {
            type: String,
            default: '320px'
        },
        height: {
            type: String,
            default: '320px'
        },
        events: {
            type: Object,
            default: () => {
                return {}
            }
        },
        data: {
            type: Object,
            default: () => {
                return {
                    columns: ['city', 'confirm'],
                    rows: []
                }
            }
        },
        // area: hubei
        area: {
            type: String,
            default: ''
        },
        // 全国地图的设置
        chartSetttings: {
            type: Object
        },
        // 世界地图的设置
        worldSettings: {
            type: Object
        },
        // 是不是报告
        isReport: {
            type: Boolean,
            default: false
        },
        // 可不可用
        disabled: {
            type: Boolean,
            default: false
        },
        // 数据类型
        dataType: {
            type: String,
            default: 'confirm'
        },
        dataKey: {
            type: String,
            default: 'confirm'
        },
        nameMap: {
            type: Object,
            default: () => null
        }
    },
    watch: {
        // 监听地图是否修改，修改这更新地图
        area (newVal, oldVal) {
            if (newVal !== '') {
                this.updateMap()
            }
        },
        // 监听数据，数据修改，更新地图
        data (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateMap()
            }
        },
        // 固定南海地图
        dataKey () {
            this.fixNanHaiMap()
        }
    },
    data () {
        return {
            nanhaiImg: 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn100-2b6eb28e2fac1fbea6a472d2c11b116c.jpg',
            nanhaiImgEn: 'https://static.wecity.qq.com/h5/2020-3/nanhai-en-018904ddb246b773470b2a448621bbee.png',
            locale: this.$i18n.locale,
            realVisualMap: defaultVisualMap,
            chartExtend: deafultChartExtend,
            settings: {},
            /**
             * 按疫情阶段划分颜色配置
             */
            phaseColors: {
                confirmPiecesPhaseOne,
                confirmPiecesPhaseTwo,
                confirmPiecesPhaseThree,
                healPiecesPhaseOne,
                healPiecesPhaseTwo,
                healPiecesPhaseThree
            }
        }
    },
    computed: {
        // 现在点击的区块
        curPieces () {
            let pieces = []
            // 如果地区世界地图区块
            if (this.area === 'world') {
                pieces = this.phaseColors['confirmPiecesPhaseTwo']
                return pieces
            }
            /**
             * 按疫情阶段划分颜色配置
             */
            if (this.data.rows.length > 0) {
                const maxCount = this.data.rows[0][this.dataType] || 10000
                if (maxCount < 1000) pieces = this.phaseColors[`${this.dataType}PiecesPhaseOne`]
                else if (maxCount >= 1000 && maxCount < 10000) {
                    pieces = this.phaseColors[`${this.dataType}PiecesPhaseTwo`]
                } else if (maxCount >= 10000) {
                    pieces = this.phaseColors[`${this.dataType}PiecesPhaseThree`]
                } else {
                    pieces = this.phaseColors['confirmPiecesPhaseTwo']
                }
            }
            return pieces
        }
    },
    methods: {
        // 更新地图
        updateMap () {
            if (this.area === '') return
            // 武汉市特殊处理 S
            // 兼容拼音武汉的处理
            if (this.area === '武汉' || this.area === 'Wuhan' || this.area === 'WuHan') {
                mockMap['武汉'] = {
                    name: 'wuhan',
                    url: 'https://static.wecity.qq.com/h5/2020-2/map-wuhan-78901f8804845bb60cae3d7288516737.json'
                }
                mockMap['Wuhan'] = {
                    name: 'wuhan',
                    url: 'https://static.wecity.qq.com/h5/2020-2/map-wuhan-78901f8804845bb60cae3d7288516737.json'
                }
                mockMap['WuHan'] = {
                    name: 'wuhan',
                    url: 'https://static.wecity.qq.com/h5/2020-2/map-wuhan-78901f8804845bb60cae3d7288516737.json'
                }
            }
            // 武汉市特殊处理 E
            this.updateVisualMap()
            this.updateChartExtend()
            this.updateSettings()
        },
        updateVisualMap () {
            const { isReport } = this
            let visualMap = defaultVisualMap
            if (isReport) {
                visualMap = defaultVisualMapReport
            }
            const mapConf = this.getMockMap(this.area)
            const provConfig = provinceConfigMap[mapConf.name]
            // fix: pieces对没有省份文件着色失效
            if (provConfig) {
                visualMap = { ...visualMap, ...provConfig.visualMapExtra }
            }
            if (this.curPieces.length) {
                visualMap = { ...visualMap, pieces: this.curPieces }
            }
            this.realVisualMap = visualMap
        },
        // 更改地图的扩展
        updateChartExtend () {
            let chartExtend = deafultChartExtend
            const { area } = this
            const mapConf = this.getMockMap(area)
            const provConfig = provinceConfigMap[mapConf.name]
            if (provConfig) {
                chartExtend = { ...chartExtend, ...provConfig.chartExtendExtra }
            }
            if (this.nameMap) chartExtend.series.nameMap = this.nameMap
            this.chartExtend = chartExtend
        },
        // 更新设置
        updateSettings () {
            const { area, chartSetttings, worldSettings } = this
            // 世界地图配置
            if (worldSettings) {
                this.settings = worldSettings
                return
            }
            // 全国地图配置
            if (chartSetttings) {
                this.settings = chartSetttings
                return
            }
            // 获取区域的地图的配置
            const mapConf = this.getMockMap(area)
            let position = `province/${mapConf.name}`
            this.settings = {
                position,
                positionJsonLink: mapConf.url,
                specialAreas: mapConf.specialAreas || {}
            }
        },
        // 滚定南海地图
        fixNanHaiMap () {
            let guangdong = this.data.rows.find((province) => province.name === '广东')
            let hainan = this.data.rows.find((province) => province.name === '海南')
            if (guangdong && hainan) {
                this.nanhaiImg = pickNanHaiImg(hainan[this.dataKey], guangdong[this.dataKey], this.dataKey)
            } else if (!guangdong && hainan) {
                this.nanhaiImg = pickNanHaiImg(hainan[this.dataKey], 1000, this.dataKey)
            }
        },
        // 获取mock的地图
        getMockMap (enCity) {
            for (let zhCity in chinaCityName) {
                if (chinaCityName[zhCity] === enCity) {
                    if (mockMap[zhCity]) return mockMap[zhCity]
                }
            }
            return mockMap[enCity]
        }
    },
    mounted () {
        this.updateMap()
        this.$forceUpdate()
        if (!this.isReport) this.fixNanHaiMap()
    }
}
</script>
<style lang="scss" scoped>
.ve-map-canvas {
    position: relative;
}
.ve-map-hainan {
    width: 43px;
    height: 58px;
    position: absolute;
    right: 0;
    bottom: 30px;
    z-index: 2;
    img {
        width: 100%;
        height: 100%;
        display: block;
    }
}
.ve-map-canvas.disabled {
    position: relative;
    &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 10;
    }
}
</style>
