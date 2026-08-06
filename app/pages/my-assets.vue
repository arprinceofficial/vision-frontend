<script setup lang="ts">
definePageMeta({
    layout: 'portal'
})

useHead({
    title: 'My Assets | Vision148'
})

type AssetStatus = 'active' | 'pending' | 'funded' | 'exited'
type FilterId = 'all' | AssetStatus

type SummaryStat = {
    label: string
    value: string
    helper: string
}

type AssetAllocation = {
    title: string
    image: string
    alt: string
    status: AssetStatus
    statusLabel: string
    reference: string
    allocation: string
    units: string
    valuation: string
    performance: string
    progress: number
    nextStep: string
    actionLabel: string
    actionRoute: string
    description: string
}

type UpcomingAction = {
    title: string
    meta: string
    icon: string
}

type PortfolioDocument = {
    title: string
    count: string
}

type CmsSummaryStat = Partial<SummaryStat>
type CmsAssetAllocation = Partial<AssetAllocation> & {
    progress?: number | string | null
}
type CmsUpcomingAction = Partial<UpcomingAction>
type CmsPortfolioDocument = Partial<PortfolioDocument>

type MyAssetsData = {
    summaryStats: SummaryStat[]
    assets: AssetAllocation[]
    upcomingActions: UpcomingAction[]
    documents: PortfolioDocument[]
}

type MyAssetsResponse = {
    status?: boolean
    message?: string
    data?: {
        summaryStats?: CmsSummaryStat[]
        Assets?: CmsAssetAllocation[]
        assets?: CmsAssetAllocation[]
        upcomingActions?: CmsUpcomingAction[]
        documents?: CmsPortfolioDocument[]
    }
}

const activeFilter = ref<FilterId>('all')

const filters: Array<{ id: FilterId, label: string }> = [
    { id: 'all', label: 'All Assets' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'funded', label: 'Funded' },
    { id: 'exited', label: 'Exited' }
]

const fallbackAssetImage = '/frontend/assets/images/ferrari_berlinetta.png'

const summaryStatSkeletons = [
    { labelWidth: 'w-28', valueWidth: 'w-24', helperWidth: 'w-36' },
    { labelWidth: 'w-32', valueWidth: 'w-10', helperWidth: 'w-40' },
    { labelWidth: 'w-36', valueWidth: 'w-12', helperWidth: 'w-32' },
    { labelWidth: 'w-24', valueWidth: 'w-20', helperWidth: 'w-28' }
]

const assetSkeletons = [
    { referenceWidth: 'w-32', titleWidth: 'w-56', descriptionWidths: ['w-full', 'w-11/12'], progressWidth: '86%' },
    { referenceWidth: 'w-28', titleWidth: 'w-48', descriptionWidths: ['w-full', 'w-10/12'], progressWidth: '72%' },
    { referenceWidth: 'w-36', titleWidth: 'w-52', descriptionWidths: ['w-full', 'w-9/12'], progressWidth: '64%' },
    { referenceWidth: 'w-28', titleWidth: 'w-44', descriptionWidths: ['w-full', 'w-11/12'], progressWidth: '100%' }
]

const actionSkeletons = [
    { titleWidth: 'w-48', metaWidth: 'w-24' },
    { titleWidth: 'w-44', metaWidth: 'w-28' },
    { titleWidth: 'w-52', metaWidth: 'w-20' }
]

const documentSkeletons = [
    { titleWidth: 'w-48', countWidth: 'w-12' },
    { titleWidth: 'w-52', countWidth: 'w-12' },
    { titleWidth: 'w-36', countWidth: 'w-12' }
]

const defaultMyAssetsData = (): MyAssetsData => ({
    summaryStats: [],
    assets: [],
    upcomingActions: [],
    documents: []
})

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const normalizeStatus = (status: string | null | undefined): AssetStatus => {
    const normalizedStatus = getFirstValue(status).toLowerCase()
    const supportedStatuses: AssetStatus[] = ['active', 'pending', 'funded', 'exited']

    return supportedStatuses.includes(normalizedStatus as AssetStatus)
        ? normalizedStatus as AssetStatus
        : 'active'
}

