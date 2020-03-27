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
    <div ref="_dongtaibobao" class="content-wrapper epanel">
        <div class="epanel-title-bar dongtaibobao __shishitongbaoTitle">
            <p class="epanel-title">
                {{ newsType === 'china_broadcast_tips' ? $t('home.D_Live_Updates') : $t('home.O_Live_Updates') }}
            </p>
        </div>
        <div class="timeline-list">
            <div class="timeline-item" v-for="(item, index) in fullNews" :key="index">
                <div class="time-detail" v-if="item.publicTime">
                    <p class="date">{{ item.publicTime.substr(5, 6).replace('-', '.') }}</p>
                    <p class="time">{{ item.publicTime.substr(item.publicTime.length - 5) }}</p>
                    <p class="new" v-if="index == 0 && newsType === 'china_broadcast_tips'">
                        {{ globalConfig.wording.home[newsType] || '最新' }}
                    </p>
                </div>
                <div class="detail-box">
                    <div class="detail-box-inner">
                        <p class="box-tt" v-if="item.title">{{ item.title }}</p>
                        <p class="box-content" @click="item.more = false" :class="{ more: item.more }" v-if="item.desc">
                            {{ item.desc }}
                            <span class="more-txt">{{ $t('common.More') }}</span>
                        </p>
                        <p class="box-content-from" v-if="item.from">{{ item.from }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="more-list-btn"
            :class="{ bottomMargin: !pageConfig['isShowTab3'] }"
            v-if="showMoreTongbaoBtn"
            @click="getContentInfo"
        >
            {{ $t('common.More') }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'DynamicBroadcast',
    props: {
        // 用于拉取预设配置配置
        newsType: {
            type: String,
            default: 'china_broadcast_tips'
        },
        // 全国最新动态
        fullNews: {
            type: Array,
            default () {
                return []
            }
        },
        /**
         * 用于动态加载数据判断
         */
        totalTongbaoCnt: {
            type: Number,
            required: true
        }
    },
    computed: {
        /**
         * 动态加载数据
         */
        showMoreTongbaoBtn () {
            return this.fullNews.length < this.totalTongbaoCnt
        }
    },
    // mounted () {
    //     console.log(this.newsType)
    // },
    methods: {
        /**
         * 动态加载数据
         */
        getContentInfo () {
            this.$emit('getContentInfo')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~Styles/components/more-list';
</style>
