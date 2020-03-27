<template>
    <div class="container container-case-detail">
        <div class="content-wrapper epanel epanel--header">
            <div class="title-bar">
                <p class="title">{{ totalCityInfo.city }}疫情实时数据</p>
                <p class="sub-title">截至 {{ totalCityInfoStatTime }} 数据统计</p>
            </div>
            <div class="epanel-box">
                <div class="dashboard-wrap">
                    <div class="dashboard dashboard--simple">
                        <div class="dashboard-inner">
                            <div class="dashboard-tab">
                                <div class="dashboard-tab-cont">
                                    <div class="dashboard-grid cur">
                                        <div
                                            class="dashboard-item"
                                            v-for="(item, index) of DiseaseMapLetterOrder"
                                            :key="index"
                                        >
                                            <strong class="dashboard-item-val" :class="DiseaseMapClass[item]">{{
                                                totalCityInfo[item]
                                            }}</strong>
                                            <span class="dashboard-item-tit">{{ DiseaseMapLetter[item] }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper epanel epanel--table">
            <div class="title-bar">
                <p class="title">
                    确诊病例个案分布及趋势
                </p>
                <p class="sub-title">
                    数据截至{{
                        (statisticSummary.datetime && statisticSummary.datetime.substr(0, 10)) || '--'
                    }}深圳卫健委发布{{ statisticSummary.sum || '--' }}个确诊病例个案信息，
                    由于个案数据收集需要时间，故个案详情数可能小于确诊总数
                </p>
            </div>
            <div class="epanel-box">
                <!-- 年龄分布图（岁） S  -->
                <div class="ve-table-box">
                    <div class="ve-table-head">
                        <p class="ve-tt">年龄分布图（人数）</p>
                    </div>
                    <div class="ve-table-cont">
                        <div class="ve-line">
                            <ve-histogram
                                :colors="colorsVH"
                                :data-empty="isChartDataLoadFail"
                                :data="ageChartData"
                                :extend="ageChartExtend"
                                height="220px"
                                :legend-visible="true"
                                legend-position="bottom"
                                :loading="isLoadingChartData"
                                :settings="chartSettingsVH"
                                :tooltip-visible="false"
                            ></ve-histogram>
                            <!-- 图表  S  -->
                            <!-- 图表  e  -->
                        </div>
                    </div>
                </div>

                <!-- 居住地分布图 S  -->
                <div class="ve-table-box">
                    <div class="ve-table-head">
                        <p class="ve-tt">居住地分布图</p>
                        <!-- <p class="ve-subtit">居住地为 湖北的确诊患者<span class="tt-num">50人</span> 占比<span class="tt-num">25.8%</span></p> -->
                    </div>
                    <div class="ve-table-cont">
                        <div class="ve-line">
                            <ve-ring
                                :colors="colorsOfRingChart"
                                :data-empty="isChartDataLoadFail"
                                :data="residenceChartData"
                                :extend="ringChartExtend"
                                height="220px"
                                :loading="isLoadingChartData"
                                :legend-visible="true"
                                legend-position="bottom"
                                :settings="ringChartSetting"
                                :tooltip-visible="false"
                            >
                            </ve-ring>
                            <!-- 图表  S  -->
                            <!-- 图表  e  -->
                        </div>
                    </div>
                </div>

                <!-- 每日发病人数及入院人数趋势图（人） S  -->
                <div class="ve-table-box">
                    <div class="ve-table-head">
                        <p class="ve-tt">每日发病人数及入院人数趋势图（人数）</p>
                    </div>
                    <div class="ve-table-cont">
                        <div class="ve-line">
                            <ve-line
                                :colors="colorsOfLineChart"
                                :data-empty="isChartDataLoadFail"
                                :data="sickAndConfirmChartData"
                                :extend="extendLineChart"
                                height="220px"
                                :loading="isLoadingChartData"
                                legend-position="bottom"
                                :tooltip-visible="false"
                                :settings="sickAndConfirmChartSettings"
                            ></ve-line>
                            <!-- 图表  S  -->
                            <!-- 图表  e  -->
                        </div>
                    </div>
                </div>

                <!-- 从发病到入院的时间间隔分布图  -->
                <div class="ve-table-box">
                    <div class="ve-table-head">
                        <p class="ve-tt">从发病到入院的时间间隔分布图（人数）</p>
                        <!-- <p class="ve-subtit">从发病到确诊，平均时长 <span class="tt-num">3.58日</span></p> -->
                    </div>
                    <div class="ve-table-cont">
                        <div class="ve-line">
                            <ve-histogram
                                :colors="colorsVH"
                                :data-empty="isChartDataLoadFail"
                                :data="hospitalDurationChartData"
                                :extend="hospitalDurationChartDataExtend"
                                height="220px"
                                legend-position="bottom"
                                :legend-visible="true"
                                :loading="isLoadingChartData"
                                :settings="chartSettingsVH"
                                :tooltip-visible="false"
                            >
                            </ve-histogram>
                            <!-- 图表  S  -->
                            <!-- 图表  e  -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper epanel epanel--caselist" ref="caseDetailsPanelHeader">
            <div class="title-bar">
                <p class="title">
                    确诊个案详情
                </p>
            </div>
            <div class="option-bar">
                <div class="option-bar-adjust">
                    <div class="option-bar-adjust-inner">
                        <!-- 低到高：item-rank-low -->
                        <!-- 高到低：item-rank-high -->

                        <div
                            v-for="item in casesOrderOptions"
                            :key="item.value"
                            :class="{
                                'option-adjust-item': true,
                                'item-rank-high': isAsc(item.value),
                                'item-rank-low': isDesc(item.value)
                            }"
                            @click="toggleOrder(item)"
                        >
                            {{ item.label }}
                        </div>
                        <div
                            class="option-adjust-item item-option"
                            :class="{ cur: isFiltered }"
                            @click="toggleShowFilter"
                        >
                            筛选
                        </div>
                    </div>
                </div>
            </div>
            <!-- 筛选项 S  -->
            <div class="epanel-box epanel-box--option" v-if="isFilterVisible">
                <search-popbox
                    :data="filterForm"
                    :dataMap="searchPopBoxDataMap"
                    @confirm="onSearchPopBoxConfirm"
                    @reset="resetFilterForm"
                    @resetField="resetFilterFormField"
                ></search-popbox>
            </div>
            <!-- 筛选项 E  -->

            <!-- 个案列表 S  -->
            <div class="epanel-box epanel-box--list" v-if="!isFilterVisible">
                <div class="option-bar-label">
                    <div class="option-bar-label-inner" style="text-align: center;">
                        <!-- 选中态 cur  -->
                        <div
                            v-for="item in quickFilters"
                            :key="item.type + item.value"
                            class="option-label-item"
                            :class="{ cur: isFilteredBy(item) }"
                            @click="handleQuickFilter(item)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </div>
                <div class="timeline-list">
                    <div class="timeline-item" v-for="(item, index) in cases" :key="index">
                        <div class="time-detail">
                            <p class="date">入院时间：{{ formatInHospDate(item.inHospDate) }}</p>
                            <!-- <p class="time">00:50</p> -->
                        </div>
                        <div class="detail-box">
                            <div class="detail-box-inner">
                                <p class="box-tt">患者{{ item.no }}</p>
                                <p class="box-content" v-html="formatHightlightHtml(item)">
                                    <!-- <pre>{{JSON.stringify(item, null, '  ')}}</pre> -->
                                    <!-- {{ item.rawText | highlightKeywords}} -->
                                    <!-- <strong class="txt-status">情况稳定</strong> -->
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-more">
                    <!-- <p style="text-align: center;">没有数据</p> -->
                    <p v-if="hasNoCasesData" class="more">暂无数据</p>
                    <p v-else-if="hasNoMoreCases" class="more">已加载完全部</p>
                    <p v-else-if="isLoadingMore" class="more">加载中···</p>
                    <p v-else class="more" @click="onLoadMoreClick">
                        {{ $t('common.More') }}<i class="icon-arrow-down"></i>
                    </p>
                </div>
            </div>
            <!-- 个案列表 E  -->
        </div>
    </div>
