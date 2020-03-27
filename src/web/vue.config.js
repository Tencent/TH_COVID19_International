const path = require('path')
const { BASE_URL } = require('./src/config/constant')
const isBuild = process.env.CDN_ENV !== 'development'

module.exports = {
    publicPath: isBuild ? `//static.wecity.qq.com/${BASE_URL}` : BASE_URL,
    devServer: {
        disableHostCheck: true
    },
    lintOnSave: false,
    /**
     * Multiple Single-Pages-Apps
     */
    pages: {
        home: {
            entry: 'src/main-home.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
        // document: {
        //     entry: 'src/main-document.js',
        //     template: 'public/index.html',
        //     filename: 'document.html'
        // }
    },
    chainWebpack: config => {
        config.module
            .rule('css')
            .test(/\.css$/)
            .oneOf('vue')
            .resourceQuery(/\?vue/)
            .use('px2rem')
            .loader('px2rem-loader')
            .options({
                remUnit: 37.5
            })

        config.plugin('define').tap(definitions => {
            Object.assign(definitions[0]['process.env'], {
                CDN_ENV: JSON.stringify(process.env.CDN_ENV)
            })
            return definitions
        })
    },
    css: {
        loaderOptions: {
            css: {
                importLoaders: true
            },
            sass: {
                prependData: '@import "~src/assets/style/util.scss";'
            },
            postcss: {
                plugins: [
                    require('postcss-plugin-px2rem')({
                        rootValue: 37.5, // 换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
                        selectorBlackList: ['weui'] // 忽略weui样式的处理
                    })
                ]
            }
        }
    },
    configureWebpack: {
        resolve: {
            extensions: ['.scss'],
            alias: {
                Styles: path.resolve(__dirname, 'src/styles'),
                styles: path.resolve(__dirname, 'src/styles'),
                src: path.resolve(__dirname, 'src')
            }
        }
    }
}
