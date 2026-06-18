<script setup lang="ts">
defineProps<{
  title: string
  message: string
  tone?: 'success' | 'warning' | 'error' | 'info'
}>()

const toneClasses = {
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  error: 'border-red-400/30 bg-red-400/10 text-red-100',
  info: 'border-white/10 bg-white/10 text-white'
}
</script>

<template>
  <div
    class="rounded-2xl border p-4 text-xs leading-relaxed shadow-sm backdrop-blur-md"
    :class="toneClasses[tone || 'info']"
    role="status"
  >
    <p class="font-poppins font-bold uppercase tracking-[0.22em]">{{ title }}</p>
    <p class="mt-1 font-light text-current/80">{{ message }}</p>
  </div>
</template>
