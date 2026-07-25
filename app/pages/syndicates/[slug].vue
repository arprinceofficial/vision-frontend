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
  class?: string
}

type TechnicalDatum = {
  icon: string
  label: string
  value: string
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

type SyndicateDetail = {
  slug: string
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
  analysis: string[]
  technicalData: TechnicalDatum[]
  news: NewsCard[]
}

const route = useRoute()

const syndicates: SyndicateDetail[] = [
  {
    slug: 'lamborghini-diablo-vt-roadster',
    status: 'Live Now',
    collection: 'Modern Classics Collection',
    allocationsTotal: 80,
    allocationsRemaining: 17,
    allocationCost: 5000,
    fundingProgress: 79,
    cagr: 'up to 18% CAGR',
    title: 'Diablo VT Roadster Lamborghini',
    shortTitle: 'Diablo VT Roadster',
    heroImage: '/generated/hero-aston-studio.png',
    heroAlt: 'Lamborghini Diablo VT Roadster syndicate hero',
    summary:
      'Built when supercars were still raw, mechanical and unapologetically dramatic. Open-top, V12-powered, all-wheel drive.',
    description: [
      "As Lamborghini's first production open-top V12, the VT Roadster is more than a Diablo without a roof. A 5.7-litre naturally aspirated V12, carbon-fibre targa panel and four-wheel-drive traction place it in the final years before Audi acquisition changed Lamborghini forever.",
      'The collector case is straightforward: limited production, poster-car status, genuine analogue engagement. The market increasingly rewards exactly that combination.',
      'Download the investment pack for full specification, market analysis and syndicate details.'
    ],
    specs: [
      { label: 'Horsepower', value: '485' },
      { label: 'Engine', value: '5.7L V12' },
      { label: 'Year', value: '1997' },
      { label: 'Drive Type', value: 'AWD' },
      { label: 'Mileage', value: '12600' }
    ],
    gallery: [
      {
        src: '/frontend/assets/images/aston_martin_vanquish.png',
        alt: 'Diablo engine bay detail',
        class: 'md:col-span-2 md:h-[420px]'
      },
      {
        src: '/frontend/assets/images/ferrari_328_GS.png',
        alt: 'Collector car detail',
        class: 'md:h-[210px]'
      },
      {
        src: '/frontend/assets/images/porsche.png',
        alt: 'Classic cabin detail',
        class: 'md:h-[210px]'
      },
      {
        src: '/generated/hero-aston-studio.png',
        alt: 'Diablo roadster studio profile',
        class: 'md:col-span-2 md:h-[420px]'
      }
    ],
    analysis: [
      'Not all VT Roadsters are equal. This one was acquired specifically because the specification aligns with everything the data supports.',
      'A rare open-roof V12, complex silver paintwork and red interior place this car in a very small group of collector-grade Diablos.',
      'Acquired at GBP 400,000, the car sits below the current market average for comparable examples. Against a factory demonstrator listed at GBP 499,995, the value position is clear.',
      'High enough to attract buyers who want to drive it, but strong enough to preserve the long-term ownership case.'
    ],
    technicalData: [
      { icon: 'pi pi-cog', label: 'Engine', value: '5.7L V12' },
      { icon: 'pi pi-bolt', label: 'Power', value: '485 bhp' },
      { icon: 'pi pi-compass', label: 'Torque', value: '580 lb/ft' },
      { icon: 'pi pi-sliders-h', label: 'Transmission', value: '5-speed manual' },
      { icon: 'pi pi-users', label: 'Seating', value: '2 seats' },
      { icon: 'pi pi-send', label: 'Drive Type', value: 'AWD' },
      { icon: 'pi pi-gauge', label: 'Mileage', value: '12600 miles' },
      { icon: 'pi pi-calendar', label: 'Year', value: '1997' }
    ],
    news: [
      {
        title: 'Does Silence Suit the Prancing Horse?',
        date: 'May 28, 2026',
        day: '28',
        month: 'May',
        author: 'Aaron Carter',
        image: '/generated/porsche-studio.png',
        excerpt: 'Ferrari first EV has arrived, and the reaction has been fierce. But beneath the controversy lie some details that collectors should watch.'
      },
      {
        title: 'The Diablo Rises',
        date: 'May 26, 2026',
        day: '26',
        month: 'May',
        author: 'Aaron Carter',
        image: '/generated/hero-aston-studio.png',
        excerpt: 'A hand-built 5.7-litre V12, open top, manual, all-wheel drive 90s icon.'
      },
      {
        title: 'Join the Tifosi',
        date: 'Apr 30, 2026',
        day: '30',
        month: 'Apr',
        author: 'Aaron Carter',
        image: '/frontend/assets/images/ferrari_berlinetta.png',
        excerpt: 'Own a slice of the most underrated Ferrari of the analogue age.'
      }
    ]
  }
]

const slug = computed(() => String(route.params.slug || ''))
const syndicate = computed(() => syndicates.find((item) => item.slug === slug.value))

if (!syndicate.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Syndicate not found'
  })
}

