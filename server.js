const path = require('path')
const express = require('express')
const server = express()
const renderer = require('vue-server-renderer').createRenderer({
    template: require('fs').readFileSync('./index.template.html', 'utf-8')
})
const createApp = require('./dist/server.bundle.js').default;
const resolve = file => path.resolve(__dirname, file)

function dealError(err, res) {
    if (err.code === 404) {
        res.status(404).end('Page not found')
    } else {
        res.status(500).end('Internal Server Error')
    }
}
server.use('/dist', express.static(resolve('./dist')))
server.get('*', (req, res) => {
    const context = {
        title: 'hello',
        meta: `
          <meta ...>
          <meta ...>
        `
    }
    createApp({
        url: req.url
    }).then(app => {
        renderer.renderToString(app, context, (err, html) => {
            if (err) {
                dealError(err, res)
                return
            }
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.end(html)
        })
    }).catch(err => {
        console.error('catch err', err)
        dealError(err, res)
    })
})


const port = process.env.PORT || 2000
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
