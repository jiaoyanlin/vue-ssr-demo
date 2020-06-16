const webpack = require('webpack')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const merge = require('webpack-merge')
const base = require('./base.config')

const config = merge(base, {
    entry: {
        // ./指向node命令执行时的目录，也就是项目根目录
        client: './src/entry-client.js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: { // 基础类库:它是构成我们项目必不可少的一些基础类库，比如 vue+vue-router+vuex+axios 这种标准的全家桶，它们的升级频率都不高，但每个页面都需要它们
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // 只打包初始时依赖的第三方
                },
                // antUI: { // UI 组件库
                //     name: 'chunk-ant', // 单独将 ant 拆包
                //     priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                //     test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/
                // },
                // commons: { // 自定义组件/函数
                //     name: 'chunk-commons',
                //     test: path.resolve(__dirname, '../src/components/components-global'), // 可自定义拓展你的规则，比如注册全局组件的目录
                //     minChunks: 2, // 最小共用次数
                //     priority: 5,
                //     reuseExistingChunk: true
                // },
            }
        },
        // 提取 webpack 运行时和 manifest
        runtimeChunk: {
            name: 'manifest',
        },
        /*
        * moduleIds: 固定moduleId；使用文件路径的hash作为 moduleId，解决moduleId递增变化导致的无法长期缓存问题
        * 相当于在plugins中使用new webpack.HashedModuleIdsPlugin()
        */
        moduleIds: 'hashed',
    },
    plugins: [
        // strip dev-only code in Vue source
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        // 此插件在输出目录中
        // 生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin()
    ]
})

module.exports = config
