<script setup lang="ts">
import { Carousel as VCarousel, Slide as VSlide } from 'vue3-carousel'

const exclusiveImageLarge = '/assets/images/citizen/home/exclusive-image-large.png'
const {
    response_modal,
    loadAuctionWatchlist,
    isAuctionWatchlisted,
    isTogglingAuction,
    toggleAuctionWatchlist,
} = useAuctionWatchlist()

type UpcomingAuction = {
    id?: number
    slug?: string
    headline?: string
    subhead_line?: string
    bg_image?: string
    icon_image?: string
    starting_price?: string
    bid_increment?: string
    current_highest_bid?: string
    drop_date?: string | null
    status?: number | string
}

type DropCard = {
    id?: number | string
    slug?: string
    image: string
    reveal: string
    name: string
    startingPrice: string
    increment: string
    currentBid: string
    status: string
    isLive: boolean
    isWatchlisted: boolean
    dropDate?: string | null
    countdown?: {
        days: string
        hours: string
        minutes: string
        seconds: string
    }
}

type DropSlide = {
    large: DropCard
}

const props = defineProps<{
    upcomingAuctions?: UpcomingAuction[]
}>()

const activeSlide = ref(0)
const nowTimestamp = ref(Date.now())
const router = useRouter()

let countdownInterval: ReturnType<typeof setInterval> | null = null

const parseTimestamp = (dropDate?: string | null) => {
    if (!dropDate) return null
    const timestamp = new Date(dropDate).getTime()
    return Number.isNaN(timestamp) ? null : timestamp
}

const isLiveByDate = (dropDate?: string | null) => {
    const timestamp = parseTimestamp(dropDate)
    if (timestamp === null) return false
    return timestamp <= nowTimestamp.value
}

const formatCountdown = (dropDate?: string | null) => {
    const timestamp = parseTimestamp(dropDate)
    if (timestamp === null) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' }
    }

    const totalSeconds = Math.max(0, Math.floor((timestamp - nowTimestamp.value) / 1000))
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
    }
}

const formatCurrency = (value?: string) => {
    if (!value) return 'N/A'
    const amount = Number(value)
    if (Number.isNaN(amount)) return value
    return amount.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })
}

const resolveStatus = (auction: UpcomingAuction, isLive: boolean) => {
    if (isLive) return 'LIVE NOW'

    const rawStatus = String(auction.status ?? '').toUpperCase()
    if (rawStatus.includes('LIVE')) return 'LIVE'

    return 'COUNTDOWN'
}

const slides = computed<DropSlide[]>(() => {
    const auctions = props.upcomingAuctions ?? []

    return auctions.map((auction) => {
        const isLive = isLiveByDate(auction.drop_date)

        return {
            large: {
                id: auction.id,
                slug: auction.slug,
                image: auction.bg_image || auction.icon_image || exclusiveImageLarge,
                reveal: auction.headline || 'EXCLUSIVE DROP',
                name: auction.subhead_line || 'THIS WEEK',
                startingPrice: formatCurrency(auction.starting_price),
                increment: formatCurrency(auction.bid_increment),
                currentBid: formatCurrency(auction.current_highest_bid),
                status: resolveStatus(auction, isLive),
                isLive,
                isWatchlisted: isAuctionWatchlisted(auction.id),
                dropDate: auction.drop_date,
                countdown: formatCountdown(auction.drop_date)
            }
        }
    })
})

const singleSlide = computed(() => (slides.value?.length ?? 0) <= 1)

onMounted(() => {
    nowTimestamp.value = Date.now()
    loadAuctionWatchlist()
    countdownInterval = setInterval(() => {
        nowTimestamp.value = Date.now()
    }, 1000)
})

onBeforeUnmount(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
})

watch(
    slides,
    (value) => {
        if (!value.length) {
            activeSlide.value = 0
            return
        }
        if (activeSlide.value > value.length - 1) {
            activeSlide.value = 0
        }
    },
    { immediate: true }
)

const onSlideStart = ({ currentSlideIndex }: { currentSlideIndex: number }) => {
    activeSlide.value = currentSlideIndex
}

const goToSlide = (index: number) => {
    activeSlide.value = index
}

const goToDrop = async (slide: DropSlide) => {
    const slug = slide.large.slug?.trim()
    if (!slug) return
    await router.push(`/exclusive-drop/${slug}`)
}

const handleWatchlistClick = async (slide: DropSlide) => {
    await toggleAuctionWatchlist(slide.large.id)
}
</script>

