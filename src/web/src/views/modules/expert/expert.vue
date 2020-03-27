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
    <div class="expert-wrap">
        <div class="expert-card">
            <div class="expert-title">
                <div class="expert-text">腾讯医典专家团解读</div>
                <div
                    v-if="
                        expertItem.result &&
                        expertItem.result[1] &&
                        expertItem.result[1].name &&
                        expertItem.result[1].h5url
                    "
                    @click="toUrl(expertItem.result[1].h5url, false, expertItem.result[1].name)"
                    :tourl="expertItem.result[1].h5url"
                    class="expert-more"
                    data-eventname="top.moreclk"
                >
                    {{ expertItem.result[1].name }}
                </div>
            </div>
            <div
                @click="toUrl(expertItem.h5url, false, expertItem.text2)"
                :tourl="expertItem.h5url || ''"
                class="expert-item"
                data-eventname="top.expert"
            >
                <div class="expert-info">
                    <div class="info-title">{{ expertItem.text2 }}</div>
                    <div v-if="expertItem.text" class="info-desc">{{ expertItem.text }}</div>
                </div>
                <div
                    v-if="expertItem.image"
                    :class="{ video: expertItem.result2 && expertItem.result2[0] && expertItem.result2[0].type === 2 }"
                    class="expert-img"
                >
                    <img :src="expertItem.image" />
                </div>
            </div>
            <div
                v-if="expertItem.result && expertItem.result[0] && expertItem.result[0].name"
                @click="toUrl(expertItem.h5url, false, expertItem.result[0].name)"
                :tourl="expertItem.h5url || ''"
                class="expert-btn"
                data-eventname="top.expertbtn"
            >
                <div class="btn">{{ expertItem.result[0].name }}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        expert: {
            type: Array,
            default: () => []
        },
        hospital: {
            type: Array,
            default: () => []
        },
        active: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        expertItem () {
            return (this.expert && this.expert[0]) || {}
        }
    },
    // mounted () {},
    // created () {},
    methods: {
        toUrl (url, handle = true, name) {
            // this.reportStatLog({
            //     actionType: 'event',
            //     actionName: 'toUrl',
            //     extra: {
            //         url,
            //         name: name || ''
            //     }
            // })
            if (url) {
                let targetUrl = ''
                if (handle && url.indexOf('https://h5.baike.qq.com') === -1) {
                    // 医典接口返回数据很多包含了前缀
                    targetUrl = 'https://h5.baike.qq.com' + url
                } else {
                    targetUrl = url
                }
                const hasSearch = targetUrl.indexOf('?') !== -1
                location.href = `${targetUrl}${hasSearch ? '&' : '?'}webview=wxjk`
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~Styles/views/disease/expert';
</style>
