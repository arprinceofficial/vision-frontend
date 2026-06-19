<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface VaultCardProps {
    title: string
    athlete: string
    price: string
    daysText: string
    imageUrl: string
    imageLeft: string
    imageTop: string
    imageWidth: string
    imageHeight: string
    leftGradientWidth: number
    topGradientHeight?: number
    topGradientOffset?: number
    overlayMode?: 'solid' | 'tinted'
}

const props = withDefaults(defineProps<VaultCardProps>(), {
    topGradientHeight: 0,
    topGradientOffset: 0,
    overlayMode: 'solid'
})

const baseWidth = 1513
const baseHeight = 985

const frameRef = ref<HTMLElement | null>(null)
const frameWidth = ref(baseWidth)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
    if (!frameRef.value) {
        return
    }

    resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
            return
        }
        frameWidth.value = Math.min(entry.contentRect.width, baseWidth)
    })

    resizeObserver.observe(frameRef.value)
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})

const scale = computed(() => {
    return Math.min(frameWidth.value / baseWidth, 1)
})

const scaledHeight = computed(() => {
    return Math.round(baseHeight * scale.value)
})

const canvasStyle = computed(() => {
    return {
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        transform: `scale(${scale.value})`,
        transformOrigin: 'top left'
    }
})

const dayIcon = '/assets/images/citizen/the-vault/days-icon.png'
const arrowIcon = '/assets/images/citizen/the-vault/arrow-icon.png'

const imageStyle = computed(() => ({
    left: props.imageLeft,
    top: props.imageTop,
    width: props.imageWidth,
    height: props.imageHeight
}))

const overlayStyle = computed(() => {
    if (props.overlayMode === 'tinted') {
        return {
            backgroundImage:
                'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 20.673%), linear-gradient(90deg, rgb(17, 18, 21) 0%, rgb(17, 18, 21) 100%)'
        }
    }

    return {
        backgroundColor: 'rgb(17, 18, 21)'
    }
})
</script>

<template>
    <article class="relative w-full overflow-hidden">
        <div class="relative h-[500px] sm:h-[620px] lg:hidden">
            <div class="absolute inset-0 backdrop-blur-[50px]" :style="overlayStyle" />

            <div class="absolute inset-0 overflow-hidden">
                <img :src="imageUrl" alt="Vault item" class="h-full w-full object-cover">
            </div>

            <div class="absolute left-0 top-0 h-full mix-blend-multiply"
                :style="{ width: `min(78vw, ${leftGradientWidth}px)`, backgroundImage: 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)' }" />

            <div class="relative z-10 flex h-full flex-col justify-between p-4 sm:p-6">
                <div class="w-[82%] max-w-[22rem]">
                    <p
                        class="[font-family:var(--font-family-Headings)] text-[clamp(1.45rem,6.4vw,2.75rem)] leading-[0.85] tracking-[-1px] text-white/90">
                        {{ title }}
                    </p>
                    <p
                        class="mt-1 bg-[linear-gradient(165.891deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(0.9rem,3.2vw,1.5rem)] leading-[1.05] text-transparent">
                        {{ athlete }}
                    </p>

                    <button type="button"
                        class="mt-3 flex h-8 w-[146px] items-center justify-center gap-1 rounded-[999px] px-4 py-2 text-[13px] leading-[1] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:h-9 sm:w-[164px] sm:text-[14px]"
                        style="background-image: linear-gradient(153.958deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                        Discover More
                        <img :src="arrowIcon" alt="Arrow" class="h-4 w-4">
                    </button>
                </div>

                <!-- Parent Container: Stacked on mobile, side-by-side on desktop -->
                <div
                    class="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">

                    <p
                        class="bg-[linear-gradient(130.372deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(1.45rem,5.8vw,3.9375rem)] leading-[1] text-transparent">
                        {{ price }}
                    </p>

                    <div
                        class="flex h-10 items-center justify-center gap-2 rounded-[999px] bg-white py-1 pl-2 pr-3 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:h-11">
                        <span
                            class="flex h-7 w-7 items-center justify-center rounded-full bg-black p-[6px] sm:h-8 sm:w-8 sm:p-[8px]">
                            <img :src="dayIcon" alt="Days" class="h-4 w-4">
                        </span>
                        <span class="whitespace-nowrap text-[clamp(0.78rem,2vw,1.25rem)] leading-[1.2] text-black">
                            {{ daysText }}
                        </span>
                    </div>

                </div>
            </div>

            <div
                class="pointer-events-none absolute inset-0 shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
        </div>

        <div ref="frameRef" class="relative mx-auto hidden w-full max-w-[1513px] lg:block"
            :style="{ height: `${scaledHeight}px` }">
            <div class="absolute left-0 top-0 overflow-hidden" :style="canvasStyle">
                <div class="absolute inset-0 backdrop-blur-[50px]" :style="overlayStyle" />

                <div class="absolute inset-0 overflow-hidden">
                    <img :src="imageUrl" alt="Vault item" class="absolute max-w-none" :style="imageStyle">
                </div>

                <div class="absolute left-0 top-0 mix-blend-multiply"
                    :style="{ width: `${leftGradientWidth}px`, height: '985px', backgroundImage: 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)' }" />

                <div v-if="topGradientHeight && topGradientHeight > 0" class="absolute left-0 w-full mix-blend-multiply"
                    :style="{ height: `${topGradientHeight}px`, top: `${topGradientOffset}px`, backgroundImage: 'linear-gradient(180deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)' }" />

                <div class="absolute left-[68px] top-[91px] flex w-[499px] flex-col items-start gap-[18px]">
                    <p
                        class="[font-family:var(--font-family-Headings)] text-[98px] leading-[78px] tracking-[-1.96px] text-white/90">
                        {{ title }}
                    </p>
                    <p
                        class="bg-[linear-gradient(165.891deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[48px] leading-[63px] text-transparent">
                        {{ athlete }}
                    </p>

                    <button type="button"
                        class="flex h-[32px] w-[178px] items-center justify-center gap-[4px] rounded-[999px] px-[24px] py-[10px] text-[16px] leading-[20px] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)]"
                        style="background-image: linear-gradient(153.958deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                        Discover More
                        <img :src="arrowIcon" alt="Arrow" class="h-[20px] w-[20px]">
                    </button>
                </div>

                <p
                    class="absolute left-[64px] top-[899px] -translate-y-1/2 bg-[linear-gradient(130.372deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[63px] leading-[63px] text-transparent">
                    {{ price }}
                </p>

                <div
                    class="absolute right-[64px] top-[873px] flex h-[48px] items-center justify-center gap-[10px] rounded-[999px] bg-white py-[4px] pl-[10px] pr-[24px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                    <span class="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-black p-[8px]">
                        <img :src="dayIcon" alt="Days" class="h-[20px] w-[20px]">
                    </span>
                    <span class="text-[20px] leading-[25px] text-black">{{ daysText }}</span>
                </div>

                <div
                    class="pointer-events-none absolute inset-0 shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
            </div>
        </div>
    </article>
</template>
