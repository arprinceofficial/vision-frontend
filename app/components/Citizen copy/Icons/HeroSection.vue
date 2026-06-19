<script setup lang="ts">
type HeroSectionData = {
    id?: number | null
    headline: string
    subhead_line: string
    bg_video?: string
    status?: number
}

const fallbackHero: HeroSectionData = {
    id: null,
    headline: 'MEET',
    subhead_line: 'OUR ICONS',
    bg_video: 'https://dev-collectivault.aptoro.ai/assets/videos/hero-background.mp4',
    status: 1,
}

const heroSection = useState<HeroSectionData | null>('citizen-icons-hero-section', () => null)
const heroData = computed(() => heroSection.value ?? fallbackHero)

const heroVideoRef = ref<HTMLVideoElement | null>(null)
const isAudioOn = ref(false)
const isHydrated = ref(false)
const isVideoReady = ref(false)

const heroBackground = '/assets/images/citizen/home/hero-background.png'
const volumeIcon = '/assets/images/citizen/icons/volume-icon.svg'
const fallbackImage = '/assets/images/empty-blank-img.jpeg'

const showSkeleton = computed(() => !isHydrated.value || !heroData.value.bg_video)

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
    <section class="relative h-[72vh] min-h-[560px] w-full overflow-hidden sm:min-h-[680px] lg:h-[984px]">
        <img v-if="showSkeleton || !heroData.bg_video" :src="heroBackground" alt="" class="absolute inset-0 h-full w-full object-cover" />
        <video v-if="heroData.bg_video" ref="heroVideoRef"
            class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            :class="isVideoReady ? 'opacity-100' : 'opacity-0'" :src="heroData.bg_video" :poster="fallbackImage"
            autoplay loop :muted="!isAudioOn" playsinline preload="auto" @loadeddata="handleVideoReady"
            @canplay="handleVideoReady" @playing="handleVideoReady" @waiting="handleVideoWaiting" @error="handleVideoWaiting" />

        <div class="absolute inset-0 bg-[rgba(0,0,0,0.56)]" />

        <div class="absolute inset-0">
            <div class="relative mx-auto h-full w-full max-w-[1512px]">
                <div class="absolute bottom-[74px] left-[16px] sm:left-[24px] lg:left-[72px]">
                    <p
                        class="[font-family:var(--font-family-Headings)] text-[clamp(2.2rem,6vw,4.9375rem)] uppercase leading-[0.8] tracking-[-0.02em] text-white/90 drop-shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                        {{ heroData.subhead_line }}
                    </p>
                    <p
                        class="mt-1 bg-[linear-gradient(140.62deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(4.3rem,16vw,15rem)] uppercase leading-[0.8] text-transparent drop-shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
                        {{ heroData.headline }}
                    </p>
                </div>

                <button type="button"
                    class="absolute right-[16px] top-[24px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.5)] p-[8px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:right-[24px] lg:right-[72px] lg:top-[58px]"
                    :aria-label="isAudioOn ? 'Mute audio' : 'Unmute audio'" @click="toggleAudio">
                    <img :src="volumeIcon" alt="" class="h-[16px] w-[16px]" />
                </button>
            </div>
        </div>
    </section>
</template>