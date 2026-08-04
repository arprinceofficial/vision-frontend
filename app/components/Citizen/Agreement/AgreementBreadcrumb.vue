<script setup lang="ts">
withDefaults(defineProps<{
    reference: string
    isReferenceLoading?: boolean
}>(), {
    isReferenceLoading: false
})
</script>

<template>
    <section class="border-b border-white/10 bg-tccDeepBlack">
        <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <nav class="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                <NuxtLink to="/" class="transition-colors hover:text-tccGold">Home</NuxtLink>
                <span>/</span>
                <NuxtLink to="/syndicates/lamborghini-diablo-vt-roadster" class="transition-colors hover:text-tccGold">
                    Live Syndicates
                </NuxtLink>
                <span>/</span>
                <span
                    v-if="isReferenceLoading"
                    class="h-3 w-20 rounded-full bg-tccGold/25 shadow-[0_0_18px_rgba(247,198,0,0.18)] animate-pulse"
                    aria-label="Loading reference"
                />
                <span v-else-if="reference" class="text-tccGold">{{ reference }}</span>
                <span v-else class="text-white/35">Pending</span>
            </nav>
        </div>
    </section>
</template>
