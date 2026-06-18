<script setup lang="ts">
const syndicates = [
  {
    status: 'Live',
    image: '/frontend/assets/images/AstonMartin.jpg',
    alt: 'Aston Martin Vanquish S',
    meta: '2005 V12 manual',
    title: 'Aston Martin Vanquish S',
    description:
      'A low-mileage V12 flagship with a documented manual conversion, provenance archive, and member allocation window now open.',
    allocations: '100 allocations',
    cagr: '12.50%',
    progress: 64
  },
  {
    status: 'Live',
    image: '/frontend/assets/images/porsche.png',
    alt: 'Porsche 997.1 Turbo',
    meta: '2007 Gen 1 manual',
    title: 'Porsche 997.1 Turbo',
    description:
      'Mezger engine 6-speed coupe, factory standard specification, and rising enthusiast demand across modern classic markets.',
    allocations: '80 allocations',
    cagr: '8.90%',
    progress: 85
  }
]
</script>

<template>
  <section id="live-syndicates" class="border-b border-white/10 bg-[#080705] py-20 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <span class="restomod-eyebrow">Active Opportunities</span>
          <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">
            Live Syndicates.
            <span class="block text-tccGold">Open Allocations.</span>
          </h2>
        </div>
        <p class="max-w-2xl text-sm leading-relaxed text-white/60 lg:justify-self-end">
          Request details, review the build thesis, and reserve allocations in documented classic automotive assets.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article
          v-for="item in syndicates"
          :key="item.title"
          class="restomod-image-card restomod-panel group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1"
        >
          <div class="relative h-72 overflow-hidden bg-tccDeepBlack">
            <span class="absolute left-5 top-5 z-10 rounded-full border border-tccGold/40 bg-tccGold/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">
              {{ item.status }}
            </span>
            <img :src="item.image" :alt="item.alt" class="h-full w-full object-cover opacity-90">
            <div class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-tccDeepBlack to-transparent" />
          </div>

          <div class="flex flex-1 flex-col p-6">
            <span class="font-poppins text-[10px] font-semibold uppercase tracking-[0.24em] text-tccGold">{{ item.meta }}</span>
            <h3 class="mt-2 font-poppins text-2xl font-bold leading-tight text-white">{{ item.title }}</h3>
            <p class="news-card-excerpt mt-4 text-sm leading-relaxed text-white/60">{{ item.description }}</p>

            <div class="my-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              <div class="bg-tccDeepBlack/70 p-4">
                <span class="block font-poppins text-[9px] uppercase tracking-[0.22em] text-white/40">Allocations</span>
                <strong class="mt-1 block text-sm font-semibold text-white">{{ item.allocations }}</strong>
              </div>
              <div class="bg-tccDeepBlack/70 p-4 text-right">
                <span class="block font-poppins text-[9px] uppercase tracking-[0.22em] text-white/40">Forecast</span>
                <strong class="mt-1 block text-sm font-semibold text-tccGold">{{ item.cagr }}</strong>
              </div>
            </div>

            <div class="mb-6">
              <div class="mb-2 flex items-center justify-between text-xs">
                <span class="font-medium text-white/50">Funding Progress</span>
                <span class="font-bold text-tccGold">{{ item.progress }}%</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-white/10">
                <div class="h-1.5 rounded-full bg-tccGold" :style="{ width: `${item.progress}%` }" />
              </div>
            </div>

            <a
              href="/car-detail"
              class="mt-auto block rounded-full bg-tccGold px-5 py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-[0.22em] text-tccDarkNavy transition-colors duration-200 hover:bg-tccLightGold"
            >
              Request Details
            </a>
          </div>
        </article>

        <div class="restomod-panel flex min-h-[520px] flex-col justify-between rounded-[1.75rem] p-8">
          <div>
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Learn the Process</span>
            <h3 class="mt-5 font-poppins text-3xl font-black leading-tight text-white">Want the full picture?</h3>
            <p class="mt-4 text-sm leading-relaxed text-white/60">
              Explore acquisition strategy, engineering standards, legal structure, member voting, and projected return mechanics.
            </p>
          </div>
          <a href="/learn-more" class="mt-8 inline-flex rounded-full border border-white/20 px-6 py-3 font-poppins text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
            Get Briefing
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
