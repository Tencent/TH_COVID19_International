import httpUtils from '@/api'
import { getQueryString } from '@/utils'
import { popWinConfig } from '@/config/popWinConfig'
import Vue from 'vue'
import merge from 'merge-dictionaries'

let remotePageConfigResolve = null
let remotePageConfigReject = null
const remotePageConfigPromise = new Promise((resolve, reject) => {
    remotePageConfigResolve = resolve
    remotePageConfigReject = reject
})

/**
 * @description 拉取远程配置并解析为 json
 * 为了防止配置的接口在配置项都是数组时进行合并，所有的数组都会以'__Array__[1,2,3]'的形式转成字符串，因此函数内会使用parser重新转义回来
 * 为了在恰当情况下调用鉴权的接口(腾讯健康下)
 */
async function fetchConfig () {
    const service = 'THCfgOuterServer'
    let rq = await httpUtils(
        'getCfg',
        { biz: 'lung-h5-cfg-v2', channel: getQueryString('channel') || '_default_channel_' },
        service,
        {
            channel: getQueryString('channel') || '_default_channel_'
        }
    )
    let parser = (k, v) => {
        // console.log(k,v,typeof v)
        if (typeof v === 'string' && v.indexOf('__Array__') === 0) {
            return JSON.parse(v.slice(9), parser)
        } else {
            return v
        }
    }
    return JSON.parse(rq.strCfg, parser)
}
export async function outerConfig (cb) {
    try {
        let data = await fetchConfig() // 拉取远程配置

        merge(pageConfig, data)
        remotePageConfigResolve() // resolve _remote
        console.log('Read Remote Config', data)
        return data
    } catch (e) {
        remotePageConfigReject(e)
        console.error(e)
        return {}
    }
}

/**
 * 建议:
 * 为了方便设置项的调整和使用，全局文案 / 全局功能开关 可以放在 wording / feature 属性下
 * 其他的渠道配置可以直接使用根属性
 */

export let pageConfig = Vue.observable({
    wording: {
        common: {
            dialog: popWinConfig
        },
        home: {
            tab1_title: 'COVID-19 Map',
            tab2_title: '疫情动态',
            tab2_1_title: 'Domestic',
            tab2_2_title: 'Overseas',
            tab3_title: '抗疫专区',
            broadcast_tips: 'New',
            china_broadcast_tips: 'New',
            abroad_broadcast_tips: 'New',
            third_banner: {
                knowledge: {}
            }
        }
    },
    feature: {
        bannerEntry: {},
        feiyanActivity: {
            AllowMapMode: true,
            AllowTapToMap: true
        },
        modifyTrend: {
            show: false,
            showConfirm: false,
            showSuspect: false,
            showHeal: false,
            showDead: false,
            showTips: false
        },
        home: {
            infoScrollBar: {
                barColor: '#ffffff',
                color: '#ffffff',
                numbers: 2,
                autoplay: true,
                showDate: true,
                showTime: true
            }
        },
        overseaMap: {
            show: false
        },
        moreTools: {
            bannerUrl: ''
        },
        mapTabs: {
            nowConfirm: true,
            totalConfirm: true,
            totalHeal: true
        },
        defaultMapTab: 'totalConfirm'
    },
    // 是否展示深度分析
    allowDeepAnalize: false,
    // 同小区头部 logo 配置
    logos: [],
    logos_desc: [],
    // 浮动的'更多工具' 工具条
    float_moreTools: true,
    // 同小区页面_疫情专区入口
    pneumoniaentrance: true,
    // 口罩专区 顶部banner logo
    helthMaskLogo: '',
    home_logos: [], // 首页logo配置
    isShowTab1: true,
    isShowTab2: true,
    isShowTab3: true,
    show_tab1_title_dot: false,
    show_tab2_1_title_dot: false,
    show_tab2_2_title_dot: false,
    show_tab3_title_dot: false,
    moreToolsFilter: ['1'],
    _remote: remotePageConfigPromise,
    toolKitFaceMaskApply: ['tool'],
    toolKitFeiYanActivity: ['tool', 'feedback'],
    toolKitMapLanding: ['tool'],
    toolKitFeiYanMap: ['tool'],
    toolKitPsychologyHotline: ['tool'],
    home_pills: [9, 8, 12],
    allowContactAndTollBox: true, // 工具箱/合作指引显示
    showToolsBanner: false // 工具箱banne
})
