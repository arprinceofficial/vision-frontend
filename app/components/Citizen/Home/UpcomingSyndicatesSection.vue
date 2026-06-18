<script setup lang="ts">
const upcomingSyndicates = [
  {
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    alt: 'Ferrari 328 GTS',
    meta: '1989 V8 targa',
    title: 'Ferrari 328 GTS',
    description:
      'Gate-shifted manual V8 in Rosso Corsa with Classiche certification in progress and a documented low-mileage history.'
  },
  {
    image: '/frontend/assets/images/aston_martin_vanquish.png',
    alt: 'Aston Martin Vanquish',
    meta: '2003 Gen 1 V12',
    title: 'Aston Martin Vanquish',
    description:
      'Early Ian Callum V12 grand tourer with factory specialist service records and preserved leather interior.'
  },
  {
    image: '/frontend/assets/images/porsche.png',
    alt: 'Porsche 997 Turbo',
    meta: '2008 Mezger Coupe',
    title: 'Porsche 997 Turbo',
    description:
      'Carrara White over grey leather with adaptive sports seats, matching engine codes, and strong enthusiast demand.'
  }
]
</script>

<template>
  <section id="coming-soon" class="border-b border-white/10 bg-tccDeepBlack py-20 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span class="restomod-eyebrow">Pipeline</span>
          <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">Upcoming Syndicates</h2>
        </div>
        <p class="max-w-md text-sm leading-relaxed text-white/60">Secure priority access before the next public allocation window opens.</p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in upcomingSyndicates"
          :key="item.title"
          class="restomod-image-card group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
        >
          <div class="relative h-64 overflow-hidden bg-tccDeepBlack">
            <span class="absolute left-5 top-5 z-10 rounded-full border border-tccGold/30 bg-tccDeepBlack/70 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.24em] text-tccGold">
              Coming Soon
            </span>
            <img :src="item.image" :alt="item.alt" class="h-full w-full object-cover opacity-90">
          </div>
          <div class="p-6">
            <span class="font-poppins text-[10px] font-semibold uppercase tracking-[0.24em] text-tccGold">{{ item.meta }}</span>
            <h3 class="mt-2 font-poppins text-2xl font-bold text-white">{{ item.title }}</h3>
            <p class="news-card-excerpt mt-3 text-sm leading-relaxed text-white/60">{{ item.description }}</p>
            <a
              href="/coming-soon-details"
              class="mt-6 block rounded-full bg-tccGold py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.22em] text-tccDarkNavy transition-colors duration-200 hover:bg-tccLightGold"
            >
              Register Interest
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
