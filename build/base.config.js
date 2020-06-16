const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    devtool: isProd ? false : '#cheap-module-source-map',
    mode: isProd ? 'production' : 'development',

    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash:8].js'
    },

    resolve: {
        extensions: ['.js', '.vue']
    },

    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader', 'postcss-loader']
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
};