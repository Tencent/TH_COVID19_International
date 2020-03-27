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
import Vue from 'vue'
import Toast from './Toast.vue'

const ToastConstructor = Vue.extend(Toast)

let toastInstance = null
function toast ({ type, message, showTime, title = '' }) {
    if (toastInstance === null) {
        toastInstance = new ToastConstructor()
    }
    const prom = new Promise((resolve) => {
        toastInstance.type = type
        toastInstance.message = message
        toastInstance.resolve = resolve
        toastInstance.showTime = showTime
        toastInstance.title = title
        if (!toastInstance.isMounted) {
            const dom = document.createElement('div')
            document.querySelector('body').appendChild(dom)
            toastInstance.$mount(dom)
        }
        toastInstance.show()
    })
    toastInstance.prom = prom
    return toastInstance
}

function successToast ({ message = '已完成', showTime = 3000 } = {}) {
    return toast({ type: 'success', message, showTime })
}

function loadingToast ({ message = '加载中', showTime = null } = {}) {
    return toast({ type: 'loading', message, showTime })
}

function networkErrorToast ({ message = '当前无网络，请检查网络后再试', showTime = 3000 } = {}) {
    return toast({ type: 'network', message, showTime })
}

export { toast, successToast, loadingToast, networkErrorToast }
