import Vue from 'vue'
import Vuex from 'vuex'
import httpUtils from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        initData: {},
        homeBanner: [],
        feverBanner: [],
        haiwaiBanner: [],
        // 用户输入的卡片
        editCard: {
            nickName: '', // 拜年对象
            cardTitle: '', // 贺卡标题
            aweText: '' // 祝福语
        },
        imgUrl: '',
        // 通过id拉取的卡信息
        card: {
            cardId: '',
            cardImg: '',
            hengtu: '',
            aweConfigList: [],
            aweList: [],
            cardTitle: '',
            detailText: '',
            nickName: '',
            leaderName: '',
            themeName: ''
        },
        myCards: [],
        createCardId: '',
        choosedBaseCardType: 1,
        choosedCardType: 11,
        needUpdateCard: false,
        choosedAwe: '', // 选择的祝福语
        identity: 1, // 1 我发起的; 2 我参加的; 3 我未参加的
        personal: {
            name: '',
            avatar: ''
        },
        cardConfigList: []
    },
    getters: {
        editable (state) {
            return state.identity === 1
        },
        choosedCardConfig (state) {
            return state.cardConfigList.find((item) => item.baseCardType === state.choosedBaseCardType)
        },
        choosedCard (state, getters) {
            if (!getters.choosedCardConfig) return {}
            return getters.choosedCardConfig.cardList.find((item) => item.cardType === state.choosedCardType)
        },
        isDefaultAwe (state, getters) {
            // 还没保存过，肯定是默认祝福语
            if (!state.editCard.aweText) return true

            // 当前编辑页的祝福语是否为默认祝福语
            const defaultList = getters.choosedCardConfig.cardList.map((config) => config.defaultAweText)

            return defaultList.indexOf(state.editCard.aweText) !== -1
        },
        localCard (state, getters) {
            // 将本地编辑的卡片构造成与card类似的数据结构
            return {
                ...state.editCard,
                aweList: [
                    {
                        avatar: state.personal.avatar,
                        name: state.personal.name,
                        text: state.editCard.aweText,
                        identity: 1
                    }
                ],
                cardImg: getters.choosedCard.cardImg,
                songSrc: getters.choosedCard.songSrc
            }
        }
    },
    mutations: {
        setImgUrl (state, imgUrl) {
            state.imgUrl = imgUrl
        },
        updateCardConfigList (state, config) {
            state.cardConfigList = config
        },
        chooseBaseCardType (state, type) {
            state.choosedBaseCardType = type
            // 同时默认选中第一个cardType
            const target = state.cardConfigList.find((item) => item.baseCardType === type)
            state.choosedCardType = target.cardList[0].cardType
        },
        chooseCardType (state, type) {
            state.choosedCardType = type
        },
        chooseAwe (state, content) {
            state.choosedAwe = content
        },
        clearChoosedAwe (state) {
            state.choosedAwe = ''
        },
        // 更新编辑记录
        updateEditCard (state, editCard) {
            state.editCard = editCard
        },
        // 更新拉取到的卡信息
        updateCard (state, cardRes) {
            const { cardInfo, identity } = cardRes
            state.card = cardInfo
            state.identity = identity
        },
        updateMyCards (state, cards) {
            state.myCards = cards
        },
        // 记录生成的卡片id
        markCardId (state, id) {
            state.createCardId = id
        },
        updateIdentity (state, identity) {
            state.identity = identity
        },
        updateNeedUpdate (state, status) {
            state.needUpdateCard = status
        },
        setInitData (state, initData) {
            state.initData = Object.assign({}, state.initData, initData)
        },
        setHomeBanner (state, homeBanner) {
            state.homeBanner = homeBanner
        },
        setFeverBanner (state, feverBanner) {
            state.feverBanner = feverBanner
        },
        setHaiwaiBanner (state, haiwaiBanner) {
            state.haiwaiBanner = haiwaiBanner
        }
    },
    actions: {
        async getCardConfigList ({ commit }) {
            const res = await httpUtils('getPageConfig')
            if (res.code !== 0) {
                throw res
            }
            commit('updateCardConfigList', res.cardConfigList)
        },
        async getMyCards ({ commit }) {
            const res = await httpUtils('getMyCard')
            if (res.code !== 0) {
                throw res
            }
            commit('updateMyCards', res.myCardList)
        },
        async createCard ({ state, commit }) {
            const res = await httpUtils('createCard', {
                ...state.editCard,
                cardType: state.choosedCardType
            })
            if (res.code !== 0) {
                throw res
            }
            commit('markCardId', res.cardId)
        },
        async getCardDetail ({ commit }, cardId) {
            const res = await httpUtils('getCard', cardId)
            if (res.code !== 0) {
                throw res
            }
            commit('updateCard', res)
        },
        async addCard (_, cardId) {
            const res = await httpUtils('addCard', cardId)
            if (res.code !== 0) {
                throw res
            }
        },
        async confirmJoin ({ state, commit }) {
            const res = await httpUtils('joinCard', {
                cardId: state.card.cardId,
                aweText: state.editCard.aweText
            })
            if (res.code !== 0) {
                throw res
            }
        },
        // PENDING
        /*  async getInitBannerConfig ({ state, commit }, { cityCode }) {
      const requestSeparateApi = () => {
        httpUtils('homeBanner', { cityCode }, 'FeverBannerH5')
          .then(({ code, data }) => {
            if (code === 0 && data.length) {
              commit('setHomeBanner', data)
            }
          })

        httpUtils('feverBanner', { cityCode }, 'FeverBannerH5')
          .then(({ code, data }) => {
            if (code === 0 && data.length) {
              commit('setFeverBanner', data)
            } else {
              commit('setFeverBanner', [])
            }
          })
          .catch((err) => {
            console.error(err)
            commit('setFeverBanner', [])
          })

        httpUtils('haiwaiBanner', { cityCode }, 'FeverBannerH5')
          .then(({ code, data }) => {
            if (code === 0 && data.length) {
              commit('setHaiwaiBanner', data)
            }
          })
      }
      try {
        const { dataMap: { homeBanner, feverBanner, haiwaiBanner }, code } = await httpUtils(
          'getMutiBanner',
          { cityCode, bannerList: ['homeBanner', 'feverBanner', 'haiwaiBanner'] },
          'FeverBannerH5'
        )
        if (code === 0) {
          commit('setHomeBanner', homeBanner)
          commit('setFeverBanner', feverBanner)
          commit('setHaiwaiBanner', haiwaiBanner)
        } else {
          requestSeparateApi()
        }
      } catch (err) {
        console.error('批量接口调用失败', err)
        requestSeparateApi()
      }
    }, */
        async getInitMapDetailData ({ state, commit }, batchReq) {
            try {
                // throw new Error('测试调用失败的情况');
                const { batchRsp, code } = await httpUtils('getInfoBatch', { batchReq }, 'THPneumoniaOuterDataService')
                if (code !== 0) {
                    let result = {}
                    for (let func in batchReq) {
                        try {
                            const res = await httpUtils(func, JSON.parse(batchReq[func]), 'THPneumoniaOuterDataService')
                            result[func] = res
                        } catch (error) {
                            console.error(`${func} 接口调用失败`, error)
                        }
                    }
                    return result
                }
                let result = {
                    getKeyCity: JSON.parse(batchRsp.getKeyCity),
                    getCityInfo: JSON.parse(batchRsp.getCityInfo)
                }
                if (batchRsp.getHubeiInfo) {
                    result.getHubeiInfo = JSON.parse(batchRsp.getHubeiInfo)
                }
                return result
            } catch (err) {
                console.error('批量接口调用失败，使用兜底逻辑，单个接口依次调用', err)
                let result = {}
                for (let func in batchReq) {
                    try {
                        const res = await httpUtils(func, JSON.parse(batchReq[func]), 'THPneumoniaOuterDataService')
                        result[func] = res
                    } catch (error) {
                        console.error(`${func} 接口调用失败`, error)
                    }
                }
                return result
            }
        },
        async getInitHomeData ({ state, commit }, { context }) {
            // 二次进入首页 就不需要在请求百科接口，首次进入才请求getBaike
            const batchReq = {
                getChinaTotal: JSON.stringify({ none: 'none' }),
                getAreaInfo: JSON.stringify({ none: 'none' }),
                getForeignTotal: JSON.stringify({ none: 'none' }),
                getForeignInfo: JSON.stringify({ none: 'none' }),
                getForeignHistory: JSON.stringify({ none: 'none' }),
                getHubeiInfo: JSON.stringify({ none: 'none' }),
                getRate: JSON.stringify({ none: 'none' }),
                getCityInfoByCode: JSON.stringify({ cityCode: '420100' }) // 首页获取的是武汉的数据
            }
            // const firstInit = Object.keys(state.initData).length === 0;
            // if (firstInit) {
            //   batchReq.getBaike = JSON.stringify({
            //     cmd: 'GetActiveDataV4',
            //     offset: 0,
            //     limit: 3
            //   });
            // }
            try {
                // throw new Error('测试调用失败的情况');
                const { batchRsp, code } = await httpUtils(
                    'getInfoBatch',
                    { batchReq },
                    'THPneumoniaOuterDataService',
                    context
                )
                if (code !== 0) {
                    Object.keys(batchReq).forEach(async (func) => {
                        try {
                            const res = await httpUtils(
                                func,
                                JSON.parse(batchReq[func]),
                                'THPneumoniaOuterDataService',
                                context
                            )
                            commit('setInitData', {
                                [func]: res
                            })
                        } catch (error) {
                            console.error(`${func} 接口调用失败`, error)
                            // 调用失败，设置error的flag
                            commit('setInitData', {
                                [func]: { code: -1 }
                            })
                        }
                    })
                    return
                }
                const result = {
                    getChinaTotal: JSON.parse(batchRsp.getChinaTotal),
                    getAreaInfo: JSON.parse(batchRsp.getAreaInfo),
                    getForeignTotal: JSON.parse(batchRsp.getForeignTotal),
                    getForeignInfo: JSON.parse(batchRsp.getForeignInfo),
                    getForeignHistory: JSON.parse(batchRsp.getForeignHistory),
                    getHubeiInfo: JSON.parse(batchRsp.getHubeiInfo),
                    getRate: JSON.parse(batchRsp.getRate),
                    getCityInfoByCode: JSON.parse(batchRsp.getCityInfoByCode)
                }
                // if (firstInit) {
                //   result.getBaike = JSON.parse(batchRsp.getBaike);
                // }
                commit('setInitData', result)
            } catch (err) {
                console.error('批量接口调用失败，使用兜底逻辑，单个接口依次调用', err)
                Object.keys(batchReq).forEach(async (func) => {
                    try {
                        const res = await httpUtils(
                            func,
                            JSON.parse(batchReq[func]),
                            'THPneumoniaOuterDataService',
                            context
                        )
                        commit('setInitData', {
                            [func]: res
                        })
                    } catch (error) {
                        console.error(`${func} 接口调用失败`, error)
                        // 调用失败，设置error的flag
                        commit('setInitData', {
                            [func]: { code: -1 }
                        })
                    }
                })
            }
        }
    },
    modules: {}
})
