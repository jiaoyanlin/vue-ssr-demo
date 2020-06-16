<template>
    <div id="app">
        <div @click="onClick">hello</div>
        <div>this is app</div>
        <router-link to="/bar">Bar</router-link> 
        <router-link to="/foo">Foo</router-link> 
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
    components: {
    },
    methods: {
        onClick() {
            alert('Hello')
        }
    },
    mounted() {
        console.log('----app mounted')
    },
}
</script>

<style scoped>
#app {
    background: #eee;
    color: green;
}
</style>