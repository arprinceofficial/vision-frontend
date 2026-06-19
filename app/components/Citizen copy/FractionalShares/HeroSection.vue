<script setup lang="ts">
const heroFrame = '/assets/images/citizen/fractional-shares/hero-frame.png'
const volumeIcon = '/assets/images/citizen/the-vault/detail/volume-icon.svg'

const stats = [
    { label: 'TOTAL VALUE', value: '£20,000' },
    { label: 'PRICE PER SHARE', value: '1% = £200' },
    { label: 'SHARES AVAILABLE', value: '43/100' },
    { label: 'STATUS', value: 'LIVE' }
]
</script>

<template>
    <section class="relative overflow-hidden bg-black">
        <div class="relative h-[720px] min-h-[620px] lg:h-[985px]">
            <img :src="heroFrame" alt="Lewis Hamilton wearing a racing suit"
                class="absolute inset-0 h-full w-full object-cover object-center">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.78)_100%)]" />

            <button type="button"
                class="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/50 p-2 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:right-6 sm:top-6 lg:right-[72px] lg:top-[58px]">
                <img :src="volumeIcon" alt="Volume" class="size-4">
            </button>

            <div class="relative mx-auto flex h-full w-full max-w-[1512px] flex-col justify-end px-4 pb-[168px] sm:px-6 lg:px-[63px] lg:pb-[164px]">
                <h1 class="[font-family:var(--font-family-Headings)] uppercase drop-shadow-[0px_4px_24px_rgba(0,0,0,0.35)]">
                    <span
                        class="block max-w-full bg-[linear-gradient(155deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-[clamp(2.75rem,12vw,9.625rem)] leading-[0.8] text-transparent">
                        Lewis Hamilton&rsquo;s
                    </span>
                    <span class="block max-w-full text-[clamp(2.75rem,12vw,9.625rem)] leading-[0.8] text-white/90">
                        Racing Suit
                    </span>
                </h1>

                <button type="button"
                    class="mt-8 inline-flex h-12 w-full max-w-[260px] items-center justify-center rounded-full px-8 py-2 text-[20px] leading-[30px] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)] lg:absolute lg:bottom-[156px] lg:right-[72px]"
                    style="background-image: linear-gradient(153deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                    Share
                </button>
            </div>

            <div class="absolute inset-x-0 bottom-0 bg-[#111215]">
                <div class="mx-auto grid w-full max-w-[1512px] grid-cols-2 gap-y-6 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:px-[68px] lg:py-[17px]">
                    <div v-for="(item, index) in stats" :key="item.label"
                        class="relative flex flex-col items-center justify-center gap-2 text-center lg:min-h-[94px]"
                        :class="index > 0 ? 'lg:border-l lg:border-white/25' : ''">
                        <p class="text-[12px] font-semibold leading-4 text-[#d0d1d4] sm:text-[16px] sm:leading-5">
                            {{ item.label }}
                        </p>
                        <p class="[font-family:var(--font-family-Headings)] text-[clamp(1.9rem,8vw,3.9375rem)] leading-none text-[#00d7a5]">
                            {{ item.value }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
