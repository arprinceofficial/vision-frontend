<script setup lang="ts">
type CmsLiveSyndicate = {
    status?: string | null
    slug?: string | null
    image?: string | null
    alt?: string | null
    collection?: string | null
    title?: string | null
    description?: string | null
    allocations?: string | number | null
    cagr?: string | null
    progress?: string | number | null
}

type CmsLiveSyndicatesResponse = {
    data?: CmsLiveSyndicate[]
}

type LiveSyndicate = {
    status: string
    slug: string
    image: string
    alt: string
    collection: string
    title: string
    description: string
    allocations: string
    cagr: string
    progress: number
}

type LiveSyndicateSkeleton = {
    titleWidth: string
    collectionWidth: string
    descriptionWidths: string[]
    progressWidth: string
}

const fallbackLiveSyndicateImage = '/svg/not-found-img.svg'
const liveSyndicateSkeletons: LiveSyndicateSkeleton[] = [
    {
        titleWidth: 'w-56',
        collectionWidth: 'w-64',
        descriptionWidths: ['w-full', 'w-11/12', 'w-4/5'],
        progressWidth: '79%'
    },
    {
        titleWidth: 'w-64',
        collectionWidth: 'w-52',
        descriptionWidths: ['w-full', 'w-10/12', 'w-3/4'],
        progressWidth: '52%'
    },
    {
        titleWidth: 'w-48',
        collectionWidth: 'w-56',
        descriptionWidths: ['w-full', 'w-9/12', 'w-5/6'],
        progressWidth: '68%'
    }
]

const {
    data: liveSyndicatesData,
    error: liveSyndicatesError,
    pending: liveSyndicatesPending,
    status: liveSyndicatesStatus
} = useAsyncData<CmsLiveSyndicate[]>(
    'citizen-fractional-live-syndicates',
    async () => {
        const response = await $fetchCitizen<CmsLiveSyndicatesResponse>('v1/customer/fractional/live', {
            method: 'GET'
        })

        return Array.isArray(response?.data) ? response.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false
    }
)

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const createLiveSyndicateSlug = (...values: Array<number | string | null | undefined>) => {
    const textValue = getFirstValue(...values).toLowerCase()

    return textValue
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'detail'
}

const normalizeProgress = (progress: number | string | null | undefined) => {
    const value = Number(progress)

    if (!Number.isFinite(value)) return 0
    return Math.min(100, Math.max(0, Math.round(value)))
}

const normalizeLiveSyndicate = (item: CmsLiveSyndicate): LiveSyndicate | null => {
    const title = getFirstValue(item.title)

    if (!title) return null

    return {
        status: getFirstValue(item.status) || 'Live Now',
        slug: createLiveSyndicateSlug(item.slug, title),
        image: getFirstValue(item.image) || fallbackLiveSyndicateImage,
        alt: getFirstValue(item.alt) || title,
        collection: getFirstValue(item.collection),
        title,
        description: getFirstValue(item.description),
        allocations: getFirstValue(item.allocations) || '0',
        cagr: getFirstValue(item.cagr) || 'TBC',
        progress: normalizeProgress(item.progress)
    }
}

const liveSyndicates = computed<LiveSyndicate[]>(() => (
    (liveSyndicatesData.value || [])
        .map(normalizeLiveSyndicate)
        .filter((item): item is LiveSyndicate => Boolean(item))
))

const shouldShowLiveSyndicatesSkeleton = computed(() => (
    !liveSyndicates.value.length && (
        liveSyndicatesPending.value ||
        liveSyndicatesStatus.value === 'idle' ||
        liveSyndicatesStatus.value === 'pending'
    )
))
</script>

