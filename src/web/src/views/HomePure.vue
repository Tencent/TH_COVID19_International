<template>
    <div class="container page-index" @click="gotoHome">
        <HomeHeader
            :tab="'shishitongbao'"
            :chinaSummary="chinaSummary"
            :foreignSummary="foreignSummary"
            :clickedTab.sync="clickedTab"
            :fullNews="[]"
            @curOverviewDataChange="curHeaderTabChange"
            @update:clickedTab="gotoHome()"
        ></HomeHeader>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import HomeHeader from '@/components/home/HomeHeaderPure'
import { mapActions, mapState } from 'vuex'

export default {
    name: 'HomePure',
    components: {
        HomeHeader
    },
    data () {
        return {
            clickedTab: '',
            chinaSummary: {
                chinaTotal: {},
                chinaDayModify: {},
                virusInfo: [],
                dataFrom: ''
            },
            currentHeaderTab: 'global',
            foreignSummary: {
                foreignDayModify: {},
                foreignTotal: {}
            }
        }
    },
    computed: {
        ...mapState({
            initData: (state) => state.initData
        })
    },
    watch: {
        initData (initData) {
            this.beginInitData(initData)
        }
    },
    async created () {
        if (window.localStorage.chinaSummary) {
            this.chinaSummary = JSON.parse(window.localStorage.chinaSummary)
        }
        if (window.localStorage.contentData) {
            this.contentData = JSON.parse(window.localStorage.contentData)
        }
        try {
            const context =
                this.$route.query && this.$route.query.channel
                    ? {
                        channel: this.$route.query.channel
                    }
                    : {}
            await this.getInitHomeData({
                context
            })
        } catch (error) {}
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
        },
        curHeaderTabChange (e) {
            this.currentHeaderTab = e
        },
        gotoHome () {
            // 跳转到完整版
            // 2020年3月10日 移除跳转
            // this.$router.push({
            //   path: '/',
            //   query: this.$route.query
            // })
        }
    }
}
</script>

<style lang="scss" scope>
@import '~Styles/views/disease/current-report';
@import '~Styles/views/disease/current-report-en';
@import './pneumonia.scss';
</style>
