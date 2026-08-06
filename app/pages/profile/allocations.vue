<script setup lang="ts">
definePageMeta({
    layout: 'portal'
})

useHead({
    title: 'My Allocations | Vision148'
})

type AllocationTone = 'success' | 'warning'

type AllocationData = {
    title: string
    slots: string
    code: string
    value: string
    amount: number
    paymentStatus: string
    paymentTone: AllocationTone
    verification: string
    verificationTone: AllocationTone
    image: string
    action: string
    actionRoute: string
}

const isProfileViewReady = ref(false)

const data: {
    allocations: AllocationData[]
} = {
    allocations: [
        {
            title: 'Ferrari 365 GTB/4 Daytona',
            slots: '1 Syndicate Slot',
            code: 'TCC-DAYTONA-09',
            value: 'GBP 8,500.00',
            amount: 8500,
            paymentStatus: 'Funded',
            paymentTone: 'success',
            verification: 'Docs Signed',
            verificationTone: 'success',
            image: '/frontend/assets/images/ferrari_berlinetta.png',
            action: 'Details',
            actionRoute: '/my-assets'
        },
        {
            title: 'Aston Martin V8 Vantage',
            slots: '1 Syndicate Slot',
            code: 'TCC-ASTON-12',
            value: 'GBP 4,000.00',
            amount: 4000,
            paymentStatus: 'Awaiting Bank Transfer',
            paymentTone: 'warning',
            verification: 'Signature Pending',
            verificationTone: 'warning',
            image: '/frontend/assets/images/AstonMartin.jpg',
            action: 'Complete Checkout',
            actionRoute: '/profile/transactions/NN93366393/payment-details'
        }
    ]
}

const allocations = computed(() => data.allocations)

const formatCurrency = (value: number) => new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
}).format(value)

const totalPortfolioAllocationValue = computed(() => (
    formatCurrency(data.allocations.reduce((total, allocation) => total + allocation.amount, 0))
))

const allocationBadgeClass = (tone: string) => (
    tone === 'success'
        ? 'border-tccGold/40 bg-tccGold/15 text-tccGold'
        : 'border-amber-400/40 bg-amber-400/10 text-amber-200'
)

const verificationClass = (tone: string) => (
    tone === 'success' ? 'text-tccGold' : 'text-amber-200'
)

onMounted(() => {
    window.requestAnimationFrame(() => {
        isProfileViewReady.value = true
    })
})
</script>

<template>
    <ClientOnly>
        <ProfileDashboardShell v-if="isProfileViewReady" active-section="allocations">
            <section
                class="space-y-5 rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span
                            class="inline-flex items-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-3 py-1.5 font-poppins text-[9px] font-black uppercase tracking-[0.18em] text-tccGold">
                            <i class="pi pi-briefcase text-[10px]" aria-hidden="true" />
                            Portfolio
                        </span>
                        <h2 class="mt-3 font-poppins text-xl font-black text-white sm:text-2xl">My Allocations</h2>
                        <p class="mt-1 text-[13px] text-white/55">Track active holdings, pending payments, or closed
                            syndicates.</p>
                    </div>
                    <div
                        class="rounded-xl border border-tccGold/25 bg-tccGold/10 px-4 py-2.5 text-[13px] font-semibold text-white">
                        <i class="pi pi-wallet mr-2 text-tccGold" aria-hidden="true" />
                        Total Portfolio Allocation Value:
                        <span class="ml-2 text-tccGold">{{ totalPortfolioAllocationValue }}</span>
                    </div>
                </div>

                <div class="overflow-x-auto rounded-xl border border-white/10">
                    <table class="w-full min-w-[800px] border-collapse text-left">
                        <thead>
                            <tr
                                class="border-b border-white/10 bg-white/[0.04] font-poppins text-[10px] font-black uppercase tracking-[0.12em] text-white/50">
                                <th class="p-3.5">Asset Detail</th>
                                <th class="p-3.5">Ref Code</th>
                                <th class="p-3.5">Allocation Value</th>
                                <th class="p-3.5">Payment Status</th>
                                <th class="p-3.5">Verification</th>
                                <th class="p-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/10 text-[13px]">
                            <tr v-for="allocation in allocations" :key="allocation.code"
                                class="transition-colors hover:bg-white/[0.035]">
                                <td class="p-3.5">
                                    <div class="flex items-center gap-3">
                                        <img :src="allocation.image" :alt="allocation.title"
                                            class="h-14 w-20 rounded-lg border border-white/10 object-cover">
                                        <div>
                                            <h3 class="font-poppins text-[13px] font-black text-white">{{
                                                allocation.title }}</h3>
                                            <p class="mt-1 text-[11px] text-white/50">{{ allocation.slots }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-3.5 font-mono text-tccGold">{{ allocation.code }}</td>
                                <td class="p-3.5 font-semibold text-white">{{ allocation.value }}</td>
                                <td class="p-3.5">
                                    <span
                                        class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black"
                                        :class="allocationBadgeClass(allocation.paymentTone)">
                                        <i class="pi pi-circle-fill text-[6px]" aria-hidden="true" />
                                        {{ allocation.paymentStatus }}
                                    </span>
                                </td>
                                <td class="p-3.5 text-[10px] font-black uppercase tracking-[0.1em]"
                                    :class="verificationClass(allocation.verificationTone)">
                                    <i class="pi pi-check-circle mr-1" aria-hidden="true" />
                                    {{ allocation.verification }}
                                </td>
                                <td class="p-3.5 text-right">
                                    <NuxtLink :to="allocation.actionRoute"
                                        class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 font-poppins text-[10px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                                        {{ allocation.action }}
                                        <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
                                    </NuxtLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </ProfileDashboardShell>
        <ProfileDashboardSkeleton v-else active-section="allocations" />

        <template #fallback>
            <ProfileDashboardSkeleton active-section="allocations" />
        </template>
    </ClientOnly>
</template>
