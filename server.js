const path = require('path')
const express = require('express')
const server = express()
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)

function dealError(err, res) {
    if (err.code === 404) {
        res.status(404).end('Page not found')
    } else {
        console.error(err)
        res.status(500).end('Internal Server Error')
    }
}

const template = require('fs').readFileSync('./index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
})

server.use('/dist', express.static(resolve('./dist')))
server.get('*', (req, res) => {
    const context = {
        title: 'hello',
        url: req.url,
    }
    renderer.renderToString(context, (err, html) => {
        if (err) {
            dealError(err, res)
            return
        }
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end(html)
    })
})


const port = process.env.PORT || 2000
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
