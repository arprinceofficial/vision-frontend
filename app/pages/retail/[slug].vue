<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

type CmsRetailSpec = {
  label?: string | number | null
  value?: string | number | null
}

type CmsRetailContentSection = {
  heading?: string | null
  paragraphs?: Array<string | null> | null
  bullets?: Array<string | null> | null
}

type CmsRetailGallery = {
  exterior?: Array<string | null> | null
  interior?: Array<string | null> | null
}

type CmsRetailCar = {
  slug?: string | null
  status?: string | null
  title?: string | null
  name?: string | null
  subtitle?: string | null
  description?: string | null
  price?: string | number | null
  year?: string | number | null
  make?: string | null
  model?: string | null
  mileage?: string | number | null
  engine?: string | null
  transmission?: string | null
  drive?: string | null
  body?: string | null
  exteriorColour?: string | null
  interiorColour?: string | null
  location?: string | null
  vin?: string | null
  heroImage?: string | null
  hero_image?: string | null
  cardImage?: string | null
  card_image?: string | null
  excerpt?: string | null
  highlights?: Array<string | null> | null
  specs?: CmsRetailSpec[] | null
  sections?: CmsRetailContentSection[] | null
  gallery?: CmsRetailGallery | null
}

type CmsRetailCarDetailsResponse = {
  data?: CmsRetailCar | null
}

type CmsRetailCarsResponse = {
  data?: CmsRetailCar[]
}

type RetailSpec = {
  label: string
  value: string
}

type RetailContentSection = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

type RetailCar = {
  slug: string
  status: string
  title: string
  subtitle: string
  price: string
  year: string
  make: string
  model: string
  mileage: string
  engine: string
  transmission: string
  drive: string
  body: string
  exteriorColour: string
  interiorColour: string
  location: string
  vin: string
  heroImage: string
  cardImage: string
  excerpt: string
  highlights: string[]
  specs: RetailSpec[]
  sections: RetailContentSection[]
  gallery: {
    exterior: string[]
    interior: string[]
  }
}

type RetailCarCard = {
  slug: string
  status: string
  title: string
  year: string
  mileage: string
  cardImage: string
  excerpt: string
}

const fallbackCarImage = '/svg/not-found-img.svg'
const detailSkeletonStats = ['w-24', 'w-28', 'w-32', 'w-24']
const detailSkeletonSections = ['w-48', 'w-64', 'w-40']
const detailSkeletonSpecs = ['w-16', 'w-28', 'w-20', 'w-24', 'w-16', 'w-28', 'w-32', 'w-20', 'w-20', 'w-28']
const detailSkeletonHighlights = ['w-11/12', 'w-4/5', 'w-10/12', 'w-3/4']
const gallerySkeletonImages = ['hero', 'side-a', 'tall', 'side-b', 'side-c']
const relatedSkeletonCards = ['w-4/5', 'w-3/4', 'w-5/6']

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
  const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
  return value === undefined ? '' : String(value).trim()
}

const normalizeStringArray = (items: Array<string | null> | null | undefined) => (
  Array.isArray(items)
    ? items.map((item) => getFirstValue(item)).filter(Boolean)
    : []
)

const formatMileage = (mileage: number | string | null | undefined) => {
  const value = getFirstValue(mileage)

  if (!value) return 'Mileage on request'
  if (/mile/i.test(value)) return value

  const numericMileage = Number(value.replace(/,/g, ''))

  if (!Number.isFinite(numericMileage)) return value

  return `${new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(numericMileage)} miles`
}

const normalizeSpecs = (car: CmsRetailCar): RetailSpec[] => {
  const cmsSpecs = Array.isArray(car.specs)
    ? car.specs
      .map((spec) => {
        const label = getFirstValue(spec.label)
        const value = getFirstValue(spec.value)
        return label && value ? { label, value } : null
      })
      .filter((spec): spec is RetailSpec => Boolean(spec))
    : []

  if (cmsSpecs.length) return cmsSpecs

  return [
    { label: 'Year', value: getFirstValue(car.year) },
    { label: 'Engine', value: getFirstValue(car.engine) },
    { label: 'Drive', value: getFirstValue(car.drive) },
    { label: 'Exterior colour', value: getFirstValue(car.exteriorColour) },
    { label: 'Make', value: getFirstValue(car.make) },
    { label: 'Transmission', value: getFirstValue(car.transmission) },
    { label: 'Interior colour', value: getFirstValue(car.interiorColour) },
    { label: 'Model', value: getFirstValue(car.model) },
    { label: 'Body', value: getFirstValue(car.body) },
    { label: 'Odometer', value: formatMileage(car.mileage) },
    { label: 'VIN', value: getFirstValue(car.vin) || 'Available on request' }
  ].filter((spec) => spec.value)
}

