<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
  maxWidth?: string
}>()
</script>

<template>
  <section class="flex min-h-[calc(100vh-64px)] items-center justify-center bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full" :class="maxWidth || 'max-w-3xl'">
      <div class="space-y-8 rounded-xl border border-tccBorder bg-white p-6 shadow-sm sm:p-10">
        <div class="space-y-2 text-center">
          <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ eyebrow }}</span>
          <h1 class="font-poppins text-3xl font-semibold text-tccNavy">{{ title }}</h1>
          <p class="mx-auto max-w-lg text-xs text-tccMutedGray">{{ description }}</p>
        </div>

        <slot />
      </div>
    </div>
  </section>
</template>
