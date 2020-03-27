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
    <ve-line v-if="lineData.rows.length" :width="width" :height="height" :extend="extend" :data="lineData"> </ve-line>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import Merge from 'merge-dictionaries'
import { getExtend, generateRowsData } from '@/components/charts/EasyLine/index'

export default {
    name: 'EasyLine',
    components: { VeLine },
    props: {
        /**
         * @easyData
         * [[originData, originKey, targetKey, [column]], ...]
         */
        easyData: {
            type: Array,
            default: () => []
        },
        /**
         * @customConfigs
         * [fnkey1, fnkey2, ...]
         * custom fnkey defined in EXTEND_FN from '@/components/charts/EasyLine/index'
         */
        customConfigs: {
            type: Array,
            default: () => []
        },
        width: {
            type: String,
            default: `${window.innerWidth * 0.9}px`
        },
        height: {
            type: String,
            default: `${(window.innerWidth * 3) / 7}px`
        }
    },
    computed: {
        lineData () {
            let _axisKey = '_index'
            let columns = []
            let rows = []
            this.easyData.forEach(([originData, originKey, targetKey, axisKey]) => {
                if (axisKey) _axisKey = axisKey
                rows = generateRowsData(rows, originData, originKey, targetKey, _axisKey)
                columns.push(targetKey)
            })
            rows.forEach((item) => {
                for (let key in item) {
                    if (item[key] === -999999) {
                        delete item[key]
                    }
                }
            })
            columns.unshift(_axisKey)
            return { columns, rows }
        },
        extend () {
            let columns = this.lineData.columns
            let rows = this.lineData.rows
            let extend = getExtend('default', columns, rows)
            this.customConfigs.forEach((fnKey) => {
                extend = Merge(extend, getExtend(fnKey, columns, rows))
            })
            return extend
        }
    }
}
</script>
