<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

const route = useRoute()
const { getTransactionById, bankDetails, formatCurrency } = useProfileDashboard()

const transaction = computed(() => getTransactionById(String(route.params.id || '')))
const copiedField = ref('')

useHead(() => ({
  title: `${transaction.value.referenceId} Payment Details | The Car Crowd`
}))

const copyValue = async (label: string, value: string) => {
  copiedField.value = label

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(value)
  }

  if (typeof window !== 'undefined') {
    window.setTimeout(() => {
      if (copiedField.value === label) {
        copiedField.value = ''
      }
    }, 1400)
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-7 text-center">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-[0_0_42px_rgba(247,198,0,0.14)]">
        <i class="pi pi-building-columns text-xl" aria-hidden="true" />
      </span>
      <h1 class="mt-3 font-poppins text-2xl font-black text-white sm:text-3xl">Bank Transfer Details</h1>
      <p class="mt-2 text-[13px] text-white/55">Please transfer the exact amount to the account below</p>
    </div>

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="space-y-5">
        <section class="rounded-2xl border border-tccGold/20 bg-[#11100d] p-5 text-white shadow-[0_22px_80px_rgba(0,0,0,0.26)]">
          <h2 class="font-poppins text-lg font-black">Investment Summary</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <div class="overflow-hidden rounded-xl border border-white/10 bg-[#0b0a08]">
              <img :src="transaction.image" :alt="transaction.carName" class="h-full min-h-40 w-full object-cover opacity-85">
            </div>

            <div class="space-y-3">
              <div class="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[13px] sm:flex-row sm:items-center sm:justify-between">
                <span class="font-semibold text-white/60">Vehicle</span>
                <strong class="text-white">{{ transaction.vehicle }}</strong>
              </div>
              <div class="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[13px] sm:flex-row sm:items-center sm:justify-between">
                <span class="font-semibold text-white/60">Allocations</span>
                <strong class="text-white">{{ transaction.allocations }} slot</strong>
              </div>
              <div class="flex items-center justify-between rounded-xl border border-tccGold/35 bg-tccGold px-4 py-3.5 text-tccDarkNavy">
                <span class="font-poppins text-[13px] font-black">Total Amount</span>
                <strong class="font-poppins text-xl font-black">{{ formatCurrency(transaction.totalInvestment) }}</strong>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
          <h2 class="font-poppins text-lg font-black">Important Information</h2>
          <div class="mt-4 space-y-3 text-[13px] text-white/72">
            <div class="flex gap-3">
              <i class="pi pi-check mt-1 text-tccGold" aria-hidden="true" />
              <span>Transfer must be from a bank account in <strong class="text-white">your name</strong></span>
            </div>
            <div class="flex gap-3">
              <i class="pi pi-clock mt-1 text-tccGold" aria-hidden="true" />
              <span>Funds will be verified within <strong class="text-white">5 working days</strong></span>
            </div>
            <div class="flex gap-3">
              <i class="pi pi-hashtag mt-1 text-tccGold" aria-hidden="true" />
              <span>Always include reference: <strong class="text-tccGold">{{ transaction.referenceId }}</strong></span>
            </div>
            <div class="flex gap-3">
              <i class="pi pi-exclamation-triangle mt-1 text-tccGold" aria-hidden="true" />
              <span>Allocations not paid within deadline will be released to other investors</span>
            </div>
          </div>
        </section>

        <NuxtLink
          :to="`/profile/transactions/${transaction.id}`"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold"
        >
          <i class="pi pi-arrow-left text-[10px]" aria-hidden="true" />
          Back to Allocation Details
        </NuxtLink>
      </div>

      <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white shadow-[0_22px_80px_rgba(0,0,0,0.26)] lg:self-start">
        <h2 class="font-poppins text-lg font-black">Bank Account Details</h2>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div
            v-for="detail in bankDetails"
            :key="detail.label"
            :class="detail.label === 'Sort Code' || detail.label === 'Account Number' ? 'sm:col-span-1' : 'sm:col-span-2'"
          >
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
                {{ detail.label }}
              </span>
              <span v-if="detail.note" class="text-[10px] font-black text-tccGold">({{ detail.note }})</span>
            </div>
            <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-2.5">
              <strong class="min-w-0 flex-1 break-words font-mono text-[13px] text-white">{{ detail.value }}</strong>
              <button
                type="button"
                class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tccGold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                :aria-label="`Copy ${detail.label}`"
                @click="copyValue(detail.label, detail.value)"
              >
                <i :class="copiedField === detail.label ? 'pi pi-check' : 'pi pi-copy'" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-2xl border border-tccGold/50 bg-tccGold/10 p-4">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-[0.14em] text-white"># Payment Reference</span>
            <span class="text-[10px] font-black text-tccGold">(Required)</span>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-tccGold/40 bg-tccDeepBlack px-4 py-2.5">
            <strong class="min-w-0 flex-1 break-words font-mono text-base text-tccGold">{{ transaction.referenceId }}</strong>
            <button
              type="button"
              class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-tccGold px-3.5 py-2 font-poppins text-[10px] font-black uppercase tracking-[0.12em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
              @click="copyValue('Reference', transaction.referenceId)"
            >
              <i :class="copiedField === 'Reference' ? 'pi pi-check' : 'pi pi-copy'" aria-hidden="true" />
              Copy
            </button>
          </div>
          <p class="mt-3 text-[11px] text-white/55">
            <i class="pi pi-info-circle mr-1 text-tccGold" aria-hidden="true" />
            Use this exact reference number when making your transfer
          </p>
        </div>

        <div class="mt-5">
          <span class="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">Amount to Transfer</span>
          <div class="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-2.5">
            <strong class="min-w-0 flex-1 break-words font-mono text-base text-tccGold">{{ formatCurrency(transaction.totalInvestment) }}</strong>
            <button
              type="button"
              class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tccGold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
              aria-label="Copy amount"
              @click="copyValue('Amount', formatCurrency(transaction.totalInvestment))"
            >
              <i :class="copiedField === 'Amount' ? 'pi pi-check' : 'pi pi-copy'" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
