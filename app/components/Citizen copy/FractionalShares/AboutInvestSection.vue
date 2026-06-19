<script setup lang="ts">
import { computed, ref } from 'vue'

const shareCount = ref(3)
const sharePrice = 200
const maxShares = 43

const ownership = computed(() => `${shareCount.value}%`)
const totalCost = computed(() => `£${(shareCount.value * sharePrice).toLocaleString('en-GB')}`)
const pieStyle = computed(() => ({
    background: `conic-gradient(from 23deg, #d4af37 0deg ${shareCount.value * 3.6}deg, transparent ${shareCount.value * 3.6}deg 360deg)`
}))

const cards = [
    {
        title: 'OWN A FRACTION OF THE COLLECTIBLE',
        body: 'Instead of purchasing an entire collectible, you buy shares, which are small, affordable fractions of the item that give you real partial ownership.'
    },
    {
        title: 'OWNERSHIP & PROFIT POTENTIAL',
        body: 'Each share is authenticated and recorded, proving your stake, and you earn your proportional share of any future resale profits.'
    },
    {
        title: 'TRADE EASILY, STORE SECURELY',
        body: 'You can easily buy, hold, or sell your shares on Collectivault while the physical collectible stays professionally stored, insured, and protected in a secure vault.'
    }
]

const decreaseShares = () => {
    shareCount.value = Math.max(1, shareCount.value - 1)
}

const increaseShares = () => {
    shareCount.value = Math.min(maxShares, shareCount.value + 1)
}
</script>

<template>
    <section class="bg-black px-4 py-14 sm:px-6 sm:py-16 lg:px-[71px] lg:py-[120px]">
        <div class="mx-auto w-full max-w-[1371px]">
            <h2
                class="[font-family:var(--font-family-Headings)] text-[clamp(2.35rem,10vw,6.125rem)] uppercase leading-[0.85] text-white/90">
                About
                <span class="bg-[linear-gradient(155deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                    Fractional Shares
                </span>
            </h2>

            <div class="mt-10 grid grid-cols-1 gap-5 lg:mt-[77px] lg:grid-cols-3 lg:gap-6">
                <article v-for="card in cards" :key="card.title"
                    class="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[16px] border border-white bg-[rgba(180,174,165,0.1)] p-6 text-center shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)] backdrop-blur-[50px] lg:min-h-[429px] lg:px-8">
                    <h3
                        class="max-w-[360px] bg-[linear-gradient(137deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2rem,9vw,3.9375rem)] uppercase leading-[0.85] text-transparent">
                        {{ card.title }}
                    </h3>
                    <p class="mt-8 max-w-[347px] text-[16px] leading-6 text-[#d0d1d4] lg:mt-11 lg:text-[20px] lg:leading-7">
                        {{ card.body }}
                    </p>
                </article>
            </div>

            <h2
                class="mt-16 [font-family:var(--font-family-Headings)] text-[clamp(2.25rem,9vw,4.9375rem)] uppercase leading-[0.85] text-white/90 lg:mt-[114px]">
                Ready to invest?
            </h2>

            <div class="mt-7 grid gap-6 rounded-[16px] bg-[rgba(218,219,221,0.2)] p-4 shadow-[0px_4px_40px_8px_rgba(0,0,0,0.4)] sm:p-6 lg:grid-cols-2 lg:p-[68px]">
                <div class="flex min-h-[280px] items-center justify-center rounded-[16px] bg-black/30 p-4 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] backdrop-blur sm:min-h-[360px] sm:p-6">
                    <div class="relative flex aspect-square w-full max-w-[260px] items-center justify-center rounded-full p-[3px] sm:max-w-[340px] lg:max-w-[398px]" :style="pieStyle">
                        <div class="absolute inset-[3px] rounded-full border-2 border-[#dadbdd]" />
                        <div class="flex size-[calc(100%-32px)] items-center justify-center rounded-full bg-[#1e1e1f]">
                            <span
                                class="bg-[linear-gradient(111deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(3.2rem,16vw,7.6875rem)] leading-none text-transparent">
                                {{ ownership }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex min-h-[320px] items-center justify-center rounded-[16px] bg-black/30 p-4 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] backdrop-blur sm:min-h-[360px] sm:p-6">
                    <div class="w-full max-w-[460px]">
                        <div class="flex items-center justify-center gap-5 sm:gap-[88px]">
                            <button type="button"
                                class="flex size-14 items-center justify-center rounded-full bg-white/20 text-[36px] leading-none text-white shadow-[0px_6px_24px_rgba(0,0,0,0.25)] sm:size-[81px] sm:text-[42px]"
                                aria-label="Decrease shares" @click="decreaseShares">
                                -
                            </button>
                            <span class="[font-family:var(--font-family-Headings)] text-[72px] leading-none text-white sm:text-[100px]">
                                {{ shareCount }}
                            </span>
                            <button type="button"
                                class="flex size-14 items-center justify-center rounded-full bg-white/20 text-[36px] leading-none text-white shadow-[0px_6px_24px_rgba(0,0,0,0.25)] sm:size-[81px] sm:text-[42px]"
                                aria-label="Increase shares" @click="increaseShares">
                                +
                            </button>
                        </div>

                        <div class="mt-10 divide-y divide-white/50 border-y border-white/50 text-[18px] leading-7 text-white lg:mt-12 lg:text-[20px]">
                            <div class="flex items-center justify-between py-3">
                                <span>Ownership:</span>
                                <strong>{{ ownership }}</strong>
                            </div>
                            <div class="flex items-center justify-between py-3">
                                <span>Total Cost:</span>
                                <strong>{{ totalCost }}</strong>
                            </div>
                        </div>

                        <button type="button"
                            class="mt-7 flex h-14 w-full items-center justify-center rounded-full px-6 py-2 text-[22px] font-semibold leading-[30px] text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:h-20 sm:text-[32px]"
                            style="background-image: linear-gradient(147deg,#bc9a1d 28.673%,#d4af37 71.327%);">
                            Buy Shares
                        </button>
                        <p class="mt-5 text-center text-[13px] leading-5 text-white sm:text-[16px]">
                            Your ownership will be recorded immediately after purchase.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
