<script setup lang="ts">
type TimelineStep = {
    key: string
    label: string
    icon: string
}

defineProps<{
    steps: TimelineStep[]
    activeIndex: number
}>()

const emit = defineEmits<{
    (event: 'show-overview'): void
    (event: 'show-documents'): void
}>()

const handleStepClick = (index: number) => {
    if (index === 0) {
        emit('show-overview')
        return
    }

    if (index === 1) {
        emit('show-documents')
    }
}
</script>

<template>
    <section class="bg-tccDeepBlack py-8 sm:py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="overflow-hidden rounded-xl border border-white/20 bg-[#11100d] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                <div class="overflow-x-auto px-4 py-5 sm:px-6">
                    <ol class="relative grid min-w-[820px] grid-cols-6 gap-3">
                        <li v-for="(step, index) in steps" :key="step.key" class="relative">
                            <div
                                v-if="index < steps.length - 1"
                                class="absolute left-[calc(50%+1.3rem)] right-[calc(-50%+1.3rem)] top-5 h-px"
                                :class="index < activeIndex ? 'bg-tccGold/70' : 'bg-white/10'"
                            />
                            <button
                                type="button"
                                class="relative z-10 flex w-full flex-col items-center gap-2 text-center"
                                :class="index <= 1 ? 'cursor-pointer' : 'cursor-default'"
                                @click="handleStepClick(index)"
                            >
                                <span
                                    class="grid h-10 w-10 place-items-center rounded-full border text-sm transition-colors"
                                    :class="index < activeIndex
                                        ? 'border-tccGold bg-tccGold text-tccDarkNavy'
                                        : index === activeIndex
                                            ? 'border-tccGold bg-tccGold/15 text-tccGold shadow-[0_0_0_6px_rgba(247,198,0,0.08)]'
                                            : 'border-white/10 bg-white/[0.04] text-white/30'"
                                >
                                    <i :class="step.icon" aria-hidden="true" />
                                </span>
                                <span
                                    class="text-[10px] font-black uppercase tracking-[0.16em]"
                                    :class="index <= activeIndex ? 'text-white' : 'text-white/40'"
                                >
                                    {{ step.label }}
                                </span>
                            </button>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
</template>
