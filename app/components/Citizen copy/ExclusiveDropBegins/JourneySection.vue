<script setup lang="ts">
const clues = [
    {
        titleTop: 'THE',
        titleBottom: 'LIST',
        icon: '/assets/images/exclusive-drop/begins/list-icon.svg',
        description: 'Join the Watch List to get exclusive access to a secret item. Only those on the list can follow the reveal each day and participate in bidding.'
    },
    {
        titleTop: 'THE',
        titleBottom: 'COUNTDOWN',
        icon: '/assets/images/exclusive-drop/begins/timer-icon.svg',
        description: 'Over 4 days, clues are revealed step-by-step. At the end, those on the Watch List see the full item and have 24 hours to decide before bidding opens.'
    },
    {
        titleTop: 'THE',
        titleBottom: 'DROP',
        icon: '/assets/images/exclusive-drop/begins/trophy-icon.svg',
        description: 'After the 24 hour decision period, bidding opens for 24 hours. Place your bid to own the item.'
    }
]
</script>

<template>
    <section class="px-3 py-6 sm:px-6 sm:py-8 lg:px-[72px] lg:py-12">
        <div class="mx-auto w-full max-w-[1512px]">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
                <article v-for="item in clues" :key="item.titleBottom"
                    class="flex min-h-[16rem] flex-col items-center justify-center rounded-xl border border-white/35 bg-[rgba(180,174,165,0.1)] p-4 text-center shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0px_2px_rgba(255,255,255,0.2)] sm:min-h-[19rem] sm:p-5 lg:min-h-[30rem] lg:rounded-2xl lg:p-6">
                    <img :src="item.icon" :alt="item.titleBottom"
                        class="mx-auto h-10 w-10 sm:h-12 sm:w-12 lg:h-20 lg:w-20">
                    <p
                        class="mt-3 font-['Bebas_Neue'] text-[clamp(1.5rem,4vw,3rem)] uppercase leading-none text-white lg:mt-5">
                        {{ item.titleTop }}</p>
                    <p
                        class="font-['Bebas_Neue'] text-[clamp(1.6rem,4.3vw,3rem)] uppercase leading-none text-[#d4af37]">
                        {{ item.titleBottom }}</p>
                    <p
                        class="mt-2 max-w-[44ch] text-[clamp(0.85rem,2.1vw,1.125rem)] leading-[1.35] text-[#d0d1d4] lg:mt-4">
                        {{ item.description }}</p>
                </article>
            </div>
        </div>
    </section>
</template>
