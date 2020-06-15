const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer({
    template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

server.get('*', (req, res) => {
    const context = {
        title: 'hello',
        meta: `
          <meta ...>
          <meta ...>
        `
    }
    const app = (require('./dist/bundle.js').default)({
        url: req.url
    });

    renderer.renderToString(app, context, (err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error')
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
