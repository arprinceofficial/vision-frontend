<script setup lang="ts">
const highlights = [
  {
    eyebrow: 'Curated Assets',
    value: '110',
    description: 'Built, funded, or managed with specialist partners',
    to: '/my-assets'
  },
  {
    eyebrow: 'Registered Members',
    value: '6,000+',
    description: 'Collectors and investors across private syndicates',
    to: '/#live-syndicates'
  },
  {
    eyebrow: 'Annual Return Since 2021',
    value: '12.6%',
    description: 'Illustrative historic platform performance',
    to: '/#funded-assets'
  }
]
</script>

<template>
  <section class="border-y border-white/10 bg-tccDeepBlack text-white">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="font-poppins text-xs font-bold uppercase tracking-[0.26em] text-tccGold">Powered By TheCarCrowd</p>
          <h2 class="mt-2 font-poppins text-3xl font-black leading-tight text-white">Built on member trust.</h2>
        </div>
        <p class="max-w-md text-sm leading-relaxed text-white/60">
          A platform record that supports transparent syndicates, verified members, and documented automotive assets.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 md:grid-cols-3">
        <a
          v-for="item in highlights"
          :key="item.eyebrow"
          :href="item.to"
          class="group block bg-tccDeepBlack/90 p-6 transition-colors duration-300 hover:bg-white/10"
        >
          <span class="block font-poppins text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">{{ item.eyebrow }}</span>
          <strong class="mt-3 block font-poppins text-4xl font-black text-tccGold">{{ item.value }}</strong>
          <p class="mt-2 text-xs leading-relaxed text-white/60">{{ item.description }}</p>
          <span class="mt-5 inline-flex text-lg text-tccGold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true">
            &nearr;
          </span>
        </a>
      </div>
    </div>
  </section>
</template>
