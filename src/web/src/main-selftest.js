import Vue from 'vue'
import VueI18n from 'vue-i18n'
import 'lib-flexible' // 移动端适配
import App from './App.vue'
import router from './router/selftest'
import store from './store'
import { toast, successToast, loadingToast, networkErrorToast } from '@/components/Toast'
import logUtils from './utils/log_util'
import { baseURL, LOCALE } from './config'

window.Vue = Vue
Vue.prototype.$toast = toast
Vue.prototype.$successToast = successToast
Vue.prototype.$loadingToast = loadingToast
Vue.prototype.$networkErrorToast = networkErrorToast

Vue.config.productionTip = false

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: LOCALE || 'en',
    messages: {
        zh: require('./lang/zh'),
        en: require('./lang/en')
    }
})
Vue.prototype.$i18nt = (key) => i18n.t(key)

logUtils.init({
    baseURL,
    logBizId: 'tencent_health_h5',
    statFilename: 'th_covid19_international_web'
})
Vue.mixin(logUtils.mixin)
Vue.prototype.reportStatLog = function (obj = {}) {
    if (!obj.channel) {
        obj.channel = Vue.prototype.channel
    }
    if (!obj.path && this.$route) {
        obj.path = this.$route.path
    }
    logUtils.reportStatLog(obj)
}

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
