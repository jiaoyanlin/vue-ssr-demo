<template>
    <div>
        <div v-if="mx_loading">loading...</div>
        <template v-else>
            <div>item id: {{item.id}}</div>
            <div>item title: {{ item.title }}</div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'item',
    asyncData ({ store, route }) {
        // 触发 action 后，会返回 Promise
        return store.dispatch('fetchItem', route.params.id)
    },
    computed: {
        // 从 store 的 state 对象中的获取 item。
        item () {
            return this.$store.state.items[this.$route.params.id] || {}
        }
    },
}
</script>
