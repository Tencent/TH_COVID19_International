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
import weui from 'weui.js'
import cron from './cron'
export default datePicker

function noop () {}

function datePicker (options) {
    const nowDate = new Date()

    const defaults = Object.assign(
        {
            id: 'datePicker',
            onChange: noop,
            onConfirm: noop,
            start: nowDate.getFullYear() - 20,
            end: nowDate.getFullYear() + 20,
            defaultValue: [nowDate.getFullYear(), nowDate.getMonth() + 1, nowDate.getDate()],
            cron: '* * *',
            disable (result) {
                return false
            }
        },
        options
    )

    // 兼容原来的 start、end 传 Number 的用法
    if (typeof defaults.start === 'number') {
        defaults.start = new Date(`${defaults.start}/01/01`)
    } else if (typeof defaults.start === 'string') {
        defaults.start = new Date(defaults.start.replace(/-/g, '/'))
    }
    if (typeof defaults.end === 'number') {
        defaults.end = new Date(`${defaults.end}/12/31`)
    } else if (typeof defaults.end === 'string') {
        defaults.end = new Date(defaults.end.replace(/-/g, '/'))
    }

    const findBy = (array, key, value) => {
        for (let i = 0, len = array.length; i < len; i++) {
            const obj = array[i]
            if (obj[key] == value) {
                return obj
            }
        }
    }

    const date = []
    const interval = cron.parse(defaults.cron, defaults.start, defaults.end)
    let obj
    do {
        obj = interval.next()

        const year = obj.value.getFullYear()
        const month = obj.value.getMonth() + 1
        const day = obj.value.getDate()
        if (defaults.disable) {
            if (defaults.disable([year, month, day])) {
                continue
            }
        }

        let Y = findBy(date, 'value', year)
        if (!Y) {
            Y = {
                label: year + '年',
                value: year,
                children: []
            }
            date.push(Y)
        }
        let M = findBy(Y.children, 'value', month)
        if (!M) {
            M = {
                label: month + '月',
                value: month,
                children: []
            }
            Y.children.push(M)
        }
        M.children.push({
            label: day + '日',
            value: day
            // disabled: defaults.disable([year, month, day])
        })
    } while (!obj.done)

    return weui.picker(date, defaults)
}
