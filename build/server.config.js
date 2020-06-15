const path = require('path')
const merge = require('webpack-merge')
const base = require('./base.config')

const config = merge(base, {
    target: 'node',
    entry: {
        server: './src/entry-server.js'
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js'
    },
})
module.exports = config
