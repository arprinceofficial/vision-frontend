<script setup lang="ts">
definePageMeta({
    layout: false
})

type CarDetailPage = {
    title: string
    eyebrow: string
    description: string
    image: string
    metrics: Array<{
        label: string
        value: string
    }>
    gallery: Array<{
        src: string
        alt: string
    }>
}

const route = useRoute()
const slug = computed(() => String(route.params.slug || 'aston-martin-vanquish-s'))

const defaultCarDetail: CarDetailPage = {
    title: 'Aston Martin Vanquish S',
    eyebrow: 'Live Syndicate',
    description: 'Pure V12 performance with a rare manual conversion, curated for a fractional classic car syndicate.',
    image: '/frontend/assets/images/AstonMartin.jpg',
    metrics: [
        { label: 'Target Raise', value: 'GBP 250,000' },
        { label: 'Slots', value: '100' },
        { label: 'Entry', value: 'GBP 2,500' }
    ],
    gallery: [
        { src: '/frontend/assets/images/aston_martin_vanquish.png', alt: 'Gallery asset' },
        { src: '/frontend/assets/images/ferrari_berlinetta.png', alt: 'Gallery asset' },
        { src: '/frontend/assets/images/porsche.png', alt: 'Gallery asset' },
        { src: '/generated/restoration-workshop.png', alt: 'Workshop' }
    ]
}

const formatSlugTitle = (value: string) => {
    const title = value
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    return title || defaultCarDetail.title
}

const carDetail = computed<CarDetailPage>(() => {
    if (slug.value === 'aston-martin-vanquish-s') return defaultCarDetail

    return {
        ...defaultCarDetail,
        title: formatSlugTitle(slug.value)
    }
})

useHead(() => ({
    title: `${carDetail.value.title} | The Car Crowd`
}))
</script>

<template>
    <div class="restomod-shell flex min-h-screen flex-col text-gray-900">
        <AppHeaderCitizen />

        <main class="flex-grow">
            <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div class="restomod-panel overflow-hidden rounded-[2rem]">
                    <div class="relative h-[380px] bg-tccDeepBlack sm:h-[420px]">
                        <img :src="carDetail.image" :alt="carDetail.title" class="h-full w-full object-cover opacity-70">
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-tccDeepBlack via-transparent to-transparent" />
                        <div class="absolute bottom-0 left-0 min-w-0 p-4 text-white sm:p-10">
                            <span class="restomod-eyebrow">{{ carDetail.eyebrow }}</span>
                            <h1 class="mt-4 font-poppins text-4xl font-black leading-tight sm:text-5xl">
                                {{ carDetail.title }}
                            </h1>
                            <p class="mt-3 max-w-2xl text-sm font-light text-white/75">{{ carDetail.description }}</p>
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

                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div v-for="metric in carDetail.metrics" :key="metric.label"
                                    class="rounded-lg border border-tccBorder bg-stone-50 p-4">
                                    <p class="text-[10px] uppercase tracking-wider text-tccMutedGray">{{ metric.label }}
                                    </p>
                                    <p class="mt-1 font-poppins text-xl font-semibold text-tccNavy">{{ metric.value }}
                                    </p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
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
