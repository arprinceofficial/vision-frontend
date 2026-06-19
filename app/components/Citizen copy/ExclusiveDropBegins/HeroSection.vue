<script setup lang="ts">
const { citizen_user } = citizenAuth();
const assets = {
    heroBg: '/assets/images/exclusive-drop/begins/hero-bg-main.jpg',
    volume: '/assets/images/exclusive-drop/begins/volume.svg',
    lockCircle: '/assets/images/exclusive-drop/begins/lock-circle.svg',
    lockGlyph: '/assets/images/exclusive-drop/begins/lock-glyph.svg',
    send: '/assets/images/exclusive-drop/begins/send-hero.svg',
}

const props = defineProps<{
    id?: number
    headline?: string
    subhead_line?: string
    drop_date?: string
    end_date?: string
    current_highest_bid?: string
    starting_price?: string
    bid_increment?: string
    time_remaining?: string
    popcorn_threshold_minutes?: string
    summary_image?: string
    loading?: boolean
}>()

type CountdownKey = 'days' | 'hours' | 'minutes' | 'seconds'

const heroHeadline = computed(() => props.headline || "JOHNNY NELSON'S")
const heroSubhead = computed(() => props.subhead_line || 'EXCLUSIVE DROP')
const heroBg = computed(() => props.summary_image || assets.heroBg)
const isLoading = computed(() => !!props.loading)

const countdownUnits: Array<{ key: CountdownKey, label: string }> = [
    { key: 'days', label: 'days' },
    { key: 'hours', label: 'hrs' },
    { key: 'minutes', label: 'mins' },
    { key: 'seconds', label: 'sec' },
]

const baseWidth = 1512
const baseHeight = 2721

const frameRef = ref<HTMLElement | null>(null)
const frameWidth = ref(baseWidth)
let resizeObserver: ResizeObserver | null = null
const nowTimestamp = ref(Date.now())
let countdownInterval: ReturnType<typeof setInterval> | null = null

const parseTimestamp = (value?: string) => {
    if (!value) return null
    const timestamp = new Date(value).getTime()
    return Number.isNaN(timestamp) ? null : timestamp
}

const dropTimestamp = computed(() => parseTimestamp(props.drop_date))
const endTimestamp = computed(() => parseTimestamp(props.end_date))

const hasBidStarted = computed(() => {
    if (dropTimestamp.value === null) {
        return false
    }

    return nowTimestamp.value >= dropTimestamp.value
})

const countdownTarget = computed(() => {
    if (hasBidStarted.value) {
        return endTimestamp.value
    }

    return dropTimestamp.value
})

const countdown = computed(() => {
    const target = countdownTarget.value
    if (target === null) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' }
    }

    const totalSeconds = Math.max(0, Math.floor((target - nowTimestamp.value) / 1000))
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
})

onMounted(() => {
    if (!frameRef.value) {
        return
    }

    resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
            return
        }
        frameWidth.value = Math.min(entry.contentRect.width, baseWidth)
    })

    resizeObserver.observe(frameRef.value)

    nowTimestamp.value = Date.now()
    countdownInterval = setInterval(() => {
        nowTimestamp.value = Date.now()
    }, 1000)
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
})

const scale = computed(() => {
    return Math.min(frameWidth.value / baseWidth, 1)
})

const scaledHeight = computed(() => {
    return Math.round(baseHeight * scale.value)
})

const canvasStyle = computed(() => {
    return {
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        transform: `scale(${scale.value})`,
        transformOrigin: 'top left'
    }
})
</script>

