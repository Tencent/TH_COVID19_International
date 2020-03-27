<template>
    <div>
        <div class="charts-wrapper epanel">
            <div ref="titleBar" class="epanel-title-bar">
                <p class="epanel-title">{{ $t('home.Regional_Updates') }}</p>
                <!-- <p class="epanel-sub-title">{{notice}}</p> -->
            </div>
            <div class="subpanel subpanel--local">
                <div class="subpanel-box">
                    <div class="datalist">
                        <table
                            class="index-update"
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                            style="position: relative;"
                        >
                            <thead class="header-area">
                                <th>{{ $t('common.Region') }}</th>
                                <th class="txt-info">{{ $t('common.New_Cases') }}</th>
                                <th class="txt-warning">{{ $t('common.Total_Cases') }}</th>
                                <th class="txt-success">{{ $t('common.Total_Recovered') }}</th>
                                <th>{{ $t('common.Total_Deaths') }}</th>
                            </thead>
                            <thead v-if="areaHeaderFixed" class="set-top">
                                <th>{{ $t('common.Region') }}</th>
                                <th class="txt-info">{{ $t('common.New_Cases') }}</th>
                                <th class="txt-warning">{{ $t('common.Total_Cases') }}</th>
                                <th class="txt-success">{{ $t('common.Total_Recovered') }}</th>
                                <th>{{ $t('common.Total_Deaths') }}</th>
                            </thead>
                            <tbody>
                                <!-- KEEP LOCAL -->
                                <template v-if="areaInfo.area">
                                    <tr
                                        v-if="areaInfo.area"
                                        class="set-color radius-set"
                                        @click="handleItemClick(areaInfo, 'LocalArea')"
                                    >
                                        <td>
                                            <div class="cell add-tag-red">
                                                <p>{{ areaInfo.area }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p class="txt-info">
                                                    <modify-number :number="areaInfo.modifyConfirmDesc" />
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p class="txt-warning">{{ areaInfo.confirm }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p>{{ areaInfo.heal }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p>{{ areaInfo.dead }}<i class="icon-arrow-right"></i></p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr
                                        v-if="cityInfo.city"
                                        class="set-color radius-set"
                                        @click="toCityHomeFromList(cityInfo)"
                                    >
                                        <td>
                                            <div class="cell">
                                                <p>{{ cityInfo.city }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p class="txt-info">
                                                    <modify-number :number="cityInfo.modifyConfirmDesc" />
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p class="txt-warning">{{ cityInfo.confirm }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p>{{ cityInfo.heal }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p>
                                                    {{ cityInfo.dead
                                                    }}<i v-if="cityInfo.keyCity === 1" class="icon-arrow-right"></i>
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                                <template v-if="trendDataGroup && trendDataGroup.length > 0">
                                    <tr
                                        v-for="(trendData, groupIndex) in trendDataGroup"
                                        :key="groupIndex"
                                        class="other-city"
                                        @click="handleItemClick(trendData)"
                                    >
                                        <td>
                                            <div class="cell">
                                                <p>{{ trendData.area }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p class="txt-info">
                                                    <modify-number :number="trendData.modifyConfirmDesc" />
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p class="txt-warning">{{ trendData.confirm }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p>{{ trendData.heal }}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="cell">
                                                <p>{{ trendData.dead }}</p>
                                                <i v-if="trendData.cityinfo" class="icon-arrow-right"></i>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <div class="more-link btn-more btn-more-area" @click="switchMore('area')">
                            <span v-if="areaMore" class="more"
                                >{{ $t('common.Show_Less') }}<i class="icon-arrow-up"></i
                            ></span>
                            <span v-else class="more">{{ $t('common.More') }}<i class="icon-arrow-down"></i></span>
                        </div>
                    </div>
                    <p class="remark-tips ocean">{{ dataFrom }}</p>
                </div>
            </div>
        </div>
        <DynamicBroadcast
            class="__chengshiyiqing-news"
            :fullNews="chinaFullNews"
            newsType="china_broadcast_tips"
            :totalTongbaoCnt="totalChinaTongbaoCnt"
            @getContentInfo="getContentInfo"
        />
    </div>
</template>
<script>
import { mapState } from 'vuex'
import httpUtils from '@/api'
import ModifyNumber from '@/components/ModifyNumber'
import DynamicBroadcast from '@/components/home/DynamicBroadcast'

// toast为单例，两次调用toast会互相影响
import Vue from 'vue'
import Toast from '@/components/Toast/Toast.vue'

const ToastConstructor = Vue.extend(Toast)

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
    components: {
        ModifyNumber,
        DynamicBroadcast
    },
    props: {
        areaTotal: {
            type: Array,
            default: () => []
        },
        notice: {
            type: String,
            default: ''
        },
        dataFrom: {
            type: String,
            default: ''
        },
        recentTime: {
            type: String,
            default: ''
        },
        chinaFullNews: {
            type: Array,
            default () {
                return []
            }
        },
        totalChinaTongbaoCnt: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            mapChartSize: '320px',
            mapChartHeight: '220px',

            curMapData: {
                columns: ['country', 'confirm'],
                rows: []
            },
            cityCode: '',

            areaHeaderFixed: false,
            areaMore: false,
            areaInfo: {},
            cityInfo: {},
            currentAreaName: '' // 当前省份名称
        }
    },
    computed: {
        ...mapState({
            initData: (state) => state.initData
        }),
        trendDataGroup () {
            return this.makeTrendDataGroup()
        }
    },
    async mounted () {
        this.mapChartSize = `${window.innerWidth * 0.9}px`
        let cityCode = this.$route.query.cityCode
        this.cityCode = cityCode
        if (cityCode) {
            this.fetchLocalDetail(cityCode)
        }
        this.initScroll()
        window.addEventListener('scroll', this.onPageScroll)
    },
    destroyed () {
        window.removeEventListener('scroll', this.onPageScroll)
    },
    methods: {
        getContentInfo () {
            this.$emit('getContentInfo')
        },
        onPageScroll () {
            this.handleTableHeaderFixed('area')
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
                dashboard: 'titleBar'
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
        // KEEP LOCAL
        async fetchLocalDetail (cityCode) {
            try {
                const data = await httpUtils('getCityInfoByCode', { cityCode }, 'THPneumoniaOuterDataService')
                if (data.code === 0) {
                    let { areaInfo, cityInfo } = data
                    this.areaInfo = areaInfo
                    this.cityInfo = cityInfo
                    this.currentAreaName = areaInfo.area
                } else {
                    let toastErr = this.$loadingToast({ message: '位置获取失败' })
                    setTimeout(() => {
                        toastErr.close()
                    }, 2000)
                }
            } catch (e) {
                console.log('位置获取失败')
                let toastErr = this.$loadingToast({ message: '位置获取失败' })
                setTimeout(() => {
                    toastErr.close()
                }, 2000)
            }
        },
        async getGeoCode (latitude, longitude) {
            const districtCodeRes = await httpUtils(
                'geoCode',
                {
                    location: {
                        lat: latitude,
                        lng: longitude
                    }
                },
                'OuterLocation'
            )
            let cityCode = districtCodeRes && districtCodeRes.address.cityCode
            let cityName = districtCodeRes && districtCodeRes.address.city

            // 对于直辖市(省级)，会定位到直辖市城区(市级)，需要特殊处理
            let directPrefixs = ['11', '12', '50', '31']
            const prefix = cityCode.substr(0, 2)
            const pos = directPrefixs.indexOf(prefix)
            if (pos !== -1) {
                cityCode = directPrefixs[pos] + '0000'
                cityName = cityName.substr(0, 2)
            }
            return {
                cityCode,
                cityName
            }
        },
        handleItemClick (d, tag) {
            if (d.cityinfo === 0) return
            this.toMapDetail(d.area, tag)
        },
        toCityHomeFromList (cityInfo) {
            if (cityInfo.keyCity === 1) {
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'yiqingbobao.overview.localArea.toCityDetail'
                })
                const { cityCode, channel } = this.$route.query
                this.$router.push({
                    path: '/city-detail',
                    query: {
                        channel,
                        cityCode,
                        province: cityInfo.area,
                        cityName: cityInfo.city
                    }
                })
            }
        },
        toMapDetail (name, tag = false) {
            if (tag === 'LocalArea') {
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'yiqingbobao.overview.localArea.toMapDetail',
                    extra: { name }
                })
            } else {
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'yiqingbobao.overview.province.toMapDetail',
                    extra: { name }
                })
            }
            const { cityCode, channel } = this.$route.query
            // 跳转前临时缓存希望跳转的模块
            this.$router.replace({ query: { ...this.$route.query, moduleCache: 'dashboard' } })
            this.$router.push({
                path: '/map-detail',
                query: {
                    province: name,
                    channel,
                    cityCode,
                    moduleCache: 'titleBar'
                }
            })
        },
        makeTrendDataGroup () {
            const { areaInfo, areaTotal } = this
            let trendData = areaTotal
            if (!trendData) {
                return []
            }
            trendData = trendData.filter((d) => (d.confirm || d.dead) && d.area !== areaInfo.area)

            if (this.areaMore) return trendData
            else return trendData.slice(0, 5)
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
<style lang="scss" scoped></style>
