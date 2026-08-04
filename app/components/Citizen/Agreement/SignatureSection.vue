<script setup lang="ts">
type SignatureMethod = 'draw' | 'type' | 'upload'
type SignatureSubmitPayload = {
    signature_method: SignatureMethod
    signature_type: 'canvas'
    signature_canvas: string
    signature_text?: string
    signature_style?: string
}

type AgreementRecord = {
    vehicle: string
    allocations: number
    supportEmail: string
}

const props = withDefaults(defineProps<{
    agreement: AgreementRecord
    isSubmitting?: boolean
    submitError?: string
}>(), {
    isSubmitting: false,
    submitError: ''
})

const emit = defineEmits<{
    (event: 'back-to-documents'): void
    (event: 'submit', payload: SignatureSubmitPayload): void
}>()

const signatureMethod = ref<SignatureMethod>('draw')
const typedSignatureName = ref('')
const selectedSignatureStyle = ref('heritage')
const uploadedSignatureName = ref('')
const uploadedSignaturePreview = ref('')
const uploadedSignatureDataUrl = ref('')
const hasDrawnSignature = ref(false)
const signatureCanvas = ref<HTMLCanvasElement | null>(null)
let isDrawingSignature = false
const signatureStrokeColor = '#f7c600'

const signatureMethods = [
    { key: 'draw' as const, label: 'Draw Signature', icon: 'pi pi-pencil' },
    { key: 'type' as const, label: 'Type Name', icon: 'pi pi-keyboard' },
    { key: 'upload' as const, label: 'Upload Image', icon: 'pi pi-upload' }
]

const signatureStyles = [
    {
        key: 'heritage',
        label: 'Heritage Script',
        className: 'signature-style-heritage'
    },
    {
        key: 'classic',
        label: 'Classic Flow',
        className: 'signature-style-classic'
    },
    {
        key: 'modern',
        label: 'Modern Hand',
        className: 'signature-style-modern'
    },
    {
        key: 'serif',
        label: 'Formal Serif',
        className: 'signature-style-serif'
    }
]

const signatureReady = computed(() => {
    if (signatureMethod.value === 'draw') {
        return hasDrawnSignature.value
    }

    if (signatureMethod.value === 'type') {
        return typedSignatureName.value.trim().length > 1
    }

    return Boolean(uploadedSignaturePreview.value)
})

const activeSignatureStyle = computed(() => signatureStyles.find((style) => style.key === selectedSignatureStyle.value) || signatureStyles[0])

const applySignaturePenStyle = (context: CanvasRenderingContext2D) => {
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = 3
    context.strokeStyle = signatureStrokeColor
}

const resizeSignatureCanvas = () => {
    const canvas = signatureCanvas.value

    if (!canvas || typeof window === 'undefined') {
        return
    }

    const rect = canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio

    const context = canvas.getContext('2d')

    if (!context) {
        return
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    applySignaturePenStyle(context)
}

const selectSignatureMethod = (method: SignatureMethod) => {
    const previousMethod = signatureMethod.value
    signatureMethod.value = method

    if (method === 'draw') {
        if (previousMethod !== 'draw') {
            hasDrawnSignature.value = false
        }

        nextTick(() => {
            resizeSignatureCanvas()
        })
    }
}

const getCanvasPoint = (event: PointerEvent) => {
    const canvas = signatureCanvas.value

    if (!canvas) {
        return { x: 0, y: 0 }
    }

    const rect = canvas.getBoundingClientRect()

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

const startSignatureDraw = (event: PointerEvent) => {
    const canvas = signatureCanvas.value
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
        return
    }

    isDrawingSignature = true
    hasDrawnSignature.value = true
    canvas.setPointerCapture(event.pointerId)
    applySignaturePenStyle(context)

    const point = getCanvasPoint(event)
    context.beginPath()
    context.moveTo(point.x, point.y)
}

const drawSignature = (event: PointerEvent) => {
    if (!isDrawingSignature) {
        return
    }

    const context = signatureCanvas.value?.getContext('2d')

    if (!context) {
        return
    }

    applySignaturePenStyle(context)

    const point = getCanvasPoint(event)
    context.lineTo(point.x, point.y)
    context.stroke()
}

const stopSignatureDraw = (event: PointerEvent) => {
    if (!isDrawingSignature) {
        return
    }

    isDrawingSignature = false

    if (signatureCanvas.value?.hasPointerCapture(event.pointerId)) {
        signatureCanvas.value.releasePointerCapture(event.pointerId)
    }
}

const clearDrawnSignature = () => {
    const canvas = signatureCanvas.value
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
        return
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    hasDrawnSignature.value = false
    resizeSignatureCanvas()
}

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
})

