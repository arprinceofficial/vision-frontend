<script setup lang="ts">
const moderators = ['VaultAdmin', 'DropCaptain', 'BoxingArchivist']

const quickThreads = [
  'Anyone know which match these gloves were fought in?',
  'Post your favorite signed memorabilia setup',
  'Will this week be boxing or football themed?'
]
</script>

<template>
  <section class="mx-auto w-full max-w-[1512px] px-4 pb-16 pt-8 [font-family:var(--font-family-Body)] sm:px-6 lg:px-[72px] lg:pb-24 lg:pt-10">
    <div class="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      <div class="rounded-[20px] border border-white/10 bg-[#1e2127] p-5 text-[#d0d1d4] shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-7">
        <h3 class="text-[clamp(1.2rem,2.5vw,1.375rem)] font-semibold text-white">Open Threads</h3>
        <div class="mt-5 space-y-3">
          <div v-for="thread in quickThreads" :key="thread" class="rounded-2xl border border-white/10 bg-[#292d36] px-4 py-4">
            <p class="text-[clamp(0.9rem,1.7vw,1rem)] leading-relaxed text-[#d0d1d4]">{{ thread }}</p>
          </div>
        </div>
      </div>

      <aside class="rounded-[20px] border border-white/10 bg-[#1e2127] p-5 text-[#d0d1d4] shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-7">
        <h3 class="text-[clamp(1rem,2vw,1.125rem)] font-semibold uppercase tracking-wide text-[#9ca1ab]">Moderators</h3>
        <ul class="mt-4 space-y-3">
          <li v-for="mod in moderators" :key="mod" class="rounded-full bg-[#2b3039] px-4 py-2 text-sm text-white">
            {{ mod }}
          </li>
        </ul>
        <button type="button" class="mt-6 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
          Message Mods
        </button>
      </aside>
    </div>
  </section>
</template>
