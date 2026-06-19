<script setup lang="ts">
const tabs = [
    { label: 'Home', active: true },
    { label: 'Popular', active: false },
    { label: 'Sports', active: false, hasBadge: true },
    { label: 'Icons', active: false, hasBadge: true }
]
</script>

<template>
    <section
        class="mx-auto w-full max-w-[1512px] px-4 pt-8 [font-family:var(--font-family-Body)] sm:px-6 lg:px-[72px] lg:pt-14">
        <div class="w-full">
            <h1
                class="[font-family:var(--font-family-Headings)] text-[clamp(2rem,7vw,4.875rem)] uppercase leading-[0.9] text-[#d9dadc]">
                BE PART OF THE <span class="text-[#b99a1d]">CONVERSATION</span>
            </h1>

            <div class="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex flex-wrap items-center gap-3">
                    <button v-for="tab in tabs" :key="tab.label" type="button"
                        class="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[clamp(0.78rem,1.7vw,0.95rem)] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition hover:bg-white/90 sm:px-5"
                        :class="tab.active ? 'font-medium' : 'font-normal'">
                        <span>{{ tab.label }}</span>
                        <span v-if="tab.hasBadge"
                            class="inline-flex h-5 w-5 p-1 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 14 8"
                                fill="none">
                                <path d="M0.999999 1L7 7L13 1" stroke="white" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>

                        </span>
                    </button>

                    <button type="button"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition hover:bg-white/90"
                        aria-label="Add category">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 6V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            <path d="M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </button>

                </div>

                <label
                    class="flex h-10 w-full items-center gap-3 rounded-full border border-white/30 bg-[#4f535b] px-4 lg:max-w-[360px]"
                    for="fan-zone-search">
                    <svg class="h-4 w-4 text-white/90" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
                        <path d="M20 20L16.7 16.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <input id="fan-zone-search" type="text" placeholder="Search..."
                        class="w-full bg-transparent text-sm text-white placeholder:text-white/80 focus:outline-none">
                </label>
            </div>
        </div>
    </section>
</template>