const normalizeSections = (car: CmsRetailCar, excerpt: string): RetailContentSection[] => {
  const sections = Array.isArray(car.sections)
    ? car.sections
      .map((section) => {
        const heading = getFirstValue(section.heading)
        const paragraphs = normalizeStringArray(section.paragraphs)
        const bullets = normalizeStringArray(section.bullets)

        if (!heading || (!paragraphs.length && !bullets.length)) return null

        return {
          heading,
          ...(paragraphs.length ? { paragraphs } : {}),
          ...(bullets.length ? { bullets } : {})
        }
      })
      .filter((section): section is RetailContentSection => Boolean(section))
    : []

  return sections.length ? sections : [{ heading: 'Overview', paragraphs: [excerpt] }]
}

const normalizeRetailCar = (car: CmsRetailCar | null | undefined): RetailCar | null => {
  if (!car) return null

  const slugValue = getFirstValue(car.slug)
  const title = getFirstValue(car.title, car.name)

  if (!slugValue || !title) return null

  const cardImage = getFirstValue(car.cardImage, car.card_image, car.heroImage, car.hero_image) || fallbackCarImage
  const heroImage = getFirstValue(car.heroImage, car.hero_image, cardImage) || fallbackCarImage
  const excerpt = getFirstValue(car.excerpt, car.description) || 'Contact The Car Crowd for the full ownership file and inspection details.'
  const exteriorGallery = normalizeStringArray(car.gallery?.exterior)
  const interiorGallery = normalizeStringArray(car.gallery?.interior)

  return {
    slug: slugValue,
    status: getFirstValue(car.status) || 'Open to enquiries',
    title,
    subtitle: getFirstValue(car.subtitle, car.description, car.excerpt) || 'Contact The Car Crowd for the full ownership file and inspection details.',
    price: getFirstValue(car.price) || 'Price on application',
    year: getFirstValue(car.year),
    make: getFirstValue(car.make),
    model: getFirstValue(car.model),
    mileage: formatMileage(car.mileage),
    engine: getFirstValue(car.engine) || 'Engine details on request',
    transmission: getFirstValue(car.transmission) || 'Transmission details on request',
    drive: getFirstValue(car.drive),
    body: getFirstValue(car.body),
    exteriorColour: getFirstValue(car.exteriorColour),
    interiorColour: getFirstValue(car.interiorColour),
    location: getFirstValue(car.location) || 'Location on request',
    vin: getFirstValue(car.vin) || 'Available on request',
    heroImage,
    cardImage,
    excerpt,
    highlights: normalizeStringArray(car.highlights),
    specs: normalizeSpecs(car),
    sections: normalizeSections(car, excerpt),
    gallery: {
      exterior: exteriorGallery.length ? exteriorGallery : [heroImage],
      interior: interiorGallery
    }
  }
}

const normalizeRelatedCar = (car: CmsRetailCar): RetailCarCard | null => {
  const normalizedCar = normalizeRetailCar(car)

  if (!normalizedCar) return null

  return {
    slug: normalizedCar.slug,
    status: normalizedCar.status,
    title: normalizedCar.title,
    year: normalizedCar.year,
    mileage: normalizedCar.mileage,
    cardImage: normalizedCar.cardImage,
    excerpt: normalizedCar.excerpt
  }
}

const {
  data: retailCarData,
  error: retailCarError,
  pending: retailCarPending,
  status: retailCarStatus
} = useAsyncData<CmsRetailCar | null>(
  `cms-retail-car-${slug.value}`,
  async () => {
    const response = await $fetchCMS<CmsRetailCarDetailsResponse>(`v1/cms/retail-cars/${slug.value}`, {
      method: 'POST'
    })

    return response?.data || null
  },
  {
    default: () => null,
    lazy: true
  }
)

