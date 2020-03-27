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
    <i :class="`icon-${name}`">
        <component :is="name"></component>
    </i>
</template>

<script>
/**
 * 集中管理svg代码片段
 * svg 图标
 */
import knowledge from './icons/knowledge.vue'
import hot from './icons/hot.vue'
import badge from './icons/badge.vue'
import consultation from './icons/consultation.vue'

export default {
    // svg icon 标识
    props: {
        name: {
            type: String,
            required: true
        }
    },
    // to be extended ...
    components: {
        knowledge,
        hot,
        badge,
        consultation
    }
    // mounted () {}
}
</script>
