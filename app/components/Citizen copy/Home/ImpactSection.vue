<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const impactTopImage = '/assets/images/citizen/home/impact-top.png'
const impactBottomImage = '/assets/images/citizen/home/impact-bottom.png'
const impactQuoteMark = '/assets/images/citizen/home/impact-quote.svg'
const impactCard1Image = '/assets/images/citizen/home/impact-card-1.png'
const impactCard2Image = '/assets/images/citizen/home/impact-card-2.png'
const impactCard3Image = '/assets/images/citizen/home/impact-card-3.png'

const impact = {
    topImage: impactTopImage,
    bottomImage: impactBottomImage,
    quoteMark: impactQuoteMark
}

const impactCards = [
    {
        name: 'The Lords Taverners',
        description:
            'Champion’s Circle invests in grassroots sports clubs, providing equipment, coaching, and facilities to help young athletes from all backgrounds reach their full potential.',
        quote:
            '“Collectivault’s support has transformed how we equip young athletes, opening new doors and inspiring dreams.”',
        org: 'Champion’s Circle',
        image: impactCard1Image
    },
    {
        name: 'The High Performance Foundation',
        description:
            'NextGen Athletes Foundation offers training programs and scholarships to talented youth in underserved communities, opening doors to new opportunities in sport and beyond.',
        quote:
            '“Thanks to Collectivault, we’re able to offer scholarships that change lives and create future leaders.”',
        org: 'NextGen Athletes Foundation',
        image: impactCard2Image
    },
    {
        name: 'The Kate and Justin Rose Foundation',
        description:
            'Play Forward Trust creates safe, inclusive spaces for children to engage in team sports, promoting health, teamwork, and confidence in communities that need it most.',
        quote:
            '“Collectivault’s funding helps us build safe, welcoming spaces where every child can thrive through sport.”',
        org: 'Play Forward Trust',
        image: impactCard3Image
    }
]

const impactResponsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]

const impactPage = ref(0)
const impactVisible = ref(2)
const dragStartX = ref<number | null>(null)

const updateImpactVisible = () => {
    const width = window.innerWidth

    if (width <= 1199) {
        impactVisible.value = 1
        return
    }

    impactVisible.value = 2
}

const nextImpactPage = () => {
    const maxPage = Math.max(impactCards.length - impactVisible.value, 0)
    impactPage.value = impactPage.value >= maxPage ? 0 : impactPage.value + 1
}

const prevImpactPage = () => {
    const maxPage = Math.max(impactCards.length - impactVisible.value, 0)
    impactPage.value = impactPage.value <= 0 ? maxPage : impactPage.value - 1
}

const onImpactPointerDown = (event: PointerEvent) => {
    dragStartX.value = event.clientX
}

const onImpactPointerEnd = (event: PointerEvent) => {
    if (dragStartX.value === null) return

    const diff = event.clientX - dragStartX.value
    dragStartX.value = null

    if (Math.abs(diff) < 40) return

    if (diff < 0) {
        nextImpactPage()
        return
    }

    prevImpactPage()
}

onMounted(() => {
    updateImpactVisible()
    window.addEventListener('resize', updateImpactVisible)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateImpactVisible)
})
</script>

