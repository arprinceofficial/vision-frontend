<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

type SyndicateStat = {
    label: string
    value: string
}

type GalleryImage = {
    src: string
    alt: string
    title?: string
    caption?: string
    class?: string
}

type TechnicalDatum = {
    icon: string
    label: string
    value: string
}

type AnalysisTabKey = 'thisCar' | 'widerMarket' | 'netReturns'

type AnalysisTab = {
    label: string
    eyebrow: string
    lead: string
    paragraphs: string[]
    conclusion: string
    metrics: SyndicateStat[]
}

type NewsCard = {
    title: string
    date: string
    day: string
    month: string
    author: string
    image: string
    excerpt: string
}

type ActiveJourney = {
    slug: string
    uid: string
    state: number
    status: number
    isCompleted: boolean
    percentComplete: number
    slot: number
    price: number
    currentStep: string
}

type SyndicateDetail = {
    uid: string
    slug: string
    allocationId: string
    status: string
    collection: string
    allocationsTotal: number
    allocationsRemaining: number
    allocationCost: number
    fundingProgress: number
    cagr: string
    title: string
    shortTitle: string
    heroImage: string
    heroAlt: string
    summary: string
    description: string[]
    specs: SyndicateStat[]
    gallery: GalleryImage[]
    analysisTabs: Record<AnalysisTabKey, AnalysisTab>
    technicalData: TechnicalDatum[]
    news: NewsCard[]
    activeJourney: ActiveJourney | null
}

type CmsSyndicateResponse = {
    status?: boolean
    data?: Record<string, any> | null
}

const fallbackSyndicateImage = '/svg/not-found-img.svg'
const heroSkeletonLines = ['w-full max-w-4xl', 'w-4/5 max-w-3xl']
const summarySkeletonLines = ['w-full', 'w-11/12', 'w-4/5']
const specSkeletons = ['w-20', 'w-28', 'w-16', 'w-24', 'w-20']
const gallerySkeletonImages = ['hero', 'side-a', 'side-b', 'hero-b']
const analysisSkeletonCards = ['w-24', 'w-28', 'w-20']
const newsSkeletonCards = ['w-4/5', 'w-3/4', 'w-5/6']

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const normalizeNumber = (value: number | string | null | undefined, fallback = 0) => {
    const numberValue = Number(value)
    return Number.isFinite(numberValue) ? numberValue : fallback
}

const normalizeProgress = (value: number | string | null | undefined) => (
    Math.min(100, Math.max(0, Math.round(normalizeNumber(value))))
)

const normalizeStats = (items: unknown): SyndicateStat[] => (
    Array.isArray(items)
        ? items
            .map((item: any) => {
                const label = getFirstValue(item?.label)
                const value = getFirstValue(item?.value) || 'TBC'
                return label ? { label, value } : null
            })
            .filter((item): item is SyndicateStat => Boolean(item))
        : []
)

const normalizeGallery = (items: unknown, fallbackImage: string, fallbackAlt: string): GalleryImage[] => {
    const gallery = Array.isArray(items)
        ? items
            .map((item: any): GalleryImage | null => {
                const src = typeof item === 'string'
                    ? getFirstValue(item)
                    : getFirstValue(item?.src, item?.image, item?.url, item?.path)
                if (!src) return null

                const image: GalleryImage = {
                    src,
                    alt: typeof item === 'string' ? fallbackAlt : getFirstValue(item?.alt) || fallbackAlt,
                    title: typeof item === 'string' ? '' : getFirstValue(item?.title),
                    caption: typeof item === 'string' ? '' : getFirstValue(item?.caption, item?.description),
                    class: typeof item === 'string' ? undefined : getFirstValue(item?.class) || undefined
                }

                return image
            })
            .filter((item): item is GalleryImage => Boolean(item))
        : []

    return gallery.length ? gallery : [{ src: fallbackImage, alt: fallbackAlt, class: 'md:col-span-2 md:h-[420px]' }]
}

const normalizeParagraphs = (items: unknown): string[] => (
    Array.isArray(items)
        ? items
            .map((item: any) => {
                if (typeof item === 'string') return item
                const heading = getFirstValue(item?.heading)
                const content = getFirstValue(item?.content, item?.text, item?.description)
                return heading && content ? `${heading}: ${content}` : getFirstValue(content, heading)
            })
            .filter(Boolean)
        : []
)

const getDefaultAnalysisTab = (label: string): AnalysisTab => ({
    label,
    eyebrow: '',
    lead: '',
    paragraphs: [],
    conclusion: '',
    metrics: []
})

const normalizeAnalysisTab = (value: any, label: string): AnalysisTab => ({
    label: getFirstValue(value?.label) || label,
    eyebrow: getFirstValue(value?.eyebrow),
    lead: getFirstValue(value?.lead),
    paragraphs: normalizeParagraphs(value?.paragraphs),
    conclusion: getFirstValue(value?.conclusion),
    metrics: normalizeStats(value?.metrics)
})

const normalizeAnalysisTabs = (tabs: any): Record<AnalysisTabKey, AnalysisTab> => ({
    thisCar: tabs?.thisCar ? normalizeAnalysisTab(tabs.thisCar, 'This Car') : getDefaultAnalysisTab('This Car'),
    widerMarket: tabs?.widerMarket
        ? normalizeAnalysisTab(tabs.widerMarket, 'Wider Market & Investment Thesis')
        : getDefaultAnalysisTab('Wider Market & Investment Thesis'),
    netReturns: tabs?.netReturns
        ? normalizeAnalysisTab(tabs.netReturns, 'Net Returns & What It Means For You')
        : getDefaultAnalysisTab('Net Returns & What It Means For You')
})

