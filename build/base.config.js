const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 生产环境抽离css
const clone = require('lodash.clonedeep');

const isProd = process.env.NODE_ENV === 'production'
// console.log('====isProd', isProd)

let originConfig = {
    devtool: isProd ? false : '#cheap-module-source-map',
    mode: isProd ? 'production' : 'development',

    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash:8].js'
    },

    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@mixins': path.resolve(__dirname, '../src/mixins'),
        }
    },

    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000, // 10Kb
                        name: 'imgs/[name].[ext]?[hash]'
                    }
                }
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
    ]
}

// type: server、client
module.exports = (type = 'server') => {
    const isClient = type === 'client';
    const extractCss = isProd && isClient; // 增加css抽取
    const config = clone(originConfig);
    config.module.rules.push({
        test: /\.(css|scss)$/,
        include: [
            path.resolve(__dirname, '../src'),
            /node_modules\/swiper/,
        ],
        use: [
            // 服务端不能抽离css，因为MiniCssExtractPlugin会用到document导致服务端报错
            extractCss ? {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../' // 让css能成功加载到图片
                }
            } : 'vue-style-loader',
            {
                loader: 'css-loader',
                options: {
                    // true -> 只导出className，不生成css文件；服务端渲染不要生成css，否则会和客户端的css重复
                    onlyLocals: !isClient,
                },
            }, 'postcss-loader', 'sass-loader'
        ]
    })
    if (extractCss) config.plugins.push(new MiniCssExtractPlugin({filename: 'css/[name].[contenthash:8].css'}))
    return config
}
