<script setup lang="ts">
const { citizen_user } = citizenAuth()
const router = useRouter()
const searchIcon = '/assets/images/citizen/icons/search-icon.svg'
const emit = defineEmits(['hero_section']);
const heroSectionState = useState('citizen-icons-hero-section', () => null)
type IconsResponse = {
    data?: {
        data?: Array<IconCard>
        hero_section?: any
    }
}

type IconCard = {
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

const searchInput = ref('')
const debouncedSearch = ref('')
import Dropdown from 'primevue/dropdown'

const sortOrder = ref<'asc' | 'desc'>('asc')
const sortOptions = ref([
    { label: 'A-Z', value: 'asc' },
    { label: 'Z-A', value: 'desc' },
])
const isHydrated = ref(false)
const forceRefetch = ref(false)
const togglingIconIds = ref<Set<string>>(new Set())
const response_modal = ref({})

const sortLabel = computed(() => (sortOrder.value === 'asc' ? 'A-Z' : 'Z-A'))

const iconsCache = useState<Record<string, IconCard[]>>(
    'citizen-icons-list-cache',
    () => ({})
)

const getCacheKey = () => `${debouncedSearch.value.trim().toLowerCase()}::${sortOrder.value}`

const normalizeIconId = (id?: number | string | null) => String(id ?? '')
const citizenAuthKey = computed(() => {
    if (!citizen_user.value) return 'guest'

    return normalizeIconId(citizen_user.value?.data?.id ?? citizen_user.value?.id) || 'logged-in'
})

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

const mergeFollowState = (cards: IconCard[], followedIconIds: Set<string>) => {
    return cards.map((card) => ({
        ...card,
        is_followed: card.id !== undefined && followedIconIds.has(normalizeIconId(card.id)),
    }))
}

const onSortChange = () => {
    forceRefetch.value = true
    debouncedSearch.value = searchInput.value
}

const { data: iconsResponse, status: iconsStatus } = await useAsyncData<IconCard[]>(
    'citizen-icons-list',
    async () => {
        const followedIconIds = await loadFollowingIconIds()
        const cacheKey = getCacheKey()
        const cached = iconsCache.value[cacheKey]

        const shouldForceRefetch = forceRefetch.value
        forceRefetch.value = false

        if (!shouldForceRefetch && cached) {
            const mergedCached = mergeFollowState(cached, followedIconIds)
            iconsCache.value[cacheKey] = mergedCached
            return mergedCached
        }

        try {
            const response = await $fetchCMS<IconsResponse>('v1/cms/icons', {
                method: 'POST',
                body: {
                    search: debouncedSearch.value.trim(),
                    sort: sortOrder.value,
                },
            })

            const payload = mergeFollowState(response?.data?.data ?? [], followedIconIds)
            iconsCache.value[cacheKey] = payload
            const heroSection = response?.data?.hero_section ?? null
            heroSectionState.value = heroSection
            if (import.meta.client && heroSection !== null) {
                emit('hero_section', heroSection)
            }

            return payload
        } catch (error) {
            console.error('Failed to load icons page list:', error)
            return cached ?? []
        }
    },
    {
        default: () => iconsCache.value[getCacheKey()] ?? [],
        server: false,
        watch: [debouncedSearch, sortOrder, citizenAuthKey],
    }
)

const iconCards = computed(() => iconsResponse.value ?? [])
const showSkeleton = computed(() => iconsStatus.value === 'pending' || !isHydrated.value)

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (value) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer)
    }

    searchDebounceTimer = setTimeout(() => {
        debouncedSearch.value = value
    }, 350)
})

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement

    if (img) {
        img.src = fallbackImage
    }
}

const toSlug = (value: string) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

const iconDetailPath = (card: IconCard) => {
    const slug = card.slug?.trim() || toSlug(card.name)
    return `/icons/${slug}`
}

const followButtonText = (card: IconCard) => {
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

const isTogglingIcon = (card: IconCard) => {
    return togglingIconIds.value.has(normalizeIconId(card.id))
}

const updateIconFollowState = (iconId: string, followed: boolean) => {
    if (!iconId) return

    const cacheKey = getCacheKey()
    const updateCards = (cards: IconCard[]) => cards.map((card) => (
        normalizeIconId(card.id) === iconId
            ? { ...card, is_followed: followed }
            : card
    ))

    iconsResponse.value = updateCards(iconsResponse.value ?? [])

    if (iconsCache.value[cacheKey]) {
        iconsCache.value[cacheKey] = updateCards(iconsCache.value[cacheKey])
    }
}

const toggleFollow = async (card: IconCard) => {
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
})

onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer)
    }
})
</script>