const car = computed(() => normalizeRetailCar(retailCarData.value))
const shouldShowRetailCarSkeleton = computed(() => (
  !car.value && (retailCarPending.value || retailCarStatus.value === 'idle' || retailCarStatus.value === 'pending')
))

watchEffect(() => {
  if (shouldShowRetailCarSkeleton.value) return

  if (retailCarError.value) {
    showError(createError({
      statusCode: retailCarError.value.statusCode || 404,
      statusMessage: retailCarError.value.statusMessage || 'Retail car not found'
    }))
    return
  }

  if (retailCarStatus.value === 'success' && !car.value) {
    showError(createError({
      statusCode: 404,
      statusMessage: 'Retail car not found'
    }))
  }
})

const {
  data: relatedRetailCarsData,
  pending: relatedRetailCarsPending,
  status: relatedRetailCarsStatus
} = useAsyncData<CmsRetailCar[]>(
  'cms-retail-cars-related',
  async () => {
    const response = await $fetchCMS<CmsRetailCarsResponse>('v1/cms/retail-cars', {
      method: 'POST'
    })

    return Array.isArray(response?.data) ? response.data : []
  },
  {
    default: () => [],
    lazy: true
  }
)

const relatedCars = computed<RetailCarCard[]>(() => (
  (relatedRetailCarsData.value || [])
    .map(normalizeRelatedCar)
    .filter((relatedCar): relatedCar is RetailCarCard => Boolean(relatedCar))
    .filter((relatedCar) => relatedCar.slug !== car.value?.slug)
    .slice(0, 3)
))

const shouldShowRelatedCarsSkeleton = computed(() => (
  !relatedCars.value.length && (relatedRetailCarsPending.value || relatedRetailCarsStatus.value === 'idle' || relatedRetailCarsStatus.value === 'pending')
))

const enquiryMailTo = computed(() => {
  const subject = encodeURIComponent(`Enquiry: ${car.value?.title || 'Retail car'}`)
  return `mailto:sales@thecarcrowd.com?subject=${subject}`
})

const whatsappUrl = computed(() => {
  const message = encodeURIComponent(`Hello, I would like more information about ${car.value?.title || 'this retail car'}.`)
  return `https://wa.me/440000000000?text=${message}`
})

useHead(() => ({
  title: `${car.value?.title || 'Cars For Sale'} - The Car Crowd`,
  meta: [
    {
      name: 'description',
      content: car.value?.excerpt || 'View The Car Crowd cars for sale detail page.'
    }
  ]
}))
</script>

