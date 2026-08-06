<script setup lang="ts">
useHead({
    title: 'Private Portfolios | Vision148',
    meta: [
        {
            name: 'description',
            content: 'Private collectible car portfolio curation, sourcing, custody, and realisation from Vision148.'
        }
    ]
})

const featuredIn = ['Forbes', 'London', 'Alternative Investor', 'Autocar', 'The Telegraph']

type CmsPortfolioCard = {
    title?: string | null
    image?: string | null
    alt?: string | null
    body?: string | null
}

type CmsPortfolioCardsResponse = {
    data?: CmsPortfolioCard[]
}

type PortfolioCard = {
    title: string
    image: string
    alt: string
    body: string
}

type PortfolioCardSkeleton = {
    titleWidth: string
    bodyWidths: string[]
}

const fallbackPortfolioImage = '/svg/not-found-img.svg'
const investmentCardSkeletons: PortfolioCardSkeleton[] = [
    { titleWidth: 'w-4/5', bodyWidths: ['w-full', 'w-11/12', 'w-5/6', 'w-3/4'] },
    { titleWidth: 'w-3/5', bodyWidths: ['w-full', 'w-10/12', 'w-4/5', 'w-2/3'] },
    { titleWidth: 'w-2/3', bodyWidths: ['w-11/12', 'w-full', 'w-5/6', 'w-3/5'] },
]
const portfolioServiceSkeletons: PortfolioCardSkeleton[] = [
    { titleWidth: 'w-44', bodyWidths: ['w-full', 'w-11/12', 'w-5/6'] },
    { titleWidth: 'w-36', bodyWidths: ['w-full', 'w-10/12', 'w-4/5'] },
    { titleWidth: 'w-40', bodyWidths: ['w-11/12', 'w-full', 'w-3/4'] },
    { titleWidth: 'w-48', bodyWidths: ['w-full', 'w-5/6', 'w-2/3'] },
    { titleWidth: 'w-52', bodyWidths: ['w-11/12', 'w-full', 'w-4/5'] },
    { titleWidth: 'w-44', bodyWidths: ['w-full', 'w-10/12', 'w-3/4'] },
]

