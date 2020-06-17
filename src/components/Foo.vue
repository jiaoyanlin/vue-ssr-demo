<template>
    <div class="foo">
        <div class="time">{{time}}</div>
        <div>fooCount: {{ fooCount }}</div>
        <button @click="onAdd">add count</button>
    </div>
</template>

<script>
// https://vuex.vuejs.org/zh/guide/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C
// 在这里导入模块，而不是在 `store/index.js` 中
import fooStoreModule from '../store/modules/foo'
export default {
    name: 'foo',
    data() {
        return {
            time: new Date(),
        }
    },
    asyncData ({ store }) {
        console.log('---asyncData has foo module', store.hasModule('foo'))
        // 惰性注册(lazy-register)这个模块
        if (!store.hasModule('foo')) store.registerModule('foo', fooStoreModule)
        return store.dispatch('foo/inc', 100)
    },

    // 重要信息：当多次访问路由时，避免在客户端重复注册模块。
    destroyed () {
        console.log('---unregisterModule')
        this.$store.unregisterModule('foo')
    },

    computed: {
        fooCount () {
            return this.$store.state.foo.count
        }
    },
    methods: {
        onAdd() {
            this.$store.dispatch('foo/inc', null, {root:true})
        },
    },
    mounted() {
        console.log('----foo mounted has foo module',  this.$store.hasModule('foo'))
        if (!this.$store.hasModule('foo')) { // 服务端渲染完，客户端要重新注册模块
            // 保留服务端渲染的 state
            this.$store.registerModule('foo', fooStoreModule, { preserveState: true })
        }
    },
}
</script>

<style scoped>
.foo {
    color: red;
    transform: translate(0, 100%);
}
</style>