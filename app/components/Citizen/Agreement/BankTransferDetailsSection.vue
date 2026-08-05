<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    vehicleImage?: string
    allocations: number
    allocationCost: number
    reference: string
    supportEmail: string
}

const props = defineProps<{
    agreement: AgreementRecord
    isLoading?: boolean
    submitError?: string
}>()

const emit = defineEmits<{
    (event: 'back-to-cart'): void
    (event: 'confirm-payment', receiptImage: string): void
}>()

const copiedField = ref('')
const receiptFileName = ref('')
const receiptPreview = ref('')
const receiptImageDataUrl = ref('')
const receiptError = ref('')
const isReceiptPreviewOpen = ref(false)
const maxReceiptImageSize = 2 * 1024 * 1024

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
const canConfirmPayment = computed(() => Boolean(receiptImageDataUrl.value) && !props.isLoading)

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

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
})

const setReceiptFile = async (file?: File) => {
    receiptError.value = ''
    receiptFileName.value = ''
    receiptPreview.value = ''
    receiptImageDataUrl.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
        receiptError.value = 'Please upload an image file only.'
        return
    }

    if (file.size > maxReceiptImageSize) {
        receiptError.value = 'Receipt image must be 2MB or smaller.'
        return
    }

    try {
        receiptFileName.value = file.name
        receiptImageDataUrl.value = await readFileAsDataUrl(file)
        receiptPreview.value = receiptImageDataUrl.value
    } catch {
        receiptError.value = 'Unable to read receipt image. Please choose another file.'
        receiptFileName.value = ''
        receiptImageDataUrl.value = ''
        receiptPreview.value = ''
    }
}

const handleReceiptUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    void setReceiptFile(target.files?.[0])
}

const handleReceiptDrop = (event: DragEvent) => {
    void setReceiptFile(event.dataTransfer?.files?.[0])
}

const clearReceipt = () => {
    receiptFileName.value = ''
    receiptPreview.value = ''
    receiptImageDataUrl.value = ''
    receiptError.value = ''
    isReceiptPreviewOpen.value = false
}

const confirmPayment = () => {
    if (!receiptImageDataUrl.value) {
        receiptError.value = 'Please upload your bank transfer receipt image.'
        return
    }

    emit('confirm-payment', receiptImageDataUrl.value)
}

const openReceiptPreview = () => {
    if (receiptPreview.value) {
        isReceiptPreviewOpen.value = true
    }
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
                    <div class="mt-5 grid gap-4 sm:grid-cols-[16rem_minmax(0,1fr)]">
                        <div class="relative min-h-52 overflow-hidden rounded-lg border border-white/10 bg-tccDeepBlack/70 sm:h-full">
                            <img
                                v-if="agreement.vehicleImage"
                                :src="agreement.vehicleImage"
                                :alt="`${agreement.vehicle} image`"
                                class="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                            >
                            <div v-else class="grid h-full min-h-52 place-items-center text-tccGold">
                                <i class="pi pi-car text-4xl" aria-hidden="true" />
                            </div>
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
                    <div class="flex items-center gap-3">
                        <i class="pi pi-image text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-lg font-black text-white">Receipt Attachment</h2>
                    </div>

                    <div
                        class="mt-4 rounded-xl border border-dashed border-tccGold/35 bg-tccDeepBlack/70 p-4 text-center transition-colors hover:border-tccGold"
                        @drop.prevent="handleReceiptDrop"
                        @dragover.prevent
                    >
                        <button
                            v-if="receiptPreview"
                            type="button"
                            class="group mx-auto block w-full rounded-lg border border-white/10 bg-black/20 p-2"
                            @click="openReceiptPreview"
                        >
                            <img
                                :src="receiptPreview"
                                :alt="receiptFileName || 'Payment receipt preview'"
                                class="mx-auto max-h-48 w-full rounded-md object-contain transition-opacity group-hover:opacity-80"
                            />
                            <span class="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white">
                                <i class="pi pi-search-plus text-[10px]" aria-hidden="true" />
                                Preview
                            </span>
                        </button>
                        <label v-else class="block cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                class="sr-only"
                                @change="handleReceiptUpload"
                            />
                            <span class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
                                <i class="pi pi-upload text-xl" aria-hidden="true" />
                            </span>
                            <span class="mt-3 block font-poppins text-sm font-black text-white">
                                Upload receipt image
                            </span>
                        </label>
                        <label v-if="receiptPreview" class="mt-3 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 font-poppins text-xs font-black uppercase tracking-[0.12em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold">
                            <input
                                type="file"
                                accept="image/*"
                                class="sr-only"
                                @change="handleReceiptUpload"
                            />
                            <i class="pi pi-upload text-xs" aria-hidden="true" />
                            Change Image
                        </label>
                        <span class="mt-1 block text-xs text-white/45">
                            PNG, JPG, JPEG, or WEBP. Maximum size 2MB.
                        </span>
                    </div>

                    <div v-if="receiptPreview" class="mt-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3 text-sm">
                        <span class="min-w-0 truncate text-white/65">{{ receiptFileName }}</span>
                        <button
                            type="button"
                            class="shrink-0 font-poppins text-xs font-black uppercase tracking-[0.12em] text-red-200 transition-colors hover:text-red-100"
                            @click="clearReceipt"
                        >
                            Remove
                        </button>
                    </div>

                    <div v-if="receiptError || submitError" class="mt-3 rounded-lg border border-red-400/45 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
                        <i class="pi pi-exclamation-triangle mr-2 text-xs text-red-300" aria-hidden="true" />
                        {{ receiptError || submitError }}
                    </div>

                    <button
                        type="button"
                        class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] transition-colors"
                        :class="canConfirmPayment
                            ? 'bg-tccGold text-tccDarkNavy shadow-lg shadow-tccGold/20 hover:bg-tccLightGold'
                            : 'cursor-not-allowed bg-white/10 text-white/35'"
                        :disabled="!canConfirmPayment"
                        @click="confirmPayment"
                    >
                        <i v-if="isLoading" class="pi pi-spin pi-spinner text-xs" aria-hidden="true" />
                        <i v-else class="pi pi-check-circle text-xs" aria-hidden="true" />
                        {{ isLoading ? 'Confirming...' : 'Confirm' }}
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

        <Teleport to="body">
            <div
                v-if="isReceiptPreviewOpen && receiptPreview"
                class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-label="Payment receipt preview"
                @click.self="isReceiptPreviewOpen = false"
            >
                <div class="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#0b0a08] shadow-[0_30px_120px_rgba(0,0,0,0.78)]">
                    <div class="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
                        <div class="min-w-0">
                            <h3 class="font-poppins text-sm font-black text-white">Receipt Preview</h3>
                            <p class="mt-1 truncate text-xs text-white/45">{{ receiptFileName }}</p>
                        </div>
                        <button
                            type="button"
                            class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-tccGold hover:text-tccGold"
                            aria-label="Close receipt preview"
                            @click="isReceiptPreviewOpen = false"
                        >
                            <i class="pi pi-times text-xs" aria-hidden="true" />
                        </button>
                    </div>
                    <div class="max-h-[82vh] overflow-auto bg-black p-3 sm:p-5">
                        <img
                            :src="receiptPreview"
                            :alt="receiptFileName || 'Payment receipt preview'"
                            class="mx-auto max-h-[76vh] max-w-full rounded-lg object-contain"
                        />
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>
