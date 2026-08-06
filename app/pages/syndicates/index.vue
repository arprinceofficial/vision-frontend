<script setup lang="ts">
useHead({
    title: 'Syndicates | Vision148',
    meta: [
        {
            name: 'description',
            content: 'Join Vision148 syndicates for curated collectible car opportunities, funded assets, and member-managed ownership.'
        }
    ]
})

const featuredIn = ['Forbes', 'London', 'Alternative Investor', 'Autocar', 'The Telegraph']

type CmsCurrentSyndicate = {
    status?: string | null
    title?: string | null
    slug?: string | null
    marque?: string | null
    image?: string | null
    alt?: string | null
    action?: string | null
    to?: string | null
    isLive?: boolean | number | string | null
}

type CmsCurrentSyndicatesResponse = {
    data?: CmsCurrentSyndicate[]
}

type CmsFundedSyndicate = {
    title?: string | null
    slug?: string | null
    model?: string | null
    image?: string | null
    alt?: string | null
    to?: string | null
}

type CmsFundedSyndicatesResponse = {
    data?: CmsFundedSyndicate[]
}

type CmsExpertPanel = {
    title?: string | null
    image?: string | null
    alt?: string | null
    body?: string | null
}

type CmsExpertPanelsResponse = {
    data?: CmsExpertPanel[]
}

type CurrentSyndicate = {
    status: string
    title: string
    marque: string
    image: string
    alt: string
    action: string
    to: string
    isLive: boolean
}

type FundedSyndicate = {
    title: string
    model: string
    image: string
    alt: string
    to: string
}

type ExpertPanel = {
    title: string
    image: string
    alt: string
    body: string
}

type SyndicateCardSkeleton = {
    titleWidth: string
    subtitleWidth: string
}

type ExpertPanelSkeleton = {
    titleWidth: string
    bodyWidths: string[]
}

const fallbackSyndicateImage = '/svg/not-found-img.svg'
const currentSyndicateSkeletons: SyndicateCardSkeleton[] = [
    { titleWidth: 'w-32', subtitleWidth: 'w-24' },
    { titleWidth: 'w-44', subtitleWidth: 'w-36' },
    { titleWidth: 'w-36', subtitleWidth: 'w-48' },
    { titleWidth: 'w-28', subtitleWidth: 'w-20' },
]
const fundedSyndicateSkeletons: SyndicateCardSkeleton[] = [
    { titleWidth: 'w-32', subtitleWidth: 'w-44' },
    { titleWidth: 'w-32', subtitleWidth: 'w-24' },
    { titleWidth: 'w-36', subtitleWidth: 'w-28' },
]
const expertPanelSkeletons: ExpertPanelSkeleton[] = [
    { titleWidth: 'w-44', bodyWidths: ['w-full', 'w-11/12', 'w-4/5'] },
    { titleWidth: 'w-56', bodyWidths: ['w-full', 'w-10/12', 'w-5/6'] },
]

const {
    data: currentSyndicatesData,
    error: currentSyndicatesError,
    pending: currentSyndicatesPending,
    status: currentSyndicatesStatus
} = useAsyncData<CmsCurrentSyndicate[]>(
    'cms-current-syndicates',
    async () => {
        const response = await $fetchCMS<CmsCurrentSyndicatesResponse>('v1/cms/current-syndicates', {
            method: 'POST',
        })

        return Array.isArray(response?.data) ? response.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false,
    }
)

const {
    data: fundedSyndicatesData,
    error: fundedSyndicatesError,
    pending: fundedSyndicatesPending,
    status: fundedSyndicatesStatus
} = useAsyncData<CmsFundedSyndicate[]>(
    'cms-funded-syndicates',
    async () => {
        const response = await $fetchCMS<CmsFundedSyndicatesResponse>('v1/cms/funded-syndicates', {
            method: 'POST',
        })

        return Array.isArray(response?.data) ? response.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false,
    }
)