<template>
    <section class="overflow-x-hidden border-[5px] border-[#22252b] bg-[#22252b]">
        <div class="mx-auto w-full max-w-[1512px] px-4 sm:px-6 lg:px-[72px]">
            <div class="relative left-1/2 w-[100dvw] max-w-none -translate-x-1/2 overflow-hidden">
                <img alt="" class="h-[420px] w-full object-cover sm:h-[520px] lg:h-[760px] xl:h-[900px]" :src="impact.topImage" />
                <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/60" />
            </div>

            <div class="mx-auto w-full max-w-[1512px] py-8 sm:py-10 lg:py-12">
                <h2 class="bg-clip-text text-[56px] uppercase leading-[0.85] text-transparent sm:text-[88px] md:text-[120px] lg:text-[170px] xl:text-[220px]"
                    style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(143.87deg, rgb(188, 154, 29) 28.673%, rgb(212, 175, 55) 71.327%);">
                    our impact
                </h2>

                <div class="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div class="max-w-[880px]">
                        <p class="m-0 text-[22px] uppercase leading-[1.1] text-white/80 sm:text-[30px] md:text-[38px]"
                            style="font-family: 'Bebas Neue', sans-serif; text-shadow: 0px 4px 24px rgba(0, 0, 0, 0.25);">
                            COLLECTIVAULT PARTNER CHARITIES
                        </p>
                        <p class="mt-3 text-sm leading-6 text-[#d0d1d4] sm:text-base sm:leading-7 md:text-xl md:leading-8 lg:text-[28px] lg:leading-9">
                            At Collectivault, every purchase makes a difference. Each year, our board will choose
                            three charities working to improve the lives of young people. These three charities
                            will all receive an equal share of business profits, totalling 10%.
                            <br /><br />
                            By owning a piece of history, you’re helping create real, lasting change.
                        </p>
                    </div>

                    <button
                        class="h-11 w-full max-w-[220px] rounded-[999px] px-6 text-base text-black shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] sm:h-12 sm:max-w-[240px] sm:text-lg md:max-w-[260px] md:text-[22px]"
                        style="background-image: linear-gradient(165deg, rgb(188, 154, 29) 0%, rgb(212, 175, 55) 100%);">
                        More Details
                    </button>
                </div>
            </div>

            <div class="relative mt-8 cursor-grab pb-3 active:cursor-grabbing sm:mt-10 lg:mt-14"
                @pointerdown="onImpactPointerDown" @pointerup="onImpactPointerEnd" @pointercancel="onImpactPointerEnd"
                @pointerleave="onImpactPointerEnd">
                <Carousel class="impact-carousel" :value="impactCards" v-model:page="impactPage" :numVisible="impactVisible"
                    :numScroll="1" :responsiveOptions="impactResponsiveOptions" :showIndicators="false"
                    :showNavigators="false" circular :autoplayInterval="9000">
                    <template #item="slotProps">
                        <div class="flex justify-center px-1.5 py-2 sm:px-2">
                            <article
                                class="relative flex min-h-[560px] w-full max-w-[672px] flex-col overflow-hidden rounded-[16px] border border-white bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] sm:min-h-[620px] lg:min-h-[674px]">
                                <div class="px-5 pt-6 sm:px-7 sm:pt-8">
                                    <p class="text-[28px] uppercase leading-[0.95] text-black sm:text-[36px] lg:text-[48px]"
                                        style="font-family: 'Bebas Neue', sans-serif;">
                                        {{ slotProps.data.name }}
                                    </p>
                                    <p class="mt-4 text-sm leading-6 text-[#444955] sm:text-[15px] sm:leading-6 lg:w-[92%] lg:text-base lg:leading-[20px]">
                                        {{ slotProps.data.description }}
                                    </p>
                                    <p class="mt-4 max-w-[420px] text-sm italic leading-6 text-[#737780] sm:text-[15px] sm:leading-6 lg:text-base lg:leading-[20px]">
                                        {{ slotProps.data.quote }}
                                    </p>
                                    <p class="mt-2 text-xs leading-5 text-[#737780] sm:text-[12px] sm:leading-5">
                                        {{ slotProps.data.org }}
                                    </p>

                                    <button
                                        class="mt-4 h-10 w-full max-w-[190px] rounded-[999px] text-base text-white shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] sm:h-11 sm:max-w-[205px] sm:text-lg lg:h-12 lg:max-w-[210px] lg:text-[22px]"
                                        style="background-image: linear-gradient(168deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%), linear-gradient(90deg, rgb(34, 37, 43) 0%, rgb(34, 37, 43) 100%);">
                                        More Details
                                    </button>
                                </div>

                                <div class="mt-auto h-[220px] overflow-hidden sm:h-[250px] md:h-[280px] lg:h-[309px]">
                                    <img alt=""
                                        class="h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
                                        :src="slotProps.data.image" />
                                </div>

                                <div
                                    class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-2px_0px_2px_0px_rgba(255,255,255,0.2),inset_3px_3px_2px_0px_rgba(255,255,255,0.1)]" />
                            </article>
                        </div>
                    </template>
                </Carousel>
            </div>

            <div class="relative mt-12 flex items-center justify-center sm:mt-16 lg:mt-24">
                <img alt="" class="h-[280px] w-[320px] sm:h-[420px] sm:w-[480px] lg:h-[563px] lg:w-[648px]" :src="impact.quoteMark" />
                <p class="absolute max-w-[290px] text-center text-[24px] italic leading-[1.18] text-[#dadbdd] sm:max-w-[420px] sm:text-[34px] lg:max-w-[510px] lg:text-[44.89px] lg:leading-[54.866px]">
                    “There’s a thrill to discovering pieces connected to athletes I grew up watching. Collectivault
                    makes the search simple, and the quality of the finds is unmatched.”
                </p>
            </div>

            <div class="mt-14 sm:mt-20 lg:mt-28">
                <img alt="" class="relative left-1/2 h-[320px] w-[100dvw] max-w-none -translate-x-1/2 object-cover sm:h-[480px] lg:h-[700px] xl:h-[851px]"
                    :src="impact.bottomImage" />
            </div>
        </div>
    </section>
</template>

<style scoped>
:deep(.impact-carousel .p-carousel-item) {
    padding: 0;
}

:deep(.impact-carousel .p-carousel-item-list),
:deep(.impact-carousel .p-carousel-item-list-container) {
    margin: 0;
    padding: 0;
}
</style>
