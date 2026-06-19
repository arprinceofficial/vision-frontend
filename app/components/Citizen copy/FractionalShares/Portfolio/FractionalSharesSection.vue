<script setup lang="ts">
const suitImage = '/assets/images/citizen/fractional-shares/suit-display.png'

const fractionalShares = [
    {
        title: 'Mercedes-AMG Petronas - Racing Suit',
        owner: 'Lewis Hamilton',
        year: '2010',
        valueLabel: 'Current Value:',
        value: '£20,000',
        shares: '3% = £600',
        image: suitImage,
        imageAlt: 'Mercedes-AMG Petronas racing suit in a display case',
        imageMode: 'contain' as const,
        valueTone: 'mint' as const
    }
]
</script>

<template>
    <div class="pt-16 sm:pt-20 lg:pt-[144px]">
        <div class="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div class="min-w-0">
                <h2
                    class="[font-family:var(--font-family-Headings)] text-[clamp(2.45rem,12vw,6.125rem)] uppercase leading-[0.85] text-white sm:text-[clamp(3.5rem,8vw,6.125rem)] xl:text-[clamp(4.25rem,6.5vw,6.125rem)]">
                    The
                    <span
                        class="bg-[linear-gradient(160deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                        Fractional Shares
                    </span>
                </h2>
                <p
                    class="mt-1 [font-family:var(--font-family-Headings)] text-[clamp(1.35rem,6.5vw,3.375rem)] uppercase leading-[0.92] text-white sm:text-[clamp(1.9rem,4.5vw,3.375rem)] xl:text-[clamp(2.3rem,3.6vw,3.375rem)]">
                    Your shares of exclusive items
                </p>
            </div>

            <button type="button"
                class="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full bg-white pl-5 pr-2.5 text-[16px] leading-[25px] text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:h-12 sm:w-[240px] sm:gap-4 sm:pl-6 sm:pr-3 sm:text-[20px] xl:mb-1">
                Market Analytics
                <span class="flex size-7 items-center justify-center rounded-full bg-black text-white sm:size-8">
                    <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4 sm:size-[18px]">
                        <path d="M5 15.5 9.2 11l3.4 3.2L19 7.5" fill="none" stroke="currentColor"
                            stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                        <path d="M15.5 7.5H19V11" fill="none" stroke="currentColor" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2" />
                    </svg>
                </span>
            </button>
        </div>

        <div class="mt-8 lg:mt-[60px]">
            <CitizenFractionalSharesPortfolioItemCard v-for="item in fractionalShares" :key="item.title"
                :item="item" />
        </div>
    </div>
</template>
