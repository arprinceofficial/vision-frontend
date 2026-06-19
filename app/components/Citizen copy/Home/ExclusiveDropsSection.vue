<script setup lang="ts">
import { Carousel as VCarousel, Slide as VSlide } from 'vue3-carousel'

const exclusiveImageLarge = '/assets/images/citizen/home/exclusive-image-large.png'
const exclusiveImageSmall = '/assets/images/citizen/home/exclusive-image-small.png'
const {
    response_modal,
    loadAuctionWatchlist,
    isAuctionWatchlisted,
    isTogglingAuction,
    watchlistButtonText,
    toggleAuctionWatchlist,
} = useAuctionWatchlist()
const router = useRouter()

type Auction = {
    id?: number
    slug?: string
    headline?: string
    subhead_line?: string
    drop_name?: string
    starting_price?: string
    bid_increment?: string
    current_highest_bid?: string
    drop_date?: string | null
    end_date?: string | null
    live_status?: string
    status_text?: string
    bg_image?: string | null
    summary_image?: string | null
    portfolio_image?: string | null
    item?: {
        name?: string
    }
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
    endDate?: string | null
    hasCountdown: boolean
    countdown?: {
        days: string
        hours: string
        minutes: string
        seconds: string
    }
}

type DropSlide = {
    large: DropCard
    preview: DropCard
}

const auctions = ref<Auction[]>([])
const isLoading = ref(true)
const activeSlide = ref(0)
const nowTimestamp = ref(Date.now())
const carouselRef = ref<{ slideTo?: (index: number) => void } | null>(null)

let countdownInterval: ReturnType<typeof setInterval> | null = null

const parseTimestamp = (date?: string | null) => {
    if (!date) return null
    const normalizedDate = date.includes('T') ? date : date.replace(' ', 'T')
    const timestamp = new Date(normalizedDate).getTime()
    return Number.isNaN(timestamp) ? null : timestamp
}

const isLiveAuction = (auction: Auction) => {
    const liveStatus = String(auction.live_status ?? '').toLowerCase()
    if (liveStatus === 'live') return true

    const timestamp = parseTimestamp(auction.drop_date)
    if (timestamp === null) return false

    return timestamp <= nowTimestamp.value
}

const formatCountdown = (date?: string | null) => {
    const timestamp = parseTimestamp(date)
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

const resolveStatus = (auction: Auction, isLive: boolean) => {
    if (isLive) return 'LIVE NOW'
    return auction.live_status || auction.status_text || 'COUNTDOWN'
}

const resolveCountdownDate = (auction: Auction, isLive: boolean) => {
    return isLive ? (auction.end_date || auction.drop_date) : auction.drop_date
}

const resolveDropLink = (slug?: string) => {
    const normalizedSlug = slug?.trim()
    return normalizedSlug ? `/exclusive-drop/${normalizedSlug}` : '/exclusive-drop'
}

const toDropCard = (auction: Auction, fallbackImage: string): DropCard => {
    const isLive = isLiveAuction(auction)
    const countdownDate = resolveCountdownDate(auction, isLive)

    return {
        id: auction.id,
        slug: auction.slug,
        image: auction.bg_image || auction.summary_image || auction.portfolio_image || fallbackImage,
        reveal: auction.headline || auction.drop_name || 'EXCLUSIVE DROP',
        name: auction.subhead_line || auction.drop_name || auction.item?.name || 'THIS WEEK',
        startingPrice: formatCurrency(auction.starting_price),
        increment: formatCurrency(auction.bid_increment),
        currentBid: formatCurrency(auction.current_highest_bid),
        status: resolveStatus(auction, isLive),
        isLive,
        isWatchlisted: isAuctionWatchlisted(auction.id),
        dropDate: auction.drop_date,
        endDate: auction.end_date,
        hasCountdown: Boolean(countdownDate),
        countdown: formatCountdown(countdownDate)
    }
}

const slides = computed<DropSlide[]>(() => {
    return auctions.value.map((auction) => ({
        large: toDropCard(auction, exclusiveImageLarge),
        preview: toDropCard(auction, exclusiveImageSmall)
    }))
})

const normalizedActiveSlide = computed(() => {
    const slideCount = slides.value.length
    if (!slideCount) return 0

    return ((activeSlide.value % slideCount) + slideCount) % slideCount
})

const activeDrop = computed(() => slides.value[normalizedActiveSlide.value]?.large)
const activeDropLink = computed(() => resolveDropLink(activeDrop.value?.slug))
const activeDropCtaLabel = computed(() => {
    if (activeDrop.value?.isLive) return 'Bid Now'
    return watchlistButtonText(activeDrop.value?.id)
})

const normalizeAuctionsResponse = (res: any): Auction[] => {
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.data?.data)) return res.data.data
    if (Array.isArray(res?.data)) return res.data
    return []
}

