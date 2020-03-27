<template>
    <div v-if="direction === 'row'" class="index-news-wrap">
        <span class="ico-news-notice">
            <svg
                width="21px"
                height="22px"
                viewBox="0 0 21 22"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
            >
                <g id="1.30" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g
                        transform="translate(-68.000000, -726.000000)"
                        :fill="!isDidi ? globalConfig.feature.home.infoScrollBar.color : '#000'"
                        fill-rule="nonzero"
                    >
                        <g transform="translate(68.000000, 725.500000)">
                            <polygon points="0 7.5 2 7.5 2 13.5 0 13.5"></polygon>
                            <path
                                d="M4,6.15354568 C4,6.15354568 12.7592195,5.84226515 17.3537703,0.521738273 C17.3537703,0.521738273 21.2836863,-0.391963249 20.983655,9.62805949 C20.983655,9.62805949 21.4019457,16.5280017 17.3907605,17.5 C17.3907605,17.5 14.3791125,13.7016533 4.00272929,13.2412117 L4,6.15354568 L4,6.15354568 Z"
                                id="路径"
                            ></path>
                            <path
                                d="M5,15.5 C5,15.5 5.37916863,18.9175886 8.16900739,22.4965978 C8.16900739,22.4965978 10.5932334,22.6042443 10.9588461,21.6085221 C10.9588461,21.6085221 11.2161108,20.9492404 10.4441845,20.1015691 C10.1971033,19.7118801 7.99995529,17.8680924 7.64092215,15.5 L5,15.5 L5,15.5 Z"
                                id="路径"
                            ></path>
                        </g>
                    </g>
                </g>
            </svg>
        </span>
        <div class="index-news-list" id="areaWrap">
            <div class="index-news-box" id="areaWrapNews">
                <swiper :options="swiperOptionNews" ref="mySwiperNews" v-if="show">
                    <swiper-slide v-for="(item, index) in list" :key="index">
                        <div class="index-news-box-item">
                            <p :style="{ color: !isDidi ? globalConfig.feature.home.infoScrollBar.color : '#000' }">
                                {{ item }}
                            </p>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div class="index-news-btn">
            <span :style="{ color: !isDidi ? globalConfig.feature.home.infoScrollBar.color : '#000' }">
                {{ $t('common.More') }}
            </span>
            <i
                class="icon-arrow-right"
                :style="{ borderColor: !isDidi ? globalConfig.feature.home.infoScrollBar.color : '#000' }"
            ></i>
        </div>
    </div>
    <div v-else class="desc-list" id="areaWrap" ref="areaWrap">
        <div v-for="i in 2" :key="i" class="desc-box">
            <p v-for="(item, index) in list" :key="index" ref="p">{{ item }}</p>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    props: {
        list: Array,
        direction: {
            type: String,
            default: 'row'
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    data () {
        const _this = this
        return {
            swiperOptionNews: {
                autoplay: this.globalConfig.feature.home.infoScrollBar.autoplay
                    ? {
                        delay: 2000,
                        disableOnInteraction: false
                    }
                    : false,
                loop: true,
                // observer:true,
                // observeParents:true,
                initialSlide: 0,
                on: {
                    init: function () {
                        _this.$emit('indexChange', this.realIndex)
                    },
                    slideChangeTransitionEnd: function () {
                        // console.log('realIndex', this.activeIndex, this.realIndex);
                        _this.$emit('indexChange', this.realIndex)
                    }
                }
            },
            // newsList: this.list,
            chartDialogVisible: false,
            dialogVisible: false,
            show: true
        }
    },
    computed: {
        isDidi () {
            return false
        }
    },
    watch: {
        list (newVal) {
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    },
    async mounted () {
        if (this.direction === 'column') {
            this.scroll()
        }
    },
    methods: {
        scroll () {
            let areaWrap = this.$refs['areaWrap']
            const pHeight = areaWrap.getElementsByTagName('p')[0].offsetHeight

            let time = 0

            function scrollUp () {
                if (areaWrap.scrollTop % pHeight === 0) {
                    clearInterval(time)
                    setTimeout(startMove, 1000)
                } else {
                    areaWrap.scrollTop++
                }
                if (areaWrap.scrollTop >= areaWrap.scrollHeight / 2) {
                    areaWrap.scrollTop = 0
                }
            }

            function startMove () {
                areaWrap.scrollTop++
                time = setInterval(scrollUp, 100)
            }

            setTimeout(startMove, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
.scroll-wrap {
    overflow: hidden;
}
</style>
