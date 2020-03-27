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
    <div class="container">
        <!-- 题目出现：select-wrapper slideIn  -->
        <!-- 题目消失：select-wrapper slideOut  -->
        <div class="select-wrapper" v-for="(item, index) in qa" :key="index">
            <p class="title">{{ item.desc }}</p>
            <div class="select-box">
                <label class="select-item" v-for="(subItem, i) in item.answers" :key="i" :for="[item.id + subItem.id]">
                    <template v-if="item.multi">
                        <div @click.prevent="choose(item, subItem, item.multi)">
                            <input
                                class="select-box-input"
                                type="checkbox"
                                :id="[item.id + subItem.id]"
                                :value="subItem.id"
                                :checked="selected[item.id].indexOf(subItem.id) > -1"
                            />
                            <span class="select-box-txt">{{ subItem.desc }}</span>
                            <i class="icon-right-check"></i>
                        </div>
                    </template>
                    <template v-else>
                        <input
                            class="select-box-input"
                            type="radio"
                            :id="[item.id + subItem.id]"
                            :value="subItem.id"
                            v-model="selected[item.id]"
                        />
                        <span class="select-box-txt">{{ subItem.desc }}</span>
                        <i class="icon-right-check"></i>
                    </template>
                </label>
            </div>
        </div>
        <div class="footbar-btn-area">
            <span class="footbar-btn" @click="next" :class="[isComplete ? '' : 'disabled']">下一步</span>
        </div>
    </div>
</template>
<script>
// PENDING
// 新冠肺炎症状自查
// 该功能正在建设中
// 相关功能代码暂时保留

// 新冠肺炎症状自查问答配置
import qaConfig from '@/config/qaConfig'
export default {
    name: 'checkSelf',
    data () {
        return {
            /*
                [{
                    id: '1',
                    desc: '您是否出现过以下不适症状（单选）：',
                    multi: false, // 是否多选
                    answers: [
                        {
                            id: 'a',
                            desc: '发热、乏力、咳嗽、咽痛、干咳，病情持续时间不超过1天'
                        },
                        {
                            id: 'b',
                            desc: '发热、乏力、咳嗽、咽痛、干咳，且在家观察1-2天后病情无好转或加重'
                        },
                        {
                            id: 'c',
                            desc: '以上都没有'
                        }
                    ]
                },
                ...
                ]
             */
            qa: qaConfig,
            selected: {},
            isComplete: false
        }
    },
    watch: {
        // 完成状态更新
        selected: {
            handler (newVal, oldVal) {
                let counts = 0
                for (let i = 0; i < this.qa.length; i++) {
                    if (this.selected[this.qa[i].id].length === 0) {
                        counts--
                    } else {
                        counts++
                    }
                }
                this.isComplete = counts === this.qa.length
            },
            deep: true
        }
    },
    created () {
        document.title = '新冠肺炎症状自查'
        this.initData()
    },
    // mounted () {
    //     //
    // },
    methods: {
        initData () {
            let tempSelected = {}
            for (let i = 0; i < this.qa.length; i++) {
                if (this.qa[i].multi) {
                    tempSelected[this.qa[i].id] = []
                } else {
                    tempSelected[this.qa[i].id] = ''
                }
            }
            this.selected = tempSelected
            this.isComplete = false
        },
        choose (item, subItem, multi) {
            // 是否点击reset
            if (subItem.multiReset) {
                this.selected[item.id] = [subItem.id]
            } else {
                let multiResetId = ''
                for (let i = 0; i < item.answers.length; i++) {
                    if (item.answers[i].multiReset) {
                        multiResetId = item.answers[i].id
                    }
                }

                let multiResetIndex = this.selected[item.id].indexOf(multiResetId)
                if (multiResetId && multiResetIndex > -1) {
                    this.selected[item.id].splice(multiResetIndex, 1)
                    this.selected[item.id].push(subItem.id)
                } else {
                    let index = this.selected[item.id].indexOf(subItem.id)
                    if (index > -1) {
                        this.selected[item.id].splice(index, 1)
                    } else {
                        this.selected[item.id].push(subItem.id)
                    }
                }
            }
        },
        next () {
            if (!this.isComplete) return
            // this.reportStatLog({
            //     actionType: 'event',
            //     actionName: 'CheckSelf.toCheckSelfResult'
            // })
            let that = this
            // 处理数据
            Object.keys(that.selected).forEach(function (key) {
                if (typeof that.selected[key] === 'string') {
                    that.selected[key] = [that.selected[key]]
                }
            })
            sessionStorage.setItem('check_self_qa', JSON.stringify(that.selected))
            this.$router.push({
                name: 'CheckSelfResult',
                query: this.$route.query
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~styles/views/disease/doctors/index';
</style>
