<script setup lang="ts">
type CmsUpcomingSyndicate = {
    status?: string | null
    slug?: string | null
    image?: string | null
    alt?: string | null
    collection?: string | null
    title?: string | null
    description?: string | null
}

type CmsUpcomingSyndicatesResponse = {
    data?: CmsUpcomingSyndicate[]
}

type UpcomingSyndicate = {
    status: string
    slug: string
    image: string
    alt: string
    meta: string
    title: string
    description: string
}

const fallbackUpcomingSyndicateImage = '/generated/ferrari-studio.png'

const {
    data: upcomingSyndicatesData,
    error: upcomingSyndicatesError,
    pending: upcomingSyndicatesPending,
    status: upcomingSyndicatesStatus
} = useAsyncData<CmsUpcomingSyndicate[]>(
    'citizen-fractional-upcoming-syndicates',
    async () => {
        const response = await $fetchCitizen<CmsUpcomingSyndicatesResponse>('v1/customer/fractional/upcoming', {
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

const createUpcomingSyndicateSlug = (...values: Array<number | string | null | undefined>) => {
    const textValue = getFirstValue(...values).toLowerCase()

    return textValue
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'detail'
}

const normalizeUpcomingSyndicate = (item: CmsUpcomingSyndicate): UpcomingSyndicate | null => {
    const title = getFirstValue(item.title)

    if (!title) return null

    return {
        status: getFirstValue(item.status) || 'Upcoming',
        slug: createUpcomingSyndicateSlug(item.slug, title),
        image: getFirstValue(item.image) || fallbackUpcomingSyndicateImage,
        alt: getFirstValue(item.alt) || title,
        meta: getFirstValue(item.collection) || 'Syndicate',
        title,
        description: getFirstValue(item.description)
    }
}

const upcomingSyndicates = computed<UpcomingSyndicate[]>(() => (
    (upcomingSyndicatesData.value || [])
        .map(normalizeUpcomingSyndicate)
        .filter((item): item is UpcomingSyndicate => Boolean(item))
))
</script>

<template>
    <section id="coming-soon" class="border-b border-white/10 bg-tccDeepBlack py-20 text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <span class="restomod-eyebrow">Pipeline</span>
                    <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">Upcoming
                        Syndicates</h2>
                </div>
                <p class="max-w-md text-sm leading-relaxed text-white/60">Secure priority access before the next public
                    allocation window opens.</p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <article v-for="item in upcomingSyndicates" :key="item.title"
                    class="restomod-image-card group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                    <div class="relative h-64 overflow-hidden bg-tccDeepBlack">
                        <span
                            class="absolute left-5 top-5 z-10 rounded-full border border-tccGold/30 bg-tccDeepBlack/70 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.24em] text-tccGold">
                            {{ item.status }}
                        </span>
                        <img :src="item.image" :alt="item.alt" class="h-full w-full object-cover opacity-90">
                    </div>
                    <div class="p-6">
                        <span class="font-poppins text-[10px] font-semibold uppercase tracking-[0.24em] text-tccGold">{{
                            item.meta }}</span>
                        <h3 class="mt-2 font-poppins text-2xl font-bold text-white">{{ item.title }}</h3>
                        <p class="news-card-excerpt mt-3 text-sm leading-relaxed text-white/60 line-clamp-3">{{ item.description }}
                        </p>
                        <NuxtLink :to="`/syndicates/${item.slug}`"
                            class="mt-6 block rounded-full bg-tccGold py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.22em] text-tccDarkNavy transition-colors duration-200 hover:bg-tccLightGold">
                            Register Interest
                        </NuxtLink>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
