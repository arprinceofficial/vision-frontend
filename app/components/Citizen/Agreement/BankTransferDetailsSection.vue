<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    allocations: number
    allocationCost: number
    reference: string
    supportEmail: string
}

const props = defineProps<{
    agreement: AgreementRecord
}>()

const emit = defineEmits<{
    (event: 'back-to-cart'): void
    (event: 'confirm-payment'): void
}>()

const copiedField = ref('')

const bankDetails = [
    {
        label: 'Account Name',
        value: 'THECARCROWD LIMITED',
        note: 'Please use CAPITAL LETTERS'
    },
    {
        label: 'Bank Name',
        value: 'Revolut'
    },
    {
        label: 'Sort Code',
        value: '23-01-20'
    },
    {
        label: 'Account Number',
        value: '26640209'
    }
]

const formatCurrency = (value: number) => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
}).format(value)

const totalAmount = computed(() => props.agreement.allocations * props.agreement.allocationCost)

const copyValue = async (label: string, value: string) => {
    copiedField.value = label

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(value)
    }

    window.setTimeout(() => {
        if (copiedField.value === label) {
            copiedField.value = ''
        }
    }, 1400)
}
</script>

<template>
    <div class="space-y-6">
        <div class="text-center">
            <span class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-[0_0_36px_rgba(247,198,0,0.12)]">
                <i class="pi pi-building-columns text-2xl" aria-hidden="true" />
            </span>
            <h1 class="mt-4 font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
                Bank Transfer Details
            </h1>
            <p class="mt-2 text-sm text-white/55">
                Please transfer the exact amount to the account below
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div class="space-y-5">
                <section class="rounded-xl border border-tccGold/20 bg-[#11100d] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.24)]">
                    <h2 class="font-poppins text-lg font-black text-white">Investment Summary</h2>
                    <div class="mt-5 grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                        <div class="grid min-h-32 place-items-center rounded-lg border border-dashed border-white/15 bg-tccDeepBlack/70 text-tccGold">
                            <i class="pi pi-car text-4xl" aria-hidden="true" />
                        </div>
                        <div class="space-y-3">
                            <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <span class="font-semibold text-white/60">Vehicle</span>
                                <strong class="text-white">{{ agreement.vehicle }}</strong>
                            </div>
                            <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <span class="font-semibold text-white/60">Allocations</span>
                                <strong class="text-white">{{ agreement.allocations }} slots</strong>
                            </div>
                            <div class="flex items-center justify-between rounded-lg border border-tccGold/35 bg-tccGold px-4 py-4 text-tccDarkNavy">
                                <span class="font-poppins text-sm font-black">Total Amount</span>
                                <strong class="font-poppins text-2xl font-black">{{ formatCurrency(totalAmount) }}</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 class="font-poppins text-lg font-black text-white">Important Information</h2>
                    <div class="mt-4 space-y-3 text-sm text-white/70">
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
                            <span>Always include reference: <strong class="text-tccGold">{{ agreement.reference }}</strong></span>
                        </div>
                        <div class="flex gap-3">
                            <i class="pi pi-exclamation-triangle mt-1 text-tccGold" aria-hidden="true" />
                            <span>Allocations not paid within deadline will be released to other investors</span>
                        </div>
                    </div>
                </section>

                <button
                    type="button"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold"
                    @click="emit('back-to-cart')"
                >
                    <i class="pi pi-arrow-left text-xs" aria-hidden="true" />
                    Back to Cart
                </button>
            </div>

            <div class="space-y-5">
                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.24)]">
                    <h2 class="font-poppins text-xl font-black text-white">Bank Account Details</h2>

                    <div class="mt-5 grid gap-4 sm:grid-cols-2">
                        <div
                            v-for="detail in bankDetails"
                            :key="detail.label"
                            :class="detail.label === 'Sort Code' || detail.label === 'Account Number' ? 'sm:col-span-1' : 'sm:col-span-2'"
                        >
                            <div class="mb-2 flex flex-wrap items-center gap-2">
                                <span class="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
                                    {{ detail.label }}
                                </span>
                                <span v-if="detail.note" class="text-[11px] font-black text-tccGold">({{ detail.note }})</span>
                            </div>
                            <div class="flex items-center gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                                <strong class="min-w-0 flex-1 break-words font-mono text-sm text-white">{{ detail.value }}</strong>
                                <button
                                    type="button"
                                    class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-tccGold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                                    @click="copyValue(detail.label, detail.value)"
                                >
                                    <i :class="copiedField === detail.label ? 'pi pi-check' : 'pi pi-copy'" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 rounded-xl border border-tccGold/50 bg-tccGold/10 p-4">
                        <div class="mb-2 flex flex-wrap items-center gap-2">
                            <span class="text-[11px] font-black uppercase tracking-[0.14em] text-white">
                                # Payment Reference
                            </span>
                            <span class="text-[11px] font-black text-tccGold">(Required)</span>
                        </div>
                        <div class="flex items-center gap-3 rounded-lg border border-tccGold/40 bg-tccDeepBlack px-4 py-3">
                            <strong class="min-w-0 flex-1 break-words font-mono text-lg text-tccGold">{{ agreement.reference }}</strong>
                            <button
                                type="button"
                                class="inline-flex shrink-0 items-center gap-2 rounded-md bg-tccGold px-4 py-2 font-poppins text-xs font-black uppercase tracking-[0.12em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                                @click="copyValue('Reference', agreement.reference)"
                            >
                                <i :class="copiedField === 'Reference' ? 'pi pi-check' : 'pi pi-copy'" aria-hidden="true" />
                                Copy
                            </button>
                        </div>
                        <p class="mt-3 text-xs text-white/55">
                            <i class="pi pi-info-circle mr-1 text-tccGold" aria-hidden="true" />
                            Use this exact reference number when making your transfer
                        </p>
                    </div>

                    <div class="mt-5">
                        <span class="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
                            Amount to Transfer
                        </span>
                        <div class="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <strong class="min-w-0 flex-1 break-words font-mono text-lg text-tccGold">{{ formatCurrency(totalAmount) }}</strong>
                            <button
                                type="button"
                                class="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-tccGold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                                @click="copyValue('Amount', formatCurrency(totalAmount))"
                            >
                                <i :class="copiedField === 'Amount' ? 'pi pi-check' : 'pi pi-copy'" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </section>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <div class="rounded-lg border border-tccGold/40 bg-tccGold/10 px-4 py-3 text-center">
                        <i class="pi pi-clock mr-2 text-tccGold" aria-hidden="true" />
                        <span class="font-poppins text-sm font-black text-white">Payment Pending</span>
                    </div>

                    <h2 class="mt-5 font-poppins text-lg font-black text-white">Next Steps</h2>
                    <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div
                            v-for="(step, index) in ['Copy Details', 'Transfer', 'Use Ref', 'Confirm']"
                            :key="step"
                            class="rounded-lg border border-white/10 bg-tccDeepBlack/70 p-3 text-center"
                        >
                            <span class="mx-auto grid h-8 w-8 place-items-center rounded-full bg-tccGold text-sm font-black text-tccDarkNavy">
                                {{ index + 1 }}
                            </span>
                            <p class="mt-2 text-xs font-black text-white">{{ step }}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        @click="emit('confirm-payment')"
                    >
                        <i class="pi pi-check-circle text-xs" aria-hidden="true" />
                        Confirm
                    </button>

                    <div class="mt-4 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-4 text-sm text-white/60">
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
                </section>
            </div>
        </div>
    </div>
</template>
