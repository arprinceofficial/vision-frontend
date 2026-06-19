<script setup lang="ts">
const experienceBg = '/assets/images/citizen/fractional-shares/experience-bg.png'
const qrCode = '/assets/images/citizen/the-vault/detail/qr-code.svg'
const psaLogo = '/assets/images/citizen/the-vault/detail/psa-logo.png'
const shieldIcon = '/assets/images/exclusive-drop/begins/shield.svg'
const magnifyIcon = '/assets/images/exclusive-drop/begins/magnify.svg'
const graphIcon = '/assets/images/exclusive-drop/begins/graph-up.svg'

const experiences = [
    {
        title: 'A CHANCE TO MEET THE ICON',
        image: '/assets/images/citizen/fractional-shares/experience-meet.png',
        bullets: ['1:1 meet-and-greets', 'Training ground visits', 'Behind the scenes access']
    },
    {
        title: 'SHAREHOLDER GIVEAWAYS',
        image: '/assets/images/citizen/fractional-shares/experience-giveaway.png',
        bullets: ['Tickets to Races', 'Sideline Experiences', 'Paddock Access']
    },
    {
        title: 'BEHIND THE SCENES',
        image: '/assets/images/citizen/fractional-shares/experience-behind.png',
        bullets: ['Locker Room Insights', 'Pre-Race Rituals', 'Unreleased Footage From Their Career']
    }
]

const psaHighlights = [
    { icon: shieldIcon, text: 'Independent Authentication' },
    { icon: magnifyIcon, text: 'Expert Evaluation' },
    { icon: graphIcon, text: 'Preserves Value' }
]

const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
    <section class="relative overflow-hidden bg-black">
        <div class="relative px-4 pb-16 pt-20 sm:px-6 lg:min-h-[1809px] lg:px-[71px] lg:pb-[48px] lg:pt-[1080px]">
            <img :src="experienceBg" alt="Lewis Hamilton on a race car"
                class="absolute inset-0 h-full w-full object-cover object-bottom">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.2)_100%)]" />

            <div class="relative mx-auto grid w-full max-w-[1371px] grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
                <article class="flex min-h-[320px] flex-col items-center justify-center rounded-[16px] border border-white bg-black/70 p-6 text-center sm:min-h-[360px] lg:min-h-[591px]">
                    <div class="relative flex aspect-square w-full max-w-[220px] items-center justify-center rounded-full border-2 border-[#dadbdd] lg:max-w-[300px]">
                        <div class="absolute inset-[-18px] rounded-full border border-[#dadbdd]/80" />
                        <img :src="psaLogo" alt="PSA" class="w-[128px] opacity-95">
                        <span class="ml-2 [font-family:var(--font-family-Headings)] text-[72px] leading-none text-[#dadbdd] sm:text-[80px]">10</span>
                    </div>
                    <p class="mt-10 text-[28px] font-bold leading-[1.1] text-[#dadbdd] lg:text-[38px]">
                        Certified Authentic
                    </p>
                </article>

                <article class="flex min-h-[320px] flex-col items-center justify-center rounded-[16px] border border-white bg-black/70 p-6 text-center sm:min-h-[360px] lg:min-h-[591px]">
                    <p class="[font-family:var(--font-family-Headings)] text-[60px] uppercase leading-none text-[#dadbdd] sm:text-[72px] lg:text-[100px]">
                        Scan me
                    </p>
                    <img :src="qrCode" alt="Certification QR code" class="mt-8 size-[170px] sm:size-[190px] lg:size-[250px]">
                    <p class="mt-8 max-w-[336px] text-[18px] font-bold leading-7 text-[#dadbdd] lg:text-[21px] lg:leading-8">
                        Scan QR Code for instant access to Certification Verification.
                    </p>
                </article>

                <article class="flex min-h-[320px] flex-col items-center justify-center rounded-[16px] border border-white bg-black/70 p-6 text-center sm:min-h-[360px] lg:min-h-[591px]">
                    <p class="max-w-[330px] text-[22px] font-bold leading-[1.15] text-[#dadbdd] sm:text-[24px] lg:text-[28px]">
                        Independently verified by the world's most trusted grading service:
                    </p>
                    <img :src="psaLogo" alt="PSA" class="mt-8 w-[210px] brightness-0 invert lg:w-[240px]">
                    <div class="mt-8 flex w-full max-w-[358px] flex-col gap-4">
                        <div v-for="item in psaHighlights" :key="item.text"
                            class="flex min-h-[52px] items-center justify-start gap-3 rounded-full bg-[#a1a4aa]/10 px-4 py-3 text-left text-[#dadbdd] shadow-[0px_4px_16px_rgba(0,0,0,0.25)] sm:justify-center sm:gap-4 sm:text-center">
                            <img :src="item.icon" :alt="item.text" class="size-6 shrink-0 brightness-0 invert lg:size-8">
                            <span class="text-[14px] leading-5 sm:text-[16px] sm:leading-6 lg:text-[21px] lg:leading-8">{{ item.text }}</span>
                        </div>
                    </div>
                </article>
            </div>
        </div>

        <div class="bg-[#d4af37] px-4 py-12 text-black sm:px-6 lg:px-[72px] lg:pb-[120px] lg:pt-[60px]">
            <div class="mx-auto w-full max-w-[1371px]">
                <button type="button"
                    class="inline-flex h-12 w-[220px] items-center justify-center rounded-full px-8 py-2 text-[20px] leading-[30px] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)]"
                    style="background-image: linear-gradient(153deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);"
                    @click="backToTop">
                    Back to Top
                </button>

                <div class="mt-20 lg:mt-[137px]">
                    <p class="[font-family:var(--font-family-Headings)] text-[clamp(2.5rem,5vw,4.9375rem)] uppercase leading-[0.8] text-white">
                        The Fractional Shares
                    </p>
                    <h2 class="[font-family:var(--font-family-Headings)] text-[clamp(4rem,8vw,7.6875rem)] uppercase leading-[0.8] text-black">
                        Experience
                    </h2>
                    <p class="mt-7 text-[22px] italic leading-8 lg:text-[32px] lg:leading-10">
                        Own a Share. Access the Experience!
                    </p>
                </div>

                <div class="mt-12 lg:mt-[156px]">
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <article v-for="item in experiences" :key="item.title"
                            class="min-w-0 overflow-hidden rounded-[16px] border border-white bg-white text-black shadow-[0px_4px_8px_rgba(0,0,0,0.25)]">
                            <div class="p-6 sm:p-[38px]">
                                <h3 class="[font-family:var(--font-family-Headings)] text-[clamp(2.25rem,10vw,3rem)] uppercase leading-[0.85]">
                                    {{ item.title }}
                                </h3>
                                <ul class="mt-7 list-disc space-y-1 pl-6 text-[16px] leading-6 text-[#444955] sm:text-[18px] lg:text-[20px] lg:leading-7">
                                    <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
                                </ul>
                                <button type="button"
                                    class="mt-8 inline-flex min-h-12 w-full max-w-[320px] items-center justify-center rounded-full px-6 py-2 text-center text-[18px] leading-6 text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:px-8 sm:text-[20px] sm:leading-[30px] lg:text-[24px]"
                                    style="background-image: linear-gradient(158deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                                    See Terms &amp; Conditions
                                </button>
                            </div>
                            <img :src="item.image" :alt="item.title" class="h-[280px] w-full object-cover sm:h-[320px] lg:h-[420px] 2xl:h-[489px]">
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
