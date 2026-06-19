<script setup lang="ts">
const fallbackHeroVideo = '/assets/videos/hero-background.mp4'

const props = withDefaults(
    defineProps<{
        headline?: string
        subheadLine?: string
        bgVideo?: string
        dropDate?: string | null
    }>(),
    {
        headline: "JOHNNY NELSON'S",
        subheadLine: 'EXCLUSIVE DROP',
        bgVideo: fallbackHeroVideo,
        dropDate: null
    }
)

const countdown = ref({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
})

let countdownInterval: ReturnType<typeof setInterval> | null = null

const formatTime = (value: number) => String(Math.max(0, value)).padStart(2, '0')

const updateCountdown = () => {
    if (!props.dropDate) {
        countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
        return
    }

    const targetTimestamp = new Date(props.dropDate).getTime()
    if (Number.isNaN(targetTimestamp)) {
        countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
        return
    }

    const diffInSeconds = Math.max(0, Math.floor((targetTimestamp - Date.now()) / 1000))
    const days = Math.floor(diffInSeconds / 86400)
    const hours = Math.floor((diffInSeconds % 86400) / 3600)
    const minutes = Math.floor((diffInSeconds % 3600) / 60)
    const seconds = diffInSeconds % 60

    countdown.value = {
        days: formatTime(days),
        hours: formatTime(hours),
        minutes: formatTime(minutes),
        seconds: formatTime(seconds)
    }
}

watch(
    () => props.dropDate,
    () => {
        updateCountdown()
    },
    { immediate: true }
)

onMounted(() => {
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
})
</script>

<template>
    <section
        class="relative h-[clamp(620px,90svh,985px)] w-full overflow-hidden bg-black [font-family:var(--font-family-Body)]">
        <video class="absolute inset-0 h-full w-full object-cover" :src="props.bgVideo" autoplay loop muted playsinline
            preload="auto" />
        <div class="absolute inset-0 bg-black/35" />
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_62%,rgba(0,0,0,0.95)_100%)]" />

        <div class="relative mx-auto h-full w-full max-w-[1512px]">
            <div
                class="absolute inset-x-0 bottom-[116px] px-4 sm:bottom-[126px] sm:px-8 lg:bottom-[132px] lg:px-[63px]">
                <p class="bg-clip-text text-[clamp(2.1rem,7.2vw,9.625rem)] leading-[0.8] tracking-[-0.02em] text-transparent"
                    style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(165deg, rgba(188,154,29,1) 0%, rgba(212,175,55,1) 100%); text-shadow: 0 4px 24px rgba(0,0,0,0.4); opacity: 0.9;">
                    {{ props.headline }}
                </p>

                <p class="text-[clamp(2.6rem,8.7vw,9.625rem)] leading-[0.8] tracking-[-0.02em] text-white"
                    style="font-family: 'Bebas Neue', sans-serif; text-shadow: 0 4px 24px rgba(0,0,0,0.25); opacity: 0.9;">
                    {{ props.subheadLine }}
                </p>
            </div>

            <!-- Figma node 894:4058 countdown container -->
            <div
                class="absolute bottom-0 left-0 w-full bg-[linear-gradient(180deg,rgba(0,0,0,0)_68%,rgba(88,88,88,0.35)_100%),#111215] px-3 py-3 sm:px-8 lg:px-[68px] lg:py-[17px]">
                <div class="mx-auto flex w-full items-center justify-center gap-4 sm:gap-8 lg:gap-[56px]">
                    <div class="flex items-end">
                        <span
                            class="text-[clamp(2rem,5.1vw,5.6rem)] font-bold leading-[1.1] tracking-[-0.04em] text-[#d4af37]"
                            style="font-family: 'Roboto', sans-serif;">{{ countdown.days }}</span>
                        <span
                            class="pb-1 text-[clamp(0.9rem,2.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.04em] text-white"
                            style="font-family: 'Roboto', sans-serif;">days</span>
                    </div>

                    <div
                        class="h-[44px] w-px bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0)_100%)] sm:h-[62px] lg:h-[94px]" />

                    <div class="flex items-end">
                        <span
                            class="text-[clamp(2rem,5.1vw,5.6rem)] font-bold leading-[1.1] tracking-[-0.04em] text-[#d4af37]"
                            style="font-family: 'Roboto', sans-serif;">{{ countdown.hours }}</span>
                        <span
                            class="pb-1 text-[clamp(0.9rem,2.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.04em] text-white"
                            style="font-family: 'Roboto', sans-serif;">hrs</span>
                    </div>

                    <div
                        class="h-[44px] w-px bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0)_100%)] sm:h-[62px] lg:h-[94px]" />

                    <div class="flex items-end">
                        <span
                            class="text-[clamp(2rem,5.1vw,5.6rem)] font-bold leading-[1.1] tracking-[-0.04em] text-[#d4af37]"
                            style="font-family: 'Roboto', sans-serif;">{{ countdown.minutes }}</span>
                        <span
                            class="pb-1 text-[clamp(0.9rem,2.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.04em] text-white"
                            style="font-family: 'Roboto', sans-serif;">mins</span>
                    </div>

                    <div
                        class="h-[44px] w-px bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0)_100%)] sm:h-[62px] lg:h-[94px]" />

                    <div class="flex items-end">
                        <span
                            class="text-[clamp(2rem,5.1vw,5.6rem)] font-bold leading-[1.1] tracking-[-0.04em] text-[#d4af37]"
                            style="font-family: 'Roboto', sans-serif;">{{ countdown.seconds }}</span>
                        <span
                            class="pb-1 text-[clamp(0.9rem,2.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.04em] text-white"
                            style="font-family: 'Roboto', sans-serif;">sec</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
