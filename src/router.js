import Vue from 'vue'
import Router from 'vue-router'
import Foo from './components/Foo'
// import Bar from './components/Bar'


Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                redirect: '/foo'
            },
            {
                path: '/foo',
                component: Foo
            },
            {
                path: '/bar',
                component: () => import( /* webpackChunkName: "bar" */ './components/Bar.vue')
            },
            {
                path: '/a',
                component: () => import( /* webpackChunkName: "a" */ './components/A.vue')
            },
            {
                path: '/banner',
                component: () => import( /* webpackChunkName: "a" */ './components/Banner.vue')
            },
        ]
    })
}
