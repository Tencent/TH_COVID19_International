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
    <div class="tab-content-01 tab-ends">
        <div class="content-wrapper epanel">
            <div class="epanel-box-sub epanel-box-sub--news">
                <div class="epanel-title-bar">
                    <p class="epanel-title">大家都在看</p>
                </div>
                <expert :expert="expertData" :hospital="hospitalData" :active="activeData" class="pneumonia-section" />
                <combat-disease ref="disease-banner" />
            </div>
            <div class="epanel-box-sub">
                <div class="epanel-title-bar">
                    <p class="epanel-title">专家推荐</p>
                </div>
                <div class="question-list pb100" style="padding-top: 0;">
                    <div
                        class="question-item"
                        v-for="(item, index) of expertListPageData"
                        :key="index"
                        @click="toYuFangDetail(item.h5url, item.text)"
                    >
                        <div class="title">
                            <i class="icon-question"></i>
                            <span class="txt">{{ item.text }}</span>
                        </div>
                        <div class="content">{{ item.text2 }}</div>
                        <p class="more">查看详情</p>
                    </div>
                    <div class="more-list-btn" v-if="showMoreListBtn" @click="showMoreDataList">
                        {{ $t('common.More') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 专家解读组件
import expert from './../../views/modules/expert/expert.vue'
// 抗疫工具组件
import CombatDisease from '@/components/home/CombatDisease'
export default {
    props: [
        'expertData',
        'hospitalData',
        'activeData',
        'expertListPageData',
        'expertlistData',
        'expertlistDataLimit',
        'expertlistDataCurrent'
    ],
    components: {
        expert,
        CombatDisease
    },
    computed: {
        /**
         * 如何预防列表是否显示更多按钮
         * 分页动态加载数据
         */
        showMoreListBtn () {
            return this.expertlistDataLimit * this.expertlistDataCurrent < this.expertlistData.length
        }
    },
    // mounted () {
    //     //
    // },
    methods: {
        /**
         * 点击更多按钮
         * 分页动态加载数据
         */
        showMoreDataList () {
            this.$emit('showMoreDataList')
        },
        // 跳转医典链接
        toYuFangDetail (url, title) {
            try {
                // this.reportStatLog({
                //     actionType: 'event',
                //     actionName: 'toYuFangDetail',
                //     extra: { url: url, tab: this.tab, title: title }
                // })
            } catch (error) {
                console.log(error)
            }
            if (url) {
                location.href = `${url}&webview=wxjk`
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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
