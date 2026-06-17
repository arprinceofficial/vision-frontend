<script setup lang="ts">
const highlights = [
  {
    eyebrow: 'My Holdings',
    value: 'GBP 12,500',
    description: 'View your portfolio and returns',
    to: '/profile'
  },
  {
    eyebrow: 'Live Openings',
    value: '2 Syndicates',
    description: 'Available for fractional investment',
    to: '/#live-syndicates'
  },
  {
    eyebrow: 'Track Record',
    value: '14 Cars Funded',
    description: 'Exits and completed raises',
    to: '/#funded-assets'
  }
]
</script>

<template>
  <section class="border-y border-white/10 bg-tccNavy text-white">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-6 divide-y divide-white/10 text-center md:grid-cols-3 md:divide-x md:divide-y-0 md:text-left">
        <a
          v-for="item in highlights"
          :key="item.eyebrow"
          :href="item.to"
          class="group block rounded-lg py-4 transition-colors duration-200 hover:bg-white/5 md:px-6 md:py-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="block font-poppins text-[10px] font-semibold uppercase tracking-widest text-tccGold">{{ item.eyebrow }}</span>
              <strong class="mt-1 block text-2xl font-semibold text-white">{{ item.value }}</strong>
              <p class="mt-1 text-xs text-gray-300">{{ item.description }}</p>
            </div>
            <span class="text-lg text-tccGold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">
              &nearr;
            </span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
