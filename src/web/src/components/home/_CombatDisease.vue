<template>
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
    <div v-if="bannerGroup.length" class="disease-entrance">
        <div class="epanel-title-bar">
            <p class="epanel-title">抗疫工具箱</p>
            <p class="epanel-more" @click="toMoreTools">{{ $t('common.More') }}</p>
        </div>
        <div class="disease-entrance-bd">
            <swiper :options="swiperOptionBanner">
                <swiper-slide v-for="(group, index) in bannerGroup" :key="index">
                    <div class="disease-entrance-list">
                        <div
                            v-for="(item, i) in group"
                            :key="i"
                            @click="toEntryPath(item)"
                            class="disease-entrance-button"
                        >
                            <span class="disease-entrance-icon">
                                <img :src="item.imageUrl" />
                            </span>
                            <span class="disease-entrance-txt" style="word-break: keep-all;">
                                {{ item.bannerName }}
                            </span>
                        </div>
                    </div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { appendQuery } from '@/utils'
import { mapState } from 'vuex'

export default {
    name: 'CombatDisease',
    components: {
        swiperSlide,
        swiper
    },
    data () {
        return {
            swiperOptionBanner: {
                slidesPerView: 'auto',
                // autoplay: {
                //   delay: 1500,
                //   disableOnInteraction: false
                // },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                }
                // loop: true
            }
        }
    },
    computed: {
        ...mapState({
            banners: (state) => state.feverBanner
        }),
        /**
         * @description 按照groupSize进行分组
         */
        bannerGroup () {
            const banners = this.filterdBanner
            const groupSize = 8
            let trendDataGroup = []
            for (let i = 0, len = banners.length; i < len; i += groupSize) {
                trendDataGroup.push(banners.slice(i, i + groupSize))
            }
            return trendDataGroup
        },
        // 可根据业务链接类型进行过滤
        filterdBanner () {
            return this.banners.filter((r) => {
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
        }
    },
    methods: {
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
                actionName: 'combatBanner.click',
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
            case 4: {
                let url = location.origin + item.linkObj.url
                url = appendQuery(url, this.$route.query)
                location.href = url
                break
            }
            default:
                console.log('目标参数异常，跳转失败')
                break
            }
        },
        toMoreTools () {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'combatBanner.toMoreTools.click'
            })
            this.$router.push({
                path: '/feiyan-more-tools',
                query: this.$route.query
            })
        }
    }
}
</script>
