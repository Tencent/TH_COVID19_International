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
let qaConfig = [
    {
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
    {
        id: '2',
        desc: '您是否出现以下情况（单选）：',
        multi: false, // 是否多选
        answers: [
            {
                id: 'a',
                desc: '体温<38℃，症状轻微，没有明显的气短、呼吸困难等症状'
            },
            {
                id: 'b',
                desc: '体温≥38℃，且持续发热、咽痛和咳嗽严重、呼吸困难'
            }
        ]
    },
    {
        id: '3',
        desc: '您是否属于以下人群（单选）：',
        multi: false, // 是否多选
        answers: [
            {
                id: 'a',
                desc: '老年人'
            },
            {
                id: 'b',
                desc: '孕妇'
            },
            {
                id: 'c',
                desc: '儿童'
            },
            {
                id: 'd',
                desc: '以上都不是'
            }
        ]
    },
    {
        id: '4',
        desc: '近期是否有以下经历（多选）：',
        multi: true, // 是否多选
        answers: [
            {
                id: 'a',
                desc: '有武汉旅行史、人员接触史'
            },
            {
                id: 'b',
                desc: '近距离接触过有发热、咳嗽症状的患者'
            },
            {
                id: 'c',
                desc: '去过人群密集的场所'
            },
            {
                id: 'd',
                desc: '有野生动物接触史'
            },
            {
                id: 'e',
                desc: '以上都没有',
                multiReset: true // 是否多选重置
            }
        ]
    },
    {
        id: '5',
        desc: '您是否符合以下情况（多选）：',
        multi: true, // 是否多选
        answers: [
            {
                id: 'a',
                desc: '有慢性肺部疾病等呼吸系统疾病'
            },
            {
                id: 'b',
                desc: '有心血管疾病、肝、肾脏等基础性疾病'
            },
            {
                id: 'c',
                desc: '免疫功能低下'
            },
            {
                id: 'd',
                desc: '肥胖'
            },
            {
                id: 'e',
                desc: '以上都没有',
                multiReset: true // 是否多选重置
            }
        ]
    }
]
export default qaConfig
