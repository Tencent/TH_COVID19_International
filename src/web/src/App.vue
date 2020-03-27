<template>
    <div id="app" class="in-cdn">
        <transition>
            <keep-alive :include="[]">
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>
import { outerConfig, pageConfig } from '@/config/pageConfig'

export default {
    mounted () {
        // 异步拉取 pageConfig ，可以通过 this.pageConfig | this.globalConfig 来访问，可以使用 await this.pageConfig._remote 的方法来等待远程配置加载
        this.fetchPageConfig()
        // fix iOS下:active不生效的问题
        document.body.addEventListener('touchstart', function () {}, false)
    },
    methods: {
        async fetchPageConfig () {
            window.Vue.prototype.pageConfig = pageConfig
            window.Vue.prototype.globalConfig = pageConfig // 兼容历史遗留问题
            await outerConfig()
        }
    }
}
</script>

<style>
@import '~styles/lib/weui-v2.1.4.min.css';
</style>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &.in-cdn {
        .gudie-mask {
            .arrow {
                right: 15px;
            }
        }
    }
}
input,
textarea {
    border: none;
    -moz-appearance: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none; /*解决ios上按钮的圆角问题*/
    border-radius: 0; /*解决ios上输入框圆角问题*/
    outline: medium; /*去掉鼠标点击的默认黄色边框*/
    background-color: transparent;
}
.not-allow {
    opacity: 0.5;
}
// 修改默认颜色
.district-picker {
    .weui-btn_primary {
        background: #5675f1;
        &:active {
            background: #5675f1;
            opacity: 0.6;
        }
    }
}
</style>
