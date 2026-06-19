<script setup lang="ts">
const boxingFuturesLogo = '/assets/images/citizen/icons/detail/boxing-futures-logo.png'

type DifferenceCard = {
    description?: string
    title_color?: string
    title_white?: string
}

type DifferenceSectionPayload = {
    cards?: DifferenceCard[]
    image?: string
    button_link?: string
}

const props = withDefaults(
    defineProps<{
        differenceSection?: DifferenceSectionPayload
        bg_image?: string
    }>(),
    {
        differenceSection: () => ({}),
    }
)

const fallbackBanner = '/assets/images/citizen/icons/detail/charity-banner.jpg'
const fallbackAboutCopy = `Boxing Futures is a UK-based charity transforming lives through the discipline and community of boxing. We work with young people aged 10-21 from disadvantaged backgrounds - giving them not just a gym, but a place to belong.\n\nOur programmes go beyond the ring, combining mentorship, mental health support, and employment pathways to build resilience and confidence. With hubs across South Yorkshire, the East Midlands, and London, we reach over 2,000 young people every year. We don't just build fighters. We build futures.`
const fallbackSpotlightCopy = `Former WBO Cruiserweight World Champion.\nCoach. Mentor. Champion for Change.\n\nSince partnering with Boxing Futures in 2019, Johnny has been one of the charity's most hands-on ambassadors. His monthly "Champion Mindset" sessions draw on his own journey from self-doubting young fighter to world champion - speaking candidly about failure and the turning points that changed everything.\n\nJohnny also helped launch the Futures Fund, a bursary for talented young athletes who lack the means to pursue their sport. "If I can help even one young person believe in themselves a little sooner than I did - that's worth more than any belt."`

const aboutCard = computed(() => props.differenceSection?.cards?.[0])
const spotlightCard = computed(() => props.differenceSection?.cards?.[1])

const aboutTitle = computed(() => aboutCard.value?.title_white || 'ABOUT')
const aboutTitleColor = computed(() => aboutCard.value?.title_color || '#d4af37')
const aboutCopy = computed(() => aboutCard.value?.description || fallbackAboutCopy)

const spotlightTitle = computed(() => spotlightCard.value?.title_white || 'CHARITY SPOTLIGHT')
const spotlightTitleColor = computed(() => spotlightCard.value?.title_color || '#d4af37')
const spotlightCopy = computed(() => spotlightCard.value?.description || fallbackSpotlightCopy)

const charityBanner = computed(() => props?.bg_image || fallbackBanner)
const differenceButtonLink = computed(() => props.differenceSection?.button_link || '')
</script>

