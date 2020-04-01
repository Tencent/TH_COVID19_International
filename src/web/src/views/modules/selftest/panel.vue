<!-- /**
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
    <div class="footer" :class="ifShow ? 'show' : 'hide'">
        <div class="select">
            <!-- 选项 -->
            <div
                v-for="option of options"
                :key="option"
                class="select-item"
                :class="handleBtnWidthClass(option)"
                @click="chooseOption(option)"
            >
                {{ option }}
            </div>
            <!-- 多选题追加以上都不是 -->
            <div
                v-if="type === 'multi'"
                class="select-item big"
                :class="{ selected: cancelSelected }"
                @click="handleCancel"
            >
                {{ cancelText }}
            </div>
        </div>
        <div class="submit" v-if="type === 'multi'">
            <div class="submit-item main-color" :class="{ disabled: selected.length === 0 }" @click="handleConfirm">
                {{$t('selftest.Confirm')}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        options: Array,
        type: String,
        show: Boolean,
        leftBtnText: String
    },
    data () {
        return {
            selected: [],
            ifShow: false
        }
    },
    computed: {
        // 以上都不是的文案，优先读组件props
        cancelText () {
            return this.leftBtnText || this.$i18n.t('selftest.None')
        },
        // 是否选中了 以上都不是 按钮
        cancelSelected () {
            return this.type === 'multi' && this.selected.indexOf(this.cancelText) >= 0
        }
    },
    watch: {
        show (show, old) {
            this.ifShow = show
        }
    },
    methods: {
        // 点选按钮
        // 单多选都走这个流程
        chooseOption (option) {
            if (!this.ifShow) return

            // 多选题选择
            if (this.type === 'multi') {
                // 如果已选 以上都不是 就先置空
                let copiedSelected = this.cancelSelected ? [] : [...this.selected]
                // 增/删
                const optionIndex = this.selected.indexOf(option)
                if (optionIndex >= 0) copiedSelected.splice(optionIndex, 1)
                else copiedSelected = copiedSelected.concat(option)

                this.selected = copiedSelected
            }

            // 单选题选择
            if (this.type === 'single') {
                this.selected = [option]
                this.$nextTick(() => {
                    this.handleConfirm()
                })
            }

            console.log('🐞 || this.selected: ', this.selected, this.type)
        },

        // 选择了以上都不是
        handleCancel () {
            if (this.cancelSelected) {
                this.selected = []
                return
            }
            this.selected = [this.cancelText]
            // this.$emit('confirm', [])
            // this.hideSelf()
        },

        // 提交选中项
        handleConfirm () {
            if (this.selected.length === 0) return

            const selected = this.cancelSelected ? [] : this.selected

            this.$emit('confirm', selected)
            this.hideSelf()
            this.reset()
        },

        // 清空选项
        reset () {
            this.selected = []
        },

        // 隐藏面板
        hideSelf () {
            this.ifShow = false
        },

        // 处理每个按钮样式的 class
        // size 分为 大、中、小 三档
        // 需要区分语言来划分档次
        handleBtnWidthClass (content) {
            const length = content.length
            let resultClass = 'mid'

            // 中文划分
            if (this.$i18n.locale.toLowerCase() === 'zh') {
                // 只有两个小的 平分一行
                if (this.options.length === 2 && this.options.every(option => option.length < 5)) {
                    resultClass = 'mid'
                }
                // 小尺寸
                else if (length < 5) resultClass = 'small'
                // 大尺寸
                else if (length > 7) resultClass = 'big'
                // 中尺寸
                else resultClass = 'mid'
            }
            // 英文划分
            else {
                // 只有两个小的 平分一行
                if (this.options.length === 2 && this.options.every(option => option.length < 10)) {
                    resultClass = 'mid'
                }
                // 小尺寸
                else if (length < 10) resultClass = 'small'
                // 大尺寸
                else if (length > 14) resultClass = 'big'
                // 中尺寸
                else resultClass = 'mid'
            }

            // 已选中
            if (this.selected.indexOf(content) >= 0) resultClass += ' selected'
            // 选中了 以上都不是 置灰
            if (this.cancelSelected) resultClass += ' unselected'

            return resultClass
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/exam/selftest';

.footer {
    transition: transform 0.4s;

    &.hide {
        transform: translate3d(0, 100%, 0);
    }
    &.show {
        transform: translate3d(0, 0, 0);
    }
}

.select-item {
    transition: background 0.15s, color 0.15s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    touch-action: none;

    -webkit-tap-highlight-color: transparent;
}
</style>
