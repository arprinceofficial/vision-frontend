<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const heroBg = '/assets/images/citizen/the-vault/detail/spotlight-bg.jpg'
const helmetThumb = '/assets/images/citizen/the-vault/detail/helmet-thumb.png'
const heartIcon = '/assets/images/citizen/the-vault/detail/heart-icon.svg'
const daysIcon = '/assets/images/citizen/the-vault/detail/days-icon.svg'
const cardHelmet = '/assets/images/citizen/the-vault/detail/icon-item-02.jpg'

const baseWidth = 1512
const baseHeight = 1087

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
</script>

<template>
    <section class="relative overflow-hidden bg-black">
        <div class="relative lg:hidden">
            <div class="relative min-h-[980px] sm:min-h-[1040px]">
                <img :src="heroBg" alt="Lewis Hamilton" class="absolute inset-0 h-full w-full object-cover">
                <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.85)_100%)]" />

                <div class="relative mx-auto w-full max-w-[1512px] px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
                    <p
                        class="bg-[linear-gradient(158.49deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.2rem,7.4vw,4.2rem)] leading-[0.86] tracking-[-0.02em] text-transparent">
                        &quot;BILLION DOLLAR MAN&quot;
                    </p>

                    <p
                        class="mt-4 [font-family:var(--font-family-Headings)] text-[clamp(1.5rem,5vw,2.8rem)] leading-[0.95] text-white/90">
                        LEWIS HAMILTON HELMET - FUJI 2007
                    </p>

                    <p class="mt-4 max-w-[52ch] text-[clamp(0.95rem,2.6vw,1.15rem)] leading-[1.45] text-[#dadbdd]">
                        Experience a collector&apos;s masterpiece inspired by one of Lewis Hamilton&apos;s most iconic helmet
                        designs.
                        The Fuji 07 edition blends racing heritage with precision craftsmanship, making it a must own piece for
                        fans,
                        collectors and motorsport enthusiasts.
                    </p>

                    <div class="mt-6 size-[112px] overflow-hidden shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:size-[132px]">
                        <img :src="helmetThumb" alt="Helmet thumb" class="size-full object-cover">
                    </div>

                    <article
                        class="relative mt-7 w-full overflow-hidden rounded-[16px] border border-white shadow-[0px_4px_24px_rgba(0,0,0,0.4)] sm:max-w-[441px]">
                        <div class="absolute inset-0 backdrop-blur-[5px]"
                            style="background-image: linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%), linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) 100%);" />

                        <div class="relative p-2">
                            <div class="h-[220px] overflow-hidden rounded-[16px] bg-white sm:h-[260px]">
                                <img :src="cardHelmet" alt="Lewis helmet" class="h-full w-full object-cover">
                            </div>
                        </div>

                        <button type="button"
                            class="absolute right-4 top-4 flex size-[32px] items-center justify-center rounded-full bg-black/50 p-[8px]">
                            <img :src="heartIcon" alt="Heart" class="size-[16px]">
                        </button>

                        <div class="relative z-10 px-6 pb-6 pt-3">
                            <p class="[font-family:var(--font-family-Headings)] text-[clamp(1.9rem,7vw,3.4rem)] leading-[0.86] text-white">
                                £4,500
                            </p>

                            <div class="pt-3">
                                <div
                                    class="inline-flex h-[44px] max-w-full items-center justify-center gap-3 rounded-[999px] bg-white py-[4px] pl-[8px] pr-[16px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                                    <span class="flex size-[28px] items-center justify-center rounded-full bg-black p-[6px]">
                                        <img :src="daysIcon" alt="Days" class="size-[16px]">
                                    </span>
                                    <span class="whitespace-nowrap text-[14px] leading-[20px] text-black">3 Days Remaining</span>
                                </div>
                            </div>

                            <div class="pt-3">
                                <button type="button"
                                    class="flex h-[44px] w-full items-center justify-center rounded-[999px] px-[32px] py-[10px] text-[17px] leading-[22px] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)]"
                                    style="background-image: linear-gradient(153.352deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div
                            class="pointer-events-none absolute inset-0 shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
                    </article>
                </div>
            </div>
        </div>

        <div ref="frameRef" class="relative mx-auto hidden w-full max-w-[1512px] overflow-hidden bg-black lg:block" :style="{ height: `${scaledHeight}px` }">
        <div class="absolute left-0 top-0 overflow-hidden" :style="canvasStyle">
        <div class="absolute left-1/2 top-[90px] h-[998px] w-[1746px] -translate-x-1/2">
            <img :src="heroBg" alt="Lewis Hamilton" class="h-full w-full object-cover">
        </div>

        <div class="absolute left-0 top-[76px] h-[1012px] w-[860px] mix-blend-multiply"
            style="background-image: linear-gradient(90deg, #000000 0%, rgba(0,0,0,0) 100%);" />

        <div class="relative mx-auto h-full w-full max-w-[1512px]">
            <p
                class="absolute left-[70px] top-[435px] bg-[linear-gradient(158.49deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[98px] leading-[78px] tracking-[-1.96px] text-transparent">
                &quot;BILLION DOLLAR MAN&quot;
            </p>

            <p
                class="absolute left-[70px] top-[526px] [font-family:var(--font-family-Headings)] text-[48px] leading-[63px] text-white/90">
                LEWIS HAMILTON HELMET - FUJI 2007
            </p>

            <p class="absolute left-[70px] top-[618px] w-[479px] text-[20px] leading-[28px] text-[#dadbdd]">
                Experience a collector&apos;s masterpiece inspired by one of Lewis Hamilton&apos;s most iconic helmet
                designs.
                The Fuji 07 edition blends racing heritage with precision craftsmanship, making it a must own piece for
                fans,
                collectors and motorsport enthusiasts.
            </p>

            <div class="absolute left-[70px] top-[763px] size-[146px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                <img :src="helmetThumb" alt="Helmet thumb" class="size-full object-cover">
            </div>

            <article
                class="absolute left-[999px] top-[207px] h-[674px] w-[441px] overflow-hidden rounded-[16px] border border-white shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
                <div class="absolute inset-0 backdrop-blur-[5px]"
                    style="background-image: linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%), linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) 100%);" />

                <div class="absolute left-[8px] top-[7px] h-[357px] w-[425px] overflow-hidden rounded-[16px] bg-white">
                    <img :src="cardHelmet" alt="Lewis helmet" class="h-full w-full object-cover">
                </div>

                <button type="button"
                    class="absolute right-[16px] top-[16px] flex size-[32px] items-center justify-center rounded-full bg-black/50 p-[8px]">
                    <img :src="heartIcon" alt="Heart" class="size-[16px]">
                </button>

                <p
                    class="absolute left-[38px] top-[418px] [font-family:var(--font-family-Headings)] text-[80px] leading-[63px] text-white">
                    £4,500
                </p>

                <div
                    class="absolute left-[38px] top-[526px] flex h-[48px] w-[260px] items-center justify-center gap-[20px] rounded-[999px] bg-white py-[4px] pl-[10px] pr-[24px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                    <span class="flex size-[32px] items-center justify-center rounded-full bg-black p-[8px]">
                        <img :src="daysIcon" alt="Days" class="size-[20px]">
                    </span>
                    <span class="text-[20px] leading-[25px] text-black">3 Days Remaining</span>
                </div>

                <button type="button"
                    class="absolute left-[38px] top-[590px] flex h-[48px] w-[260px] items-center justify-center rounded-[999px] px-[32px] py-[10px] text-[20px] leading-[30px] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)]"
                    style="background-image: linear-gradient(153.352deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                    Buy Now
                </button>

                <div
                    class="pointer-events-none absolute inset-0 shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
            </article>
        </div>
        </div>
        </div>
    </section>
</template>
