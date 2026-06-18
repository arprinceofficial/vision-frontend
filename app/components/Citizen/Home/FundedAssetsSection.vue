<script setup lang="ts">
const fundedAssets = [
  {
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    alt: 'Ferrari 328 GTS',
    badge: 'Funded Complete',
    title: 'Ferrari 328 GTS',
    cagr: '22.97%',
    value: 'Current Value: GBP 129,123',
    exited: false
  },
  {
    image: '/frontend/assets/images/porsche.png',
    alt: 'Porsche 997 Turbo',
    badge: 'Funded Complete',
    title: 'Porsche 997 Turbo',
    cagr: '7.59%',
    value: 'Current Value: GBP 75,311',
    exited: false
  },
  {
    image: '/frontend/assets/images/AstonMartin.jpg',
    alt: 'Aston Martin Vanquish S',
    badge: 'Funded Complete',
    title: 'Aston Martin Vanquish S',
    cagr: '11.80%',
    value: 'Current Value: GBP 92,000',
    exited: false
  },
  {
    image: '/frontend/assets/images/ferrari_328_GS.png',
    alt: 'Ferrari 355 Berlinetta',
    badge: 'Exited Asset',
    title: 'Ferrari 355 Berlinetta',
    cagr: '18.40%',
    value: 'Exit Value: GBP 142,000',
    exited: true
  }
]
</script>

<template>
  <section id="funded-assets" class="border-b border-white/10 bg-tccDeepBlack py-20 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <span class="restomod-eyebrow">Track Record</span>
          <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">Funded &amp; Exited Assets</h2>
        </div>
        <p class="max-w-2xl text-sm leading-relaxed text-white/60 lg:justify-self-end">
          Historical performance of classic automotive assets successfully completed and managed by The Car Crowd.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="asset in fundedAssets"
          :key="asset.title"
          class="restomod-image-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
        >
          <div class="relative h-52 overflow-hidden bg-tccDeepBlack">
            <div
              class="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full border px-3 py-1 text-[8px] font-bold uppercase tracking-[0.22em]"
              :class="asset.exited ? 'border-tccGold/30 bg-tccGold text-tccDarkNavy' : 'border-emerald-300/30 bg-emerald-400/20 text-emerald-100'"
            >
              {{ asset.badge }}
            </div>
            <img :src="asset.image" :alt="asset.alt" class="h-full w-full object-cover opacity-90">
          </div>
          <div class="p-5">
            <h3 class="font-poppins text-lg font-bold leading-tight text-white">{{ asset.title }}</h3>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-2xl font-black text-tccGold">{{ asset.cagr }}</span>
              <span class="font-poppins text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">CAGR</span>
            </div>
            <p class="mt-1 text-xs text-white/50">{{ asset.value }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
