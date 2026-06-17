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
  <section id="funded-assets" class="border-b border-tccBorder bg-white py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Proven Track Record</span>
        <h2 class="mt-1 font-poppins text-3xl font-semibold text-tccNavy sm:text-4xl">Funded & Exited Assets</h2>
        <p class="mt-1 max-w-xl text-xs text-tccMutedGray">
          Historical performance of classic automotive assets successfully completed and managed by TCC.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="asset in fundedAssets"
          :key="asset.title"
          class="overflow-hidden rounded-lg border border-tccBorder bg-[#fcfbf9] transition-shadow hover:shadow-md"
        >
          <div class="relative h-44 bg-gray-100">
            <div
              class="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white"
              :class="asset.exited ? 'bg-tccGold text-tccDarkNavy' : 'bg-[#2E7D32]/90'"
            >
              <svg class="h-2 w-2" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path v-if="!asset.exited" d="m2 6 2.4 2.4L10 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path v-else d="M6 1.5 7.2 4l2.8.4-2 2 0.5 2.8L6 7.8 3.5 9.2 4 6.4l-2-2L4.8 4 6 1.5Z" fill="currentColor" />
              </svg>
              {{ asset.badge }}
            </div>
            <img :src="asset.image" :alt="asset.alt" class="h-full w-full object-cover">
          </div>
          <div class="p-4">
            <h3 class="font-poppins text-sm font-semibold text-tccNavy">{{ asset.title }}</h3>
            <div class="mt-1 flex items-baseline gap-1">
              <span class="text-lg font-bold" :class="asset.exited ? 'text-emerald-600' : 'text-tccGold'">{{ asset.cagr }}</span>
              <span class="font-poppins text-[9px] font-semibold uppercase text-tccMutedGray">CAGR</span>
            </div>
            <p class="mt-0.5 text-xs text-gray-500">{{ asset.value }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