</template>

<script>
import httpUtils from '@/api'
import VeHistogram from 'v-charts/lib/histogram.common'
import VeRing from 'v-charts/lib/ring.common'
import VeLine from 'v-charts/lib/line.common'
import PopWin from '@/components/PopWin'
import { EventBus } from '@/utils/event-bus'
import echarts from 'echarts/lib/echarts'
import 'v-charts/lib/style.css'
import SearchPopbox from '@/components/caseDetails/SearchPopbox.vue'
import merge from 'merge-dictionaries'

const getDefaultFilterParams = () => {
    return {
        genders: [],
        minAge: 0,
        maxAge: 102,
        residenceEnums: [],
        startSickTime: '',
        endSickTime: '',
        startInHospTime: '',
        endInHospTime: '',
        // startTouchTime: '',
        // endTouchTime: '',
        symptoms: []
        // illState: ''
    }
}
// 柱状图默认配置扩展
const getDefaultHistogramExtend = () => {
    return {
        series: {
            smooth: false,
            barWidth: '50%'
        },
        grid: {
            right: 22,
            top: 30,
            bottom: 40
        },
        yAxis: {
            axisLabel: {
                color: '#333',
                textStyle: {
                    fontSize: 10
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#eee'
                }
            }
        },
        xAxis: {
            nameLocation: 'end',
            nameGap: 5,
            nameTextStyle: {
                color: '#333',
                fontSize: 10,
                verticalAlign: 'top',
                padding: [8, 0, 0, 0]
            },
            axisLabel: {
                color: '#333',
                textStyle: {
                    fontSize: 10
                }
            }
        },
        legend: {
            show: true,
            textStyle: {
                fontSize: 10,
                color: '#333333'
            },
            icon: 'rect',
            borderRadius: 10,
            itemWidth: 9,
            itemHeight: 9,
            itemGap: 10
        }
    }
}

