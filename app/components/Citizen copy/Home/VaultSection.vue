<script setup lang="ts">
const vaultCard1Image = '/assets/images/citizen/home/vault-card-1.png'
const vaultCard2Image = '/assets/images/citizen/home/vault-card-2.png'
const vaultBottomImage = '/assets/images/citizen/home/vault-bottom.png'

const vaultCards = [
    {
        title: 'London 2012: Olympic Race Spikes',
        athlete: 'Mo Farah',
        price: '£6,500',
        reserved: true,
        image: vaultCard1Image
    },
    {
        title: 'Wimbledon 2013: Tennis Racket',
        athlete: 'Andy Murray',
        price: '£9,000',
        reserved: true,
        image: vaultCard2Image
    }
]
</script>

<template>
    <section class="bg-[#dadbdd]">
        <div class="mx-auto w-full max-w-[1512px] px-4 pt-16 sm:px-8 sm:pt-20 lg:px-[72px] lg:pt-[199px]">
            <div>
                <div class="m-0 text-[clamp(3.5rem,10.8vw,15rem)] leading-[0.8] text-black"
                    style="font-family: 'Bebas Neue', sans-serif; opacity: 0.8; text-shadow: 0px 4px 24px rgba(0, 0, 0, 0.4);">
                    THE VAULT
                </div>
                <div class="mt-2 flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div class="text-[clamp(1.6rem,3.4vw,2.8125rem)] leading-[1] text-black"
                    style="font-family: 'Bebas Neue', sans-serif; opacity: 0.8; text-shadow: 0px 4px 24px rgba(0, 0, 0, 0.25);">
                        featured items
                    </div>
                    <button
                        class="h-[46px] w-full max-w-[260px] rounded-[999px] text-[clamp(1rem,1.8vw,1.5rem)] text-white shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] lg:h-[48px] hidden lg:block"
                        style="background-image: linear-gradient(168deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                        More Details
                    </button>
                </div>

                <p class="mt-8 max-w-[743px] text-[clamp(1.05rem,2.2vw,2rem)] leading-[1.25] text-[#444955]">
                    Discover authenticated, iconic memorabilia ready for immediate purchase. These items are stored in
                    our vault and not currently scheduled for auction, however, private bids are welcomed.
                </p>

                <button
                    class="mt-4 h-[46px] w-full max-w-[260px] rounded-[999px] text-[clamp(1rem,1.8vw,1.5rem)] text-white shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] lg:h-[48px] block lg:hidden"
                    style="background-image: linear-gradient(168deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                    More Details
                </button>
            </div>
            <!-- Cards -->
            <div class="mt-10 flex flex-col gap-10 sm:mt-12 sm:gap-12 lg:mt-[65px] lg:gap-[78px]">
                <div v-for="card in vaultCards" :key="card.title"
                    class="group relative overflow-hidden rounded-[16px] border border-white/80 bg-[linear-gradient(168deg,rgba(255,255,255,0.95)_0%,rgba(248,248,248,0.92)_100%)] shadow-[0px_10px_34px_0px_rgba(0,0,0,0.18)]">
                    <div class="p-[4px]">
                        <img alt=""
                            class="h-[280px] w-full rounded-[16px] object-cover transition duration-500 group-hover:scale-[1.01] sm:h-[380px] md:h-[500px] lg:h-[661px]"
                            :src="card.image" />
                    </div>
                    <div class="px-5 pb-8 pt-8 sm:px-8 md:px-10 lg:px-[48px] lg:pb-[43px] lg:pt-[54px]">
                        <p class="text-[clamp(2rem,5.2vw,4.9375rem)] leading-[0.9] text-black/90"
                            style="font-family: 'Bebas Neue', sans-serif;">{{ card.title }}</p>
                        <p class="mt-4 text-[clamp(1.25rem,2.35vw,2.125rem)] leading-[1] text-[#333740]/90 lg:mt-[24px]"
                            style="letter-spacing: -0.02em;">
                            {{ card.athlete }}</p>
                        <div class="mt-10 flex flex-col gap-6 lg:mt-[76px] lg:flex-row lg:items-end lg:justify-between">
                            <div class="flex flex-col">
                                <p v-if="card.reserved"
                                    class="mb-3 inline-flex w-fit rounded-[999px] border border-[#cda328]/60 bg-[rgba(212,175,55,0.12)] px-4 py-1 text-[clamp(1.1rem,1.9vw,1.75rem)] uppercase leading-[1] tracking-[0.08em] bg-clip-text text-transparent lg:mb-[14px] lg:px-[18px] lg:py-[6px]"
                                    style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(165deg, rgb(188,154,29) 0%, rgb(212,175,55) 100%); text-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);">
                                    Reserve
                                </p>
                                <p class="bg-clip-text text-[clamp(2rem,4.2vw,3.9375rem)] leading-[1] text-transparent"
                                    style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(165deg, rgb(188,154,29) 0%, rgb(212,175,55) 100%); text-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);">
                                    {{ card.price }}
                                </p>
                            </div>
                            <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:gap-[24px]">
                                <button
                                    class="h-[46px] w-full rounded-[999px] text-[clamp(1rem,1.8vw,1.5rem)] text-black shadow-[0px_4px_24px_0px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-[1px] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.22)] sm:h-[48px] sm:w-[220px] lg:w-[260px]"
                                    style="background-image: linear-gradient(168deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%), linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%);">
                                    More Details
                                </button>
                                <button
                                    class="h-[46px] w-full rounded-[999px] text-[clamp(1rem,1.8vw,1.5rem)] text-white shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-[1px] hover:shadow-[0px_8px_24px_0px_rgba(0,0,0,0.28)] sm:h-[48px] sm:w-[220px] lg:w-[260px]"
                                    style="background-image: linear-gradient(168deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                                    Place Bid
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_3px_3px_2px_0px_rgba(255,255,255,0.1),inset_-2px_0px_2px_0px_rgba(255,255,255,0.2)]" />
                </div>
            </div>
            <!-- Bottom decorative image — breaks out of horizontal padding to full section width -->
            <div class="-mx-4 mt-16 sm:-mx-8 sm:mt-24 lg:-mx-[72px] lg:mt-[443px]">
                <img alt="" class="h-[320px] w-full object-cover mix-blend-multiply sm:h-[520px] md:h-[760px] lg:h-[1292px]" :src="vaultBottomImage" />
            </div>
        </div>
    </section>
</template>
