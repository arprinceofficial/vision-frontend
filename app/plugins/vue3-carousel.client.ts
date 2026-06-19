import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('VCarousel', Carousel)
    nuxtApp.vueApp.component('VSlide', Slide)
})
