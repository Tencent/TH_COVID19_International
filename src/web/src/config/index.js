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
import { getEnv } from '@/utils'

let env = getEnv()
const baseURLMap = {
    development: 'https://ehcard-test.wecity.qq.com',
    pre: 'https://ehcard-test.wecity.qq.com',
    production: 'https://wechat.wecity.qq.com'
}
export const baseURL = baseURLMap[env]

export const LOCALE = 'en'
