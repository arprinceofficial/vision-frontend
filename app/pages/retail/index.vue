<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Cars For Sale - The Car Crowd',
  meta: [
    {
      name: 'description',
      content:
        'Browse The Car Crowd retail cars for sale and source collector-grade vehicles through our private network.'
    }
  ]
})

const { cars, testimonials, expertiseCards, processSteps } = useRetailCars()
</script>

<template>
  <div class="bg-tccDeepBlack text-white">
    <section class="relative min-h-[620px] overflow-hidden bg-tccDeepBlack text-white">
      <div class="absolute inset-0">
        <img
          src="/frontend/assets/images/porsche.jpeg"
          alt="Collector car on circuit"
          class="h-full w-full object-cover opacity-70"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/45 via-tccDeepBlack/55 to-tccDeepBlack" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_63%_42%,transparent_0%,rgba(3,3,3,0.38)_36%,rgba(3,3,3,0.96)_100%)]" />
      </div>

      <div class="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div class="max-w-4xl">
          <span class="restomod-eyebrow">Retail Collection</span>
          <h1 class="mt-6 font-poppins text-5xl font-black leading-[0.92] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Cars For Sale
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            Investment-grade classics, modern icons, and off-market opportunities curated through The Car Crowd network.
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/retail#cars-for-sale"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
            >
              View Stock
              <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-tccGold hover:text-tccGold"
            >
              Source a Car
              <i class="pi pi-phone text-[10px]" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section id="cars-for-sale" class="border-b border-white/10 bg-[#080705] py-16 text-white sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="restomod-eyebrow">Available Stock</span>
            <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">
              Collector cars ready for private enquiry.
            </h2>
          </div>
          <p class="max-w-md text-sm leading-relaxed text-white/55">
            Each car is presented with a clear ownership file, condition context, and a route to inspection before purchase.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <NuxtLink
            v-for="car in cars"
            :key="car.slug"
            :to="`/retail/${car.slug}`"
            class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/45"
          >
            <div class="relative h-56 overflow-hidden bg-tccDeepBlack">
              <img :src="car.cardImage" :alt="car.title" class="h-full w-full object-cover opacity-90">
              <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tccDeepBlack to-transparent" />
              <span class="absolute left-4 top-4 rounded-full border border-white/20 bg-tccDeepBlack/75 px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                {{ car.status }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.2em] text-tccGold">{{ car.year }} - {{ car.make }}</span>
              <h3 class="mt-3 font-poppins text-lg font-bold leading-tight text-white transition-colors group-hover:text-tccGold">
                {{ car.title }}
              </h3>
              <p class="news-card-excerpt mt-3 text-sm leading-relaxed text-white/60">
                {{ car.excerpt }}
              </p>
              <div class="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                <span class="text-xs text-white/45">{{ car.mileage }}</span>
                <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tccGold/45 text-tccGold transition-all group-hover:bg-tccGold group-hover:text-tccDarkNavy">
                  <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-tccDeepBlack text-white">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
          <img
            src="/frontend/assets/images/first_car_carousel.jpg"
            alt="Private collector car database"
            class="absolute inset-0 h-full w-full object-cover opacity-55"
          >
          <div class="absolute inset-0 bg-gradient-to-r from-tccDeepBlack via-tccDeepBlack/75 to-tccDeepBlack/30" />
          <div class="relative z-10 max-w-3xl px-6 py-14 sm:px-8 lg:px-10">
            <span class="restomod-eyebrow">Private Database</span>
            <h2 class="mt-6 font-poppins text-3xl font-black leading-tight text-white sm:text-5xl">
              Join the TCC sales private database.
            </h2>
            <p class="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
              Add your collectible car to a secure buyer network for private placement, discreet introductions, and quality-controlled sale preparation.
            </p>
            <NuxtLink
              to="/contact"
              class="mt-8 inline-flex items-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
            >
              Add Your Car
              <i class="pi pi-plus text-[10px]" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>

        <div class="relative mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
          <img
            src="/frontend/assets/images/ferrari_berlinetta.png"
            alt="The Car Crowd syndicate event"
            class="absolute inset-0 h-full w-full object-cover opacity-45"
          >
          <div class="absolute inset-0 bg-gradient-to-l from-tccDeepBlack via-tccDeepBlack/80 to-tccDeepBlack/30" />
          <div class="relative z-10 ml-auto max-w-3xl px-6 py-14 text-left sm:px-8 lg:px-10 lg:text-right">
            <span class="restomod-eyebrow lg:ml-auto">Syndicates</span>
            <h2 class="mt-6 font-poppins text-3xl font-black leading-tight text-white sm:text-5xl">
              Join our syndicates.
            </h2>
            <p class="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
              Access curated cars through structured ownership, verified custody, member reporting, and a full provenance-first asset journey.
            </p>
            <NuxtLink
              to="/live-syndicate"
              class="mt-8 inline-flex items-center gap-2 rounded-full border border-tccGold/50 bg-tccGold/10 px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy"
            >
              Learn More
              <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-white/10 bg-[#080705] py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span class="restomod-eyebrow">Client Notes</span>
        <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">
          What others have to say.
        </h2>
        <div class="mt-9 grid grid-cols-1 gap-6 md:grid-cols-3">
          <article
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
          >
            <div class="flex gap-1 text-tccGold" aria-label="Five star review">
              <i v-for="star in 5" :key="star" class="pi pi-star-fill text-xs" aria-hidden="true" />
            </div>
            <p class="mt-5 text-sm leading-relaxed text-white/65">
              "{{ testimonial.quote }}"
            </p>
            <strong class="mt-6 block font-poppins text-base text-white">{{ testimonial.name }} / {{ testimonial.role }}</strong>
          </article>
        </div>

        <div class="mt-12 grid grid-cols-2 gap-3 border-t border-white/10 pt-8 text-center sm:grid-cols-5">
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white/55">Alpha</span>
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white/55">Boxed</span>
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white/55">G&amp;P</span>
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white/55">Octane</span>
          <span class="rounded-full border border-white/10 bg-white/5 px-4 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-white/55">Classic</span>
        </div>
      </div>
    </section>

    <section class="bg-tccDeepBlack py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="restomod-panel rounded-[1.75rem] p-6 sm:p-8 lg:p-10">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span class="restomod-eyebrow">Source With Us</span>
              <h2 class="mt-6 font-poppins text-3xl font-black leading-tight text-white sm:text-5xl">
                Source your car via The Car Crowd.
              </h2>
              <p class="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
                From brief to inspection, we combine collector network access with valuation discipline and condition-led due diligence.
              </p>
              <NuxtLink
                to="/contact"
                class="mt-8 inline-flex items-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
              >
                Get a Call
                <i class="pi pi-phone text-[10px]" aria-hidden="true" />
              </NuxtLink>
            </div>
            <div class="overflow-hidden rounded-[1.5rem] border border-white/10">
              <img src="/frontend/assets/images/AstonMartin.jpg" alt="Sourcing inspection detail" class="h-[320px] w-full object-cover lg:h-[380px]">
            </div>
          </div>
        </div>

        <div class="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <span class="restomod-eyebrow">Expert Curation</span>
            <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">
              Start with the experts in investment-grade vehicles.
            </h2>
          </div>
          <p class="text-sm leading-relaxed text-white/55">
            We help buyers separate attractive presentation from proper provenance, condition, specification, and ownership cost discipline.
          </p>
        </div>

        <div class="mt-9 grid grid-cols-1 gap-6 md:grid-cols-3">
          <article
            v-for="card in expertiseCards"
            :key="card.title"
            class="restomod-image-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
          >
            <div class="h-48 overflow-hidden">
              <img :src="card.image" :alt="card.title" class="h-full w-full object-cover">
            </div>
            <div class="p-6">
              <h3 class="font-poppins text-lg font-bold text-white">{{ card.title }}</h3>
              <p class="mt-3 text-sm leading-relaxed text-white/60">{{ card.text }}</p>
            </div>
          </article>
        </div>

        <div class="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="step in processSteps"
            :key="step.number"
            class="rounded-[1.5rem] border border-white/10 bg-white/5 p-6"
          >
            <span class="font-poppins text-5xl font-black leading-none text-white/10">{{ step.number }}</span>
            <h3 class="mt-5 font-poppins text-lg font-bold text-white">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-white/60">{{ step.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="border-t border-white/10 bg-[#080705] py-16 text-white">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:items-center">
        <div>
          <span class="restomod-eyebrow">Sourced By TCC</span>
          <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">
            Sourced by The Car Crowd.
          </h2>
          <div class="mt-7 space-y-5 text-sm leading-relaxed text-white/65 sm:text-base">
            <p>
              We work from a clear acquisition brief, then use private conversations, specialist inspection, and pricing evidence to identify cars worth pursuing.
            </p>
            <p>
              The target is simple: secure the right car, with the right documentation, at the right cost basis, before the wider market notices.
            </p>
          </div>
          <NuxtLink
            to="/contact"
            class="mt-8 inline-flex items-center gap-2 rounded-full border border-tccGold/50 bg-tccGold/10 px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy"
          >
            Get Started
            <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div class="restomod-image-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
          <img src="/generated/restoration-workshop.png" alt="Collector car sourcing team" class="h-[420px] w-full object-cover lg:h-[560px]">
        </div>
      </div>
    </section>
  </div>
</template>
