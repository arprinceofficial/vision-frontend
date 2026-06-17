<script setup lang="ts">
const syndicates = [
  {
    status: 'Live Now',
    image: '/frontend/assets/images/AstonMartin.jpg',
    alt: 'Aston Martin Vanquish S',
    meta: '2005 V12 manual',
    title: 'Aston Martin Vanquish S',
    description:
      'An outstanding low-mileage example converted to a 6-speed manual transmission. Fully authenticated with premium service history and a highly documented owner archive.',
    allocations: '100 slots',
    cagr: '12.50%',
    progress: 64
  },
  {
    status: 'Live Now',
    image: '/frontend/assets/images/porsche.png',
    alt: 'Porsche 997.1 Turbo',
    meta: '2007 Gen 1 manual',
    title: 'Porsche 997.1 Turbo',
    description:
      'Vetted Mezger engine 6-speed manual coupe finished in basalt black metallic. Outstanding documentation, factory standard specification, and rising enthusiast desirability.',
    allocations: '80 slots',
    cagr: '8.90%',
    progress: 85
  }
]
</script>

<template>
  <section id="live-syndicates" class="border-b border-tccBorder bg-stone-50 py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex flex-col justify-between sm:flex-row sm:items-end">
        <div>
          <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Currently Open</span>
          <h2 class="mt-1 font-poppins text-3xl font-semibold text-tccNavy sm:text-4xl">Live Syndicates</h2>
        </div>
        <span class="mt-2 text-xs font-medium text-tccMutedGray sm:mt-0">Securing allocations in classic automobile assets</span>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in syndicates"
          :key="item.title"
          class="flex h-full flex-col overflow-hidden rounded-lg border border-tccBorder bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="relative h-60 overflow-hidden bg-gray-100">
            <span class="absolute left-4 top-4 z-10 rounded-full border border-tccGold/40 bg-tccDarkNavy/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-tccGold">
              {{ item.status }}
            </span>
            <img :src="item.image" :alt="item.alt" class="h-full w-full object-cover">
          </div>
          <div class="flex flex-1 flex-col p-6">
            <span class="font-poppins text-[10px] font-semibold uppercase tracking-widest text-tccMutedGray">{{ item.meta }}</span>
            <h3 class="mt-1 font-poppins text-xl font-semibold text-gray-900">{{ item.title }}</h3>
            <div class="mt-3 min-h-[60px]">
              <p class="news-card-excerpt text-xs leading-relaxed text-gray-600">{{ item.description }}</p>
            </div>

            <div class="my-4 grid grid-cols-2 gap-2 rounded-lg border border-tccBorder bg-tccLightBg p-3">
              <div>
                <span class="block font-poppins text-[9px] uppercase tracking-wider text-tccMutedGray">Allocations</span>
                <strong class="text-sm font-semibold text-tccNavy">{{ item.allocations }}</strong>
              </div>
              <div class="text-right">
                <span class="block font-poppins text-[9px] uppercase tracking-wider text-tccMutedGray">Forecast CAGR</span>
                <strong class="text-sm font-semibold text-tccGold">{{ item.cagr }}</strong>
              </div>
            </div>

            <div class="mb-4">
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="font-medium text-gray-500">Funding Progress</span>
                <span class="font-bold text-tccGold">{{ item.progress }}%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-gray-100">
                <div class="h-2 rounded-full bg-tccGold" :style="{ width: `${item.progress}%` }" />
              </div>
            </div>

            <a
              href="/car-detail"
              class="mt-auto block w-full rounded-md bg-tccDarkNavy py-3 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-tccNavy"
            >
              Invest Now
            </a>
          </div>
        </article>

        <div class="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/40 p-8 text-center">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-tccNavy/5 text-tccNavy">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <h3 class="font-poppins text-base font-semibold text-gray-900">Next Raising Commencing Soon</h3>
          <p class="mt-2 max-w-[240px] text-xs leading-relaxed text-gray-500">
            We regularly list new investment opportunities. Register interest to receive early email updates.
          </p>
          <a href="#coming-soon" class="mt-4 font-poppins text-xs font-semibold text-tccGold hover:text-tccLightGold">
            View Upcoming Assets &rarr;
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
