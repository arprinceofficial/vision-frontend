<script setup lang="ts">
const heroVideo = '/assets/videos/hero-background.mp4'
const volumeIcon = '/assets/images/exclusive-drop/begins/volume.svg'
</script>

<template>
    <section class="relative h-[70vh] min-h-[440px] w-full overflow-hidden bg-black sm:h-[74vh] sm:min-h-[580px] lg:h-[985px]">
        <video class="absolute inset-0 h-full w-full object-cover" :src="heroVideo" autoplay loop muted playsinline
            preload="auto" />

        <div
            class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.75)_80%,#111215_100%)]" />

        <div class="relative mx-auto flex h-full w-full max-w-[1512px] flex-col justify-end p-4 sm:p-6 lg:p-16">

            <!-- Volume Button (Kept absolute, but with normalized spacing) -->
            <button type="button"
                class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/50 p-2 shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:right-6 sm:top-8 lg:right-16 lg:top-16">
                <img :src="volumeIcon" alt="Volume" class="h-4 w-4">
            </button>

            <!-- Text Container (Naturally flows to the bottom using Flexbox) -->
            <div class="flex flex-col pb-4 sm:pb-8 lg:pb-12">
                <p
                    class="[font-family:var(--font-family-Headings)] text-5xl leading-none tracking-tight text-white/90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:text-7xl lg:text-[80px]">
                    The
                </p>

                <p
                    class="bg-[linear-gradient(124.692deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-7xl leading-none tracking-tighter text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] sm:text-9xl lg:text-[240px]">
                    vault
                </p>
            </div>

        </div>
    </section>
</template>