export default {
    components: {
        VeHistogram,
        VeRing,
        VeLine,
        SearchPopbox
    },
    data () {
        return {
            isFilterVisible: false,
            filterForm: getDefaultFilterParams(),
            searchPopBoxDataMap: {},
            colorsVH: ['#00B9D1', '#FFA317 '],
            colorsOfRingChart: ['#FFA317', '#4095F7', '#DE5E5B', '#00B9D1', '#A879D2'],
            colorsOfLineChart: ['#DE5E5B', '#FFA317'],
            chartSettingsVH: {
                itemStyle: {
                    normal: {
                        barBorderRadius: [2, 2, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00B9D1' },
                            { offset: 1, color: 'rgba(0,185,209,0.40)' }
                        ])
                    }
                }
            },
            extendLineChart: {
                smooth: true,
                grid: {
                    top: 30,
                    bottom: 40
                },
                series: {
                    symbol: 'circle',
                    itemStyle: {
                        normal: {
                            borderWidth: 1,
                            opacity: 0
                        }
                    }
                },
                yAxis: {
                    axisLabel: {
                        color: '#333',
                        textStyle: {
                            fontSize: 10
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    }
                },
                xAxis: {
                    axisLabel: {
                        color: '#333',
                        textStyle: {
                            fontSize: 10
                        }
                    }
                },
                legend: {
                    show: true,
                    textStyle: {
                        fontSize: 10,
                        color: '#333333'
                    },
                    icon: 'rect',
                    borderRadius: 10,
                    itemWidth: 9,
                    itemHeight: 9,
                    itemGap: 10
                }
            },
            DiseaseMapLetterOrder: ['modifyConfirm', 'confirm', 'heal', 'dead'],
            DiseaseMapClass: {
                // modifyConfirm: '#00b9d1'
                modifyConfirm: 'orange',
                confirm: 'red',
                dead: 'gray',
                heal: 'green'
                // suspect: 'orange'
            },
            DiseaseMapLetter: {
                modifyConfirm: '新增病例',
                confirm: '确诊病例',
                dead: '死亡病例',
                heal: '治愈出院'
                // suspect: '疑似病例'
            },
            statisticSummary: {
                datetime: '--',
                sum: '--'
            },
            isLoadingMore: false,
            hasNoMoreCases: false,
            hasNoCasesData: false,
            filters: {
                residenceEnums: {
                    // selected: '',
                    options: [
                        {
                            value: 2,
                            label: '居住武汉'
                        },
                        {
                            value: 1,
                            label: '居住深圳'
                        }
                    ]
                }
                // illState: {
                //   selected: '',
                //   options: [
                //     {
                //       value: '情况稳定',
                //       label: '情况稳定'
                //     },
                //     {
                //       value: '情况危重',
                //       label: '情况危重'
                //     }
                //   ]
                // }
            },
            casesOrderOptions: [
                {
                    value: 'confirmTime',
                    label: '入院时间'
                },
                {
                    value: 'age',
                    label: '患者年龄'
                }
            ],
            casesOrderBy: 'confirmTime',
            casesOrderDir: 'desc',
            casesPageNum: 10,
            casesTotalCount: 0,
            totalCityInfo: {
                city: '',
                modifyConfirm: '-',
                confirm: '-',
                suspect: '-',
                dead: '-',
                heal: '-',
                dayModify: {}
            },
            totalCityInfoStatTime: '--',
            cases: [],
            isLoadingChartData: true,
            isChartDataLoadFail: false,
            ageChartData: null,
            ageChartExtend: merge(getDefaultHistogramExtend(), {
                xAxis: {
                    name: '(岁)'
                }
            }),
            residenceChartData: null,
            ringChartSetting: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                radius: [50, 75],
                // radius: [75, 100],
                offsetY: 100
                // offsetY: 130
            },
            ringChartExtend: {
                legend: {
                    show: true,
                    textStyle: {
                        fontSize: 10,
                        color: '#333333'
                    },
                    icon: 'rect',
                    borderRadius: 0,
                    itemWidth: 9,
                    itemHeight: 9,
                    itemGap: 10
                },
                series: {
                    smooth: false
                }
            },
            sickAndConfirmChartData: null,
            sickAndConfirmChartSettings: {
                xAxis: {
                    axisLabel: {
                        fontSize: 9
                    }
                },
                yAxis: {
                    minInterval: 1,
                    splitLine: {
                        lineStyle: {
                            color: '#CACACA',
                            width: 0.8
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
                    bottom: 0
                },
                grid: {
                    left: '0%',
                    right: '5%',
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
                    // borderColor: '#fff'
                },
                tooltip: {
                    show: false
                }
            },
            hospitalDurationChartData: null,
            hospitalDurationChartDataExtend: merge(getDefaultHistogramExtend(), {
                xAxis: {
                    name: '(天)'
                }
            })
        }
    },
    computed: {
        isFiltered () {
            return JSON.stringify(this.filterForm) !== JSON.stringify(getDefaultFilterParams())
        },
        cityCode () {
            return this.$route.query.cityCode || '440300'
        },
        quickFilters () {
            let filters = this.filters
            let arr = []
            for (let [type, obj] of Object.entries(filters)) {
                let { options } = obj
                options.forEach((item) => {
                    arr.push({
                        type,
                        ...item
                    })
                })
            }
            return arr
        }
    },
    methods: {
        scrollToPanelHeadr () {
            this.$nextTick(() => {
                const element = this.$refs.caseDetailsPanelHeader
                const posObj = element.getBoundingClientRect()
                window.scrollTo(0, posObj.top + window.scrollY)
            })
        },
        toggleShowFilter () {
            this.isFilterVisible = !this.isFilterVisible
            if (this.isFilterVisible) {
                this.scrollToPanelHeadr()
            }
        },
        onSearchPopBoxConfirm (data) {
            this.isFilterVisible = false
            this.filterForm = data
            this.getCasesList()
        },
        resetFilterForm () {
            this.filterForm = getDefaultFilterParams()
        },
        resetFilterFormField (field) {
            const defaultParams = getDefaultFilterParams()
            this.filterForm[field] = defaultParams[field]
        },
        formatInHospDate (date) {
            return date.substr(0, 10)
        },
        async initPageData () {
            this.getTotalData()
            this.fetchStatisticData()
            this.getCasesList(true)
            this.fetchFilterDataMap()
        },
        async onLoadMoreClick () {
            const list = await this.fetchCasesList(false)
            if (list.length < this.casesPageNum || this.cases.length === this.casesTotalCount) {
                this.hasNoMoreCases = true
                return
            }
            this.cases.splice(this.cases.length, 0, ...list)
        },
        getfilterParams () {
            const obj = {}
            for (let p in this.filterForm) {
                const val = this.filterForm[p]
                const isEmptyArray = Array.isArray(val) && val.length === 0
                const isInvalidMaxAge = p === 'maxAge' && val <= 0
                const isEmptyString = val === ''
                if (isEmptyArray || isEmptyString || isInvalidMaxAge) {
                    continue
                }

                obj[p] = val
            }
            const formatedObj = this.formatFilterParams(obj)
            console.log('filter', JSON.stringify(formatedObj))
            return formatedObj
        },
        formatFilterParams (obj) {
            const newObj = { ...obj }
            const endTimes = ['endInHospTime', 'endSickTime']
            endTimes.forEach((key) => {
                const val = newObj[key]
                if (val) {
                    newObj[key] = val + ' 23:59:59'
                }
            })
            if (newObj.maxAge > 100) {
                delete newObj.maxAge
            }
            return newObj
        },
        isAsc (field) {
            return this.isOrderBy(field) && this.casesOrderDir === 'asc'
        },
        isDesc (field) {
            return this.isOrderBy(field) && this.casesOrderDir === 'desc'
        },
        isOrderBy (field) {
            return field === this.casesOrderBy
        },
        isFilteredBy (item) {
            const selectedValue = this.filterForm[item.type]
            if (Array.isArray(selectedValue)) {
                return selectedValue.includes(item.value)
            }
            return selectedValue === item.value
        },
        handleQuickFilter (item) {
            let targetGroup = this.filters[item.type]

            const selectedValue = this.filterForm[item.type]
            if (Array.isArray(selectedValue)) {
                const index = selectedValue.indexOf(item.value)
                if (index === -1) {
                    selectedValue.push(item.value)
                } else {
                    selectedValue.splice(index, 1)
                }
            } else {
                if (selectedValue === item.value) {
                    this.resetFilterFormField(item.type)
                } else {
                    this.filterForm[item.type] = item.value
                }
            }

            this.reportStatLog({
                actionType: 'event',
                actionName: 'quickFilter',
                extra: {
                    type: item.type,
                    value: item.value
                }
            })
            this.getCasesList()
        },
        toggleOrder (item) {
            if (this.isAsc(item.value)) {
                this.casesOrderDir = 'desc'
            } else if (this.isDesc(item.value)) {
                this.casesOrderDir = 'asc'
            } else {
                this.casesOrderBy = item.value
                this.casesOrderDir = 'asc'
            }
            this.reportStatLog({
                actionType: 'event',
                actionName: 'toggleOrder',
                extra: {
                    orderBy: this.casesOrderBy,
                    orderDir: this.casesOrderDir
                }
            })
            this.getCasesList()
        },
        async getTotalData () {
            try {
                const channel = this.$route.query && this.$route.query.channel
                const context = { channel }
                const { recentTime, cityInfo } = await httpUtils(
                    'getCityInfoByCode',
                    { cityCode: this.cityCode },
                    'THPneumoniaOuterDataService',
                    context
                )
                this.totalCityInfo = cityInfo
                this.totalCityInfo.dayModify = {
                    confirm: cityInfo.modifyConfirm,
                    suspect: cityInfo.modifySuspect,
                    dead: cityInfo.modifyDead,
                    heal: cityInfo.modifyHeal
                }

                this.totalCityInfoStatTime = recentTime
            } catch (e) {
                this.$toast({
                    type: 'error',
                    message: '获取实时数据失败',
                    showTime: 1500
                })
            }
        },
        async getCasesList (isFirstLoad) {
            this.hasNoMoreCases = false
            this.hasNoCasesData = false
            const list = await this.fetchCasesList(true)
            if (list.length === 0) {
                this.hasNoCasesData = true
            }
            this.cases = list
            if (!isFirstLoad) {
                this.scrollToPanelHeadr()
            }
            if (list.length < this.casesPageNum || this.cases.length === this.casesTotalCount) {
                this.hasNoMoreCases = true
            }
        },
        formatHightlightHtml (patient) {
            const rawText = patient.rawText
            if (!rawText) {
                return ''
            }
            const illStateRText = patient.illStateRText
            if (illStateRText) {
                const { end, start, text } = illStateRText
                const len = end - start
                const chars = rawText.split('')
                const html = `<strong class="txt-status">${text}</strong>`
                chars.splice(start, len, html)
                return chars.join('')
            }
            return patient.rawText
        },
        formatAgeChartData (chartData) {
            return {
                columns: ['年龄', '确诊病例人数'],
                rows: chartData.map((item) => {
                    return {
                        年龄: item.name,
                        确诊病例人数: item.value
                    }
                })
            }
        },
        formatResidenceChartData (chartData) {
            const columns = ['地区', '数量']
            const rows = []
            chartData.forEach((item) => {
                columns.push(item.name)
                rows.push({
                    地区: item.name,
                    数量: item.value
                })
            })
            return {
                columns,
                rows
            }
        },
        formatHospitalDurationChartData (chartData) {
            return {
                columns: ['天数', '确诊病例人数'],
                rows: chartData.map((item) => {
                    return {
                        天数: item.name,
                        确诊病例人数: item.value
                        // '数量1': item.value
                    }
                })
            }
        },
        formatSickAndConfirmChartData ({ confirmChartData, sickChartData }) {
            const map = new Map()
            sickChartData.forEach((item) => {
                const data = map.get(item.name) || {}
                data.sickCount = item.value
                map.set(item.name, data)
            })
            confirmChartData.forEach((item) => {
                const data = map.get(item.name) || {}
                data.confirmCount = item.value
                map.set(item.name, data)
            })
            const columns = ['日期', '发病人数', '入院人数']
            const rows = []
            map.forEach((item, key) => {
                rows.push({
                    日期: key,
                    发病人数: item.sickCount,
                    入院人数: item.confirmCount
                })
            })

            return {
                columns,
                rows
            }
        },
        async fetchStatisticData () {
            try {
                const res = await httpUtils(
                    'getStatistic',
                    { cityCode: this.cityCode },
                    'THPneumoniaPatientOuterService'
                    // context
                )
                const {
                    statisticSummary,
                    statisticAge,
                    statisticResidence,
                    statisticNumber,
                    statisticToHospDuration
                } = res
                this.statisticSummary = statisticSummary
                this.ageChartData = this.formatAgeChartData(statisticAge.chartData)
                this.residenceChartData = this.formatResidenceChartData(statisticResidence.chartData)
                this.hospitalDurationChartData = this.formatHospitalDurationChartData(statisticToHospDuration.chartData)
                this.sickAndConfirmChartData = this.formatSickAndConfirmChartData(statisticNumber)
            } catch (e) {
                this.isChartDataLoadFail = true
                console.log('请求失败', e)
            } finally {
                this.isLoadingChartData = false
            }
        },
        async fetchCasesList (isRefresh) {
            this.isLoadingMore = true
            const params = {
                orderBy: this.casesOrderBy,
                dir: this.casesOrderDir,
                filter: this.getfilterParams(),
                // pageIndex,
                pageNum: this.casesPageNum
            }
            console.log('params', params)
            const sorts = {
                'confirmTime.asc': 1,
                'confirmTime.desc': 2,
                'age.asc': 3,
                'age.desc': 4
            }
            const excludeIds = isRefresh ? [] : this.cases.map((item) => item.id)
            const sort = sorts[`${this.casesOrderBy}.${this.casesOrderDir}`]
            const filter = this.getfilterParams()
            const channel = this.$route.query && this.$route.query.channel
            const context = { channel }
            try {
                const { patients, total } = await httpUtils(
                    'getPatients',
                    {
                        cityCode: this.cityCode,
                        filter,
                        excludeIds,
                        pageNum: this.casesPageNum,
                        sort // sort 1-确诊时间正序 2-确诊时间倒序 3-患者年龄正序 4-患者年龄倒序
                    },
                    'THPneumoniaPatientOuterService',
                    context
                )
                this.casesTotalCount = total
                return patients
            } catch (e) {
                this.$toast({
                    type: 'error',
                    message: '获取个案详情失败',
                    showTime: 1500
                })
                console.log(e)
                return []
            } finally {
                this.isLoadingMore = false
            }
        },
        async fetchFilterDataMap () {
            try {
                const res = await httpUtils(
                    'getDataMap',
                    { cityCode: this.cityCode },
                    'THPneumoniaPatientOuterService'
                    // context
                )
                const { gender, symptom, illState, residence } = res

                this.searchPopBoxDataMap = {
                    genders: gender.map((item) => {
                        return {
                            value: item.intVal,
                            label: item.name
                        }
                    }),
                    symptom: symptom
                        .map((item) => {
                            return {
                                value: item.strVal,
                                label: item.name || '无'
                            }
                        })
                        .sort((a, b) => {
                            return a.value === '' ? -1 : 1
                        }),
                    illState: illState
                        .map((item) => {
                            return {
                                value: item.strVal,
                                label: item.name || '无'
                            }
                        })
                        .sort((a, b) => {
                            return a.value === '' ? -1 : 1
                        }),
                    residenceEnums: residence.map((item) => {
                        return {
                            value: item.intVal,
                            label: item.name
                        }
                    })
                }
            } catch (e) {
                console.log('fetchFilterDataMap ', e)
            }
        }
    },
    async created () {
        this.initPageData()
    },
    watch: {
        cityCode () {
            this.initPageData()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~styles/views/disease/casedetail/case-detail.scss';
.container-case-detail {
    &,
    * {
        -webkit-touch-callout: none; /*系统默认菜单被禁用*/
        -webkit-user-select: none; /*webkit浏览器*/
        -khtml-user-select: none; /*早期浏览器*/
        -moz-user-select: none; /*火狐*/
        -ms-user-select: none; /*IE10*/
        user-select: none;
    }
}
</style>
