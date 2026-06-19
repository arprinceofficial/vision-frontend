<script setup lang="ts">
const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']
const values = ['20,000k', '19,000k', '18,000k', '17,000k', '16,000k']
</script>

<template>
    <section class="bg-[#111215] px-4 py-14 sm:px-6 lg:px-[72px] lg:py-[120px]">
        <div class="mx-auto w-full max-w-[1371px]">
            <h2
                class="[font-family:var(--font-family-Headings)] text-[clamp(3rem,6.5vw,6.125rem)] uppercase leading-[0.8] text-white">
                Historic
                <span class="bg-[linear-gradient(150deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                    Value
                </span>
            </h2>

            <div class="mt-12 pb-4 lg:mt-[110px]">
                <div class="w-full min-w-0">
                    <div class="mb-8 flex items-center justify-between text-[16px] leading-6 text-white sm:text-[18px] sm:leading-7 lg:text-[23px]">
                        <span>Growth</span>
                        <button type="button" class="inline-flex items-center gap-3">
                            Yearly
                            <span class="block size-2 rotate-45 border-b border-r border-white" />
                        </button>
                    </div>

                    <div class="grid min-w-0 grid-cols-[48px_minmax(0,1fr)] gap-3 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-5 lg:grid-cols-[92px_minmax(0,1fr)]">
                        <div class="flex h-[220px] flex-col justify-between text-[12px] font-medium leading-none text-[#7d7d7d] sm:h-[320px] sm:text-[18px] lg:h-[360px] lg:text-[28px]">
                            <span v-for="value in values" :key="value">{{ value }}</span>
                        </div>
                        <div class="relative h-[280px] min-w-0 pr-1 sm:h-[390px] sm:pr-4 lg:h-[430px] lg:pr-6">
                            <svg viewBox="0 0 1120 430" class="h-full w-full overflow-visible" aria-label="Historic value growth chart">
                                <defs>
                                    <linearGradient id="historicAreaGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stop-color="#00d7a5" stop-opacity="0.38" />
                                        <stop offset="100%" stop-color="#00d7a5" stop-opacity="0" />
                                    </linearGradient>
                                </defs>
                                <g stroke="#dadbdd" stroke-width="2" opacity="0.95">
                                    <line v-for="index in 5" :key="`h-${index}`" x1="0" :y1="20 + (index - 1) * 70" x2="1050" :y2="20 + (index - 1) * 70" />
                                    <line v-for="index in 8" :key="`v-${index}`" :x1="70 + (index - 1) * 140" y1="0" :x2="70 + (index - 1) * 140" y2="300" />
                                    <line x1="1110" y1="0" x2="1110" y2="300" />
                                </g>
                                <path d="M35 260 L175 240 L315 150 L455 90 L595 250 L735 215 L875 85 L1020 20 L1020 300 L35 300 Z"
                                    fill="url(#historicAreaGradient)" />
                                <polyline points="35,260 175,240 315,150 455,90 595,250 735,215 875,85 1020,20"
                                    fill="none" stroke="#00d7a5" stroke-width="3" stroke-dasharray="5 8"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <div class="absolute bottom-0 left-0 right-1 grid grid-cols-8 text-center text-[10px] font-medium leading-none text-[#7d7d7d] sm:right-4 sm:text-[16px] lg:right-8 lg:text-[28px]">
                                <span v-for="year in years" :key="year">{{ year }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
