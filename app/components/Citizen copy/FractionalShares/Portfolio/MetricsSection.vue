<script setup lang="ts">
const metrics = [
    {
        label: 'Total Items',
        detail: '+1 This Month',
        value: '2',
        type: 'items'
    },
    {
        label: 'Portfolio Value',
        detail: '+2.46% Growth This Month',
        value: '£67,600',
        type: 'value'
    }
]
</script>

<template>
    <div class="grid gap-3 md:max-w-[920px] md:grid-cols-[minmax(0,350px)_minmax(0,544px)] lg:gap-4">
        <article v-for="metric in metrics" :key="metric.label"
            class="grid min-h-[72px] grid-cols-[64px_minmax(0,1fr)] overflow-hidden rounded-[14px] border border-white/70 bg-[#111215] text-white sm:min-h-[80px] sm:grid-cols-[80px_minmax(0,1fr)] sm:rounded-[16px]">
            <div
                class="flex h-full min-h-[72px] w-16 items-center justify-center bg-[linear-gradient(-75deg,rgba(255,255,255,0)_28.673%,rgba(255,255,255,0.1)_71.327%),linear-gradient(90deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%)] sm:min-h-[80px] sm:w-20">
                <svg v-if="metric.type === 'items'" aria-hidden="true" viewBox="0 0 32 32"
                    class="size-8 text-[#dadbdd] sm:size-10">
                    <path d="M16 4 5.5 9.5 16 15l10.5-5.5L16 4Z" fill="none" stroke="currentColor"
                        stroke-linejoin="round" stroke-width="1.5" />
                    <path d="M5.5 9.5v12.25L16 28l10.5-6.25V9.5" fill="none" stroke="currentColor"
                        stroke-linejoin="round" stroke-width="1.5" />
                    <path d="M16 15v13" fill="none" stroke="currentColor" stroke-linecap="round"
                        stroke-width="1.5" />
                </svg>
                <svg v-else aria-hidden="true" viewBox="0 0 32 32" class="size-8 text-[#dadbdd] sm:size-10">
                    <circle cx="16" cy="16" r="11.5" fill="none" stroke="currentColor" stroke-width="1.5" />
                    <path d="M12.5 23h8M13.5 15.25h5.75M13.5 15.25v-2.1A4.1 4.1 0 0 1 17.6 9h.1a4.2 4.2 0 0 1 3.5 1.85M13.5 15.25V23"
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="1.5" />
                </svg>
            </div>

            <div class="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-5">
                <div class="min-w-0">
                    <p class="text-[13px] leading-5 text-[#dadbdd] sm:text-[16px]">
                        {{ metric.label }}
                    </p>
                    <p class="mt-1 text-[10px] leading-4 text-[#a1a4aa] sm:text-[14px]">
                        {{ metric.detail }}
                    </p>
                </div>
                <p class="[font-family:var(--font-family-Headings)] text-[clamp(2rem,11vw,2.75rem)] leading-none text-[#00d7a5] sm:text-[clamp(2.5rem,8vw,4rem)] md:text-[clamp(2.75rem,6vw,4rem)]">
                    {{ metric.value }}
                </p>
            </div>
        </article>
    </div>
</template>
