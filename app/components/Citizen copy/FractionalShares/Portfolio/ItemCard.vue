<script setup lang="ts">
import { computed } from 'vue'

type PortfolioItem = {
    title: string
    owner: string
    year: string
    valueLabel: string
    value: string
    image: string
    imageAlt: string
    authenticated?: boolean
    imageMode?: 'cover' | 'contain'
    shares?: string
    valueTone?: 'gold' | 'mint'
}

const props = withDefaults(defineProps<{
    item: PortfolioItem
    actionLabel?: string
}>(), {
    actionLabel: 'View Certificate'
})

const isContainedImage = computed(() => props.item.imageMode === 'contain')
const valueClass = computed(() => {
    if (props.item.valueTone === 'gold') {
        return 'bg-[linear-gradient(135deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent'
    }

    return 'text-[#00d7a5]'
})
const imageClass = computed(() => {
    return isContainedImage.value
        ? 'mx-auto h-full w-full object-contain object-center opacity-95'
        : 'h-full w-full object-cover object-center'
})
const imageFrameStyle = computed(() => {
    if (!isContainedImage.value) return undefined

    return 'background: radial-gradient(circle at 50% 45%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 32%, rgba(0,0,0,0) 58%), #08090a;'
})
</script>

<template>
    <article class="min-w-0 overflow-hidden rounded-[14px] border border-white bg-white text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:rounded-[16px]">
        <div class="relative aspect-[1.08/1] overflow-hidden bg-[#08090a] sm:aspect-[16/10] md:aspect-[16/8.5] lg:aspect-[1371/661]"
            :style="imageFrameStyle">
            <img :src="item.image" :alt="item.imageAlt" :class="imageClass">
            <div class="pointer-events-none absolute inset-0"
                :class="isContainedImage
                    ? 'bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0)_48%,rgba(0,0,0,0.18)_100%)]'
                    : 'bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0)_45%,rgba(0,0,0,0.08)_100%)]'" />

            <div v-if="item.authenticated"
                class="absolute bottom-4 left-4 inline-flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-full bg-white px-3 text-[10px] font-semibold leading-4 text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:bottom-8 sm:left-8 sm:h-10 sm:min-w-[138px] sm:px-4 sm:text-[12px]">
                <span class="whitespace-nowrap">Authenticated</span>
                <span class="flex size-5 items-center justify-center rounded-full bg-black text-white sm:size-6">
                    <svg aria-hidden="true" viewBox="0 0 24 24" class="size-3.5 sm:size-4">
                        <path d="M12 3.5 18.5 6v5.2c0 4.1-2.6 7.8-6.5 9.3-3.9-1.5-6.5-5.2-6.5-9.3V6L12 3.5Z"
                            fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.7" />
                        <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="1.7" />
                    </svg>
                </span>
            </div>

            <div v-if="item.shares" class="absolute bottom-5 left-4 max-w-[76%] sm:bottom-9 sm:left-8">
                <p class="text-[10px] font-semibold uppercase leading-4 text-[#d0d1d4] sm:text-[14px]">
                    Your Shares
                </p>
                <p class="[font-family:var(--font-family-Headings)] text-[clamp(2rem,10vw,3.9375rem)] leading-none text-[#00d7a5] sm:text-[clamp(2.75rem,7vw,3.9375rem)]">
                    {{ item.shares }}
                </p>
            </div>
        </div>

        <div class="min-w-0 p-5 sm:p-8 lg:px-12 lg:pb-11 lg:pt-9">
            <h3
                class="[font-family:var(--font-family-Headings)] text-[clamp(2.15rem,12vw,4.9375rem)] uppercase leading-[0.85] text-black sm:text-[clamp(2.75rem,7vw,4.9375rem)]">
                {{ item.title }}
            </h3>
            <p class="mt-3 text-[20px] leading-7 text-[#333740] sm:text-[30px] lg:text-[36px]">
                {{ item.owner }}
            </p>
            <p class="mt-1 text-[16px] leading-6 text-[#737780] sm:text-[22px] lg:text-[24px]">
                Year: {{ item.year }}
            </p>

            <div class="mt-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div class="flex flex-wrap items-end gap-x-4 gap-y-1">
                    <span class="text-[16px] leading-7 text-[#737780] sm:text-[22px] lg:text-[24px]">
                        {{ item.valueLabel }}
                    </span>
                    <span
                        class="[font-family:var(--font-family-Headings)] text-[clamp(2.2rem,11vw,3.9375rem)] leading-none sm:text-[clamp(2.75rem,7vw,3.9375rem)]"
                        :class="valueClass">
                        {{ item.value }}
                    </span>
                </div>
                <button type="button"
                    class="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-full px-6 py-2 text-[16px] leading-[30px] text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:h-12 sm:px-8 sm:text-[20px] md:w-[289px]"
                    style="background-image: linear-gradient(149deg,#bc9a1d 28.673%,#d4af37 71.327%);">
                    {{ actionLabel }}
                </button>
            </div>
        </div>
    </article>
</template>