const {
    data: expertPanelsData,
    error: expertPanelsError,
    pending: expertPanelsPending,
    status: expertPanelsStatus
} = useAsyncData<CmsExpertPanel[]>(
    'cms-expert-panels',
    async () => {
        const response = await $fetchCMS<CmsExpertPanelsResponse>('v1/cms/expert-panels', {
            method: 'POST',
        })

        return Array.isArray(response?.data) ? response.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false,
    }
)

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const isTruthy = (value: boolean | number | string | null | undefined) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value === 1

    const textValue = getFirstValue(value).toLowerCase()
    return textValue === '1' || textValue === 'true' || textValue === 'yes'
}

const createSyndicateSlug = (...values: Array<number | string | null | undefined>) => {
    const textValue = getFirstValue(...values).toLowerCase()

    return textValue
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'detail'
}

const createSyndicateDetailRoute = (source: 'current' | 'funded', slug: string) => (
    `/syndicates/car-detail/${slug}?source=${source}`
)

const normalizeCurrentSyndicate = (item: CmsCurrentSyndicate): CurrentSyndicate | null => {
    const title = getFirstValue(item.title)

    if (!title) return null

    const isLive = isTruthy(item.isLive)
    const marque = getFirstValue(item.marque)

    return {
        status: getFirstValue(item.status) || (isLive ? 'Live Now' : 'Coming Soon'),
        title,
        marque,
        image: getFirstValue(item.image) || fallbackSyndicateImage,
        alt: getFirstValue(item.alt) || title,
        action: 'View',
        to: createSyndicateDetailRoute('current', createSyndicateSlug(item.slug, title)),
        isLive,
    }
}

const normalizeFundedSyndicate = (item: CmsFundedSyndicate): FundedSyndicate | null => {
    const title = getFirstValue(item.title)

    if (!title) return null

    return {
        title,
        model: getFirstValue(item.model),
        image: getFirstValue(item.image) || fallbackSyndicateImage,
        alt: getFirstValue(item.alt) || title,
        to: createSyndicateDetailRoute('funded', createSyndicateSlug(item.slug, `${title} ${getFirstValue(item.model)}`, title)),
    }
}

const normalizeExpertPanel = (panel: CmsExpertPanel): ExpertPanel | null => {
    const title = getFirstValue(panel.title)
    const body = getFirstValue(panel.body)

    if (!title || !body) return null

    return {
        title,
        image: getFirstValue(panel.image) || fallbackSyndicateImage,
        alt: getFirstValue(panel.alt) || title,
        body,
    }
}

const currentSyndicates = computed<CurrentSyndicate[]>(() => (
    (currentSyndicatesData.value || [])
        .map(normalizeCurrentSyndicate)
        .filter((item): item is CurrentSyndicate => Boolean(item))
))

const fundedSyndicates = computed<FundedSyndicate[]>(() => (
    (fundedSyndicatesData.value || [])
        .map(normalizeFundedSyndicate)
        .filter((item): item is FundedSyndicate => Boolean(item))
))

const howItWorks = [
    {
        title: 'Management',
        image: '/generated/experiential.jpeg',
        alt: 'Syndicate management and member events',
        body: 'You are in control, with votes held on every key day-to-day decision regarding the asset, including when to sell it. TheCarCrowd arranges the management of assets, including storage, insurance and maintenance, on the trust’s behalf, and you can view your asset at any time.'
    },
    {
        title: 'Join Together',
        image: '/generated/partner image.png',
        alt: 'Members joining together at a collectible car event',
        body: 'Join together with other members to own the asset outright. You have direct ownership rights of the asset along with the other syndicate members. All details of the level of funding can be found in the Syndicate Agreement, available to view to fully registered.'
    },
    {
        title: 'Registration',
        image: '/frontend/assets/images/first_car_carousel.jpg',
        alt: 'Syndicate registration consultation',
        body: 'Complete the registration journey to check your eligibility, as we can only allow high-net-worth and sophisticated investors to join our syndicates. We will also ask you to complete a few qualification questions to make sure you understand how our syndicates work.'
    }
]

const expertPanels = computed<ExpertPanel[]>(() => (
    (expertPanelsData.value || [])
        .map(normalizeExpertPanel)
        .filter((panel): panel is ExpertPanel => Boolean(panel))
))