const allocationCount = ref(1)

const formatCurrency = (value: number) => `GBP ${value.toLocaleString('en-GB')}`

const totalInvestment = computed(() => {
  if (!syndicate.value) {
    return formatCurrency(0)
  }

  return formatCurrency(allocationCount.value * syndicate.value.allocationCost)
})

const decreaseAllocation = () => {
  allocationCount.value = Math.max(1, allocationCount.value - 1)
}

const increaseAllocation = () => {
  if (!syndicate.value) {
    return
  }

  allocationCount.value = Math.min(syndicate.value.allocationsRemaining, allocationCount.value + 1)
}

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
  <div v-if="syndicate" class="bg-tccDeepBlack font-poppins text-white">
    <section class="border-b border-white/10 bg-[#080705]">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav class="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          <NuxtLink to="/" class="transition-colors hover:text-tccGold">Home</NuxtLink>
          <span>/</span>
          <NuxtLink to="/syndicates" class="transition-colors hover:text-tccGold">Live Syndicates</NuxtLink>
          <span>/</span>
          <span class="text-tccGold">{{ syndicate.shortTitle }}</span>
        </nav>
      </div>
    </section>

    <section class="relative min-h-[420px] overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white sm:min-h-[500px] lg:min-h-[560px]">
      <div class="absolute inset-0">
        <img :src="syndicate.heroImage" :alt="syndicate.heroAlt" class="h-full w-full object-cover opacity-70">
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-tccDeepBlack" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/55" />
      </div>

      <div class="relative z-10 mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:min-h-[500px] sm:px-6 lg:min-h-[560px] lg:px-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-4xl">
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-tccGold">
              {{ syndicate.shortTitle }} - 1997
            </span>
            <h1 class="mt-4 max-w-4xl font-poppins text-[clamp(2.1rem,6vw,4.5rem)] font-black leading-[1.02] text-white">
              {{ syndicate.shortTitle }}<br>Lamborghini
            </h1>
          </div>

          <div class="flex flex-wrap gap-3">
            <span class="rounded-full bg-emerald-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-tccDarkNavy">
              {{ syndicate.status }}
            </span>
            <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">
              {{ syndicate.collection }}
            </span>
            <span class="rounded-full border border-tccGold/40 bg-tccGold/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-tccGold">
              {{ syndicate.allocationsTotal }} allocations
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-10 text-white sm:py-14">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 xl:grid-cols-[minmax(0,1fr)_350px]">
        <main class="min-w-0">
          <article>
            <span class="font-poppins text-[10px] font-black uppercase tracking-[0.28em] text-tccGold">
              {{ syndicate.shortTitle }} - 1997
            </span>
            <h2 class="mt-3 max-w-4xl font-poppins text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-tight text-white">
              {{ syndicate.title }}
            </h2>
            <p class="mt-4 max-w-5xl text-[15px] font-semibold leading-relaxed text-white/85">
              {{ syndicate.summary }}
            </p>
            <div class="mt-4 max-w-5xl space-y-3 text-[13px] leading-relaxed text-white/62 sm:text-sm">
              <p v-for="paragraph in syndicate.description" :key="paragraph">{{ paragraph }}</p>
            </div>

            <div class="mt-6 grid overflow-hidden rounded-md border border-white/12 bg-white/[0.04] sm:grid-cols-5">
              <div
                v-for="spec in syndicate.specs"
                :key="spec.label"
                class="border-b border-white/12 px-3 py-3 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <strong class="block font-poppins text-lg font-black text-white">{{ spec.value }}</strong>
                <span class="mt-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-white/38">{{ spec.label }}</span>
              </div>
            </div>
          </article>

          <section class="mt-10">
            <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span class="font-poppins text-[10px] font-black uppercase tracking-[0.22em] text-tccGold">
                Photography &amp; 3D View
              </span>
              <div class="inline-flex w-max rounded-full border border-white/12 bg-white/5 p-1">
                <button type="button" class="rounded-full bg-tccGold px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-tccDarkNavy">
                  Photos
                </button>
                <button type="button" class="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                  Interactive 3D
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <figure
                v-for="(image, index) in syndicate.gallery"
                :key="image.src"
                class="restomod-image-card group relative h-[240px] overflow-hidden rounded-md border border-white/10 bg-white/5 sm:h-[280px]"
                :class="image.class"
              >
                <img :src="image.src" :alt="image.alt" class="h-full w-full object-cover opacity-90">
                <figcaption
                  v-if="index === 0"
                  class="absolute bottom-4 left-4 rounded-full border border-white/15 bg-tccDeepBlack/80 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/80"
                >
                  {{ syndicate.title }}
                </figcaption>
                <span
                  v-if="index === syndicate.gallery.length - 1"
                  class="absolute bottom-4 right-4 rounded-full border border-white/15 bg-tccDeepBlack/80 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/80"
                >
                  +2 photos
                </span>
              </figure>
            </div>
          </section>
        </main>

        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="overflow-hidden rounded-lg border border-white/12 bg-[#10100e] shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
            <div class="bg-tccDeepBlack px-5 py-4">
              <h2 class="font-poppins text-lg font-black text-white">The Syndicate</h2>
              <p class="mt-1 text-xs text-white/45">{{ syndicate.title }} - {{ syndicate.status }}</p>
            </div>

            <div class="space-y-4 p-5">
              <p class="rounded-md border border-tccGold/25 bg-tccGold/10 p-3 text-xs font-semibold leading-relaxed text-white/80">
                This syndicate offers a total of {{ syndicate.allocationsTotal }} allocations, with each member eligible to hold up to a maximum of 40% ownership.
              </p>

              <div class="grid grid-cols-2 overflow-hidden rounded-md border border-white/12">
                <div class="border-b border-r border-white/12 p-3">
                  <span class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Syndicate Total</span>
                  <strong class="mt-2 block text-lg font-black text-white sm:text-xl">GBP 400000</strong>
                  <span class="mt-1 block text-[11px] text-white/45">Total raise target</span>
                </div>
                <div class="border-b border-white/12 p-3">
                  <span class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Allocation Cost</span>
                  <strong class="mt-2 block text-lg font-black text-white sm:text-xl">{{ formatCurrency(syndicate.allocationCost) }}</strong>
                  <span class="mt-1 block text-[11px] text-white/45">Per allocation</span>
                </div>
                <div class="border-r border-white/12 p-3">
                  <span class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Remaining</span>
                  <strong class="mt-2 block text-lg font-black text-white sm:text-xl">{{ syndicate.allocationsRemaining }}/{{ syndicate.allocationsTotal }}</strong>
                  <span class="mt-1 block text-[11px] text-white/45">Allocations left</span>
                </div>
                <div class="p-3">
                  <span class="block text-[9px] font-black uppercase tracking-[0.22em] text-white/35">Future Returns</span>
                  <strong class="mt-2 block text-lg font-black leading-tight text-tccGold sm:text-xl">{{ syndicate.cagr }}</strong>
                  <span class="mt-1 block text-[11px] text-white/45">Forecasted investment returns are for illustration only</span>
                </div>
              </div>

              <div>
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span class="text-white/55">Funding Progress</span>
                  <span class="font-bold text-tccGold">{{ syndicate.fundingProgress }}% raised</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-white/12">
                  <div class="h-full rounded-full bg-tccGold" :style="{ width: `${syndicate.fundingProgress}%` }" />
                </div>
                <p class="mt-2 text-[11px] text-white/45">63 of 80 allocations sold - closes when fully subscribed</p>
              </div>

              <div>
                <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Number of Allocations</label>
                <div class="mt-3 grid grid-cols-[44px_1fr_44px] overflow-hidden rounded-md border border-white/16 bg-white/[0.04]">
                  <button type="button" class="grid h-12 place-items-center text-white/70 transition-colors hover:bg-white/10 hover:text-tccGold" aria-label="Decrease allocations" @click="decreaseAllocation">
                    <i class="pi pi-minus text-xs" aria-hidden="true" />
                  </button>
                  <div class="grid h-12 place-items-center border-x border-white/16 font-poppins text-2xl font-black text-white">
                    {{ allocationCount }}
                  </div>
                  <button type="button" class="grid h-12 place-items-center text-white/70 transition-colors hover:bg-white/10 hover:text-tccGold" aria-label="Increase allocations" @click="increaseAllocation">
                    <i class="pi pi-plus text-xs" aria-hidden="true" />
                  </button>
                </div>
                <div class="mt-3 flex items-center justify-between text-sm">
                  <span class="text-white/45">Total Investment</span>
                  <strong class="text-tccGold">{{ totalInvestment }}</strong>
                </div>
              </div>

              <button
                type="button"
                class="w-full rounded-full bg-tccGold px-5 py-3.5 text-center font-poppins text-[11px] font-black uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
              >
                Secure My Allocation
              </button>

              <NuxtLink
                to="/contact"
                class="block w-full rounded-full border border-white/16 px-5 py-3 text-center font-poppins text-[11px] font-black uppercase tracking-[0.22em] text-white transition-colors hover:border-tccGold hover:text-tccGold"
              >
                Talk To The Team
              </NuxtLink>

              <details class="rounded-md border border-tccGold/25 bg-tccGold/10 p-4">
                <summary class="cursor-pointer text-xs font-bold text-tccGold">New to syndicates? How does this work?</summary>
                <p class="mt-3 text-xs leading-relaxed text-white/58">
                  Future returns are projective and not guaranteed. Capital at risk. Past performance is not a reliable indicator of future returns.
                </p>
              </details>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#050515] py-12 text-white sm:py-16">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div>
          <h2 class="font-poppins text-xl font-black text-white sm:text-2xl">{{ syndicate.title }} - Full Analysis</h2>
          <p class="mt-2 text-sm text-white/50">Everything you need to make an informed decision</p>

          <div class="mt-8 flex flex-wrap gap-3 border-b border-white/12">
            <button type="button" class="border-b-2 border-tccGold px-1 pb-4 text-[10px] font-black uppercase tracking-[0.22em] text-tccGold">
              This Car
            </button>
            <button type="button" class="px-1 pb-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
              Wider Market &amp; Investment Thesis
            </button>
            <button type="button" class="px-1 pb-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
              Net Returns &amp; What It Means For You
            </button>
          </div>

          <div class="mt-8 max-w-4xl space-y-4 text-sm leading-relaxed text-white/62">
            <p class="font-bold text-white/80">Chassis No. #126642</p>
            <p v-for="paragraph in syndicate.analysis" :key="paragraph">{{ paragraph }}</p>
            <p class="font-bold text-white/85">
              Download the investment pack for full specification, market analysis and syndicate details.
            </p>
          </div>

          <button
            type="button"
            class="mt-8 inline-flex items-center gap-2 rounded-full border border-tccGold/40 bg-tccGold/10 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy"
          >
            <i class="pi pi-download text-xs" aria-hidden="true" />
            Download Summary
          </button>
        </div>

        <aside>
          <h3 class="font-poppins text-xl font-black text-white">Asset Technical Data</h3>
          <div class="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-white/12 bg-white/[0.06] p-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div v-for="item in syndicate.technicalData" :key="`${item.label}-${item.value}`" class="flex items-center gap-3 rounded-md bg-white/[0.04] p-3">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-tccGold">
                <i :class="item.icon" class="text-sm" aria-hidden="true" />
              </span>
              <div>
                <span class="block text-[9px] font-black uppercase tracking-[0.18em] text-white/35">{{ item.label }}</span>
                <strong class="mt-1 block text-sm text-white">{{ item.value }}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#14110d] py-10 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <h2 class="font-poppins text-xl font-black text-white sm:text-2xl">Have Questions Before Investing?</h2>
          <p class="mt-2 max-w-3xl text-sm text-white/60">
            Our expert team is ready to guide you, answer your questions, and help you decide confidently before investing.
          </p>
        </div>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.2em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
        >
          <i class="pi pi-comment text-xs" aria-hidden="true" />
          Talk To The Team
        </NuxtLink>
      </div>
    </section>

    <section class="bg-[#080705] py-12 text-white sm:py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="font-poppins text-[10px] font-black uppercase tracking-[0.28em] text-tccGold">From the Community</span>
            <h2 class="mt-3 font-poppins text-3xl font-black text-white sm:text-4xl">Latest News</h2>
          </div>
          <NuxtLink to="/blog" class="font-poppins text-[11px] font-black uppercase tracking-[0.2em] text-tccGold transition-colors hover:text-tccLightGold">
            View All News
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article
            v-for="post in syndicate.news"
            :key="post.title"
            class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <div class="relative h-44 overflow-hidden bg-tccDeepBlack sm:h-52">
              <img :src="post.image" :alt="post.title" class="h-full w-full object-cover opacity-90">
              <span class="absolute bottom-4 left-4 rounded-full bg-tccDeepBlack/80 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white">Blog</span>
              <div class="absolute bottom-4 right-4 grid h-16 w-14 place-items-center rounded-md bg-tccGold text-center font-poppins text-tccDarkNavy">
                <strong class="block text-xl font-black leading-none">{{ post.day }}</strong>
                <span class="block text-[10px] font-bold">{{ post.month }}</span>
              </div>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <div class="flex flex-wrap gap-4 text-[10px] text-white/42">
                <span>{{ post.date }}</span>
                <span>Comment</span>
              </div>
              <h3 class="mt-3 font-poppins text-xl font-black leading-tight text-white transition-colors group-hover:text-tccGold">
                {{ post.title }}
              </h3>
              <p class="news-card-excerpt mt-4 text-sm leading-relaxed text-white/58">{{ post.excerpt }}</p>
              <div class="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div class="flex min-w-0 items-center gap-3">
                  <img src="/assets/images/user-placeholder.svg" :alt="post.author" class="h-9 w-9 shrink-0 rounded-full border border-white/20">
                  <div class="min-w-0">
                    <span class="block truncate text-xs font-bold text-white/75">{{ post.author }}</span>
                    <span class="block text-[10px] text-white/40">{{ post.date }}</span>
                  </div>
                </div>
                <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-xs font-semibold text-white/65 transition-colors hover:text-tccGold">
                  <span class="grid h-9 w-9 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
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
  </div>
</template>
