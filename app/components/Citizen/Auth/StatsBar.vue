<script setup lang="ts">
const stats = [
  { value: '40+', label: 'Curated Assets' },
  { value: '6,000+', label: 'Registered Members' },
  { value: '12.6%', label: 'ARR Since 2021' },
  { value: '2020', label: 'First Car Launched' },
  { value: '8', label: 'Live in 8 Countries' },
  { value: 'GBP 2,000', label: 'Low Entry Limit' }
]
</script>

<template>
  <div class="grid grid-cols-2 border-t border-white/10 bg-tccDeepBlack text-center text-white md:grid-cols-3 lg:grid-cols-6">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="space-y-1 border-b border-r border-white/10 p-5 lg:border-b-0"
    >
      <h3 class="font-poppins text-2xl font-bold text-tccGold">{{ stat.value }}</h3>
      <p class="text-[9px] uppercase tracking-[0.18em] text-white/50">{{ stat.label }}</p>
    </div>
  </div>
</template>