const setUploadedSignatureFile = async (file?: File) => {
    if (!file) return

    if (uploadedSignaturePreview.value && uploadedSignaturePreview.value.startsWith('blob:') && typeof URL !== 'undefined') {
        URL.revokeObjectURL(uploadedSignaturePreview.value)
    }

    uploadedSignatureName.value = file.name
    uploadedSignatureDataUrl.value = await readFileAsDataUrl(file)
    uploadedSignaturePreview.value = uploadedSignatureDataUrl.value
}

const handleSignatureUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    void setUploadedSignatureFile(target.files?.[0])
}

const handleSignatureDrop = (event: DragEvent) => {
    void setUploadedSignatureFile(event.dataTransfer?.files?.[0])
}

const getTypedSignatureCanvasDataUrl = () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) return ''

    canvas.width = 900
    canvas.height = 260
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = signatureStrokeColor
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = selectedSignatureStyle.value === 'serif'
        ? 'italic 74px Georgia, "Times New Roman", serif'
        : 'italic 82px "Brush Script MT", "Segoe Script", cursive'
    context.fillText(typedSignatureName.value.trim(), canvas.width / 2, canvas.height / 2, canvas.width - 80)

    return canvas.toDataURL('image/png')
}

const getSignaturePayload = (): SignatureSubmitPayload | null => {
    if (!signatureReady.value) return null

    if (signatureMethod.value === 'draw') {
        const signatureCanvasData = signatureCanvas.value?.toDataURL('image/png') || ''
        if (!signatureCanvasData) return null

        return {
            signature_method: 'draw',
            signature_type: 'canvas',
            signature_canvas: signatureCanvasData
        }
    }

    if (signatureMethod.value === 'type') {
        const typedSignatureCanvas = getTypedSignatureCanvasDataUrl()
        if (!typedSignatureCanvas) return null

        return {
            signature_method: 'type',
            signature_type: 'canvas',
            signature_canvas: typedSignatureCanvas,
            signature_text: typedSignatureName.value.trim(),
            signature_style: selectedSignatureStyle.value
        }
    }

    if (!uploadedSignatureDataUrl.value) return null

    return {
        signature_method: 'upload',
        signature_type: 'canvas',
        signature_canvas: uploadedSignatureDataUrl.value
    }
}

const submitSignature = () => {
    if (!signatureReady.value || props.isSubmitting) return

    const payload = getSignaturePayload()
    if (!payload) return

    emit('submit', payload)
}

onMounted(() => {
    nextTick(() => {
        resizeSignatureCanvas()
    })
})

onBeforeUnmount(() => {
    if (uploadedSignaturePreview.value && uploadedSignaturePreview.value.startsWith('blob:') && typeof URL !== 'undefined') {
        URL.revokeObjectURL(uploadedSignaturePreview.value)
    }
})
</script>

