<script setup lang="ts">
import { Carousel as VCarousel, Slide as VSlide } from 'vue3-carousel'

const navArrow = '/assets/images/citizen/icons/detail/nav-arrow.svg'
const pagerDotActive = '/assets/images/citizen/icons/detail/pager-dot-active.svg'
const pagerDot = '/assets/images/citizen/icons/detail/pager-dot.svg'

type GlovesSectionPayload = {
    asset?: string
    name?: string
    start?: string
    status?: number
}

const props = withDefaults(
    defineProps<{
        mediaClues?: GlovesSectionPayload[]
    }>(),
    {
        mediaClues: () => [],
    }
)

const fallbackImage = '/assets/images/citizen/icons/detail/gloves-moment.jpg'

const carouselSlides = computed(() => {
    const slides = (props.mediaClues ?? [])
        .filter((item) => Boolean(item?.asset))
        .map((item) => ({
            image: item.asset || fallbackImage,
            caption: item.name || 'Media Clue',
        }))

    if (!slides.length) {
        return [{ image: fallbackImage, caption: 'Media Clue' }]
    }

    return slides
})

type CarouselController = {
    next: () => void
    prev: () => void
    slideTo: (index: number) => void
}

const carouselRef = ref<CarouselController | null>(null)
const activeSlide = ref(0)

const onSlideStart = ({ currentSlideIndex }: { currentSlideIndex: number }) => {
    activeSlide.value = currentSlideIndex
}

const goPrev = () => {
    carouselRef.value?.prev()
}

const goNext = () => {
    carouselRef.value?.next()
}

const goToSlide = (index: number) => {
    carouselRef.value?.slideTo(index)
    activeSlide.value = index
}
</script>

<template>
    <section class="relative mb-10">
        <h2
            class="text-center font-['Bebas_Neue'] text-[clamp(2rem,6.6vw,4.375rem)] uppercase leading-[0.9] text-white ">
            MEDIA CLUES <span class="text-[#d4af37]">REVEAL</span>
        </h2>

        <div
            class="relative mt-4 h-[62vh] min-h-[340px] w-full overflow-hidden border-y border-[#d4af37] bg-black sm:mt-8 sm:min-h-[520px] lg:h-[880px]">
            <VCarousel ref="carouselRef" class="gloves-carousel h-full w-full" :items-to-show="1" :wrap-around="true"
                :transition="600" @slide-start="onSlideStart">
                <VSlide v-for="(slide, index) in carouselSlides" :key="`gloves-slide-${index}`" class="h-full">
                    <div class="relative h-full w-full bg-black">
                        <img :src="slide.image" :alt="slide.caption"
                            class="h-full w-full object-contain object-center" />
                        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_70.027%,#000_100%)]" />
                    </div>
                </VSlide>
            </VCarousel>

            <div
                class="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between px-3 sm:px-6 lg:px-[24px]">
                <button type="button" class="pointer-events-auto grid size-8 place-items-center rounded-full sm:size-10"
                    @click="goNext">
                    <img :src="navArrow" alt="Next"
                        class="h-8 w-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:h-[40px] sm:w-[20px]" />
                </button>
                <button type="button" class="pointer-events-auto grid size-8 place-items-center rounded-full sm:size-10"
                    @click="goPrev">
                    <img :src="navArrow" alt="Prev"
                        class="h-8 w-4 rotate-180 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:h-[40px] sm:w-[20px]" />
                </button>
            </div>

            <div
                class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center rounded-full bg-black/20 px-2 py-1.5 shadow-[0_0_10px_rgba(0,0,0,0.55)] sm:bottom-8 sm:px-[8px] sm:py-[6px]">
                <div class="flex items-center gap-2.5 sm:gap-3">
                    <button v-for="(slide, index) in carouselSlides" :key="`gloves-dot-${index}`" type="button"
                        :aria-label="`Go to gloves slide ${index + 1}`" @click="goToSlide(index)">
                        <img :src="index === activeSlide ? pagerDotActive : pagerDot"
                            :alt="index === activeSlide ? 'active' : 'dot'"
                            class="h-2.5 w-2.5 sm:h-[12px] sm:w-[12px]" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.gloves-carousel :deep(.carousel__viewport),
.gloves-carousel :deep(.carousel__track),
.gloves-carousel :deep(.carousel__slide) {
    height: 100%;
}

.gloves-carousel :deep(.carousel__slide > div) {
    height: 100%;
    width: 100%;
}
</style>
