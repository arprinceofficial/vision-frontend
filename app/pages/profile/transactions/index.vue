<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Transaction History | The Car Crowd'
})

const { transactions } = useProfileDashboard()

const transactionSummary = computed(() => ({
  total: transactions.length,
  pending: transactions.filter((transaction) => transaction.paymentStatus === 'Pending').length,
  funded: transactions.filter((transaction) => transaction.paymentStatus === 'Funded').length
}))

const transactionStatusClass = (tone: string) => (
  tone === 'success'
    ? 'border-tccGold/40 bg-tccGold/15 text-tccGold'
    : 'border-amber-400/40 bg-amber-400/10 text-amber-200'
)

const paymentStatusClass = (tone: string) => (
  tone === 'success'
    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
    : 'border-orange-400/45 bg-orange-400/10 text-orange-200'
)
</script>

<template>
  <ProfileDashboardShell active-section="transactions">
    <section class="overflow-hidden rounded-2xl border border-tccGold/20 bg-[#090806] text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
      <div class="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(247,198,0,0.16),transparent_24rem),#0b0a08] p-5 sm:p-7">
        <div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-3 py-1.5 font-poppins text-[10px] font-black uppercase tracking-[0.18em] text-tccGold">
              <i class="pi pi-receipt text-xs" aria-hidden="true" />
              Transaction Details
            </span>
            <h2 class="mt-4 font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
              Transaction History
            </h2>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              Review pending transfers, funded allocations, references, and the next action for each syndicate purchase.
            </p>
          </div>

          <NuxtLink
            to="/my-assets"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-tccGold/40 bg-tccGold px-5 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.16em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
          >
            <i class="pi pi-briefcase text-xs" aria-hidden="true" />
            My Assets
          </NuxtLink>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-white/10 bg-white/[0.05] p-4">
            <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Allocations</span>
            <strong class="mt-2 block font-poppins text-2xl font-black text-white">{{ transactionSummary.total }}</strong>
          </div>
          <div class="rounded-xl border border-orange-400/25 bg-orange-400/10 p-4">
            <span class="text-[10px] font-black uppercase tracking-[0.18em] text-orange-100/60">Pending</span>
            <strong class="mt-2 block font-poppins text-2xl font-black text-orange-100">{{ transactionSummary.pending }}</strong>
          </div>
          <div class="rounded-xl border border-tccGold/30 bg-tccGold/10 p-4">
            <span class="text-[10px] font-black uppercase tracking-[0.18em] text-tccGold/80">Funded</span>
            <strong class="mt-2 block font-poppins text-2xl font-black text-tccGold">{{ transactionSummary.funded }}</strong>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-5">
        <div class="overflow-x-auto rounded-xl border border-white/10">
          <table class="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr class="border-b border-white/10 bg-white/[0.04] font-poppins text-[10px] font-black uppercase tracking-[0.12em] text-white/50">
                <th class="p-4">Allocation Details</th>
                <th class="p-4">Reference ID</th>
                <th class="p-4">Price</th>
                <th class="p-4">Allocation State</th>
                <th class="p-4">Payment Status</th>
                <th class="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/10 text-sm">
              <tr v-for="transaction in transactions" :key="transaction.id" class="align-top transition-colors hover:bg-white/[0.035]">
                <td class="p-4">
                  <div class="flex items-center gap-4">
                    <span class="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-tccDeepBlack">
                      <img :src="transaction.image" :alt="transaction.vehicle" class="h-full w-full object-cover opacity-85">
                    </span>
                    <span class="min-w-0">
                      <strong class="line-clamp-1 block font-poppins text-sm font-black text-white">
                        {{ transaction.allocationDetails }}
                      </strong>
                      <span class="mt-1 block text-xs text-white/50">{{ transaction.collection }}</span>
                    </span>
                  </div>
                </td>
                <td class="p-4">
                  <span class="font-mono text-tccGold">{{ transaction.referenceId }}</span>
                </td>
                <td class="p-4 font-semibold text-white">{{ transaction.price }}</td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black" :class="transactionStatusClass(transaction.allocationTone)">
                    <i class="pi pi-circle-fill text-[6px]" aria-hidden="true" />
                    {{ transaction.allocationState }}
                  </span>
                </td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black" :class="paymentStatusClass(transaction.paymentTone)">
                    <i class="pi" :class="transaction.paymentStatus === 'Funded' ? 'pi-check-circle' : 'pi-clock'" aria-hidden="true" />
                    {{ transaction.paymentStatus }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <NuxtLink
                    :to="`/profile/transactions/${transaction.id}`"
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-poppins text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold"
                  >
                    <i class="pi pi-eye text-xs" aria-hidden="true" />
                    View Details
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </ProfileDashboardShell>
</template>
