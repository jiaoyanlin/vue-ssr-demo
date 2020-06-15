<template>
    <div id="app">
        <div>hello</div>
        <div>this is app</div>
        <router-link to="/bar">Bar</router-link> 
        <router-link to="/foo">Foo</router-link> 
        <router-view></router-view>
    </div>
</template>

<script>
import Foo from './components/Foo'
export default {
    name: 'app',
    components: {
        Foo,
    },
}
</script>

<style scoped>
#app {
    background: #eee;
    color: green;
}
</style>