<template>
    <section class="relative">
        <div class="flex min-h-[160px] items-center justify-center px-4 py-10 sm:min-h-[220px] sm:px-8 sm:py-16 lg:h-[266px] lg:px-[48px] lg:py-[98px]">
            <h2
                class="text-center [font-family:var(--font-family-Headings)] text-[clamp(2.4rem,10vw,6.25rem)] leading-[0.75] tracking-[-0.03em] text-white">
                MAKING A
                <span
                    class="bg-[linear-gradient(169.665deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                    DIFFERENCE
                </span>
            </h2>
        </div>

        <div class="mx-auto hidden w-full max-w-[1512px] px-[72px] pb-20 pt-[72px] xl:block">
            <div class="mx-auto h-[440px] w-[440px] overflow-hidden rounded-[16px]">
                <img :src="boxingFuturesLogo" alt="Boxing Futures" class="h-full w-full object-cover" />
            </div>

            <a :href="differenceButtonLink || undefined"
                class="mx-auto mt-12 flex h-[48px] w-[260px] items-center justify-center rounded-[1498.5px] bg-[linear-gradient(-34.255deg,rgba(255,255,255,0)_28.673%,rgba(255,255,255,0.1)_71.327%),linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%)] text-[24px] leading-[30px] text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
                Find Out More
            </a>

            <div class="mt-16 grid grid-cols-2 gap-8">
                <article
                    class="relative min-h-[368px] rounded-[16px] border border-white bg-[rgba(34,37,43,0.5)] px-8 py-9 backdrop-blur-[50px]">
                    <h3
                        class="bg-[linear-gradient(127.601deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-center [font-family:var(--font-family-Headings)] text-[63px] leading-[50px] text-transparent">
                        <span :style="{ color: aboutTitleColor }">{{ aboutTitle }}</span>
                    </h3>
                    <p class="mx-auto mt-8 max-w-[590px] whitespace-pre-wrap text-center text-[20px] leading-[24px] text-[#d0d1d4]">
                        {{ aboutCopy }}
                    </p>
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_-2px_0_2px_rgba(255,255,255,0.2),inset_3px_3px_2px_rgba(255,255,255,0.1)]" />
                </article>

                <article
                    class="relative min-h-[368px] rounded-[16px] border border-white bg-[rgba(34,37,43,0.5)] px-8 py-9 backdrop-blur-[50px]">
                    <h3
                        class="bg-[linear-gradient(156.596deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-center [font-family:var(--font-family-Headings)] text-[63px] leading-[50px] text-transparent">
                        <span :style="{ color: spotlightTitleColor }">{{ spotlightTitle }}</span>
                    </h3>
                    <p
                        class="mx-auto mt-8 max-w-[596px] whitespace-pre-wrap text-center text-[16px] leading-[22px] tracking-[-0.36px] text-[#d0d1d4]">
                        {{ spotlightCopy }}
                    </p>
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_-2px_0_2px_rgba(255,255,255,0.2),inset_3px_3px_2px_rgba(255,255,255,0.1)]" />
                </article>
            </div>

            <div class="mt-[72px] w-full h-[260px] sm:h-[420px] lg:h-[520px] xl:h-[844px]">
                <img :src="charityBanner" alt="Charity banner" class="h-full w-full object-fit" />
            </div>
        </div>

        <div class="mx-auto mt-8 w-full max-w-[1512px] px-4 pb-14 sm:mt-10 sm:px-6 sm:pb-20 xl:hidden">
            <div class="mx-auto h-[260px] w-full max-w-[440px] overflow-hidden rounded-[16px] sm:h-[340px]">
                <img :src="boxingFuturesLogo" alt="Boxing Futures" class="h-full w-full object-cover" />
            </div>

            <a :href="differenceButtonLink || undefined"
                class="mx-auto mt-6 flex h-11 w-full max-w-[280px] items-center justify-center rounded-[1498.5px] bg-[linear-gradient(-34.255deg,rgba(255,255,255,0)_28.673%,rgba(255,255,255,0.1)_71.327%),linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%)] px-6 text-center text-[clamp(1rem,2.8vw,1.5rem)] leading-[1.2] text-white shadow-[0_6px_24px_rgba(0,0,0,0.25)] sm:h-12 sm:max-w-[300px]">
                Find Out More
            </a>

            <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                <article
                    class="relative rounded-[16px] border border-white bg-[rgba(34,37,43,0.5)] px-4 py-6 backdrop-blur-[50px] sm:px-6 sm:py-8">
                    <h3
                        class="bg-[linear-gradient(127.601deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-center [font-family:var(--font-family-Headings)] text-[clamp(2rem,6vw,3.9375rem)] leading-[0.8] text-transparent">
                        <span :style="{ color: aboutTitleColor }">{{ aboutTitle }}</span>
                    </h3>
                    <p
                        class="mx-auto mt-4 max-w-[590px] whitespace-pre-wrap text-center text-[clamp(0.95rem,2.8vw,1.25rem)] leading-[1.35] text-[#d0d1d4] sm:mt-6">
                        {{ aboutCopy }}
                    </p>
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_-2px_0_2px_rgba(255,255,255,0.2),inset_3px_3px_2px_rgba(255,255,255,0.1)]" />
                </article>

                <article
                    class="relative rounded-[16px] border border-white bg-[rgba(34,37,43,0.5)] px-4 py-6 backdrop-blur-[50px] sm:px-6 sm:py-8">
                    <h3
                        class="bg-[linear-gradient(156.596deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-center [font-family:var(--font-family-Headings)] text-[clamp(2rem,6vw,3.9375rem)] leading-[0.8] text-transparent">
                        <span :style="{ color: spotlightTitleColor }">{{ spotlightTitle }}</span>
                    </h3>
                    <p
                        class="mx-auto mt-4 max-w-[596px] whitespace-pre-wrap text-center text-[clamp(0.9rem,2.4vw,1rem)] leading-[1.35] tracking-[-0.02em] text-[#d0d1d4] sm:mt-6">
                        {{ spotlightCopy }}
                    </p>
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_-2px_0_2px_rgba(255,255,255,0.2),inset_3px_3px_2px_rgba(255,255,255,0.1)]" />
                </article>
            </div>

            <div class="mt-8 h-[260px] w-full overflow-hidden sm:h-[420px] lg:h-[520px]">
                <img :src="charityBanner" alt="Charity banner" class="h-full w-full object-fit" />
            </div>
        </div>
    </section>
</template>
