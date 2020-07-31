const fs = require('fs')
const path = require('path')
const express = require('express')
const server = express()
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'
const serverInfo =
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

server.use('/dist', express.static(resolve('./dist')))

function createRenderer(serverBundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(serverBundle, Object.assign(options, {
        // this is only needed when vue-server-renderer is npm-linked
        // basedir: resolve('./dist'),
        // recommended for performance
        runInNewContext: false
    }))
}

let renderer
let readyPromise
const templatePath = resolve('./index.template.html')
console.log('======server isprod', isProd)
if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
        template,
        clientManifest
    })
} else {
    readyPromise = require('./build/setup-dev-server')(
        server,
        templatePath,
        (bundle, options) => {
            console.log('----callback')
            renderer = createRenderer(bundle, options)
        }
    )
}

function render(req, res) {
    const s = Date.now()

    res.setHeader('Content-Type', 'text/html')
    // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.setHeader('Server', serverInfo)

    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err.stack)
        }
    }

    const context = { // 服务器渲染上下文
        title: 'hello',
        url: req.url,
    }
    renderer.renderToString(context, (err, html) => {
        console.log('------err', err, !!html)
        if (err) {
            handleError(err)
            return
        }
        res.end(html)
        if (!isProd) {
            console.log(`whole request[耗费时间]: ${Date.now() - s}ms`)
        }
    })
}

server.get('*', isProd ? render : (req, res) => {
    console.log('-------server', req.url)
    readyPromise.then(() => render(req, res))
})


const port = process.env.PORT || 2000
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
