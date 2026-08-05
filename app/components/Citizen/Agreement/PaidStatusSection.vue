<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    vehicleImage?: string
    allocations: number
    allocationCost: number
    supportEmail: string
}

const props = defineProps<{
    agreement: AgreementRecord
    reference: string
    totalInvestment: string
}>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
}).format(value)

const totalAmount = computed(() => props.agreement.allocations * props.agreement.allocationCost)
</script>

<template>
    <div class="space-y-6">
        <div class="text-center">
            <span class="mx-auto grid h-16 w-16 place-items-center rounded-full border border-tccGold/45 bg-tccGold text-tccDarkNavy shadow-[0_0_42px_rgba(247,198,0,0.18)]">
                <i class="pi pi-check text-2xl" aria-hidden="true" />
            </span>
            <h1 class="mt-5 font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
                Payment Already Received
            </h1>
            <p class="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                This allocation has already been paid. No further bank transfer or receipt upload is required for this item.
            </p>
        </div>

        <section class="overflow-hidden rounded-xl border border-tccGold/25 bg-[#11100d] shadow-[0_18px_70px_rgba(0,0,0,0.24)]">
            <div class="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div class="relative min-h-72 border-b border-tccGold/20 bg-tccDeepBlack/70 lg:h-full lg:border-b-0 lg:border-r">
                    <img
                        v-if="agreement.vehicleImage"
                        :src="agreement.vehicleImage"
                        :alt="`${agreement.vehicle} image`"
                        class="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                    >
                    <div v-else class="grid h-full min-h-72 place-items-center text-tccGold">
                        <i class="pi pi-car text-5xl" aria-hidden="true" />
                    </div>
                </div>

                <div class="p-5 sm:p-6">
                    <div class="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-tccGold">
                                Paid Allocation
                            </p>
                            <h2 class="mt-2 font-poppins text-2xl font-black text-white">
                                {{ agreement.vehicle }}
                            </h2>
                        </div>
                        <span class="inline-flex items-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-tccGold">
                            <i class="pi pi-verified" aria-hidden="true" />
                            Paid
                        </span>
                    </div>

                    <div class="mt-6 space-y-3">
                        <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <span class="font-semibold text-white/60">Reference</span>
                            <strong class="font-mono text-tccGold">{{ reference || 'Confirmed' }}</strong>
                        </div>
                        <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <span class="font-semibold text-white/60">Allocation</span>
                            <strong class="text-white">{{ agreement.allocations }} slot / {{ totalInvestment }}</strong>
                        </div>
                        <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <span class="font-semibold text-white/60">Payment Method</span>
                            <strong class="text-white">
                                <i class="pi pi-building-columns mr-1 text-tccGold" aria-hidden="true" />
                                Bank Transfer
                            </strong>
                        </div>
                        <div class="flex items-center justify-between rounded-lg border border-tccGold/35 bg-tccGold px-4 py-4 text-tccDarkNavy">
                            <span class="font-poppins text-sm font-black">Paid Amount</span>
                            <strong class="font-poppins text-2xl font-black">{{ formatCurrency(totalAmount) }}</strong>
                        </div>
                    </div>

                    <div class="mt-5 rounded-lg border border-tccGold/30 bg-tccGold/10 p-4 text-sm leading-relaxed text-white/70">
                        <i class="pi pi-info-circle mr-2 text-tccGold" aria-hidden="true" />
                        Your payment is recorded against this allocation. You can review the payment record from your transactions area.
                    </div>

                    <div class="mt-6 flex flex-col gap-3 sm:flex-row justify-normal sm:justify-end">
                        <NuxtLink
                            to="/profile/transactions"
                            class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        >
                            <i class="pi pi-receipt text-xs" aria-hidden="true" />
                            View Transactions
                        </NuxtLink>
                        <!-- <NuxtLink
                            to="/profile/allocations"
                            class="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold"
                        >
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                            My Allocations
                        </NuxtLink> -->
                    </div>
                </div>
            </div>
        </section>

        <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
            <div class="flex gap-3">
                <i class="pi pi-headphones mt-1 text-tccGold" aria-hidden="true" />
                <div>
                    <p>Need Assistance?</p>
                    <a :href="`mailto:${agreement.supportEmail}`" class="font-black text-tccGold hover:text-tccLightGold">
                        {{ agreement.supportEmail }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
