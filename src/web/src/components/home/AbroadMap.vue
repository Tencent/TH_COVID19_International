<template>
    <div class="international-map-wrap">
        <div class="bubble-box" v-if="currentProvData.country || currentProvData.name">
            <div class="bubble-box-inner">
                <ul
                    v-if="currentProvData.country && currentProvData.country !== '日本'"
                    @click="toForeignDetail({ name: currentProvData.country, confirm: currentProvData.confirm })"
                    style="display: inline-block;"
                >
                    <li>
                        <b>{{ currentProvData.country }} </b>
                        <span
                            >{{ $t('legend.total-confirm') }}
                            <span class="txt-warning"> {{ currentProvData.confirm }} </span>
                        </span>
                        <i
                            v-if="hasDetails(currentProvData.confirm) && currentProvData.country !== '中国'"
                            class="icon-arrow-right"
                            style="top: -1px;"
                        ></i>
                    </li>
                </ul>
                <ul
                    v-else-if="currentProvData.country && currentProvData.country === '日本'"
                    @click="toForeignDetail({ name: '日本本土', confirm: currentProvData.localJapan.confirm })"
                    style="display: inline-block;"
                >
                    <li>
                        <b>{{ currentProvData.localJapan.country }} </b>
                        <span
                            >{{ $t('legend.total-confirm') }}
                            <span class="txt-warning">{{ currentProvData.localJapan.confirm }}</span>
                        </span>
                        <i class="icon-arrow-right" style="top: -1px;"></i>
                    </li>
                    <li>
                        <b>{{ currentProvData.diamondShip.country }} </b>
                        <span
                            >{{ $t('legend.total-confirm') }}
                            <span class="txt-warning">{{ currentProvData.diamondShip.confirm }}</span>
                        </span>
                    </li>
                </ul>
                <span v-else
                    ><b>{{ currentProvData.name }}</b
                    >: none
                </span>
            </div>
        </div>
        <div class="legend-wrap">
            <ul class="legend-ul">
                <li class="legend-li">
                    <div class="lump" style="background-color: #9a0000;"></div>
                    <span class="text">1000+</span>
                </li>
                <li class="legend-li">
                    <div class="lump" style="background-color: #feb99b;"></div>
                    <span class="text">10~99</span>
                </li>
                <li class="legend-li">
                    <div class="lump" style="background-color: #c7211c;"></div>
                    <span class="text">100-999</span>
                </li>
                <li class="legend-li">
                    <div class="lump" style="background-color: #fed89b;"></div>
                    <span class="text">1-9</span>
                </li>
            </ul>
        </div>
        <div @click="handleMapClick">
            <lung-map
                id="worldMap"
                :data="curMapData"
                area="world"
                :events="mapChartEvents"
                :width="mapChartSize"
                :height="mapChartHeight"
                :worldSettings="worldSettings"
                ref="worldMapComp"
            ></lung-map>
        </div>
    </div>
</template>
<script>
import LungMap from '@/components/charts/lungMap'

export default {
    components: {
        LungMap
    },
    props: {
        curMapData: {
            type: Object,
            default () {
                return {
                    columns: ['country', 'confirm'],
                    rows: []
                }
            }
        }
    },
    data () {
        // 地图资源
        this.worldSettings = {
            position: 'world',
            positionJsonLink:
                'https://static.wecity.qq.com/h5/2020-3/new-ocean-world-map-7191d485b70afbb29088f113d1b19e1f.json'
        }
        this.mapChartEvents = {
            click: (e) => {
                const { curMapData } = this
                const { dataIndex, name } = e
                // 在 handleMapClick 前触发
                this.hitMap = true
                if (this.dataIndex === dataIndex) {
                    // 反选
                    this.dataIndex = -1
                    this.currentProvData = {}
                } else {
                    // 选中高亮
                    let currentProvData = curMapData.rows[dataIndex]
                    if (!currentProvData) {
                        currentProvData = { name }
                    }
                    this.dataIndex = dataIndex
                    this.currentProvData = currentProvData
                }
                // this.reportStatLog({
                //     actionType: 'event',
                //     actionName: 'home.oversea.map.area.click',
                //     extra: { ...this.currentProvData }
                // })
            }
        }
        return {
            dataIndex: -1,
            currentProvData: {},
            hitMap: false,
            hitHighlight: false,
            mapChartSize: '340px',
            mapChartHeight: '240px'
        }
    },
    computed: {
        mapChart () {
            if (this.$refs.worldMapComp && this.$refs.worldMapComp.$refs.lungMap) {
                return this.$refs.worldMapComp.$refs.lungMap.echarts
            }
            return null
        }
    },
    mounted () {
        // 兼容小屏幕，例如：iPhone 5
        if (window.innerWidth === 320) {
            this.mapChartSize = '300px'
            this.mapChartHeight = '220px'
        }
    },
    methods: {
        hasDetails (confirm) {
            // 产品逻辑：
            // 确诊数小于10不进入详情页
            if (confirm < 10) return false
            return true
        },
        handleMapClick (e) {
            // this.reportStatLog({
            //     actionType: 'event',
            //     actionName: 'overvsea.map.outer.click',
            //     extra: { hitMap: this.hitMap, hitHighlight: this.hitHighlight }
            // })
            // 用于判断是否先在地图有效区域点击
            if (!this.hitMap && !this.hitHighlight && this.mapChart) {
                this.mapChart.dispatchAction({ type: 'mapUnSelect', dataIndex: this.dataIndex })
                this.dataIndex = -1
                this.currentProvData = {}
            }
            this.hitMap = false
            this.hitHighlight = false
        },
        toForeignDetail ({ name, confirm }) {
            this.$emit('toForeignDetail', { name, confirm })
        }
    }
}
</script>
