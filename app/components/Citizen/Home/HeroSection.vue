<script setup lang="ts">
const heroStats = [
  { label: 'Car', value: '#148 / 500' },
  { label: 'Allocations', value: 'Limited' },
  { label: 'Status', value: 'Forming' }
]
</script>

<template>
  <section class="relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden bg-tccDeepBlack text-white">
    <div class="absolute inset-0 z-0">
      <img
        src="/generated/restoration-workshop.png"
        alt="Restomod build workshop"
        class="h-full w-full object-cover opacity-70"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/50 via-tccDeepBlack/40 to-tccDeepBlack" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(0,0,0,0.28)_38%,rgba(0,0,0,0.92)_100%)]" />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl space-y-8">
        <span class="restomod-eyebrow mx-auto">Syndicate - Now Forming</span>

        <h1 class="mx-auto max-w-6xl font-poppins text-5xl font-black leading-[0.88] tracking-normal text-white sm:text-7xl lg:text-8xl">
          Be Part of the
          <span class="block bg-gradient-to-r from-tccLightGold via-tccGold to-[#b17600] bg-clip-text text-transparent">
            Creation of an Icon
          </span>
        </h1>

        <p class="mx-auto max-w-2xl text-base leading-relaxed text-white/70 sm:text-xl">
          Syndicated classic car builds, engineered in the open, owned together, and experienced through the full journey.
        </p>

        <div class="flex flex-col justify-center gap-4 pt-2 sm:flex-row">
          <a
            href="/car-detail"
            class="rounded-full bg-tccGold px-8 py-4 font-poppins text-xs font-bold uppercase tracking-[0.22em] text-tccDarkNavy shadow-xl shadow-tccGold/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-tccLightGold"
          >
            Apply For Allocation
          </a>
          <a
            href="#live-syndicates"
            class="rounded-full border border-white/25 bg-white/10 px-8 py-4 font-poppins text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-tccGold hover:text-tccGold"
          >
            Explore Syndicate
          </a>
        </div>

        <div class="mx-auto grid max-w-xl grid-cols-3 gap-4 pt-8">
          <div v-for="stat in heroStats" :key="stat.label" class="space-y-1">
            <p class="font-poppins text-[10px] uppercase tracking-[0.32em] text-white/40">{{ stat.label }}</p>
            <p class="font-poppins text-sm font-bold text-tccGold sm:text-base">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-4 text-[10px] uppercase tracking-[0.36em] text-white/50 md:flex">
        <span class="h-px w-10 bg-tccGold" />
        Scroll
        <span class="h-px w-10 bg-tccGold" />
      </div>
    </div>
  </section>
</template>
