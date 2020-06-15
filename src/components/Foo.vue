<template>
    <div class="foo">
        <div class="time">{{time}}</div>
    </div>
</template>

<script>
export default {
    name: 'foo',
    data() {
        return {
            time: new Date(),
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