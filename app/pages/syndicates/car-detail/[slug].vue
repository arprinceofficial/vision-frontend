<script setup lang="ts">
definePageMeta({
    layout: false
})

type SyndicateDetailSource = 'current' | 'funded'

type CmsMetric = string | number | {
    label?: string | null
    title?: string | null
    name?: string | null
    value?: string | number | null
    detail?: string | number | null
    count?: string | number | null
}

type CmsGalleryImage = string | {
    src?: string | null
    image?: string | null
    url?: string | null
    path?: string | null
    photo?: string | null
    alt?: string | null
    title?: string | null
}

type CmsSyndicateDetail = {
    status?: string | null
    title?: string | null
    slug?: string | null
    eyebrow?: string | null
    description?: string | null
    metrics?: CmsMetric[] | null
    gallery?: CmsGalleryImage[] | null
    marque?: string | null
    model?: string | null
    image?: string | null
    alt?: string | null
}

type CmsSyndicateDetailResponse = {
    data?: CmsSyndicateDetail | null
}

type LoadedSyndicateDetail = {
    source: SyndicateDetailSource
    data: CmsSyndicateDetail
}

type CarDetailMetric = {
    label: string
    value: string
}

type CarDetailGalleryImage = {
    src: string
    alt: string
}

type CarDetailPage = {
    title: string
    eyebrow: string
    description: string
    image: string
    alt: string
    metrics: CarDetailMetric[]
    gallery: CarDetailGalleryImage[]
}

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const fallbackDetailImage = '/frontend/assets/images/AstonMartin.jpg'

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const getRouteSource = (value: unknown): SyndicateDetailSource | null => {
    const source = Array.isArray(value) ? value[0] : value

    if (source === 'current' || source === 'funded') return source
    return null
}

const detailSource = computed(() => getRouteSource(route.query.source))

const getDetailEndpoint = (source: SyndicateDetailSource) => (
    source === 'current' ? 'current-syndicates' : 'funded-syndicates'
)

const fetchSyndicateDetail = async (source: SyndicateDetailSource): Promise<LoadedSyndicateDetail | null> => {
    if (!slug.value) return null

    const response = await $fetchCMS<CmsSyndicateDetailResponse>(
        `v1/cms/${getDetailEndpoint(source)}/${slug.value}`,
        { method: 'POST' }
    )

    return response?.data ? { source, data: response.data } : null
}

const {
    data: syndicateDetailData,
    error: syndicateDetailError,
    pending: syndicateDetailPending,
    status: syndicateDetailStatus
} = useAsyncData<LoadedSyndicateDetail | null>(
    `cms-syndicate-car-detail-${slug.value}`,
    async () => {
        if (detailSource.value) return await fetchSyndicateDetail(detailSource.value)

        try {
            const currentDetail = await fetchSyndicateDetail('current')
            if (currentDetail) return currentDetail
        } catch {
            // Legacy links without a source fall through to funded syndicates.
        }

        return await fetchSyndicateDetail('funded')
    },
    {
        default: () => null,
        lazy: true,
        server: false,
        watch: [slug, detailSource]
    }
)

const normalizeMetric = (metric: CmsMetric, index: number): CarDetailMetric | null => {
    if (typeof metric === 'string' || typeof metric === 'number') {
        const value = getFirstValue(metric)
        return value ? { label: `Metric ${index + 1}`, value } : null
    }

    const label = getFirstValue(metric.label, metric.title, metric.name)
    const value = getFirstValue(metric.value, metric.detail, metric.count)

    if (!label || !value) return null
    return { label, value }
}

const normalizeGalleryImage = (image: CmsGalleryImage, fallbackAlt: string): CarDetailGalleryImage | null => {
    if (typeof image === 'string') {
        const src = getFirstValue(image)
        return src ? { src, alt: fallbackAlt } : null
    }

    const src = getFirstValue(image.src, image.image, image.url, image.path, image.photo)

    if (!src) return null

    return {
        src,
        alt: getFirstValue(image.alt, image.title) || fallbackAlt
    }
}

const normalizeSyndicateDetail = (loadedDetail: LoadedSyndicateDetail | null | undefined): CarDetailPage | null => {
    const detail = loadedDetail?.data
    const title = getFirstValue(detail?.title)

    if (!detail || !title) return null

    const alt = getFirstValue(detail.alt, detail.model, detail.marque, title) || title

    return {
        title,
        eyebrow: getFirstValue(detail.eyebrow, detail.status, detail.model, detail.marque) || 'Syndicate',
        description: getFirstValue(detail.description),
        image: getFirstValue(detail.image) || fallbackDetailImage,
        alt,
        metrics: (detail.metrics || [])
            .map(normalizeMetric)
            .filter((metric): metric is CarDetailMetric => Boolean(metric)),
        gallery: (detail.gallery || [])
            .map((image) => normalizeGalleryImage(image, alt))
            .filter((image): image is CarDetailGalleryImage => Boolean(image))
    }
}

