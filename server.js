const fs = require('fs')
const path = require('path')
const express = require('express')
const microcache = require('route-cache')
const server = express()
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
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
    console.log('----render', req.url, s)

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
        console.log('----renderToString', err, !!html)
        if (err) {
            handleError(err)
            return
        }
        res.send(html)
        if (!isProd) {
            console.log(`whole request[耗费时间]: ${Date.now() - s}ms`)
        }
    })
}

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
server.use(microcache.cacheSeconds(30, function(req) {
    console.log('----url', req.url)
    if (req.url === '/item/1000') return false // 该页面不缓存
    return useMicroCache && req.url
}))

server.get('*', function(req, res) {
    console.log('you will only see this every 30 seconds.', Math.round(Date.now()/1000))
    if (isProd) {
        render()
    } else {
        readyPromise.then(() => render(req, res))
    }
})


const port = process.env.PORT || 2000
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
