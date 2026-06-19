<script setup lang="ts">
const heroVideo = '/assets/videos/hero-background.mp4'
const arrow = '/assets/images/citizen/the-vault/detail/slider-arrow.svg'
const dots = '/assets/images/citizen/the-vault/detail/gallery-dots.svg'

const thumbs = [
    '/assets/images/citizen/the-vault/detail/gallery-thumb-02.jpg',
    '/assets/images/citizen/the-vault/detail/gallery-thumb-01.jpg',
    '/assets/images/citizen/the-vault/detail/icon-item-02.jpg',
    '/assets/images/citizen/the-vault/detail/gallery-thumb-03.jpg'
]
</script>

<template>
    <section class="bg-black px-3 pb-10 sm:px-6 sm:pb-14 lg:px-[72px] lg:pb-[120px]">
        <div class="mx-auto w-full max-w-[1371px]">
            <div class="relative h-[260px] overflow-hidden rounded-[16px] bg-[#0f1012] sm:h-[420px] sm:rounded-[20px] lg:h-[647.439px] lg:rounded-[24px]">
                <video class="absolute inset-0 h-full w-full object-cover" :src="heroVideo" autoplay muted loop
                    playsinline preload="auto" />
                <div class="absolute inset-0 bg-black/40" />

                <button type="button"
                    class="absolute left-3 top-1/2 flex h-8 w-4 -translate-y-1/2 items-center justify-center sm:left-5 sm:h-9 sm:w-5 lg:left-[70.87px] lg:h-[40px] lg:w-[20px]">
                    <img :src="arrow" alt="Next" class="h-full w-full">
                </button>

                <button type="button"
                    class="absolute right-3 top-1/2 flex h-8 w-4 -translate-y-1/2 items-center justify-center sm:right-5 sm:h-9 sm:w-5 lg:right-[70.87px] lg:h-[40px] lg:w-[20px]">
                    <img :src="arrow" alt="Previous" class="h-full w-full rotate-180">
                </button>

                <img :src="dots" alt="Dots" class="absolute bottom-4 left-1/2 h-[10px] w-[82px] -translate-x-1/2 sm:bottom-5 sm:h-[11px] sm:w-[96px] lg:top-[584px] lg:bottom-auto lg:h-[12px] lg:w-[108px]">
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-[8px] lg:mt-[19px]">
                <div v-for="(thumb, index) in thumbs" :key="thumb"
                    class="relative h-[120px] overflow-hidden rounded-[12px] sm:h-[180px] sm:rounded-[14px] lg:h-[323.57px] lg:rounded-[20px]"
                    :class="index === 2 ? 'border-[3px] border-white' : ''">
                    <img :src="thumb" alt="Gallery item" class="h-full w-full object-cover">
                </div>
            </div>
        </div>
    </section>
</template>
