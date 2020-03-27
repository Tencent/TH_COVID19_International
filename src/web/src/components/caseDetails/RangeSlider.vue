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
    <div class="custom-range-slider">
        <vue-slider
            v-model="sliderValues"
            :marks="vueSliderMarks"
            :adsorb="true"
            :min-range="5"
            :max="102"
            :dotSize="30"
            :tooltip="'always'"
            :tooltip-formatter="tooltipFormatter"
            :tooltipStyle="tooltipStyle"
            :enable-cross="false"
        >
            <template v-slot:step>
                <div></div>
            </template>
            <template v-slot:dot>
                <div class="choice-dot"></div>
                <!-- <div :class="['custom-dot', { focus }]"></div> -->
            </template>
        </vue-slider>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
    components: {
        VueSlider
    },
    props: {
        value: {
            type: Array,
            default () {
                return [0, 100]
            }
        }
    },
    computed: {
        // 当前slider
        sliderValues: {
            get () {
                return this.value.slice(0)
            },
            set (values) {
                this.$emit('input', values)
            }
        }
    },
    data () {
        return {
            // vueSliderValue: [0, 50],
            vueSliderMarks: [0, 20, 40, 60, 80, 100],
            // tooltipa文案配置
            tooltipFormatter: (v) => {
                return v > 100 ? '>100' : v
            },
            // tooltip样式配置
            tooltipStyle: {
                padding: '4px 7px',
                fontSize: '12px',
                color: '#de5e5b',
                background: '#fff',
                border: '1px solid #dfdfdf',
                boxShadow: '0 2px 14px 0 rgba(0,0,0,0.05)'
            }
        }
    },
    // methods: {
    //     //
    // },
    mounted () {
        const dots = document.querySelectorAll('.vue-slider-dot')
        // console.log(dots)
        if (dots.length < 2) {
            return
        }
        const defaultZIndex = getComputedStyle(dots[0]).zIndex || 0
        // console.log(defaultZIndex)
        const bringDotToTop = (e) => {
            const currentTarget = e.currentTarget
            if (currentTarget.style.zIndex > defaultZIndex) {
                return
            }
            dots.forEach((dot) => {
                if (dot === currentTarget) {
                    return
                }
                dot.style.zIndex = defaultZIndex
                // console.log('defaultZIndex', defaultZIndex)
            })
            currentTarget.style.zIndex = defaultZIndex + 1
            // console.log(currentTarget.style.zIndex)
        }

        dots.forEach((dot) => {
            dot.addEventListener('touchstart', bringDotToTop)
        })
    }
}
</script>

<style lang="scss">
@import '~Styles/views/disease/range-slider';
</style>
