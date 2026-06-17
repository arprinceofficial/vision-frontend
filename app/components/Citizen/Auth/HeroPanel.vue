<script setup lang="ts">
defineProps<{
  description: string
}>()
</script>

<template>
  <aside class="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-tccDarkNavy p-8 text-white sm:p-12 lg:col-span-5 lg:min-h-[calc(100vh-120px)]">
    <div
      class="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
      style="background-image: url('/frontend/assets/images/AstonMartin.jpg');"
    />
    <div class="absolute inset-0 bg-gradient-to-tr from-tccDarkNavy via-tccDarkNavy/90 to-tccNavy/40" />

    <div class="relative z-10">
      <a href="/" class="inline-flex items-center gap-2 font-poppins text-xs font-semibold uppercase tracking-wider text-tccGold transition-colors duration-200 hover:text-white">
        <i class="pi pi-arrow-left text-[11px]" aria-hidden="true" />
        Back to showroom
      </a>
    </div>

    <div class="relative z-10 my-auto space-y-6 py-12">
      <img src="/svg/TCC-Logo.svg" alt="The Car Crowd" class="h-10 w-auto">
      <div class="space-y-2">
        <h1 class="font-poppins text-3xl font-bold leading-tight">Fractional Classic Car Ownership Portal</h1>
        <p class="text-xs font-light leading-relaxed text-gray-300">{{ description }}</p>
      </div>
    </div>

    <p class="relative z-10 text-[10px] font-light text-gray-400">
      &copy; 2026 The Car Crowd. Security-focused investment platform.
    </p>
  </aside>
</template>
