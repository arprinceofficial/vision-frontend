<script setup lang="ts">
const heroImage = '/assets/images/citizen/fractional-shares/portfolio-hero.png'
const volumeIcon = '/assets/images/citizen/the-vault/detail/volume-icon.svg'
</script>

<template>
    <section class="relative overflow-hidden bg-black">
        <div class="relative h-[clamp(400px,128vw,560px)] sm:h-[clamp(520px,78vw,700px)] lg:h-[min(845px,calc(100svh-64px))] lg:min-h-[640px]">
            <img :src="heroImage" alt="Historic boxing match in a packed arena"
                class="absolute inset-0 h-full w-full object-cover object-[52%_center] sm:object-center">
            <div
                class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.16)_42%,rgba(0,0,0,0.88)_100%)]" />

            <button type="button"
                class="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/50 p-2 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:right-6 sm:top-6 lg:right-[72px] lg:top-[56px]"
                aria-label="Toggle audio">
                <img :src="volumeIcon" alt="" class="size-4">
            </button>

            <div
                class="relative mx-auto flex h-full w-full max-w-[1512px] flex-col justify-end px-[clamp(0.75rem,4vw,1.5rem)] pb-12 sm:pb-16 lg:px-[66px] lg:pb-[88px]">
                <h1
                    class="[font-family:var(--font-family-Headings)] text-[clamp(3.5rem,18vw,6.5rem)] uppercase leading-[0.8] drop-shadow-[0px_4px_24px_rgba(0,0,0,0.35)] sm:text-[clamp(5rem,13vw,9.625rem)] lg:text-[clamp(7rem,10vw,9.625rem)]">
                    <span
                        class="block bg-[linear-gradient(121deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                        Your
                    </span>
                    <span class="block text-white/95">Portfolio</span>
                </h1>
            </div>
        </div>
    </section>
</template>
