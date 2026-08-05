<script setup lang="ts">
const summaryCards = Array.from({ length: 4 }, (_, index) => index)
const documentCards = Array.from({ length: 2 }, (_, index) => index)
const infoCards = Array.from({ length: 3 }, (_, index) => index)
</script>

<template>
  <section
    class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
    aria-busy="true"
    aria-label="Loading signed documents"
  >
    <div class="mb-7 text-center">
      <div
        class="mx-auto h-14 w-14 animate-pulse rounded-full border border-tccGold/25 bg-tccGold/10 shadow-[0_0_42px_rgba(247,198,0,0.14)]"
      />
      <div class="mx-auto mt-3 h-8 w-56 animate-pulse rounded-lg bg-white/12" />
      <div class="mx-auto mt-2 h-3 w-64 animate-pulse rounded-full bg-white/10" />
    </div>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <main class="space-y-5">
        <section class="rounded-2xl border border-tccGold/35 bg-tccGold/10 p-5 text-center shadow-[0_22px_80px_rgba(0,0,0,0.28)]">
          <div class="mx-auto h-5 w-48 animate-pulse rounded-lg bg-white/14" />
          <div class="mx-auto mt-3 h-3 w-full max-w-xl animate-pulse rounded-full bg-white/12" />
          <div class="mx-auto mt-2 h-3 w-4/5 max-w-lg animate-pulse rounded-full bg-white/10" />
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 animate-pulse rounded-full bg-tccGold/40" />
            <div class="h-5 w-44 animate-pulse rounded-lg bg-white/12" />
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div
              v-for="card in summaryCards"
              :key="`signed-document-summary-skeleton-${card}`"
              class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3"
            >
              <div class="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
              <div class="mt-2 h-4 w-36 animate-pulse rounded-full bg-white/14" />
            </div>
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 animate-pulse rounded-full bg-tccGold/40" />
            <div class="h-5 w-40 animate-pulse rounded-lg bg-white/12" />
          </div>

          <article
            v-for="card in documentCards"
            :key="`signed-document-card-skeleton-${card}`"
            class="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0a08] text-white shadow-[0_22px_80px_rgba(0,0,0,0.26)]"
          >
            <header class="flex flex-col gap-3 bg-tccDeepBlack px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-3">
                <div class="h-4 w-4 animate-pulse rounded-full bg-tccGold/40" />
                <div class="h-4 w-52 animate-pulse rounded-full bg-white/14" />
                <div class="h-6 w-28 animate-pulse rounded-full bg-white/10" />
              </div>
              <div class="flex flex-wrap gap-2">
                <div class="h-9 w-28 animate-pulse rounded-lg border border-white/10 bg-white/10" />
                <div class="h-9 w-28 animate-pulse rounded-lg border border-tccGold/20 bg-tccGold/10" />
              </div>
            </header>

            <div class="border-b border-white/15 bg-[#2f2f2f] px-3 py-2">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="h-5 w-32 animate-pulse rounded bg-white/12" />
                <div class="h-5 w-24 animate-pulse rounded bg-white/12" />
              </div>
            </div>

            <div class="bg-[#4a4a4a] p-4 sm:p-5">
              <div class="mx-auto min-h-[28rem] max-w-2xl bg-white p-6 shadow-[0_20px_44px_rgba(0,0,0,0.28)] sm:p-8">
                <div class="space-y-4 border-t border-slate-300 pt-8">
                  <div class="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
                  <div class="h-6 w-64 animate-pulse rounded-lg bg-slate-200" />
                  <div class="space-y-3 pt-2">
                    <div class="h-3 w-full animate-pulse rounded-full bg-slate-200" />
                    <div class="h-3 w-11/12 animate-pulse rounded-full bg-slate-200" />
                    <div class="h-3 w-4/5 animate-pulse rounded-full bg-slate-200" />
                  </div>
                  <div class="mt-12 h-24 animate-pulse rounded border border-dashed border-slate-300 bg-slate-100" />
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>

      <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div class="h-10 w-full animate-pulse rounded-full bg-tccGold/70" />

        <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
          <div class="flex items-center gap-3">
            <div class="h-4 w-4 animate-pulse rounded-full bg-tccGold/40" />
            <div class="h-5 w-44 animate-pulse rounded-lg bg-white/12" />
          </div>

          <div class="mt-4 space-y-3">
            <div
              v-for="item in infoCards"
              :key="`signed-document-info-skeleton-${item}`"
              class="flex gap-3 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-4"
            >
              <div class="h-9 w-9 shrink-0 animate-pulse rounded-full bg-tccGold/10" />
              <div class="flex-1 space-y-2">
                <div class="h-3 w-32 animate-pulse rounded-full bg-white/14" />
                <div class="h-2.5 w-full animate-pulse rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        <div class="h-20 animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]" />
        <div class="h-10 w-full animate-pulse rounded-full border border-white/15 bg-white/10" />
      </aside>
    </div>
  </section>
</template>
