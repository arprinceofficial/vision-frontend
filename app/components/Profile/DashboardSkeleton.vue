<script setup lang="ts">
import type { ProfileSection } from '~/composables/useProfileDashboard'

const props = withDefaults(defineProps<{
  activeSection?: ProfileSection
}>(), {
  activeSection: 'profile'
})

const navSkeletonItems: ProfileSection[] = ['profile', 'allocations', 'transactions', 'security']
const navWidths: Record<ProfileSection, string> = {
  profile: 'w-36',
  allocations: 'w-28',
  transactions: 'w-32',
  security: 'w-32'
}

const inputSkeletons = Array.from({ length: 4 }, (_, index) => index)
const allocationRows = Array.from({ length: 2 }, (_, index) => index)
const transactionRows = Array.from({ length: 3 }, (_, index) => index)
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading profile page">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <aside class="space-y-5">
        <div class="relative overflow-hidden rounded-2xl border border-tccGold/20 bg-[#0b0a08] p-5 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,198,0,0.18),transparent_18rem)]" />
          <div class="relative z-10 space-y-3.5">
            <div class="mx-auto h-16 w-16 animate-pulse rounded-full border border-tccGold/35 bg-tccGold/10" />
            <div class="space-y-2">
              <div class="mx-auto h-4 w-32 animate-pulse rounded-full bg-white/12" />
              <div class="mx-auto h-3 w-28 animate-pulse rounded-full bg-white/10" />
            </div>
            <div class="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
              <div class="flex justify-between">
                <div class="h-2.5 w-28 animate-pulse rounded-full bg-white/10" />
                <div class="h-2.5 w-8 animate-pulse rounded-full bg-tccGold/30" />
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div class="h-full w-full animate-pulse rounded-full bg-tccGold/70" />
              </div>
            </div>
          </div>
        </div>

        <nav class="rounded-2xl border border-white/12 bg-white/[0.06] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div
            v-for="item in navSkeletonItems"
            :key="item"
            class="flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5"
            :class="props.activeSection === item ? 'border-tccGold/20 bg-white/[0.11] shadow-[inset_3px_0_0_rgba(247,198,0,0.95)]' : ''"
          >
            <span class="h-3 w-3 animate-pulse rounded-full bg-tccGold/45" />
            <span class="h-3 animate-pulse rounded-full bg-white/14" :class="navWidths[item]" />
          </div>

          <div class="mt-2 flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5">
            <span class="h-3 w-3 animate-pulse rounded-full bg-red-400/35" />
            <span class="h-3 w-16 animate-pulse rounded-full bg-red-400/20" />
          </div>
        </nav>
      </aside>

      <main class="min-w-0">
        <section
          v-if="props.activeSection === 'profile'"
          class="space-y-5 rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6"
        >
          <div class="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-3">
              <div class="h-8 w-40 animate-pulse rounded-full border border-tccGold/20 bg-tccGold/10" />
              <div class="h-7 w-56 animate-pulse rounded-lg bg-white/12" />
              <div class="h-3 w-72 max-w-full animate-pulse rounded-full bg-white/10" />
            </div>
            <div class="h-10 w-28 animate-pulse rounded-full bg-tccGold/70" />
          </div>

          <div class="space-y-5">
            <div class="grid gap-4 md:grid-cols-2">
              <div v-for="field in inputSkeletons" :key="`profile-field-${field}`" class="space-y-2">
                <div class="h-2.5 w-28 animate-pulse rounded-full bg-white/10" />
                <div class="h-11 w-full animate-pulse rounded-xl border border-white/14 bg-white/10" />
              </div>
            </div>

            <div class="space-y-4 border-t border-white/10 pt-5">
              <div class="h-3 w-36 animate-pulse rounded-full bg-tccGold/35" />
              <div class="grid gap-4 md:grid-cols-2">
                <div v-for="field in inputSkeletons" :key="`address-field-${field}`" class="space-y-2">
                  <div class="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
                  <div class="h-11 w-full animate-pulse rounded-xl border border-white/14 bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          v-else-if="props.activeSection === 'security'"
          class="rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6"
        >
          <div class="space-y-3">
            <div class="h-8 w-40 animate-pulse rounded-full border border-tccGold/20 bg-tccGold/10" />
            <div class="h-7 w-52 animate-pulse rounded-lg bg-white/12" />
            <div class="h-3 w-72 max-w-full animate-pulse rounded-full bg-white/10" />
          </div>

          <div class="mt-6 max-w-lg space-y-5">
            <div v-for="field in 3" :key="`security-field-${field}`" class="space-y-2">
              <div class="h-2.5 w-32 animate-pulse rounded-full bg-white/10" />
              <div class="h-11 w-full animate-pulse rounded-xl border border-white/14 bg-white/10" />
            </div>
            <div class="h-11 w-full animate-pulse rounded-full bg-tccGold/70" />
          </div>
        </section>

        <section
          v-else-if="props.activeSection === 'allocations'"
          class="space-y-5 rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-3">
              <div class="h-8 w-32 animate-pulse rounded-full border border-tccGold/20 bg-tccGold/10" />
              <div class="h-7 w-48 animate-pulse rounded-lg bg-white/12" />
              <div class="h-3 w-80 max-w-full animate-pulse rounded-full bg-white/10" />
            </div>
            <div class="h-11 w-full max-w-sm animate-pulse rounded-xl border border-tccGold/20 bg-tccGold/10 sm:w-80" />
          </div>

          <div class="overflow-x-auto rounded-xl border border-white/10">
            <div class="min-w-[800px]">
              <div class="grid grid-cols-[1.7fr_1fr_1fr_1.2fr_1fr_1fr] gap-0 border-b border-white/10 bg-white/[0.04] p-3.5">
                <div v-for="column in 6" :key="`allocation-heading-${column}`" class="h-2.5 w-20 animate-pulse rounded-full bg-white/10" />
              </div>
              <div
                v-for="row in allocationRows"
                :key="`allocation-row-${row}`"
                class="grid grid-cols-[1.7fr_1fr_1fr_1.2fr_1fr_1fr] items-center gap-0 border-b border-white/10 p-3.5 last:border-b-0"
              >
                <div class="flex items-center gap-3">
                  <div class="h-14 w-20 animate-pulse rounded-lg border border-white/10 bg-white/10" />
                  <div class="space-y-2">
                    <div class="h-3 w-36 animate-pulse rounded-full bg-white/12" />
                    <div class="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
                <div class="h-3 w-24 animate-pulse rounded-full bg-tccGold/25" />
                <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div class="h-8 w-32 animate-pulse rounded-full border border-white/10 bg-white/10" />
                <div class="h-3 w-24 animate-pulse rounded-full bg-tccGold/25" />
                <div class="ml-auto h-9 w-24 animate-pulse rounded-full border border-white/10 bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        <section
          v-else
          class="overflow-hidden rounded-2xl border border-tccGold/20 bg-[#090806] text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)]"
        >
          <div class="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(247,198,0,0.16),transparent_24rem),#0b0a08] p-5 sm:p-6">
            <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div class="space-y-3">
                <div class="h-8 w-44 animate-pulse rounded-full border border-tccGold/20 bg-tccGold/10" />
                <div class="h-7 w-56 animate-pulse rounded-lg bg-white/12" />
                <div class="h-3 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
                <div class="h-3 w-4/5 max-w-lg animate-pulse rounded-full bg-white/10" />
              </div>
              <div class="h-10 w-32 animate-pulse rounded-full bg-tccGold/70" />
            </div>

            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div v-for="card in 3" :key="`transaction-summary-${card}`" class="rounded-xl border border-white/10 bg-white/[0.05] p-3.5">
                <div class="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
                <div class="mt-2 h-6 w-12 animate-pulse rounded-lg bg-white/12" />
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="overflow-x-auto rounded-xl border border-white/10">
              <div class="min-w-[900px]">
                <div class="grid grid-cols-[1.7fr_1fr_0.9fr_1fr_1fr_1fr] border-b border-white/10 bg-white/[0.04] p-3.5">
                  <div v-for="column in 6" :key="`transaction-heading-${column}`" class="h-2.5 w-24 animate-pulse rounded-full bg-white/10" />
                </div>
                <div
                  v-for="row in transactionRows"
                  :key="`transaction-row-${row}`"
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
      </main>
    </div>
  </section>
</template>
