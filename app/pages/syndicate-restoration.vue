<script setup lang="ts">
useHead({
    title: 'Syndicated Restoration | Vision148',
    meta: [
        {
            name: 'description',
            content: 'Share the investment, the experience, and the enjoyment of syndicated classic car restoration.'
        }
    ]
})

type CmsRestorationCard = {
    title?: string | null
    image?: string | null
    alt?: string | null
    body?: string | null
}

type CmsRestorationCardsResponse = {
    data?: CmsRestorationCard[]
}

type CmsAvailableSyndicate = {
    title?: string | null
    description?: string | null
    image?: string | null
    alt?: string | null
}

type CmsAvailableSyndicatesResponse = {
    data?: CmsAvailableSyndicate[]
}

type RestorationCard = {
    title: string
    image: string
    alt: string
    body: string
}

type HowItWorksStep = {
    title: string
    body: string
}

type AvailableSyndicate = {
    title: string
    description: string
    image: string
    alt: string
}

type CardSkeleton = {
    titleWidth: string
    bodyWidths: string[]
}

type StepSkeleton = {
    width: string
}

const fallbackRestorationImage = '/svg/not-found-img.svg'
const benefitCardSkeletons: CardSkeleton[] = [
    { titleWidth: 'w-40', bodyWidths: ['w-full', 'w-11/12', 'w-5/6', 'w-2/3'] },
    { titleWidth: 'w-52', bodyWidths: ['w-full', 'w-10/12', 'w-4/5', 'w-3/5'] },
    { titleWidth: 'w-44', bodyWidths: ['w-11/12', 'w-full', 'w-5/6', 'w-2/3'] },
    { titleWidth: 'w-32', bodyWidths: ['w-full', 'w-5/6', 'w-3/4'] },
]
const howItWorksSkeletons: StepSkeleton[] = [
    { width: 'w-full' },
    { width: 'w-11/12' },
    { width: 'w-10/12' },
]
const availableSyndicateSkeletons: CardSkeleton[] = [
    { titleWidth: 'w-44', bodyWidths: ['w-4/5'] },
    { titleWidth: 'w-52', bodyWidths: ['w-5/6'] },
    { titleWidth: 'w-56', bodyWidths: ['w-full'] },
]

