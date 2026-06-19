<script setup lang="ts">
type HeroSectionResponse = {
    data?: {
        data?: Array<HeroSectionData>
    }
}

type HeroSectionData = {
    id: number | null
    headline: string
    subhead_line: string
    bg_video: string
    status: number
}

const fallbackHero: HeroSectionData = {
    id: 1,
    headline: 'Collectivault',
    subhead_line: 'OWN A PIECE OF HISTORY',
    bg_video: '/assets/videos/hero-background.mp4',
    status: 1
}

const heroSectionCache = useState<HeroSectionData | null>(
    'citizen-home-hero-section-cache',
    () => null
)

const volumeIcon = '/assets/images/citizen/home/volume-icon.svg'
const fallbackImage = '/assets/images/empty-blank-img.jpeg'

const { data: heroResponse, status: heroStatus } = await useAsyncData<HeroSectionData>(
    'citizen-home-hero-section',
    async () => {
        if (heroSectionCache.value !== null) {
            return heroSectionCache.value
        }

        try {
            const response = await $fetchCMS<HeroSectionResponse>('v1/cms/hero-sections', {
                method: 'POST',
            })

            const payload = response?.data?.data?.[0] ?? fallbackHero
            heroSectionCache.value = payload

            return payload
        } catch (error) {
            console.error('Failed to load home hero section:', error)
            heroSectionCache.value = fallbackHero
            return fallbackHero
        }
    },
    {
        default: () => heroSectionCache.value ?? fallbackHero
    }
)

const heroData = computed(() => heroResponse.value ?? fallbackHero)
const heroVideoRef = ref<HTMLVideoElement | null>(null)
const isAudioOn = ref(false)
const isHydrated = ref(false)
const isVideoReady = ref(false)

const showSkeleton = computed(() => heroStatus.value === 'pending' || !isHydrated.value)
const showFallbackImage = computed(() => !heroData.value.bg_video || !isVideoReady.value)

const syncVideoPlayback = async () => {
    const video = heroVideoRef.value
    if (!video) return

    video.muted = !isAudioOn.value
    if (isAudioOn.value) {
        video.volume = 1
    }

    try {
        await video.play()
    } catch {
        if (isAudioOn.value) {
            isAudioOn.value = false
            video.muted = true
        }
    }
}

const removeUnlockListeners = () => {
    window.removeEventListener('click', handleGlobalInteraction)
    window.removeEventListener('touchstart', handleGlobalInteraction)
    window.removeEventListener('keydown', handleGlobalInteraction)
}

const handleGlobalInteraction = async (event: Event) => {
    if (!event.isTrusted) return

    const video = heroVideoRef.value
    if (!video || isAudioOn.value) return

    try {
        isAudioOn.value = true
        video.muted = false
        video.volume = 1
        await video.play()
        removeUnlockListeners()
    } catch {
        isAudioOn.value = false
        video.muted = true
    }
}

const toggleAudio = async (event?: Event) => {
    event?.stopPropagation()

    isAudioOn.value = !isAudioOn.value
    await syncVideoPlayback()
}

const handleVideoReady = () => {
    isVideoReady.value = true
}

const handleVideoWaiting = () => {
    isVideoReady.value = false
}

watch(
    () => heroData.value.bg_video,
    async () => {
        isVideoReady.value = false

        if (!import.meta.client) return

        await nextTick()
        await syncVideoPlayback()
    }
)

onMounted(async () => {
    isHydrated.value = true
    await syncVideoPlayback()

    window.addEventListener('click', handleGlobalInteraction, { once: true })
    window.addEventListener('touchstart', handleGlobalInteraction, { once: true })
    window.addEventListener('keydown', handleGlobalInteraction, { once: true })
})

onBeforeUnmount(() => {
    removeUnlockListeners()
})
</script>

<template>
    <section class="relative h-[clamp(560px,88svh,985px)] w-full overflow-hidden bg-[#0b0c0f]" tabindex="0">
        <img v-if="showFallbackImage" :src="fallbackImage" alt="" class="absolute inset-0 h-full w-full object-cover">

        <video v-if="heroData.bg_video" ref="heroVideoRef"
            class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            :class="isVideoReady ? 'opacity-100' : 'opacity-0'" :src="heroData.bg_video" :poster="fallbackImage"
            autoplay loop :muted="!isAudioOn" playsinline preload="auto" @loadeddata="handleVideoReady"
            @canplay="handleVideoReady" @playing="handleVideoReady" @waiting="handleVideoWaiting"
            @error="handleVideoWaiting" />

        <div class="absolute inset-0 bg-black/30" />
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_78%,rgba(0,0,0,1)_100%)]" />

        <div class="relative mx-auto h-full w-full max-w-[1512px]">
            <button
                class="absolute right-4 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/50 p-2 sm:right-6 sm:top-8 md:right-10 lg:right-[72px] lg:top-[50px]"
                :aria-label="isAudioOn ? 'Mute audio' : 'Unmute audio'" @click="toggleAudio">
                <img :src="volumeIcon" alt="" class="h-[16px] w-[16px]">
            </button>

            <div
                class="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-4 pb-8 sm:px-6 sm:pb-10 md:items-end md:px-10 lg:px-[72px] lg:pb-12">
                <p class="w-full text-left text-[clamp(2rem,7vw,4.9375rem)] leading-[0.82] text-white/90 md:text-right"
                    style="font-family: 'Bebas Neue', sans-serif; text-shadow: 0px 4px 24px rgba(0, 0, 0, 0.25);">
                    {{ heroData.subhead_line }}
                </p>
                <p class="w-full bg-clip-text text-left text-[clamp(3.5rem,16vw,15rem)] leading-[0.8] text-transparent md:text-right"
                    style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(165deg, rgb(188, 154, 29) 0%, rgb(212, 175, 55) 100%); text-shadow: 0px 4px 24px rgba(0, 0, 0, 0.4);">
                    {{ heroData.headline }}
                </p>
            </div>
        </div>

        <div v-if="showSkeleton" class="pointer-events-none absolute inset-0 z-20">
            <div class="absolute inset-0 bg-[#0b0c0f]" />
            <div class="absolute inset-0 bg-black/30" />
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_78%,rgba(0,0,0,1)_100%)]" />

            <div class="relative mx-auto h-full w-full max-w-[1512px] animate-pulse">
                <div
                    class="absolute right-4 top-6 h-8 w-8 rounded-full bg-white/25 sm:right-6 sm:top-8 md:right-10 lg:right-[72px] lg:top-[50px]" />

                <div
                    class="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-4 pb-8 sm:px-6 sm:pb-10 md:items-end md:px-10 lg:px-[72px] lg:pb-12">
                    <div class="w-full md:flex md:justify-end">
                        <div class="h-[clamp(2rem,7vw,4.9375rem)] w-full max-w-[640px] rounded-[10px] bg-white/20" />
                    </div>
                    <div class="w-full md:flex md:justify-end">
                        <div class="h-[clamp(3.5rem,16vw,15rem)] w-full max-w-[960px] rounded-[16px]"
                            style="background-image: linear-gradient(165deg, rgba(188, 154, 29, 0.45) 0%, rgba(212, 175, 55, 0.7) 100%);" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
