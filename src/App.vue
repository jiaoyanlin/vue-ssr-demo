<template>
    <div id="app">
        <div>hello</div>
        <div>this is app</div>
        <foo />
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