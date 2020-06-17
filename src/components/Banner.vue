<template>
    <div>
        <div v-swiper="swiperOptions" ref="mySwiper" class="swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    Render original HTML in server, render Swiper in browser (client)
                </div>
                <div class="swiper-slide">Slide 1</div>
                <div class="swiper-slide">Slide 2</div>
                <div class="swiper-slide">Slide 3</div>
            </div>
            <div class="swiper-pagination" slot="pagination"></div>
        </div>
        <!-- <swiper ref="mySwiper" class="swiper" :options="swiperOptions">
            <swiper-slide>Slide 1</swiper-slide>
            <swiper-slide>Slide 2</swiper-slide>
            <swiper-slide>Slide 3</swiper-slide>
            <swiper-slide>Slide 4</swiper-slide>
            <swiper-slide>Slide 5</swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper> -->
    </div>
</template>

<script>
import { directive } from 'vue-awesome-swiper'
export default {
    name: 'banner',
    directives: {
        swiper: directive
    },
    data() {
        return {
            swiperOptions: {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
            }
        }
    },
    computed: {
        swiper() {
            console.log('-----slide', this.$refs.mySwiper)
            return this.$refs.mySwiper.swiper
        }
    },
    mounted() {
        console.log('Current Swiper instance object', this.swiper)
        this.swiper.slideTo(3, 1000, false)
    },
}
</script>

<style lang="scss" scoped>
.swiper {
    height: 300px;
    width: 100%;

    .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-weight: bold;
        background: #ddd;
    }
}
</style>