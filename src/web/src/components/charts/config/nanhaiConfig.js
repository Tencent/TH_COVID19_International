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
const GDNH = {
    nowConfirm: {
        'gd500-hn0': 'https://static.wecity.qq.com/h5/2020-3/gd500-hn0-8da89e697f785a31298665a24a862472.jpg',
        'gd500-hn10': 'https://static.wecity.qq.com/h5/2020-2/gd500-hn100-8fa933d54920249af5e0ca30e440df39.jpg',
        'gd500-hn100': 'https://static.wecity.qq.com/h5/2020-2/gd500-hn100-8fa933d54920249af5e0ca30e440df39.jpg'
    },
    confirm: {
        'gd500-hn0': 'https://static.wecity.qq.com/h5/2020-3/gd500-hn0-8da89e697f785a31298665a24a862472.jpg',
        'gd500-hn10':
            'https://static.wecity.qq.com/h5/2020-2/小地图更新/gd500-hn10-7795bac127f2acd660ccc9fd4419c7c7.jpg',
        'gd500-hn100':
            'https://static.wecity.qq.com/h5/2020-2/小地图更新/gd500-hn100-96d37c482062cede1e0826cecd755bec.jpg',
        'gd500-hn500':
            'https://static.wecity.qq.com/h5/2020-2/小地图更新/gd500-hn500-2242b809b5b630592916dbdbde812055.jpg',
        'gd500-hn1000':
            'https://static.wecity.qq.com/h5/2020-2/小地图更新/gd500-hn1000-2e80ff37caca44dd45bde5c2964bc76c.jpg',
        'gd1000-hn10': '',
        'gd1000-hn100': 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn100-2b6eb28e2fac1fbea6a472d2c11b116c.jpg',
        'gd1000-hn500': 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn500-5b47738e8586e7f3de4e369c9f5b1512.jpg',
        'gd1000-hn1000': 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn1000-18c8f68f50cfdc3bdd0e2f44a9644e99.jpg'
    },
    heal: {
        'gd500-hn10': 'https://static.wecity.qq.com/h5/2020-2/gd500-hn10-83560b02dd794121785524433da6a4f4.jpg',
        'gd500-hn100': 'https://static.wecity.qq.com/h5/2020-2/gd500-hn100-8c660434075587d412ceec16dc781335.jpg',
        'gd500-hn500': 'https://static.wecity.qq.com/h5/2020-2/gd500-hn500-9c5b912692fd05a8a17c7e5107c1c081.jpg',
        'gd500-hn1000': 'https://static.wecity.qq.com/h5/2020-2/gd500-hn1000-44d84508223da439687a5b9f53680c63.jpg',
        'gd1000-hn10': 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn10-539f4170d06fa5358af829256ee53af1.jpg',
        'gd1000-hn100': 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn100-bc5beab6db33bb7026e6ad54e8ecb764.jpg',
        'gd1000-hn500': 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn500-5d1f9b344f9cc207fdd50398401102be.jpg',
        'gd1000-hn1000': 'https://static.wecity.qq.com/h5/2020-2/gd1000-hn1000-f486952c5f9bcedbaee0f0ccc4eb6fbc.jpg'
    }
}
/**
 *
 * @param {number} hainan
 * @param {number} guangdong
 * @description 这个函数只是根据海南、广东的感染人数切换不同的南海诸岛示意图（规避政治问题）
 */
export function pickNanHaiImg (hainan, guangdong = 1000, type = 'confirm') {
    if (hainan >= 0 && hainan < 100) {
        if (hainan === 0) {
            return GDNH[type]['gd500-hn0']
        }
        if (guangdong < 1000) {
            return GDNH[type]['gd500-hn10']
        } else {
            return GDNH[type]['gd1000-hn100']
        }
    } else if (hainan > 100 && hainan < 500) {
        if (guangdong < 1000) {
            return GDNH[type]['gd500-hn100']
        } else {
            return GDNH[type]['gd1000-hn100']
        }
    } else if (hainan > 500 && hainan < 1000) {
        if (guangdong < 1000) {
            return GDNH[type]['gd500-hn500']
        } else {
            return GDNH[type]['gd1000-hn500']
        }
    } else if (hainan > 1000) {
        if (guangdong < 1000) {
            return GDNH[type]['gd500-hn1000']
        } else {
            return GDNH[type]['gd1000-hn1000']
        }
    } else {
        // 兜底图片：
        return GDNH[type]['gd1000-hn100']
    }
}

export function createTooltipContent (params, labelMap, colors) {
    let ret = '<div>'
    const titleContent = params[0] ? params[0].name : new Date().getMonth() + 1 + '.' + new Date().getDate()
    const title = '<div style="color: #888888; line-height: 20px">' + titleContent + '</div>'
    ret += title

    params.forEach(function (parm, index) {
        const color = colors[index] || '#333'
        const label = parm && parm.seriesName ? labelMap[parm.seriesName] : ''
        const value = parm && parm.value && parm.value[1] !== null ? parm.value[1] : 'TO Be Updated'
        const row = `
        <div style="line-height: 20px;">
            <div style="display:inline-block; vertical-align: middle;background: ${color}; width: 4px;
                height: 4px; border-radius: 50%; margin-right: 10px ">
            </div>
            <div style="display:inline-block; vertical-align: middle; line-height: 20px; ">
                ${label}:  <span style="color: ${color}">${value}</span>
            </div>
        </div>
        `
        ret += row
    })

    ret += '</div>'

    return ret
}

export function generateRowsData (rows = [], originData = [], originKey, targetKey) {
    let rowsObj = {}
    rows.forEach((item) => {
        rowsObj[item.day] = item
    })
    originData.forEach((item, index) => {
        if (rowsObj[item.day]) {
            rowsObj[item.day][targetKey] = item[originKey]
        } else {
            rowsObj[item.day] = { day: item.day }
            rowsObj[item.day][targetKey] = item[originKey]
        }
    })
    rows = Object.values(rowsObj)
    rows.sort((a, b) => a.day - b.day)
    return rows
}
