<script setup lang="ts">
const summaryCards = Array.from({ length: 3 }, (_, index) => index)
const transactionRows = Array.from({ length: 5 }, (_, index) => index)
</script>

<template>
  <section
    class="overflow-hidden rounded-2xl border border-tccGold/20 bg-[#090806] text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)]"
    aria-busy="true"
    aria-label="Loading transaction history"
  >
    <div
      class="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(247,198,0,0.16),transparent_24rem),#0b0a08] p-5 sm:p-6"
    >
      <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div class="space-y-3">
          <div class="h-8 w-44 animate-pulse rounded-full border border-tccGold/20 bg-tccGold/10" />
          <div class="h-7 w-56 animate-pulse rounded-lg bg-white/12" />
          <div class="h-3 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
          <div class="h-3 w-4/5 max-w-lg animate-pulse rounded-full bg-white/10" />
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <div
          v-for="card in summaryCards"
          :key="`transaction-summary-skeleton-${card}`"
          class="rounded-xl border border-white/10 bg-white/[0.05] p-3.5"
        >
          <div class="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
          <div class="mt-2 h-6 w-12 animate-pulse rounded-lg bg-white/12" />
        </div>
      </div>
    </div>

    <div class="p-4">
      <div class="overflow-x-auto rounded-xl border border-white/10">
        <div class="min-w-[900px]">
          <div
            class="grid grid-cols-[1.7fr_1fr_0.9fr_1fr_1fr_1fr] border-b border-white/10 bg-white/[0.04] p-3.5"
          >
            <div
              v-for="column in 6"
              :key="`transaction-heading-skeleton-${column}`"
              class="h-2.5 w-24 animate-pulse rounded-full bg-white/10"
            />
          </div>
          <div
            v-for="row in transactionRows"
            :key="`transaction-row-skeleton-${row}`"
            class="grid grid-cols-[1.7fr_1fr_0.9fr_1fr_1fr_1fr] items-center border-b border-white/10 p-3.5 last:border-b-0"
          >
            <div class="flex items-center gap-4">
              <div class="h-16 w-24 animate-pulse rounded-lg border border-white/10 bg-white/10" />
              <div class="space-y-2">
                <div class="h-3 w-44 animate-pulse rounded-full bg-white/12" />
                <div class="h-2.5 w-28 animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
            <div class="h-3 w-24 animate-pulse rounded-full bg-tccGold/25" />
            <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
            <div class="h-8 w-28 animate-pulse rounded-full border border-white/10 bg-white/10" />
            <div class="h-8 w-24 animate-pulse rounded-full border border-white/10 bg-white/10" />
            <div class="ml-auto h-9 w-28 animate-pulse rounded-full border border-white/10 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
