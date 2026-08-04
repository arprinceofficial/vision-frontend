<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    allocations: number
    allocationCost: number
    supportEmail: string
}

const props = defineProps<{
    agreement: AgreementRecord
    isLoading?: boolean
}>()

const emit = defineEmits<{
    (event: 'back-to-cart'): void
    (event: 'proceed-to-payment'): void
}>()

const isAccepted = ref(false)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
}).format(value)

const totalAmount = computed(() => props.agreement.allocations * props.agreement.allocationCost)

const terms = [
    'I confirm that I have reviewed and agree to the Subscription Agreement and Terms and Conditions that I signed earlier.',
    'I confirm that all information provided is accurate and that I am legally authorised to secure this allocation.',
    `I commit to paying the total amount of ${formatCurrency(totalAmount.value)} via bank transfer.`,
    'I understand that payment must be completed within the specified timeframe to secure my allocation(s).',
    'I acknowledge that annual management fees (AUM Fee and Trust Administration Fee) will be charged via Direct Debit as outlined in the agreement.',
    'I understand that failure to complete payment or KYC verification may result in the cancellation of my allocation.',
    'I confirm that all information provided is accurate and that I am legally authorised to make this investment.'
]
</script>

<template>
    <div class="space-y-6">
        <div class="fixed right-4 top-4 z-50 hidden rounded-lg border-l-4 border-tccGold bg-[#11100d] px-5 py-4 text-sm text-white shadow-2xl lg:block">
            <div class="flex items-center gap-3">
                <span class="grid h-8 w-8 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
                    <i class="pi pi-check" aria-hidden="true" />
                </span>
                <div>
                    <p class="text-xs font-black uppercase tracking-[0.12em] text-tccGold">Success</p>
                    <p>Cart submitted successfully!</p>
                </div>
            </div>
        </div>

        <div class="text-center">
            <span class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-[0_0_36px_rgba(247,198,0,0.12)]">
                <i class="pi pi-file-check text-2xl" aria-hidden="true" />
            </span>
            <h1 class="mt-4 font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
                Payment Agreement
            </h1>
            <p class="mt-2 text-sm text-white/55">
                Please review and confirm your investment details
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div class="space-y-5">
                <section class="rounded-xl border border-tccGold/20 bg-[#11100d] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.24)]">
                    <h2 class="font-poppins text-lg font-black text-white">Investment Summary</h2>
                    <div class="mt-5 grid gap-4 md:grid-cols-[11rem_minmax(0,1fr)]">
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
                            <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <span class="font-semibold text-white/60">Payment Method</span>
                                <strong class="text-white">
                                    <i class="pi pi-building-columns mr-1 text-tccGold" aria-hidden="true" />
                                    Bank Transfer
                                </strong>
                            </div>
                            <div class="flex items-center justify-between rounded-lg border border-tccGold/35 bg-tccGold px-4 py-4 text-tccDarkNavy">
                                <span class="font-poppins text-sm font-black">Total Amount</span>
                                <strong class="font-poppins text-2xl font-black">{{ formatCurrency(totalAmount) }}</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-clipboard text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-lg font-black text-white">Payment Terms & Conditions</h2>
                    </div>

                    <div class="mt-4 space-y-3">
                        <div
                            v-for="term in terms"
                            :key="term"
                            class="flex gap-3 rounded-lg border-l-4 border-tccGold bg-tccDeepBlack/70 px-4 py-4 text-sm leading-relaxed text-white/70"
                        >
                            <i class="pi pi-check-circle mt-0.5 text-tccGold" aria-hidden="true" />
                            <p>{{ term }}</p>
                        </div>
                    </div>
                </section>
            </div>

            <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <label class="flex cursor-pointer gap-4 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-4 transition-colors hover:border-tccGold/40">
                        <input
                            v-model="isAccepted"
                            type="checkbox"
                            class="mt-1 h-5 w-5 shrink-0 rounded border-white/25 bg-transparent text-tccGold focus:ring-tccGold"
                        />
                        <span class="text-sm leading-relaxed text-white/70">
                            <strong class="text-white">I have read and agree to proceed with the payment.</strong>
                            I confirm that I understand all terms and conditions, and I am ready to complete my investment in
                            <strong class="text-white">{{ agreement.vehicle }}</strong> for a total amount of
                            <strong class="text-tccGold">{{ formatCurrency(totalAmount) }}</strong>.
                        </span>
                    </label>

                    <button
                        type="button"
                        class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] transition-colors"
                        :class="isAccepted
                            ? 'bg-tccGold text-tccDarkNavy shadow-lg shadow-tccGold/20 hover:bg-tccLightGold'
                            : 'cursor-not-allowed bg-white/10 text-white/35'"
                        :disabled="!isAccepted || isLoading"
                        @click="emit('proceed-to-payment')"
                    >
                        <i v-if="isLoading" class="pi pi-spin pi-spinner text-xs" aria-hidden="true" />
                        <i v-else class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        {{ isLoading ? 'Processing...' : 'Proceed to Payment' }}
                    </button>

                    <button
                        type="button"
                        class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold"
                        @click="emit('back-to-cart')"
                    >
                        <i class="pi pi-arrow-left text-xs" aria-hidden="true" />
                        Back to Cart
                    </button>
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
            </aside>
        </div>
    </div>
</template>
