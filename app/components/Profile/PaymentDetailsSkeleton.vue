<script setup lang="ts">
const summaryRows = Array.from({ length: 2 }, (_, index) => index)
const infoRows = Array.from({ length: 4 }, (_, index) => index)
const bankRows = Array.from({ length: 4 }, (_, index) => index)
</script>

<template>
  <section
    class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    aria-busy="true"
    aria-label="Loading payment details"
  >
    <div class="mb-7 text-center">
      <div
        class="mx-auto h-14 w-14 animate-pulse rounded-full border border-tccGold/25 bg-tccGold/10 shadow-[0_0_42px_rgba(247,198,0,0.14)]"
      />
      <div class="mx-auto mt-3 h-8 w-72 max-w-full animate-pulse rounded-lg bg-white/12" />
      <div class="mx-auto mt-2 h-3 w-80 max-w-full animate-pulse rounded-full bg-white/10" />
    </div>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="space-y-5">
        <section class="rounded-2xl border border-tccGold/20 bg-[#11100d] p-5 text-white shadow-[0_22px_80px_rgba(0,0,0,0.26)]">
          <div class="h-5 w-48 animate-pulse rounded-lg bg-white/12" />

          <div class="mt-5 grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <div class="h-40 animate-pulse rounded-xl border border-white/10 bg-white/10" />

            <div class="space-y-3">
              <div
                v-for="row in summaryRows"
                :key="`payment-summary-row-skeleton-${row}`"
                class="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div class="h-3 w-36 animate-pulse rounded-full bg-white/14" />
              </div>
              <div class="rounded-xl border border-tccGold/35 bg-tccGold px-4 py-3.5">
                <div class="flex items-center justify-between gap-4">
                  <div class="h-3 w-28 animate-pulse rounded-full bg-black/15" />
                  <div class="h-6 w-24 animate-pulse rounded-lg bg-black/15" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
          <div class="h-5 w-48 animate-pulse rounded-lg bg-white/12" />
          <div class="mt-4 space-y-3">
            <div
              v-for="row in infoRows"
              :key="`payment-info-row-skeleton-${row}`"
              class="flex gap-3"
            >
              <div class="mt-1 h-3 w-3 animate-pulse rounded-full bg-tccGold/40" />
              <div class="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </section>

        <div class="h-10 w-full animate-pulse rounded-full border border-white/15 bg-white/10" />
      </div>

      <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white shadow-[0_22px_80px_rgba(0,0,0,0.26)] lg:self-start">
        <div class="h-5 w-52 animate-pulse rounded-lg bg-white/12" />

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div
            v-for="row in bankRows"
            :key="`payment-bank-row-skeleton-${row}`"
            :class="row === 2 || row === 3 ? 'sm:col-span-1' : 'sm:col-span-2'"
          >
            <div class="mb-2 h-2.5 w-28 animate-pulse rounded-full bg-white/10" />
            <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-2.5">
              <div class="h-4 flex-1 animate-pulse rounded-full bg-white/14" />
              <div class="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-tccGold/60" />
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-2xl border border-tccGold/50 bg-tccGold/10 p-4">
          <div class="mb-2 h-2.5 w-40 animate-pulse rounded-full bg-white/12" />
          <div class="flex items-center gap-3 rounded-xl border border-tccGold/40 bg-tccDeepBlack px-4 py-2.5">
            <div class="h-5 flex-1 animate-pulse rounded-full bg-tccGold/25" />
            <div class="h-9 w-20 shrink-0 animate-pulse rounded-lg bg-tccGold/60" />
          </div>
          <div class="mt-3 h-3 w-72 max-w-full animate-pulse rounded-full bg-white/10" />
        </div>

        <div class="mt-5">
          <div class="h-2.5 w-32 animate-pulse rounded-full bg-white/10" />
          <div class="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-2.5">
            <div class="h-5 flex-1 animate-pulse rounded-full bg-tccGold/25" />
            <div class="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-tccGold/60" />
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
