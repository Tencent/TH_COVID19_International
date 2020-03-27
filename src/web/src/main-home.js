import Vue from 'vue'
import 'lib-flexible' // 移动端适配
import App from './App.vue'
import router from './router/home'
import store from './store'
import { toast, successToast, loadingToast, networkErrorToast } from '@/components/Toast'
import VueI18n from 'vue-i18n'
import logUtils from './utils/log_util'
import { baseURL, LOCALE } from './config'

import infiniteScroll from 'vue-infinite-scroll'

if (/debug/.test(window.location.search)) {
    import('vconsole/dist/vconsole.min.js').then(({ default: vconsole }) => {
        new vconsole()
    })
}

Vue.use(infiniteScroll)

Vue.prototype.$toast = toast
Vue.prototype.$successToast = successToast
Vue.prototype.$loadingToast = loadingToast
Vue.prototype.$networkErrorToast = networkErrorToast

Vue.prototype.$getRouteKeepQuery = (routeQuery) => {
    const keepList = ['channel']
    let keepQuery = {}
    keepList.forEach((item) => {
        if (routeQuery[item]) {
            keepQuery[item] = routeQuery[item]
        }
    })
    return keepQuery
}
Vue.config.productionTip = false

logUtils.init({
    baseURL,
    logBizId: 'tencent_health_h5',
    statFilename: 'th_covid19_international_web'
})
Vue.prototype.reportStatLog = function (obj = {}) {
    if (!obj.channel) {
        obj.channel = Vue.prototype.channel
    }
    if (!obj.path && this.$route) {
        obj.path = this.$route.path
    }
    logUtils.reportStatLog(obj)
}
window.Vue = Vue
Vue.mixin(logUtils.mixin)

Vue.filter('jsonStringify', function (json) {
    try {
        let str = JSON.stringify(json)
        return str
    } catch (e) {
        console.log(e)
        return ''
    }
})

Vue.use(VueI18n) // this.$i18n.locale
const i18n = new VueI18n({
    locale: LOCALE || 'en',
    messages: {
        zh: require('./lang/zh'),
        en: require('./lang/en')
    }
})
Vue.prototype.$i18nt = (key) => i18n.t(key)

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
}).$mount('#app')
