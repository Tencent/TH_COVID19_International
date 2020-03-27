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
@import '~styles/views/disease/casedetail/search-popbox.scss';
</style>
<template>
    <div class="age-line" ref="sliderTrack">
        <div class="choice-dot" :style="choiceDotStyle" ref="sliderHandler"></div>
        <div class="age-index">
            <div class="unit" v-for="num in nums" :key="num">{{ num }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0
        },
        nums: {
            type: Array,
            // 默认设置几个尺度
            default () {
                return [0, 20, 40, 60, 80, 100]
            }
        }
    },
    data () {
        return {
            // changeValue计时器
            timer: null
        }
    },
    methods: {
        // 当值修改的时候，通知父组件
        changeValue (val) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.$emit('input', val)
            }, 200)
        },
        // 处理slider事件
        handleSlider () {
            const that = this
            let sliderHandler = this.$refs.sliderHandler
            let sliderTrack = this.$refs.sliderTrack
            let totalLen = sliderTrack.offsetWidth

            let startLeft = 0
            let startX = 0
            // 监听手指点击事件
            sliderHandler.addEventListener('touchstart', function (e) {
                startLeft = parseInt(sliderHandler.offsetLeft)
                startX = e.changedTouches[0].clientX
            })
            // 监听手指移动事件
            sliderHandler.addEventListener('touchmove', function (e) {
                // console.log(e)
                e.preventDefault()
                let dist = startLeft + e.changedTouches[0].clientX - startX
                let percent

                dist =
                    dist < 0
                        ? 0
                        : dist > totalLen - sliderHandler.offsetWidth
                            ? totalLen - sliderHandler.offsetWidth
                            : dist

                percent = parseInt((dist / (totalLen - sliderHandler.offsetWidth)) * 100)
                // console.log(percent)

                let sliderHandlerWidthPercent = parseInt((sliderHandler.offsetWidth / totalLen) * 100)
                let sliderHandlerLeft
                if (percent >= 100 - sliderHandlerWidthPercent) {
                    sliderHandlerLeft = 100 - sliderHandlerWidthPercent
                } else {
                    sliderHandlerLeft = percent
                }
                if (sliderHandlerLeft <= 0) {
                    sliderHandlerLeft = 0
                }
                sliderHandler.style.left = `${sliderHandlerLeft}%`
                that.changeValue(percent)
                // console.log('sliderValue: ', percent)
            })
        }
    },
    computed: {
        // 圆点的定位
        choiceDotStyle () {
            const percentage = this.value + '%'
            return {
                left: percentage // '20%'
            }
        }
    },
    mounted () {
        this.handleSlider()
    }
}
</script>
