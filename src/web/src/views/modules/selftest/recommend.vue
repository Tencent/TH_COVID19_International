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
<div class='recommend' v-show="ifShow">
  <div class="yq-data force-render" v-show="hospitalConfig.ifShowRecommendDisease">
    <h4 id="triggerRender">疫情动态</h4>
    <p class="time" v-if="areaInfo && areaInfo.area && diseaseInfo.ifShow">截至{{recentTime}}</p>
    <div class="data" v-if="areaInfo && areaInfo.area && diseaseInfo.ifShow">
      <div class="data-box" @click="handleLocal">
        <div class="data-item" v-if="noLocation" @click.stop="handleIndex">
          <span class="b">全国</span>
          <span>新增确诊<b>{{chinaSummary.newConfirm}}</b></span>
          <span>确诊<b>{{chinaSummary.confirm}}</b></span>
          <span>治愈<b>{{chinaSummary.heal}}</b></span>
          <i class="arrow-right"/>
        </div>
        <div v-else>
          <div class="data-item">
            <span class="b">{{areaInfo.area}}</span>
            <span>新增确诊<b>{{areaInfo.modifyConfirm}}</b></span>
            <span>确诊<b>{{areaInfo.confirm}}</b></span>
            <span>治愈<b>{{areaInfo.heal}}</b></span>
          </div>
          <div class="data-item" v-if="cityInfo && cityInfo.city">
            <span class="b">{{cityInfo.city}}</span>
            <span>新增确诊<b>{{cityInfo.modifyConfirm}}</b></span>
            <span>确诊<b>{{cityInfo.confirm}}</b></span>
            <span>治愈<b>{{cityInfo.heal}}</b></span>
          </div>
        </div>
      </div>
      <div class="more" v-if="diseaseInfo.ifShowCountry && !noLocation " @click="handleIndex">
        全国疫情
      </div>
    </div>
    <div class="entry">
      <!-- 可配置的工具模块 -->
      <!-- 四个一行 -->
      <!-- <div class="tool-item"
        v-for="item of recommendModule"
        :key="item.title + item.subTitle"
        @click="handleModule(item.link, item)"
      >
        <img :src="item.icon"/>
        <p>{{item.title}}</p>
      </div> -->
      <!-- 两个一行 -->
      <!-- <div class="entry-item"
        v-for="(item, index) of recommendModule"
        :key="index"
        @click="handleModule(item.link, item)"
        :style="`background:${item.bg || '#e0f9f5'}`"
      >
        <img class="entry-icon" :src="item.icon"/>
        <div class="entry-text">
          <h5 class="entry-name">{{item.title}}</h5>
          <span class="entry-desc">{{item.subTitle}}</span>
        </div>
      </div> -->
      <img class='entry-img' v-for="(item, index) of recommendModule"
        :key="index"
        @click="handleModule(item.link, item)"
        :src='item.moduleImg' />
      <div class="more-entry" v-if="recommendModuleConfig.ifShowModullesMore" @click="handleMoreModules"><p>更多</p></div>
    </div>
    <div class='aiqa-recommend' v-if="recommendModuleConfig.ifShowAIQA">
      <span class="example-title">想了解疫情知识，可以这样问我</span>
      <ul class="example-list">
        <li class="example-item"
          v-for="item of aiqaRecommend"
          :key="item"
          @click="handleAIQARecommend(item)"
        >{{item}}</li>
      </ul>
      <a class="example-more" href="javascript:void(0);" @click="handleAIQARecommend">查看更多</a>
    </div>
  </div>

  <div class="recommend-read force-render" v-show="hospitalConfig.ifShowRecommendAbbreviation">
    <h4>疫情科普</h4>
    <div class="chapter" v-for="(item, index) of recommendList" :key="index" @click="handleJump(item)">
      <div class="title">
        <h5>{{item.title}}</h5>
        <img v-if="item.img" :src="item.img"/>
      </div>
      <div class="info">{{item.sourceLeft}}  |  {{item.sourceRight}}</div>
    </div>
  </div>

</div>
</template>
<script>
import httpUtils from '@/api'
import { jump } from './util'

