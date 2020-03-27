<template>
    <div class="container page-index page-h5" :class="locale === 'en' ? ' page-english' : ''">
        <HomeHeader
            :tab="tab"
            :chinaSummary="chinaSummary"
            :foreignSummary="foreignSummary"
            :clickedTab.sync="clickedTab"
            :fullNews="infoScrollNews"
            @curOverviewDataChange="curHeaderTabChange"
            @update:clickedTab="gotoDongtaobobao()"
            @scrollNewChange="setCurrentScrollNew"
        ></HomeHeader>
        <Tabs
            @update:clickedTab="onItemTab"
            :isTabFixed.sync="isTabFixed"
            :clickedTab.sync="clickedTab"
            :tab.sync="tab"
        />
        <VueScrollSwitch
            ref="scroll"
            :currentViewMinTop="60"
            :enableScrollSwitch="isTabFixed"
            :defaultShowIndex="defaultIndex"
            @current-index-change="onCurrentIndexChange"
        >
            <!-- TAB1 疫情地图 -->
            <MapContainer v-if="pageConfig['isShowTab1']" />
            <!-- TAB2-1 国内动态 -->
            <Domestic
                v-if="pageConfig['isShowTab2']"
                :chinaFullNews="chinaFullNews"
                :totalChinaTongbaoCnt="totalChinaTongbaoCnt"
                @getContentInfo="getChinaContentInfo"
            />
            <!-- TAB2-2 海外动态 -->
            <Abroad
                v-if="pageConfig['isShowTab2']"
                :fullNews="fullNews"
                :totalTongbaoCnt="totalTongbaoCnt"
                @getContentInfo="getContentInfo"
            />
            <!-- TAB3 抗疫专区 PENDING -->
            <!-- <HomeExpert
        v-if="pageConfig['isShowTab3']"
        :expertData="expertData"
        :hospitalData="hospitalData"
        :activeData="activeData"
        :expertListPageData="expertListPageData"
        :expertlistData="expertlistData"
        :expertlistDataLimit="expertlistDataLimit"
        :expertlistDataCurrent="expertlistDataCurrent"
        @showMoreDataList="showMoreDataList"
      ></HomeExpert> -->
        </VueScrollSwitch>
        <PopWin />
    </div>
</template>
<script>
import Vue from 'vue'
import httpUtils from '@/api'
import homeConfig from '@/config/home-default'
import { mapActions, mapState } from 'vuex'

import HomeHeader from '@/components/home/HomeHeader'
import Tabs from '@/components/home/Tabs'

import VueScrollSwitch from '@/components/home/VueScrollSwitch'
import MapContainer from '@/components/home/MapContainer'
import Domestic from '@/components/home/Domestic'
import Abroad from '@/components/home/Abroad'
// PENDING
// import HomeExpert from '@/components/home/HomeExpert'
import PopWin from '@/components/PopWin'

const LAST_SEL_TAB = 'last_sel_tab'
const tabs = ['shishitongbao', 'chengshiyiqing', 'haiwaiyiqing', 'zhuanjiajiedu']

