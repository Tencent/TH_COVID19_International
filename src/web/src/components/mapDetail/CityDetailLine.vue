<template>
    <div v-if="modifyLine.rows.length || totalLine.rows.length" class="ve-table-box">
        <template v-if="totalLine.rows.length">
            <p class="ve-tt" style="margin-top: 0;">{{ $t('common.Total_Cases') }} - {{ cityName }}</p>
            <div class="chat-tab">
                <div :class="curTab === 'confirm' ? 'cur' : ''" class="chat-tab-item" @click="switchTab('confirm')">
                    <span>Total Cases</span>
                </div>
                <div :class="curTab === 'heal' ? 'cur' : ''" class="chat-tab-item" @click="switchTab('heal')">
                    <span>Recovered/Deaths</span>
                </div>
            </div>
            <lung-line :data="totalLine" :extend="totalConfig"></lung-line>
        </template>

        <template v-if="modifyLine.rows.length">
            <p class="ve-tt" style="margin-top: 0;">{{ $t('common.New_Cases') }} - {{ cityName }}</p>
            <lung-line :data="modifyLine" :extend="modifyConfig"></lung-line>
        </template>
    </div>
</template>

<script>
import httpUtils from '@/api'
import LungLine from '@/components/charts/lungLine'
import { generateRowsData, createTooltipContent } from '@/components/charts/config/nanhaiConfig'

export default {
    name: 'CityDetailLine',
    components: { LungLine },
    data () {
        return {
            province: '',
            cityName: '',
            // 累计
            curTab: 'confirm',
            confirmTotalLine: { rows: [] },
            confirmTotalConfig: {},
            healTotalLine: { rows: [] },
            healTotalConfig: {},
            // 新增
            modifyLine: { rows: [] },
            modifyConfig: {},

            confirmModifyLegends: []
        }
    },
    computed: {
        totalLine () {
            return this[`${this.curTab}TotalLine`] || { rows: [] }
        },
        totalConfig () {
            return this[`${this.curTab}TotalConfig`] || {}
        },
        totalLegends () {
            return this[`${this.curTab}TotalLegends`] || {}
        }
    },
    async mounted () {
        this.province = this.$route.query.province
        this.cityName = this.$route.query.cityName
        const { areaHistory, areaModifyHistory, cityHistory, cityModifyHistory } = await this.fetchKeyCityData(
            this.province,
            this.cityName
        )
        this.processTotalData(this.province, areaHistory, cityHistory)
        this.processModifyData(this.province, areaModifyHistory, cityModifyHistory)
    },
    methods: {
        switchTab (tab) {
            this.curTab = tab
            this.reportStatLog({
                actionType: 'event',
                actionName: 'province.map.switchTab.click',
                extra: { tab: tab }
            })
        },
        async fetchKeyCityData (province, cityName) {
            try {
                const {
                    code,
                    areaHistory = [],
                    areaModifyHistory = [],
                    cityHistory = [],
                    cityModifyHistory = []
                } = await httpUtils('getKeyCity', { area: province, city: cityName }, 'THPneumoniaOuterDataService')
                if (code === 0) {
                    return { areaHistory, areaModifyHistory, cityHistory, cityModifyHistory }
                }
            } catch (e) {
                console.log('fetchKeyCityData err: ', e)
            }
        },
        processLegends (colors, columns, legendMap) {
            columns = columns.slice(1) // 去除day维度
            const legends = columns.map((column, idx) => {
                const legend = legendMap[column]
                const color = colors[idx]
                return { name: legend, color, iconStyle: `background:${color};` }
            })
            return legends
        },
        processTotalData (province, areaHistory, cityHistory) {
            // 确诊曲线
            let totalConfirmRows = []
            let totalConfirmColumns = ['day']
            let totalConfirmLegendMap = {}
            // 市累计
            cityHistory.forEach((item, index) => {
                totalConfirmRows = generateRowsData(totalConfirmRows, item.history, 'confirm', `confirm-${index}`)
                totalConfirmColumns.push(`confirm-${index}`)
                totalConfirmLegendMap[`confirm-${index}`] = `${item.city} ${this.$i18n.t('legend.total-confirm')}`
            })
            const confirmColors = ['#DE5E5B', '#FF971F', '#0E8AFB']
            this.confirmTotalConfig = {
                legend: {
                    formatter: function (name) {
                        return totalConfirmLegendMap[name]
                    }
                },
                tooltip: {
                    formatter: function (params) {
                        return createTooltipContent(params, totalConfirmLegendMap, confirmColors)
                    }
                },
                color: confirmColors
            }
            this.confirmTotalLine = {
                columns: totalConfirmColumns,
                rows: totalConfirmRows
            }

            // 治愈/死亡曲线
            let totalHealColumns = ['day', 'heal', 'dead']
            let totalHealLegendMap = {
                heal: `${this.$i18n.t('legend.total-heal')}`,
                dead: `${this.$i18n.t('legend.total-dead')}`
            }
            const healColors = ['#62c298', '#888888']
            this.healTotalConfig = {
                legend: {
                    formatter: function (name) {
                        return totalHealLegendMap[name]
                    }
                },
                tooltip: {
                    formatter: function (params) {
                        return createTooltipContent(params, totalHealLegendMap, healColors)
                    }
                },
                color: healColors
            }
            this.healTotalLine = {
                columns: totalHealColumns,
                // rows: areaHistory
                rows: (cityHistory[0] && cityHistory[0].history) || []
            }
        },
        processModifyData (province, areaModifyHistory, cityModifyHistory) {
            let modifyConfirmRows = []
            let modifyConfirmColumns = ['day']
            let modifyConfirmLegendMap = {}
            // 市新增
            cityModifyHistory.forEach((item, index) => {
                modifyConfirmRows = generateRowsData(modifyConfirmRows, item.history, 'confirm', `confirm-${index}`)
                modifyConfirmColumns.push(`confirm-${index}`)
                modifyConfirmLegendMap[`confirm-${index}`] = `${item.city} ${this.$i18n.t('legend.modify-confirm')}`
            })
            const confirmColors = ['#DE5E5B', '#FF971F', '#0E8AFB']
            this.confirmModifyLegends = this.processLegends(confirmColors, modifyConfirmColumns, modifyConfirmLegendMap)
            this.modifyConfig = {
                legend: {
                    formatter: function (name) {
                        return modifyConfirmLegendMap[name]
                    }
                },
                tooltip: {
                    formatter: function (params) {
                        return createTooltipContent(params, modifyConfirmLegendMap, confirmColors)
                    }
                },
                color: confirmColors
            }
            this.modifyLine = {
                columns: modifyConfirmColumns,
                rows: modifyConfirmRows
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~Styles/views/disease/city-detail';
@import '~Styles/views/disease/city-detail-en';
</style>
