<script setup lang="ts">
defineProps<{
  title: string
  message: string
  tone?: 'success' | 'warning' | 'error' | 'info'
}>()

const toneClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-tccBorder bg-tccLightBg text-tccNavy'
}
</script>

<template>
  <div
    class="rounded-lg border p-4 text-xs leading-relaxed shadow-sm"
    :class="toneClasses[tone || 'info']"
    role="status"
  >
    <p class="font-poppins font-bold uppercase tracking-wider">{{ title }}</p>
    <p class="mt-1 font-light">{{ message }}</p>
  </div>
</template>
