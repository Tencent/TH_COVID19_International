<template>
    <div class="container page-citydetail page-h5" :class="{ 'page-citydetail-en': locale === 'en' }">
        <div class="content-wrapper epanel epanel--tools" id="ve-lines">
            <div class="title-bar">
                <p class="title" v-if="province">{{ $t('details.COVID_19_Live_Updates') }} - {{ province }}</p>
                <p class="sub-title" v-if="recentTime">Updated {{ recentTime }}</p>
            </div>
            <div class="panel-toolbox">
                <!-- 头部数据 -->
                <div class="panel-dashboard panel-dashboard--simple">
                    <div class="panel-dashboard-grid">
                        <div class="panel-dashboard-item item--new">
                            <div class="panel-dashboard-val">
                                <span class="val-text">
                                    <modify-number :number="areaInfo.modifyConfirmDesc" />
                                </span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text"
                                    >{{ $t('legend.modify-confirm') }}
                                    <span
                                        v-if="pageConfig.wording.common.dialog.addConfirmDesc.show && area === '湖北'"
                                        @click="popWin('addConfirmDesc')"
                                        class="panel-dashboard-icon"
                                    >
                                        <svg
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 22 22"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                        >
                                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <g
                                                    transform="translate(-35.000000, -304.000000)"
                                                    fill="#ccc"
                                                    fill-rule="nonzero"
                                                >
                                                    <g transform="translate(35.000000, 301.000000)">
                                                        <path
                                                            d="M11.1382112,9.00466166 C10.2928327,8.95794371 9.46594627,9.26399172 8.85464663,9.84985679 C8.27104159,10.4532457 7.96299119,11.2711912 8.00355433,12.1097047 L9.40006493,12.1097047 C9.36814645,11.6298671 9.49218835,11.1525667 9.7536878,10.7490005 C10.0684165,10.357161 10.5604152,10.151762 11.0602943,10.20352 C11.4683901,10.1785771 11.8689542,10.3214973 12.1691117,10.5991432 C12.4324942,10.895175 12.5701013,11.2822392 12.5527026,11.6781157 C12.5459923,12.02848 12.4214138,12.3663585 12.1990798,12.6372024 L11.9773163,12.8889626 C11.3945551,13.3536799 10.8871016,13.9056744 10.4729207,14.5254043 C10.2931374,14.9178759 10.2069625,15.3467475 10.2211892,15.7782112 L10.2211892,16 L11.599719,16 L11.599719,15.7782112 C11.5933227,15.4714011 11.665539,15.1680581 11.8094952,14.8970503 C11.9452248,14.6411544 12.1282703,14.4133385 12.3489199,14.2256897 C12.7526038,13.9072691 13.136881,13.5649832 13.4996926,13.2006658 C13.8417485,12.7319617 14.0168957,12.1621407 13.9971621,11.5822071 C14.0319065,10.8681052 13.746205,10.1757494 13.2179931,9.69400521 C12.6365834,9.20991816 11.8936207,8.96366323 11.1382112,9.00466166 Z M10.9998056,17.007477 C10.7381768,16.994838 10.4837146,17.0967576 10.3004843,17.2875759 C10.0998131,17.4666842 9.98959579,17.7288805 10.0007752,18.0005551 C10.0174612,18.5527396 10.4579799,18.9934407 10.9998056,19 C11.2618875,19.0003602 11.5150534,18.9030028 11.7116148,18.7262659 C11.9013742,18.5350648 12.0052997,18.2724803 11.998836,18.0005551 C12.0123802,17.7292272 11.9071792,17.4657516 11.7116148,17.2812101 C11.5162199,17.08943 11.2519998,16.9881246 10.9810738,17.0011111 L10.9998056,17.007477 Z M11,4 C16.5228475,4 21,8.4771525 21,14 C21,19.5228475 16.5228475,24 11,24 C5.4771525,24 1,19.5228475 1,14 C1,8.4771525 5.4771525,4 11,4 M11,3 C4.92486775,3 0,7.92486775 0,14 C0,20.0751322 4.92486775,25 11,25 C17.0751322,25 22,20.0751322 22,14 C22,11.0826186 20.8410748,8.28472557 18.7781746,6.22182541 C16.7152744,4.15892524 13.9173814,3 11,3 Z"
                                                        ></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="panel-dashboard-item item--error">
                            <div class="panel-dashboard-val">
                                <span class="val-text">{{ areaInfo.confirm }}</span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text">{{ $t('legend.total-confirm') }}</span>
                            </div>
                        </div>
                        <div class="panel-dashboard-item item--success">
                            <div class="panel-dashboard-val">
                                <span class="val-text">{{ areaInfo.heal }}</span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text">{{ $t('legend.total-heal') }}</span>
                            </div>
                        </div>
                        <div class="panel-dashboard-item item--default">
                            <div class="panel-dashboard-val">
                                <span class="val-text">{{ areaInfo.dead }}</span>
                            </div>
                            <div class="panel-dashboard-tit">
                                <span class="panel-dashboard-text">{{ $t('legend.total-dead') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 抗议工具 PENDING -->
                <!-- <div class="panel-toolbutton" v-if="filterdBanner.length && loadedTools">
          <div class="panel-toolbox-tit">抗疫工具</div>
          <div class="panel-toolbutton-scrollbar">
            <div class="disease-entrance-list">
              <a class="disease-entrance-button" v-for="(item, index) in allBanner" :key="index" @click="toEntryPath(item)">
                <span class="disease-entrance-icon icon--yqzs">
                  <img :src="item.imageUrl" alt="">
                </span>
                <span class="disease-entrance-txt">{{item.bannerName}}</span>
              </a>
            </div>
          </div>
        </div>
        <div v-else style="height:30px;"></div> -->
                <!-- 该元素单纯用于更多工具完全不展示时提供高度以免元素塌陷 -->
                <div style="height: 30px;"></div>
            </div>
        </div>
        <div class="content-wrapper epanel epanel--map">
            <div class="title-bar">
                <p class="title" v-if="province">{{ $t('details.COVID_19_Map') }}</p>
            </div>
            <div class="img-box">
                <map-highlight
                    :areaData="currentCity"
                    nameKey="city"
                    :showArrow="currentCity.keyCity === 1"
                    @handleClick="handleMapHightlightClick"
                    style="top: 10px;"
                />
                <lung-map
                    :data="mapChartData"
                    :area="area"
                    :width="mapChartSize"
                    :height="mapChartSize"
                    :events="mapChartEvents"
                />
                <MapDetailLine ref="MapDetailLine" />
                <MapDetailHubei ref="MapDetailHubei" v-if="province === '湖北' || province === 'Hubei'" />
            </div>
            <div class="subpanel subpanel--data">
                <div class="sub-title-bar">
                    <p class="sub-title">
                        {{ $t('details.Regional_Updates') }}
                        <span
                            v-if="pageConfig.wording.common.dialog.areaDetailDesc.show && area === '湖北'"
                            @click="popWin('areaDetailDesc')"
                            class="tt-svg-ico"
                            style="
                                width: 12px;
                                height: 12px;
                                display: inline-block;
                                vertical-align: middle;
                                font-size: 0;
                            "
                        >
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 22 22"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                            >
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g transform="translate(-35.000000, -304.000000)" fill="#ccc" fill-rule="nonzero">
                                        <g transform="translate(35.000000, 301.000000)">
                                            <path
                                                d="M11.1382112,9.00466166 C10.2928327,8.95794371 9.46594627,9.26399172 8.85464663,9.84985679 C8.27104159,10.4532457 7.96299119,11.2711912 8.00355433,12.1097047 L9.40006493,12.1097047 C9.36814645,11.6298671 9.49218835,11.1525667 9.7536878,10.7490005 C10.0684165,10.357161 10.5604152,10.151762 11.0602943,10.20352 C11.4683901,10.1785771 11.8689542,10.3214973 12.1691117,10.5991432 C12.4324942,10.895175 12.5701013,11.2822392 12.5527026,11.6781157 C12.5459923,12.02848 12.4214138,12.3663585 12.1990798,12.6372024 L11.9773163,12.8889626 C11.3945551,13.3536799 10.8871016,13.9056744 10.4729207,14.5254043 C10.2931374,14.9178759 10.2069625,15.3467475 10.2211892,15.7782112 L10.2211892,16 L11.599719,16 L11.599719,15.7782112 C11.5933227,15.4714011 11.665539,15.1680581 11.8094952,14.8970503 C11.9452248,14.6411544 12.1282703,14.4133385 12.3489199,14.2256897 C12.7526038,13.9072691 13.136881,13.5649832 13.4996926,13.2006658 C13.8417485,12.7319617 14.0168957,12.1621407 13.9971621,11.5822071 C14.0319065,10.8681052 13.746205,10.1757494 13.2179931,9.69400521 C12.6365834,9.20991816 11.8936207,8.96366323 11.1382112,9.00466166 Z M10.9998056,17.007477 C10.7381768,16.994838 10.4837146,17.0967576 10.3004843,17.2875759 C10.0998131,17.4666842 9.98959579,17.7288805 10.0007752,18.0005551 C10.0174612,18.5527396 10.4579799,18.9934407 10.9998056,19 C11.2618875,19.0003602 11.5150534,18.9030028 11.7116148,18.7262659 C11.9013742,18.5350648 12.0052997,18.2724803 11.998836,18.0005551 C12.0123802,17.7292272 11.9071792,17.4657516 11.7116148,17.2812101 C11.5162199,17.08943 11.2519998,16.9881246 10.9810738,17.0011111 L10.9998056,17.007477 Z M11,4 C16.5228475,4 21,8.4771525 21,14 C21,19.5228475 16.5228475,24 11,24 C5.4771525,24 1,19.5228475 1,14 C1,8.4771525 5.4771525,4 11,4 M11,3 C4.92486775,3 0,7.92486775 0,14 C0,20.0751322 4.92486775,25 11,25 C17.0751322,25 22,20.0751322 22,14 C22,11.0826186 20.8410748,8.28472557 18.7781746,6.22182541 C16.7152744,4.15892524 13.9173814,3 11,3 Z"
                                            ></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </p>
                </div>
                <table
                    class="datalist datalist-detail"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    v-if="mapChartData.rows.length"
                >
                    <thead>
                        <th>{{ $t('common.Region') }}</th>
                        <th class="txt-info">{{ $t('legend.modify-confirm') }}</th>
                        <th class="txt-warning">{{ $t('legend.total-confirm') }}</th>
                        <th class="txt-success">{{ $t('legend.total-heal') }}</th>
                        <th>{{ $t('legend.total-dead') }}</th>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in mapChartData.rows" :key="index" @click="toCityHomeFromList(item)">
                            <td>
                                <div class="cell">
                                    <p>
                                        {{ item.city }}
                                        <span class="ico-arrow-r" v-if="item.keyCity === 1"></span>
                                    </p>
                                </div>
                            </td>
                            <td>
                                <div class="cell">
                                    <p class="txt-info">
                                        <modify-number :number="item.modifyConfirmDesc" />
                                    </p>
                                </div>
                            </td>
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
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="content-wrapper epanel epanel--timelist" v-if="tongbaoList.length > 0">
            <div class="epanel-title-bar">
                <p class="epanel-title">{{ $t('home.Live_Updates') }} - {{ province }}</p>
            </div>
            <div class="timeline-list">
                <div class="timeline-item" v-for="(item, index) in tongbaoList" :key="index">
                    <div class="time-detail" v-if="item.publicTime">
                        <p class="date">{{ item.publicTime.substr(5, 6).replace('-', '.') }}</p>
                        <p class="time">{{ item.publicTime.substr(item.publicTime.length - 5) }}</p>
                        <p class="new" v-if="index == 0">{{ $t('common.New') }}</p>
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
                    {{ $t('common.More') }}
                    <i class="icon-arrow-down"></i>
                </p>
            </div>
        </div>
        <PopWin />
    </div>
</template>
<script>
import { appendQuery } from '@/utils'
import httpUtils from '@/api'
import homeConfig from '@/config/home-default'
import LungMap from '@/components/charts/lungMap'
import MapHighlight from '@/components/MapHighlight'
import ModifyNumber from '@/components/ModifyNumber'
import MapDetailLine from '@/components/mapDetail/MapDetailLine'
import MapDetailHubei from '@/components/mapDetail/MapDetailHubei'

import { EventBus } from '@/utils/event-bus'
import PopWin from '@/components/PopWin'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
    name: 'MapDetail',
    components: {
        LungMap,
        MapHighlight,
        ModifyNumber,
        MapDetailLine,
        MapDetailHubei,
        PopWin
    },
    data () {
        this.mapChartEvents = {
            click: (e) => {
                const { mapChartData } = this
                const { dataIndex, name } = e
                this.dataIndex = dataIndex
                let currentCity = mapChartData.rows[dataIndex]
                if (!currentCity) {
                    currentCity = { name }
                }
                // 在 handleMapClick 前触发
                this.currentCity = currentCity
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'province.map.mapArea.click',
                    extra: { city: e.name }
                })
            }
        }
        return {
            locale: this.$i18n.locale,
            startTime: new Date().getTime(),
            src: '',
            mapChartSize: '320px',
            area: '',
            province: '',
            position: '',
            recentTime: '',
            areaInfo: {},
            cityInfo: {},
            currentCity: {},
            mapChartData: {
                columns: ['city', 'confirm'],
                rows: []
            },

            areaHistory: 0,

            cityCode: '',
            totalTongbaoCnt: 1,
            tongbaoContent: {},
            tongbaoList: [],
            offset: 0,
            limit: 6,
            loadAll: false,
            loadedTools: false,
            extraTools: []
        }
    },
    computed: {
        ...mapState({
            banners: (state) => state.feverBanner
        }),
        maskBannerConfig () {
            return this.globalConfig?.feature?.bannerEntry || {}
        },
        showMoreTongbaoBtn () {
            return this.tongbaoList.length < this.totalTongbaoCnt
        },
        allBanner () {
            return [...this.extraTools, ...this.filterdBanner]
        },
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
        }
    },
    created () {
        this.startTime = new Date().getTime()
    },
    async mounted () {
        let prov = this.$route.query.province // 例：湖北
        this.province = prov
        this.area = prov
        document.title = `${this.$i18n.t('details.COVID_19_Live_Updates')}-${prov}`

        await this.pageConfig._remote
        if (this.pageConfig.moreToolsFilter.length) {
            this.loadedTools = true
        }
        this.mapChartSize = `${window.innerWidth * 0.8}px`

        // 获取工具
        this.cityCode = this.$route.query.cityCode
        // let cityCode = this.$route.query.cityCode || '420100'
        // this.fetchBanner(cityCode)

        const batchReq = {
            getKeyCity: JSON.stringify({ area: this.$route.query.province }),
            getCityInfo: JSON.stringify({ area: this.$route.query.province })
        }
        if (this.province === '湖北') {
            batchReq.getHubeiInfo = JSON.stringify({ none: 'none' })
        }

        const result = await this.getInitMapDetailData(batchReq)
        this.$refs.MapDetailLine.initData(result.getKeyCity)
        if (this.province === '湖北') {
            this.$refs.MapDetailHubei.initData(result.getHubeiInfo)
        }

        let { city, areaInfo, areaHistory } = await this.fetchProvinceData(prov, result.getCityInfo)
        if (city && city.length) {
            this.mapChartData = {
                columns: ['mapCity', 'confirm'],
                rows: city
            }
            this.areaInfo = areaInfo
            this.areaHistory = areaHistory
        }

        this.getTongbaoList(true)
    },

    methods: {
        ...mapMutations(['setFeverBanner']),
        ...mapActions(['getInitMapDetailData']),
        popWin (descKey) {
            EventBus.$emit('showPopWin', descKey)
        },
        handleMapHightlightClick (cityInfo) {
            this.toCityHomeFromMap(cityInfo)
        },
        toCityHomeFromMap (cityInfo) {
            if (cityInfo.keyCity === 1) {
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'mapDetail.toCityHomeFromMap.click'
                })
                const { channel } = this.$route.query
                this.$router.push({
                    path: '/city-detail',
                    query: {
                        channel,
                        province: this.province,
                        cityCode: cityInfo.cityCode,
                        cityName: cityInfo.city
                    }
                })
            }
        },
        toCityHomeFromList (cityInfo) {
            if (cityInfo.keyCity === 1) {
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'mapDetail.toCityHomeFromList.click'
                })
                const { channel } = this.$route.query
                this.$router.push({
                    path: '/city-detail',
                    query: {
                        channel,
                        province: this.province,
                        cityCode: cityInfo.cityCode,
                        cityName: cityInfo.city
                    }
                })
            }
        },
        async fetchProvinceData (province, getCityInfo) {
            const { code, city, recentTime, areaInfo, areaHistory } = getCityInfo
            if (code === 0) {
                this.recentTime = recentTime
                return { city, areaInfo, areaHistory }
            }
        },
        async fetchBanner (cityCode) {
            if (this.banners.length > 0) {
                return
            }
            try {
                const { code, data } = await httpUtils('feverBanner', { cityCode }, 'FeverBannerH5')
                if (data.length && code === 0) {
                    this.setFeverBanner(data)
                } else {
                    this.setFeverBanner([])
                }
            } catch (err) {
                console.error(err)
                this.setFeverBanner([])
            }
        },
        async fetchLocalDetail (cityCode) {
            try {
                const data = await httpUtils('getCityInfoByCode', { cityCode }, 'THPneumoniaOuterDataService')
                if (data.code === 0) {
                    let { cityInfo } = data
                    this.cityInfo = cityInfo
                } else {
                    let toastErr = this.$loadingToast({ message: '位置获取失败' })
                    setTimeout(() => {
                        toastErr.close()
                    }, 2000)
                }
            } catch (e) {
                let toastErr = this.$loadingToast({ message: '位置获取失败' })
                setTimeout(() => {
                    toastErr.close()
                }, 2000)
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
                actionName: 'mapDetail.tool.click',
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
            // this.isLoading = true
            const context = this.$route.query && this.$route.query.channel ? { channel: this.$route.query.channel } : {}

            const args = {
                reqType: 2,
                areaName: this.province,
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

            // const localStorageKey = this.province + '-tongbaoContent'
            // window.localStorage[localStorageKey] = JSON.stringify(this.tongbaoContent)

            if (this.tongbaoContent && this.tongbaoContent.contents) {
                // // 加上『更多』按钮的标志位
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
.province-map-container {
    background: #fff;
}
.more-list-btn {
    margin: 15px 0;
    background: #f5f5f5;
    border-radius: 6px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 14px;
    color: #888;
    position: relative;
    &::before {
        content: '';
        position: absolute;
        top: 43%;
        right: 50%;
        width: 6px;
        height: 6px;
        margin-right: -55px;
        border-bottom: 1px solid #888;
        border-right: 1px solid #888;
        transform: translateY(-50%) rotate(45deg);
    }
}
</style>
