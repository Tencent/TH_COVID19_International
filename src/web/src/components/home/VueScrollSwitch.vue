<template>
    <div ref="container">
        <slot></slot>
    </div>
</template>
<script>
// 函数节流
class Throttle {
    constructor (options) {
        this.interval = options.interval
        this.lastExecTime = 0
        this.timeOut = null
    }
    exec (handler) {
        const run = () => {
            typeof handler === 'function' && handler()
            this.lastExecTime = Date.now()
        }
        clearTimeout(this.timeOut)
        // 确保最后还会执行一次
        if (Date.now() - this.lastExecTime > this.interval) {
            return run()
        }
        this.timeOut = setTimeout(run, this.interval)
    }
}
const throttle = new Throttle({ interval: 300 })
export default {
    watch: {
        enableScrollSwitch (oldVal, newVal) {
            if (this.newVal) {
                let tab = this.tab
                if (~this.tabs.indexOf(tab)) {
                    this.minIndex = this.lastIndex
                }
            } else {
                this.infoStreamList = 0
            }
        },
        currentIndex (val) {
            this.$emit('current-index-change', val)
        }
    },
    props: {
        currentViewMinTop: {
            type: Number,
            default: 0
        },
        //
        enableScrollSwitch: {
            type: Boolean,
            default: true
        },
        // 强制切换tab时，scroll到指定高度
        initScrollY: {
            type: Number,
            default: 0
        },
        // 初始显示的tab
        defaultShowIndex: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            currentIndex: this.defaultShowIndex,
            enableScrollEven: false,
            lastIndex: 0
        }
    },
    mounted () {
        window.addEventListener('scroll', this._onScroll)
        this.$nextTick(() => {
            this.init()
        })
    },
    destroyed () {
        window.removeEventListener('scroll', this._onScroll)
    },
    methods: {
        setCurrentIndex (index) {
            if (this.enableScrollSwitch) {
                // 触发了fix状态下的tab切换，使用信息流的方式
                if (index > this.lastIndex) {
                    // 在信息流之中进行定位
                    let top = this._getChildren()[index].elm.getBoundingClientRect().top + window.pageYOffset - 45
                    window.scrollTo(0, top)
                    return
                }
            }
            this.enableScrollEven = false
            const children = this._getChildren()
            if (index > children - 1 || index < 0) return
            children.forEach((i, idx) => {
                this._toggleChild(i, idx >= index)
            })
            this.lastIndex = index
            // window.scrollTo(0, this.initScrollY)
            setTimeout(() => {
                this.enableScrollEven = true
            }, 500)
        },
        _getChildren () {
            return (this.$slots && this.$slots.default) || []
        },
        init () {
            const defaultShowIndex = this.defaultShowIndex
            // fix 初次进入页面时，要主动设置lastIndex
            this.lastIndex = defaultShowIndex
            this._getChildren().forEach((i, index) => {
                this._toggleChild(i, index >= defaultShowIndex)
            })
            setTimeout(() => {
                this.enableScrollEven = true
            }, 500)
        },
        _toggleChild (child, isShow) {
            if (!child || !child.tag || !child?.elm?.style) return
            if (isShow) {
                child.elm.style.display = 'block'
                return
            }
            child.elm.style.display = 'none'
        },
        _onScroll (e) {
            this.enableScrollSwitch &&
                this.enableScrollEven &&
                throttle.exec(() => {
                    // this._getChildren().forEach((i, index) => {
                    //   index > this.currentIndex && this._toggleChild(i, true)
                    // })
                    this.$nextTick(() => {
                        this._setCurrentIndex()
                    })
                })
        },
        _setCurrentIndex () {
            const children = this._getChildren()
            const currentViewMinTop = this.currentViewMinTop
            for (let i = 0; i < children.length; i++) {
                if (children[i].tag) {
                    let posObj = children[i]?.elm?.getBoundingClientRect?.() || {}
                    if (!posObj) {
                        break
                    }
                    if (posObj.top <= currentViewMinTop && posObj.bottom > currentViewMinTop && posObj.height > 0) {
                        this.currentIndex = i
                        break
                    }
                }
            }
        }
    }
}
</script>
