<script setup lang="ts">
defineProps<{
  description: string
}>()
</script>

<template>
  <aside class="relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-tccDeepBlack p-8 text-white sm:p-12 lg:col-span-5 lg:min-h-screen">
    <div
      class="absolute inset-0 bg-cover bg-center opacity-70"
      style="background-image: url('/generated/restoration-workshop.png');"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/80 via-tccDeepBlack/60 to-tccDeepBlack" />

    <div class="relative z-10">
      <a href="/showroom" class="inline-flex items-center gap-2 rounded-full border border-tccGold/40 bg-tccGold/10 px-4 py-2 font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-tccGold transition-colors duration-200 hover:text-white">
        <i class="pi pi-arrow-left text-[11px]" aria-hidden="true" />
        Back to showroom
      </a>
    </div>

    <div class="relative z-10 my-auto space-y-6 py-12">
      <img src="/TCC-Logo.jpeg" alt="The Car Crowd" class="h-10 w-auto">
      <div class="space-y-2">
        <span class="restomod-eyebrow">Member Access</span>
        <h1 class="font-poppins text-4xl font-black leading-[0.95] text-white sm:text-5xl">
          Built In The <span class="text-tccGold">Open</span>
        </h1>
        <p class="max-w-sm text-sm font-light leading-relaxed text-white/70">{{ description }}</p>
      </div>
    </div>

    <p class="relative z-10 text-[10px] font-light uppercase tracking-[0.18em] text-white/40">
      &copy; 2026 The Car Crowd. Security-focused investment platform.
    </p>
  </aside>
</template>
