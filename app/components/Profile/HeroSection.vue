<script setup lang="ts">
const heroBackground = '/assets/images/profile/hero-bg.png'
const volumeIcon = '/assets/images/citizen/icons/volume-icon.svg'
</script>

<template>
    <section class="relative isolate overflow-hidden bg-black">
        <div class="absolute inset-0">
            <img :src="heroBackground" alt="" class="h-full w-full object-cover opacity-80" />
            <div
                class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.5)_58%,#000_100%)]" />
            <div
                class="absolute inset-x-0 bottom-0 h-[140px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_100%)] sm:h-[180px]" />
        </div>

        <div
            class="relative mx-auto flex min-h-[360px] max-w-[1512px] items-end px-4 pb-[28px] pt-[118px] sm:min-h-[420px] sm:px-6 sm:pb-[36px] sm:pt-[132px] lg:h-[628px] lg:px-[74px] lg:pb-[32px] lg:pt-[180px]">
            <div>
                <p
                    class="[font-family:var(--font-family-Headings)] text-[42px] uppercase leading-[0.84] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[63px]">
                    complete your
                </p>
                <p
                    class="bg-[linear-gradient(133deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[88px] uppercase leading-[0.84] tracking-[-0.03em] text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-[116px] lg:text-[154px]">
                    profile
                </p>
            </div>
        </div>
    </section>
</template>
