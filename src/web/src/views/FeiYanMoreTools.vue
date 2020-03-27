<template>
    <div class="booking-page" v-if="!isLoading">
        <img
            class="banner"
            src="https://static.wecity.qq.com/h5/2020-2/more-tools-header-f64fc5ede7360ad4105e6718b0e93883.png"
        />
        <div class="tools-list" style="min-height: 450px;">
            <div class="tools-block" v-for="(item, index) in filterdToolList" :key="index">
                <h2 class="block-title" v-if="item.data.length || index == 0">{{ item.category }}</h2>
                <template v-if="index === 0">
                    <span class="tools-item-box even-img">
                        <img
                            @click="toHome"
                            src="https://static.wecity.qq.com/h5/2020-2/tools_01-5f5524402c7d492c89861078c99c0118.png"
                            style="position: absolute; left: 0; top: 0; width: 100%;"
                        />
                    </span>
                </template>
                <div
                    class="tools-item-box big"
                    v-if="subItem1.imageType === 2"
                    @click="toService(subItem1)"
                    v-for="subItem1 in item.data"
                >
                    <img :src="subItem1.imageUrl" />
                </div>
                <div
                    class="tools-item-box small"
                    v-if="subItem2.imageType === 1"
                    v-for="subItem2 in item.data"
                    @click="toService(subItem2)"
                >
                    <img :src="subItem2.imageUrl" />
                </div>
            </div>
        </div>
        <div class="contact" v-if="pageConfig['allowContactAndTollBox']">
            <div class="join-guide" @click="toGuide">
                <a href="javascript:void(0);">合作指引及接入指南</a>
                <i class="arrow-right" />
            </div>
            <p class="grey">若您需接入工具箱，请联系我们</p>
        </div>
    </div>
</template>

<script>
import httpUtils from '@/api'
import { appendQuery } from '@/utils'

export default {
    name: 'FeiYanMoreTools',
    data () {
        return {
            channel: this.$route.query.channel,
            toolList: [],
            isLoading: true,
            activityUrl: ''
        }
    },
    async mounted () {
        this.reportStatLog({
            path: window.location.pathname,
            actionType: 'page',
            actionName: 'feiYanMoreTools'
        })
        const loadingToast = this.$loadingToast({
            message: '加载中',
            showTime: 30000
        })
        try {
            await this.fetchPageConfig()
            await this.getTools()
        } catch (e) {
            console.log(e)
            this.isShowError = true
        }
        loadingToast.close()
        this.isLoading = false
    },
    computed: {
        filterdToolList () {
            return this.toolList.map((item) => {
                return {
                    ...item,
                    data: item.data.filter((tool) => {
                        if (!~Object.keys(tool).indexOf('toolType')) {
                            return true
                        }
                        if (
                            ~this.pageConfig['moreToolsFilter']
                                .map((s) => {
                                    return parseInt(s)
                                })
                                .indexOf(tool.toolType)
                        ) {
                            return true
                        }
                        return false
                    })
                }
            })
        }
    },
    methods: {
        async fetchPageConfig (param) {
            try {
                await this.globalConfig._remote
                await this.pageConfig._remote // 强制等待远程配置
                this.activityUrl = this.globalConfig.feature.moreTools.bannerUrl
            } catch (e) {}
        },
        toHome () {
            this.reportStatLog({
                path: window.location.pathname,
                actionType: 'event',
                actionName: 'feiyanMoreTools.toHome'
            })
            this.$router.push({
                path: 'index',
                query: { ...this.$route.query, tab: 'shishitongbao' }
            })
        },
        toGuide () {
            try {
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'feiyanMoreTools.toGuide'
                })
                this.$router.push({
                    path: 'feiyan-tools-guide',
                    query: this.$route.query
                })
            } catch (error) {
                console.log(error)
            }
        },
        toService (item) {
            try {
                this.reportStatLog({
                    actionType: 'event',
                    actionName: 'feiyanMoreTools.toService',
                    extra: item
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
            } catch (error) {
                console.log(error)
            }
        },
        async getTools (cityCode) {
            try {
                const { code, data } = await httpUtils('toolBanner', { cityCode: '' }, 'FeverBannerH5')
                if (code === 0) {
                    this.toolList = data
                } else {
                    this.isShowError = true
                }
            } catch (error) {
                this.isShowError = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~styles/views/disease/toolset';
@import '~styles/views/disease/widget/toolset/dialog';
.booking-page {
    &.page-lock {
        position: fixed;
    }
}
</style>
