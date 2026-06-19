<script setup lang="ts">
const { citizen_user } = citizenAuth()
const router = useRouter()

type IconsSectionResponse = {
    data?: {
        data?: Array<IconsSectionData>
    }
}

type IconsSectionData = {
    id?: number | string
    name: string
    button_text: string
    bg_image: string
    slug?: string
    is_followed?: boolean
}

type FollowingResponse = {
    data?: {
        data?: Array<{
            id?: number | string
            is_followed?: boolean
        }>
    }
}

type ToggleFollowResponse = {
    status?: boolean
    message?: string
    data?: {
        followed?: boolean
        icon_id?: number | string
    }
}

const fallbackImage = '/assets/images/image-not-found.jpeg'

const toSlug = (value: string) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

const iconDetailPath = (card: IconsSectionData) => {
    const slug = (card as any).slug?.trim() || toSlug(card.name)
    return `/icons/${slug}`
}

const iconsSectionCache = useState<IconsSectionData[] | null>(
    'citizen-home-icons-section-cache',
    () => null
)

const normalizeIconId = (id?: number | string | null) => String(id ?? '')
const citizenAuthKey = computed(() => {
    if (!citizen_user.value) return 'guest'

    return normalizeIconId(citizen_user.value?.data?.id ?? citizen_user.value?.id) || 'logged-in'
})

const togglingIconIds = ref<Set<string>>(new Set())
const response_modal = ref({})

const loadFollowingIconIds = async () => {
    if (!citizen_user.value) {
        return new Set<string>()
    }

    try {
        const response = await $fetchCitizen<FollowingResponse>('v1/customer/icons/my-following', {
            method: 'POST',
        })

        const followedIcons = response?.data?.data ?? []

        return new Set(
            followedIcons
                .filter((icon) => icon?.id !== undefined && icon?.is_followed !== false)
                .map((icon) => normalizeIconId(icon.id))
        )
    } catch (error) {
        console.error('Failed to load followed icons:', error)
        return new Set<string>()
    }
}

const mergeFollowState = (cards: IconsSectionData[], followedIconIds: Set<string>) => {
    return cards.map((card) => ({
        ...card,
        is_followed: card.id !== undefined && followedIconIds.has(normalizeIconId(card.id)),
    }))
}

const { data: iconsResponse, status: iconsStatus } = await useAsyncData<IconsSectionData[]>(
    'citizen-home-icons-section',
    async () => {
        const followedIconIds = await loadFollowingIconIds()

        if (iconsSectionCache.value !== null) {
            iconsSectionCache.value = mergeFollowState(iconsSectionCache.value, followedIconIds)
            return iconsSectionCache.value
        }

        try {
            const response = await $fetchCMS<IconsSectionResponse>('v1/cms/icons', {
                method: 'POST',
            })

            const payload = mergeFollowState(response?.data?.data ?? [], followedIconIds)
            iconsSectionCache.value = payload

            return payload
        } catch (error) {
            console.error('Failed to load home icons section:', error)
            return iconsSectionCache.value ?? []
        }
    },
    {
        default: () => iconsSectionCache.value ?? [],
        server: false,
        watch: [citizenAuthKey],
    }
)

const iconsCarousel = computed(() => iconsResponse.value ?? [])
const isHydrated = ref(false)

const showSkeleton = computed(() => iconsStatus.value === 'pending' || !isHydrated.value)

const responsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]

const iconsPage = ref(0)
const iconsVisible = ref(3)
const iconsDragStartX = ref<number | null>(null)

const updateIconsVisible = () => {
    const width = window.innerWidth

    if (width <= 767) {
        iconsVisible.value = 1
        return
    }

    if (width <= 1400) {
        iconsVisible.value = 2
        return
    }

    iconsVisible.value = 3
}

const nextIconsPage = () => {
    const maxPage = Math.max(iconsCarousel.value.length - iconsVisible.value, 0)
    iconsPage.value = iconsPage.value >= maxPage ? 0 : iconsPage.value + 1
}

const prevIconsPage = () => {
    const maxPage = Math.max(iconsCarousel.value.length - iconsVisible.value, 0)
    iconsPage.value = iconsPage.value <= 0 ? maxPage : iconsPage.value - 1
}

const onIconsPointerDown = (event: PointerEvent) => {
    iconsDragStartX.value = event.clientX
}

const onIconsPointerEnd = (event: PointerEvent) => {
    if (iconsDragStartX.value === null) return

    const diff = event.clientX - iconsDragStartX.value
    iconsDragStartX.value = null

    if (Math.abs(diff) < 40) return

    if (diff < 0) {
        nextIconsPage()
        return
    }

    prevIconsPage()
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    if (img) {
        img.src = fallbackImage
    }
}

