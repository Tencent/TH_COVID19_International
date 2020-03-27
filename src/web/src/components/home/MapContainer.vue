<template>
    <div class="tab-content-01 tab-first">
        <div class="content-wrapper china-map-wrap epanel epanel--index-map">
            <!-- 全国疫情地图 -->
            <div class="epanel-title-bar">
                <p class="epanel-title">{{ $t('home.COVID_19_Map') }}</p>
                <p v-if="recentTime" class="epanel-sub-title">Updated {{ recentTime }}</p>
            </div>
            <div
                class="img-box"
                style="width: 100%; height: 100%; -webkit-tap-highlight-color: transparent; user-select: none;"
                @click="handleMapClick"
            >
                <div class="chat-tab" :data-type="curMapTab" id="chinaMapTab">
                    <div
                        v-if="globalConfig.feature.mapTabs.nowConfirm"
                        :class="curMapTab === 'nowConfirm' ? 'cur' : ''"
                        class="chat-tab-item"
                        @click="switchMapTab('nowConfirm')"
                    >
                        <span>{{ $t('common.Active_Cases') }}</span>
                    </div>
                    <div
                        v-if="globalConfig.feature.mapTabs.totalConfirm"
                        :class="curMapTab === 'totalConfirm' ? 'cur' : ''"
                        class="chat-tab-item"
                        @click="switchMapTab('totalConfirm')"
                    >
                        <span>{{ $t('common.Total_Cases') }}</span>
                    </div>
                    <div
                        v-if="globalConfig.feature.mapTabs.totalHeal"
                        :class="curMapTab === 'totalHeal' ? 'cur' : ''"
                        class="chat-tab-item"
                        @click="switchMapTab('totalHeal')"
                    >
                        <span>{{ $t('common.Total_Recovered') }}</span>
                    </div>
                </div>
                <div class="chat-tab-cont">
                    <map-highlight
                        :areaData="currentProvData"
                        :numberKey="mapHook.dataKey[curMapTab]"
                        nameKey="name"
                        :showArrow="true"
                        @handleClick="handleHighlightClick"
                    />
                    <lung-map
                        class="en-map-padding"
                        id="chinaMap"
                        v-if="curMapData.rows.length"
                        :data="curMapData"
                        area="中国"
                        :width="mapChartSize"
                        :height="mapChartSize"
                        :events="mapChartEvents"
                        :chartSetttings="chartSetttings"
                        :dataType="mapHook.dataType[curMapTab]"
                        :dataKey="mapHook.dataKey[curMapTab]"
                        ref="mapComp"
                    ></lung-map>
                </div>
            </div>
            <!-- 折线趋势图 -->
            <IndexLine />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import homeConfig from '@/config/home-default'

import LungMap from '@/components/charts/lungMap'
import MapHighlight from '@/components/MapHighlight'
import mockMap from '@/config/mockMap'
import IndexLine from '@/components/home/IndexLine'

const mapHook = {
    dataKey: {
        nowConfirm: 'nowConfirm',
        totalConfirm: 'confirm',
        totalHeal: 'heal'
    },
    dataType: {
        nowConfirm: 'confirm',
        totalConfirm: 'confirm',
        totalHeal: 'heal'
    }
}

export default {
    name: 'MapContainer',
    components: {
        LungMap,
        MapHighlight,
        IndexLine
    },
    computed: {
        ...mapState({
            initData: (state) => state.initData
        }),
        mapChart () {
            if (this.$refs.mapComp && this.$refs.mapComp.$refs.lungMap) {
                return this.$refs.mapComp.$refs.lungMap.echarts
            }
            return null
        },
        curMapData () {
            let mapRowsData = this.areaTotal.map((v) => {
                return {
                    name: v.area,
                    number: v[mapHook.dataKey[this.curMapTab]],
                    ...v
                }
            })
            return {
                columns: ['name', 'number'],
                rows: mapRowsData
            }
        }
    },
    watch: {
        initData (initData) {
            this.initAreaInfo(initData)
        },
        'pageConfig.feature.defaultMapTab' (tab) {
            this.curMapTab = tab
        }
    },
    data () {
        this.mapChartEvents = {
            click: (e) => {
                const { curMapData } = this
                const { dataIndex, name } = e
                // 在 handleMapClick 前触发
                this.hitMap = true
                if (this.dataIndex === dataIndex) {
                    this.dataIndex = -1
                    this.currentProvData = {}
                } else {
                    let currentProvData = curMapData.rows[dataIndex]
                    if (!currentProvData) {
                        currentProvData = { name }
                    }
                    this.dataIndex = dataIndex
                    this.currentProvData = currentProvData
                }
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'yiqingbobao.overview.map.area.click',
                    extra: { ...this.currentProvData }
                })
            }
        }
        const { name, url } = mockMap['中国']
        this.chartSetttings = {
            position: name,
            positionJsonLink: url
        }
        return {
            mapHook,

            recentTime: '',
            areaTotal: [],

            curMapTab: this.pageConfig.feature.defaultMapTab,
            mapChartSize: '320px',
            hitMap: false,
            hitHighlight: false,
            dataIndex: -1,
            currentProvData: {}
        }
    },
    methods: {
        initAreaInfo (initData) {
            if (initData.getAreaInfo) {
                let getAreaInfo = homeConfig.getAreaInfo // 默认兜底方案，当接口异常时使用兜底数据
                if (initData.getAreaInfo.code === 0) {
                    getAreaInfo = initData.getAreaInfo
                }
                const { areaTotal, recentTime = '' } = getAreaInfo
                this.recentTime = recentTime
                this.areaTotal = areaTotal.map((item) => ({ ...item, isAttented: false }))
            }
        },
        switchMapTab (tab) {
            if (this.curMapTab !== tab) {
                this.dataIndex = -1
                this.currentProvData = {}
            }
            this.curMapTab = tab
            this.reportStatLog({
                actionType: 'event',
                actionName: 'index.overview.switchMapTab.click',
                extra: { tab: tab }
            })
        },
        handleMapClick (e) {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'yiqingbobao.overview.map.outer.click',
                extra: { hitMap: this.hitMap, hitHighlight: this.hitHighlight }
            })
            // 用于判断是否先在地图有效区域点击
            if (!this.hitMap && !this.hitHighlight && this.mapChart) {
                this.mapChart.dispatchAction({ type: 'mapUnSelect', dataIndex: this.dataIndex })
                this.dataIndex = -1
                this.currentProvData = {}
            }
            this.hitMap = false
            this.hitHighlight = false
        },
        handleHighlightClick (d) {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'yiqingbobao.overview.highlight.click',
                extra: { ...d }
            })
            this.hitHighlight = true
            // if (d.number <= 0 || d.cityinfo === 0) return
            if (d.cityinfo === 0) return
            this.toMapDetail(d.name)
        },
        toMapDetail (name) {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'yiqingbobao.overview.province.toMapDetail',
                extra: { name }
            })
            const { cityCode, channel } = this.$route.query
            this.$router.push({
                path: '/map-detail',
                query: {
                    province: name,
                    channel,
                    cityCode
                }
            })
        }
    },
    async mounted () {
        this.mapChartSize = `${window.innerWidth * 0.9}px`
        this.initAreaInfo(this.initData)
    }
}
</script>

<style lang="scss">
@import '~Styles/views/disease/common';
@import '~Styles/views/disease/current-report';
@import '~Styles/views/disease/current-report-en';
@import '~styles/views/disease/small-chart';
</style>

<style lang="scss" scoped>
.highlight-box {
    z-index: 10;
}
</style>
