<script setup lang="ts">
const purchaseCards = Array.from({ length: 6 }, (_, index) => index)
</script>

<template>
  <div aria-busy="true" aria-label="Loading transaction details">
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="h-4 w-40 animate-pulse rounded-full bg-white/12" />

      <div class="flex flex-col gap-3 sm:flex-row">
        <div class="h-10 w-full animate-pulse rounded-full border border-tccGold/25 bg-tccGold/10 sm:w-48" />
        <div class="h-10 w-full animate-pulse rounded-full bg-tccGold/70 sm:w-40" />
      </div>
    </div>

    <section
      class="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:p-6"
    >
      <div class="grid gap-5 lg:grid-cols-2">
        <article class="rounded-2xl border border-white/10 bg-tccDeepBlack/60 p-5">
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 animate-pulse rounded-full bg-tccGold/40" />
            <div class="h-5 w-48 animate-pulse rounded-lg bg-white/12" />
          </div>

          <div class="mt-5 h-56 w-full animate-pulse rounded-xl border border-white/10 bg-white/10" />

          <div class="mt-4 space-y-4">
            <div class="space-y-2">
              <div class="h-2.5 w-20 animate-pulse rounded-full bg-white/10" />
              <div class="h-4 w-56 animate-pulse rounded-full bg-white/14" />
            </div>
            <div class="space-y-2">
              <div class="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
              <div class="h-3 w-full animate-pulse rounded-full bg-white/10" />
              <div class="h-3 w-11/12 animate-pulse rounded-full bg-white/10" />
              <div class="h-3 w-3/4 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </article>

        <article
          class="rounded-2xl border border-tccGold/20 bg-[radial-gradient(circle_at_top_right,rgba(247,198,0,0.12),transparent_20rem),#0b0a08] p-5"
        >
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 animate-pulse rounded-full bg-tccGold/40" />
            <div class="h-5 w-44 animate-pulse rounded-lg bg-white/12" />
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div
              v-for="card in purchaseCards"
              :key="`purchase-card-skeleton-${card}`"
              class="rounded-xl border border-white/10 bg-white/[0.04] p-3.5"
            >
              <div class="h-2.5 w-28 animate-pulse rounded-full bg-white/10" />
              <div class="mt-2 h-6 w-24 animate-pulse rounded-lg bg-white/12" />
            </div>
          </div>

          <div class="mt-5 rounded-xl border border-tccGold/25 bg-tccGold/10 p-3.5">
            <div class="h-3 w-full animate-pulse rounded-full bg-white/12" />
            <div class="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
