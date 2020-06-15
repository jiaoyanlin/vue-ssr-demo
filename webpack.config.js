const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    target: 'node',

    entry: './src/entry-server.js',
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['.js', '.vue']
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
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
                        limit: 10000    // 10Kb
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