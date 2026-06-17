<script setup lang="ts">
const upcomingSyndicates = [
  {
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    alt: 'Ferrari 328 GTS',
    meta: '1989 V8 targa',
    title: 'Ferrari 328 GTS',
    description:
      'Classic gate-shifted manual V8 finished in Rosso Corsa over Crema leather. Excellent final-year model with low mileage, original tooling kits, and Ferrari Classiche certification in progress.'
  },
  {
    image: '/frontend/assets/images/aston_martin_vanquish.png',
    alt: 'Aston Martin Vanquish',
    meta: '2003 Gen 1 V12',
    title: 'Aston Martin Vanquish',
    description:
      'Early Ian Callum design V12 grand tourer in metallic silver. Fully serviced by factory specialists, featuring updated modern telemetry and pristine interior leather preservation.'
  },
  {
    image: '/frontend/assets/images/porsche.png',
    alt: 'Porsche 997 Turbo',
    meta: '2008 Mezger Coupe',
    title: 'Porsche 997 Turbo (White)',
    description:
      'Stunning Carrara White over grey leather, with desirable factory options including adaptive sports seats. Mechanically pristine with matching engine block codes.'
  }
]
</script>

<template>
  <section id="coming-soon" class="bg-tccDarkNavy py-16 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex flex-col justify-between sm:flex-row sm:items-end">
        <div>
          <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Register Interest</span>
          <h2 class="mt-1 font-poppins text-3xl font-semibold text-white sm:text-4xl">Upcoming Syndicates</h2>
        </div>
        <span class="mt-2 max-w-sm text-xs text-gray-400 sm:mt-0">Secure priority allocation tokens before public release</span>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in upcomingSyndicates"
          :key="item.title"
          class="overflow-hidden rounded-lg border border-white/10 bg-tccDeepBlack transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
        >
          <div class="relative h-56 bg-gray-900">
            <span class="absolute left-4 top-4 z-10 rounded-full border border-tccGold/35 bg-tccNavy px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-tccLightGold">
              Coming Soon
            </span>
            <img :src="item.image" :alt="item.alt" class="h-full w-full object-cover opacity-90">
          </div>
          <div class="p-6">
            <span class="font-poppins text-[10px] font-semibold uppercase tracking-widest text-tccLightGold">{{ item.meta }}</span>
            <h3 class="mt-1 font-poppins text-xl font-semibold text-white">{{ item.title }}</h3>
            <p class="news-card-excerpt mt-3 text-xs leading-relaxed text-gray-400">{{ item.description }}</p>
            <a
              href="/car-detail"
              class="mt-6 block w-full rounded-md bg-tccGold py-3 text-center font-poppins text-xs font-bold uppercase tracking-widest text-tccDarkNavy transition-colors duration-200 hover:bg-tccLightGold"
            >
              Register Interest
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
