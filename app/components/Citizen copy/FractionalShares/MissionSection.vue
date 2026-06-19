<script setup lang="ts">
const missionLogo = '/assets/images/citizen/fractional-shares/mission44.png'
const museumBg = '/assets/images/citizen/fractional-shares/museum-bg.png'

const cards = [
    {
        title: 'ABOUT',
        body: 'Each item is entrusted to our platform by the icon who owns it. Alongside the sale, they select a grassroots charity to support. At least 10% of the profit goes directly to that cause, often more, depending on their choice.',
        strong: 'Your purchase helps make a difference beyond the item itself.'
    },
    {
        title: 'CHARITY SPOTLIGHT',
        body: 'Lewis Hamilton’s chosen charity is Mission 44, a grassroots organisation dedicated to empowering underrepresented young people across the UK.',
        strong: 'Mission 44 provides access to education, mentorship, leadership development, and opportunities to help the next generation succeed both on and off the track.'
    }
]
</script>

<template>
    <section class="bg-black">
        <div class="px-4 py-14 sm:px-6 lg:px-[72px] lg:py-[120px]">
            <div class="mx-auto w-full max-w-[1371px]">
                <div class="h-[100px] overflow-hidden sm:h-[150px] lg:h-[205px]">
                    <img :src="missionLogo" alt="Mission 44" class="h-full w-full object-contain opacity-80">
                </div>

                <NuxtLink to="/icons"
                    class="mt-8 inline-flex h-12 w-full max-w-[260px] items-center justify-center rounded-full px-8 py-2 text-[20px] leading-[30px] text-white shadow-[0px_6px_24px_rgba(0,0,0,0.25)] lg:mt-[43px] lg:text-[24px]"
                    style="background-image: linear-gradient(-34deg, rgba(255,255,255,0) 28.673%, rgba(255,255,255,0.1) 71.327%), linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%);">
                    Find Out More
                </NuxtLink>

                <div class="mt-12 grid grid-cols-1 gap-6 lg:mt-[96px] lg:grid-cols-2 lg:gap-[60px]">
                    <article v-for="card in cards" :key="card.title"
                        class="rounded-[16px] border border-white bg-[rgba(34,37,43,0.5)] p-6 text-center shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)] backdrop-blur-[50px] sm:p-10 lg:min-h-[368px] lg:px-[70px] lg:py-[58px]">
                        <h2
                            class="bg-[linear-gradient(156deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.5rem,5vw,3.9375rem)] uppercase leading-[0.8] text-transparent">
                            {{ card.title }}
                        </h2>
                        <p class="mt-8 text-[16px] leading-6 text-[#d0d1d4] lg:text-[20px] lg:leading-7">
                            {{ card.body }}
                        </p>
                        <p class="mt-6 text-[16px] font-semibold leading-6 text-[#d0d1d4] lg:text-[20px] lg:leading-7">
                            {{ card.strong }}
                        </p>
                    </article>
                </div>
            </div>
        </div>

        <div class="relative h-[320px] overflow-hidden sm:h-[520px] lg:h-[844px]">
            <img :src="museumBg" alt="Mission 44 Silverstone Museum visit"
                class="absolute inset-0 h-full w-full object-cover object-center">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_56%,rgba(0,0,0,0.28)_100%)]" />
        </div>
    </section>
</template>
