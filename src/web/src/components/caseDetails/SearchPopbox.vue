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
    <div class="search-pop-box-wrap" ref="searchPopBoxWrap">
        <!-- 年龄范围 -->
        <div class="search-item">
            <div class="item-title">年龄范围</div>
            <RangeSlider class="age-range-slider" v-model="ageRange"></RangeSlider>
        </div>
        <!-- 性别 -->
        <div class="search-item">
            <div class="item-title">性别</div>
            <div class="box-wrap">
                <div
                    v-for="item in genderOptions"
                    :key="item.value"
                    class="box"
                    :class="{ active: isOptionSelected('genders', item.value) }"
                    @click="toggleFieldValue('genders', item.value)"
                >
                    {{ item.label }}
                </div>
            </div>
        </div>
        <!-- 居住地 -->
        <div class="search-item">
            <div class="item-title">居住地</div>
            <div class="box-wrap">
                <div
                    v-for="item in residenceEnumOptions"
                    :key="item.value"
                    class="box"
                    :class="{ active: isOptionSelected('residenceEnums', item.value) }"
                    @click="toggleFieldValue('residenceEnums', item.value)"
                >
                    {{ item.label }}
                </div>
            </div>
        </div>
        <!-- 日期筛选 -->
        <div class="search-item">
            <div class="data-search-wrap data-select-box-wrap">
                <div class="data-item select-box-wrap">
                    <div class="item-title">发病日期</div>
                    <div class="select-box">
                        <div class="custom-control" @click="pickDate('startSickTime')">
                            {{ form['startSickTime'] || '开始时间' }}
                        </div>
                        <div class="custom-control" @click="pickDate('endSickTime')">
                            {{ form['endSickTime'] || '结束时间' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search-item">
            <div class="data-search-wrap data-select-box-wrap">
                <div class="data-item select-box-wrap">
                    <div class="item-title">入院日期</div>
                    <div class="select-box">
                        <div class="custom-control" @click="pickDate('startInHospTime')">
                            {{ form['startInHospTime'] || '开始时间' }}
                        </div>
                        <div class="custom-control" @click="pickDate('endInHospTime')">
                            {{ form['endInHospTime'] || '结束时间' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 病情症状 -->
        <div class="search-item">
            <div class="item-title">病情症状</div>
            <div class="box-wrap">
                <div
                    v-for="item in symptomOptions"
                    :key="item.value"
                    class="box"
                    :class="{ active: isOptionSelected('symptoms', item.value) }"
                    @click="toggleFieldValue('symptoms', item.value)"
                >
                    {{ item.label }}
                </div>
            </div>
        </div>
        <!-- 病情情况 -->
        <!-- <div class="search-item">
            <div class="item-title">病情情况</div>
            <div class="box-wrap">
                <div v-for="item in illStateOptions"
                  :key="item.value"
                  class="box"
                  :class="{active: isOptionSelected('illState', item.value)}"
                  @click="toggleFieldValue('illState', item.value)">{{item.label}}</div>
            </div>
        </div> -->
        <!-- 驻底按钮 -->
        <div class="footer-warp" v-if="footerVisible">
            <div class="footer-btn" @click="onResetClick"><span>重置</span></div>
            <div class="footer-btn primary" @click="onConfirmClick"><span>确定</span></div>
        </div>
    </div>
</template>

<script>
import RangeSlider from './RangeSlider'
import datePicker from '@/components/datePicker/datePicker'

export default {
    name: 'SearchPopbox',
    components: {
        RangeSlider
    },
    props: {
        dataMap: {
            type: Object,
            default () {
                return {}
            }
        },
        data: {
            type: Object,
            default () {
                return {
                    genders: [],
                    residenceEnums: []
                }
            }
        }
    },
    data () {
        return {
            form: {},
            datePicker: null,
            // selectedAge: 0,
            // ageRange: [0, 100],
            ageList: [0, 20, 40, 60, 80, 100],
            scrollTop: 0,
            originalPostion: 'static',
            footerVisible: true
        }
    },
    computed: {
        // 年龄选项
        ageRange: {
            get () {
                return [this.form.minAge, this.form.maxAge]
            },
            set (values) {
                this.form.minAge = values[0]
                this.form.maxAge = values[1]
            }
        },
        // 性别选择器
        genderOptions () {
            return this.getFieldOptions('genders')
        },
        //病症状况器
        symptomOptions () {
            return this.getFieldOptions('symptom')
        },
        // illStateOptions () {
        //   return this.getFieldOptions('illState')
        // },
        // 居住地选择器
        residenceEnumOptions () {
            return this.getFieldOptions('residenceEnums')
        }
    },
    methods: {
        // 鼠标移动失效
        disableTouchMove (e) {
            e.preventDefault()
        },
        // 页面滚动失效
        disablePageScroll () {
            try {
                const body = document.querySelector('body')
                body.style.width = '100%'
                this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                this.originalPostion = getComputedStyle(body).position
                body.style.position = 'fixed'
                body.style.top = -this.scrollTop + 'px'
                body.addEventListener('touchmove', this.disableTouchMove, { passive: false })
            } catch (e) {
                console.log(e)
            }
        },
        // 页面滚动有效
        enablePageScroll () {
            const body = document.querySelector('body')
            body.style.position = this.originalPostion
            body.scrollTop = this.scrollTop
            if (document.documentElement) {
                document.documentElement.scrollTop = this.scrollTop
            }
            body.removeEventListener('touchmove', this.disableTouchMove)
        },
        // 格式化时期
        formatDateForPicker (date) {
            return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        },
        // 返回格式2019-01-01 => [y, m, d]
        getYMDForPicker (str) {
            const ymd = str.split('-')
            return [+ymd[0], ymd[1], +ymd[2]]
        },
        // 一个星期以后的日期
        getOneWeekAgoDate (date) {
            const minDate = new Date(2019, 0, 1)
            let res = new Date(date.getTime() - 6 * 24 * 3600 * 1000)
            if (res < minDate) {
                res = minDate
            }
            return res
        },
        // 2019-01-01 => [y, m, d]
        getDateFromStr (str) {
            const [y, m, d] = this.getYMDForPicker(str)
            return new Date(y, m - 1, d)
        },
        // 获取默认值和无效的方法
        getDefaultValueAndDisableFunc (field) {
            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            let minDate
            let maxDate = today
            let defaultDate = today
            let fieldVal = this.form[field]

            switch (field) {
            case 'startSickTime': {
                const endSickTime = this.form.endSickTime
                if (endSickTime) {
                    maxDate = this.getDateFromStr(endSickTime)
                }
                defaultDate = this.getOneWeekAgoDate(maxDate < today ? maxDate : today)
                break
            }
            case 'startInHospTime': {
                const endInHospTime = this.form.endInHospTime
                if (endInHospTime) {
                    maxDate = this.getDateFromStr(endInHospTime)
                }
                defaultDate = this.getOneWeekAgoDate(maxDate < today ? maxDate : today)
                break
            }
            case 'endSickTime': {
                const startSickTime = this.form.startSickTime
                if (startSickTime) {
                    minDate = this.getDateFromStr(startSickTime)
                }
                break
            }
            case 'endInHospTime': {
                const startInHospTime = this.form.startInHospTime
                if (startInHospTime) {
                    minDate = this.getDateFromStr(startInHospTime)
                }
                break
            }
            default:
                maxDate = today
                break
            }

            const disableFunc = ([year, month, day]) => {
                const selectedDate = new Date(year, month - 1, day)
                if (minDate && selectedDate < minDate) {
                    return true
                }
                if (maxDate && selectedDate > maxDate) {
                    return true
                }
                return false
            }

            const defaultValue = fieldVal ? this.getYMDForPicker(fieldVal) : this.formatDateForPicker(defaultDate)
            // console.log(defaultValue)
            return [disableFunc, defaultValue]
        },
        // 选择日期
        pickDate (field) {
            const defaultValueAndDisableFunc = this.getDefaultValueAndDisableFunc(field)
            const disableFunc = defaultValueAndDisableFunc[0]
            const defaultValue = defaultValueAndDisableFunc[1]
            this.disablePageScroll()
            // 日期选择组件配置
            this.showDatePicker({
                // 防止复用，导致初始值无效
                id: 'picker_' + field + Math.random(),
                defaultValue,
                disable: disableFunc,
                /**
                 * @param {array} result
                 */
                onConfirm: (result) => {
                    // console.log(result)
                    this.enablePageScroll()
                    const y = result[0]
                    let m = result[1]
                    let d = result[2]
                    if (m < 10) {
                        m = '0' + m
                    }
                    if (d < 10) {
                        d = '0' + d
                    }
                    const val = `${y}-${m}-${d}`
                    this.setFieldValue(field, val)
                },
                onClose: () => {
                    this.enablePageScroll()
                }
            })
        },
        // 区选择器
        getFieldOptions (field) {
            // gender symptom illState
            return this.dataMap[field] || []
        },
        // 是不是选择器的判断
        isOptionSelected (field, val) {
            const fieldVal = this.form[field]
            if (Array.isArray(fieldVal)) {
                return fieldVal.includes(val)
            } else {
                return fieldVal === val
            }
        },
        // 重置
        resetFieldValue (field) {
            this.$emit('resetField', field)
        },
        toggleFieldValue (field, val) {
            let fieldVal = this.form[field]
            if (fieldVal === val) {
                this.resetFieldValue(field)
            } else if (Array.isArray(fieldVal)) {
                const index = fieldVal.indexOf(val)
                if (index === -1) {
                    fieldVal.push(val)
                } else {
                    fieldVal.splice(index, 1)
                }
            } else {
                this.setFieldValue(field, val)
            }
        },
        // 给表单域赋值
        setFieldValue (field, val) {
            this.form[field] = val
        },
        // 重置点击事件
        onResetClick () {
            this.$emit('reset')
        },
        // 确认事件
        onConfirmClick () {
            this.$emit('confirm', this.form)
        },
        // 显示日期选择器
        showDatePicker (options) {
            const date = new Date()
            const year = date.getFullYear()
            const defaultValue = options.defaultValue || this.formatDateForPicker(date)
            const opts = Object.assign(
                {
                    // 起始时间
                    start: 2019,
                    // 结束时间
                    end: year > 2020 ? year : 2020,
                    defaultValue,
                    // onChange: (result) => {
                    // },
                    onConfirm: (result) => {
                        // console.log('result', result)
                    },
                    className: 'search-popbox-date-picker'
                },
                options
            )
            this.datePicker = datePicker(opts)
        },
        // 监听窗口滚动
        onWindowSroll () {
            const element = this.$refs.searchPopBoxWrap
            const posObj = element.getBoundingClientRect(element)
            if (posObj.top > window.innerHeight - 50) {
                this.footerVisible = false
            } else {
                this.footerVisible = true
            }
        },
        // 绑定窗口滚动事件
        bindWindowScrollEvent () {
            window.addEventListener('scroll', this.onWindowSroll)
        },
        // 移除窗口绑定事件的监听
        unBindWindowScrollEvent () {
            window.removeEventListener('scroll', this.onWindowSroll)
        }
    },
    mounted () {
        this.bindWindowScrollEvent()
    },
    // 组件销毁前须隐藏选择器
    // 组件销毁前须移除窗口绑定事件的监听
    beforeDestroy () {
        if (this.datePicker) {
            this.datePicker.hide()
        }
        this.unBindWindowScrollEvent()
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler (newVal, oldVal) {
                this.form = JSON.parse(JSON.stringify(newVal))
                this.bindWindowScrollEvent()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~styles/views/disease/casedetail/search-popbox.scss';
.age-range-slider {
    margin: 30px 0 20px;
    padding: 0 20px;
}
.search-pop-box-wrap {
    &,
    * {
        -webkit-touch-callout: none; /*系统默认菜单被禁用*/
        -webkit-user-select: none; /*webkit浏览器*/
        -khtml-user-select: none; /*早期浏览器*/
        -moz-user-select: none; /*火狐*/
        -ms-user-select: none; /*IE10*/
        user-select: none;
    }
}
</style>

<style lang="scss">
.search-popbox-date-picker .weui-half-screen-dialog__ft {
    .weui-btn {
        background: #00bad1;
        color: #fff;
    }
    .weui-btn_primary:not(.weui-btn_disabled):active {
        background: rgba($color: #00bad1, $alpha: 0.8);
        color: #fff;
    }
}
</style>
