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
    <div class="common-dialog" v-show="isShowPopWin">
        <div class="mask" @touchmove.prevent></div>
        <div class="dialog">
            <div class="dialog-hd">
                <p class="dialog-hd-title">{{ msg.title }}</p>
            </div>
            <div class="dialog-bd text-left">
                <p v-for="(item, index) in msg.content" :key="index">{{ item }}</p>
                <p
                    style="text-align: left; padding-bottom: 10px; color: #2c49d7;"
                    v-if="msg.isLink"
                    @click="jumpToMore(msg.link.url)"
                >
                    {{ msg.link.desc }}
                </p>
            </div>
            <div class="dialog-ft">
                <span @click="closePopWin" class="btn">{{$t('common.Close')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/utils/event-bus'
// popWinConfig中进行兜底配置
import { popWinConfig } from '@/config/popWinConfig'

export default {
    name: 'PopWin',
    data () {
        return {
            isShowPopWin: false,
            msgKey: ''
        }
    },
    computed: {
        msg () {
            let msg = {
                title: '',
                content: []
            }
            // 从后台拉取弹窗文案配置
            // 或在popWinConfig中配置兜底文案
            try {
                return this.globalConfig.wording.common.dialog[this.msgKey] || msg
            } catch (e) {
                return popWinConfig[this.msgKey] || msg
            }
        }
    },
    mounted () {
        EventBus.$on('showPopWin', (msgKey) => {
            this.showPopWin(msgKey)
        })
    },
    methods: {
        showPopWin (msgKey) {
            this.reportStatLog({
                actionType: 'event',
                actionName: 'popWin.show',
                extra: { msg: msgKey }
            })
            // console.log('~~~~~~~~~~~~~', msgKey)
            this.msgKey = msgKey
            this.isShowPopWin = true
        },
        closePopWin () {
            // this.reportStatLog({
            //     actionType: 'event',
            //     actionName: 'popWin.close',
            //     extra: { msg: this.msgKey }
            // })
            this.msgKey = ''
            this.isShowPopWin = false
        },
        jumpToMore (url) {
            // this.reportStatLog({
            //     actionType: 'event',
            //     actionName: 'dialog.goMoreTips'
            // })
            window.location.href = url
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~styles/components/dialog';
</style>
