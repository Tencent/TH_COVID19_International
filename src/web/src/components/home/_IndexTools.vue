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
    <div class="disease-tool-wrap" v-if="filterdBanner.length">
        <div v-for="(item, index) in filterdBanner" :key="index" class="tool-menu" @click="link(item)">
            <img :src="item.imageUrl" alt="" />
            <span>{{ item.bannerName }}</span>
            <div class="line"></div>
        </div>
    </div>
</template>

<script>
import { appendQuery } from '@/utils'
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            banners: (state) => state.homeBanner
        }),
        // 可根据业务链接类型进行过滤
        filterdBanner () {
            if (this.banners.length === 3) {
                return this.banners
            } else {
                // 兼容性代码，从stringArray 切换到 numberArray的兼容措施
                this.pageConfig['home_pills'] = this.pageConfig['home_pills'].map((r) => r + '')
                if (this.pageConfig.home_pills.length === 0) {
                    return [] // 未配置，直接隐藏
                }
                let filterd = this.banners.filter((banner) => {
                    return ~this.pageConfig['home_pills'].map((s) => parseInt(s)).indexOf(banner.id)
                })
                filterd.sort((a, b) => {
                    return (
                        this.pageConfig['home_pills'].indexOf(a.id + '') -
                        this.pageConfig['home_pills'].indexOf(b.id + '')
                    )
                }) // 按自然顺序排序
                if (filterd.length === 3) {
                    return filterd
                } else {
                    return []
                }
            }
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
        link (item) {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'IndexTools.click',
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
        }
    }
}
</script>