const followButtonText = (card: IconsSectionData) => {
    return card.is_followed ? 'Unfollow' : 'Follow'
}

const setToggleLoading = (iconId: string, isLoading: boolean) => {
    const nextIds = new Set(togglingIconIds.value)

    if (isLoading) {
        nextIds.add(iconId)
    } else {
        nextIds.delete(iconId)
    }

    togglingIconIds.value = nextIds
}

const isTogglingIcon = (card: IconsSectionData) => {
    return togglingIconIds.value.has(normalizeIconId(card.id))
}

const updateIconFollowState = (iconId: string, followed: boolean) => {
    if (!iconId) return

    const updateCards = (cards: IconsSectionData[]) => cards.map((card) => (
        normalizeIconId(card.id) === iconId
            ? { ...card, is_followed: followed }
            : card
    ))

    iconsResponse.value = updateCards(iconsResponse.value ?? [])

    if (iconsSectionCache.value) {
        iconsSectionCache.value = updateCards(iconsSectionCache.value)
    }
}

const toggleFollow = async (card: IconsSectionData) => {
    if (!citizen_user.value) {
        await router.push('/signin')
        return
    }

    const iconId = normalizeIconId(card.id)
    if (!iconId || togglingIconIds.value.has(iconId)) return

    setToggleLoading(iconId, true)

    try {
        const response = await $fetchCitizen<ToggleFollowResponse>(`v1/customer/icons/${iconId}/follow/toggle`, {
            method: 'POST',
        })

        if (response?.status) {
            updateIconFollowState(normalizeIconId(response.data?.icon_id) || iconId, Boolean(response.data?.followed))
        }

        response_modal.value = response || {
            status: false,
            message: 'Failed to update follow status. Please try again.',
        }
    } catch (error: any) {
        response_modal.value = error?.response?._data || error?.data || {
            status: false,
            message: 'Failed to update follow status. Please try again.',
        }
    } finally {
        setToggleLoading(iconId, false)
    }
}

onMounted(() => {
    isHydrated.value = true
    updateIconsVisible()
    window.addEventListener('resize', updateIconsVisible)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateIconsVisible)
})
</script>

