<script setup lang="ts">
const timelineItems = Array.from({ length: 6 }, (_, index) => index)
const overviewCards = Array.from({ length: 3 }, (_, index) => index)
const infoRows = Array.from({ length: 2 }, (_, index) => index)
</script>

<template>
    <div aria-live="polite" aria-busy="true">
        <section class="bg-tccDeepBlack py-8 sm:py-10">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="overflow-hidden rounded-xl border border-white/20 bg-[#11100d] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                    <div class="overflow-x-auto px-4 py-5 sm:px-6">
                        <ol class="relative grid min-w-[820px] grid-cols-6 gap-3">
                            <li v-for="item in timelineItems" :key="`timeline-skeleton-${item}`" class="relative">
                                <div
                                    v-if="item < timelineItems.length - 1"
                                    class="absolute left-[calc(50%+1.3rem)] right-[calc(-50%+1.3rem)] top-5 h-px bg-white/10"
                                />
                                <div class="relative z-10 flex w-full flex-col items-center gap-2 text-center">
                                    <span
                                        class="grid h-10 w-10 animate-pulse place-items-center rounded-full border border-white/10 bg-white/[0.04]"
                                        :class="item === 0 ? 'border-tccGold bg-tccGold/15 shadow-[0_0_0_6px_rgba(247,198,0,0.08)]' : ''"
                                    >
                                        <span
                                            class="block h-4 w-4 rounded-full"
                                            :class="item === 0 ? 'bg-tccGold/45' : 'bg-white/15'"
                                        />
                                    </span>
                                    <span
                                        class="block h-3 animate-pulse rounded-full bg-white/12"
                                        :class="item === 0 ? 'w-28' : item === 1 ? 'w-20' : item === 4 ? 'w-28' : 'w-24'"
                                    />
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-tccDeepBlack pb-14 sm:pb-16">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="mb-6 grid gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-3">
                    <div v-for="item in ['vehicle', 'allocation', 'reference']" :key="item">
                        <span class="block h-2.5 w-20 animate-pulse rounded-full bg-white/10" />
                        <strong
                            class="mt-3 block h-4 animate-pulse rounded-full"
                            :class="item === 'reference' ? 'w-24 bg-tccGold/25' : item === 'vehicle' ? 'w-48 bg-white/12' : 'w-32 bg-white/12'"
                        />
                    </div>
                </div>

                <div
                    class="rounded-xl border border-tccGold/20 bg-[#0b0a08] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] sm:p-6 lg:p-7">
                    <div class="rounded-lg border border-white/10 bg-[#11100d] p-5 text-white sm:p-7 lg:p-8">
                        <div class="text-center">
                            <span
                                class="mx-auto grid h-14 w-14 animate-pulse place-items-center rounded-full bg-tccDeepBlack text-tccGold shadow-lg shadow-tccGold/10 ring-1 ring-tccGold/35">
                                <span class="block h-6 w-6 rounded-full bg-tccGold/35" />
                            </span>
                            <span class="mx-auto mt-5 block h-8 w-72 max-w-full animate-pulse rounded-lg bg-white/12" />
                        </div>

                        <div class="mt-7 grid gap-4 lg:grid-cols-3">
                            <article
                                v-for="card in overviewCards"
                                :key="`overview-card-skeleton-${card}`"
                                class="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-center shadow-sm"
                            >
                                <span
                                    class="mx-auto grid h-12 w-12 animate-pulse place-items-center rounded-full bg-tccDeepBlack ring-1 ring-tccGold/30">
                                    <span class="block h-5 w-5 rounded-full bg-tccGold/30" />
                                </span>
                                <span class="mx-auto mt-5 block h-5 w-40 animate-pulse rounded-full bg-white/12" />
                                <div class="mt-4 space-y-2">
                                    <span class="mx-auto block h-3 w-full animate-pulse rounded-full bg-white/10" />
                                    <span class="mx-auto block h-3 w-11/12 animate-pulse rounded-full bg-white/10" />
                                    <span class="mx-auto block h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
                                </div>
                            </article>
                        </div>

                        <div class="mt-7 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                            <div class="flex items-center gap-3">
                                <span class="h-4 w-4 animate-pulse rounded-full bg-tccGold/35" />
                                <span class="h-5 w-44 animate-pulse rounded-full bg-white/12" />
                            </div>
                            <div class="mt-4 space-y-3">
                                <div
                                    v-for="row in infoRows"
                                    :key="`info-row-skeleton-${row}`"
                                    class="flex gap-3 rounded-md border-l-4 border-tccGold bg-tccDeepBlack/80 p-4"
                                >
                                    <span class="mt-1 h-4 w-4 shrink-0 animate-pulse rounded-full bg-tccGold/35" />
                                    <div class="min-w-0 flex-1 space-y-2">
                                        <span class="block h-3 w-full animate-pulse rounded-full bg-white/10" />
                                        <span class="block h-3 w-10/12 animate-pulse rounded-full bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="mt-6 flex flex-col gap-4 rounded-lg border border-tccGold/40 bg-tccGold/10 p-4 sm:flex-row sm:items-center">
                            <span class="h-11 w-11 shrink-0 animate-pulse rounded-full bg-tccDeepBlack" />
                            <div class="min-w-0 flex-1">
                                <span class="block h-4 w-28 animate-pulse rounded-full bg-white/12" />
                                <span class="mt-3 block h-3 w-72 max-w-full animate-pulse rounded-full bg-white/10" />
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center">
                        <span
                            class="mx-auto block h-11 w-48 animate-pulse rounded-full bg-tccGold/45 shadow-[0_0_28px_rgba(247,198,0,0.16)]"
                        />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
