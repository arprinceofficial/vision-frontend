<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    allocations: number
    reference: string
}

withDefaults(defineProps<{
    agreement: AgreementRecord
    totalInvestment: string
    reference?: string
    isReferenceLoading?: boolean
}>(), {
    reference: '',
    isReferenceLoading: false
})
</script>

<template>
    <div class="mb-6 grid gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-3">
        <div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Vehicle</span>
            <strong class="mt-1 block text-sm text-white sm:text-base">{{ agreement.vehicle }}</strong>
        </div>
        <div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Allocation</span>
            <strong class="mt-1 block text-sm text-white sm:text-base">
                {{ agreement.allocations }} slot / {{ totalInvestment }}
            </strong>
        </div>
        <div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Reference</span>
            <span
                v-if="isReferenceLoading"
                class="mt-2 block h-4 w-24 rounded-full bg-tccGold/25 shadow-[0_0_18px_rgba(247,198,0,0.16)] animate-pulse"
                aria-label="Loading reference"
            />
            <strong v-else-if="reference" class="mt-1 block text-sm text-tccGold sm:text-base">{{ reference }}</strong>
            <strong v-else class="mt-1 block text-sm text-white/35 sm:text-base">Pending</strong>
        </div>
    </div>
</template>
