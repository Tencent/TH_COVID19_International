<template>
    <div
        class="container page-citydetail page-h5"
        :class="{ 'page-citydetailsub': tongbaoList.length === 0, 'page-citydetail-en': locale === 'en' }"
    >
        <!-- 头部 -->
        <div class="content-wrapper epanel epanel--tools" id="ve-lines">
            <div class="title-bar">
                <p class="title" v-if="country">{{ $t('details.COVID_19_Live_Updates') }} - {{ country }}</p>
                <p class="sub-title" v-if="recentTime">Updated {{ recentTime }}</p>
            </div>
            <div class="panel-toolbox">
                <!-- 头部数据概览 -->
                <div class="panel-dashboard panel-dashboard--simple">
                    <div class="panel-dashboard-grid">
                        <div class="panel-dashboard-item item--new">
                            <div class="panel-dashboard-val">
                                <span class="val-text">
                                    <modify-number :number="countryInfo.modifyConfirmDesc" />
                                </span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text">{{ $t('legend.modify-confirm') }}</span>
                            </div>
                        </div>

                        <div class="panel-dashboard-item item--error">
                            <div class="panel-dashboard-val">
                                <span class="val-text">{{ countryInfo.confirm }}</span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text">{{ $t('legend.total-confirm') }}</span>
                            </div>
                        </div>

                        <div class="panel-dashboard-item item--success">
                            <div class="panel-dashboard-val">
                                <span class="val-text">{{ countryInfo.heal }}</span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text">{{ $t('legend.total-heal') }}</span>
                            </div>
                        </div>

                        <div class="panel-dashboard-item item--default">
                            <div class="panel-dashboard-val">
                                <span class="val-text">{{ countryInfo.dead }}</span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text">{{ $t('legend.total-dead') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 抗疫工具 PENDING -->
                <!-- <div class="panel-toolbutton" v-if="filterdBanner.length && loadedTools">
              <div class="panel-toolbox-tit">抗疫工具</div>
              <div class="panel-toolbutton-scrollbar">
                  <div class="disease-entrance-list">
                      <a class="disease-entrance-button" v-for="(item, index) in filterdBanner" :key="index" @click="toEntryPath(item)">
                        <span class="disease-entrance-icon icon--yqzs">
                          <img :src="item.imageUrl" alt="" />
                        </span>
                        <span class="disease-entrance-txt">
                          {{item.bannerName}}
                        </span>
                      </a>
                  </div>
              </div>
          </div> -->
                <div style="height: 30px;">
                    <!-- 该元素单纯用于更多工具完全不展示时提供高度以免元素塌陷 -->
                </div>
            </div>
        </div>
        <!-- 详情 -->
        <div class="content-wrapper epanel epanel--map">
            <!-- 地图 -->
            <template v-if="isFocus">
                <div class="title-bar">
                    <p class="title" v-if="country">{{ $t('details.COVID_19_Map') }}</p>
                </div>
                <div class="img-box">
                    <map-highlight
                        :areaData="currentCity"
                        :showModify="false"
                        :nameKey="locale === 'zh' ? 'city' : 'cityEn'"
                        style="top: 10px;"
                    />
                    <lung-map
                        :data="mapChartData"
                        :area="country"
                        :width="mapChartSize"
                        :height="mapChartSize"
                        :events="mapChartEvents"
                        :nameMap="nameMap"
                    ></lung-map>
                    <!-- 冲绳贴图 -->
                    <img
                        v-if="country === 'Japan'"
                        style="position: absolute; right: 20px; bottom: 40px; width: 80px; height: auto;"
                        src="https://static.wecity.qq.com/h5/2020-3/map_chongsheng-1e4db9e480886a71620d6011711bdea1.png"
                    />
                    <!-- <div class="prevent-click"></div> -->
                </div>
            </template>
            <template v-else>
                <div class="title-bar">
                    <p class="title">{{ $t('details.Regional_Updates') }}</p>
                </div>
            </template>
            <!-- 趋势图 -->
            <div class="ve-table-box">
                <p class="ve-tt" style="margin-top: 0;">{{ $t('legend.total-confirm') }} - {{ country }}</p>
                <p class="sub-title" v-if="newDay" style="margin-top: 10px; margin-bottom: 10px; color: #888;">
                    Updated {{ newDay }}
                </p>
                <EasyLine ref="easyline" class="chart-img" :easyData="easyData" :height="height" :width="width" />
            </div>
            <div class="ve-table-box" v-if="isFocus">
                <p class="ve-tt" style="margin-top: 0;">{{ $t('legend.modify-confirm') }} - {{ country }}</p>
                <p class="sub-title" v-if="newDay" style="margin-top: 10px; margin-bottom: 10px; color: #888;">
                    Updated {{ newDay }}
                </p>
                <EasyLine
                    ref="easyline"
                    class="chart-img"
                    :easyData="easyDataModify"
                    :customConfigs="['singleLegend']"
                    :height="height"
                    :width="width"
                />
            </div>
            <!-- 详情列表 -->
            <div class="subpanel subpanel--data" v-if="isFocus">
                <div class="sub-title-bar">
                    <p class="sub-title">{{ $t('details.Regional_Updates') }}</p>
                </div>
                <table
                    class="datalist datalist-detail foreign-datalist-detail"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    v-if="mapChartData.rows.length"
                >
                    <thead class="header-foreign">
                        <th>{{ $t('common.Region') }}</th>
                        <!-- <th class="txt-info" style="color: #00B9D1;padding-left: 0;">{{$t('legend.modify-confirm')}}</th> -->
                        <th class="txt-warning">{{ $t('legend.total-confirm') }}</th>
                        <th class="txt-success">{{ $t('legend.total-heal') }}</th>
                        <th>{{ $t('legend.total-dead') }}</th>
                    </thead>
                    <thead v-if="foreignHeaderFixed" class="set-foreign-bar-top">
                        <th>{{ $t('common.Region') }}</th>
                        <!-- <th class="txt-info" style="color: #00B9D1;padding-left: 0;">{{$t('legend.modify-confirm')}}</th> -->
                        <th class="txt-warning">{{ $t('legend.total-confirm') }}</th>
                        <th class="txt-success">{{ $t('legend.total-heal') }}</th>
                        <th>{{ $t('legend.total-dead') }}</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in mapChartData.rows" :key="index">
                            <template v-if="locale === 'en'? item.cityEnShort || item.cityEn : item.city">
                                <td>
                                    <div class="cell">
                                        <p>{{ locale === 'en' ? item.cityEnShort || item.cityEn : item.city }}</p>
                                    </div>
                                </td>
                                <!-- <td>
                                    <div class="cell">
                                        <p class="txt-info"><modify-number :number="item.modifyConfirmDesc" /></p>
                                    </div>
                                </td> -->
                                <td>
                                    <div class="cell">
                                        <p class="txt-warning">{{ item.confirm }}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <p class="">{{ item.showHeal === 1 ? item.heal : '-' }}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="cell">
                                        <p class="">{{ item.dead }}</p>
                                    </div>
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- 动态播报 -->
        <div class="content-wrapper epanel epanel--timelist" v-if="tongbaoList.length > 0">
            <div class="epanel-title-bar">
                <p class="epanel-title">{{ $t('home.Live_Updates') }} - {{ country }}</p>
            </div>
            <div class="timeline-list">
                <div class="timeline-item" v-for="(item, index) in tongbaoList" :key="index">
                    <div class="time-detail" v-if="item.publicTime">
                        <p class="date">{{ item.publicTime.substr(5, 6).replace('-', '.') }}</p>
                        <p class="time">{{ item.publicTime.substr(item.publicTime.length - 5) }}</p>
                    </div>
                    <div class="detail-box">
                        <div class="detail-box-inner">
                            <p class="box-tt" v-if="item.title">{{ item.title }}</p>
                            <p
                                class="box-content"
                                @click="item.more = false"
                                :class="{ more: item.more }"
                                v-if="item.desc"
                            >
                                {{ item.desc }}
                                <span class="more-txt">{{ $t('common.More') }}</span>
                            </p>
                            <p class="box-content-from" v-if="item.from">{{ item.from }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-more">
                <p class="more" v-if="loadAll">{{ $t('details.End') }}</p>
                <p class="more" v-else @click="getTongbaoList">
                    {{ $t('common.More') }}<i class="icon-arrow-down"></i>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { appendQuery } from '@/utils'
import httpUtils from '@/api'
import homeConfig from '@/config/home-default'
import LungMap from '@/components/charts/lungMap'
import MapHighlight from '@/components/MapHighlight'
import ModifyNumber from '@/components/ModifyNumber'
import EasyLine from '@/components/charts/EasyLine/line'

import { mapState, mapMutations } from 'vuex'

export default {
    name: 'ForeignDetail',
    components: {
        LungMap,
        MapHighlight,
        ModifyNumber,
        EasyLine
    },
    data () {
        this.mapChartEvents = {
            click: (e) => {
                const { name } = e
                let currentCity = null
                this.mapChartData.rows.forEach((v) => {
                    if (this.$i18n.locale === 'zh') {
                        if (v.city === name) currentCity = v
                    } else {
                        if (v.cityEn === name) currentCity = v
                    }
                })
                if (!currentCity) {
                    currentCity = { name }
                }
                this.currentCity = currentCity
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'ForeignDetail.map.mapArea.click',
                    extra: { city: e.name }
                })
            }
        }
        return {
            locale: this.$i18n.locale,
            detailCountries: ['韩国', '日本本土', '意大利', '伊朗', '美国'], // 有省份列表和地图数据的重点国家
            startTime: new Date().getTime(),
            country: '',
            recentTime: '',
            newDay: '',
            isFocus: false,
            foreignHeaderFixed: false,
            countryInfo: {},
            countryHistory: [],
            // 工具栏
            loadedTools: false,
            // 地图及列表
            mapChartSize: `${window.innerWidth * 0.8}px`,
            mapChartData: {
                columns: ['city', 'confirm'],
                rows: []
            },
            nameMap: {},
            currentCity: {},
            // 趋势图
            width: `${window.innerWidth * 0.82}px`,
            height: `${window.innerWidth * 0.54}px`,
            easyData: [],
            easyDataModify: [],
            // 动态播报
            tongbaoList: [],
            loadAll: false,
            offset: 0,
            limit: 6,
            tongbaoContent: {},
            totalTongbaoCnt: 1
        }
    },
    computed: {
        ...mapState({
            banners: (state) => state.haiwaiBanner
        }),
        filterdBanner () {
            let result = this.banners.filter((r) => {
                if (!~Object.keys(r).indexOf('toolType')) {
                    return true
                }
                if (
                    ~this.pageConfig['moreToolsFilter']
                        .map((s) => {
                            return parseInt(s)
                        })
                        .indexOf(r.toolType)
                ) {
                    return true
                }
                return false
            })
            return result
        },
        maskBannerConfig () {
            return this.globalConfig?.feature?.bannerEntry || {}
        }
    },
    created () {
        this.startTime = new Date().getTime()
    },
    async mounted () {
        this.country = this.$route.query.country
        document.title = `${this.$i18n.t('details.COVID_19_Live_Updates')}-${this.country}`

        await this.pageConfig._remote
        if (this.pageConfig.moreToolsFilter.length) {
            this.loadedTools = true
        }

        this.getForeignDetailData()
        // this.getForeignBanner()
        this.getTongbaoList(true)
        window.addEventListener('scroll', this.onPageScroll)
    },
    destroyed () {
        window.removeEventListener('scroll', this.onPageScroll)
    },
    methods: {
        async getForeignDetailData () {
            const data = await httpUtils('getForeignCountry', { country: this.country }, 'THPneumoniaOuterDataService')
            if (data.code === 0) {
                this.isFocus = data.isFocus // 后台维护是否为重点国家
                this.newDay = data.newDay
                this.recentTime = data.recentTime
                this.countryInfo = data.countryInfo
                this.countryHistory = data.countryHistory
                this.city = data.city

                if (this.$i18n.locale === 'zh') {
                    this.mapChartData = {
                        columns: ['city', 'confirm'],
                        rows: this.city
                    }
                    let nameMap = {}
                    this.city.forEach((item, index) => {
                        if (item.cityEn) nameMap[item.cityEn] = item.city
                    })
                    this.nameMap = nameMap
                } else {
                    this.mapChartData = {
                        columns: ['cityEn', 'confirm'],
                        rows: this.city
                    }
                    this.nameMap = {}
                }

                this.easyData = [
                    [this.countryHistory, 'confirm', 'total-confirm', 'day'],
                    [this.countryHistory, 'heal', 'total-heal', 'day'],
                    [this.countryHistory, 'dead', 'total-dead', 'day']
                ]
                this.easyDataModify = [[this.countryHistory, 'modifyConfirm', 'modify-confirm', 'day']]
            }
        },
        ...mapMutations(['setHaiwaiBanner']),
        async getForeignBanner () {
            if (this.banners.length > 0) return // 已从store获取
            try {
                const { code, data } = await httpUtils('haiwaiBanner', { cityCode: '440100' }, 'FeverBannerH5')
                if (data.length && code === 0) {
                    this.setHaiwaiBanner(data)
                } else {
                    // 和省份详情共用兜底banner
                    this.setHaiwaiBanner([])
                }
            } catch (err) {
                // 和省份详情共用兜底banner
                this.setHaiwaiBanner([])
            }
        },
        onPageScroll () {
            this.handleTableHeaderFixed('foreign')
        },
        handleTableHeaderFixed (module) {
            const moduleHeader = document.querySelector(`.header-${module}`)
            if (!moduleHeader) return
            const rectModuleHeader = moduleHeader.getBoundingClientRect()
            const topModuleHeader = rectModuleHeader && rectModuleHeader.top
            const moduleFooter = document.querySelector('.foreign-datalist-detail')
            const rectModuleFooter = moduleFooter.getBoundingClientRect()
            const contentModuleHeight = rectModuleFooter && rectModuleFooter.height
            const moduleFixedKey = `${module}HeaderFixed`
            if (topModuleHeader < 0 && topModuleHeader > -contentModuleHeight + 54) {
                if (!this[moduleFixedKey]) {
                    this[moduleFixedKey] = true
                }
            } else {
                if (this[moduleFixedKey]) {
                    this[moduleFixedKey] = false
                }
            }
        },
        /**
         * @params item.linkObj.type
         * @type 1-URL跳转
         * @type 2-路由跳转
         * @type 3-小程序跳转
         * @type 4-外链，但是只提供相对路径
         */
        toEntryPath (item) {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'ForeignDetail.tool.click',
                extra: { name: item.bannerName }
            })
            switch (item.linkObj.type) {
            case 1:
                item.linkObj.url = appendQuery(item.linkObj.url, this.$route.query)
                location.href = item.linkObj.url
                break
            case 2:
                this.$router.push({ path: item.linkObj.url, query: this.$route.query })
                break
            case 4:
                let url = location.origin + item.linkObj.url
                url = appendQuery(url, this.$route.query)
                location.href = url
                break
            default:
                console.log('目标参数异常，跳转失败')
                break
            }
        },
        async getTongbaoList (isInit) {
            // 预估4行溢出字数为65，超过65个字符则显示『...更多』，不超过则不显示
            const OVERFLOW_TEXT_LENGTH = 65
            const context =
                this.$route.query && this.$route.query.channel
                    ? {
                        channel: this.$route.query.channel
                    }
                    : {}

            const args = {
                reqType: 2,
                areaName: this.country,
                offset: this.offset,
                limit: this.limit
            }
            this.tongbaoContent = await httpUtils('getAreaContents', args, 'THPneumoniaService', context).catch(
                (err) => {
                    if (isInit) {
                        // 保底配置
                        // 加上『更多』按钮的标志位
                        homeConfig.contents.shishitongbao.forEach((content) => {
                            let more = content.desc.length > OVERFLOW_TEXT_LENGTH
                            content.more = more
                        })
                        this.listData1 = homeConfig.contents.shishitongbao
                    }
                    console.log('getContents err = ', err)
                }
            )

            if (this.tongbaoContent && this.tongbaoContent.contents) {
                // 加上『更多』按钮的标志位
                this.tongbaoContent.contents.forEach((content) => {
                    let more = content.desc.length > OVERFLOW_TEXT_LENGTH
                    this.$set(content, 'more', more)
                })
                this.totalTongbaoCnt = this.tongbaoContent.totalCnt
                if (this.tongbaoContent.totalCnt < 7) {
                    this.loadAll = true
                }
                // 每次拉6条
                this.offset += 6
                if (this.tongbaoContent.contents.length > 0) {
                    this.tongbaoList = this.tongbaoList.concat(this.tongbaoContent.contents)
                } else {
                    this.loadAll = true
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~Styles/views/disease/city-detail';
@import '~Styles/views/disease/city-detail-en';

.container {
    padding-bottom: 76px;
}

.prevent-click {
    z-index: 1;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}
.set-foreign-bar-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    z-index: 10;
    padding: 5px 17px 0;
    display: flex;
}
</style>
