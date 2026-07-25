<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    allocations: number
    reference: string
}

defineProps<{
    agreement: AgreementRecord
    totalInvestment: string
}>()
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
            <strong class="mt-1 block text-sm text-tccGold sm:text-base">{{ agreement.reference }}</strong>
        </div>
    </div>
</template>
