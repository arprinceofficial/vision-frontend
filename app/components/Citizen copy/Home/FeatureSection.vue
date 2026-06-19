<script setup lang="ts">
type FeatureSectionResponse = {
    data?: {
        data?: Array<FeatureSectionData>
    }
}

type FeatureSectionData = {
    title_white: string
    title_color: string
    description: string
    icon: string
}

const featureIconList = '/assets/images/citizen/home/feature-icon-list.svg'
const featureIconCountdown = '/assets/images/citizen/home/feature-icon-countdown.svg'
const featureIconDrop = '/assets/images/citizen/home/feature-icon-drop.svg'

const fallbackFeature: FeatureSectionData[] = [
    {
        title_white: 'RARE',
        title_color: 'ITEMS',
        description:
            'Collectivault is your source for rare, authenticated memorabilia - items coming directly from the Icons themselves.',
        icon: featureIconList
    },
    {
        title_white: 'EXCLUSIVE',
        title_color: 'DROPS',
        description: 'You can access these special pieces through our Exclusive Drops or Directly through The Vault.',
        icon: featureIconCountdown
    },
    {
        title_white: 'CHARITY',
        title_color: 'PARTNERS',
        description:
            'Each purchase supports grassroots charities chosen by our Icons, with a portion of the profits donated to their chosen charity.',
        icon: featureIconDrop
    }
]

const featureSectionCache = useState<FeatureSectionData[] | null>(
    'citizen-home-feature-section-cache',
    () => null
)

const { data: featureResponse, status: featureStatus } = await useAsyncData<FeatureSectionData[]>(
    'citizen-home-feature-section',
    async () => {
        if (featureSectionCache.value !== null) {
            return featureSectionCache.value
        }

        try {
            const response = await $fetchCMS<FeatureSectionResponse>('v1/cms/feature-sections', {
                method: 'POST',
            })

            const payload = response?.data?.data ?? fallbackFeature
            featureSectionCache.value = payload

            return payload
        } catch (error) {
            console.error('Failed to load home feature section:', error)
            featureSectionCache.value = fallbackFeature
            return fallbackFeature
        }
    },
    {
        default: () => featureSectionCache.value ?? fallbackFeature
    }
)

const featureCards = computed(() => featureResponse.value ?? fallbackFeature)
const isHydrated = ref(false)

const showSkeleton = computed(() => featureStatus.value === 'pending' || !isHydrated.value)

onMounted(() => {
    isHydrated.value = true
})
</script>

