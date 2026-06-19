<script setup lang="ts">
const suitHero = '/assets/images/citizen/congratulations/suit-hero.png'

const stats = [
    { label: 'TOTAL VALUE', value: '£20,000' },
    { label: 'PRICE PER SHARE', value: '1% = £200' },
    { label: 'SHARES AVAILABLE', value: '40/100' },
    { label: 'YOUR SHARES', value: '3% = £600' }
]
</script>

<template>
    <section class="bg-black">
        <div class="mx-auto w-full max-w-[1512px] px-4 py-16 sm:px-6 lg:px-[72px] lg:pb-[74px] lg:pt-[100px]">
            <p
                class="bg-[linear-gradient(144deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(4rem,8vw,7.6875rem)] uppercase leading-[0.8] text-transparent">
                Lewis Hamilton
            </p>
            <h2 class="mt-2 [font-family:var(--font-family-Headings)] text-[clamp(2rem,4vw,3rem)] uppercase leading-none text-[#dadbdd]">
                Mercedes-AMG Petronas - Racing Suit
            </h2>
        </div>

        <div class="relative h-[360px] overflow-hidden sm:h-[560px] lg:h-[854px]">
            <img :src="suitHero" alt="Lewis Hamilton racing suit displayed in Collectivault"
                class="absolute inset-0 h-full w-full object-cover object-center">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_70%,rgba(0,0,0,0.34)_100%)]" />
        </div>

        <div class="bg-[#111215]">
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
    </section>
</template>
