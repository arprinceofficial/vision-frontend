<script setup lang="ts">
const sortIcon = '/assets/images/citizen/the-vault/sort-icon.png'
const glovesImage = '/assets/images/citizen/fractional-shares/portfolio-gloves.png'

const exclusiveItems = [
    {
        title: 'Championship Winning Gloves',
        owner: 'Johnny Nelson',
        year: '2003',
        valueLabel: 'Value:',
        value: '£65,000',
        image: glovesImage,
        imageAlt: 'Red championship boxing gloves on a ring mat',
        authenticated: true,
        imageMode: 'cover' as const,
        valueTone: 'gold' as const
    }
]
</script>

<template>
    <div class="pt-12 sm:pt-16 lg:pt-[98px]">
        <div class="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div class="min-w-0">
                <h2
                    class="[font-family:var(--font-family-Headings)] text-[clamp(2.45rem,12vw,6.125rem)] uppercase leading-[0.85] text-white sm:text-[clamp(3.5rem,8vw,6.125rem)] xl:text-[clamp(4.25rem,6.5vw,6.125rem)]">
                    The
                    <span
                        class="bg-[linear-gradient(157deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                        Exclusive Items
                    </span>
                </h2>
                <p
                    class="mt-1 [font-family:var(--font-family-Headings)] text-[clamp(1.35rem,6.5vw,3.375rem)] uppercase leading-[0.92] text-white sm:text-[clamp(1.9rem,4.5vw,3.375rem)] xl:text-[clamp(2.3rem,3.6vw,3.375rem)]">
                    Your most prized possessions from our auctions
                </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center xl:pb-1">
                <button type="button"
                    class="inline-flex h-11 w-full items-center justify-center rounded-full px-6 py-2 text-[16px] leading-[30px] text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:h-12 sm:w-[260px] sm:px-8 sm:text-[20px]"
                    style="background-image: linear-gradient(153deg, rgba(255,255,255,0) 29.076%, rgba(255,255,255,0.1) 70.924%), linear-gradient(90deg, rgb(34,37,43) 0%, rgb(34,37,43) 100%);">
                    Purchase History
                </button>
                <button type="button"
                    class="inline-flex h-11 w-full items-center justify-center gap-3 rounded-full bg-white pl-5 pr-2.5 text-[16px] leading-[25px] text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:h-12 sm:w-[148px] sm:gap-4 sm:pl-6 sm:pr-3 sm:text-[20px]">
                    Sort by
                    <span class="flex size-7 items-center justify-center rounded-full bg-black p-2 sm:size-8">
                        <img :src="sortIcon" alt="" class="size-4 brightness-0 invert sm:size-[18px]">
                    </span>
                </button>
            </div>
        </div>

        <div class="mt-8 lg:mt-[60px]">
            <CitizenFractionalSharesPortfolioItemCard v-for="item in exclusiveItems" :key="item.title"
                :item="item" />
        </div>
    </div>
</template>