<template>
    <div class="space-y-6">
        <div class="text-center">
            <span class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-[0_0_36px_rgba(247,198,0,0.12)]">
                <i class="pi pi-pencil text-2xl" aria-hidden="true" />
            </span>
            <h1 class="mt-4 font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
                Digital Signature
            </h1>
            <p class="mt-2 text-sm text-white/55">
                Please sign the document to complete your investment process
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div class="space-y-5">
                <section class="rounded-xl border border-tccGold/20 bg-[#11100d] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)]">
                    <h2 class="font-poppins text-lg font-black text-white">Your Allocation Summary</h2>
                    <div class="mt-4 space-y-3">
                        <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <span class="font-semibold text-white/60">Car Model</span>
                            <strong class="text-white">{{ props.agreement.vehicle }}</strong>
                        </div>
                        <div class="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <span class="font-semibold text-white/60">Number of Allocations</span>
                            <strong class="text-white">{{ props.agreement.allocations }}</strong>
                        </div>
                    </div>
                </section>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 class="font-poppins text-lg font-black text-white">Important Instructions</h2>
                    <div class="mt-4 space-y-3 text-sm text-white/70">
                        <div class="flex gap-3">
                            <i class="pi pi-check-circle mt-0.5 text-tccGold" aria-hidden="true" />
                            <span>Choose your preferred signature method below to be added to all documents</span>
                        </div>
                        <div class="flex gap-3">
                            <i class="pi pi-check-circle mt-0.5 text-tccGold" aria-hidden="true" />
                            <span>Your signature will be placed all documents confirming your agreement</span>
                        </div>
                    </div>
                </section>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 class="font-poppins text-lg font-black text-white">
                        Click below and sign the Documents
                    </h2>
                    <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button
                            v-for="method in signatureMethods"
                            :key="method.key"
                            type="button"
                            class="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-poppins text-xs font-black uppercase tracking-[0.12em] transition-colors"
                            :class="signatureMethod === method.key
                                ? 'border-tccGold bg-tccGold text-tccDarkNavy shadow-lg shadow-tccGold/15'
                                : 'border-white/15 bg-tccDeepBlack text-white/70 hover:border-tccGold hover:text-tccGold'"
                            @click="selectSignatureMethod(method.key)"
                        >
                            <i :class="method.icon" class="text-xs" aria-hidden="true" />
                            {{ method.label }}
                        </button>
                    </div>
                </section>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <div v-if="signatureMethod === 'draw'">
                        <h2 class="font-poppins text-lg font-black text-white">Draw Your Signature</h2>
                        <div class="mt-5 rounded-xl border border-dashed border-tccGold/35 bg-tccDeepBlack/70 p-4">
                            <canvas
                                ref="signatureCanvas"
                                class="h-56 w-full touch-none rounded-lg border border-tccGold/35 bg-[#080705]"
                                aria-label="Draw your signature"
                                @pointerdown="startSignatureDraw"
                                @pointermove="drawSignature"
                                @pointerup="stopSignatureDraw"
                                @pointerleave="stopSignatureDraw"
                            />
                            <div class="mt-4 text-center">
                                <button
                                    type="button"
                                    class="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/50 bg-red-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-red-200 transition-colors hover:bg-red-500/20"
                                    @click="clearDrawnSignature"
                                >
                                    <i class="pi pi-eraser text-xs" aria-hidden="true" />
                                    Clear Signature
                                </button>
                            </div>
                            <div v-if="!hasDrawnSignature" class="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-200">
                                <i class="pi pi-exclamation-triangle mr-2 text-xs" aria-hidden="true" />
                                Please draw your signature above
                            </div>
                            <div v-else class="mt-4 rounded-lg border border-tccGold/35 bg-tccGold/10 px-4 py-3 text-center text-sm font-black text-tccGold">
                                <i class="pi pi-check-circle mr-2 text-xs" aria-hidden="true" />
                                Signature ready
                            </div>
                        </div>
                    </div>

                    <div v-else-if="signatureMethod === 'type'">
                        <h2 class="font-poppins text-lg font-black text-white">Type Your Signature</h2>
                        <label for="typed-signature-name" class="mt-5 block text-xs font-black uppercase tracking-[0.14em] text-white/55">
                            Type Your Full Name
                        </label>
                        <input
                            id="typed-signature-name"
                            v-model="typedSignatureName"
                            type="text"
                            placeholder="Enter your full name"
                            class="mt-2 w-full rounded-lg border border-white/15 bg-tccDeepBlack px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-tccGold"
                        />
                        <p class="mt-2 text-xs text-white/45">
                            Your name will be converted to a signature-style preview.
                        </p>

                        <div class="mt-5">
                            <p class="text-xs font-black uppercase tracking-[0.14em] text-white/55">
                                Choose Signature Style:
                            </p>
                            <div class="mt-3 grid gap-3 sm:grid-cols-2">
                                <button
                                    v-for="style in signatureStyles"
                                    :key="style.key"
                                    type="button"
                                    class="rounded-lg border px-4 py-4 text-center transition-colors"
                                    :class="selectedSignatureStyle === style.key
                                        ? 'border-tccGold bg-tccGold/10 text-tccGold'
                                        : 'border-white/10 bg-tccDeepBlack text-white/70 hover:border-tccGold/60'"
                                    @click="selectedSignatureStyle = style.key"
                                >
                                    <span :class="style.className" class="block text-2xl">
                                        {{ typedSignatureName || style.label }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div class="mt-5 rounded-xl border border-dashed border-tccGold/35 bg-tccDeepBlack/70 p-5">
                            <p class="text-xs font-black uppercase tracking-[0.14em] text-white/45">Preview:</p>
                            <div class="mt-4 flex min-h-32 items-center justify-center border-b border-tccGold/35 px-4 pb-4 text-center">
                                <span :class="activeSignatureStyle.className" class="break-words text-4xl text-tccGold">
                                    {{ typedSignatureName || 'Your Name' }}
                                </span>
                            </div>
                        </div>

                        <div v-if="signatureReady" class="mt-4 rounded-lg border border-tccGold/35 bg-tccGold/10 px-4 py-3 text-center text-sm font-black text-tccGold">
                            <i class="pi pi-check-circle mr-2 text-xs" aria-hidden="true" />
                            Signature ready
                        </div>
                    </div>

                    <div v-else>
                        <h2 class="font-poppins text-lg font-black text-white">Upload Your Signature</h2>
                        <label
                            for="signature-upload"
                            class="mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-tccGold/35 bg-tccDeepBlack/70 p-6 text-center transition-colors hover:border-tccGold"
                            @dragover.prevent
                            @drop.prevent="handleSignatureDrop"
                        >
                            <input
                                id="signature-upload"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/gif"
                                class="sr-only"
                                @change="handleSignatureUpload"
                            />
                            <template v-if="uploadedSignaturePreview">
                                <img :src="uploadedSignaturePreview" :alt="uploadedSignatureName" class="max-h-32 max-w-full rounded-lg object-contain" />
                                <span class="mt-3 text-sm font-semibold text-white">{{ uploadedSignatureName }}</span>
                                <span class="mt-1 text-xs text-white/45">Click to replace file</span>
                            </template>
                            <template v-else>
                                <span class="grid h-12 w-12 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
                                    <i class="pi pi-cloud-upload text-xl" aria-hidden="true" />
                                </span>
                                <strong class="mt-4 text-base text-white">Drop your signature image here</strong>
                                <span class="mt-1 text-sm text-white/55">or click to browse files</span>
                                <span class="mt-2 text-xs text-white/35">Supported formats: JPG, PNG, GIF</span>
                            </template>
                        </label>

                        <div v-if="!uploadedSignaturePreview" class="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-200">
                            <i class="pi pi-exclamation-triangle mr-2 text-xs" aria-hidden="true" />
                            Please upload your signature image
                        </div>
                        <div v-else class="mt-4 rounded-lg border border-tccGold/35 bg-tccGold/10 px-4 py-3 text-center text-sm font-black text-tccGold">
                            <i class="pi pi-check-circle mr-2 text-xs" aria-hidden="true" />
                            Signature ready
                        </div>
                    </div>
                </section>
            </div>

            <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <div class="rounded-xl border border-tccGold/25 bg-tccGold/10 px-4 py-3 text-center">
                    <i class="pi pi-clock mr-2 text-tccGold" aria-hidden="true" />
                    <span class="font-poppins text-sm font-black text-white">
                        {{ signatureReady ? 'Ready to Submit' : 'Awaiting Signature' }}
                    </span>
                </div>

                <div v-if="props.submitError" class="rounded-xl border border-red-400/45 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
                    <i class="pi pi-exclamation-triangle mr-2 text-xs text-red-300" aria-hidden="true" />
                    {{ props.submitError }}
                </div>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 class="font-poppins text-lg font-black text-white">Signature Process</h2>
                    <div class="mt-4 space-y-3">
                        <div class="flex gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 p-3">
                            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tccGold text-sm font-black text-tccDarkNavy">1</span>
                            <div>
                                <h3 class="text-sm font-black text-white">Create Signature</h3>
                                <p class="text-xs text-white/50">Draw, type, or upload your signature</p>
                            </div>
                        </div>
                        <div class="flex gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 p-3">
                            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-black text-white">2</span>
                            <div>
                                <h3 class="text-sm font-black text-white">Review</h3>
                                <p class="text-xs text-white/50">Verify your signature looks correct</p>
                            </div>
                        </div>
                        <div class="flex gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 p-3">
                            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-black text-white">3</span>
                            <div>
                                <h3 class="text-sm font-black text-white">Submit</h3>
                                <p class="text-xs text-white/50">Complete the signing process</p>
                            </div>
                        </div>
                    </div>
                </section>

                <button
                    type="button"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold"
                    @click="emit('back-to-documents')"
                >
                    <i class="pi pi-arrow-left text-xs" aria-hidden="true" />
                    Back to Documents
                </button>

                <button
                    type="button"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] transition-colors"
                    :class="signatureReady
                        ? 'bg-tccGold text-tccDarkNavy shadow-lg shadow-tccGold/20 hover:bg-tccLightGold'
                        : 'cursor-not-allowed bg-white/10 text-white/35'"
                    :disabled="!signatureReady || props.isSubmitting"
                    @click="submitSignature"
                >
                    <i v-if="props.isSubmitting" class="pi pi-spin pi-spinner text-xs" aria-hidden="true" />
                    <i v-else class="pi pi-file-edit text-xs" aria-hidden="true" />
                    {{ props.isSubmitting ? 'Submitting...' : 'Submit Signature' }}
                </button>

                <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
                    <div class="flex gap-3">
                        <i class="pi pi-headphones mt-1 text-tccGold" aria-hidden="true" />
                        <div>
                            <p>Need Help?</p>
                            <a :href="`mailto:${props.agreement.supportEmail}`" class="font-black text-tccGold hover:text-tccLightGold">
                                {{ props.agreement.supportEmail }}
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<style scoped>
.signature-style-heritage {
    font-family: "Brush Script MT", "Segoe Script", cursive;
    font-style: italic;
}

.signature-style-classic {
    font-family: "Lucida Handwriting", "Apple Chancery", cursive;
    font-style: italic;
}

.signature-style-modern {
    font-family: "Segoe Print", "Bradley Hand", cursive;
}

.signature-style-serif {
    font-family: Georgia, "Times New Roman", serif;
    font-style: italic;
}
</style>