const {
    data: benefitCardsData,
    error: benefitCardsError,
    pending: benefitCardsPending,
    status: benefitCardsStatus
} = useAsyncData<CmsRestorationCard[]>(
    'cms-restoration-benefit-cards',
    async () => {
        const response = await $fetchCMS<CmsRestorationCardsResponse>('v1/cms/restoration-benefit-cards', {
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
    data: howItWorksData,
    error: howItWorksError,
    pending: howItWorksPending,
    status: howItWorksStatus
} = useAsyncData<CmsRestorationCard[]>(
    'cms-syndicate-how-it-works',
    async () => {
        const response = await $fetchCMS<CmsRestorationCardsResponse>('v1/cms/syndicate-how-it-works', {
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
    data: availableSyndicatesData,
    error: availableSyndicatesError,
    pending: availableSyndicatesPending,
    status: availableSyndicatesStatus
} = useAsyncData<CmsAvailableSyndicate[]>(
    'cms-available-syndicates',
    async () => {
        const response = await $fetchCMS<CmsAvailableSyndicatesResponse>('v1/cms/available-syndicates', {
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

const normalizeRestorationCard = (card: CmsRestorationCard): RestorationCard | null => {
    const title = getFirstValue(card.title)
    const body = getFirstValue(card.body)

    if (!title || !body) return null

    return {
        title,
        image: getFirstValue(card.image) || fallbackRestorationImage,
        alt: getFirstValue(card.alt) || title,
        body,
    }
}

const normalizeHowItWorksStep = (step: CmsRestorationCard): HowItWorksStep | null => {
    const body = getFirstValue(step.body)

    if (!body) return null

    return {
        title: getFirstValue(step.title),
        body,
    }
}

const normalizeAvailableSyndicate = (item: CmsAvailableSyndicate): AvailableSyndicate | null => {
    const title = getFirstValue(item.title)
    const description = getFirstValue(item.description)

    if (!title || !description) return null

    return {
        title,
        description,
        image: getFirstValue(item.image) || fallbackRestorationImage,
        alt: getFirstValue(item.alt) || title,
    }
}

const benefitCards = computed<RestorationCard[]>(() => (
    (benefitCardsData.value || [])
        .map(normalizeRestorationCard)
        .filter((card): card is RestorationCard => Boolean(card))
))

const howItWorks = computed<HowItWorksStep[]>(() => (
    (howItWorksData.value || [])
        .map(normalizeHowItWorksStep)
        .filter((step): step is HowItWorksStep => Boolean(step))
))

const availableSyndicates = computed<AvailableSyndicate[]>(() => (
    (availableSyndicatesData.value || [])
        .map(normalizeAvailableSyndicate)
        .filter((item): item is AvailableSyndicate => Boolean(item))
))

const shouldShowBenefitCardsSkeleton = computed(() => (
    !benefitCards.value.length && (
        benefitCardsPending.value ||
        benefitCardsStatus.value === 'idle' ||
        benefitCardsStatus.value === 'pending'
    )
))

const shouldShowHowItWorksSkeleton = computed(() => (
    !howItWorks.value.length && (
        howItWorksPending.value ||
        howItWorksStatus.value === 'idle' ||
        howItWorksStatus.value === 'pending'
    )
))

const shouldShowAvailableSyndicatesSkeleton = computed(() => (
    !availableSyndicates.value.length && (
        availableSyndicatesPending.value ||
        availableSyndicatesStatus.value === 'idle' ||
        availableSyndicatesStatus.value === 'pending'
    )
))

</script>

<template>
    <div class="bg-tccDeepBlack font-poppins text-white">
        <section class="relative flex min-h-[680px] items-end overflow-hidden bg-[#101515] pb-24 pt-24 text-white">
            <img src="/generated/restoration-workshop.png" alt="Classic car restoration in progress"
                class="absolute inset-0 h-full w-full object-cover">
            <div class="absolute inset-0 bg-black/55" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-black/35" />

            <div class="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 sm:px-8 lg:px-12">
                <div class="max-w-4xl">
                    <h1 class="text-[42px] font-bold leading-tight sm:text-[56px]">Syndicated Restoration</h1>
                    <p class="mt-3 text-lg font-semibold leading-relaxed text-white">Share the investment, the
                        experience, and the enjoyment.</p>
                    <NuxtLink to="#how-it-works"
                        class="mt-10 inline-flex items-center gap-2 rounded-full bg-tccGold px-7 py-4 text-[15px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                        Find Out More
                        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-tccDarkNavy text-white">
                            <i class="fa-solid fa-arrow-up-right-from-square text-[9px]" aria-hidden="true" />
                        </span>
                    </NuxtLink>
                </div>

                <div class="flex items-center justify-end gap-8">
                    <div class="flex items-center gap-3 text-white">
                        <span class="text-sm font-semibold uppercase tracking-[0.35em] opacity-85">GP</span>
                        <span
                            class="grid h-14 w-24 place-items-center rounded-full border-2 border-white/80 text-2xl font-bold leading-none">
                            59
                        </span>
                    </div>
                    <img src="/frontend/assets/images/TCClogowhite.png" alt="Vision148" class="h-auto w-32">
                </div>
            </div>
        </section>

        <section class="border-y border-white/10 bg-[#050403] text-white">
            <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1.08fr_1fr]">
                <div class="border-white/10 px-6 py-14 sm:px-10 lg:border-r lg:px-14">
                    <p class="max-w-[620px] text-[36px] font-semibold leading-[1.18] sm:text-[46px]">
                        Restoration of a classic car can be expensive and often inaccessible, and once restored used for
                        just a few weeks each year.
                    </p>
                </div>
                <div class="grid">
                    <div class="border-b border-white/10 px-6 py-12 sm:px-10 lg:px-14">
                        <p class="text-[30px] font-normal leading-tight sm:text-[40px]">
                            Now there is a <span class="text-tccGold">Better Way.</span>
                        </p>
                    </div>
                    <div class="px-6 py-10 sm:px-10 lg:px-14">
                        <p class="text-[30px] font-normal leading-snug sm:text-[40px]">
                            Introducing <span class="text-tccGold">Syndicated<br class="hidden sm:block">
                                Restorations.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#080705] py-20 sm:py-24">
            <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:px-10 md:grid-cols-3 lg:px-14">
                <template v-if="shouldShowBenefitCardsSkeleton">
                    <article v-for="(cardSkeleton, skeletonIndex) in benefitCardSkeletons"
                        :key="`benefit-card-skeleton-${skeletonIndex}`"
                        class="animate-pulse overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                        <div class="h-56 w-full bg-white/10" />
                        <div class="px-6 pb-10 pt-5">
                            <span class="block h-7 rounded-full bg-white/10" :class="cardSkeleton.titleWidth" />
                            <div class="mt-4 space-y-3">
                                <span v-for="(bodyWidth, bodyIndex) in cardSkeleton.bodyWidths"
                                    :key="`benefit-card-skeleton-${skeletonIndex}-body-${bodyIndex}`"
                                    class="block h-3 rounded-full bg-white/10" :class="bodyWidth" />
                            </div>
                        </div>
                    </article>
                </template>
                <div v-else-if="benefitCardsError"
                    class="rounded-md border border-tccGold/30 bg-tccGold/10 px-6 py-6 text-[15px] leading-relaxed text-white/70 md:col-span-3">
                    Restoration benefit cards are unavailable right now. Please refresh and try again.
                </div>
                <div v-else-if="!benefitCards.length"
                    class="rounded-md border border-white/10 bg-white/5 px-6 py-6 text-[15px] leading-relaxed text-white/60 md:col-span-3">
                    Restoration benefit cards are unavailable right now.
                </div>
                <template v-else>
                    <article v-for="card in benefitCards" :key="card.title"
                        class="overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                        <img :src="card.image" :alt="card.alt" class="h-56 w-full object-cover opacity-90">
                        <div class="px-6 pb-10 pt-5">
                            <h2 class="text-[23px] font-semibold leading-tight text-white">{{ card.title }}</h2>
                            <p class="mt-4 text-[15px] leading-relaxed text-white/65">{{ card.body }}</p>
                        </div>
                    </article>
                </template>
            </div>
        </section>

        <section id="how-it-works" class="border-b border-white/10 bg-tccDeepBlack py-20 sm:py-28">
            <div
                class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-14">
                <div>
                    <p class="max-w-[455px] text-[38px] font-semibold leading-[1.42] text-white sm:text-[46px]">
                        It's classic car ownership - smarter, more social, and more sustainable.
                    </p>
                </div>
                <div>
                    <div class="mb-9 flex items-center gap-6">
                        <h2 class="whitespace-nowrap text-[28px] font-semibold uppercase tracking-wide text-tccGold">How
                            It Works</h2>
                        <span class="h-px flex-1 bg-white/20" />
                    </div>
                    <ul v-if="shouldShowHowItWorksSkeleton" class="space-y-5">
                        <li v-for="(stepSkeleton, skeletonIndex) in howItWorksSkeletons"
                            :key="`how-it-works-skeleton-${skeletonIndex}`"
                            class="flex animate-pulse gap-4 text-[15px] leading-relaxed text-white/70">
                            <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-tccGold" />
                            <span class="mt-1 block h-4 rounded-full bg-white/10" :class="stepSkeleton.width" />
                        </li>
                    </ul>
                    <div v-else-if="howItWorksError"
                        class="rounded-md border border-tccGold/30 bg-tccGold/10 px-5 py-5 text-[15px] leading-relaxed text-white/70">
                        How it works details are unavailable right now. Please refresh and try again.
                    </div>
                    <div v-else-if="!howItWorks.length"
                        class="rounded-md border border-white/10 bg-white/5 px-5 py-5 text-[15px] leading-relaxed text-white/60">
                        How it works details are unavailable right now.
                    </div>
                    <ul v-else class="space-y-5">
                        <li v-for="item in howItWorks" :key="`${item.title}-${item.body}`"
                            class="flex gap-4 text-[15px] leading-relaxed text-white/70">
                            <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-tccGold" />
                            <span>
                                <span v-if="item.title" class="font-semibold text-white">{{ item.title }}: </span>
                                {{ item.body }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="available" class="border-b border-white/10 bg-[#080705] py-20 sm:py-24">
            <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <h2 class="text-center text-[36px] font-semibold leading-tight text-white sm:text-[46px]">Syndicates
                    Available Now</h2>

                <div v-if="shouldShowAvailableSyndicatesSkeleton"
                    class="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
                    <article v-for="(itemSkeleton, skeletonIndex) in availableSyndicateSkeletons"
                        :key="`available-syndicate-skeleton-${skeletonIndex}`" class="animate-pulse">
                        <div class="aspect-[1.5/1] w-full rounded-md bg-white/10" />
                        <span class="mt-5 block h-6 rounded-full bg-white/10" :class="itemSkeleton.titleWidth" />
                        <span v-for="bodyWidth in itemSkeleton.bodyWidths"
                            :key="`available-syndicate-skeleton-${skeletonIndex}-${bodyWidth}`"
                            class="mt-3 block h-3 rounded-full bg-white/10" :class="bodyWidth" />
                    </article>
                </div>
                <div v-else-if="availableSyndicatesError"
                    class="mt-12 rounded-md border border-tccGold/30 bg-tccGold/10 px-6 py-6 text-center text-[15px] leading-relaxed text-white/70">
                    Available syndicates are unavailable right now. Please refresh and try again.
                </div>
                <div v-else-if="!availableSyndicates.length"
                    class="mt-12 rounded-md border border-white/10 bg-white/5 px-6 py-6 text-center text-[15px] leading-relaxed text-white/60">
                    Available syndicates are unavailable right now.
                </div>
                <div v-else class="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
                    <article v-for="item in availableSyndicates" :key="item.title">
                        <img :src="item.image" :alt="item.alt" class="aspect-[1.5/1] w-full rounded-md object-cover">
                        <h3 class="mt-5 text-[20px] font-semibold leading-tight text-white">{{ item.title }}</h3>
                        <p class="mt-1 min-h-8 text-[11px] leading-relaxed text-white/55">{{ item.description }}</p>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>