<template>
    <section class="relative mx-auto h-full w-full max-w-[1513px] border-[5px] border-[#111215] bg-black">
        <div class="mx-auto w-full max-w-[1512px] px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-[72px]">
            <div class="flex flex-wrap justify-center gap-3 lg:justify-start">
                <label
                    class="flex h-11 w-full max-w-[360px] items-center gap-3 rounded-[1498.5px] bg-[linear-gradient(118.29deg,rgba(255,255,255,0)_28.673%,rgba(255,255,255,0.1)_71.327%),linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%)] px-6 py-3 shadow-[0px_6px_24px_rgba(0,0,0,0.25)] sm:h-12 sm:px-8">
                    <img :src="searchIcon" alt="" class="h-5 w-5 sm:h-6 sm:w-6" />
                    <input v-model="searchInput" type="text" placeholder="Search Icons"
                        class="w-full bg-transparent text-[clamp(1rem,2.6vw,1.5rem)] font-normal leading-[1.2] text-white outline-none placeholder:text-white/70" />
                </label>

                <label
                    class="group relative flex h-11 min-w-[180px] items-center justify-between gap-3 rounded-full bg-white px-4 py-1 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] transition hover:bg-white/95 focus-within:ring-2 focus-within:ring-black/20 sm:h-12 sm:min-w-[220px]">
                    <span class="text-[clamp(0.95rem,2.2vw,1.25rem)] font-normal leading-[1.2] text-black">
                        Sort
                    </span>
                    <div class="relative icons-sort">
                        <Dropdown v-model="sortOrder" :options="sortOptions" optionLabel="label" optionValue="value"
                            @input="onSortChange"
                            class="appearance-none bg-transparent pr-8 text-[clamp(0.95rem,2.2vw,1.25rem)] font-normal leading-[1.2] text-black"
                            inputClass="text-black bg-transparent" style="background:transparent; border:none; box-shadow:none;" />
                    </div>
                </label>
            </div>

            <div class="mt-12 grid grid-cols-1 justify-center justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
                <article v-for="(card, index) in iconCards" :key="`icons-${card.name}-${index}`"
                    class="relative min-h-[610px] w-full max-w-[441px] overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.64)] bg-[rgba(0,0,0,0.2)] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0px_2px_rgba(255,255,255,0.2)] backdrop-blur-[100px] sm:min-h-[674px]">
                    <NuxtLink :to="iconDetailPath(card)" class="mx-2 mt-2 block h-[360px] overflow-hidden rounded-[16px] sm:h-[465px]">
                        <img :src="card.bg_image || fallbackImage" :alt="card.name"
                            class="h-full w-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
                            @error="handleImageError" />
                    </NuxtLink>

                    <NuxtLink :to="iconDetailPath(card)"
                        class="mt-6 block w-full bg-[linear-gradient(165deg,rgb(151,123,19)_0%,rgb(212,175,55)_100%)] bg-clip-text px-4 text-center font-['Bebas_Neue'] text-[clamp(2rem,6vw,3rem)] leading-[0.84] tracking-[-0.03em] text-transparent sm:mt-10 sm:text-[48px] sm:leading-[40px] sm:tracking-[-1.44px]">
                        {{ card.name }}
                    </NuxtLink>

                    <button type="button" :disabled="isTogglingIcon(card)"
                        class="relative z-40 mx-auto mt-8 flex h-11 w-[calc(100%-42px)] max-w-[384px] items-center justify-center rounded-full bg-[linear-gradient(114.75deg,rgba(255,255,255,0)_28.673%,rgba(255,255,255,0.1)_71.327%),linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%)] px-6 py-2 text-[clamp(1rem,2.5vw,1.25rem)] font-normal leading-[1.2] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)] transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-10 sm:h-[48px] sm:w-[calc(100%-58px)] sm:px-[32px] sm:py-[10px] sm:text-[20px] sm:leading-[25px]"
                        @click="toggleFollow(card)">
                        {{ isTogglingIcon(card) ? 'Please wait...' : followButtonText(card) }}
                    </button>

                    <div
                        class="pointer-events-none absolute inset-0 z-30 rounded-[16px] shadow-[inset_-2px_0px_2px_rgba(255,255,255,0.2),inset_3px_3px_2px_rgba(255,255,255,0.1)]" />
                </article>

                <p v-if="!showSkeleton && iconCards.length === 0"
                    class="col-span-full text-center text-[clamp(1rem,2.2vw,1.25rem)] text-white/70">
                    No icons found for your search.
                </p>
            </div>
        </div>

        <div v-if="showSkeleton" class="pointer-events-none absolute inset-0 z-20">
            <div class="absolute inset-0 bg-black" />

            <div
                class="mx-auto w-full max-w-[1512px] animate-pulse px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-[72px]">
                <div class="flex flex-wrap justify-center gap-3 lg:justify-start">
                    <div class="h-11 w-full max-w-[360px] rounded-[1498.5px] bg-white/10 sm:h-12" />
                    <div class="h-11 min-w-[180px] rounded-full bg-white/20 sm:h-12 sm:min-w-[220px]" />
                </div>

                <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    <div v-for="n in 6" :key="n"
                        class="relative min-h-[610px] w-full overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.2)] bg-[rgba(0,0,0,0.2)] sm:min-h-[674px]">
                        <div class="mx-2 mt-2 h-[360px] rounded-[16px] bg-white/8 sm:h-[465px]" />
                        <div class="mx-auto mt-6 h-[56px] w-[72%] rounded-[10px]
                            [background-image:linear-gradient(165deg,rgba(151,123,19,0.3)_0%,rgba(212,175,55,0.45)_100%)] sm:mt-10" />
                        <div class="mx-auto mt-8 h-11 w-[calc(100%-42px)] max-w-[384px] rounded-[999px] bg-white/8 sm:mt-10 sm:h-12" />
                    </div>
                </div>
            </div>
        </div>

        <LazyResponseModal :response_modal="response_modal" />
    </section>
</template>

<style scoped>
/* Scope overrides to this Dropdown instance */
:deep(.icons-sort .p-select),
:deep(.icons-sort .p-component),
:deep(.icons-sort .p-inputwrapper),
:deep(.icons-sort .p-inputwrapper-filled) {
    padding-right: 0 !important;
}

/* Hide PrimeVue Dropdown native trigger icon so custom chevron is used */
:deep(.icons-sort .p-dropdown .p-dropdown-trigger) {
    display: none !important;
}

/* Ensure the dropdown label text inherits page color */
:deep(.icons-sort .p-dropdown .p-dropdown-label) {
    color: inherit !important;
}
</style>
