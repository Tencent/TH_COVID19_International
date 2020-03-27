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
export const popWinConfig = {
    dataFromDesc: {
        title: 'Data Explanations',
        content: ['数据说明描述']
    },
    suspectDesc: {
        show: true,
        isLink: false,
        link: {
            desc: '',
            url: ''
        },
        title: 'Data Explanations',
        content: ['数据使用国家卫健委公布的“新增疑似病例数”。']
    },
    nowConfirmDesc: {
        show: true,
        isLink: false,
        link: {
            desc: '',
            url: ''
        },
        title: 'Data Explanations',
        content: ['全国现有确诊（包含港澳台）：该数据取当前全国的累计确诊数减去累计治愈和累计死亡数。']
    },
    microTrendDesc: {
        title: 'Data Explanations',
        content: ['数据说明描述']
    },
    heavyRateDesc: {
        title: 'Data Explanations',
        content: ['重症率：当前国家卫健委公布的因感染新型冠状病毒确诊的病例中，在治重症病例数量占在治病例总数量的比例']
    },
    deadRateDesc: {
        title: 'Data Explanations',
        content: ['病死率：当前国家卫健委公布的因感染新型冠状病毒死亡的病例数量占总确诊病例的比例，说明疾病的严重程度']
    },
    addConfirmDesc: {
        show: false,
        isLink: false,
        link: {
            desc: '点击查看详细解读',
            url: 'https://h5.baike.qq.com/mobile/article.html?docid'
        },
        title: 'Data Explanations',
        content: ['湖北部分城市存在核减，湖北省新增确诊数小于武汉市新增确诊数']
    },
    areaDetailDesc: {
        show: false,
        isLink: false,
        link: {
            desc: '点击查看详细解读',
            url: 'https://h5.baike.qq.com/mobile/article.html?docid'
        },
        title: 'Data Explanations',
        content: ['湖北部分城市存在核减，湖北省新增确诊数小于武汉市新增确诊数']
    },
    addConfirmCaseDesc: {
        show: false,
        isLink: false,
        link: {
            desc: '点击查看详细解读',
            url: 'https://h5.baike.qq.com/mobile/article.html?docid'
        },
        title: 'Data Explanations',
        content: ['湖北部分城市存在核减，湖北省新增确诊数小于武汉市新增确诊数']
    },
    otherSuspectDesc: {
        title: 'Data Explanations',
        content: [
            '现有疑似：使用今日国家卫健委公布的全国现有疑似减去今日湖北省卫健委公布的现有疑似',
            '新增疑似：使用今日国家卫健委公布的全国新增疑似减去湖北省的新增疑似',
            '该数据需国家卫健委和湖北省卫健委都公布数据后更新。'
        ]
    }
}
