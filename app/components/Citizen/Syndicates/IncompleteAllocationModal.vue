<script setup lang="ts">
const props = withDefaults(defineProps<{
    isOpenModal: boolean
    title: string
    slots: number
    allocationCost: number
    progress?: number
    currentStep?: string
}>(), {
    progress: 0,
    currentStep: 'Initial Agreement'
})

const emit = defineEmits(['close', 'start-fresh', 'continue-existing'])

const visible = ref(props.isOpenModal)

watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal
})

const allocationPrice = computed(() => (props.slots * props.allocationCost).toFixed(2))
const slotLabel = computed(() => `${props.slots} ${props.slots === 1 ? 'slot' : 'slots'}`)

const progressPercent = computed(() => Math.min(100, Math.max(0, props.progress)))
const progressWidth = computed(() => `${progressPercent.value}%`)

const closeModal = () => {
    visible.value = false
    emit('close')
}

const handleVisibleUpdate = (value: boolean) => {
    visible.value = value

    if (!value) {
        emit('close')
    }
}

const startFresh = () => {
    visible.value = false
    emit('start-fresh')
}

const continueExisting = () => {
    visible.value = false
    emit('continue-existing')
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :draggable="false" :dismissable-mask="true"
        :show-header="false" :style="{ width: 'min(92vw, 40rem)' }" class="allocation-recovery-dialog" :pt="{
            mask: { class: 'bg-black/70 backdrop-blur-sm' },
            content: { class: 'p-0' }
        }" @update:visible="handleVisibleUpdate">
        <div class="overflow-hidden rounded-xl bg-white text-[#101828]">
            <div class="bg-tccDeepBlack px-5 py-7 text-center text-white sm:px-8">
                <span
                    class="mx-auto grid h-12 w-12 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold">
                    <i class="pi pi-refresh text-2xl" aria-hidden="true" />
                </span>
                <h2 class="mt-4 font-poppins text-xl font-black leading-tight text-white sm:text-2xl">
                    Incomplete Allocation Found
                </h2>
            </div>

            <div class="px-5 py-6 sm:px-8">
                <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
                    <p class="mx-auto max-w-md text-center text-[15px] leading-relaxed text-slate-800">
                        You have an incomplete allocation for
                        <strong class="font-black text-slate-950">{{ title }}</strong>
                    </p>

                    <div class="mt-6 divide-y divide-slate-200">
                        <div class="flex items-center justify-between gap-4 py-3">
                            <span class="inline-flex items-center gap-3 text-sm font-medium text-slate-500">
                                <i class="pi pi-box text-slate-500" aria-hidden="true" />
                                Slots:
                            </span>
                            <strong class="text-sm font-black text-slate-950">{{ slotLabel }}</strong>
                        </div>
                        <div class="flex items-center justify-between gap-4 py-3">
                            <span class="inline-flex items-center gap-3 text-sm font-medium text-slate-500">
                                <span class="font-poppins text-base font-semibold" aria-hidden="true">&pound;</span>
                                Price:
                            </span>
                            <strong class="text-sm font-black text-slate-950">&pound;{{ allocationPrice }}</strong>
                        </div>
                        <div class="flex items-center justify-between gap-4 py-3">
                            <span class="inline-flex items-center gap-3 text-sm font-medium text-slate-500">
                                <i class="pi pi-map-marker text-slate-500" aria-hidden="true" />
                                Current Step:
                            </span>
                            <strong class="text-right text-sm font-black text-slate-950">{{ currentStep }}</strong>
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="flex items-center justify-between text-xs text-slate-500">
                            <span>Progress</span>
                            <span>{{ progressPercent }}%</span>
                        </div>
                        <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                            <div class="h-full rounded-full bg-tccGold" :style="{ width: progressWidth }" />
                        </div>
                    </div>
                </div>

                <div class="my-6 h-px bg-slate-200" />

                <div class="text-center">
                    <span class="mx-auto grid h-8 w-8 place-items-center rounded-full bg-slate-500 text-white">
                        <i class="pi pi-question text-sm" aria-hidden="true" />
                    </span>
                    <p class="mx-auto mt-4 max-w-lg text-[15px] font-medium leading-relaxed text-slate-900">
                        Would you like to continue with your existing allocation or start fresh?
                    </p>
                </div>
            </div>

            <div class="grid gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                <button type="button"
                    class="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-tccDeepBlack/15 bg-white px-4 py-3 font-poppins text-sm font-semibold text-tccDeepBlack/70 transition-colors hover:border-tccGold/55 hover:text-tccDeepBlack"
                    @click="closeModal">
                    <i class="pi pi-times text-xs" aria-hidden="true" />
                    Cancel
                </button>
                <button type="button"
                    class="inline-flex min-h-14 items-center justify-center gap-2 rounded-md border border-tccGold/25 bg-tccDeepBlack px-4 py-3 font-poppins text-sm font-semibold text-white transition-colors hover:border-tccGold/60 hover:bg-black"
                    @click="startFresh">
                    <i class="pi pi-refresh text-xs" aria-hidden="true" />
                    Start Fresh
                </button>
                <button type="button"
                    class="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-tccGold px-4 py-3 font-poppins text-sm font-black text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                    @click="continueExisting">
                    <i class="pi pi-play text-xs" aria-hidden="true" />
                    Continue Existing
                </button>
            </div>
        </div>
    </Dialog>
</template>
