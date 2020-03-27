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
@import '~styles/views/disease/nearby-selector';
</style>

<template>
    <div class="container nearby-selector-wrap">
        <div class="selector-box" :class="{ close: isClose }">
            <div class="selector-header">
                <div class="title">请选择地区</div>
                <div class="btn-close" @click="handleCancelChoose"></div>
            </div>
            <div class="select-tip-wrap" v-if="!disableTip">
                <span>当前已支持查看{{ cityCount }}个城市的口罩预约信息，更多城市解锁中</span>
            </div>
            <div class="selector-tab">
                <!-- <div class="btn-tab-item active"><span>广东</span></div> -->
                <div
                    class="btn-tab-item"
                    :class="{ active: currentTabIndex === tabIndex, unable: !isClickable(tabIndex) }"
                    @click="handleTableChange(tabItem, tabIndex)"
                    v-for="(tabItem, tabIndex) in tab"
                    :key="tabIndex"
                >
                    <span>{{ tabItem.label }}</span>
                </div>
            </div>
            <!-- {{currentTabIndex}}{{content1}}{{areaList.length}}{{tab}} -->
            <div class="selector-content" v-if="currentTabIndex === 0">
                <div
                    class="place"
                    :class="{ active: content1Index === item.id }"
                    @click="handleChoose(item, 1)"
                    v-for="(item, index) in content1"
                    :key="index"
                >
                    {{ item.label }}
                </div>
            </div>
            <div class="selector-content" v-if="currentTabIndex === 1">
                <div
                    class="place"
                    :class="{ active: content2Index === item.id }"
                    @click="handleChoose(item, 2)"
                    v-for="(item, index) in content2"
                    :key="index"
                >
                    {{ item.label }}
                </div>
            </div>
            <!-- <div class="selector-content" v-if="currentTabIndex === 2">
        <div class="col"></div>
        <div
          :style="item.label === '全部行政区' ? 'order: -1;flex-basis: 120px;' : ''"
          class="place"
          :class="{ active: content3Index === item.id }"
          @click="handleChoose(item, 3)"
          v-for="(item, index) in content3"
          :key="index"
        >
          {{ item.label }}
        </div>
      </div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'RectangleChoices',
    props: {
        // 选中的选项面包屑的默认配置
        tab: {
            type: Array,
            default: function () {
                return [
                    // {
                    //   label: '省份',
                    //   id: -1
                    // },
                    // {
                    //   label: '城市',
                    //   id: -1
                    // },
                    // {
                    //   label: '区/县',
                    //   id: -1
                    // }
                ]
            }
        },
        // 获取的省市区的列表
        areaList: {
            type: Array,
            default: function () {
                return [
                    // {
                    //   label: '省份',
                    //   id: 0
                    // },
                    // {
                    //   label: '城市',
                    //   id: 0
                    // },
                    // {
                    //   label: '区/县',
                    //   id: 0
                    // }
                ]
            }
        },
        // 是否展示组件
        show: {
            type: Boolean,
            default: true
        },
        // 根据地理位置获取到的默认地区
        areaInfo: {
            type: [Object, null],
            default: function () {
                return null
            }
        },
        disableTip: Boolean
    },
    computed: {
        cityCount () {
            let res = 0
            this.areaList.map((v) => {
                res += v.children.length
            })
            // console.log('computed', res)
            return res
        }
    },
    data () {
        return {
            // cityCount: 'n',
            isClose: false,
            // 高亮的面包屑
            currentTabIndex: 0,
            // 第一级选中的选项的ID
            content1Index: 0,
            // 第二级选中的选项的ID
            content2Index: 0,
            // 第三级选中的选项的ID
            content3Index: 0,
            // 第一级选项
            content1: [],
            // 第二级选项
            content2: [],
            // 第三级选项
            content3: []
        }
    },
    methods: {
        // 处理tab选择变化
        handleTableChange (item, idx) {
            // console.log(777, this.isClickable(idx))
            if (this.isClickable(idx)) {
                this.currentTabIndex = idx
            }
        },
        // 根据是否已经选择过区域来确定是否可以点面包屑对应部分（比如选择了省，没选市的情况下是不准选区县的）
        isClickable (index) {
            if (!index) return true
            if (index && this[`content${index + 1}`].length) return true
            return false
        },
        // 处理点击了右上角关闭时间
        handleCancelChoose () {
            this.isClose = true
            this.$emit('choice-cancel')
        },
        // 处理点击选择了省市区,item是点击的对象，type是选项的级别，省份表示1级，城市表示2级…; 是否发出选择完毕的时间
        handleChoose (item, type, sendOver = true) {
            console.log('item', item)
            // 通知外部组件选项发生变化
            this.$emit('choice-change', {
                type,
                item
            })
            // 改变组件内的记录状态
            if (type === 1) {
                this.content1Index = item.id
                this.content2Index = ''
                this.content3Index = ''
                this.content2 = item.children
                this.content3 = []
                this.currentTabIndex = 1
            } else if (type === 2) {
                this.content2Index = item.id
                this.content3Index = ''
                this.content3 = item.children
                this.currentTabIndex = 2
                if (sendOver) {
                    this.isClose = true
                    this.$emit('choice-choosed-over')
                }
            }
        },
        // 获取选中的选项的下一级,即他的children
        getSelectedChildren (list, id) {
            let tab = list.filter((v) => v.id === id)
            // console.log(22222, tab, id)
            if (tab.length > 1) {
                throw new Error('data error')
            }
            tab = tab[0]
            return (tab && tab.children) || []
        },
        // 根据条件筛选选项
        getSelectedChoice (list, key, value, signle = true) {
            let tab = list.filter((v) => v[key] === value)
            // console.log(111, key, value, tab)
            if (signle) {
                if (tab.length > 1) {
                    throw new Error('data error')
                }
                return tab[0] || ''
            }
            return tab
        },
        // 设置各级选项及状态
        setContent (index, name, key, list) {
            this[`content${index}`] = list
            let currentTabIndex = index - 1
            if (name) {
                let selected = this.getSelectedChoice(this[`content${index}`], key, name)
                this[`content${index}Index`] = selected.id
                if (this[`content${index}Index`]) {
                    currentTabIndex = index
                    if (key === 'label') {
                        this.handleChoose(selected, index, index !== 2)
                    }
                }
            }
            this.currentTabIndex = currentTabIndex
        },
        // 获取第一级选项 若有初始值则设置, key表示寻找的那个值的key, name表示寻找的值
        getContent1 (name, key) {
            this.setContent(1, name, key, this.areaList)
        },
        // 获取第二级选项
        getContent2 (name, key) {
            this.setContent(2, name, key, this.getSelectedChildren(this.areaList, this.content1Index))
            this.currentTabIndex = 1
        },
        // 获取第三级选项
        getContent3 (name, key) {
            this.setContent(3, name, key, this.getSelectedChildren(this.content2, this.content2Index))
            this.currentTabIndex = 2
        },
        // 设置初始选中态: 如果传入位置，则高亮传入的
        setInitChoicesState () {
            let location = this.tab
            // 如果是默认获取到的地址，则需要根据省份名称设置选中项
            let searchKey = 'id'
            let fromMap = this.areaInfo && this.areaInfo.province
            if (fromMap) {
                searchKey = 'label'
            }
            console.log(location)
            if (fromMap || location.length === 2) {
                let province = fromMap || location[0][searchKey]
                this.getContent1(province, searchKey)
                if (province && this.currentTabIndex > 0) {
                    let city = fromMap ? this.areaInfo.city : location[1][searchKey]
                    console.log('###', this.areaInfo, city, searchKey)
                    this.getContent2(city, searchKey)
                    // if (city && this.currentTabIndex > 1) {
                    //   let district = fromMap ? this.areaInfo.district : location[2][searchKey]
                    //   this.getContent3(district, searchKey)
                    // }
                }
            }
            // console.log(1112222, this.content1, this.content2, this.content3, this.currentTabIndex)
        },
        // 初始化
        init () {
            this.setInitChoicesState()
        }
    },
    created () {
        this.init()
    },
    watch: {
        areaList (areaList) {
            console.log('areaList change:', areaList)
        }
    }
}
</script>
