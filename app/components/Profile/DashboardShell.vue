<script setup lang="ts">
import type { ProfileSection } from '~/composables/useProfileDashboard'

defineProps<{
  activeSection: ProfileSection
}>()

const { navItems } = useProfileDashboard()
const { citizen_user, isLoadingLogout, logout } = citizenAuth()

const getProfileDisplayName = (user: any) => {
  const info = user?.user_info || {}
  return [info.first_name, info.middle_name, info.last_name]
    .filter(Boolean)
    .join(' ')
    || user?.username
    || user?.email
    || 'Member'
}

const getProfileInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'TC'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

const profileSummary = computed(() => {
  const user = getCitizenUserData(citizen_user.value)
  const name = getProfileDisplayName(user)

  return {
    name,
    initials: getProfileInitials(name),
    email: user?.email || '',
    completion: 100
  }
})

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <aside class="space-y-5">
        <div class="relative overflow-hidden rounded-2xl border border-tccGold/20 bg-[#0b0a08] p-5 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,198,0,0.18),transparent_18rem)]" />
          <div class="relative z-10 space-y-3.5">
            <div class="mx-auto grid h-16 w-16 place-items-center rounded-full border border-tccGold/50 bg-tccGold/10 text-tccGold shadow-[0_0_34px_rgba(247,198,0,0.14)]">
              <span class="font-poppins text-xl font-black uppercase">{{ profileSummary.initials }}</span>
            </div>
            <div>
              <h1 class="font-poppins text-[15px] font-black text-white">{{ profileSummary.name }}</h1>
              <p class="mt-1 text-[11px] text-white/55">{{ profileSummary.email }}</p>
            </div>
            <div class="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left">
              <div class="flex justify-between text-[9px] font-semibold uppercase tracking-[0.12em] text-white/60">
                <span>Profile Completion</span>
                <span class="text-tccGold">{{ profileSummary.completion }}%</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div class="h-full rounded-full bg-tccGold" :style="{ width: `${profileSummary.completion}%` }" />
              </div>
            </div>
          </div>
        </div>

        <nav class="rounded-2xl border border-white/12 bg-white/[0.06] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <NuxtLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.to"
            class="flex min-h-11 items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 font-poppins text-[13px] font-semibold text-white/76 transition-all hover:bg-white/[0.08] hover:text-tccGold"
            :class="activeSection === item.id ? 'border-tccGold/20 bg-white/[0.11] text-white shadow-[inset_3px_0_0_rgba(247,198,0,0.95)]' : ''"
          >
            <i class="pi text-xs text-tccGold" :class="item.icon" aria-hidden="true" />
            {{ item.label }}
          </NuxtLink>

          <button
            type="button"
            class="mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left font-poppins text-[13px] font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isLoadingLogout"
            @click="handleLogout"
          >
            <i class="pi pi-sign-out text-xs" aria-hidden="true" />
            {{ isLoadingLogout ? 'Logging Out...' : 'Logout' }}
          </button>
        </nav>
      </aside>

      <main class="min-w-0">
        <slot />
      </main>
    </div>
  </section>
</template>
