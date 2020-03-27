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
<style lang="scss" scoped>
// @import '~styles/views/disease/current-report';
@import '~styles/components/dialog';
</style>
<template>
    <div>
        <div class="common-dialog" @touchmove.prevent>
            <div class="mask"></div>
            <div class="dialog">
                <div class="dialog-hd">
                    <p v-if="config.title" class="dialog-hd-title">{{ config.title }}</p>
                </div>
                <div class="dialog-bd text-left" :style="{ textAlign: config.textAlign }">
                    {{ config.content }}
                </div>
                <div class="dialog-ft">
                    <span v-if="config.showCancel" class="btn default" @click="handleCancel">{{
                        config.cancelText
                    }}</span>
                    <span class="btn" @click="handleConfirm" v-if="config.confirmText">{{ config.confirmText }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    /**
     * @config 弹窗配置
     * @property title
     * @property content
     * @property showCancel
     * @property cancelText
     * @property confirmText
     */
    props: ['config'],
    methods: {
        // cancel回调
        handleCancel () {
            if (typeof this.config.handleCancel === 'function') {
                this.config.handleCancel()
            }
        },
        // confirm回调
        handleConfirm () {
            if (typeof this.config.handleConfirm === 'function') {
                this.config.handleConfirm()
            }
        }
    }
}
</script>
