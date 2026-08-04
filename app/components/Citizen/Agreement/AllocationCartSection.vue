<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    allocations: number
    allocationCost: number
    supportEmail: string
}

const props = defineProps<{
    agreement: AgreementRecord
}>()

const emit = defineEmits<{
    (event: 'proceed-to-payment'): void
}>()

const formatCurrency = (value: number) => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
}).format(value)

const allocationCount = computed(() => props.agreement.allocations)
const allocationSubtotal = computed(() => allocationCount.value * props.agreement.allocationCost)
const aumFee = computed(() => allocationSubtotal.value * 0.015)
const trustAdminFee = computed(() => allocationSubtotal.value * 0.005)
</script>

<template>
    <div class="space-y-6">
        <div class="flex items-center gap-3">
            <i class="pi pi-shopping-cart text-2xl text-tccGold" aria-hidden="true" />
            <h1 class="font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
                Confirming your allocation and Funds Transfer
            </h1>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:p-6">
                <div class="grid gap-6 md:grid-cols-[18rem_minmax(0,1fr)]">
                    <div class="min-h-56 rounded-xl border border-tccGold/20 bg-tccDeepBlack/70 p-5">
                        <div class="grid h-full place-items-center rounded-lg border border-dashed border-white/15 text-center">
                            <div>
                                <i class="pi pi-car text-4xl text-tccGold" aria-hidden="true" />
                                <p class="mt-3 text-xs font-black uppercase tracking-[0.16em] text-white/45">
                                    Diablo VT Roadster
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 class="font-poppins text-2xl font-black text-white">{{ agreement.vehicle }}</h2>
                        <p class="mt-3 text-sm font-semibold text-white/50">
                            Trust Name: <span class="text-white">LAMDIABVTTI</span>
                        </p>
                        <p class="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                            The Lamborghini Diablo VT Roadster, a rare open-top V12 icon, combines extreme 1990s presence with landmark brand significance. A scarce pre-Audi Lamborghini with growing collector appeal.
                        </p>

                        <div class="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <span class="text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                                    Number of Allocations
                                </span>
                                <strong class="mt-1 block text-base text-white">{{ allocationCount }}</strong>
                            </div>
                            <div>
                                <span class="text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                                    Price per Slot
                                </span>
                                <strong class="mt-1 block text-base text-white">{{ formatCurrency(agreement.allocationCost) }}</strong>
                            </div>
                        </div>

                        <p class="mt-6 text-sm font-semibold leading-relaxed text-white/60">
                            Please confirm the number of allocations included in this syndicate.
                        </p>

                        <div class="mt-5 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-4">
                            <h3 class="font-poppins text-sm font-black text-white">Number of Allocations</h3>
                            <div class="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                                <div class="font-poppins text-2xl font-black text-white">{{ allocationCount }}</div>
                            </div>
                        </div>

                        <div class="mt-5 flex items-center justify-between rounded-xl border border-tccGold/35 bg-tccGold/10 px-4 py-4">
                            <span class="font-poppins text-sm font-black text-white">Allocation Subtotal</span>
                            <strong class="font-poppins text-xl font-black text-tccGold">{{ formatCurrency(allocationSubtotal) }}</strong>
                        </div>
                    </div>
                </div>
            </section>

            <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.24)]">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-list text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-xl font-black text-white">Order Summary</h2>
                    </div>

                    <div class="mt-5 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-4 text-center">
                        <i class="pi pi-car text-3xl text-tccGold" aria-hidden="true" />
                        <h3 class="mt-3 font-poppins text-base font-black text-white">{{ agreement.vehicle }}</h3>
                        <p class="mt-1 text-sm font-semibold text-white/50">{{ allocationCount }} x {{ formatCurrency(agreement.allocationCost) }}</p>
                    </div>

                    <div class="mt-4 space-y-3">
                        <div class="flex items-center justify-between rounded-lg border border-tccGold/25 bg-tccGold/10 px-4 py-3">
                            <span class="font-semibold text-white/75">Allocation</span>
                            <strong class="text-tccGold">{{ formatCurrency(allocationSubtotal) }}</strong>
                        </div>
                        <div class="rounded-lg bg-tccGold px-4 py-4 text-tccDarkNavy">
                            <div class="flex items-center justify-between gap-4">
                                <span class="font-poppins text-sm font-black">Total (Including curation fee)</span>
                                <strong class="font-poppins text-xl font-black">{{ formatCurrency(allocationSubtotal) }}</strong>
                            </div>
                        </div>
                        <div class="rounded-lg border border-tccGold/30 bg-tccGold/10 p-3 text-xs leading-relaxed text-white/65">
                            <i class="pi pi-info-circle mr-2 text-tccGold" aria-hidden="true" />
                            The AUM and Trust Administration fee will be taken by Direct Debit on an annual basis.
                        </div>
                        <div class="flex items-center justify-between rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span class="text-sm text-white/70">AUM Fee <span class="block text-xs text-white/40">1.50% of allocation</span></span>
                            <strong class="text-tccGold">{{ formatCurrency(aumFee) }}</strong>
                        </div>
                        <div class="flex items-center justify-between rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span class="text-sm text-white/70">Trust Admin Fee <span class="block text-xs text-white/40">0.5% of allocation</span></span>
                            <strong class="text-tccGold">{{ formatCurrency(trustAdminFee) }}</strong>
                        </div>
                    </div>

                    <div class="mt-5">
                        <h3 class="font-poppins text-sm font-black text-white">Select Payment Method</h3>
                        <div class="mt-3 flex gap-4 rounded-xl border border-tccGold/45 bg-tccGold/10 p-4">
                            <span class="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-tccGold text-tccDarkNavy">
                                <i class="pi pi-building-columns text-xl" aria-hidden="true" />
                            </span>
                            <div class="min-w-0 flex-1">
                                <h4 class="font-poppins text-sm font-black text-white">Bank Transfer</h4>
                                <p class="mt-1 text-sm leading-relaxed text-white/55">Transfer funds directly from your bank account</p>
                            </div>
                            <i class="pi pi-check-circle mt-1 text-tccGold" aria-hidden="true" />
                        </div>
                    </div>

                    <button
                        type="button"
                        class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        @click="emit('proceed-to-payment')"
                    >
                        <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        Proceed to Payment
                    </button>
                </section>
            </aside>
        </div>
    </div>
</template>
