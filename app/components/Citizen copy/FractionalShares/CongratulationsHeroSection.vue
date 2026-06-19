<script setup lang="ts">
const heroFrame = '/assets/images/citizen/congratulations/hero-frame.png'
const volumeIcon = '/assets/images/citizen/the-vault/detail/volume-icon.svg'
</script>

<template>
    <section class="relative overflow-hidden bg-black">
        <div class="relative h-[clamp(520px,150vw,680px)] sm:h-[720px] lg:h-[985px]">
            <img :src="heroFrame" alt="Lewis Hamilton celebrating on the podium"
                class="absolute inset-0 h-full w-full object-cover object-[42%_center] sm:object-[40%_center]">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.16)_45%,rgba(0,0,0,0.84)_100%)] sm:bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.18)_52%,rgba(0,0,0,0.68)_100%)]" />

            <button type="button"
                class="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/50 p-2 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:right-6 sm:top-6 lg:right-[72px] lg:top-[158px]"
                aria-label="Toggle audio">
                <img :src="volumeIcon" alt="" class="size-4">
            </button>

            <div class="relative mx-auto flex h-full w-full max-w-[1512px] flex-col items-center justify-end px-3 pb-16 text-center sm:items-end sm:px-6 sm:pb-[88px] sm:text-right lg:px-[72px] lg:pb-[76px]">
                <h1
                    class="max-w-full whitespace-nowrap bg-[linear-gradient(144deg,#bc9a1d_28.673%,#f3df82_52%,#ffffff_84%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.25rem,11.5vw,4.75rem)] leading-[0.82] text-transparent drop-shadow-[0px_4px_24px_rgba(0,0,0,0.35)] sm:max-w-[920px] sm:text-[clamp(4.5rem,11vw,9.625rem)] sm:leading-[0.7]">
                    congratulations
                </h1>
                <p class="mt-3 max-w-[min(100%,24rem)] text-[clamp(0.95rem,4vw,1.35rem)] font-medium lowercase leading-tight text-[#dadbdd] drop-shadow-[0px_4px_18px_rgba(0,0,0,0.45)] sm:mt-5 sm:max-w-[780px] sm:text-[clamp(1.15rem,2.55vw,2rem)]">
                    you own 3% of lewis hamilton&rsquo;s racing suit
                </p>
            </div>
        </div>
    </section>
</template>
