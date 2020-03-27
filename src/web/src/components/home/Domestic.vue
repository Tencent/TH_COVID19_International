<template>
    <div class="tab-content-02 tab-second">
        <Dashboard
            :area-total="areaTotal"
            :notice="notice"
            :dataFrom="dataFrom"
            :recent-time="recentTime"
            :chinaFullNews="chinaFullNews"
            :totalChinaTongbaoCnt="totalChinaTongbaoCnt"
            @getContentInfo="getContentInfo"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import 'swiper/dist/css/swiper.css'
import Dashboard from '@/components/dashboard'
import homeConfig from '@/config/home-default'

export default {
    name: 'Domestic',
    components: {
        Dashboard
    },
    props: {
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
    computed: {
        ...mapState({
            initData: (state) => state.initData
        })
    },
    watch: {
        initData (initData) {
            this.initAreaInfo(initData)
        }
    },
    data () {
        return {
            areaTotal: [],

            notice: '',
            dataFrom: '',
            recentTime: ''
        }
    },
    methods: {
        getContentInfo () {
            this.$emit('getContentInfo')
        },
        initAreaInfo (initData) {
            if (initData.getAreaInfo) {
                let getAreaInfo = homeConfig.getAreaInfo // 默认兜底方案，当接口异常时使用兜底数据
                if (initData.getAreaInfo.code === 0) {
                    getAreaInfo = initData.getAreaInfo
                }
                const { areaTotal, notice = '', dataFrom = '', recentTime = '' } = getAreaInfo
                this.notice = notice
                this.dataFrom = dataFrom
                this.recentTime = recentTime
                this.areaTotal = areaTotal.map((item) => ({ ...item, isAttented: false }))
            }
        }
    },
    async mounted () {
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
