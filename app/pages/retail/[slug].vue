<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { getRetailCarBySlug, getRelatedRetailCars } = useRetailCars()

const slug = computed(() => String(route.params.slug || ''))
const car = computed(() => getRetailCarBySlug(slug.value))
const relatedCars = computed(() => {
  if (!car.value) {
    return []
  }

  return getRelatedRetailCars(car.value.slug)
})

if (!car.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Retail car not found'
  })
}

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
  <div v-if="car" class="bg-tccDeepBlack text-white">
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

          <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
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
      </div>
    </section>

    <section class="border-t border-white/10 bg-[#080705] py-16 text-white">
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

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
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
  </div>
</template>