<template>
  <div class="bg-tccDeepBlack text-white">
    <template v-if="shouldShowRetailCarSkeleton">
      <span class="sr-only">Loading retail car...</span>
      <section class="relative overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white">
        <div class="absolute inset-0">
          <div class="h-full w-full animate-pulse bg-white/10 opacity-55" />
          <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/30 via-tccDeepBlack/70 to-tccDeepBlack" />
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_66%_34%,transparent_0%,rgba(3,3,3,0.38)_34%,rgba(3,3,3,0.96)_100%)]" />
        </div>

        <div class="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
          <NuxtLink
            to="/retail"
            class="inline-flex items-center gap-2 font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-tccGold"
          >
            <i class="pi pi-arrow-left text-[10px]" aria-hidden="true" />
            Back to Retail
          </NuxtLink>

          <div class="mt-10 max-w-5xl">
            <span class="block h-5 w-44 animate-pulse rounded-full bg-tccGold/25" />
            <div class="mt-6 space-y-4">
              <span class="block h-12 w-full max-w-4xl animate-pulse rounded-xl bg-white/10 sm:h-16 lg:h-20" />
              <span class="block h-12 w-4/5 max-w-3xl animate-pulse rounded-xl bg-white/10 sm:h-16 lg:h-20" />
            </div>
            <div class="mt-7 max-w-3xl space-y-3">
              <span class="block h-4 w-full animate-pulse rounded-full bg-white/10" />
              <span class="block h-4 w-10/12 animate-pulse rounded-full bg-white/10" />
            </div>

            <div class="mt-9 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              <div v-for="statWidth in detailSkeletonStats" :key="statWidth" class="border-l border-tccGold/50 pl-4">
                <span class="block h-3 w-16 animate-pulse rounded-full bg-white/10" />
                <strong class="mt-2 block h-4 animate-pulse rounded-full bg-white/10" :class="statWidth" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
        <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(360px,0.42fr)] lg:px-8">
          <article class="min-w-0">
            <div class="restomod-image-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
              <div class="h-[320px] w-full animate-pulse bg-white/10 sm:h-[500px]" />
            </div>

            <div class="mt-10 space-y-8">
              <section v-for="sectionWidth in detailSkeletonSections" :key="sectionWidth">
                <span class="block h-7 animate-pulse rounded-full bg-white/10" :class="sectionWidth" />
                <div class="mt-5 space-y-4">
                  <span class="block h-4 w-full animate-pulse rounded-full bg-white/10" />
                  <span class="block h-4 w-11/12 animate-pulse rounded-full bg-white/10" />
                  <span class="block h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
                </div>
              </section>
            </div>
          </article>

          <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div class="restomod-panel rounded-[1.75rem] p-6">
              <span class="block h-4 w-32 animate-pulse rounded-full bg-tccGold/25" />
              <div class="mt-6 overflow-hidden rounded-[1rem] border border-white/10">
                <div
                  v-for="(specWidth, index) in detailSkeletonSpecs"
                  :key="`${specWidth}-${index}`"
                  class="grid grid-cols-[0.42fr_0.58fr] border-b border-white/10 text-sm last:border-b-0"
                >
                  <span class="bg-white/5 px-4 py-3">
                    <span class="block h-3 w-16 animate-pulse rounded-full bg-white/10" />
                  </span>
                  <strong class="px-4 py-3">
                    <span class="block h-3 animate-pulse rounded-full bg-white/10" :class="specWidth" />
                  </strong>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <span v-for="button in 3" :key="button"
                  class="h-[42px] rounded-full border border-white/15 bg-white/10 animate-pulse" />
              </div>
            </div>

            <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <span class="block h-4 w-32 animate-pulse rounded-full bg-tccGold/25" />
              <div class="mt-6 space-y-4">
                <div
                  v-for="highlightWidth in detailSkeletonHighlights"
                  :key="highlightWidth"
                  class="flex gap-3 border-t border-white/10 pt-4 first:border-t-0 first:pt-0"
                >
                  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-tccGold/35" />
                  <span class="h-4 animate-pulse rounded-full bg-white/10" :class="highlightWidth" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="bg-tccDeepBlack py-16 text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-8">
            <span class="block h-5 w-24 animate-pulse rounded-full bg-tccGold/25" />
            <span class="mt-5 block h-10 w-64 animate-pulse rounded-xl bg-white/10 sm:w-80" />
          </div>

          <div class="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
            <div
              v-for="(image, index) in gallerySkeletonImages"
              :key="image"
              class="restomod-image-card overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5"
              :class="index === 0 ? 'md:col-span-2 md:row-span-2' : index === 2 ? 'md:row-span-2' : ''"
            >
              <div class="h-full w-full animate-pulse bg-white/10" />
            </div>
          </div>

          <div class="mb-8 mt-16">
            <span class="block h-5 w-24 animate-pulse rounded-full bg-tccGold/25" />
            <span class="mt-5 block h-10 w-64 animate-pulse rounded-xl bg-white/10 sm:w-80" />
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              v-for="image in 3"
              :key="image"
              class="restomod-image-card overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5"
            >
              <div class="h-72 w-full animate-pulse bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section class="border-t border-white/10 bg-[#080705] py-16 text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="block h-5 w-36 animate-pulse rounded-full bg-tccGold/25" />
              <span class="mt-5 block h-10 w-64 animate-pulse rounded-xl bg-white/10 sm:w-80" />
            </div>
            <span class="h-4 w-24 animate-pulse rounded-full bg-tccGold/25" />
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article
              v-for="titleWidth in relatedSkeletonCards"
              :key="titleWidth"
              class="restomod-image-card flex h-full animate-pulse flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
            >
              <div class="relative h-52 overflow-hidden bg-tccDeepBlack">
                <div class="h-full w-full bg-white/10" />
                <span class="absolute left-4 top-4 h-[26px] w-32 rounded-full border border-white/20 bg-white/10" />
              </div>
              <div class="flex flex-1 flex-col p-5">
                <span class="h-3 w-28 rounded-full bg-white/10" />
                <span class="mt-4 h-5 rounded-full bg-white/10" :class="titleWidth" />
                <div class="mt-4 space-y-3">
                  <span class="block h-3 w-full rounded-full bg-white/10" />
                  <span class="block h-3 w-10/12 rounded-full bg-white/10" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </template>

    <template v-else-if="car">
    <section class="relative overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white">
      <div class="absolute inset-0">
        <img :src="car.heroImage" :alt="car.title" class="h-full w-full object-cover opacity-55">
        <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/30 via-tccDeepBlack/70 to-tccDeepBlack" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_66%_34%,transparent_0%,rgba(3,3,3,0.38)_34%,rgba(3,3,3,0.96)_100%)]" />
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <NuxtLink
          to="/retail"
          class="inline-flex items-center gap-2 font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-tccGold"
        >
          <i class="pi pi-arrow-left text-[10px]" aria-hidden="true" />
          Back to Retail
        </NuxtLink>

        <div class="mt-10 max-w-5xl">
          <span class="restomod-eyebrow">{{ car.status }}</span>
          <h1 class="mt-6 font-poppins text-4xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
            {{ car.title }}
          </h1>
          <p class="mt-6 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            {{ car.subtitle }}
          </p>

          <div class="mt-9 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            <div class="border-l border-tccGold/50 pl-4">
              <span class="block font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Price</span>
              <strong class="mt-1 block text-sm font-bold text-tccGold sm:text-base">{{ car.price }}</strong>
            </div>
            <div class="border-l border-tccGold/50 pl-4">
              <span class="block font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Mileage</span>
              <strong class="mt-1 block text-sm font-bold text-white sm:text-base">{{ car.mileage }}</strong>
            </div>
            <div class="border-l border-tccGold/50 pl-4">
              <span class="block font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Gearbox</span>
              <strong class="mt-1 block text-sm font-bold text-white sm:text-base">{{ car.transmission }}</strong>
            </div>
            <div class="border-l border-tccGold/50 pl-4">
              <span class="block font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Location</span>
              <strong class="mt-1 block text-sm font-bold text-white sm:text-base">{{ car.location }}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(360px,0.42fr)] lg:px-8">
        <article class="min-w-0">
          <div class="restomod-image-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
            <img :src="car.gallery.exterior[0] || car.cardImage" :alt="car.title" class="h-[320px] w-full object-cover sm:h-[500px]">
          </div>

          <div class="mt-10 space-y-8">
            <section v-for="section in car.sections" :key="section.heading">
              <h2 class="font-poppins text-2xl font-black text-white">{{ section.heading }}</h2>
              <div v-if="section.paragraphs" class="mt-4 space-y-4 text-base leading-relaxed text-white/70">
                <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
              </div>
              <ul v-if="section.bullets" class="mt-4 space-y-2 text-sm leading-relaxed text-white/70 sm:text-base">
                <li v-for="bullet in section.bullets" :key="bullet" class="flex gap-3">
                  <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tccGold" />
                  <span>{{ bullet }}</span>
                </li>
              </ul>
            </section>
          </div>
        </article>

        <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div class="restomod-panel rounded-[1.75rem] p-6">
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Specification</span>
            <div class="mt-6 overflow-hidden rounded-[1rem] border border-white/10">
              <div
                v-for="spec in car.specs"
                :key="spec.label"
                class="grid grid-cols-[0.42fr_0.58fr] border-b border-white/10 text-sm last:border-b-0"
              >
                <span class="bg-white/5 px-4 py-3 text-white/45">{{ spec.label }}</span>
                <strong class="px-4 py-3 font-medium text-white/80">{{ spec.value }}</strong>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <a
                :href="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-tccGold hover:text-tccGold"
              >
                <i class="pi pi-whatsapp text-xs" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                :href="enquiryMailTo"
                class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-4 py-3 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
              >
                <i class="pi pi-envelope text-xs" aria-hidden="true" />
                Enquire
              </a>
              <NuxtLink
                to="/contact"
                class="inline-flex items-center justify-center gap-2 rounded-full border border-tccGold/50 bg-tccGold/10 px-4 py-3 font-poppins text-[10px] font-bold uppercase tracking-[0.16em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy"
              >
                <i class="pi pi-phone text-xs" aria-hidden="true" />
                Book Call
              </NuxtLink>
            </div>
          </div>

          <div v-if="car.highlights.length" class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Key Highlights</span>
            <div class="mt-6 space-y-4">
              <div
                v-for="highlight in car.highlights"
                :key="highlight"
                class="flex gap-3 border-t border-white/10 pt-4 first:border-t-0 first:pt-0"
              >
                <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-tccGold" />
                <p class="text-sm leading-relaxed text-white/70">{{ highlight }}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="bg-tccDeepBlack py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <span class="restomod-eyebrow">Exterior</span>
          <h2 class="mt-5 font-poppins text-3xl font-black leading-tight text-white sm:text-4xl">
            Exterior gallery.
          </h2>
        </div>

        <div class="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          <div
            v-for="(image, index) in car.gallery.exterior"
            :key="`${image}-${index}`"
            class="restomod-image-card overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5"
            :class="index === 0 ? 'md:col-span-2 md:row-span-2' : index === 2 ? 'md:row-span-2' : ''"
          >
            <img :src="image" :alt="`${car.title} exterior ${index + 1}`" class="h-full w-full object-cover">
          </div>
        </div>

        <template v-if="car.gallery.interior.length">
        <div class="mb-8 mt-16">
          <span class="restomod-eyebrow">Interior</span>
          <h2 class="mt-5 font-poppins text-3xl font-black leading-tight text-white sm:text-4xl">
            Interior details.
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            v-for="(image, index) in car.gallery.interior"
            :key="`${image}-${index}`"
            class="restomod-image-card overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5"
          >
            <img :src="image" :alt="`${car.title} interior ${index + 1}`" class="h-72 w-full object-cover">
          </div>
        </div>
        </template>
      </div>
    </section>

    <section v-if="shouldShowRelatedCarsSkeleton || relatedCars.length" class="border-t border-white/10 bg-[#080705] py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="restomod-eyebrow">Related Stock</span>
            <h2 class="mt-5 font-poppins text-3xl font-black leading-tight text-white sm:text-4xl">
              More cars for sale.
            </h2>
          </div>
          <NuxtLink
            to="/retail"
            class="inline-flex items-center gap-2 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccGold hover:text-tccLightGold"
          >
            View All
            <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div v-if="shouldShowRelatedCarsSkeleton" class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article
            v-for="titleWidth in relatedSkeletonCards"
            :key="titleWidth"
            class="restomod-image-card flex h-full animate-pulse flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
          >
            <div class="relative h-52 overflow-hidden bg-tccDeepBlack">
              <div class="h-full w-full bg-white/10" />
              <span class="absolute left-4 top-4 h-[26px] w-32 rounded-full border border-white/20 bg-white/10" />
            </div>
            <div class="flex flex-1 flex-col p-5">
              <span class="h-3 w-28 rounded-full bg-white/10" />
              <span class="mt-4 h-5 rounded-full bg-white/10" :class="titleWidth" />
              <div class="mt-4 space-y-3">
                <span class="block h-3 w-full rounded-full bg-white/10" />
                <span class="block h-3 w-10/12 rounded-full bg-white/10" />
              </div>
            </div>
          </article>
        </div>
        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="relatedCar in relatedCars"
            :key="relatedCar.slug"
            :to="`/retail/${relatedCar.slug}`"
            class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <div class="relative h-52 overflow-hidden bg-tccDeepBlack">
              <img :src="relatedCar.cardImage" :alt="relatedCar.title" class="h-full w-full object-cover opacity-90">
              <span class="absolute left-4 top-4 rounded-full border border-white/20 bg-tccDeepBlack/75 px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                {{ relatedCar.status }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <span class="text-[10px] text-white/40">{{ relatedCar.year }} - {{ relatedCar.mileage }}</span>
              <h3 class="mt-3 font-poppins text-lg font-bold leading-tight text-white transition-colors group-hover:text-tccGold">
                {{ relatedCar.title }}
              </h3>
              <p class="news-card-excerpt mt-3 text-sm leading-relaxed text-white/60">{{ relatedCar.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>
