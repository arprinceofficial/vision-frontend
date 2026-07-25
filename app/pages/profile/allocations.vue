<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'My Allocations | The Car Crowd'
})

const { allocations } = useProfileDashboard()

const allocationBadgeClass = (tone: string) => (
  tone === 'success'
    ? 'border-tccGold/40 bg-tccGold/15 text-tccGold'
    : 'border-amber-400/40 bg-amber-400/10 text-amber-200'
)

const verificationClass = (tone: string) => (
  tone === 'success' ? 'text-tccGold' : 'text-amber-200'
)
</script>

<template>
  <ProfileDashboardShell active-section="allocations">
    <section class="space-y-6 rounded-2xl border border-white/12 bg-white/[0.06] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-3 py-1.5 font-poppins text-[10px] font-black uppercase tracking-[0.18em] text-tccGold">
            <i class="pi pi-briefcase text-xs" aria-hidden="true" />
            Portfolio
          </span>
          <h2 class="mt-4 font-poppins text-2xl font-black text-white">My Allocations</h2>
          <p class="mt-1 text-sm text-white/55">Track active holdings, pending payments, or closed syndicates.</p>
        </div>
        <div class="rounded-xl border border-tccGold/25 bg-tccGold/10 px-4 py-3 text-sm font-semibold text-white">
          <i class="pi pi-wallet mr-2 text-tccGold" aria-hidden="true" />
          Total Portfolio Allocation Value:
          <span class="ml-2 text-tccGold">GBP 12,500.00</span>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-white/10">
        <table class="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr class="border-b border-white/10 bg-white/[0.04] font-poppins text-[10px] font-black uppercase tracking-[0.12em] text-white/50">
              <th class="p-4">Asset Detail</th>
              <th class="p-4">Ref Code</th>
              <th class="p-4">Allocation Value</th>
              <th class="p-4">Payment Status</th>
              <th class="p-4">Verification</th>
              <th class="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10 text-sm">
            <tr v-for="allocation in allocations" :key="allocation.code" class="transition-colors hover:bg-white/[0.035]">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <img :src="allocation.image" :alt="allocation.title" class="h-14 w-20 rounded-lg border border-white/10 object-cover">
                  <div>
                    <h3 class="font-poppins text-sm font-black text-white">{{ allocation.title }}</h3>
                    <p class="mt-1 text-xs text-white/50">{{ allocation.slots }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4 font-mono text-tccGold">{{ allocation.code }}</td>
              <td class="p-4 font-semibold text-white">{{ allocation.value }}</td>
              <td class="p-4">
                <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black" :class="allocationBadgeClass(allocation.paymentTone)">
                  <i class="pi pi-circle-fill text-[6px]" aria-hidden="true" />
                  {{ allocation.paymentStatus }}
                </span>
              </td>
              <td class="p-4 text-[11px] font-black uppercase tracking-[0.1em]" :class="verificationClass(allocation.verificationTone)">
                <i class="pi pi-check-circle mr-1" aria-hidden="true" />
                {{ allocation.verification }}
              </td>
              <td class="p-4 text-right">
                <NuxtLink :to="allocation.actionRoute" class="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-poppins text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                  {{ allocation.action }}
                  <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </ProfileDashboardShell>
</template>