<template>
    <section class="relative border-[5px] border-[#111215] bg-black">
        <div
            class="mx-auto flex w-full max-w-[1512px] flex-col gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:gap-[56px] lg:px-[72px] lg:py-[120px]">
            <p class="text-[clamp(1.75rem,3.9vw,3rem)] leading-[1.08]">
                <span class="font-bold text-[#d4af37]">Collectivault</span>
                <span class="text-[#d0d1d4]"> opens the door to the world’s most iconic cultural pieces directly from
                    <span class="font-bold text-[#d0d1d4]">Icons</span> of sport, music, the arts and
                    entertainment.</span>
            </p>
            <div class="grid gap-5 sm:gap-6 lg:grid-cols-3">
                <div v-for="card in featureCards" :key="card.title_color"
                    class="relative flex min-h-[460px] flex-col items-center justify-center rounded-[16px] border border-white bg-[rgba(180,174,165,0.1)] px-5 py-8 text-center backdrop-blur-[50px] sm:min-h-[500px] sm:px-6 sm:py-9 md:min-h-[560px] lg:min-h-[591px]">
                    <div class="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-9 lg:gap-[44px]">
                        <div
                            class="flex h-[78px] w-[78px] items-center justify-center rounded-[148.5px] border-2 border-[#d0d1d4] sm:h-[92px] sm:w-[92px] md:h-[108px] md:w-[108px] md:border-3">
                            <img alt="" class="h-[48px] w-[48px] sm:h-[57px] sm:w-[57px] md:h-[67.5px] md:w-[67.5px]"
                                :src="card.icon" />
                        </div>
                        <div class="w-full text-center text-[clamp(2.75rem,7.3vw,6.25rem)] leading-[0.8] tracking-[-0.04em]"
                            style="font-family: 'Bebas Neue', sans-serif;">
                            <p class="mb-0 text-[#d0d1d4]">{{ card.title_white }}</p>
                            <p class="bg-clip-text text-transparent"
                                style="background-image: linear-gradient(110deg, rgb(151, 123, 19) 28.673%, rgb(212, 175, 55) 71.327%);">
                                {{ card.title_color }}
                            </p>
                        </div>
                        <p
                            class="max-w-[355px] text-[clamp(0.95rem,1.35vw,1rem)] font-bold leading-[1.3] text-[#d0d1d4]">
                            {{ card.description }}</p>
                        <NuxtLink :to="card.button_link || '#'"
                            class="flex items-center justify-center h-11 w-full max-w-[280px] rounded-[999px] text-[clamp(1.35rem,2.2vw,2rem)] leading-none text-black shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] sm:h-12 sm:max-w-[320px] lg:h-[48px] lg:max-w-[360px]"
                            style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(153.81deg, rgb(188, 154, 29) 28.673%, rgb(212, 175, 55) 71.327%);">
                            {{ card.button_text || 'Find out More' }}
                        </NuxtLink>
                    </div>
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-2px_0px_2px_0px_rgba(255,255,255,0.2),inset_3px_3px_2px_0px_rgba(255,255,255,0.1)]" />
                </div>
            </div>
        </div>

        <!-- Skeleton overlay -->
        <div v-if="showSkeleton" class="pointer-events-none absolute inset-0 z-20">
            <div class="absolute inset-0 bg-black" />

            <div
                class="mx-auto flex w-full max-w-[1512px] flex-col gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:gap-[56px] lg:px-[72px] lg:py-[120px] animate-pulse">
                <!-- Heading skeleton -->
                <div class="flex flex-col gap-2">
                    <div class="h-[clamp(1.75rem,3.9vw,3rem)] w-full max-w-[900px] rounded-[10px] bg-white/10" />
                    <div class="h-[clamp(1.75rem,3.9vw,3rem)] w-full max-w-[320px] rounded-[10px] bg-white/10" />
                </div>

                <!-- Cards skeleton -->
                <div class="grid gap-5 sm:gap-6 lg:grid-cols-3">
                    <div v-for="n in 3" :key="n"
                        class="relative flex min-h-[460px] flex-col items-center justify-center rounded-[16px] border border-white/20 bg-[rgba(180,174,165,0.05)] px-5 py-8 sm:min-h-[500px] sm:px-6 sm:py-9 md:min-h-[560px] lg:min-h-[591px]">
                        <div class="flex w-full flex-col items-center gap-6 sm:gap-8 md:gap-9 lg:gap-[44px]">
                            <!-- Icon circle skeleton -->
                            <div
                                class="h-[78px] w-[78px] rounded-full border-2 border-white/15 bg-white/10 sm:h-[92px] sm:w-[92px] md:h-[108px] md:w-[108px]" />

                            <!-- Title skeleton -->
                            <div class="flex w-full flex-col items-center gap-1">
                                <div class="h-[clamp(2.75rem,7.3vw,6.25rem)] w-[70%] rounded-[10px] bg-white/10" />
                                <div class="h-[clamp(2.75rem,7.3vw,6.25rem)] w-[55%] rounded-[10px]"
                                    style="background-image: linear-gradient(110deg, rgba(151, 123, 19, 0.3) 28.673%, rgba(212, 175, 55, 0.45) 71.327%);" />
                            </div>

                            <!-- Description text skeleton -->
                            <div class="flex w-full max-w-[355px] flex-col items-center gap-2">
                                <div class="h-4 w-full rounded-[6px] bg-white/10" />
                                <div class="h-4 w-[85%] rounded-[6px] bg-white/10" />
                                <div class="h-4 w-[60%] rounded-[6px] bg-white/10" />
                            </div>

                            <!-- Button skeleton -->
                            <div class="h-11 w-full max-w-[280px] rounded-[999px] sm:h-12 sm:max-w-[320px] lg:h-[48px] lg:max-w-[360px]"
                                style="background-image: linear-gradient(153.81deg, rgba(188, 154, 29, 0.35) 28.673%, rgba(212, 175, 55, 0.5) 71.327%);" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