export default {
    components: {
        // PENDING
        // HomeExpert,
        MapContainer,
        Domestic,
        Abroad,
        Tabs,
        HomeHeader,
        VueScrollSwitch,
        PopWin
    },
    watch: {
        '$route.query': {
            deep: true,
            handler (newVal, oldVal) {
                const newTab = newVal.tab
                const oldTab = oldVal.tab
                if (newTab !== oldTab) {
                    const index = Math.max(tabs.indexOf(newTab), 0)
                    this.$refs.scroll.setCurrentIndex(index)
                }
            }
        },
        initData (initData) {
            this.beginInitData(initData)
        }
    },
    computed: {
        ...mapState({
            initData: (state) => state.initData
        })
    },
    data () {
        let currentTab = sessionStorage.getItem(LAST_SEL_TAB) || this.$route.query.tab
        ~tabs.indexOf(currentTab) || (currentTab = 'shishitongbao')
        return {
            currentHeaderTab: 'global',
            isFirstIn: false,
            totalTongbaoCnt: 1,
            defaultIndex: Math.max(tabs.indexOf(currentTab), 0),
            src: '',
            baikeJson: {},
            swiperOption: {
                direction: 'horizontal',
                speed: 500,
                loop: false,
                autoplay: false,
                pagination: {
                    el: '.swiper-pagination'
                },
                // autoHeight: true，
                on: {
                    init: this.swiperInit,
                    // slideChange: this.slideChangeCallback,
                    // slidePrevTransitionStart: this.slideChangeBeforeCallback,
                    slideChangeTransitionEnd: this.slideChangeCallback,
                    click: () => {}
                }
            },
            chinaSummary: {
                chinaTotal: {},
                chinaDayModify: {},
                virusInfo: [],
                dataFrom: ''
            },
            foreignSummary: {
                foreignDayModify: {},
                foreignTotal: {}
            },
            residue: false,
            showMask: false,
            cover: false,
            tab: currentTab,
            // tab: sessionStorage.getItem(LAST_SEL_TAB) || (this.$route.query.tab || 'shishitongbao'),
            contentData: {}, // 要展示的内容数据
            contentReadIds: [], // 已读的ID
            chinaContentData: {}, // 国内动态播报要展示的内容
            chinaContentReadIds: [], // 国内动态播报已读ID
            totalChinaTongbaoCnt: 0,
            chinaFullNews: [],
            fullNews: [],
            infoScrollNews: [],
            isLoading: false, // 是否正在加载中
            diseaseMapInfo: {
                subtitle: '已更新全国1368家门诊信息',
                title: '全国发热门诊地图',
                histories: [
                    {
                        date: '2020-01-24',
                        content: '新增大同123家门诊信息'
                    },
                    {
                        date: '2020-01-24',
                        content: '新增太原456家门诊信息'
                    },
                    {
                        date: '2020-01-24',
                        content: '新增徐州789家门诊信息'
                    }
                ]
            }, // 全国发热门诊地图数据
            loadFull: {
                chengshiyiqing: false,
                haiwaiyiqing: false,
                ruheyufang: false,
                jiuzhengzhiyin: false,
                shishitongbao: false
            }, // 是否加载完所有列表
            listData2: [
                {
                    text: '武汉肺炎疫情拉响警报！国家卫健委主任挂帅，像全国人民',
                    source: '腾讯医典微信公众号',
                    img:
                        'https://pics6.baidu.com/feed/8694a4c27d1ed21bf3b15d9ed79bcbc250da3f48.jpeg?token=8b7879d3d3f734d65084e29410ae8095&s=B922479054407EE41207F4C70300C0AB'
                }
            ],
            // 如何预防
            expertlistData: [],
            // 如何预防分页数据
            expertListPageData: [],
            // 如何预防每页条数
            expertlistDataLimit: 10,
            // 如何预防当前页码
            expertlistDataCurrent: 1,
            clickedTab: currentTab,
            // 专家咨询
            expertData: [],
            hospitalData: [],
            piyaoList: [],
            piyaoVideoList: [],
            activeData: [
                {
                    duration: 0,
                    h5url:
                        '/mobile/tag_article.html?name=%E4%B8%93%E9%A2%98&tagId=94561&src=cancer_straight&tag=%E8%B0%A3%E8%A8%80%E5%88%AB%E4%BF%A1&tmenu=logo&adtag=wxjk.op.topic.yybx',
                    image:
                        'https://baike-med-1256891581.file.myqcloud.com/2020012/05206140-3e2d-11ea-99eb-ef7915f20177_0.png',
                    result: [],
                    result2: [],
                    text: '新冠肺炎每日辟谣',
                    text2: '',
                    wxaurl: '',
                    ydwxaurl: ''
                },
                {
                    duration: 0,
                    h5url:
                        '/mobile/tag_article.html?name=%E4%B8%93%E9%A2%98&tagId=94562&src=cancer_straight&adtag=wxjk.op.topic.cjyf&tmenu=logo&tag=%E6%98%A5%E8%8A%82%E9%A2%84%E9%98%B2',
                    image:
                        'https://baike-med-1256891581.file.myqcloud.com/2020012/ef700300-3e2c-11ea-8b9c-5ff7509acaa0_0.png',
                    result: [],
                    result2: [],
                    text: '春节春运预防要点',
                    text2: '',
                    wxaurl: '',
                    ydwxaurl: ''
                }
            ],
            banner: {
                h5url:
                    'https://h5.baike.qq.com/mobile/active_operate.html?title=第六十期&m=35b419f72fc4d567fdfe45561344046d&webview=wxjk',
                image:
                    'https://baike-med-1256891581.file.myqcloud.com/2020014/48d28a50-3df9-11ea-a282-e32d557443e5_0.png',
                text: '',
                text2: '',
                duration: 0,
                wxaurl:
                    'https://baike-med-1256891581.file.myqcloud.com/2020017/8f7b88a0-3d2a-11ea-b6f0-e90d1699cad2_0.png',
                ydwxaurl: '',
                result: [],
                result2: []
            },
            locale: this.$i18n.locale,
            isTabFixed: false // 是否固定tab
        }
    },
    beforeRouteEnter (to, from, next) {
        let tab = to.query.tab
        ~tabs.indexOf(tab) || (tab = 'shishitongbao')
        if (tab) {
            next((vm) => {
                vm.isFirstIn = from.name === null
                vm.tabs(tab)
                if (vm.isTabFixed) {
                    vm.scrollToTabList()
                }
            })
        } else {
            next((vm) => {
                vm.isFirstIn = from.name === null
            })
        }
    },
    beforeRouteUpdate (to, from, next) {
        let tab = to.query.tab
        ~tabs.indexOf(tab) || (tab = 'shishitongbao')
        if (tab) {
            this.tabs(tab)
            if (this.isTabFixed) {
                this.scrollToTabList()
            }
        }
        next()
    },
    async mounted () {},
    async created () {
        document.title = 'COVID-19 Live Updates'
        try {
            // if (window.localStorage.baikeJson) {
            //   this.baikeJson = JSON.parse(window.localStorage.baikeJson)
            //   this.transformActiveData(this.baikeJson)
            // }
            if (window.localStorage.chinaSummary) {
                this.chinaSummary = JSON.parse(window.localStorage.chinaSummary)
            }
            if (window.localStorage.contentData) {
                this.contentData = JSON.parse(window.localStorage.contentData)
            }
        } catch (err) {
            console.error(err)
        }
        if (Object.keys(this.initData).length > 0) {
            this.beginInitData(this.initData)
        }
        const toast = this.$loadingToast({
            message: window.localStorage.chinaSummary ? '更新中' : '加载中'
        })
        try {
            const context =
                this.$route.query && this.$route.query.channel
                    ? {
                        channel: this.$route.query.channel
                    }
                    : {}
            this.getInfoSrollFullNews()
            this.getChinaContentInfo(true)
            this.getContentInfo(true)
            await this.getInitHomeData({
                context
            })
            // PENDING TOOLS
            // await this.getInitBannerConfig({
            //   cityCode: this.$route.query.cityCode || '440100'
            // })
            this.scrollToViewWhenMounted()
        } catch (err) {
            toast.close()
        }
        toast.close()
    },
    methods: {
        ...mapActions(['getInitHomeData']),
        beginInitData (initData) {
            if (initData.getChinaTotal && initData.getChinaTotal.code === 0) {
                this.chinaSummary = initData.getChinaTotal.data
                window.localStorage.chinaSummary = JSON.stringify(this.chinaSummary)
            }
            if (initData.getForeignTotal && initData.getForeignTotal.code === 0) {
                this.foreignSummary = initData.getForeignTotal.data
                window.localStorage.foreignSummary = JSON.stringify(this.foreignSummary)
            }
            // if (initData.getBaike && initData.getBaike.code === 0) {
            //   this.baikeJson = initData.getBaike
            //   window.localStorage.baikeJson = JSON.stringify(this.baikeJson)
            //   this.transformActiveData(this.baikeJson)
            // } else {
            //   // 异常时读取配置
            //   this.expertlistData = homeConfig.contents.ruheyufang
            //   this.expertListPageData = this.expertlistData.slice(0, this.expertlistDataLimit) // 初始化第一页
            // }
        },
        scrollToViewWhenMounted () {
            const { tab, module } = this.$route.query || {}
            if (tab === 'zhuanjiajiedu' && module === 'yidian') {
                this.$nextTick(() => {
                    this.scrollToTabList()
                })
            }
        },
        curHeaderTabChange (e) {
            this.currentHeaderTab = e
        },
        gotoDongtaobobao () {
            let scrollNewsIndex = this.currentScrollNewIndex
            let isChinaNews = this.infoScrollNews[scrollNewsIndex] && this.infoScrollNews[scrollNewsIndex].garea
            if (isChinaNews !== '国外') {
                if (this.tab !== 'chengshiyiqing') {
                    this.$router.replace({ query: { ...this.$route.query, tab: 'chengshiyiqing' } })
                }
                this.$nextTick(() => {
                    const titleBar = document.querySelector('.__chengshiyiqing-news')
                    const posObj = titleBar.getBoundingClientRect()
                    window.scrollTo(0, posObj.top + window.scrollY - 60)
                })
            } else {
                if (this.tab !== 'haiwaiyiqing') {
                    this.$router.replace({ query: { ...this.$route.query, tab: 'haiwaiyiqing' } })
                }
                this.$nextTick(() => {
                    const titleBar = document.querySelector('.__chengshiyiqing-abroad-news')
                    const posObj = titleBar.getBoundingClientRect()
                    window.scrollTo(0, posObj.top + window.scrollY - 60)
                })
            }
        },
        gotoTabView (id) {
            if (id !== this.tab) {
                this.$router.replace({ query: { ...this.$route.query, tab: id } })
            }
            this.$nextTick(() => {
                this.scrollToTabList()
            })
        },
        onItemTab (id) {
            if (id === 'shishitongbao') {
                window.scrollTo(0, 0)
                // 将isTabFixed设为false, 否则不会回到初始状态
                if (this.isTabFixed) {
                    this.isTabFixed = false
                }
            } else if (this.isTabFixed) {
                this.scrollToTabList()
            }
            this.reportStatLog({
                actionType: 'event',
                actionName: 'tab.click',
                extra: {
                    tab: id
                }
            })
            // 特殊处理
            this.$router.replace({
                query: { ...this.$route.query, tab: id, randId: Math.random() }
            })
        },
        onCurrentIndexChange (val) {
            this.tab = tabs[val]
        },
        // 查看更多按钮点击
        showMoreDataList () {
            if (this.expertlistDataLimit * this.expertlistDataCurrent < this.expertlistData.length) {
                this.expertlistDataCurrent++
                this.expertListPageData = this.expertlistData.slice(
                    0,
                    this.expertlistDataLimit * this.expertlistDataCurrent
                )
            }
            this.reportStatLog({
                actionType: 'event',
                actionName: 'more.listdata',
                extra: { current: this.expertlistDataCurrent }
            })
        },
        setCurrentScrollNew (currentNewIndex) {
            this.currentScrollNewIndex = currentNewIndex
        },
        async getChinaContentInfo (isInit) {
            // 预估4行溢出字数为65，超过65个字符则显示『...更多』，不超过则不显示
            const OVERFLOW_TEXT_LENGTH = 65
            this.isLoading = true
            const context =
                this.$route.query && this.$route.query.channel
                    ? {
                        channel: this.$route.query.channel
                    }
                    : {}
            this.chinaContentData = await httpUtils(
                'getAreaContents',
                {
                    tab: 'shishitongbao',
                    readIds: this.chinaContentReadIds,
                    reqType: 2,
                    limit: isInit ? 2 : 4,
                    areaName: '国内'
                },
                'THPneumoniaService',
                context
            ).catch((err) => {
                if (isInit) {
                    // 保底配置
                    // 加上『更多』按钮的标志位
                    homeConfig.contents.shishitongbao.forEach((content) => {
                        let more = content.desc.length > OVERFLOW_TEXT_LENGTH
                        content.more = more
                    })
                    this.chinaFullNews = homeConfig.contents.shishitongbao
                }
                this.loadFull[this.tab] = true
                console.log('getChiniaContents err = ', err)
            })
            window.localStorage.chinaContentData = JSON.stringify(this.chinaContentData)
            if (this.chinaContentData && this.chinaContentData.contents) {
                // 加上『更多』按钮的标志位
                this.chinaContentData.contents.forEach((content) => {
                    let more = content.desc.length > OVERFLOW_TEXT_LENGTH
                    this.$set(content, 'more', more)
                })
                this.totalChinaTongbaoCnt = this.chinaContentData.totalCnt
                if (this.chinaContentData.contents.length > 0) {
                    this.chinaFullNews = this.chinaFullNews.concat(this.chinaContentData.contents)
                    this.chinaContentReadIds = this.chinaContentReadIds.concat(
                        this.chinaContentData.contents.map((item) => {
                            return item.id
                        })
                    )
                } else {
                    this.loadFull[this.tab] = true
                }
            }
            this.isLoading = false
        },
        async getContentInfo (isInit) {
            // 预估4行溢出字数为65，超过65个字符则显示『...更多』，不超过则不显示
            const OVERFLOW_TEXT_LENGTH = 65
            this.isLoading = true
            const context =
                this.$route.query && this.$route.query.channel
                    ? {
                        channel: this.$route.query.channel
                    }
                    : {}
            this.contentData = await httpUtils(
                'getAreaContents',
                {
                    tab: 'shishitongbao',
                    readIds: this.contentReadIds,
                    reqType: 2,
                    limit: isInit ? 5 : 4,
                    areaName: '国外'
                },
                'THPneumoniaService',
                context
            ).catch((err) => {
                if (isInit) {
                    // 保底配置
                    // 加上『更多』按钮的标志位
                    homeConfig.contents.shishitongbao.forEach((content) => {
                        let more = content.desc.length > OVERFLOW_TEXT_LENGTH
                        content.more = more
                    })
                    this.fullNews = homeConfig.contents.shishitongbao
                }
                this.loadFull[this.tab] = true
                console.log('getContents err = ', err)
            })
            window.localStorage.contentData = JSON.stringify(this.contentData)
            if (this.contentData && this.contentData.contents) {
                // // 加上『更多』按钮的标志位
                this.contentData.contents.forEach((content) => {
                    let more = content.desc.length > OVERFLOW_TEXT_LENGTH
                    this.$set(content, 'more', more)
                })
                this.totalTongbaoCnt = this.contentData.totalCnt
                if (this.contentData.contents.length > 0) {
                    this.fullNews = this.fullNews.concat(this.contentData.contents)
                    this.contentReadIds = this.contentReadIds.concat(
                        this.contentData.contents.map((item) => {
                            return item.id
                        })
                    )
                } else {
                    this.loadFull[this.tab] = true
                }
            }
            this.isLoading = false
        },
        async getInfoSrollFullNews () {
            const context =
                this.$route.query && this.$route.query.channel
                    ? {
                        channel: this.$route.query.channel
                    }
                    : {}
            const infoScrollNewsData = await httpUtils(
                'getContents',
                {
                    tab: 'shishitongbao',
                    readIds: [],
                    reqType: 2,
                    limit: 4
                },
                'THPneumoniaService',
                context
            )
            this.infoScrollNews = infoScrollNewsData.contents
        },
        // 抗疫专区 PENDING
        /* transformActiveData (baikeJson) {
      const activeData = baikeJson
      if (activeData && activeData.data && activeData.data.body) {
        if (activeData.data.body.payload) {
          let respData = activeData.data.body.payload
          if (respData.activelist && respData.activelist.length) {
            this.expertlistData = this.expertlistData.concat(respData.activelist)
          } else {
            this.expertlistData = homeConfig.contents.ruheyufang // 异常时使用配置数据
          }
          this.expertListPageData = this.expertlistData.slice(0, this.expertlistDataLimit) // 初始化第一页
          if (respData.keshilist && respData.keshilist.length) {
            this.hospitalData = respData.keshilist
          }
          if (respData.piyaolist && respData.piyaolist.length) {
            this.piyaolist = respData.piyaolist
          }
          // TODO 专家辟谣数据缺少 duration 和 查看更多对应数据结构
          if (respData.piyaovideolist && respData.piyaovideolist.length) {
            this.piyaovideolist = respData.piyaovideolist
          }
        }
        if (activeData.data.body.piyaopayload) {
          this.activeData = activeData.data.body.piyaopayload.activelist
        }
        // 顶部banner
        if (activeData.data.body.bannerpayload) {
          if (activeData.data.body.bannerpayload.activelist.length) {
            this.banner = activeData.data.body.bannerpayload.activelist[0] // 默认取了第一条
          }
        }
        // 辟谣视频文章
        if (activeData.data.body.piyaovideopayload) {
          try {
            // 去掉医典的后退ICON
            if (
              activeData.data.body.piyaovideopayload.activelist[0].result[1].h5url.indexOf(
                '&tmenu=noback'
              ) === -1
            ) {
              activeData.data.body.piyaovideopayload.activelist[0].result[1].h5url +=
                '&tmenu=noback'
            }
          } catch (err) {
            console.log('add noback err = ', err)
          }
          this.expertData = activeData.data.body.piyaovideopayload.activelist
        }
        if (activeData.data.body.bannerpayload) {
          if (activeData.data.body.bannerpayload.activelist.length) {
            this.banner = activeData.data.body.bannerpayload.activelist[0] // 默认取了第一条
          }
        }
      }
    }, */
        tabs (id) {
            this.tab = id
            sessionStorage.setItem(LAST_SEL_TAB, this.tab)
        },
        /** Tablist Fix 代码 */
        scrollToTabList (el) {
            let top = document.querySelector('.__tablist').offsetTop
            window.scrollTo(0, top)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~Styles/views/disease/current-report';
@import '~Styles/views/disease/current-report-en';
@import '~Styles/views/disease/widget/currentReport/widget-disease-didi';
@import '~Styles/views/disease/widget/currentReport/widget-disease-guanjia';

@import './pneumonia.scss';
.more-list-btn {
    &.bottomMargin {
        // 当Tab3不存在时 需要适当抬高tab2的高度，以免被遮挡
        margin-bottom: 55px;
    }
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