const normalizeProgress = (progress: number | string | null | undefined) => {
    const value = Number(progress)

    if (!Number.isFinite(value)) return 0
    return Math.min(100, Math.max(0, Math.round(value)))
}

const normalizeSummaryStat = (stat: CmsSummaryStat): SummaryStat | null => {
    const label = getFirstValue(stat.label)
    const value = getFirstValue(stat.value)

    if (!label) return null

    return {
        label,
        value,
        helper: getFirstValue(stat.helper)
    }
}

const normalizeAsset = (asset: CmsAssetAllocation): AssetAllocation | null => {
    const title = getFirstValue(asset.title)

    if (!title) return null

    const status = normalizeStatus(asset.status)

    return {
        title,
        image: getFirstValue(asset.image) || fallbackAssetImage,
        alt: getFirstValue(asset.alt) || title,
        status,
        statusLabel: getFirstValue(asset.statusLabel) || status,
        reference: getFirstValue(asset.reference) || title,
        allocation: getFirstValue(asset.allocation) || 'Pending',
        units: getFirstValue(asset.units),
        valuation: getFirstValue(asset.valuation) || 'Pending',
        performance: getFirstValue(asset.performance) || 'Pending',
        progress: normalizeProgress(asset.progress),
        nextStep: getFirstValue(asset.nextStep),
        actionLabel: getFirstValue(asset.actionLabel) || 'View Details',
        actionRoute: getFirstValue(asset.actionRoute) || '/profile',
        description: getFirstValue(asset.description)
    }
}

const normalizeUpcomingAction = (action: CmsUpcomingAction): UpcomingAction | null => {
    const title = getFirstValue(action.title)

    if (!title) return null

    return {
        title,
        meta: getFirstValue(action.meta),
        icon: getFirstValue(action.icon) || 'pi-check-square'
    }
}

const normalizeDocument = (document: CmsPortfolioDocument): PortfolioDocument | null => {
    const title = getFirstValue(document.title)

    if (!title) return null

    return {
        title,
        count: getFirstValue(document.count) || '0 files'
    }
}

const normalizeMyAssetsData = (response: MyAssetsResponse | null | undefined): MyAssetsData => {
    const payload = response?.data
    const responseAssets = payload?.Assets || payload?.assets || []

    return {
        summaryStats: (payload?.summaryStats || [])
            .map(normalizeSummaryStat)
            .filter((stat): stat is SummaryStat => Boolean(stat)),
        assets: responseAssets
            .map(normalizeAsset)
            .filter((asset): asset is AssetAllocation => Boolean(asset)),
        upcomingActions: (payload?.upcomingActions || [])
            .map(normalizeUpcomingAction)
            .filter((action): action is UpcomingAction => Boolean(action)),
        documents: (payload?.documents || [])
            .map(normalizeDocument)
            .filter((document): document is PortfolioDocument => Boolean(document))
    }
}

const {
    data: myAssetsData,
    error: myAssetsError,
    pending: myAssetsPending,
    status: myAssetsStatus
} = useAsyncData<MyAssetsData>(
    'citizen-my-assets',
    async () => {
        const response = await $fetchCitizen<MyAssetsResponse>('v1/customer/my-asset', {
            method: 'GET'
        })

        return normalizeMyAssetsData(response)
    },
    {
        default: defaultMyAssetsData,
        lazy: true,
        server: false
    }
)

const summaryStats = computed(() => myAssetsData.value?.summaryStats || [])
const assets = computed(() => myAssetsData.value?.assets || [])
const upcomingActions = computed(() => myAssetsData.value?.upcomingActions || [])
const documents = computed(() => myAssetsData.value?.documents || [])

const filteredAssets = computed(() => (
    activeFilter.value === 'all'
        ? assets.value
        : assets.value.filter((asset) => asset.status === activeFilter.value)
))

