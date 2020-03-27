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
    <span :class="className">{{ number }}</span>
</template>

<script>
export default {
    props: {
        number: [Number, String],
        // 是否录入数据 1: 已录入 0：未录入
        showAdd: Number,
        // 新增数据是否显示‘+’
        hasPlus: {
            type: Boolean,
            default: false
        },
        // showAdd为0时不显示新增数据
        // 新增数据缺省替代文案
        updatingDesc: {
            type: String,
            default: 'TO Be Updated'
        }
    },
    computed: {
        // 数字样式字号加大
        className () {
            return isNaN(this.number) ? 'txt-cn' : ''
        }
        // numberShow () {
        //     let numberShow = ''
        //     if (this.showAdd === 1) {
        //         if (this.hasPlus) {
        //             numberShow = this.number > 0 ? `+${this.number}` : this.number
        //         } else {
        //             numberShow = this.number
        //         }
        //     } else {
        //         numberShow = this.updatingDesc
        //     }
        //     return numberShow
        // }
    }
}
</script>