const {
    data: investmentCardsData,
    error: investmentCardsError,
    pending: investmentCardsPending,
    status: investmentCardsStatus
} = useAsyncData<CmsPortfolioCard[]>(
    'cms-private-portfolio-investment-cards',
    async () => {
        const response = await $fetchCMS<CmsPortfolioCardsResponse>('v1/cms/investment-cards', {
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
    data: portfolioServicesData,
    error: portfolioServicesError,
    pending: portfolioServicesPending,
    status: portfolioServicesStatus
} = useAsyncData<CmsPortfolioCard[]>(
    'cms-private-portfolio-services',
    async () => {
        const response = await $fetchCMS<CmsPortfolioCardsResponse>('v1/cms/portfolio-services', {
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

const normalizePortfolioCard = (card: CmsPortfolioCard): PortfolioCard | null => {
    const title = getFirstValue(card.title)
    const body = getFirstValue(card.body)

    if (!title || !body) return null

    return {
        title,
        image: getFirstValue(card.image) || fallbackPortfolioImage,
        alt: getFirstValue(card.alt) || title,
        body,
    }
}

const investmentCards = computed<PortfolioCard[]>(() => (
    (investmentCardsData.value || [])
        .map(normalizePortfolioCard)
        .filter((card): card is PortfolioCard => Boolean(card))
))

const portfolioServices = computed<PortfolioCard[]>(() => (
    (portfolioServicesData.value || [])
        .map(normalizePortfolioCard)
        .filter((card): card is PortfolioCard => Boolean(card))
))

const shouldShowInvestmentCardsSkeleton = computed(() => (
    !investmentCards.value.length && (
        investmentCardsPending.value ||
        investmentCardsStatus.value === 'idle' ||
        investmentCardsStatus.value === 'pending'
    )
))

const shouldShowPortfolioServicesSkeleton = computed(() => (
    !portfolioServices.value.length && (
        portfolioServicesPending.value ||
        portfolioServicesStatus.value === 'idle' ||
        portfolioServicesStatus.value === 'pending'
    )
))
</script>

<template>
    <div class="bg-tccDeepBlack font-poppins text-white">
        <section class="relative flex min-h-[620px] items-end overflow-hidden bg-[#11100d] pb-20 pt-24 text-white">
            <img src="/frontend/assets/images/first_car_carousel.jpg" alt="Private collectible car portfolio"
                class="absolute inset-0 h-full w-full object-cover">
            <div class="absolute inset-0 bg-black/55" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/45" />

            <div class="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
                <div class="max-w-4xl">
                    <h1 class="text-[42px] font-bold leading-tight sm:text-[58px]">Private Portfolios</h1>
                    <p class="mt-4 max-w-3xl text-[16px] font-medium leading-relaxed text-white/85 sm:text-lg">
                        If you're passionate about cars, interested in alternatives, or looking to diversify, a private
                        portfolio could be right for you.
                    </p>
                    <NuxtLink to="#consultation"
                        class="mt-9 inline-flex items-center gap-3 rounded-full bg-tccGold px-6 py-3.5 text-[14px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                        Get In Touch
                        <span class="grid h-5 w-5 place-items-center rounded-full bg-tccDarkNavy text-white">
                            <i class="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                        </span>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section class="border-y border-white/10 bg-[#080705] py-7 text-white">
            <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <div class="flex items-center gap-5">
                    <span class="h-px flex-1 bg-white/15" />
                    <h2 class="text-center text-[16px] font-semibold text-white/90">Featured In</h2>
                    <span class="h-px flex-1 bg-white/15" />
                </div>
                <div
                    class="mt-7 grid grid-cols-2 gap-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 sm:grid-cols-5">
                    <span v-for="item in featuredIn" :key="item">{{ item }}</span>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#050403] py-20 sm:py-24">
            <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <div class="max-w-5xl">
                    <h2 class="text-[34px] font-semibold leading-tight text-white sm:text-[44px]">Why Invest In A
                        Private Portfolio?</h2>
                    <p class="mt-5 text-[15px] leading-relaxed text-white/65">
                        Building a private collection takes skill and know-how. Investing in the right assets at the
                        right time, as well as balancing emotional and financial returns that fit your overall strategy
                        can be tricky. Our experts are on-hand to guide you through the process to maximise profit and
                        enjoyment.
                    </p>
                </div>

                <div v-if="shouldShowInvestmentCardsSkeleton" class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <article v-for="(cardSkeleton, skeletonIndex) in investmentCardSkeletons"
                        :key="`investment-card-skeleton-${skeletonIndex}`"
                        class="animate-pulse overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                        <div class="h-60 w-full bg-white/10" />
                        <div class="px-6 pb-9 pt-5">
                            <span class="block h-7 rounded-full bg-white/10" :class="cardSkeleton.titleWidth" />
                            <div class="mt-4 space-y-3">
                                <span v-for="(bodyWidth, bodyIndex) in cardSkeleton.bodyWidths"
                                    :key="`investment-card-skeleton-${skeletonIndex}-body-${bodyIndex}`"
                                    class="block h-3 rounded-full bg-white/10" :class="bodyWidth" />
                            </div>
                        </div>
                    </article>
                </div>
                <div v-else-if="investmentCardsError"
                    class="mt-12 rounded-md border border-tccGold/30 bg-tccGold/10 px-6 py-6 text-[15px] leading-relaxed text-white/70">
                    Investment cards are unavailable right now. Please refresh and try again.
                </div>
                <div v-else-if="!investmentCards.length"
                    class="mt-12 rounded-md border border-white/10 bg-white/5 px-6 py-6 text-[15px] leading-relaxed text-white/60">
                    Investment cards are unavailable right now.
                </div>
                <div v-else class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <article v-for="card in investmentCards" :key="card.title"
                        class="overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                        <img :src="card.image" :alt="card.alt" class="h-60 w-full object-cover opacity-90">
                        <div class="px-6 pb-9 pt-5">
                            <h3 class="text-[22px] font-semibold leading-tight text-white">{{ card.title }}</h3>
                            <p class="mt-4 text-[15px] leading-relaxed text-white/65">{{ card.body }}</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="relative overflow-hidden py-28 text-center text-white sm:py-36">
            <img src="/generated/porsche-studio.png" alt="Exceptional collector car"
                class="absolute inset-0 h-full w-full object-cover">
            <div class="absolute inset-0 bg-black/60" />
            <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/60" />
            <div class="relative mx-auto max-w-4xl px-6">
                <h2 class="text-[38px] font-semibold leading-tight sm:text-[58px]">The art of curating exceptional
                    machines</h2>
            </div>
        </section>

        <section id="consultation" class="border-y border-white/10 bg-[#080705] py-20 sm:py-24">
            <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 class="text-[34px] font-semibold leading-tight text-white sm:text-[44px]">With You Every
                            Step Of The Way</h2>
                        <p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">
                            Speak to our Private Office team to discuss personalised portfolio options that suit you.
                        </p>
                    </div>
                    <NuxtLink to="/contact"
                        class="inline-flex items-center justify-center gap-3 rounded-full border border-tccGold/50 bg-tccGold px-6 py-3.5 text-[13px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold md:shrink-0">
                        Book A Call
                        <i class="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
                    </NuxtLink>
                </div>

                <div v-if="shouldShowPortfolioServicesSkeleton"
                    class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <article v-for="(serviceSkeleton, skeletonIndex) in portfolioServiceSkeletons"
                        :key="`portfolio-service-skeleton-${skeletonIndex}`"
                        class="animate-pulse overflow-hidden rounded-md border border-white/10 bg-white/5">
                        <div class="h-56 w-full bg-white/10" />
                        <div class="px-6 pb-9 pt-5">
                            <span class="block h-6 rounded-full bg-white/10" :class="serviceSkeleton.titleWidth" />
                            <div class="mt-4 space-y-3">
                                <span v-for="(bodyWidth, bodyIndex) in serviceSkeleton.bodyWidths"
                                    :key="`portfolio-service-skeleton-${skeletonIndex}-body-${bodyIndex}`"
                                    class="block h-3 rounded-full bg-white/10" :class="bodyWidth" />
                            </div>
                        </div>
                    </article>
                </div>
                <div v-else-if="portfolioServicesError"
                    class="mt-12 rounded-md border border-tccGold/30 bg-tccGold/10 px-6 py-6 text-[15px] leading-relaxed text-white/70">
                    Portfolio services are unavailable right now. Please refresh and try again.
                </div>
                <div v-else-if="!portfolioServices.length"
                    class="mt-12 rounded-md border border-white/10 bg-white/5 px-6 py-6 text-[15px] leading-relaxed text-white/60">
                    Portfolio services are unavailable right now.
                </div>
                <div v-else class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <article v-for="service in portfolioServices" :key="service.title"
                        class="overflow-hidden rounded-md border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                        <img :src="service.image" :alt="service.alt" class="h-56 w-full object-cover opacity-90">
                        <div class="px-6 pb-9 pt-5">
                            <h3 class="text-[21px] font-semibold leading-tight text-white">{{ service.title }}</h3>
                            <p class="mt-4 text-[15px] leading-relaxed text-white/65">{{ service.body }}</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#050403]">
            <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="flex items-center px-6 py-20 sm:px-10 lg:px-14">
                    <div class="max-w-2xl">
                        <h2 class="text-[34px] font-semibold leading-tight text-white sm:text-[44px]">Safe and real
                            assets</h2>
                        <div class="mt-6 space-y-5 text-[16px] leading-relaxed text-white/68">
                            <p>
                                Placing capital into collectible cars presents a secure choice for wealth preservation
                                and growth. The market for collector cars has generally shown attractive portfolio
                                characteristics.
                            </p>
                            <p>
                                Returns have been consistently high, values have not been impacted by global downturns,
                                and correlations with other asset classes such as equities, bonds and property have been
                                low.
                            </p>
                            <p>
                                Unlike intangible assets, cars possess intrinsic value and cannot go bankrupt. This
                                stability, together with the substantial potential returns, makes cars a compelling
                                option for those seeking both security and financial growth.
                            </p>
                        </div>
                        <NuxtLink to="#consultation"
                            class="mt-9 inline-flex items-center gap-3 rounded-full bg-tccGold px-6 py-3.5 text-[13px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                            Find Out More
                            <i class="fa-solid fa-circle-arrow-right text-[13px]" aria-hidden="true" />
                        </NuxtLink>
                    </div>
                </div>
                <div class="min-h-[520px]">
                    <img src="/generated/partner image.png"
                        alt="Collector cars stored with a specialist automotive partner"
                        class="h-full w-full object-cover">
                </div>
            </div>
        </section>

        <section class="relative overflow-hidden border-b border-white/10 py-16 text-center text-white">
            <img src="/generated/hero-aston-studio.png" alt="Private portfolio collection"
                class="absolute inset-0 h-full w-full object-cover">
            <div class="absolute inset-0 bg-black/65" />
            <div class="relative mx-auto max-w-5xl px-6">
                <h2
                    class="text-[28px] font-semibold uppercase leading-tight tracking-[0.06em] text-white sm:text-[38px]">
                    Ready To Build Your Dream Collection?</h2>
                <p class="mt-3 text-[14px] leading-relaxed text-white/70">Request a consultation with our expert team
                    today.</p>
                <NuxtLink to="/contact"
                    class="mt-7 inline-flex items-center gap-3 rounded-full bg-tccGold px-6 py-3 text-[13px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                    Get Started
                    <i class="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
                </NuxtLink>
            </div>
        </section>
    </div>
</template>
