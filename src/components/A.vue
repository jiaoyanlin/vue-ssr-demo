<template>
    <div>
        <swiper ref="mySwiper" class="swiper" :options="swiperOptions">
            <swiper-slide>Slide 1</swiper-slide>
            <swiper-slide>Slide 2</swiper-slide>
            <swiper-slide>Slide 3</swiper-slide>
            <swiper-slide>Slide 4</swiper-slide>
            <swiper-slide>Slide 5</swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
import 'swiper/css/swiper.css'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
export default {
    name: 'a',
    components: {
        Swiper,
        SwiperSlide,
    },
    // directives: {
    //     swiper: directive
    // },
    data() {
        return {
            swiperOptions: {
                pagination: {
                    el: '.swiper-pagination'
                },
            }
        }
    },
    computed: {
        swiper() {
            console.log('-----slide', this.$refs.mySwiper)
            return this.$refs.mySwiper.$swiper
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