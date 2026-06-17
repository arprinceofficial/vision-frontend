<script setup lang="ts">
const heroStats = [
  { label: 'Allocations', value: '100', highlight: false },
  { label: 'Forecast CAGR', value: '12.5%', highlight: true },
  { label: 'Target Value', value: 'GBP 95k', highlight: false }
]
</script>

<template>
  <section class="relative flex min-h-[480px] items-center overflow-hidden bg-tccDeepBlack text-white sm:min-h-[560px]">
    <div class="absolute inset-0 z-0">
      <img
        src="/frontend/assets/images/AstonMartin.jpg"
        alt="Featured Aston Martin Vanquish"
        class="h-full w-full object-cover opacity-40"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-tccDeepBlack via-tccDeepBlack/80 to-transparent" />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div class="space-y-6 text-left lg:col-span-7">
          <p class="font-poppins text-xs font-bold uppercase tracking-[4px] text-tccGold">Invest in the Iconic</p>
          <h1 class="font-poppins text-4xl font-light italic leading-tight text-white sm:text-5xl lg:text-6xl">
            Aston Martin <span class="block font-semibold not-italic text-tccLightGold">Vanquish S</span>
          </h1>
          <p class="max-w-xl text-sm font-light leading-relaxed text-gray-300 sm:text-base">
            A beautiful manual conversion of the legendary 5.9L V12 British flagship. Acquired with low mileage and complete heritage certification, currently open for syndicate members.
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <a
              href="/car-detail"
              class="rounded-md bg-tccGold px-6 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-all duration-300 hover:bg-tccLightGold"
            >
              View Live Syndicate
            </a>
            <a
              href="#live-syndicates"
              class="rounded-md border border-white/40 px-6 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-white"
            >
              Explore More Assets
            </a>
          </div>
        </div>

        <div class="flex justify-start lg:col-span-5 lg:justify-end">
          <div class="w-full max-w-md rounded-lg border border-tccGold/30 bg-tccDarkNavy/80 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <h3 class="mb-6 border-b border-white/10 pb-2 font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">
              Syndicate Statistics
            </h3>
            <div class="grid grid-cols-3 gap-4">
              <div v-for="stat in heroStats" :key="stat.label">
                <span class="block font-poppins text-[10px] uppercase tracking-wider text-gray-400">{{ stat.label }}</span>
                <strong class="mt-1 block text-lg font-semibold sm:text-xl" :class="stat.highlight ? 'text-tccLightGold' : 'text-white'">
                  {{ stat.value }}
                </strong>
              </div>
            </div>
            <div class="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-400">
              <span>Syndicate holds the asset for 4-5 years</span>
              <svg class="h-4 w-4 text-tccGold" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 7v5l3 2M7 3.8A9 9 0 1 1 3.5 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.5 3.5v4h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
