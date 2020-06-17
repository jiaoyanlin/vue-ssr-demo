import Vue from 'vue'
import { createApp } from './app'

let isRouteReady = false; // 初始路由是否已经 resolve，避免服务端渲染的页面到了客户端又重复获取了数据

// 客户端特定引导逻辑……

Vue.mixin({
    data() {
        return {
            mx_loading: false,
        }
    },
    // 客户端预取策略2：匹配要渲染的视图后，再获取数据
    beforeMount() {
        console.log('------global mixin beforeMount', isRouteReady)
        // 在初始路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
        if (!isRouteReady) return;
        const { asyncData } = this.$options
        if (asyncData) {
            // 将获取数据操作分配给 promise
            // 以便在组件中，我们可以在数据准备就绪后
            // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
            this.mx_loading = true;
            this.dataPromise = asyncData({
                store: this.$store,
                route: this.$route
            }).finally(() => {
                this.mx_loading = false;
            })
        }
    },

    // 当路由组件重用（同一路由，但是 params 或 query 已更改，例如，从 user/1 到 user/2）时，也应该调用 asyncData 函数
    beforeRouteUpdate(to, from, next) {
        console.log('------global mixin beforeRouteUpdate')
        const { asyncData } = this.$options
        if (asyncData) {
            this.mx_loading = true;
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next).finally(() => {
                this.mx_loading = false;
            })
        } else {
            next()
        }
    }
})

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

// 这里假定 App.vue 模板中根元素具有 `id="app"`
router.onReady(() => {
    app.$mount('#app')
    isRouteReady = true;

    // 客户端预取策略1：在路由导航之前解析数据
    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    // router.beforeResolve((to, from, next) => {
    //     const matched = router.getMatchedComponents(to)
    //     const prevMatched = router.getMatchedComponents(from)
    //     console.log('-------beforeResolve', matched, prevMatched)

    //     // 我们只关心非预渲染的组件
    //     // 所以我们对比它们，找出两个匹配列表的差异组件
    //     let diffed = false
    //     const activated = matched.filter((c, i) => {
    //         return diffed || (diffed = (prevMatched[i] !== c))
    //     })

    //     console.log('-------activated', activated)

    //     if (!activated.length) {
    //         return next()
    //     }

    //     // 这里如果有加载指示器 (loading indicator)，就触发

    //     Promise.all(activated.map(c => {
    //         if (c.asyncData) {
    //             return c.asyncData({ store, route: to })
    //         }
    //     })).then(() => {

    //         // 停止加载指示器(loading indicator)

    //         next()
    //     }).catch(next)
    // })
})