export default {
    props: {
        hospitalConfig: Object,
        answerIndex: Number,
        cityCode: String,
        noLocation: Boolean,
        show: Boolean
    },
    data () {
        return {
            areaInfo: {},
            cityInfo: {},
            recentTime: '',
            diseaseInfo: {},
            recommendModule: [],
            recommendModuleConfig: {},
            chinaSummary: {},
            aiqaRecommend: [],
            ifShow: false
        }
    },
    watch: {
        show (ifShow) {
            this.ifShow = ifShow
        },
        async noLocation (noLocation) {
            if (!noLocation) return
            const context = this.$route.query && this.$route.query.channel
                ? { channel: this.$route.query.channel }
                : {}
            const { code, data } = await httpUtils(
                'getChinaTotal',
                { none: 'none' },
                'THPneumoniaOuterDataService',
                context
            )
            if (code === 0) {
                const { confirm, heal } = data.chinaTotal
                const { confirm: newConfirm } = data.chinaDayModify
                this.chinaSummary = { confirm, heal, newConfirm }
                window.localStorage.chinaSummary = JSON.stringify(this.chinaSummary)
                console.log('config chinaSummary', data)
            }
        },
        async cityCode (cityCode) {
            try {
                const CityInfoByCode = await httpUtils('getCityInfoByCode', { cityCode }, 'THPneumoniaOuterDataService')
                if (CityInfoByCode.code === 0) {
                    const { areaInfo, cityInfo, recentTime } = CityInfoByCode
                    this.areaInfo = areaInfo
                    this.cityInfo = cityInfo

                    this.recentTime = recentTime.split(':').slice(0, -1).join(':').replace(/-/g, '/')
                }
            } catch (error) {
                console.log('❌ cityCode error', error)
            }
        },
        hospitalConfig (hospitalConfig) {
            if (hospitalConfig && hospitalConfig.recommendCard) {
                const recommendCardConfig = hospitalConfig.recommendCard
                // 推荐模块
                this.recommendModule = recommendCardConfig.modules || []
                this.recommendModuleConfig = {
                    ifShowModullesMore: recommendCardConfig.ifShowModullesMore,
                    modulesMoreLink: recommendCardConfig.modulesMoreLink,
                    ifShowAIQA: recommendCardConfig.ifShowAIQA
                }

                // 疫情动态模块
                this.diseaseInfo = recommendCardConfig.disease || {}
            }
        }
    },
    computed: {
    // 推荐文章
        recommendList () {
            const list = (this.hospitalConfig && this.hospitalConfig.recommend) || []
            const articleList = list.filter(item => ~~item.answerIndex === this.answerIndex)
            console.log('🐞 || config ariticle: ', this.answerIndex, list)
            return articleList
        }
    },
    methods: {
        async handleJump (item) {
            const url = item.link
            const title = item.title
            this.jump({
                url,
                report: {
                    actionName: 'selftest.recommend',
                    extra: { url, title }
                }
            })
        },
        // 推荐其他工具
        async handleModule (url, item) {
            this.jump({
                url,
                report: {
                    actionName: 'selftest.afterend.click.module',
                    extra: { title: item.title, url }
                }
            })
        },
        // 发热地图 - 本地
        async handleLocal () {
            const { minitype, cityCode, channel } = this.$route.query
            this.jump({
                url: '/map-detail',
                query: {
                    province: this.areaInfo.area,
                    minitype,
                    channel,
                    cityCode
                },
                report: {
                    actionName: 'selftest.afterend.click.local'
                }
            })
        },
        // 发热地图
        async handleIndex () {
            const countryLink = this.diseaseInfo && this.diseaseInfo.countryLink
            this.jump({
                url: countryLink,
                report: {
                    actionName: 'selftest.afterend.click.local'
                }
            })
        },
        // “更多” 工具按钮
        async handleMoreModules () {
            const moreLink = this.recommendModuleConfig.modulesMoreLink
            this.jump({
                url: moreLink,
                report: {
                    actionName: 'selftest.afterend.click.module.more'
                }
            })
        },
        async jump (...params) {
            jump.call(this, ...params)
        },
        async initAIQARecommend () {
            const req = {}
            const result = await httpUtils(
                'GetRecommend',
                req,
                'Diagnosis_NCOVQAServer_NCOVQAServant'
            )

            // eslint-disable-next-line camelcase
            const { recommand_ques, intent } = result || {}
            console.log('🐞 || : recommand_ques, intent', recommand_ques, intent)
            if (Array.isArray(recommand_ques)) {
                this.aiqaRecommend = recommand_ques.slice(0, 3)
            }
        },
        handleAIQARecommend (content) {
            // const url = AIQA_LINK + (typeof content === 'string' ? `&question=${content}&forceReload=1` : '&forceReload=1')
            const query = { forceReload: 1 }
            if (typeof content === 'string') query.question = content
            this.jump({
                url: '/aiqna',
                query,
                report: {
                    actionName: 'selftest.afterend.click.module',
                    extra: { title: '智能问答', url: '/aiqna', question: query.question }
                }
            })
        }
    },
    mounted () {
        this.initAIQARecommend()
    },
    beforeDestroy () {
        clearInterval(this.forceInterval)
    }
}
</script>
<style lang='scss' scoped>
@import '~styles/views/exam/selftest';

.recommend {
  animation: 400ms fadeInLeft ease;
}

.entry {
  .more-entry {
    padding-right: 0;
  }
  *:last-child {
    padding-right: .56rem;
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 1;
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