const shouldShowCurrentSyndicatesSkeleton = computed(() => (
    !currentSyndicates.value.length && (
        currentSyndicatesPending.value ||
        currentSyndicatesStatus.value === 'idle' ||
        currentSyndicatesStatus.value === 'pending'
    )
))

const shouldShowFundedSyndicatesSkeleton = computed(() => (
    !fundedSyndicates.value.length && (
        fundedSyndicatesPending.value ||
        fundedSyndicatesStatus.value === 'idle' ||
        fundedSyndicatesStatus.value === 'pending'
    )
))

const shouldShowExpertPanelsSkeleton = computed(() => (
    !expertPanels.value.length && (
        expertPanelsPending.value ||
        expertPanelsStatus.value === 'idle' ||
        expertPanelsStatus.value === 'pending'
    )
))
</script>

<template>
    <div class="bg-tccDeepBlack font-poppins text-white">
        <section
            class="relative flex min-h-[430px] items-end overflow-hidden bg-[#101515] pb-12 pt-20 text-white sm:min-h-[500px] lg:min-h-[560px]">
            <img src="/frontend/assets/images/porsche.jpeg" alt="Vision148 syndicate collectible car"
                class="absolute inset-0 h-full w-full object-cover">
            <div class="absolute inset-0 bg-black/55" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/45" />

            <div class="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
                <div class="max-w-4xl">
                    <h1 class="text-[clamp(2rem,6vw,3.75rem)] font-bold leading-tight">TheCarCrowd Syndicates</h1>
                    <p class="mt-3 max-w-3xl text-[14px] font-medium leading-relaxed text-white/85 sm:text-base">
                        Our syndicates allow you to join together with other like minded individuals and benefit from
                        potential future appreciation.
                    </p>
                    <!-- <NuxtLink to="#current-syndicates"
                        class="mt-7 inline-flex items-center gap-3 rounded-full bg-tccGold px-5 py-3 text-[13px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                        Join Syndicate
                        <span class="grid h-5 w-5 place-items-center rounded-full bg-tccDarkNavy text-white">
                            <i class="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                        </span>
                    </NuxtLink> -->
                </div>
            </div>
        </section>

        <section class="border-y border-white/10 bg-[#080705] py-6 text-white">
            <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <div class="flex items-center gap-5">
                    <span class="h-px flex-1 bg-white/15" />
                    <h2 class="text-center text-[16px] font-semibold text-white/90">Featured In</h2>
                    <span class="h-px flex-1 bg-white/15" />
                </div>
                <div
                    class="mt-5 grid grid-cols-2 gap-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white/55 sm:grid-cols-5">
                    <span v-for="item in featuredIn" :key="item">{{ item }}</span>
                </div>
            </div>
        </section>

        <section id="current-syndicates" class="border-b border-white/10 bg-[#050403] py-12 sm:py-16">
            <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <h2 class="text-center text-[28px] font-semibold leading-tight text-white sm:text-[36px]">Current
                    Syndicates</h2>

                <div v-if="shouldShowCurrentSyndicatesSkeleton"
                    class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <article v-for="(itemSkeleton, skeletonIndex) in currentSyndicateSkeletons"
                        :key="`current-syndicate-skeleton-${skeletonIndex}`"
                        class="relative min-h-[280px] animate-pulse overflow-hidden rounded-md border border-white/10 bg-white/5 sm:min-h-[320px]">
                        <div class="absolute inset-0 bg-white/10" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
                        <span class="absolute left-4 top-4 h-5 w-24 rounded-sm bg-white/15" />
                        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                            <span class="block h-7 rounded-full bg-white/15 sm:h-8" :class="itemSkeleton.titleWidth" />
                            <span class="mt-3 block h-3 rounded-full bg-white/15" :class="itemSkeleton.subtitleWidth" />
                            <div class="mt-5 flex items-center gap-3">
                                <span class="block h-8 w-8 bg-tccGold/70" />
                                <span class="block h-3 w-28 rounded-full bg-white/15" />
                            </div>
                        </div>
                    </article>
                </div>
                <div v-else-if="currentSyndicatesError"
                    class="mt-8 rounded-md border border-tccGold/30 bg-tccGold/10 px-6 py-6 text-center text-[15px] leading-relaxed text-white/70">
                    Current syndicates are unavailable right now. Please refresh and try again.
                </div>
                <div v-else-if="!currentSyndicates.length"
                    class="mt-8 rounded-md border border-white/10 bg-white/5 px-6 py-6 text-center text-[15px] leading-relaxed text-white/60">
                    Current syndicates are unavailable right now.
                </div>
                <div v-else class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <article v-for="item in currentSyndicates" :key="`${item.title}-${item.marque}`"
                        class="group relative min-h-[280px] overflow-hidden rounded-md border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40 sm:min-h-[320px]">
                        <img :src="item.image" :alt="item.alt"
                            class="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105">
                        <div class="absolute inset-0 bg-black/45" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
                        <span
                            class="absolute left-4 top-4 rounded-sm px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
                            :class="item.isLive ? 'bg-emerald-400 text-tccDarkNavy' : 'bg-tccDeepBlack text-white'">
                            {{ item.status }}
                        </span>

                        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                            <h3 class="text-[24px] font-semibold leading-none text-white sm:text-[28px]">{{ item.title
                            }}</h3>
                            <p class="mt-2 text-[13px] font-medium text-white/75">{{ item.marque }}</p>
                            <NuxtLink :to="item.to"
                                class="mt-5 inline-flex items-center gap-3 text-[13px] font-semibold text-white/85 transition-colors hover:text-tccGold">
                                <span class="grid h-8 w-8 place-items-center bg-tccGold text-tccDarkNavy">
                                    <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
                                </span>
                                {{ item.action }}
                            </NuxtLink>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#080705] py-12 sm:py-16">
            <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <h2 class="text-center text-[28px] font-semibold leading-tight text-white sm:text-[36px]">Funded
                    Syndicates</h2>

                <div v-if="shouldShowFundedSyndicatesSkeleton" class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <article v-for="(itemSkeleton, skeletonIndex) in fundedSyndicateSkeletons"
                        :key="`funded-syndicate-skeleton-${skeletonIndex}`"
                        class="relative min-h-[280px] animate-pulse overflow-hidden rounded-md border border-white/10 bg-white/5 sm:min-h-[320px]">
                        <div class="absolute inset-0 bg-white/10" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
                        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                            <span class="block h-7 rounded-full bg-white/15 sm:h-8" :class="itemSkeleton.titleWidth" />
                            <span class="mt-3 block h-3 rounded-full bg-white/15" :class="itemSkeleton.subtitleWidth" />
                            <div class="mt-5 flex items-center gap-3">
                                <span class="block h-8 w-8 bg-tccGold/70" />
                                <span class="block h-3 w-28 rounded-full bg-white/15" />
                            </div>
                        </div>
                    </article>
                </div>
                <div v-else-if="fundedSyndicatesError"
                    class="mt-8 rounded-md border border-tccGold/30 bg-tccGold/10 px-6 py-6 text-center text-[15px] leading-relaxed text-white/70">
                    Funded syndicates are unavailable right now. Please refresh and try again.
                </div>
                <div v-else-if="!fundedSyndicates.length"
                    class="mt-8 rounded-md border border-white/10 bg-white/5 px-6 py-6 text-center text-[15px] leading-relaxed text-white/60">
                    Funded syndicates are unavailable right now.
                </div>
                <div v-else class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <article v-for="item in fundedSyndicates" :key="`${item.title}-${item.model}`"
                        class="group relative min-h-[280px] overflow-hidden rounded-md border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40 sm:min-h-[320px]">
                        <img :src="item.image" :alt="item.alt"
                            class="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
                        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                            <h3 class="text-[24px] font-semibold leading-none text-white sm:text-[28px]">{{ item.title
                            }}</h3>
                            <p class="mt-2 text-[13px] font-medium text-white/75">{{ item.model }}</p>
                            <NuxtLink :to="item.to"
                                class="mt-5 inline-flex items-center gap-3 text-[13px] font-semibold text-white/85 transition-colors hover:text-tccGold">
                                <span class="grid h-8 w-8 place-items-center bg-tccGold text-tccDarkNavy">
                                    <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
                                </span>
                                View
                            </NuxtLink>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#050403] py-12 sm:py-16">
            <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <h2 class="text-center text-[28px] font-semibold leading-tight text-white sm:text-[36px]">How It Works
                </h2>

                <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <article v-for="item in howItWorks" :key="item.title"
                        class="overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                        <img :src="item.image" :alt="item.alt" class="h-44 w-full object-cover opacity-90 sm:h-52">
                        <div class="px-5 pb-7 pt-5 sm:px-6">
                            <h3 class="text-xl font-semibold leading-tight text-white">{{ item.title }}</h3>
                            <p class="mt-3 text-[14px] leading-relaxed text-white/65">{{ item.body }}</p>
                            <!-- <NuxtLink to="/register"
                                class="mt-6 inline-flex items-center gap-3 text-[13px] font-medium text-white/70 transition-colors hover:text-tccGold">
                                <span class="grid h-8 w-8 place-items-center bg-tccGold text-tccDarkNavy">
                                    <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
                                </span>
                                Join Us
                            </NuxtLink> -->
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#080705] py-12 sm:py-16">
            <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:px-14">
                <div class="lg:col-span-8">
                    <h2 class="max-w-4xl text-[28px] font-semibold leading-tight text-white sm:text-[36px]">
                        Fuel Your Future with These Experts in Collectible Cars
                    </h2>
                    <img src="/frontend/assets/images/first_car_carousel.jpg"
                        alt="Collectible car experts with syndicate assets"
                        class="mt-8 aspect-[1.75/1] w-full rounded-md object-cover">
                    <div class="mt-8 max-w-4xl">
                        <h3 class="text-xl font-semibold text-white">The First And Largest</h3>
                        <p class="mt-3 text-[14px] leading-relaxed text-white/65">
                            We are the UK's first platform dedicated to collectible cars with industry-leading
                            experience in both automotive and financial services. We are the largest collectible car
                            asset specialist in the UK.
                        </p>
                    </div>
                </div>

                <div class="space-y-9 border-white/10 lg:col-span-4 lg:border-l lg:pl-10">
                    <template v-if="shouldShowExpertPanelsSkeleton">
                        <article v-for="(panelSkeleton, skeletonIndex) in expertPanelSkeletons"
                            :key="`expert-panel-skeleton-${skeletonIndex}`" class="animate-pulse">
                            <div class="aspect-[1.65/1] w-full rounded-md bg-white/10" />
                            <span class="mt-4 block h-6 rounded-full bg-white/10" :class="panelSkeleton.titleWidth" />
                            <div class="mt-3 space-y-3">
                                <span v-for="(bodyWidth, bodyIndex) in panelSkeleton.bodyWidths"
                                    :key="`expert-panel-skeleton-${skeletonIndex}-body-${bodyIndex}`"
                                    class="block h-3 rounded-full bg-white/10" :class="bodyWidth" />
                            </div>
                        </article>
                    </template>
                    <div v-else-if="expertPanelsError"
                        class="rounded-md border border-tccGold/30 bg-tccGold/10 px-5 py-5 text-[14px] leading-relaxed text-white/70">
                        Expert panels are unavailable right now. Please refresh and try again.
                    </div>
                    <div v-else-if="!expertPanels.length"
                        class="rounded-md border border-white/10 bg-white/5 px-5 py-5 text-[14px] leading-relaxed text-white/60">
                        Expert panels are unavailable right now.
                    </div>
                    <template v-else>
                        <article v-for="panel in expertPanels" :key="panel.title">
                            <img :src="panel.image" :alt="panel.alt"
                                class="aspect-[1.65/1] w-full rounded-md object-cover">
                            <h3 class="mt-4 text-xl font-semibold text-white">{{ panel.title }}</h3>
                            <p class="mt-3 text-[14px] leading-relaxed text-white/65">{{ panel.body }}</p>
                        </article>
                    </template>
                </div>
            </div>
        </section>
    </div>
</template>
