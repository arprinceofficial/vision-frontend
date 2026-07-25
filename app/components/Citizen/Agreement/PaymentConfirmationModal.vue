<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    allocations: number
    allocationCost: number
    reference: string
}

const props = defineProps<{
    isOpenModal: boolean
    agreement: AgreementRecord
}>()

const emit = defineEmits<{
    (event: 'close'): void
    (event: 'edit-cart'): void
    (event: 'confirm'): void
}>()

const visible = ref(props.isOpenModal)

watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal
})

const totalAmount = computed(() => props.agreement.allocations * props.agreement.allocationCost)

const formattedAmount = computed(() => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
}).format(totalAmount.value))

const handleVisibleUpdate = (value: boolean) => {
    visible.value = value

    if (!value) {
        emit('close')
    }
}

const closeModal = () => {
    visible.value = false
    emit('close')
}

const editCart = () => {
    visible.value = false
    emit('edit-cart')
}

const confirmPayment = () => {
    visible.value = false
    emit('confirm')
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :closable="false"
        :draggable="false"
        :dismissable-mask="true"
        :show-header="false"
        :style="{ width: 'min(92vw, 38rem)' }"
        class="payment-confirmation-dialog"
        :pt="{
            mask: { class: 'bg-black/75 backdrop-blur-sm' },
            content: { class: 'p-0' }
        }"
        @update:visible="handleVisibleUpdate"
    >
        <div class="overflow-hidden rounded-2xl border border-tccGold/25 bg-tccDeepBlack text-white shadow-[0_30px_110px_rgba(0,0,0,0.72)]">
            <div class="border-b border-tccGold/20 bg-[#0b0a08] px-6 py-7 sm:px-8">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <span class="grid h-11 w-11 place-items-center rounded-full border border-tccGold/40 bg-tccGold/10 text-tccGold">
                            <i class="pi pi-exclamation-triangle text-xl" aria-hidden="true" />
                        </span>
                        <div>
                            <p class="font-poppins text-[10px] font-black uppercase tracking-[0.24em] text-tccGold">
                                Bank Transfer
                            </p>
                            <h2 class="mt-1 font-poppins text-xl font-black text-white sm:text-2xl">
                                Confirm Payment Method
                            </h2>
                        </div>
                    </div>
                    <button
                        type="button"
                        class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-tccGold/50 hover:text-tccGold"
                        aria-label="Close payment confirmation modal"
                        @click="closeModal"
                    >
                        <i class="pi pi-times text-xs" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div class="space-y-5 px-5 py-6 sm:px-8">
                <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div class="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                            <span class="block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                                Vehicle
                            </span>
                            <strong class="mt-1 block text-white">{{ agreement.vehicle }}</strong>
                        </div>
                        <div>
                            <span class="block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                                Reference
                            </span>
                            <strong class="mt-1 block font-mono text-tccGold">{{ agreement.reference }}</strong>
                        </div>
                        <div>
                            <span class="block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                                Allocation
                            </span>
                            <strong class="mt-1 block text-white">{{ agreement.allocations }} slot</strong>
                        </div>
                        <div>
                            <span class="block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                                Amount
                            </span>
                            <strong class="mt-1 block text-tccGold">{{ formattedAmount }}</strong>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 text-sm leading-relaxed text-white/72">
                    <p>
                        <strong class="text-white">Thank you</strong> for agreeing to make your payment.
                        Once the funds have been received in the <strong class="text-white">Escrow account</strong>,
                        you will get an email confirmation.
                    </p>
                    <p class="text-white/55">
                        If you need to change your payment method, go back to the cart page before confirming.
                    </p>
                </div>

                <div class="rounded-xl border border-tccGold/25 bg-tccGold/10 p-4 text-sm text-white/70">
                    <i class="pi pi-info-circle mr-2 text-tccGold" aria-hidden="true" />
                    This will add the allocation to your transaction history as awaiting funding.
                </div>
            </div>

            <div class="grid gap-3 border-t border-white/10 bg-[#080705] p-4 sm:grid-cols-[1fr_1fr]">
                <button
                    type="button"
                    class="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold"
                    @click="editCart"
                >
                    <i class="pi pi-shopping-cart text-xs" aria-hidden="true" />
                    Edit Cart
                </button>
                <button
                    type="button"
                    class="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                    @click="confirmPayment"
                >
                    <i class="pi pi-check text-xs" aria-hidden="true" />
                    Confirm
                </button>
            </div>
        </div>
    </Dialog>
</template>