<template>
    <section class="bg-black">
        <div class="mx-auto w-full max-w-[1512px] px-4 pt-12 sm:px-6 lg:px-[72px]">
            <div class="flex justify-center">
                <h2 class="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[clamp(2rem,6.2vw,6.25rem)] uppercase tracking-tight"
                    style="font-family: 'Bebas Neue', sans-serif;">
                    <span class="text-white/90">OTHER</span>
                    <span class="bg-clip-text text-transparent"
                        style="background-image: linear-gradient(165deg, rgb(188, 154, 29) 0%, rgb(212, 175, 55) 100%);">EXCLUSIVE
                        DROPS</span>
                    <span class="text-white/90">THIS WEEK</span>
                </h2>
            </div>
        </div>

        <div v-if="slides.length > 0"
            class="mx-auto w-full max-w-[1514px] overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-0 lg:py-14">
            <VCarousel :class="['exclusive-drops-carousel', singleSlide ? 'single-slide' : '']"
                class="mx-auto w-full max-w-[1159px]" :items-to-show="1" :wrap-around="!singleSlide" :transition="600"
                :autoplay="singleSlide ? 0 : 3500" :mouse-drag="!singleSlide" :touch-drag="!singleSlide"
                pause-autoplay-on-hover @slide-start="onSlideStart">
                <VSlide v-for="(slide, idx) in slides" :key="idx">
                    <div
                        class="relative mx-auto h-[420px] w-full max-w-[1159px] rounded-[16px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] sm:h-[520px] lg:h-[674px]"
                        :class="slide.large.slug ? 'cursor-pointer' : ''" :tabindex="slide.large.slug ? 0 : -1"
                        :role="slide.large.slug ? 'link' : undefined"
                        :aria-label="slide.large.slug ? `Open ${slide.large.name}` : undefined"
                        @click="goToDrop(slide)"
                        @keydown.enter.prevent="goToDrop(slide)"
                        @keydown.space.prevent="goToDrop(slide)">
                        <div class="absolute inset-0 rounded-[16px] backdrop-blur-[100px]"
                            style="background: rgba(68,73,85,0.4); border: 1px solid rgba(255,255,255,0.64); box-shadow: inset 3px 3px 2px rgba(255,255,255,0.1), inset -2px 0px 2px rgba(255,255,255,0.2);" />

                        <div class="absolute inset-2 overflow-hidden rounded-[16px]">
                            <!-- <div class="absolute inset-0 flex items-center justify-center bg-black">
                                <img alt="" class="max-h-full max-w-full object-contain [backface-visibility:hidden] [transform:translateZ(0)]" :src="slide.large.image" />
                            </div> -->
                            <img alt=""
                                class="absolute inset-0 h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
                                :src="slide.large.image" />
                            <!-- Countdown display (Figma-like full-width) -->
                            <div v-if="!slide.large.isLive"
                                class="absolute left-0 right-0 top-14 z-40 flex justify-center px-4 sm:px-6">
                                <div class="flex w-full max-w-[1040px] items-end justify-between text-white/95">
                                    <div class="flex flex-col items-center">
                                        <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">{{
                                            slide.large.countdown?.days }}</div>
                                        <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">DAYS
                                        </div>
                                    </div>

                                    <div class="text-[clamp(1.2rem,3.2vw,3rem)] font-bold leading-none">:</div>

                                    <div class="flex flex-col items-center">
                                        <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">{{
                                            slide.large.countdown?.hours }}</div>
                                        <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">HRS
                                        </div>
                                    </div>

                                    <div class="text-[clamp(1.2rem,3.2vw,3rem)] font-bold leading-none">:</div>

                                    <div class="flex flex-col items-center">
                                        <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">{{
                                            slide.large.countdown?.minutes }}</div>
                                        <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">MINS
                                        </div>
                                    </div>

                                    <div class="text-[clamp(1.2rem,3.2vw,3rem)] font-bold leading-none">:</div>

                                    <div class="flex flex-col items-center">
                                        <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">{{
                                            slide.large.countdown?.seconds }}</div>
                                        <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">SEC
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Figma-accurate: show top gold banner for COUNTDOWN, otherwise show card CTA -->
                            <button v-if="!slide.large.isLive" type="button" :disabled="isTogglingAuction(slide.large.id)"
                                class="absolute left-0 top-0 z-30 flex h-11 w-full items-center justify-center rounded-t-[16px] bg-[linear-gradient(165deg,rgb(188,154,29)_0%,rgb(212,175,55)_100%)] disabled:cursor-not-allowed disabled:opacity-70 sm:h-12"
                                @click.stop="handleWatchlistClick(slide)"
                                @keydown="$event.stopPropagation()">
                                <span class="mr-4 text-[clamp(0.9rem,1.4vw,1.125rem)] font-semibold text-black sm:mr-6"
                                    style="font-family: Roboto, sans-serif;">
                                    {{ isTogglingAuction(slide.large.id) ? 'PLEASE WAIT...' : slide.large.isWatchlisted ? 'REMOVE WATCHLIST' : 'JOIN WATCH LIST' }}
                                </span>
                            </button>

                            <div v-else
                                class="absolute left-0 top-0 z-30 flex h-11 w-full items-center justify-center rounded-t-[16px] bg-[#00D7A5] sm:h-12">
                                <span class="text-[clamp(1rem,1.6vw,1.25rem)] font-semibold text-black"
                                    style="font-family: Roboto, sans-serif;">BID NOW</span>
                            </div>

                            <div
                                class="absolute inset-x-0 bottom-0 rounded-b-[16px] border-t-[0.5px] border-white/80 bg-black/90 px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-[17px]">
                                <div
                                    class="grid grid-cols-2 gap-x-4 gap-y-3 text-[#d0d1d4] md:grid-cols-4 md:gap-x-6 lg:gap-x-8">
                                    <div class="text-center md:border-r md:border-white/40 md:pr-4 lg:pr-6">
                                        <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">STARTING
                                            PRICE</p>
                                        <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                            style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.startingPrice
                                            }}</p>
                                    </div>
                                    <div class="text-center md:border-r md:border-white/40 md:pr-4 lg:pr-6">
                                        <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">BID
                                            INCREMENT</p>
                                        <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                            style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.increment }}
                                        </p>
                                    </div>
                                    <div class="text-center md:border-r md:border-white/40 md:pr-4 lg:pr-6">
                                        <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">CURRENT BID
                                        </p>
                                        <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                            style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.currentBid }}
                                        </p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">STATUS</p>
                                        <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                            style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.status }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="absolute inset-x-4 bottom-[132px] sm:inset-x-6 sm:bottom-[124px] lg:inset-x-[52px] lg:bottom-[146px]">
                            <p class="max-w-full text-left text-[clamp(1.5rem,4.2vw,4.375rem)] leading-[0.8] text-white/90"
                                style="font-family: 'Bebas Neue', sans-serif; text-shadow: 0px 3px 18px rgba(0,0,0,0.25);">
                                {{ slide.large.reveal }}
                            </p>

                            <p class="mt-1 max-w-[96%] break-words bg-clip-text text-[clamp(2rem,7.4vw,8.125rem)] leading-[0.8] text-transparent"
                                style="font-family: 'Bebas Neue', sans-serif; letter-spacing: -0.01em; background-image: linear-gradient(165deg, rgb(188, 154, 29) 0%, rgb(212, 175, 55) 100%); text-shadow: 0px 3px 18px rgba(0,0,0,0.4);">
                                {{ slide.large.name }}
                            </p>
                        </div>
                    </div>
                </VSlide>
            </VCarousel>

            <div v-if="!singleSlide" class="mt-5 flex justify-center sm:mt-6">
                <div class="flex h-[12px] w-[60px] items-center justify-between">
                    <button v-for="(_, idx) in slides" :key="`dot-${idx}`"
                        class="h-[12px] w-[12px] rounded-full border border-white transition-opacity duration-300"
                        :class="idx === activeSlide ? 'bg-white opacity-100' : 'bg-transparent opacity-60'"
                        :aria-label="`Go to slide ${idx + 1}`" @click="goToSlide(idx)" />
                </div>
            </div>
        </div>

        <div v-else class="mx-auto w-full max-w-[1512px] px-4 pb-12 pt-8 sm:px-6 lg:px-[72px]">
            <div
                class="mx-auto w-full max-w-[760px] rounded-[24px] border border-[rgba(212,175,55,0.35)] bg-[rgba(34,37,43,0.42)] px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-[40px] sm:px-10 sm:py-12">
                <p class="bg-[linear-gradient(157.6502deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.86] tracking-[-0.02em] text-transparent"
                    style="font-family: 'Bebas Neue', sans-serif;">
                    NO UPCOMING DROPS
                </p>
                <p class="mx-auto mt-3 max-w-[560px] text-[clamp(1rem,1.8vw,1.2rem)] leading-[1.5] text-[#d0d1d4]"
                    style="font-family: 'Roboto', sans-serif;">
                    There are no upcoming exclusive drops this week. Check back soon for the next release.
                </p>
            </div>
        </div>

        <LazyResponseModal :response_modal="response_modal" />
    </section>
</template>

<style scoped>
.exclusive-drops-carousel :deep(.carousel__viewport) {
    overflow: visible;
}

.exclusive-drops-carousel :deep(.carousel__track) {
    align-items: center;
}

.exclusive-drops-carousel :deep(.carousel__slide) {
    transition: transform 0.6s ease, opacity 0.6s ease;
    opacity: 0.5;
    transform: scale(0.92);
    pointer-events: none;
    user-select: none;
}

.exclusive-drops-carousel :deep(.carousel__slide--active) {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}

/* When only a single slide exists, prevent adjacent slides from peeking and keep carousel static */
.single-slide :deep(.carousel__viewport) {
    overflow: hidden !important;
}

.single-slide :deep(.carousel__slide) {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}
</style>