const normalizeTechnicalData = (items: unknown, specs: SyndicateStat[]): TechnicalDatum[] => {
    const technicalData = Array.isArray(items)
        ? items
            .map((item: any) => {
                const label = getFirstValue(item?.label)
                const value = getFirstValue(item?.value) || 'TBC'
                return label
                    ? {
                        icon: getFirstValue(item?.icon) || 'pi pi-cog',
                        label,
                        value
                    }
                    : null
            })
            .filter((item): item is TechnicalDatum => Boolean(item))
        : []

    return technicalData.length
        ? technicalData
        : specs.map((spec) => ({ icon: 'pi pi-cog', label: spec.label, value: spec.value }))
}

const normalizeNews = (items: unknown): NewsCard[] => (
    Array.isArray(items)
        ? items
            .map((item: any) => {
                const title = getFirstValue(item?.title)
                if (!title) return null

                return {
                    title,
                    date: getFirstValue(item?.date),
                    day: getFirstValue(item?.day),
                    month: getFirstValue(item?.month),
                    author: getFirstValue(item?.author) || 'The Car Crowd',
                    image: getFirstValue(item?.image) || fallbackSyndicateImage,
                    excerpt: getFirstValue(item?.excerpt)
                }
            })
            .filter((item): item is NewsCard => Boolean(item))
        : []
)

const normalizeActiveJourney = (journey: any): ActiveJourney | null => {
    if (!journey || typeof journey !== 'object') return null

    const slugValue = getFirstValue(journey.slug)
    const uidValue = getFirstValue(journey.uid)

    if (!slugValue && !uidValue) return null

    return {
        slug: slugValue,
        uid: uidValue,
        state: normalizeNumber(journey.state),
        status: normalizeNumber(journey.status),
        isCompleted: Boolean(journey.is_completed ?? journey.isCompleted),
        percentComplete: normalizeProgress(journey.percent_complete ?? journey.percentComplete),
        slot: normalizeNumber(journey.slot ?? journey.shares_count ?? journey.sharesCount, 1),
        price: normalizeNumber(journey.price ?? journey.total_amount),
        currentStep: getFirstValue(journey.current_step, journey.currentStep) || 'Initial Agreement'
    }
}

const normalizeSyndicate = (item: Record<string, any> | null | undefined): SyndicateDetail | null => {
    if (!item) return null

    const title = getFirstValue(item.title)
    const slugValue = getFirstValue(item.slug)

    if (!title || !slugValue) return null

    const shortTitle = getFirstValue(item.shortTitle, title)
    const heroImage = getFirstValue(item.heroImage) || fallbackSyndicateImage
    const heroAlt = getFirstValue(item.heroAlt) || `${title} syndicate hero`
    const specs = normalizeStats(item.specs)

    return {
        uid: getFirstValue(item.uid, item.uuid, item.id),
        slug: slugValue,
        allocationId: getFirstValue(item.allocationId),
        status: getFirstValue(item.status) || 'N/A',
        collection: getFirstValue(item.collection),
        allocationsTotal: normalizeNumber(item.allocationsTotal),
        allocationsRemaining: normalizeNumber(item.allocationsRemaining),
        allocationCost: normalizeNumber(item.allocationCost),
        fundingProgress: normalizeProgress(item.fundingProgress),
        cagr: getFirstValue(item.cagr) || 'N/A',
        title,
        shortTitle,
        heroImage,
        heroAlt,
        summary: getFirstValue(item.summary),
        description: normalizeParagraphs(item.description),
        specs,
        gallery: normalizeGallery(item.gallery, heroImage, heroAlt),
        analysisTabs: normalizeAnalysisTabs(item.analysisTabs),
        technicalData: normalizeTechnicalData(item.technicalData, specs),
        news: normalizeNews(item.news),
        activeJourney: normalizeActiveJourney(item.activeJourney)
    }
}

const route = useRoute()

const slug = computed(() => String(route.params.slug || ''))
const {
    data: syndicateData,
    error: syndicateError,
    pending: syndicatePending,
    status: syndicateStatus
} = useAsyncData<Record<string, any> | null>(
    `citizen-fractional-item-${slug.value}`,
    async () => {
        const response = await $fetchCitizen<CmsSyndicateResponse>(`v1/customer/fractional-items/${slug.value}`, {
            method: 'GET'
        })

        return response?.data || null
    },
    {
        default: () => null,
        lazy: true,
        server: false
    }
)

const syndicate = computed(() => normalizeSyndicate(syndicateData.value))
const shouldShowSyndicateSkeleton = computed(() => (
    !syndicate.value && (
        syndicatePending.value ||
        syndicateStatus.value === 'idle' ||
        syndicateStatus.value === 'pending'
    )
))

const allocationCount = ref(1)
const pendingAllocationCount = ref(1)
const isAllocationModalVisible = ref(false)
const isClientReady = ref(false)
const activeAnalysisTab = ref<AnalysisTabKey>('thisCar')

const formatCurrency = (value: number | string | null | undefined) => (
    `GBP ${normalizeNumber(value).toLocaleString('en-GB')}`
)

const soldAllocations = computed(() => {
    if (!syndicate.value) return 0
    return Math.max(0, syndicate.value.allocationsTotal - syndicate.value.allocationsRemaining)
})

const syndicateTotal = computed(() => {
    if (!syndicate.value) return 0
    return syndicate.value.allocationsTotal * syndicate.value.allocationCost
})

const syndicateYear = computed(() => (
    getFirstValue(syndicate.value?.specs.find((spec) => /year/i.test(spec.label))?.value)
))