const fetchAuctions = async () => {
    isLoading.value = true
    try {
        await loadAuctionWatchlist()
        const res: any = await $fetchCMS('v1/cms/auctions', { method: 'GET' })
        auctions.value = normalizeAuctionsResponse(res)
    } catch (e) {
        auctions.value = []
    } finally {
        isLoading.value = false
    }
}
const hasSlides = computed(() => !isLoading.value && slides.value.length > 0)
const singleSlide = computed(() => slides.value.length <= 1)

onMounted(() => {
    fetchAuctions()
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

watch(() => slides.value.length, (slideCount) => {
    if (!slideCount) {
        activeSlide.value = 0
        return
    }

    if (activeSlide.value > slideCount - 1) {
        activeSlide.value = slideCount - 1
    } else if (activeSlide.value < 0) {
        activeSlide.value = 0
    }
})

const goToSlide = (index: number) => {
    activeSlide.value = index
    carouselRef.value?.slideTo?.(index)
}

const goToDrop = async (slide: DropSlide) => {
    await router.push(resolveDropLink(slide.large.slug))
}

const handleSlideWatchlistClick = async (slide: DropSlide) => {
    await toggleAuctionWatchlist(slide.large.id)
}

const handleActiveDropCta = async () => {
    if (!activeDrop.value) return

    if (activeDrop.value.isLive) {
        await router.push(activeDropLink.value)
        return
    }

    await toggleAuctionWatchlist(activeDrop.value.id)
}
</script>

<template>
    <section v-if="hasSlides" class="bg-[#22252b]">
        <div class="mx-auto w-full max-w-[1512px] px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-[72px] lg:pb-14 lg:pt-[168px]">
            <div class="relative">
                <p class="text-[clamp(2rem,6.3vw,4.9375rem)] leading-[0.82] text-white/80" style="font-family: 'Bebas Neue', sans-serif;">THIS
                    MONTH'S</p>
                <p class="bg-clip-text text-[clamp(3rem,11vw,15rem)] leading-[0.82] text-transparent"
                    style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(154deg, rgb(188, 154, 29) 28.673%, rgb(212, 175, 55) 71.327%);">
                    EXCLUSIVE DROPS
                </p>
            </div>

            <div class="mt-5 flex flex-col gap-5 lg:mt-[30px] lg:flex-row lg:items-center lg:justify-between">
                <p class="max-w-[838px] text-[clamp(1rem,2.45vw,2.5rem)] leading-[1.08] text-[#d0d1d4]">
                    Join the <span class="font-bold">Watch List</span> to be part of the countdown, unlock hidden clues,
                    and bid for iconic collectibles.
                </p>
                <NuxtLink to="/exclusive-drop"
                    class="flex h-11 w-full max-w-[220px] items-center justify-center rounded-[1498.5px] text-[clamp(1rem,1.8vw,1.5rem)] text-white no-underline shadow-[0px_6px_24px_0px_rgba(0,0,0,0.25)] sm:h-12 sm:max-w-[240px] lg:w-[260px] lg:max-w-[260px]"
                    style="background-image: linear-gradient(-46.5deg, rgba(255,255,255,0) 28.673%, rgba(255,255,255,0.1) 71.327%), linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%);">
                    View All
                </NuxtLink>
            </div>
        </div>

        <div class="bg-[#333740]">
            <div class="mx-auto w-full max-w-[1514px] overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-0 lg:py-14">
                <VCarousel
                    ref="carouselRef"
                    v-model="activeSlide"
                    :class="['exclusive-drops-carousel mx-auto w-full max-w-[1159px]', singleSlide ? 'single-slide' : '']"
                    :items-to-show="1"
                    :wrap-around="!singleSlide"
                    :transition="600"
                    :autoplay="singleSlide ? 0 : 3500"
                    :mouse-drag="!singleSlide"
                    :touch-drag="!singleSlide"
                    pause-autoplay-on-hover>
                    <VSlide v-for="(slide, idx) in slides" :key="idx">
                        <div
                            class="relative mx-auto block h-[420px] w-full max-w-[1159px] cursor-pointer rounded-[16px] no-underline shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] sm:h-[520px] lg:h-[674px]"
                            role="link"
                            tabindex="0"
                            :aria-label="`Open ${slide.large.name}`"
                            @click="goToDrop(slide)"
                            @keydown.enter.prevent="goToDrop(slide)"
                            @keydown.space.prevent="goToDrop(slide)">
                            <div class="absolute inset-0 rounded-[16px] backdrop-blur-[100px]"
                                style="background: rgba(68,73,85,0.4); border: 1px solid rgba(255,255,255,0.64); box-shadow: inset 3px 3px 2px rgba(255,255,255,0.1), inset -2px 0px 2px rgba(255,255,255,0.2);" />

                            <div class="absolute inset-2 overflow-hidden rounded-[16px]">
                                <img alt=""
                                    class="absolute inset-0 h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
                                    :src="slide.large.image" />

                                <div v-if="slide.large.hasCountdown"
                                    class="absolute left-0 right-0 top-14 z-40 flex justify-center px-4 sm:px-6">
                                    <div class="flex w-full max-w-[1040px] items-end justify-between text-white/95">
                                        <div class="flex flex-col items-center">
                                            <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">
                                                {{ slide.large.countdown?.days }}
                                            </div>
                                            <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">DAYS</div>
                                        </div>

                                        <div class="text-[clamp(1.2rem,3.2vw,3rem)] font-bold leading-none">:</div>

                                        <div class="flex flex-col items-center">
                                            <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">
                                                {{ slide.large.countdown?.hours }}
                                            </div>
                                            <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">HRS</div>
                                        </div>

                                        <div class="text-[clamp(1.2rem,3.2vw,3rem)] font-bold leading-none">:</div>

                                        <div class="flex flex-col items-center">
                                            <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">
                                                {{ slide.large.countdown?.minutes }}
                                            </div>
                                            <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">MINS</div>
                                        </div>

                                        <div class="text-[clamp(1.2rem,3.2vw,3rem)] font-bold leading-none">:</div>

                                        <div class="flex flex-col items-center">
                                            <div class="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-[0.95]">
                                                {{ slide.large.countdown?.seconds }}
                                            </div>
                                            <div class="mt-1 text-[clamp(0.6rem,1vw,0.75rem)] uppercase tracking-wide">SEC</div>
                                        </div>
                                    </div>
                                </div>

                                <button v-if="!slide.large.isLive" type="button"
                                    :disabled="isTogglingAuction(slide.large.id)"
                                    class="absolute left-0 top-0 z-30 flex h-11 w-full items-center justify-center rounded-t-[16px] bg-[linear-gradient(165deg,rgb(188,154,29)_0%,rgb(212,175,55)_100%)] disabled:cursor-not-allowed disabled:opacity-70 sm:h-12"
                                    @click.stop="handleSlideWatchlistClick(slide)"
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
                                    class="absolute inset-x-0 bottom-0 rounded-b-[16px] border-t-[0.5px] border-white/80 bg-[#111215]/90 px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-[17px]">
                                    <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-[#d0d1d4] md:grid-cols-4 md:gap-x-6 lg:gap-x-8">
                                        <div class="text-center md:border-r md:border-white/40 md:pr-4 lg:pr-6">
                                            <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">STARTING PRICE</p>
                                            <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                                style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.startingPrice }}</p>
                                        </div>
                                        <div class="text-center md:border-r md:border-white/40 md:pr-4 lg:pr-6">
                                            <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">BID INCREMENT</p>
                                            <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                                style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.increment }}</p>
                                        </div>
                                        <div class="text-center md:border-r md:border-white/40 md:pr-4 lg:pr-6">
                                            <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">CURRENT BID</p>
                                            <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                                style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.currentBid }}</p>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-[clamp(0.65rem,1.1vw,1rem)] font-semibold leading-4">STATUS</p>
                                            <p class="text-[clamp(1.5rem,3.8vw,3.9375rem)] leading-[0.95]"
                                                style="font-family: 'Bebas Neue', sans-serif;">{{ slide.large.status }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="absolute inset-x-4 bottom-[132px] sm:inset-x-6 sm:bottom-[124px] lg:inset-x-[52px] lg:bottom-[146px]">
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

                <div class="mt-5 flex flex-col items-center gap-5 sm:mt-6">
                    <div v-if="!singleSlide" class="flex h-[12px] w-[60px] items-center justify-between">
                        <button v-for="(_, idx) in slides" :key="`dot-${idx}`"
                            class="h-[12px] w-[12px] rounded-full border border-white transition-opacity duration-300"
                            :class="idx === normalizedActiveSlide ? 'bg-white opacity-100' : 'bg-transparent opacity-60'"
                            :aria-label="`Go to slide ${idx + 1}`" @click="goToSlide(idx)" />
                    </div>

                    <button type="button" :disabled="isTogglingAuction(activeDrop?.id)"
                        class="flex h-11 w-full max-w-[280px] items-center justify-center rounded-[999px] text-[clamp(1.35rem,2.2vw,2rem)] leading-none text-black no-underline shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] sm:h-12 sm:max-w-[320px] lg:h-[48px] lg:max-w-[360px]"
                        style="font-family: 'Bebas Neue', sans-serif;"
                        :style="{
                            background: activeDrop?.isLive ? '#00D7A5' : 'linear-gradient(153.81deg, rgb(188, 154, 29) 28.673%, rgb(212, 175, 55) 71.327%)'
                        }"
                        @click="handleActiveDropCta">
                        {{ isTogglingAuction(activeDrop?.id) ? 'Please wait...' : activeDropCtaLabel }}
                    </button>
                </div>
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

.single-slide :deep(.carousel__viewport) {
    overflow: hidden !important;
}

.single-slide :deep(.carousel__slide) {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}
</style>
