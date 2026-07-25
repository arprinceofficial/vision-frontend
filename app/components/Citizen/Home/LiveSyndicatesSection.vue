<script setup lang="ts">
const liveSyndicate = {
    status: 'Live Now',
    slug: 'lamborghini-diablo-vt-roadster',
    image: '/generated/hero-aston-studio.png',
    alt: 'Supercar Driver Modern Classics Collection',
    collection: 'Supercar Driver Modern Classics Collection',
    title: 'Lamborghini Diablo VT Roadster',
    description:
        'The Lamborghini Diablo VT Roadster, a rare open-top V12 icon, combines extreme 1990s presence with landmark brand significance. A scarce pre-Audi Lamborghini with growing collector appeal.',
    allocations: '80',
    cagr: 'up to 18% CAGR',
    progress: 79
}
</script>

<template>
    <section id="live-syndicates" class="border-b border-white/10 bg-[#080705] py-12 text-white sm:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h2 class="font-poppins text-[clamp(2rem,5vw,3.75rem)] font-black leading-tight text-white">
                    Live <span class="text-tccGold">Syndicates</span>
                </h2>
            </div>

            <article
                class="w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#10100e] shadow-[0_18px_55px_rgba(0,0,0,0.32)]">
                <div class="relative h-52 overflow-hidden bg-tccDeepBlack sm:h-60">
                    <span
                        class="absolute left-4 top-4 z-10 rounded-md bg-emerald-600 px-3 py-1.5 font-poppins text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        {{ liveSyndicate.status }}
                    </span>
                    <img :src="liveSyndicate.image" :alt="liveSyndicate.alt"
                        class="absolute inset-0 h-full w-full object-cover opacity-85">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#10100e] via-transparent to-black/10" />
                </div>

                <div class="p-5 sm:p-6">
                    <span class="font-poppins text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">{{
                        liveSyndicate.collection }}</span>
                    <h3 class="mt-5 font-poppins text-xl font-bold leading-tight text-white sm:text-2xl">{{ liveSyndicate.title }}
                    </h3>
                    <p class="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/65 sm:text-sm">{{ liveSyndicate.description }}
                    </p>

                    <div
                        class="my-5 grid grid-cols-2 overflow-hidden rounded-md border border-white/15 bg-white/[0.03]">
                        <div class="border-r border-white/15 px-3 py-3">
                            <strong class="block font-poppins text-lg font-bold text-tccGold">{{
                                liveSyndicate.allocations }}</strong>
                            <span
                                class="mt-1 block font-poppins text-[9px] uppercase tracking-[0.18em] text-white/45">Allocations</span>
                        </div>
                        <div class="px-3 py-3 text-right">
                            <strong class="block font-poppins text-base font-bold text-tccGold sm:text-lg">{{ liveSyndicate.cagr
                                }}</strong>
                            <span
                                class="mt-1 block font-poppins text-[9px] uppercase tracking-[0.18em] text-white/45">Forecasted
                                CAGR</span>
                        </div>
                    </div>

                    <div>
                        <div class="mb-2 flex items-center justify-between text-xs">
                            <span class="font-medium text-white/70">Funding Progress</span>
                            <span class="font-bold text-tccGold">{{ liveSyndicate.progress }}%</span>
                        </div>
                        <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
                            <div class="h-full rounded-full bg-tccGold"
                                :style="{ width: `${liveSyndicate.progress}%` }" />
                        </div>
                    </div>

                    <NuxtLink :to="`/syndicates/${liveSyndicate.slug}`"
                        class="mt-5 block rounded-md bg-tccGold px-5 py-3 text-center font-poppins text-[11px] font-black uppercase tracking-[0.22em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                        Invest Now
                    </NuxtLink>
                </div>
            </article>
        </div>
    </section>
</template>