<template>
    <!-- <pre>{{ citizen_user }}</pre> -->
    <section class="relative overflow-hidden border-b border-white/20 bg-black"
        style="font-family: 'Roboto', sans-serif;">
        <div class="relative mx-auto w-full max-w-[1512px] lg:hidden">
            <div class="relative min-h-[920px] overflow-hidden sm:min-h-[980px]">
                <img :src="heroBg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-75 grayscale">
                <div
                    class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_25%,rgba(0,0,0,0.5)_40.234%,#000_78%)]" />

                <button type="button"
                    class="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,255,255,0.5)] p-2 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:right-6 sm:top-6">
                    <img :src="assets.volume" alt="Volume" class="h-4 w-4">
                </button>

                <div v-if="!isLoading"
                    class="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col items-center px-4 pb-8 pt-24 sm:px-6 sm:pt-28">
                    <p
                        class="max-w-[94%] text-center font-['Bebas_Neue'] text-[clamp(2rem,6.8vw,4.8rem)] leading-[0.86] tracking-[-0.03em] text-[#d4af37] [text-wrap:balance]">
                        {{ heroHeadline }}
                    </p>

                    <p
                        class="max-w-[95%] break-words text-center font-['Bebas_Neue'] text-[clamp(2.6rem,14vw,6.8rem)] leading-[0.88] tracking-[-0.03em] text-white [text-wrap:balance]">
                        {{ heroSubhead }}
                    </p>

                    <div class="mt-8 flex flex-wrap items-end justify-center gap-2 text-white sm:mt-7 sm:gap-4">
                        <template v-for="(unit, index) in countdownUnits" :key="unit.key">
                            <div class="flex items-end">
                                <span
                                    class="bg-[linear-gradient(112.956deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-[clamp(2rem,6vw,4rem)] font-bold leading-[1] tracking-[-0.03em] text-transparent">{{
                                        countdown[unit.key] }}</span>
                                <span class="text-[clamp(0.95rem,2.4vw,1.4rem)] leading-[1.1] tracking-[-0.04em]">{{
                                    unit.label }}</span>
                            </div>
                            <span v-if="index < countdownUnits.length - 1"
                                class="text-[clamp(0.95rem,2.4vw,1.4rem)] leading-[1.1] tracking-[-0.04em]">:</span>
                        </template>
                    </div>

                    <button type="button"
                        class="mt-5 flex h-11 w-full max-w-[260px] items-center justify-center gap-2 rounded-[999px] px-6 text-[clamp(1rem,2.3vw,1.2rem)] leading-none text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:h-12"
                        style="background: linear-gradient(160.079deg, rgba(255, 255, 255, 0) 29.076%, rgba(255, 255, 255, 0.1) 70.924%), #22252b;">
                        <span>Share</span>
                        <img :src="assets.send" alt="Send" class="h-5 w-5 sm:h-6 sm:w-6">
                    </button>
                </div>

                <div v-else
                    class="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col items-center px-4 pb-8 pt-24 sm:px-6 sm:pt-28">
                    <div class="w-full max-w-[860px] animate-pulse">
                        <div class="mx-auto mb-4 h-8 w-2/5 rounded bg-white/20" />
                        <div class="mx-auto mb-7 h-14 w-4/5 rounded bg-white/20" />
                        <div class="mx-auto flex w-full max-w-[520px] justify-between gap-2">
                            <div class="h-16 w-16 rounded bg-white/20" />
                            <div class="h-16 w-16 rounded bg-white/20" />
                            <div class="h-16 w-16 rounded bg-white/20" />
                            <div class="h-16 w-16 rounded bg-white/20" />
                        </div>
                        <div class="mx-auto mt-6 h-11 w-[220px] rounded-full bg-white/20" />
                    </div>
                </div>

                <div v-if="!hasBidStarted" class="relative mx-3 mt-2 sm:mx-6">
                    <div class="pointer-events-none absolute inset-0 rounded-2xl" style="
                    padding: 1.5px;
                    background: linear-gradient(115deg, #00d8be 0%, rgba(0,216,190,0.05) 45%, rgba(0,216,190,0.05) 55%, #00d8be 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                ">
                    </div>

                    <div
                        class="relative rounded-2xl bg-black/35 px-4 py-6 backdrop-blur-[20px] shadow-[0_4px_40px_8px_rgba(0,0,0,0.60)] sm:px-6">
                        <div class="grid grid-cols-1 gap-6">
                            <div class="text-center">
                                <h2
                                    class="font-['Bebas_Neue'] text-[clamp(2rem,6.5vw,3.8rem)] leading-[0.82] tracking-[-0.02em] text-white text-center align-middle">
                                    BIDDING STARTS <span
                                        class="bg-gradient-to-b from-[#f3cf48] to-[#927411] bg-clip-text text-transparent">SOON</span>
                                </h2>
                                <p class="mt-2 text-[clamp(1rem,3vw,1.35rem)] font-bold text-[#d4af37]">Popcorn Bidding
                                </p>
                                <p class="mt-2 text-[clamp(0.8rem,2.2vw,0.95rem)] leading-tight text-gray-400">
                                    Automatically Extends "Exclusive Drop" Auction's End Time by 30 minutes
                                </p>

                                <button
                                    class="mt-4 h-10 rounded-full border border-white/10 bg-white/10 px-6 text-[clamp(0.85rem,2vw,1rem)] text-white transition-all hover:bg-white/20">
                                    Find Out More
                                </button>
                            </div>

                            <div class="border-t border-white/20 pt-4 text-center">
                                <p class="text-[clamp(0.9rem,2.2vw,1rem)] leading-relaxed text-gray-300">
                                    You have joined <span class="font-bold text-white">The Watch List</span>. Make sure
                                    to complete your profile to be ready for <span class="font-bold text-white">The
                                        Drop!</span>
                                </p>
                                <p class="mt-3 text-[clamp(0.85rem,2vw,0.95rem)] text-gray-400">
                                    In order to bid you need fill in your banking details.
                                </p>

                                <button
                                    class="mt-4 h-11 px-6 rounded-full bg-gradient-to-r from-[#bc9a1d] to-[#d4af37] text-[clamp(0.95rem,2.4vw,1.1rem)] font-bold text-black shadow-lg transition-all hover:brightness-110">
                                    Complete Your Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <CitizenExclusiveDropBeginsHeroBid v-else :id="props.id" :end-date="props.end_date"
                    :current-highest-bid="props.current_highest_bid" :starting-price="props.starting_price"
                    :bid-increment="props.bid_increment" :time-remaining="props.time_remaining"
                    :popcorn-threshold-minutes="props.popcorn_threshold_minutes" />

                <div class="relative z-20 mx-3 mt-8 sm:mx-6">
                    <article class="w-full">
                        <p
                            class="mx-auto inline-block w-full rounded-xl bg-black/55 px-3 py-2 text-center font-['Bebas_Neue'] text-[clamp(2rem,6vw,4rem)] leading-[0.82] tracking-[-0.03em] text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.85)] backdrop-blur-[3px]">
                            MEDIA CLUES <span class="text-[#f3cf48]">REVEAL</span>
                        </p>

                        <div
                            class="relative mt-4 min-h-[260px] w-full rounded-[16px] border border-[#d4af37]/50 bg-[linear-gradient(180deg,rgba(12,12,12,0.82)_0%,rgba(18,18,18,0.92)_100%)] px-6 py-8 shadow-[0_10px_35px_rgba(0,0,0,0.55)]">
                            <button
                                class="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-[26px] text-white">&lt;</button>

                            <div
                                class="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2">
                                <img :src="assets.lockCircle" alt="Lock circle" class="absolute inset-0 h-full w-full">
                                <img :src="assets.lockGlyph" alt="Lock"
                                    class="absolute left-1/2 top-1/2 h-[54px] w-[36px] -translate-x-1/2 -translate-y-1/2">
                            </div>

                            <button
                                class="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-[26px] text-white">&gt;</button>

                            <div
                                class="absolute bottom-4 left-1/2 h-[10px] w-[10px] -translate-x-1/2 rounded-full bg-white" />
                        </div>
                    </article>
                </div>
            </div>
        </div>

        <div class="hidden lg:block">
            <div ref="frameRef" class="relative min-h-screen w-full overflow-hidden bg-black text-white">

                <div class="absolute inset-0 z-0">
                    <div class="absolute inset-0 z-10 bg-black/40" />

                    <img :src="heroBg" alt="Hero Background"
                        class="h-full w-full object-cover object-center opacity-70 grayscale">

                    <div class="absolute inset-0 z-20 bg-gradient-to-b from-transparent to-black" />
                </div>

                <div class="relative z-30 flex min-h-screen flex-col items-center justify-center px-6 py-20">

                    <button type="button"
                        class="absolute right-10 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/50 backdrop-blur-md">
                        <img :src="assets.volume" alt="Volume" class="h-5 w-5">
                    </button>

                    <template v-if="!isLoading">
                        <h2
                            class="font-['Bebas_Neue'] text-[80px] leading-none tracking-tight text-[#d4af37] mb-2 text-center">
                            {{ heroHeadline }}
                        </h2>

                        <h1
                            class="font-['Bebas_Neue'] text-[180px] leading-[0.8] tracking-tighter text-white mb-12 text-center">
                            {{ heroSubhead }}
                        </h1>

                        <div class="flex flex-wrap justify-center items-baseline gap-8 mb-12">
                            <template v-for="(unit, index) in countdownUnits" :key="`res-${unit.key}`">
                                <div class="flex items-baseline gap-1">
                                    <span
                                        class="bg-gradient-to-br from-[#977b13] to-[#d4af37] bg-clip-text text-7xl lg:text-8xl font-bold text-transparent">
                                        {{ countdown[unit.key] }}
                                    </span>
                                    <span class="text-3xl text-white uppercase">{{ unit.label }}</span>
                                </div>
                                <span v-if="index < countdownUnits.length - 1" class="text-4xl text-white">:</span>
                            </template>
                        </div>

                        <button type="button"
                            class="flex w-full max-w-[260px] items-center justify-center gap-2 rounded-full bg-[#22252b] px-8 py-3 text-xl border border-white/10 hover:scale-105 transition-transform shadow-xl mb-20">
                            <span>Share</span>
                            <img :src="assets.send" alt="Send" class="h-6 w-6">
                        </button>
                    </template>

                    <div v-if="!hasBidStarted"
                        class="relative w-full max-w-6xl mx-auto rounded-2xl bg-black/40 backdrop-blur-xl shadow-2xl">

                        <div class="pointer-events-none absolute inset-0 z-20 rounded-2xl" style="
                            padding: 1.5px;
                            background: linear-gradient(115deg, 
                                #00d8be 0%, 
                                rgba(0,216,190,0.05) 45%, 
                                rgba(0,216,190,0.05) 55%, 
                                #00d8be 100%
                            );
                            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                            -webkit-mask-composite: xor;
                            mask-composite: exclude;
                        "></div>

                        <div class="relative z-10 p-8 md:p-12">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                                <div class="text-left">
                                    <div class="flex flex-col justify-center items-center">
                                        <h2
                                            class="font-['Bebas_Neue'] text-5xl md:text-7xl leading-none text-white align-middle text-center">
                                            BIDDING STARTS <span class="text-[#d4af37]">SOON</span>
                                        </h2>
                                        <p class="mt-4 text-xl font-bold text-[#d4af37]">Popcorn Bidding</p>
                                        <p class="mt-2 text-gray-400 max-w-md text-center">
                                            Automatically Extends "Exclusive Drop" Auction's End Time by 30 minutes.
                                        </p>
                                        <button
                                            class="mt-6 rounded-full border border-white/20 bg-white/10 px-8 py-2 hover:bg-white/20 transition">
                                            Find Out More
                                        </button>
                                    </div>
                                </div>

                                <div class="border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
                                    <div class="flex flex-col justify-center items-center">
                                        <p class="text-lg text-gray-300">
                                            You have joined <span class="font-bold text-white">The Watch List</span>.
                                            Make
                                            sure
                                            to complete your profile to be ready for <span
                                                class="font-bold text-white">The
                                                Drop!</span>
                                        </p>
                                        <p class="mt-4 text-gray-400">In order to bid you need fill in your banking
                                            details.
                                        </p>
                                        <button
                                            class="mt-8 px-10 rounded-full bg-gradient-to-r from-[#bc9a1d] to-[#d4af37] py-4 text-xl font-bold text-black shadow-lg hover:brightness-110 transition">
                                            Complete Your Profile
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <CitizenExclusiveDropBeginsHeroBid v-else :id="props.id" :end-date="props.end_date"
                        :current-highest-bid="props.current_highest_bid" :starting-price="props.starting_price"
                        :bid-increment="props.bid_increment" :time-remaining="props.time_remaining"
                        :popcorn-threshold-minutes="props.popcorn_threshold_minutes" />
                </div>
            </div>
        </div>
    </section>
</template>
