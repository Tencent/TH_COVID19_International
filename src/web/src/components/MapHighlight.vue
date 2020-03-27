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
    <div class="highlight-box" v-if="innerData.name" @click="handleHighlightClick">
        <div class="highlight-box-inner">
            <b>{{ innerData.name }}： </b>
            <span v-if="innerData.number">
                {{ innerData.itemName }} <span class="txt-warning"> {{ innerData.number }} </span>
                <span v-if="innerData.number > 0"></span>
                <template v-if="numberKey === 'confirm' && showModify">
                    , Increase <span class="txt-info"> {{ innerData.modifyNumberDesc }} </span>
                </template>
            </span>
            <span v-else> none </span>
            <i v-if="innerData.number && showArrow" class="icon-arrow-right"></i>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    props: {
        // 原数据项
        areaData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        // 弹窗数据value使用的字段名
        numberKey: {
            type: String,
            default: 'confirm'
        },
        // 弹窗数据label使用的字段名
        // 默认为name
        nameKey: {
            type: String,
            default: 'name'
        },
        // 是否显示详情箭头
        showArrow: {
            type: Boolean,
            default: false
        },
        // 是否显示主字段对应的新增数据字段
        // modify${_numberKey}Desc
        showModify: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        innerData () {
            // 字段label映射
            const itemNames = {
                confirm: Vue.prototype.$i18nt('common.Total_Cases'),
                heal: Vue.prototype.$i18nt('common.Total_Recovered'),
                nowConfirm: Vue.prototype.$i18nt('common.Active_Cases')
            }
            // 产品约定：
            // 新增确诊使用字符串字段
            // 新增治愈使用数字字段
            // 海外版unit字段不显示
            const modifyKey = { confirm: 'modifyConfirmDesc', heal: 'modifyHeal' }
            const { areaData = {}, nameKey } = this
            const modifyValue = areaData[modifyKey[this.numberKey]] || ''
            return {
                ...areaData,
                name: areaData[nameKey],
                itemName: itemNames[this.numberKey],
                number: areaData[this.numberKey],
                modifyNumberDesc: modifyValue,
                unit: !isNaN(modifyValue) || ~modifyValue.indexOf('核减') ? '人' : ''
            }
        }
    },
    methods: {
        // 事件传递到父组件
        handleHighlightClick () {
            this.$emit('handleClick', this.areaData)
        }
    }
}
</script>
<style lang="scss" scoped>
.highlight-box {
    font-size: 12px;
    padding: 0 0 5px 15px;
    position: absolute;
    left: 0;
    top: 30px;
    z-index: 20;
}
.highlight-box-inner {
    display: inline-block;
    background: rgba(253, 234, 104, 0.5);
    color: rgba(199, 33, 28, 0.85);
    line-height: 20px;
    border-radius: 3px;
    padding: 4px 10px;
    margin: -5px 0 0 0;
    font-size: 12px;
    .txt-warning,
    .txt-info {
        color: rgba(199, 33, 28, 0.85);
    }
    .icon-arrow-right {
        display: inline-block;
        position: relative;
        width: 6px;
        height: 6px;
        border-right: 1px solid rgba(199, 33, 28, 0.85);
        border-bottom: 1px solid rgba(199, 33, 28, 0.85);
        transform: rotate(-45deg);
        vertical-align: middle;
        margin: -2px 1px 0 -1px;
    }
}
.ico-arrow-r {
    display: inline-block;
    position: relative;
    width: 6px;
    height: 6px;
    border-right: 1px solid rgba(199, 33, 28, 0.85);
    border-bottom: 1px solid rgba(199, 33, 28, 0.85);
    transform: rotate(-45deg);
    vertical-align: middle;
    margin: -2px 1px 0 -1px;
}
</style>