const carDetail = computed(() => normalizeSyndicateDetail(syndicateDetailData.value))
const shouldShowSyndicateDetailSkeleton = computed(() => (
    !carDetail.value && (
        syndicateDetailPending.value ||
        syndicateDetailStatus.value === 'idle' ||
        syndicateDetailStatus.value === 'pending'
    )
))

useHead(() => ({
    title: `${carDetail.value?.title || 'Syndicate Detail'} | The Car Crowd`
}))
</script>

<template>
    <div class="restomod-shell flex min-h-screen flex-col text-gray-900">
        <AppHeaderCitizen />

        <main class="flex-grow">
            <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div v-if="shouldShowSyndicateDetailSkeleton"
                    class="restomod-panel animate-pulse overflow-hidden rounded-[2rem]">
                    <div class="relative h-[380px] bg-tccDeepBlack sm:h-[420px]">
                        <div class="h-full w-full bg-white/10" />
                        <div class="absolute bottom-0 left-0 w-full p-4 sm:p-10">
                            <span class="block h-3 w-32 rounded-full bg-tccGold/30" />
                            <span class="mt-5 block h-10 w-full max-w-xl rounded-full bg-white/15" />
                            <span class="mt-4 block h-4 w-full max-w-2xl rounded-full bg-white/10" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-8 p-6 lg:p-10">
                        <div class="space-y-8">
                            <section class="space-y-3">
                                <span class="block h-8 w-64 rounded-full bg-tccNavy/10" />
                                <span class="block h-4 w-full rounded-full bg-tccNavy/10" />
                                <span class="block h-4 w-11/12 rounded-full bg-tccNavy/10" />
                            </section>

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div v-for="index in 3" :key="`metric-skeleton-${index}`"
                                    class="rounded-lg border border-tccBorder bg-stone-50 p-4">
                                    <span class="block h-3 w-24 rounded-full bg-tccNavy/10" />
                                    <span class="mt-3 block h-6 w-32 rounded-full bg-tccNavy/10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="syndicateDetailError"
                    class="restomod-panel rounded-[2rem] p-8 text-center sm:p-12">
                    <h1 class="font-poppins text-3xl font-black text-white">Syndicate unavailable</h1>
                    <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                        This syndicate detail could not be loaded right now. Please refresh and try again.
                    </p>
                </div>

                <div v-else-if="!carDetail" class="restomod-panel rounded-[2rem] p-8 text-center sm:p-12">
                    <h1 class="font-poppins text-3xl font-black text-white">Syndicate not found</h1>
                    <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                        This syndicate detail is not available.
                    </p>
                </div>

                <div v-else class="restomod-panel overflow-hidden rounded-[2rem]">
                    <div class="relative h-[380px] bg-tccDeepBlack sm:h-[420px]">
                        <img :src="carDetail.image" :alt="carDetail.alt" class="h-full w-full object-cover opacity-70">
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-tccDeepBlack via-transparent to-transparent" />
                        <div class="absolute bottom-0 left-0 min-w-0 p-4 text-white sm:p-10">
                            <span class="restomod-eyebrow">{{ carDetail.eyebrow }}</span>
                            <h1 class="mt-4 font-poppins text-4xl font-black leading-tight sm:text-5xl">
                                {{ carDetail.title }}
                            </h1>
                            <p v-if="carDetail.description" class="mt-3 max-w-2xl text-sm font-light text-white/75">
                                {{ carDetail.description }}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-8 p-6 lg:p-10">
                        <div class="space-y-8">
                            <section class="space-y-3">
                                <h2 class="font-poppins text-2xl font-semibold text-tccNavy">Investment Analysis</h2>
                                <p class="text-sm font-light leading-relaxed text-gray-600">
                                    This page maps the supplied HTML detail template into the Nuxt prototype. It keeps
                                    the asset thesis, media gallery, metrics, risk notes, and next-step allocation
                                    actions connected to the wider portal flow.
                                </p>
                            </section>

                            <div v-if="carDetail.metrics.length" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div v-for="metric in carDetail.metrics" :key="metric.label"
                                    class="rounded-lg border border-tccBorder bg-stone-50 p-4">
                                    <p class="text-[10px] uppercase tracking-wider text-tccMutedGray">{{ metric.label }}
                                    </p>
                                    <p class="mt-1 font-poppins text-xl font-semibold text-tccNavy">{{ metric.value }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="carDetail.gallery.length" class="grid grid-cols-2 gap-3">
                                <img v-for="image in carDetail.gallery" :key="`${image.src}-${image.alt}`"
                                    :src="image.src" :alt="image.alt"
                                    class="h-40 w-full rounded-lg object-cover">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <AppFooterPortal />
    </div>
</template>
