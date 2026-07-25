<script setup lang="ts">
import type { ProfileSection } from '~/composables/useProfileDashboard'

defineProps<{
  activeSection: ProfileSection
}>()

const { profileSummary, navItems } = useProfileDashboard()
</script>

<template>
  <section class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <aside class="space-y-6">
        <div class="relative overflow-hidden rounded-2xl border border-tccGold/20 bg-[#0b0a08] p-6 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,198,0,0.18),transparent_18rem)]" />
          <div class="relative z-10 space-y-4">
            <div class="mx-auto grid h-20 w-20 place-items-center rounded-full border border-tccGold/50 bg-tccGold/10 text-tccGold">
              <span class="font-poppins text-2xl font-black uppercase">{{ profileSummary.initials }}</span>
            </div>
            <div>
              <h1 class="font-poppins text-base font-black text-white">{{ profileSummary.name }}</h1>
              <p class="mt-1 text-xs text-white/55">{{ profileSummary.email }}</p>
            </div>
            <div class="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
              <div class="flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">
                <span>Profile Completion</span>
                <span class="text-tccGold">{{ profileSummary.completion }}%</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div class="h-full rounded-full bg-tccGold" :style="{ width: `${profileSummary.completion}%` }" />
              </div>
            </div>
          </div>
        </div>

        <nav class="rounded-2xl border border-white/12 bg-white/[0.06] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <NuxtLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.to"
            class="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 font-poppins text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.08] hover:text-tccGold"
            :class="activeSection === item.id ? 'bg-white/[0.11] text-white' : ''"
          >
            <i class="pi text-sm text-tccGold" :class="item.icon" aria-hidden="true" />
            {{ item.label }}
          </NuxtLink>

          <NuxtLink
            to="/login"
            class="mt-2 flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 font-poppins text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <i class="pi pi-sign-out text-sm" aria-hidden="true" />
            Logout
          </NuxtLink>
        </nav>
      </aside>

      <main class="min-w-0">
        <slot />
      </main>
    </div>
  </section>
</template>