const syndicateEyebrow = computed(() => (
    [syndicate.value?.shortTitle, syndicateYear.value].filter(Boolean).join(' - ')
))

const totalInvestment = computed(() => {
    if (!syndicate.value) {
        return formatCurrency(0)
    }

    return formatCurrency(allocationCount.value * syndicate.value.allocationCost)
})

const activeJourney = computed(() => syndicate.value?.activeJourney || null)
const selectedAllocationCount = computed(() => (
    Math.max(1, Math.round(normalizeNumber(allocationCount.value, 1)))
))

const modalAllocationSlots = computed(() => activeJourney.value?.slot || allocationCount.value)

const modalAllocationCost = computed(() => {
    if (!syndicate.value) return 0

    const journey = activeJourney.value
    if (!journey?.slot || !journey.price) {
        return syndicate.value.allocationCost
    }

    return journey.price / journey.slot
})

const modalAllocationProgress = computed(() => activeJourney.value?.percentComplete || 0)
const modalAllocationStep = computed(() => activeJourney.value?.currentStep || 'Initial Agreement')

const currentAnalysisTab = computed(() => {
    if (!syndicate.value) {
        return null
    }

    return syndicate.value.analysisTabs[activeAnalysisTab.value] || syndicate.value.analysisTabs.thisCar
})

const setActiveAnalysisTab = (key: string | number) => {
    activeAnalysisTab.value = String(key) as AnalysisTabKey
}

const decreaseAllocation = () => {
    allocationCount.value = Math.max(1, allocationCount.value - 1)
}

const increaseAllocation = () => {
    if (!syndicate.value) {
        return
    }

    if (syndicate.value.allocationsRemaining <= 0) {
        return
    }

    allocationCount.value = Math.min(syndicate.value.allocationsRemaining, allocationCount.value + 1)
}

const openAllocationModal = () => {
    if (!isClientReady.value) {
        return
    }

    pendingAllocationCount.value = selectedAllocationCount.value

    if (!activeJourney.value) {
        void navigateToAgreement(pendingAllocationCount.value)
        return
    }

    isAllocationModalVisible.value = true
}

const closeAllocationModal = () => {
    isAllocationModalVisible.value = false
}

const getAgreementPath = (shares: number, requestSlug = '') => {
    if (!syndicate.value) {
        return ''
    }

    const agreementUid = syndicate.value.uid || syndicate.value.allocationId
    const shareCount = Math.max(1, Math.round(normalizeNumber(shares, 1)))
    const basePath = `/agreement/${encodeURIComponent(agreementUid)}/a-${shareCount}`

    return requestSlug ? `${basePath}/s-${encodeURIComponent(requestSlug)}` : basePath
}

const rememberAgreementAsset = () => {
    if (!process.client || !syndicate.value) return

    const agreementUid = syndicate.value.uid || syndicate.value.allocationId
    if (!agreementUid) return

    sessionStorage.setItem(`agreement-asset:${agreementUid}`, JSON.stringify({
        id: agreementUid,
        vehicle: syndicate.value.title,
        collection: syndicate.value.collection,
        year: syndicateYear.value,
        allocationCost: syndicate.value.allocationCost,
        reference: syndicate.value.allocationId,
        supportEmail: 'support@thecarcrowd.co.uk'
    }))
}

const navigateToAgreement = async (shares: number, requestSlug = '') => {
    const path = getAgreementPath(shares, requestSlug)
    if (!path) return

    rememberAgreementAsset()
    await navigateTo(path)
}

const startFreshAllocationFlow = async () => {
    isAllocationModalVisible.value = false
    await navigateToAgreement(pendingAllocationCount.value || selectedAllocationCount.value)
}

const continueExistingAllocationFlow = async () => {
    isAllocationModalVisible.value = false

    const journey = activeJourney.value
    if (!journey) {
        await navigateToAgreement(pendingAllocationCount.value || selectedAllocationCount.value)
        return
    }

    await navigateToAgreement(pendingAllocationCount.value || selectedAllocationCount.value, journey.slug)
}

onMounted(() => {
    isClientReady.value = true
})

watchEffect(() => {
    if (shouldShowSyndicateSkeleton.value) return

    if (syndicateError.value) {
        showError(createError({
            statusCode: syndicateError.value.statusCode || 404,
            statusMessage: syndicateError.value.statusMessage || 'Syndicate not found'
        }))
        return
    }

    if (syndicateStatus.value === 'success' && !syndicate.value) {
        showError(createError({
            statusCode: 404,
            statusMessage: 'Syndicate not found'
        }))
    }
})

useHead(() => ({
    title: `${syndicate.value?.title || 'Syndicate'} - The Car Crowd`,
    meta: [
        {
            name: 'description',
            content: syndicate.value?.summary || 'View The Car Crowd syndicate detail page.'
        }
    ]
}))
</script>

