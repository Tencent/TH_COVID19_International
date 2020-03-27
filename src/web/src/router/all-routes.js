function keepQuery (to, from, queryList = []) {
    let query = null
    queryList.forEach((key) => {
        if (from.query[key] && !to.query[key]) {
            if (!query) {
                query = {}
            }
            query[key] = from.query[key]
        }
    })
    return query
}

const allRoutes = {
    index: [
        {
            // 首页
            path: '/',
            name: 'home',
            alias: ['/homev2', '/index'],
            component: () => import('../views/HomeV2.vue'),
            async beforeEnter (to, from, next) {
                document.title = 'COVID-19 Live Updates'
                next()
            }
        },
        {
            // 首页纯净版
            path: '/home-pure',
            name: 'home',
            component: () => import('../views/HomePure.vue'),
            async beforeEnter (to, from, next) {
                document.title = 'COVID-19 Live Updates'
                next()
            }
        },
        {
            path: '/home-v2',
            name: 'homev2',
            component: () => import('../views/HomeV2.vue'),
            async beforeEnter (to, from, next) {
                document.title = 'COVID-19 Live Updates'
                next()
            }
        },
        // 发热门诊一览表
        {
            path: '/map-detail',
            name: 'mapDetail',
            component: () => import('../views/MapDetail.vue'),
            props: true
        },
        {
            path: '/city-detail',
            name: 'cityDetail',
            component: () => import('../views/CityDetail.vue'),
            props: true
        },
        {
            path: '/foreign-detail',
            name: 'foreignDetail',
            component: () => import('../views/ForeignDetail.vue'),
            props: true
        },
        {
            path: '/check-self',
            name: 'CheckSelf',
            component: () => import('../views/CheckSelf.vue')
        },
        {
            path: '/check-self-result',
            name: 'CheckSelfResult',
            component: () => import('../views/CheckSelfResult.vue')
        },
        {
            path: '/feiyan-more-tools',
            name: 'FeiYanMoreTools',
            component: () => import('../views/FeiYanMoreTools.vue'),
            beforeEnter (to, from, next) {
                document.title = '腾讯健康抗疫服务工具箱'
                next()
            }
        },
        {
            path: '/case-details',
            name: 'CaseDetails',
            component: () => import('../views/CaseDetails.vue'),
            beforeEnter (to, from, next) {
                document.title = '确诊病例个案分析'
                next()
            }
        },
        {
            // 兜底去首页
            path: '*',
            name: 'default',
            component: () => import('../views/HomeV2.vue'),
            async beforeEnter (to, from, next) {
                document.title = 'COVID-19 Live Updates'
                next()
            }
        }
    ],
    document: [
        {
            path: '/article-map-api-document',
            name: 'MapApiArticle',
            component: () => import('../views/MapApiArticle.vue')
        },
        {
            path: '/article-map-hosp-document',
            name: 'MapHospArticle',
            component: () => import('../views/MapHospArticle.vue')
        }
    ]
}

export default allRoutes

export const beforeEach = (currentModuleName) => {
    // 找到不是当前模块的所有path
    let otherModulePageNames = []
    for (const moduleName in allRoutes) {
        if (moduleName !== currentModuleName && allRoutes.hasOwnProperty(moduleName)) {
            const routes = allRoutes[moduleName]
            otherModulePageNames = otherModulePageNames.concat(
                routes.map((item) => {
                    const includePageName = otherModulePageNames.find(
                        (eachOtherModule) => eachOtherModule.path === item.path
                    )
                    if (includePageName) {
                        console.error('拆了多页面之后，一定要把原来的页面路由在index里面删掉！！！！！')
                        console.error('没删掉的页面是', item)
                    }
                    return {
                        module: moduleName,
                        path: item.path,
                        name: item.name
                    }
                })
            )
        }
    }
    return async (to, from, next) => {
        console.log('🌟 to, from', to, from)
        // 路由透传白名单
        const queryList = ['channel']
        const patchQuery = keepQuery(to, from, queryList)
        if (patchQuery) {
            next({
                path: to.path,
                query: Object.assign({}, to.query, patchQuery),
                replace: !!from.name
            })
        } else {
            // 如果通过router.push 跳转的页面，不在当前模块里
            // 要通过location的方式跳转到对应的页面
            const otherModule = otherModulePageNames.find((item) => item.path === to.path || item.name === to.name)
            if (otherModule) {
                const redirect = (href) => {
                    if (from.name === null) {
                        location.replace(href)
                    } else {
                        location.href = href
                    }
                }
                let path = to.fullPath
                if (to.matched.length === 0 && to.fullPath === '/') {
                    path = `${otherModule.path}`
                }
                const reg = new RegExp(`(${currentModuleName}\.(html)?\/?)$`)
                if (reg.test(location.pathname)) {
                    redirect(
                        `${location.origin}${location.pathname.replace(reg, `${otherModule.module}.html`)}#${path}`
                    )
                } else if (location.pathname.slice(-1) === '/') {
                    redirect(`${location.origin}${location.pathname}${otherModule.module}.html#${path}`)
                } else {
                    redirect(`${location.origin}${location.pathname}/${otherModule.module}.html#${path}`)
                }
                return
            }
            next()
        }
    }
}

export const scrollBehavior = (to, from, savedPosition) => {
    const needSavePaths = ['home', 'homev2']
    const needSave = needSavePaths.indexOf(to.name) !== -1
    if (savedPosition && needSave) {
        return savedPosition
    } else if (!needSave) {
        return { x: 0, y: 0 }
    }
}
