<template>
    <div id="app">
        <div @click="onClick">hello</div>
        <div>this is app</div>
        <router-link to="/bar">Bar</router-link> 
        <router-link to="/foo">Foo</router-link> 
        <router-link to="/a">a</router-link> 
        <router-link to="/banner">banner</router-link>
        <router-link to="/item/1000">item 1000</router-link>
        <router-link to="/item/9999">item 9999</router-link>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
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