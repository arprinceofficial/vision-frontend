<script setup lang="ts">
const sortIcon = '/assets/images/citizen/the-vault/sort-icon.png'
</script>

<template>
    <section class="bg-black px-3 py-4 sm:px-6 sm:py-6 lg:px-[72px] lg:py-[32px]">
        <div class="mx-auto flex w-full max-w-[1512px] flex-wrap items-center justify-start gap-2 sm:gap-3 lg:justify-end lg:gap-[16px]">
            <button type="button"
                class="flex h-10 min-w-[128px] items-center justify-end gap-2 rounded-[999px] bg-white px-3 py-1 text-[clamp(0.9rem,2.1vw,1.25rem)] leading-[1.2] text-black shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:h-11 sm:min-w-[138px] sm:gap-3 sm:px-4 lg:h-[48px] lg:w-[148px] lg:gap-[16px] lg:py-[4px] lg:pl-[24px] lg:pr-[10px] lg:text-[20px] lg:leading-[25px]">
                <span>Sort by</span>
                <span class="flex h-7 w-7 items-center justify-center rounded-full bg-black sm:h-8 sm:w-8 lg:h-[32px] lg:w-[32px]">
                    <img :src="sortIcon" alt="Sort" class="h-4 w-4 lg:h-[18px] lg:w-[18px]">
                </span>
            </button>

            <button type="button"
                class="h-10 min-w-[112px] rounded-[999px] bg-white px-4 py-1 text-[clamp(0.9rem,2.1vw,1.25rem)] leading-[1.2] text-black shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:h-11 sm:min-w-[128px] sm:px-5 lg:h-[48px] lg:w-[148px] lg:px-[24px] lg:py-[4px] lg:text-[20px] lg:leading-[25px]">
                Price
            </button>

            <button type="button"
                class="h-10 min-w-[128px] rounded-[999px] bg-white px-4 py-1 text-[clamp(0.9rem,2.1vw,1.25rem)] leading-[1.2] text-black shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:h-11 sm:min-w-[138px] sm:px-5 lg:h-[48px] lg:w-[148px] lg:px-[24px] lg:py-[4px] lg:text-[20px] lg:leading-[25px]">
                Time Left
            </button>
        </div>
    </section>
</template>
