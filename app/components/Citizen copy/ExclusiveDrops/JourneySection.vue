<script setup lang="ts">
const iconList = '/assets/images/citizen/exclusive-drops/feature-icon-list.svg'
const iconCountdown = '/assets/images/citizen/exclusive-drops/feature-icon-countdown.svg'
const iconDrop = '/assets/images/citizen/exclusive-drops/feature-icon-drop.svg'
const {
    response_modal,
    loadAuctionWatchlist,
    isTogglingAuction,
    watchlistButtonText,
    toggleAuctionWatchlist,
} = useAuctionWatchlist()

const props = defineProps<{
    auctionId?: number | string
}>()

const cards = [
    {
        titleTop: 'THE',
        titleBottom: 'LIST',
        icon: iconList,
        copy: 'Register your interest in the drop and join the watch list to receive updates before the countdown begins.'
    },
    {
        titleTop: 'THE',
        titleBottom: 'COUNTDOWN',
        icon: iconCountdown,
        copy: 'Track the live countdown clock and get notified as soon as bidding opens on the exclusive drop.'
    },
    {
        titleTop: 'THE',
        titleBottom: 'DROP',
        icon: iconDrop,
        copy: 'Place bids in real time, follow progress, and secure the icon item before the drop closes.'
    }
]

onMounted(() => {
    loadAuctionWatchlist()
})

const handleWatchlistClick = async () => {
    await toggleAuctionWatchlist(props.auctionId)
}
</script>

<template>
    <section class="border-[5px] border-[#111215] bg-black">
        <div class="mx-auto flex w-full max-w-[1512px] flex-col gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:gap-[56px] lg:px-[72px] lg:py-[120px]">
            <div class="text-center">
                <h2 class="text-[clamp(2.2rem,5.2vw,4.9375rem)] uppercase leading-[0.88] text-white"
                    style="font-family: 'Bebas Neue', sans-serif;">
                    THE JOURNEY TO THE DROP
                </h2>
            </div>

            <div class="grid gap-5 sm:gap-6 lg:grid-cols-3">
                <article v-for="card in cards" :key="card.titleBottom"
                    class="relative flex min-h-[460px] flex-col items-center justify-center rounded-[16px] border border-white bg-[rgba(180,174,165,0.1)] px-5 py-8 text-center backdrop-blur-[50px] sm:min-h-[500px] sm:px-6 sm:py-9 md:min-h-[560px] lg:min-h-[591px]">
                    <div class="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-9 lg:gap-[44px]">
                        <div
                            class="flex h-[78px] w-[78px] items-center justify-center rounded-[148.5px] border-2 border-[#d0d1d4] sm:h-[92px] sm:w-[92px] md:h-[108px] md:w-[108px] md:border-3">
                            <img :src="card.icon" alt="" class="h-[48px] w-[48px] sm:h-[57px] sm:w-[57px] md:h-[67.5px] md:w-[67.5px]" />
                        </div>

                        <div class="w-full text-center text-[clamp(2.75rem,7.3vw,6.25rem)] leading-[0.8] tracking-[-0.04em]"
                            style="font-family: 'Bebas Neue', sans-serif;">
                            <p class="mb-0 text-[#d0d1d4]">{{ card.titleTop }}</p>
                            <p class="bg-clip-text text-transparent"
                                style="background-image: linear-gradient(110deg, rgb(151, 123, 19) 28.673%, rgb(212, 175, 55) 71.327%);">
                                {{ card.titleBottom }}
                            </p>
                        </div>

                        <p class="max-w-[355px] text-[clamp(0.95rem,1.35vw,1rem)] font-bold leading-[1.3] text-[#d0d1d4]">{{ card.copy }}</p>
                    </div>

                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-2px_0px_2px_0px_rgba(255,255,255,0.2),inset_3px_3px_2px_0px_rgba(255,255,255,0.1)]" />
                </article>
            </div>

            <div class="mx-auto flex w-full max-w-[360px] flex-col gap-4 px-1 sm:px-0">
                <button type="button" :disabled="isTogglingAuction(auctionId)"
                    class="h-12 w-full rounded-full bg-[linear-gradient(165deg,rgb(188,154,29)_0%,rgb(212,175,55)_100%)] text-[clamp(1.15rem,2.1vw,1.5rem)] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
                    style="font-family: 'Roboto', sans-serif;"
                    @click="handleWatchlistClick">
                    {{ isTogglingAuction(auctionId) ? 'Please wait...' : watchlistButtonText(auctionId) }}
                </button>
                <button type="button"
                    class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-[linear-gradient(168deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%),#22252b] text-[clamp(1.15rem,2.1vw,1.5rem)] text-white shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
                    style="font-family: 'Roboto', sans-serif;">
                    <span>Share</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        aria-hidden="true">
                        <path d="M7 17L17 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                        <path d="M9 7H17V15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>

        <LazyResponseModal :response_modal="response_modal" />
    </section>
</template>
