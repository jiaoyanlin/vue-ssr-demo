const merge = require('webpack-merge')
const base = require('./base.config')

const config = merge(base, {
    entry: {
        client: './src/entry-client.js'
    },
    // output: {
    //     path: path.resolve(__dirname, 'dist'),
    //     filename: 'client.js'
    // },
})
module.exports = config
