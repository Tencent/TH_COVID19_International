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
    <div :style="{ zIndex: zIndex, display: hidden ? 'none' : 'block' }" @touchmove.prevent>
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast" :class="{ 'no-min-height': type === 'none', 'title-box': title && !toastType }">
            <i v-if="toastType" :class="`${toastType} weui-icon_toast`" />
            <p class="weui-toast__content weui-toast__title" v-if="title">{{ title }}</p>
            <p class="weui-toast__content" v-if="message">{{ message }}</p>
        </div>
    </div>
</template>

<script>
// 层级递增
let zIndex = 1000
export default {
    name: 'Toast',
    data () {
        return {
            type: 'success',
            message: '已完成',
            showTime: null,
            zIndex: zIndex++,
            resolve: null,
            isMounted: false,
            hidden: false,
            tick: null,
            title: ''
        }
    },
    computed: {
        /**
         *
         * @description 预设toast类型
         * @toastType return matched class of certain type
         * @type success
         * @type loading
         * @type network
         * @type ...
         */
        toastType () {
            const { type } = this
            switch (type) {
            case 'success': {
                return 'weui-icon-success-no-circle'
            }
            case 'loading': {
                return 'weui-loading'
            }
            case 'network': {
                return 'icon-wifi'
            }
            default:
                return ''
            }
        }
    },
    methods: {
        // 关闭toast
        close () {
            if (this.resolve !== null) this.resolve()
            this.showTime = null
            this.resolve = null
            this.hide()
        },
        // 展示toast
        show () {
            this.hidden = false
            if (typeof this.showTime === 'number') {
                clearTimeout(this.tick)
                this.tick = setTimeout(() => {
                    this.close()
                }, this.showTime)
            }
        },
        // 隐藏toast
        hide () {
            this.hidden = true
        }
    },
    mounted () {
        if (!this.isMounted) this.isMounted = true
        const self = this
        // 监听haschange事件
        window.addEventListener(
            'hashchange',
            function (event) {
                self.close()
            },
            false
        )
    }
}
</script>

<style scoped>
.no-min-height {
    min-height: initial;
}
.weui-icon_toast {
    width: 1rem;
    height: 1rem;
}
.title-box {
    margin-left: -3rem;
    width: 6rem;
    height: 1.2rem;
    padding-top: 0.8rem;
}
.weui-toast__title {
    font-size: 16px;
    font-weight: 600;
}
</style>