const shouldShowMyAssetsSkeleton = computed(() => (
    myAssetsPending.value ||
    myAssetsStatus.value === 'idle' ||
    myAssetsStatus.value === 'pending'
))

const statusBadgeClass = (status: AssetStatus) => {
    const classes: Record<AssetStatus, string> = {
        active: 'border-tccGold/40 bg-tccGold/10 text-tccGold',
        pending: 'border-amber-300/35 bg-amber-300/10 text-amber-200',
        funded: 'border-emerald-300/35 bg-emerald-400/10 text-emerald-200',
        exited: 'border-white/20 bg-white/10 text-white/70'
    }

    return classes[status]
}
</script>

<template>
    <section class="mx-auto w-full max-w-7xl px-3 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div
                class="restomod-reveal flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[1.5rem] border border-white/10 bg-tccDeepBlack p-5 sm:min-h-[420px] sm:rounded-[1.75rem] sm:p-8 lg:p-10">
                <div class="max-w-2xl">
                    <span class="restomod-eyebrow">Member Portfolio</span>
                    <h1 class="mt-6 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                        My Assets
                    </h1>
                    <p class="mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                        Track your reserved allocations, funded holdings, valuation movement, member actions, and
                        document records in one portfolio view.
                    </p>
                    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                        <NuxtLink to="/syndicate-restoration"
                            class="rounded-full bg-tccGold px-5 py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold sm:px-6 sm:tracking-[0.22em]">
                            Explore Assets
                        </NuxtLink>
                        <NuxtLink to="/profile"
                            class="rounded-full border border-white/20 px-5 py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-tccGold hover:text-tccGold sm:px-6 sm:tracking-[0.22em]">
                            Account Profile
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <aside
                class="restomod-panel restomod-reveal flex flex-col justify-between rounded-[1.5rem] p-5 sm:rounded-[1.75rem] sm:p-8">
                <div>
                    <p class="font-poppins text-[10px] font-bold uppercase tracking-[0.26em] text-tccGold">Portfolio
                        Snapshot</p>
                    <div
                        class="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/10 min-[420px]:grid-cols-2">
                        <template v-if="shouldShowMyAssetsSkeleton">
                            <div v-for="(statSkeleton, skeletonIndex) in summaryStatSkeletons"
                                :key="`summary-stat-skeleton-${skeletonIndex}`"
                                class="animate-pulse bg-tccDeepBlack/80 p-4 sm:p-5">
                                <span class="block h-3 rounded-full bg-white/10" :class="statSkeleton.labelWidth" />
                                <span class="mt-3 block h-8 rounded-full bg-white/10"
                                    :class="statSkeleton.valueWidth" />
                                <span class="mt-2 block h-3 rounded-full bg-white/10"
                                    :class="statSkeleton.helperWidth" />
                            </div>
                        </template>
                        <div v-else-if="myAssetsError"
                            class="col-span-full bg-tccDeepBlack/80 p-5 text-sm leading-relaxed text-white/60">
                            Portfolio snapshot is unavailable right now.
                        </div>
                        <div v-else-if="!summaryStats.length"
                            class="col-span-full bg-tccDeepBlack/80 p-5 text-sm leading-relaxed text-white/60">
                            Portfolio snapshot is unavailable right now.
                        </div>
                        <template v-else>
                            <div v-for="stat in summaryStats" :key="stat.label" class="bg-tccDeepBlack/80 p-4 sm:p-5">
                                <span
                                    class="block font-poppins text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">{{
                                        stat.label }}</span>
                                <strong class="mt-2 block font-poppins text-2xl font-black text-white">{{ stat.value
                                }}</strong>
                                <p class="mt-1 text-[11px] text-white/50">{{ stat.helper }}</p>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="mt-8 rounded-[1.25rem] border border-tccGold/20 bg-tccGold/10 p-5">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-shield-check mt-0.5 text-lg text-tccGold" aria-hidden="true" />
                        <div>
                            <h2 class="font-poppins text-sm font-bold text-white">Investor checks active</h2>
                            <p class="mt-1 text-xs leading-relaxed text-white/60">
                                Classification and KYC status are linked to allocation approval before any transfer is
                                finalized.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
            <div class="min-w-0 space-y-6">
                <div
                    class="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 class="font-poppins text-xl font-bold text-white">Asset Allocations</h2>
                        <p class="mt-1 text-xs text-white/50">Filter holdings by lifecycle status.</p>
                    </div>
                    <div
                        class="grid w-full grid-cols-1 gap-2 min-[360px]:grid-cols-2 min-[520px]:flex min-[520px]:w-auto min-[520px]:flex-wrap">
                        <button v-for="filter in filters" :key="filter.id" type="button"
                            class="w-full rounded-full border px-3 py-2 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] transition-colors min-[520px]:w-auto min-[520px]:px-4 min-[520px]:tracking-[0.18em]"
                            :class="activeFilter === filter.id ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/5 text-white/70 hover:border-tccGold/50 hover:text-white'"
                            @click="activeFilter = filter.id">
                            {{ filter.label }}
                        </button>
                    </div>
                </div>

                <div v-if="shouldShowMyAssetsSkeleton" class="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
                    <article v-for="(assetSkeleton, skeletonIndex) in assetSkeletons"
                        :key="`asset-skeleton-${skeletonIndex}`"
                        class="restomod-image-card min-w-0 animate-pulse overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
                        <div class="relative h-56 overflow-hidden bg-tccDeepBlack">
                            <div class="h-full w-full bg-white/10" />
                            <div
                                class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tccDeepBlack to-transparent" />
                            <span
                                class="absolute left-4 top-4 h-7 w-24 rounded-full border border-white/10 bg-white/10" />
                        </div>

                        <div class="p-5 sm:p-6">
                            <div
                                class="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                                <div class="min-w-0 flex-1">
                                    <span class="block h-3 rounded-full bg-white/10"
                                        :class="assetSkeleton.referenceWidth" />
                                    <span class="mt-3 block h-7 rounded-full bg-white/10"
                                        :class="assetSkeleton.titleWidth" />
                                </div>
                                <div class="min-[420px]:text-right">
                                    <span class="ml-auto block h-3 w-14 rounded-full bg-white/10" />
                                    <span class="mt-2 block h-6 w-16 rounded-full bg-tccGold/30" />
                                </div>
                            </div>

                            <div class="mt-4 space-y-3">
                                <span v-for="(descriptionWidth, descriptionIndex) in assetSkeleton.descriptionWidths"
                                    :key="`asset-skeleton-${skeletonIndex}-description-${descriptionIndex}`"
                                    class="block h-3 rounded-full bg-white/10" :class="descriptionWidth" />
                            </div>

                            <div
                                class="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 min-[420px]:grid-cols-2">
                                <div class="bg-tccDeepBlack/80 p-4">
                                    <span class="block h-3 w-20 rounded-full bg-white/10" />
                                    <span class="mt-2 block h-4 w-24 rounded-full bg-white/10" />
                                    <span class="mt-2 block h-3 w-28 rounded-full bg-white/10" />
                                </div>
                                <div class="bg-tccDeepBlack/80 p-4">
                                    <span class="ml-auto block h-3 w-14 rounded-full bg-white/10" />
                                    <span class="ml-auto mt-2 block h-4 w-24 rounded-full bg-white/10" />
                                    <span class="ml-auto mt-2 block h-3 w-20 rounded-full bg-white/10" />
                                </div>
                            </div>

                            <div class="mt-6">
                                <div class="mb-2 flex items-center justify-between">
                                    <span class="h-3 w-32 rounded-full bg-white/10" />
                                    <span class="h-3 w-9 rounded-full bg-tccGold/30" />
                                </div>
                                <div class="h-1.5 w-full rounded-full bg-white/10">
                                    <div class="h-1.5 rounded-full bg-tccGold/40"
                                        :style="{ width: assetSkeleton.progressWidth }" />
                                </div>
                            </div>

                            <div
                                class="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <span class="block h-3 w-full max-w-[260px] rounded-full bg-white/10" />
                                <span
                                    class="block h-9 w-full shrink-0 rounded-full border border-white/10 bg-white/10 sm:w-36" />
                            </div>
                        </div>
                    </article>
                </div>

                <div v-else-if="myAssetsError"
                    class="rounded-[1.5rem] border border-tccGold/30 bg-tccGold/10 p-6 text-center text-sm leading-relaxed text-white/70">
                    Asset allocations are unavailable right now. Please refresh and try again.
                </div>

                <div v-else-if="!filteredAssets.length"
                    class="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center text-sm leading-relaxed text-white/60">
                    No asset allocations are available for this filter.
                </div>

                <div v-else class="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
                    <article v-for="asset in filteredAssets" :key="asset.reference"
                        class="restomod-image-card min-w-0 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                        <div class="relative h-56 overflow-hidden bg-tccDeepBlack">
                            <img :src="asset.image" :alt="asset.alt" class="h-full w-full object-cover opacity-90">
                            <div
                                class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tccDeepBlack to-transparent" />
                            <span
                                class="absolute left-4 top-4 rounded-full border px-3 py-1.5 font-poppins text-[9px] font-bold uppercase tracking-[0.22em]"
                                :class="statusBadgeClass(asset.status)">
                                {{ asset.statusLabel }}
                            </span>
                        </div>

                        <div class="p-5 sm:p-6">
                            <div
                                class="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                                <div>
                                    <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{{
                                        asset.reference }}</p>
                                    <h3 class="mt-2 font-poppins text-2xl font-bold leading-tight text-white">{{
                                        asset.title }}</h3>
                                </div>
                                <div class="min-[420px]:text-right">
                                    <span
                                        class="block text-[10px] uppercase tracking-[0.18em] text-white/40">Return</span>
                                    <strong class="mt-1 block text-lg font-black text-tccGold">{{ asset.performance
                                    }}</strong>
                                </div>
                            </div>

                            <p class="news-card-excerpt mt-4 text-sm leading-relaxed text-white/60">{{ asset.description
                            }}</p>

                            <div
                                class="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 min-[420px]:grid-cols-2">
                                <div class="bg-tccDeepBlack/80 p-4">
                                    <span
                                        class="block font-poppins text-[9px] uppercase tracking-[0.22em] text-white/40">Allocation</span>
                                    <strong class="mt-1 block text-sm font-semibold text-white">{{ asset.allocation
                                    }}</strong>
                                    <p class="mt-1 text-[11px] text-white/50">{{ asset.units }}</p>
                                </div>
                                <div class="bg-tccDeepBlack/80 p-4 text-right">
                                    <span
                                        class="block font-poppins text-[9px] uppercase tracking-[0.22em] text-white/40">Value</span>
                                    <strong class="mt-1 block text-sm font-semibold text-white">{{ asset.valuation
                                    }}</strong>
                                    <p class="mt-1 text-[11px] text-white/50">Latest estimate</p>
                                </div>
                            </div>

                            <div class="mt-6">
                                <div class="mb-2 flex items-center justify-between text-xs">
                                    <span class="font-medium text-white/50">Lifecycle Progress</span>
                                    <span class="font-bold text-tccGold">{{ asset.progress }}%</span>
                                </div>
                                <div class="h-1.5 w-full rounded-full bg-white/10">
                                    <div class="h-1.5 rounded-full bg-tccGold"
                                        :style="{ width: `${asset.progress}%` }" />
                                </div>
                            </div>

                            <div
                                class="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <p class="text-xs leading-relaxed text-white/50">{{ asset.nextStep }}</p>
                                <NuxtLink :to="asset.actionRoute"
                                    class="w-full shrink-0 rounded-full border border-white/20 px-4 py-2 text-center font-poppins text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-tccGold hover:text-tccGold sm:w-auto sm:tracking-[0.2em]">
                                    {{ asset.actionLabel }}
                                </NuxtLink>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            <aside class="space-y-6">
                <section class="restomod-panel rounded-[1.5rem] p-6">
                    <div class="flex items-center justify-between">
                        <h2 class="font-poppins text-lg font-bold text-white">Required Actions</h2>
                        <span v-if="shouldShowMyAssetsSkeleton"
                            class="h-6 w-8 animate-pulse rounded-full bg-tccGold/40" />
                        <span v-else
                            class="rounded-full bg-tccGold px-2.5 py-1 text-[10px] font-bold text-tccDarkNavy">{{
                                upcomingActions.length }}</span>
                    </div>

                    <div class="mt-5 space-y-3">
                        <template v-if="shouldShowMyAssetsSkeleton">
                            <div v-for="(actionSkeleton, skeletonIndex) in actionSkeletons"
                                :key="`action-skeleton-${skeletonIndex}`"
                                class="flex animate-pulse items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <span class="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-tccGold/40" />
                                <div class="min-w-0 flex-1">
                                    <span class="block h-4 rounded-full bg-white/10"
                                        :class="actionSkeleton.titleWidth" />
                                    <span class="mt-2 block h-3 rounded-full bg-white/10"
                                        :class="actionSkeleton.metaWidth" />
                                </div>
                            </div>
                        </template>
                        <div v-else-if="myAssetsError"
                            class="rounded-2xl border border-tccGold/30 bg-tccGold/10 p-4 text-xs leading-relaxed text-white/70">
                            Required actions are unavailable right now.
                        </div>
                        <div v-else-if="!upcomingActions.length"
                            class="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/60">
                            No required actions right now.
                        </div>
                        <template v-else>
                            <div v-for="action in upcomingActions" :key="action.title"
                                class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <i class="pi mt-0.5 text-tccGold" :class="action.icon" aria-hidden="true" />
                                <div>
                                    <h3 class="text-sm font-semibold text-white">{{ action.title }}</h3>
                                    <p class="mt-1 text-[11px] text-white/50">{{ action.meta }}</p>
                                </div>
                            </div>
                        </template>
                    </div>
                </section>

                <section class="restomod-panel rounded-[1.5rem] p-6">
                    <h2 class="font-poppins text-lg font-bold text-white">Portfolio Documents</h2>
                    <div class="mt-5 divide-y divide-white/10">
                        <template v-if="shouldShowMyAssetsSkeleton">
                            <div v-for="(documentSkeleton, skeletonIndex) in documentSkeletons"
                                :key="`document-skeleton-${skeletonIndex}`"
                                class="flex animate-pulse items-center justify-between gap-3 py-4">
                                <span class="flex min-w-0 items-center gap-3">
                                    <span class="h-4 w-4 rounded-full bg-tccGold/40" />
                                    <span class="h-4 rounded-full bg-white/10" :class="documentSkeleton.titleWidth" />
                                </span>
                                <span class="h-3 shrink-0 rounded-full bg-white/10"
                                    :class="documentSkeleton.countWidth" />
                            </div>
                        </template>
                        <div v-else-if="myAssetsError" class="py-4 text-xs leading-relaxed text-white/60">
                            Portfolio documents are unavailable right now.
                        </div>
                        <div v-else-if="!documents.length" class="py-4 text-xs leading-relaxed text-white/60">
                            No portfolio documents are available right now.
                        </div>
                        <template v-else>
                            <NuxtLink v-for="document in documents" :key="document.title" to="/profile"
                                class="flex items-center justify-between gap-3 py-4 text-sm transition-colors hover:text-tccGold">
                                <span class="flex min-w-0 items-center gap-3">
                                    <i class="pi pi-folder text-tccGold" aria-hidden="true" />
                                    <span class="truncate text-white/80">{{ document.title }}</span>
                                </span>
                                <span class="shrink-0 text-[11px] text-white/50">{{ document.count }}</span>
                            </NuxtLink>
                        </template>
                    </div>
                </section>
            </aside>
        </div>
    </section>
</template>