<template>
    <section class="relative border-[5px] border-[#111215] bg-black">
        <div
            class="mx-auto w-full max-w-[1512px] px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-[72px] lg:pb-[120px] lg:pt-[160px]">
            <div class="flex flex-col gap-3">
                <div class="font-['Bebas_Neue'] text-[clamp(2rem,5vw,3.9375rem)] leading-[0.95] text-white/90">COME AND
                    MEET THE</div>
                <div
                    class="bg-[linear-gradient(140.09deg,rgb(188,154,29)_28.673%,rgb(212,175,55)_71.327%)] bg-clip-text font-['Bebas_Neue'] text-[clamp(3.2rem,11vw,15rem)] leading-[0.82] text-transparent">
                    THE ICONS
                </div>
            </div>
            <div class="mt-6 flex flex-col gap-5 lg:mt-8 lg:flex-row lg:items-center lg:justify-between">
                <p class="max-w-[692px] text-[clamp(1rem,2.4vw,2rem)] leading-[1.2] text-[#d0d1d4]">
                    Behind every collectible is an <span class="font-bold text-[#d4af37]">Icon</span> with a story. Get
                    to know the athletes behind
                    Collectivault.
                </p>
                <button
                    class="h-11 w-full max-w-[220px] rounded-[999px] bg-[linear-gradient(145.74deg,rgb(188,154,29)_28.673%,rgb(212,175,55)_71.327%)] text-[clamp(1rem,1.7vw,1.5rem)] text-black shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] sm:h-12 sm:max-w-[240px] lg:w-[260px] lg:max-w-[260px]">
                    View All Icons
                </button>
            </div>
            <div class="mt-10 cursor-grab pb-6 sm:mt-14 active:cursor-grabbing" @pointerdown="onIconsPointerDown"
                @pointerup="onIconsPointerEnd" @pointercancel="onIconsPointerEnd" @pointerleave="onIconsPointerEnd">
                <Carousel class="icons-carousel" :value="iconsCarousel" v-model:page="iconsPage"
                    :numVisible="iconsVisible" :numScroll="1" :responsiveOptions="responsiveOptions"
                    :showIndicators="false" :showNavigators="false" circular :autoplayInterval="3000">
                    <template #item="slotProps">
                        <div class="flex justify-center px-1.5 py-2 sm:px-2">
                            <div
                                class="relative flex min-h-[560px] w-full max-w-[441px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.64)] bg-[rgba(0,0,0,0.2)] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0px_2px_rgba(255,255,255,0.2)] backdrop-blur-[100px] sm:min-h-[620px] lg:min-h-[674px]">
                                <NuxtLink :to="iconDetailPath(slotProps.data)" class="mx-2 mt-2 block h-[360px] overflow-hidden rounded-[16px] sm:h-[420px] lg:h-[465px]">
                                    <img alt=""
                                        class="h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
                                        :src="slotProps.data.bg_image || fallbackImage" @error="handleImageError" />
                                </NuxtLink>

                                <NuxtLink :to="iconDetailPath(slotProps.data)"
                                    class="mt-5 bg-[linear-gradient(165deg,rgb(151,123,19)_0%,rgb(212,175,55)_100%)] bg-clip-text px-3 text-center font-['Bebas_Neue'] text-[clamp(1.9rem,4.2vw,2.625rem)] leading-[0.9] text-transparent">
                                    {{ slotProps.data.name }}
                                </NuxtLink>
                                <button type="button" :disabled="isTogglingIcon(slotProps.data)"
                                    class="relative z-10 mx-auto mt-5 h-11 w-[calc(100%-2.5rem)] max-w-[384px] rounded-[999px] bg-[linear-gradient(-15deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%),linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%)] text-[clamp(1rem,2.1vw,1.25rem)] text-white shadow-[0px_4px_24px_0px_rgba(0,0,0,0.25)] transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12"
                                    @click="toggleFollow(slotProps.data)">
                                    {{ isTogglingIcon(slotProps.data) ? 'Please wait...' : followButtonText(slotProps.data) }}
                                </button>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>
        </div>

        <!-- Skeleton overlay -->
        <div v-if="showSkeleton" class="pointer-events-none absolute inset-0 z-20">
            <div class="absolute inset-0 bg-black" />

            <div
                class="mx-auto w-full max-w-[1512px] px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-[72px] lg:pb-[120px] lg:pt-[160px] animate-pulse">
                <!-- Heading skeleton -->
                <div class="flex flex-col gap-3">
                    <div class="h-[clamp(2rem,5vw,3.9375rem)] w-full max-w-[520px] rounded-[10px] bg-white/10" />
                    <div class="h-[clamp(3.2rem,11vw,15rem)] w-full max-w-[700px] rounded-[16px]"
                        style="background-image: linear-gradient(140.09deg, rgba(188, 154, 29, 0.35) 28.673%, rgba(212, 175, 55, 0.5) 71.327%);" />
                </div>

                <!-- Subtitle + button skeleton -->
                <div class="mt-6 flex flex-col gap-5 lg:mt-8 lg:flex-row lg:items-center lg:justify-between">
                    <div class="flex max-w-[692px] flex-col gap-2">
                        <div class="h-6 w-full max-w-[600px] rounded-[6px] bg-white/10" />
                        <div class="h-6 w-full max-w-[400px] rounded-[6px] bg-white/10" />
                    </div>
                    <div class="h-11 w-full max-w-[220px] rounded-[999px] sm:h-12 sm:max-w-[240px] lg:w-[260px] lg:max-w-[260px]"
                        style="background-image: linear-gradient(145.74deg, rgba(188, 154, 29, 0.35) 28.673%, rgba(212, 175, 55, 0.5) 71.327%);" />
                </div>

                <!-- Carousel cards skeleton -->
                <div class="mt-10 sm:mt-14">
                    <div class="flex gap-3 sm:gap-4">
                        <div v-for="n in 3" :key="n" class="flex-1 px-1.5 py-2 sm:px-2"
                            :class="{ 'hidden sm:block': n === 2, 'hidden lg:block': n === 3 }">
                            <div
                                class="relative flex min-h-[560px] w-full max-w-[441px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.2)] sm:min-h-[620px] lg:min-h-[674px]">
                                <!-- Image skeleton -->
                                <div
                                    class="mx-2 mt-2 h-[360px] overflow-hidden rounded-[16px] bg-white/8 sm:h-[420px] lg:h-[465px]" />

                                <!-- Name skeleton -->
                                <div class="mx-auto mt-5 h-[clamp(1.9rem,4.2vw,2.625rem)] w-[70%] rounded-[10px]"
                                    style="background-image: linear-gradient(165deg, rgba(151, 123, 19, 0.3) 0%, rgba(212, 175, 55, 0.45) 100%);" />

                                <!-- Button skeleton -->
                                <div
                                    class="mx-auto mt-5 h-11 w-[calc(100%-2.5rem)] max-w-[384px] rounded-[999px] bg-white/8 sm:h-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LazyResponseModal :response_modal="response_modal" />
    </section>
</template>

<style scoped>
:deep(.icons-carousel .p-carousel-item) {
    padding: 0;
}
</style>