<template>
    <section id="live-syndicates" class="border-b border-white/10 bg-[#080705] py-12 text-white sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h2 class="font-poppins text-[clamp(2rem,5vw,3.75rem)] font-black leading-tight text-white">
                    Live <span class="text-tccGold">Syndicates</span>
                </h2>
            </div>

            <div v-if="shouldShowLiveSyndicatesSkeleton" class="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <article v-for="(liveSyndicateSkeleton, index) in liveSyndicateSkeletons"
                    :key="`live-syndicate-skeleton-${index}`"
                    class="flex h-full w-full animate-pulse flex-col overflow-hidden rounded-lg border border-white/10 bg-[#10100e] shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
                    <div class="relative h-52 overflow-hidden bg-tccDeepBlack sm:h-60">
                        <span class="absolute left-4 top-4 z-10 h-7 w-28 rounded-md bg-emerald-600/50" />
                        <div class="absolute inset-0 h-full w-full bg-white/10 opacity-85" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#10100e] via-transparent to-black/10" />
                    </div>

                    <div class="flex flex-1 flex-col p-5 sm:p-6">
                        <span class="block h-3 max-w-full rounded-full bg-white/10"
                            :class="liveSyndicateSkeleton.collectionWidth" />
                        <span class="mt-5 block h-7 max-w-full rounded-full bg-white/10 sm:h-8"
                            :class="liveSyndicateSkeleton.titleWidth" />
                        <div class="mt-4 space-y-3">
                            <span
                                v-for="(descriptionWidth, descriptionIndex) in liveSyndicateSkeleton.descriptionWidths"
                                :key="`live-syndicate-skeleton-${index}-description-${descriptionIndex}`"
                                class="block h-3 rounded-full bg-white/10" :class="descriptionWidth" />
                        </div>

                        <div
                            class="my-5 grid grid-cols-2 overflow-hidden rounded-md border border-white/15 bg-white/[0.03]">
                            <div class="border-r border-white/15 px-3 py-3">
                                <span class="block h-6 w-14 rounded-full bg-tccGold/30" />
                                <span class="mt-2 block h-3 w-20 rounded-full bg-white/10" />
                            </div>
                            <div class="px-3 py-3 text-right">
                                <span class="ml-auto block h-6 w-24 rounded-full bg-tccGold/30" />
                                <span class="ml-auto mt-2 block h-3 w-24 rounded-full bg-white/10" />
                            </div>
                        </div>

                        <div>
                            <div class="mb-2 flex items-center justify-between">
                                <span class="h-3 w-28 rounded-full bg-white/10" />
                                <span class="h-3 w-9 rounded-full bg-tccGold/30" />
                            </div>
                            <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
                                <div class="h-full rounded-full bg-tccGold/40"
                                    :style="{ width: liveSyndicateSkeleton.progressWidth }" />
                            </div>
                        </div>

                        <div class="mt-auto pt-5">
                            <span class="block h-10 rounded-full bg-tccGold/70" />
                        </div>
                    </div>
                </article>
            </div>

            <div v-else-if="liveSyndicatesError"
                class="rounded-lg border border-tccGold/30 bg-tccGold/10 px-6 py-6 text-center text-sm leading-relaxed text-white/70">
                Live syndicates are unavailable right now. Please refresh and try again.
            </div>

            <div v-else-if="!liveSyndicates.length"
                class="rounded-lg border border-white/10 bg-white/5 px-6 py-6 text-center text-sm leading-relaxed text-white/60">
                Live syndicates are unavailable right now.
            </div>

            <div v-else class="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                <article v-for="(liveSyndicate, index) in liveSyndicates" :key="`${liveSyndicate.slug}-${index}`"
                    class="flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#10100e] shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
                    <div class="relative h-52 overflow-hidden bg-tccDeepBlack sm:h-60">
                        <span
                            class="absolute left-4 top-4 z-10 rounded-md bg-emerald-600 px-3 py-1.5 font-poppins text-[10px] font-black uppercase tracking-[0.2em] text-white">
                            {{ liveSyndicate.status }}
                        </span>
                        <img :src="liveSyndicate.image" :alt="liveSyndicate.alt"
                            class="absolute inset-0 h-full w-full object-cover opacity-85">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#10100e] via-transparent to-black/10" />
                    </div>

                    <div class="flex flex-1 flex-col p-5 sm:p-6">
                        <span class="font-poppins text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">{{
                            liveSyndicate.collection }}</span>
                        <h3 class="mt-5 font-poppins text-xl font-bold leading-tight text-white sm:text-2xl">{{
                            liveSyndicate.title }}
                        </h3>
                        <p class="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/65 sm:text-sm">{{
                            liveSyndicate.description }}
                        </p>

                        <div
                            class="my-5 grid grid-cols-2 overflow-hidden rounded-md border border-white/15 bg-white/[0.03]">
                            <div class="border-r border-white/15 px-3 py-3">
                                <strong class="block font-poppins text-lg font-bold text-tccGold">{{
                                    liveSyndicate.allocations }}</strong>
                                <span
                                    class="mt-1 block font-poppins text-[9px] uppercase tracking-[0.18em] text-white/45">Allocations</span>
                            </div>
                            <div class="px-3 py-3 text-right">
                                <strong class="block font-poppins text-base font-bold text-tccGold sm:text-lg">{{
                                    liveSyndicate.cagr
                                    }}</strong>
                                <span
                                    class="mt-1 block font-poppins text-[9px] uppercase tracking-[0.18em] text-white/45">Forecasted
                                    CAGR</span>
                            </div>
                        </div>

                        <div>
                            <div class="mb-2 flex items-center justify-between text-xs">
                                <span class="font-medium text-white/70">Funding Progress</span>
                                <span class="font-bold text-tccGold">{{ liveSyndicate.progress }}%</span>
                            </div>
                            <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
                                <div class="h-full rounded-full bg-tccGold"
                                    :style="{ width: `${liveSyndicate.progress}%` }" />
                            </div>
                        </div>

                        <div class="mt-auto pt-5">
                            <NuxtLink :to="`/syndicates/${liveSyndicate.slug}`"
                                class="block rounded-full bg-tccGold px-5 py-3 text-center font-poppins text-[11px] font-black uppercase tracking-[0.22em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                                Invest Now
                            </NuxtLink>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
