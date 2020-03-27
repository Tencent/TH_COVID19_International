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
    <div class="page-international tab-content-international">
        <div class="international-charts-wrapper content-wrapper epanel">
            <div ref="foreign-dashboard" class="epanel-title-bar">
                <div class="title-wrap">
                    <p class="epanel-title">{{ $t('home.Overseas_Updates') }}</p>
                    <p class="epanel-sub-title">
                        {{ $t('common.Total_Cases') }}
                        <span class="txt-warning"> {{ foreignTotalCount.confirm }} </span>,
                        {{ $t('common.Total_Deaths') }} {{ foreignTotalCount.dead }}
                    </p>
                </div>
            </div>
            <div class="subpanel subpanel--local">
                <!-- 世界疫情地图 -->
                <AbroadMap
                    v-if="globalConfig.feature.overseaMap.show"
                    :curMapData="curMapData"
                    :foreignData="foreignTotal"
                    @toForeignDetail="toForeignDetail"
                />
                <!-- 海外整体走势 -->
                <div class="chart-box-list">
                    <SwitchLine :dataList="abroadChart" :customConfigs="['singleLegend']" />
                </div>
                <!-- 重点国家疫情走势 -->
                <div class="chart-box-list">
                    <SwitchLine :dataList="abroadCountryChart" />
                </div>
                <!-- 海外国际疫情情况列表  -->
                <div class="subpanel-box">
                    <div class="epanel-title-bar">
                        <p class="epanel-title">{{ $t('home.Regional_Updates') }}</p>
                    </div>
                    <div class="datalist">
                        <table class="index-update ocean" border="0" cellspacing="0" cellpadding="0">
                            <thead class="header-oversea">
                                <th>{{ $t('common.Region') }}</th>
                                <th class="txt-info">{{ $t('common.New_Cases') }}</th>
                                <th>{{ $t('common.Total_Cases') }}</th>
                                <th>{{ $t('common.Total_Recovered') }}</th>
                                <th>{{ $t('common.Total_Deaths') }}</th>
                            </thead>
                            <thead v-if="overseaHeaderFixed" class="set-top">
                                <th>{{ $t('common.Region') }}</th>
                                <th class="txt-info">{{ $t('common.New_Cases') }}</th>
                                <th>{{ $t('common.Total_Cases') }}</th>
                                <th>{{ $t('common.Total_Recovered') }}</th>
                                <th>{{ $t('common.Total_Deaths') }}</th>
                            </thead>
                            <tbody>
                                <!--other-city间距 -->
                                <tr
                                    class="other-city"
                                    v-for="(d, index) in abroadDataGroup"
                                    :key="index"
                                    @click="toForeignDetail({ name: d.country, confirm: d.confirm })"
                                >
                                    <td>
                                        <div class="cell">
                                            <p>{{ d.country }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <p class="txt-info">{{ d.modifyConfirmDesc }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <p class="txt-warning">{{ d.confirm }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <p>{{ d.heal }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <p>
                                                {{ d.dead }}
                                                <!-- <i v-if="listDetailCountries.includes(d.country)" class="icon-arrow-right"></i> -->
                                                <i v-if="hasDetails(d.confirm)" class="icon-arrow-right"></i>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="more-link btn-more btn-more-oversea" @click="switchMore('oversea')">
                            <span v-if="overseaMore" class="more"
                                >{{ $t('common.Show_Less') }}<i class="icon-arrow-up"></i
                            ></span>
                            <span v-else class="more">{{ $t('common.More') }}<i class="icon-arrow-down"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DynamicBroadcast
            class="__chengshiyiqing-abroad-news"
            newsType="abroad_broadcast_tips"
            :fullNews="fullNews"
            :totalTongbaoCnt="totalTongbaoCnt"
            @getContentInfo="getContentInfo"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import DynamicBroadcast from '@/components/home/DynamicBroadcast'
import AbroadMap from '@/components/home/AbroadMap'
import SwitchLine from '@/components/home/SwitchLine'
import { abroadLineConfig } from '@/config/SwitchLine/index'
import Toast from '@/components/Toast/Toast.vue'
const ToastConstructor = Vue.extend(Toast)
// const FOREIGN_CITY_CODE = '990000'

let toastInstance = null
function toast ({ type, message, showTime, title = '' }) {
    if (toastInstance === null) {
        toastInstance = new ToastConstructor()
    }
    const prom = new Promise((resolve) => {
        toastInstance.type = type
        toastInstance.message = message
        toastInstance.resolve = resolve
        toastInstance.showTime = showTime
        toastInstance.title = title
        if (!toastInstance.isMounted) {
            const dom = document.createElement('div')
            document.querySelector('body').appendChild(dom)
            toastInstance.$mount(dom)
        }
        toastInstance.show()
    })
    toastInstance.prom = prom
    return toastInstance
}

export default {
    name: 'Abroad',
    components: {
        DynamicBroadcast,
        AbroadMap,
        SwitchLine
    },
    props: {
        fullNews: {
            type: Array,
            default () {
                return []
            }
        },
        totalTongbaoCnt: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            overseaMore: false,
            overseaHeaderFixed: false,
            foreignTotal: [],
            foreignTotalCount: {
                confirm: 0,
                dead: 0
            },
            curMapData: {
                columns: ['country', 'confirm'],
                rows: []
            },
            listDetailCountries: ['韩国', '日本本土', '意大利', '伊朗', '美国']
        }
    },
    computed: {
        ...mapState({
            initData: (state) => state.initData
        }),
        abroadDataGroup () {
            const { overseaMore, foreignTotal } = this
            if (overseaMore) return foreignTotal
            else return foreignTotal.slice(0, 7)
        },
        abroadChart () {
            try {
                let chartData = []
                let summaryHistory = this.initData.getForeignHistory.summaryHistory
                if (summaryHistory) {
                    chartData = [
                        {
                            title: abroadLineConfig.total[0].title,
                            tabName: abroadLineConfig.total[0].tabName,
                            easyData: [[summaryHistory, 'modifyConfirm', 'modify-confirm', 'day']]
                        },
                        {
                            title: abroadLineConfig.total[1].title,
                            tabName: abroadLineConfig.total[1].tabName,
                            easyData: [[summaryHistory, 'confirm', 'total-confirm', 'day']]
                        },
                        {
                            title: abroadLineConfig.total[2].title,
                            tabName: abroadLineConfig.total[2].tabName,
                            easyData: [[summaryHistory, 'healRate', 'heal-rate', 'day']],
                            customConfigs: ['rate']
                        },
                        {
                            title: abroadLineConfig.total[3].title,
                            tabName: abroadLineConfig.total[3].tabName,
                            easyData: [[summaryHistory, 'deadRate', 'dead-rate', 'day']],
                            customConfigs: ['rate']
                        }
                    ]
                }
                return chartData
            } catch (error) {
                return []
            }
        },
        abroadCountryChart () {
            try {
                let chartData = []
                let specilCountry = this.globalConfig.feature.overseaMap.specilCountry
                let totalHistorys = this.initData.getForeignHistory.totalHistorys
                specilCountry.forEach(country => {
                    if (totalHistorys[country]) {
                        chartData.push({
                            title: country,
                            tabName: country,
                            easyData: [
                                [totalHistorys[country], 'confirm', 'total-confirm', 'day'],
                                [totalHistorys[country], 'heal', 'total-heal', 'day'],
                                [totalHistorys[country], 'dead', 'total-dead', 'day']
                            ]
                        })
                    }
                })
                return chartData
            } catch (error) {
                return []
            }
        }
    },
    watch: {
        initData (initData) {
            this.initAbroadData(initData)
        }
    },
    async mounted () {
        this.initAbroadData(this.initData)
        this.initScroll()
        window.addEventListener('scroll', this.onPageScroll)
    },
    destroyed () {
        window.removeEventListener('scroll', this.onPageScroll)
    },
    methods: {
        hasDetails (confirm) {
            if (confirm < 10) return false
            return true
        },
        getContentInfo () {
            this.$emit('getContentInfo')
        },
        onPageScroll () {
            this.handleTableHeaderFixed('oversea')
        },
        handleTableHeaderFixed (module) {
            const moduleHeader = document.querySelector(`.header-${module}`)
            const rectModuleHeader = moduleHeader.getBoundingClientRect()
            const topModuleHeader = rectModuleHeader && rectModuleHeader.top
            const moduleFooter = document.querySelector(`.btn-more-${module}`)
            const rectModuleFooter = moduleFooter.getBoundingClientRect()
            const topModuleFooter = rectModuleFooter && rectModuleFooter.top
            const moduleFixedKey = `${module}HeaderFixed`
            // 54 为置顶 tab 的高度，100 为更多按钮取消表头固定的阈值
            if (topModuleHeader < 54 && topModuleFooter > 100) {
                if (!this[moduleFixedKey]) {
                    this[moduleFixedKey] = true
                }
            } else {
                if (this[moduleFixedKey]) {
                    this[moduleFixedKey] = false
                }
            }
        },
        initScroll () {
            let { module, moduleCache } = this.$route.query || {}
            if (moduleCache) module = moduleCache
            const refMap = {
                'foreign-dashboard': 'foreign-dashboard'
            }
            const ref = refMap[module]
            if (ref) {
                const to = toast({ type: 'loading', message: '加载中' })
                setTimeout(() => {
                    const elem = this.$refs[ref]
                    const posObj = elem.getBoundingClientRect()
                    window.scrollTo(0, posObj.top + window.scrollY - 60)
                    to.close()
                    if (moduleCache) {
                        // 清理临时缓存的 module
                        let newQuery = JSON.parse(JSON.stringify(this.$route.query)) // 深拷贝
                        delete newQuery.moduleCache
                        this.$router.replace({ query: newQuery })
                    }
                }, 1000)
            }
        },
        initAbroadData (initData) {
            if (initData.getForeignInfo) {
                const { code, foreignTotal } = initData.getForeignInfo
                if (code === 0) {
                    this.foreignTotal = foreignTotal
                    let confirm = 0
                    let dead = 0
                    foreignTotal.forEach((v) => {
                        confirm += v.confirm
                        dead += v.dead
                    })
                    this.foreignTotalCount.confirm = confirm
                    this.foreignTotalCount.dead = dead
                    const { chinaTotal } = initData.getChinaTotal.data
                    const curMapData = foreignTotal.concat({ country: 'China', confirm: chinaTotal.confirm })
                    // let diamondShip = curMapData.find(item => item.country === '钻石号邮轮')
                    // let Japan = curMapData.find(item => item.country === '日本本土')
                    // let realJapan = {
                    //   confirm: diamondShip.confirm + Japan.confirm,
                    //   country: '日本',
                    //   dead: diamondShip.dead + Japan.dead,
                    //   heal: diamondShip.heal + Japan.heal,
                    //   localJapan: Japan,
                    //   diamondShip: diamondShip
                    // }
                    // curMapData.push(realJapan)
                    this.curMapData.rows = curMapData
                } else {
                    let toastErr = this.$loadingToast({ message: '海外数据获取失败' })
                    setTimeout(() => {
                        toastErr.close()
                    }, 2000)
                }
            }
        },
        toForeignDetail ({ name, confirm }) {
            // if (!this.listDetailCountries.includes(name)) return
            if (name === 'China' || !this.hasDetails(confirm)) return
            this.reportStatLog({
                actionType: 'event',
                actionName: 'yiqingbobao.overview.foreign.toMapDetail',
                extra: { name }
            })
            const { cityCode, channel } = this.$route.query
            // 跳转前临时缓存希望跳转的模块
            this.$router.replace({ query: { ...this.$route.query, moduleCache: 'foreign-dashboard' } })
            this.$router.push({
                path: '/foreign-detail',
                query: {
                    country: name,
                    province: name,
                    channel,
                    cityCode,
                    moduleCache: 'foreign-dashboard'
                }
            })
        },
        getOffsetTop (el) {
            return el.offsetParent ? el.offsetTop + this.getOffsetTop(el.offsetParent) : el.offsetTop
        },
        switchMore (module) {
            const moduleKey = `${module}More`
            const moduleValue = this[moduleKey]
            const offsetKey = `${module}Offset`
            const extra = { [moduleKey]: moduleValue }
            this.reportStatLog({
                actionType: 'event',
                actionName: `dashboard.${module}.more.switch`,
                extra
            })
            if (moduleValue) {
                window.scrollTo(0, this[offsetKey] + 1)
            } else {
                const moduleHeader = document.querySelector(`.header-${module}`)
                const offsetTop = this.getOffsetTop(moduleHeader)
                const fixedTabHeight = 54
                const marginTop = 5
                this[offsetKey] = offsetTop - fixedTabHeight - marginTop
            }
            this[moduleKey] = !moduleValue
        }
    }
}
</script>

<style lang="scss">
@import '~styles/views/disease/international';
</style>

<style lang="scss" scoped>
.chart-box-list {
    margin-bottom: 30px;
}
</style>
