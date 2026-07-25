<script setup lang="ts">
const props = withDefaults(defineProps<{
    isOpenModal: boolean
    supportEmail: string
}>(), {
    supportEmail: 'support@thecarcrowd.co.uk'
})

const emit = defineEmits(['close', 'proceed'])

const visible = ref(props.isOpenModal)

watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal
})

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

const proceed = () => {
    visible.value = false
    emit('proceed')
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :draggable="false" :dismissable-mask="true"
        :show-header="false" :style="{ width: 'min(92vw, 38rem)' }" class="ready-to-sign-dialog" :pt="{
            mask: { class: 'bg-black/75 backdrop-blur-sm' },
            content: { class: 'p-0' }
        }" @update:visible="handleVisibleUpdate">
        <div class="overflow-hidden rounded-2xl border border-tccGold/25 bg-tccDeepBlack text-white shadow-[0_30px_110px_rgba(0,0,0,0.72)]">
            <div class="border-b border-tccGold/20 bg-[#0b0a08] px-6 py-8 text-center sm:px-8">
                <span
                    class="mx-auto grid h-16 w-16 place-items-center rounded-full border border-tccGold/40 bg-tccGold/10 text-tccGold shadow-[0_0_40px_rgba(247,198,0,0.12)]">
                    <i class="pi pi-clipboard text-2xl" aria-hidden="true" />
                </span>
                <h2 class="mt-5 font-poppins text-2xl font-black leading-tight text-white">
                    Ready to Sign?
                </h2>
            </div>

            <div class="px-5 py-6 sm:px-8">
                <p class="text-sm leading-relaxed text-white/70 sm:text-base">
                    Before proceeding to document signing, please confirm that you have:
                </p>

                <div class="mt-5 rounded-xl border border-tccGold/25 bg-tccGold/10 p-4 sm:p-5">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-list-check text-tccGold" aria-hidden="true" />
                        <h3 class="font-poppins text-sm font-black uppercase tracking-[0.12em] text-white">
                            Review Checklist
                        </h3>
                    </div>

                    <div class="mt-5 space-y-4">
                        <div class="flex gap-3 text-sm leading-relaxed text-white/75">
                            <span
                                class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
                                <i class="pi pi-check text-[10px]" aria-hidden="true" />
                            </span>
                            <span>
                                Read and Understood the
                                <strong class="text-white">Subscription Agreement</strong>
                            </span>
                        </div>
                        <div class="flex gap-3 text-sm leading-relaxed text-white/75">
                            <span
                                class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
                                <i class="pi pi-check text-[10px]" aria-hidden="true" />
                            </span>
                            <span>
                                Read and Understood the
                                <strong class="text-white">Terms and Conditions</strong>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-white/60">
                    <i class="pi pi-info-circle mt-0.5 text-tccGold" aria-hidden="true" />
                    <p>
                        You will be redirected to the signature page where you can sign the documents electronically.
                    </p>
                </div>

                <div class="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white/60">
                    Need help?
                    <a :href="`mailto:${supportEmail}`"
                        class="font-black text-tccGold underline decoration-tccGold/60 underline-offset-4">
                        {{ supportEmail }}
                    </a>
                </div>
            </div>

            <div class="grid gap-3 border-t border-white/10 bg-[#080705] p-4 sm:grid-cols-2">
                <button type="button"
                    class="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold"
                    @click="closeModal">
                    <i class="pi pi-times text-xs" aria-hidden="true" />
                    Go Back
                </button>
                <button type="button"
                    class="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                    @click="proceed">
                    <i class="pi pi-pencil text-xs" aria-hidden="true" />
                    Yes, Proceed
                </button>
            </div>
        </div>
    </Dialog>
</template>
