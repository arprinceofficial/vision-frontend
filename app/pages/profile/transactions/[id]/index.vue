<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

const route = useRoute()
const { getTransactionById, formatCurrency } = useProfileDashboard()

const transaction = computed(() => getTransactionById(String(route.params.id || '')))

useHead(() => ({
  title: `${transaction.value.referenceId} Transaction Details | The Car Crowd`
}))

const statusClass = computed(() => (
  transaction.value.paymentStatus === 'Funded'
    ? 'border-tccGold/35 bg-tccGold/15 text-tccGold'
    : 'border-orange-400/35 bg-orange-400/10 text-orange-200'
))
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <NuxtLink to="/profile/transactions" class="inline-flex items-center gap-2 font-poppins text-[10px] font-black uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-tccGold">
        <i class="pi pi-arrow-left text-[10px]" aria-hidden="true" />
        Transaction History
      </NuxtLink>

      <div class="flex flex-col gap-3 sm:flex-row">
        <NuxtLink
          :to="`/profile/transactions/${transaction.id}/signed-documents`"
          class="inline-flex items-center justify-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy"
        >
          <i class="pi pi-file-edit text-[10px]" aria-hidden="true" />
          View Signed Document
        </NuxtLink>
        <NuxtLink
          :to="`/profile/transactions/${transaction.id}/payment-details`"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
        >
          <i class="pi pi-credit-card text-[10px]" aria-hidden="true" />
          Payment Details
        </NuxtLink>
      </div>
    </div>

    <section class="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:p-6">
      <div class="grid gap-5 lg:grid-cols-2">
        <article class="rounded-2xl border border-white/10 bg-tccDeepBlack/60 p-5">
          <div class="flex items-center gap-3">
            <i class="pi pi-car text-tccGold" aria-hidden="true" />
            <h1 class="font-poppins text-lg font-black text-white">Vehicle Information</h1>
          </div>

          <div class="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#0b0a08]">
            <img :src="transaction.image" :alt="transaction.carName" class="h-56 w-full object-cover opacity-90">
          </div>

          <div class="mt-4 space-y-3.5">
            <div>
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Car Name</span>
              <h2 class="mt-1 font-poppins text-base font-black text-white">{{ transaction.carName }}</h2>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Description</span>
              <p class="mt-2 text-[13px] leading-relaxed text-white/72">{{ transaction.description }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-2xl border border-tccGold/20 bg-[radial-gradient(circle_at_top_right,rgba(247,198,0,0.12),transparent_20rem),#0b0a08] p-5">
          <div class="flex items-center gap-3">
            <i class="pi pi-shopping-cart text-tccGold" aria-hidden="true" />
            <h2 class="font-poppins text-lg font-black text-white">Purchase Details</h2>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Number of Allocations</span>
              <strong class="mt-2 inline-flex rounded-lg bg-tccGold/10 px-3 py-1.5 text-[13px] text-tccGold">
                {{ transaction.allocations }} slot
              </strong>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Reference</span>
              <strong class="mt-2 block font-mono text-[13px] text-tccGold">{{ transaction.referenceId }}</strong>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Total Investment</span>
              <strong class="mt-2 block font-poppins text-xl font-black text-tccGold">{{ formatCurrency(transaction.totalInvestment) }}</strong>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Status</span>
              <span class="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black" :class="statusClass">
                <i class="pi" :class="transaction.paymentStatus === 'Funded' ? 'pi-check-circle' : 'pi-clock'" aria-hidden="true" />
                {{ transaction.paymentStatus }}
              </span>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Payment Method</span>
              <strong class="mt-2 inline-flex items-center gap-2 rounded-full bg-tccGold px-3 py-2 text-xs text-tccDarkNavy">
                <i class="pi pi-building-columns text-xs" aria-hidden="true" />
                {{ transaction.paymentMethod }}
              </strong>
            </div>
            <div class="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
              <span class="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Date</span>
              <strong class="mt-2 block text-[13px] text-white">{{ transaction.signedDate }}</strong>
            </div>
          </div>

          <div class="mt-5 rounded-xl border border-tccGold/25 bg-tccGold/10 p-3.5 text-[13px] leading-relaxed text-white/70">
            <i class="pi pi-info-circle mr-2 text-tccGold" aria-hidden="true" />
            {{ transaction.nextAction }}
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