<template>
    <div class="bg-tccDeepBlack font-poppins text-white">
        <template v-if="shouldShowSyndicateSkeleton">
            <span class="sr-only">Loading syndicate...</span>

            <section class="border-b border-white/10 bg-[#080705]">
                <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="h-3 w-14 animate-pulse rounded-full bg-white/10" />
                        <span class="h-3 w-2 animate-pulse rounded-full bg-white/10" />
                        <span class="h-3 w-32 animate-pulse rounded-full bg-white/10" />
                        <span class="h-3 w-2 animate-pulse rounded-full bg-white/10" />
                        <span class="h-3 w-40 animate-pulse rounded-full bg-tccGold/25" />
                    </div>
                </div>
            </section>

            <section
                class="relative min-h-[420px] overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white sm:min-h-[500px] lg:min-h-[560px]">
                <div class="absolute inset-0">
                    <div class="h-full w-full animate-pulse bg-white/10 opacity-70" />
                    <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-tccDeepBlack" />
                    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/55" />
                </div>

                <div
                    class="relative z-10 mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:min-h-[500px] sm:px-6 lg:min-h-[560px] lg:px-8">
                    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div class="max-w-4xl">
                            <span class="block h-4 w-48 animate-pulse rounded-full bg-tccGold/25" />
                            <div class="mt-5 space-y-4">
                                <span v-for="line in heroSkeletonLines" :key="line"
                                    class="block h-12 animate-pulse rounded-xl bg-white/10 sm:h-16 lg:h-20"
                                    :class="line" />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-3">
                            <span v-for="badge in 3" :key="badge"
                                class="h-8 w-32 animate-pulse rounded-full border border-white/20 bg-white/10" />
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-b border-white/10 bg-[#080705] py-10 text-white sm:py-14">
                <div
                    class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 xl:grid-cols-[minmax(0,1fr)_350px]">
                    <main class="min-w-0">
                        <article>
                            <span class="block h-4 w-44 animate-pulse rounded-full bg-tccGold/25" />
                            <span class="mt-4 block h-10 w-full max-w-3xl animate-pulse rounded-xl bg-white/10" />
                            <div class="mt-5 max-w-5xl space-y-3">
                                <span v-for="line in summarySkeletonLines" :key="line"
                                    class="block h-4 animate-pulse rounded-full bg-white/10" :class="line" />
                            </div>

                            <div
                                class="mt-6 grid overflow-hidden rounded-md border border-white/12 bg-white/[0.04] sm:grid-cols-5">
                                <div v-for="width in specSkeletons" :key="width"
                                    class="border-b border-white/12 px-3 py-3 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                                    <span class="mx-auto block h-5 animate-pulse rounded-full bg-white/10"
                                        :class="width" />
                                    <span class="mx-auto mt-3 block h-3 w-16 animate-pulse rounded-full bg-white/10" />
                                </div>
                            </div>
                        </article>

                        <section class="mt-10">
                            <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <span class="block h-4 w-44 animate-pulse rounded-full bg-tccGold/25" />
                                <span class="h-9 w-24 animate-pulse rounded-full border border-white/12 bg-white/5" />
                            </div>

                            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div v-for="(image, index) in gallerySkeletonImages" :key="image"
                                    class="restomod-image-card h-[240px] animate-pulse overflow-hidden rounded-md border border-white/10 bg-white/10 sm:h-[280px]"
                                    :class="index === 0 || index === 3 ? 'md:col-span-2 md:h-[420px]' : 'md:h-[210px]'" />
                            </div>
                        </section>
                    </main>

                    <aside class="lg:sticky lg:top-24 lg:self-start">
                        <div
                            class="animate-pulse overflow-hidden rounded-lg border border-white/12 bg-[#10100e] shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
                            <div class="bg-tccDeepBlack px-5 py-4">
                                <div class="h-5 w-32 rounded bg-white/15" />
                                <div class="mt-2 h-3 w-48 max-w-full rounded bg-white/10" />
                            </div>

                            <div class="space-y-4 p-5">
                                <div class="rounded-md border border-tccGold/20 bg-tccGold/10 p-3">
                                    <div class="h-3 w-full rounded bg-white/12" />
                                    <div class="mt-2 h-3 w-10/12 rounded bg-white/10" />
                                </div>

                                <div class="grid grid-cols-2 overflow-hidden rounded-md border border-white/12">
                                    <div v-for="item in 4" :key="item" class="border-white/12 p-3"
                                        :class="{ 'border-r': item % 2 === 1, 'border-b': item < 3 }">
                                        <div class="h-2.5 w-20 rounded bg-white/12" />
                                        <div class="mt-3 h-5 w-24 max-w-full rounded bg-white/15" />
                                        <div class="mt-2 h-2.5 w-16 rounded bg-white/10" />
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-2 flex items-center justify-between">
                                        <div class="h-3 w-24 rounded bg-white/12" />
                                        <div class="h-3 w-16 rounded bg-tccGold/25" />
                                    </div>
                                    <div class="h-2 overflow-hidden rounded-full bg-white/12">
                                        <div class="h-full w-1/2 rounded-full bg-tccGold/35" />
                                    </div>
                                </div>

                                <div class="h-[46px] rounded-full bg-tccGold/35" />
                                <div class="h-[44px] rounded-full border border-white/16 bg-white/[0.04]" />
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section class="border-b border-white/10 bg-[#050515] py-12 text-white sm:py-16">
                <div
                    class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
                    <div>
                        <span class="block h-7 w-72 max-w-full animate-pulse rounded-full bg-white/10" />
                        <span class="mt-3 block h-4 w-64 max-w-full animate-pulse rounded-full bg-white/10" />
                        <div class="mt-8 flex flex-wrap gap-5 border-b border-white/12 pb-4">
                            <span v-for="tab in 3" :key="tab" class="h-3 w-40 animate-pulse rounded-full bg-white/10" />
                        </div>
                        <div class="mt-8 rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                            <span class="block h-3 w-28 animate-pulse rounded-full bg-tccGold/25" />
                            <span class="mt-4 block h-4 w-full animate-pulse rounded-full bg-white/10" />
                            <span class="mt-3 block h-4 w-10/12 animate-pulse rounded-full bg-white/10" />
                            <div class="mt-5 grid gap-3 sm:grid-cols-3">
                                <div v-for="width in analysisSkeletonCards" :key="width"
                                    class="rounded-md border border-white/10 bg-tccDeepBlack/45 p-4">
                                    <span class="block h-3 w-16 animate-pulse rounded-full bg-white/10" />
                                    <span class="mt-3 block h-4 animate-pulse rounded-full bg-white/10"
                                        :class="width" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside class="min-w-0">
                        <span class="block h-7 w-56 animate-pulse rounded-full bg-white/10" />
                        <div
                            class="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-white/12 bg-white/[0.06] p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-1">
                            <div v-for="item in 6" :key="item"
                                class="flex min-w-0 items-start gap-3 rounded-md bg-white/[0.04] p-3 sm:items-center">
                                <span class="h-10 w-10 shrink-0 rounded-full bg-white/10" />
                                <div class="min-w-0 flex-1">
                                    <span class="block h-3 w-16 animate-pulse rounded-full bg-white/10" />
                                    <span class="mt-2 block h-4 w-24 animate-pulse rounded-full bg-white/10" />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section class="border-b border-white/10 bg-[#14110d] py-10 text-white">
                <div
                    class="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div>
                        <span class="block h-7 w-72 max-w-full animate-pulse rounded-full bg-white/10" />
                        <span class="mt-3 block h-4 w-96 max-w-full animate-pulse rounded-full bg-white/10" />
                    </div>
                    <span class="h-11 w-48 animate-pulse rounded-full bg-tccGold/35" />
                </div>
            </section>

            <section class="bg-[#080705] py-12 text-white sm:py-16">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span class="block h-4 w-36 animate-pulse rounded-full bg-tccGold/25" />
                            <span class="mt-4 block h-10 w-64 animate-pulse rounded-xl bg-white/10" />
                        </div>
                        <span class="h-4 w-24 animate-pulse rounded-full bg-tccGold/25" />
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <article v-for="titleWidth in newsSkeletonCards" :key="titleWidth"
                            class="restomod-image-card flex h-full animate-pulse flex-col overflow-hidden rounded-md border border-white/10 bg-white/[0.05]">
                            <div class="h-52 bg-white/10" />
                            <div class="flex flex-1 flex-col p-5">
                                <span class="h-3 w-28 rounded-full bg-white/10" />
                                <span class="mt-4 h-6 rounded-full bg-white/10" :class="titleWidth" />
                                <div class="mt-4 space-y-3">
                                    <span class="block h-3 w-full rounded-full bg-white/10" />
                                    <span class="block h-3 w-10/12 rounded-full bg-white/10" />
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </template>

        <template v-else-if="syndicate">
            <section class="border-b border-white/10 bg-[#080705]">
                <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <nav
                        class="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        <NuxtLink to="/" class="transition-colors hover:text-tccGold">Home</NuxtLink>
                        <span>/</span>
                        <NuxtLink to="/syndicates" class="transition-colors hover:text-tccGold">Live Syndicates
                        </NuxtLink>
                        <span>/</span>
                        <span class="text-tccGold">{{ syndicate.shortTitle }}</span>
                    </nav>
                </div>
            </section>

            <section
                class="relative min-h-[420px] overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white sm:min-h-[500px] lg:min-h-[560px]">
                <div class="absolute inset-0">
                    <img :src="syndicate.heroImage" :alt="syndicate.heroAlt"
                        class="h-full w-full object-cover opacity-70">
                    <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-tccDeepBlack" />
                    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/55" />
                </div>

                <div
                    class="relative z-10 mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:min-h-[500px] sm:px-6 lg:min-h-[560px] lg:px-8">
                    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div class="max-w-4xl">
                            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-tccGold">
                                {{ syndicateEyebrow }}
                            </span>
                            <h1
                                class="mt-4 max-w-4xl font-poppins text-[clamp(2.1rem,6vw,4.5rem)] font-black leading-[1.02] text-white">
                                {{ syndicate.title }}
                            </h1>
                        </div>

                        <div class="flex flex-wrap gap-3">
                            <span
                                class="rounded-full bg-emerald-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-tccDarkNavy">
                                {{ syndicate.status }}
                            </span>
                            <span v-if="syndicate.collection"
                                class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                                {{ syndicate.collection }}
                            </span>
                            <span
                                class="rounded-full border border-tccGold/40 bg-tccGold/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-tccGold">
                                {{ syndicate.allocationsTotal }} allocations
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-b border-white/10 bg-[#080705] py-10 text-white sm:py-14">
                <div
                    class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 xl:grid-cols-[minmax(0,1fr)_350px]">
                    <main class="min-w-0">
                        <article>
                            <span class="font-poppins text-[10px] font-black uppercase tracking-[0.28em] text-tccGold">
                                {{ syndicateEyebrow }}
                            </span>
                            <h2
                                class="mt-3 max-w-4xl font-poppins text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-tight text-white">
                                {{ syndicate.title }}
                            </h2>
                            <p class="mt-4 max-w-5xl text-[15px] font-semibold leading-relaxed text-white/85">
                                {{ syndicate.summary }}
                            </p>
                            <div class="mt-4 max-w-5xl space-y-3 text-[13px] leading-relaxed text-white/62 sm:text-sm">
                                <p v-for="paragraph in syndicate.description" :key="paragraph">{{ paragraph }}</p>
                            </div>

                            <div
                                class="mt-6 grid overflow-hidden rounded-md border border-white/12 bg-white/[0.04] sm:grid-cols-5">
                                <div v-for="spec in syndicate.specs" :key="spec.label"
                                    class="border-b border-white/12 px-3 py-3 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                                    <strong class="block font-poppins text-lg font-black text-white">{{ spec.value
                                        }}</strong>
                                    <span
                                        class="mt-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-white/38">{{
                                            spec.label }}</span>
                                </div>
                            </div>
                        </article>

                        <section class="mt-10">
                            <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <span
                                    class="font-poppins text-[10px] font-black uppercase tracking-[0.22em] text-tccGold">
                                    Photography
                                </span>
                                <div class="inline-flex w-max rounded-full border border-white/12 bg-white/5 p-1">
                                    <button type="button"
                                        class="rounded-full bg-tccGold px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-tccDarkNavy">
                                        Photos
                                    </button>
                                    <!-- <button type="button"
                                    class="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                                    Interactive 3D
                                </button> -->
                                </div>
                            </div>

                            <CitizenSharedImageGallery :images="syndicate.gallery" title="Photography"
                                :lead-caption="syndicate.title" />
                        </section>
                    </main>

                    <aside class="lg:sticky lg:top-24 lg:self-start">
                        <div v-if="isClientReady"
                            class="overflow-hidden rounded-lg border border-white/12 bg-[#10100e] shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
                            <div class="bg-tccDeepBlack px-5 py-4">
                                <h2 class="font-poppins text-lg font-black text-white">The Syndicate</h2>
                                <p class="mt-1 text-xs text-white/45">{{ syndicate.title }} - {{ syndicate.status }}</p>
                            </div>

                            <div class="space-y-4 p-5">
                                <p
                                    class="rounded-md border border-tccGold/25 bg-tccGold/10 p-3 text-xs font-semibold leading-relaxed text-white/80">
                                    This syndicate offers a total of {{ syndicate.allocationsTotal }} allocations, with
                                    each
                                    member eligible to hold up to a maximum of 40% ownership.
                                </p>

                                <div class="grid grid-cols-2 overflow-hidden rounded-md border border-white/12">
                                    <div class="border-b border-r border-white/12 p-3">
                                        <span
                                            class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Syndicate
                                            Total</span>
                                        <strong class="mt-2 block text-lg font-black text-white sm:text-xl">
                                            {{ formatCurrency(syndicateTotal) }}</strong>
                                        <span class="mt-1 block text-[11px] text-white/45">Total raise target</span>
                                    </div>
                                    <div class="border-b border-white/12 p-3">
                                        <span
                                            class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Allocation
                                            Cost</span>
                                        <strong class="mt-2 block text-lg font-black text-white sm:text-xl">{{
                                            formatCurrency(syndicate.allocationCost) }}</strong>
                                        <span class="mt-1 block text-[11px] text-white/45">Per allocation</span>
                                    </div>
                                    <div class="border-r border-white/12 p-3">
                                        <span
                                            class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Remaining</span>
                                        <strong class="mt-2 block text-lg font-black text-white sm:text-xl">{{
                                            syndicate.allocationsRemaining }}/{{ syndicate.allocationsTotal }}</strong>
                                        <span class="mt-1 block text-[11px] text-white/45">Allocations left</span>
                                    </div>
                                    <div class="p-3">
                                        <span
                                            class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Future
                                            Returns</span>
                                        <strong
                                            class="mt-2 block text-lg font-black leading-tight text-tccGold sm:text-xl">{{
                                                syndicate.cagr }}</strong>
                                        <span class="mt-1 block text-[11px] text-white/45">Forecasted investment returns
                                            are
                                            for illustration only</span>
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-2 flex items-center justify-between text-xs">
                                        <span class="text-white/55">Funding Progress</span>
                                        <span class="font-bold text-tccGold">{{ syndicate.fundingProgress }}%
                                            raised</span>
                                    </div>
                                    <div class="h-2 overflow-hidden rounded-full bg-white/12">
                                        <div class="h-full rounded-full bg-tccGold"
                                            :style="{ width: `${syndicate.fundingProgress}%` }" />
                                    </div>
                                    <p class="mt-2 text-[11px] text-white/45">{{ soldAllocations }} of {{
                                        syndicate.allocationsTotal }} allocations sold - closes when fully
                                        subscribed</p>
                                </div>

                                <div>
                                    <label
                                        class="block text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Number
                                        of Allocations</label>
                                    <div
                                        class="mt-3 grid grid-cols-[44px_1fr_44px] overflow-hidden rounded-md border border-white/16 bg-white/[0.04]">
                                        <button type="button"
                                            class="grid h-12 place-items-center text-white/70 transition-colors hover:bg-white/10 hover:text-tccGold"
                                            aria-label="Decrease allocations" @click="decreaseAllocation">
                                            <i class="pi pi-minus text-xs" aria-hidden="true" />
                                        </button>
                                        <div
                                            class="grid h-12 place-items-center border-x border-white/16 font-poppins text-2xl font-black text-white">
                                            {{ allocationCount }}
                                        </div>
                                        <button type="button"
                                            class="grid h-12 place-items-center text-white/70 transition-colors hover:bg-white/10 hover:text-tccGold"
                                            aria-label="Increase allocations" @click="increaseAllocation">
                                            <i class="pi pi-plus text-xs" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div class="mt-3 flex items-center justify-between text-sm">
                                        <span class="text-white/45">Total Investment</span>
                                        <strong class="text-tccGold">{{ totalInvestment }}</strong>
                                    </div>
                                </div>

                                <button type="button"
                                    class="w-full rounded-full bg-tccGold px-5 py-3.5 text-center font-poppins text-[11px] font-black uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                                    @click="openAllocationModal">
                                    Secure My Allocation
                                </button>

                                <NuxtLink to="/contact"
                                    class="block w-full rounded-full border border-white/16 px-5 py-3 text-center font-poppins text-[11px] font-black uppercase tracking-[0.22em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                                    Talk To The Team
                                </NuxtLink>

                                <details class="rounded-md border border-tccGold/25 bg-tccGold/10 p-4">
                                    <summary class="cursor-pointer text-xs font-bold text-tccGold">New to syndicates?
                                        How
                                        does this work?</summary>
                                    <p class="mt-3 text-xs leading-relaxed text-white/58">
                                        Future returns are projective and not guaranteed. Capital at risk. Past
                                        performance
                                        is not a reliable indicator of future returns.
                                    </p>
                                </details>
                            </div>
                        </div>

                        <div v-else aria-hidden="true"
                            class="animate-pulse overflow-hidden rounded-lg border border-white/12 bg-[#10100e] shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
                            <div class="bg-tccDeepBlack px-5 py-4">
                                <div class="h-5 w-32 rounded bg-white/15" />
                                <div class="mt-2 h-3 w-48 max-w-full rounded bg-white/10" />
                            </div>

                            <div class="space-y-4 p-5">
                                <div class="rounded-md border border-tccGold/20 bg-tccGold/10 p-3">
                                    <div class="h-3 w-full rounded bg-white/12" />
                                    <div class="mt-2 h-3 w-10/12 rounded bg-white/10" />
                                    <div class="mt-2 h-3 w-8/12 rounded bg-white/10" />
                                </div>

                                <div class="grid grid-cols-2 overflow-hidden rounded-md border border-white/12">
                                    <div v-for="item in 4" :key="item" class="border-white/12 p-3"
                                        :class="{ 'border-r': item % 2 === 1, 'border-b': item < 3 }">
                                        <div class="h-2.5 w-20 rounded bg-white/12" />
                                        <div class="mt-3 h-5 w-24 max-w-full rounded bg-white/15" />
                                        <div class="mt-2 h-2.5 w-16 rounded bg-white/10" />
                                    </div>
                                </div>

                                <div>
                                    <div class="mb-2 flex items-center justify-between">
                                        <div class="h-3 w-24 rounded bg-white/12" />
                                        <div class="h-3 w-16 rounded bg-tccGold/25" />
                                    </div>
                                    <div class="h-2 overflow-hidden rounded-full bg-white/12">
                                        <div class="h-full w-4/5 rounded-full bg-tccGold/35" />
                                    </div>
                                    <div class="mt-2 h-3 w-60 max-w-full rounded bg-white/10" />
                                </div>

                                <div>
                                    <div class="h-3 w-36 rounded bg-white/12" />
                                    <div
                                        class="mt-3 grid grid-cols-[44px_1fr_44px] overflow-hidden rounded-md border border-white/16 bg-white/[0.04]">
                                        <div class="h-12 bg-white/[0.03]" />
                                        <div class="h-12 border-x border-white/16 bg-white/[0.06]" />
                                        <div class="h-12 bg-white/[0.03]" />
                                    </div>
                                    <div class="mt-3 flex items-center justify-between">
                                        <div class="h-3 w-28 rounded bg-white/10" />
                                        <div class="h-4 w-20 rounded bg-tccGold/25" />
                                    </div>
                                </div>

                                <div class="h-[46px] rounded-full bg-tccGold/35" />
                                <div class="h-[44px] rounded-full border border-white/16 bg-white/[0.04]" />
                                <div class="rounded-md border border-tccGold/20 bg-tccGold/10 p-4">
                                    <div class="h-3 w-56 max-w-full rounded bg-tccGold/25" />
                                    <div class="mt-3 h-3 w-full rounded bg-white/10" />
                                    <div class="mt-2 h-3 w-2/3 rounded bg-white/10" />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section class="border-b border-white/10 bg-[#050515] py-12 text-white sm:py-16">
                <div
                    class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
                    <div>
                        <h2 class="font-poppins text-xl font-black text-white sm:text-2xl">{{ syndicate.title }} - Full
                            Analysis</h2>
                        <p class="mt-2 text-sm text-white/50">Everything you need to make an informed decision</p>

                        <div class="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-white/12" role="tablist"
                            aria-label="Investment analysis tabs">
                            <button v-for="(tab, key) in syndicate.analysisTabs" :key="key" type="button" role="tab"
                                :aria-selected="activeAnalysisTab === key"
                                class="border-b-2 px-1 pb-4 text-left text-[10px] font-black uppercase tracking-[0.22em] transition-colors"
                                :class="activeAnalysisTab === key
                                    ? 'border-tccGold text-tccGold'
                                    : 'border-transparent text-white/40 hover:border-white/20 hover:text-white/75'"
                                @click="setActiveAnalysisTab(key)">
                                {{ tab.label }}
                            </button>
                        </div>

                        <div v-if="currentAnalysisTab" class="mt-8 max-w-4xl">
                            <div class="rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                                <p class="text-[10px] font-black uppercase tracking-[0.22em] text-tccGold">
                                    {{ currentAnalysisTab.eyebrow }}
                                </p>
                                <p class="mt-3 text-base font-bold leading-relaxed text-white/88">
                                    {{ currentAnalysisTab.lead }}
                                </p>

                                <div class="mt-5 grid gap-3 sm:grid-cols-3">
                                    <div v-for="metric in currentAnalysisTab.metrics"
                                        :key="`${activeAnalysisTab}-${metric.label}`"
                                        class="rounded-md border border-white/10 bg-tccDeepBlack/45 p-4">
                                        <span
                                            class="block text-[9px] font-black uppercase tracking-[0.18em] text-white/38">
                                            {{ metric.label }}
                                        </span>
                                        <strong class="mt-2 block text-sm font-black text-white">{{ metric.value
                                            }}</strong>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 space-y-4 text-sm leading-relaxed text-white/64">
                                <p v-for="(paragraph, index) in currentAnalysisTab.paragraphs"
                                    :key="`${activeAnalysisTab}-${index}`">
                                    {{ paragraph }}
                                </p>
                                <p class="font-bold text-white/88">{{ currentAnalysisTab.conclusion }}</p>
                            </div>
                        </div>

                        <button type="button"
                            class="mt-8 inline-flex items-center gap-2 rounded-full border border-tccGold/40 bg-tccGold/10 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy">
                            <i class="pi pi-download text-xs" aria-hidden="true" />
                            Download Summary
                        </button>
                    </div>

                    <aside class="min-w-0">
                        <h3 class="font-poppins text-xl font-black text-white">Asset Technical Data</h3>
                        <div
                            class="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-white/12 bg-white/[0.06] p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-1">
                            <div v-for="item in syndicate.technicalData" :key="`${item.label}-${item.value}`"
                                class="flex min-w-0 items-start gap-3 rounded-md bg-white/[0.04] p-3 sm:items-center">
                                <span
                                    class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-tccGold">
                                    <i :class="item.icon" class="text-sm" aria-hidden="true" />
                                </span>
                                <div class="min-w-0 flex-1">
                                    <span
                                        class="block break-words text-[9px] font-black uppercase tracking-[0.18em] text-white/35">{{
                                            item.label }}</span>
                                    <strong class="mt-1 block break-words text-sm leading-snug text-white">{{ item.value
                                        }}</strong>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section class="border-b border-white/10 bg-[#14110d] py-10 text-white">
                <div
                    class="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div>
                        <h2 class="font-poppins text-xl font-black text-white sm:text-2xl">Have Questions Before
                            Investing?
                        </h2>
                        <p class="mt-2 max-w-3xl text-sm text-white/60">
                            Our expert team is ready to guide you, answer your questions, and help you decide
                            confidently
                            before investing.
                        </p>
                    </div>
                    <NuxtLink to="/contact"
                        class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.2em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                        <i class="pi pi-comment text-xs" aria-hidden="true" />
                        Talk To The Team
                    </NuxtLink>
                </div>
            </section>

            <section class="bg-[#080705] py-12 text-white sm:py-16">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span
                                class="font-poppins text-[10px] font-black uppercase tracking-[0.28em] text-tccGold">From
                                the Community</span>
                            <h2 class="mt-3 font-poppins text-3xl font-black text-white sm:text-4xl">Latest News</h2>
                        </div>
                        <NuxtLink to="/blog"
                            class="font-poppins text-[11px] font-black uppercase tracking-[0.2em] text-tccGold transition-colors hover:text-tccLightGold">
                            View All News
                        </NuxtLink>
                    </div>

                    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <article v-for="post in syndicate.news" :key="post.title"
                            class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                            <div class="relative h-44 overflow-hidden bg-tccDeepBlack sm:h-52">
                                <img :src="post.image" :alt="post.title" class="h-full w-full object-cover opacity-90">
                                <span
                                    class="absolute bottom-4 left-4 rounded-full bg-tccDeepBlack/80 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white">Blog</span>
                                <div
                                    class="absolute bottom-4 right-4 grid h-16 w-14 place-items-center rounded-md bg-tccGold text-center font-poppins text-tccDarkNavy">
                                    <strong class="block text-xl font-black leading-none">{{ post.day }}</strong>
                                    <span class="block text-[10px] font-bold">{{ post.month }}</span>
                                </div>
                            </div>
                            <div class="flex flex-1 flex-col p-5">
                                <div class="flex flex-wrap gap-4 text-[10px] text-white/42">
                                    <span>{{ post.date }}</span>
                                    <span>Comment</span>
                                </div>
                                <h3
                                    class="mt-3 font-poppins text-xl font-black leading-tight text-white transition-colors group-hover:text-tccGold">
                                    {{ post.title }}
                                </h3>
                                <p class="news-card-excerpt mt-4 text-sm leading-relaxed text-white/58">{{ post.excerpt
                                    }}
                                </p>
                                <div
                                    class="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                                    <div class="flex min-w-0 items-center gap-3">
                                        <img src="/assets/images/user-placeholder.svg" :alt="post.author"
                                            class="h-9 w-9 shrink-0 rounded-full border border-white/20">
                                        <div class="min-w-0">
                                            <span class="block truncate text-xs font-bold text-white/75">{{ post.author
                                                }}</span>
                                            <span class="block text-[10px] text-white/40">{{ post.date }}</span>
                                        </div>
                                    </div>
                                    <NuxtLink to="/blog"
                                        class="inline-flex items-center gap-2 text-xs font-semibold text-white/65 transition-colors hover:text-tccGold">
                                        <span
                                            class="grid h-9 w-9 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
                                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                                        </span>
                                        Read More
                                    </NuxtLink>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <ClientOnly>
                <CitizenSyndicatesIncompleteAllocationModal :is-open-modal="isAllocationModalVisible"
                    :title="syndicate.title" :slots="modalAllocationSlots" :allocation-cost="modalAllocationCost"
                    :progress="modalAllocationProgress" :current-step="modalAllocationStep" @close="closeAllocationModal"
                    @start-fresh="startFreshAllocationFlow" @continue-existing="continueExistingAllocationFlow" />
            </ClientOnly>
        </template>
    </div>
</template>
