<script setup lang="ts">
const storyBg = '/assets/images/citizen/fractional-shares/story-bg.png'
</script>

<template>
    <section class="bg-black">
        <div class="mx-auto w-full max-w-[1512px] px-4 pb-14 pt-16 sm:px-6 lg:px-[72px] lg:pb-24 lg:pt-[103px]">
            <div class="max-w-[668px]">
                <p
                    class="bg-[linear-gradient(152deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.8rem,5.3vw,4.9375rem)] uppercase leading-[0.8] text-transparent">
                    Lewis Hamilton
                </p>
                <h2 class="[font-family:var(--font-family-Headings)] text-[clamp(3rem,12vw,7.6875rem)] uppercase leading-[0.82] text-white">
                    The Story So Far
                </h2>

                <div class="mt-10 space-y-6 text-[16px] leading-6 text-[#d0d1d4] lg:mt-[69px] lg:text-[20px] lg:leading-7">
                    <p>
                        Lewis Hamilton is one of the most legendary drivers in Formula 1 history, known not just for his record-breaking speed but for the passion he brings to every race. With seven World Championships and more Grand Prix wins than any driver ever, he’s become the face of modern F1.
                    </p>
                    <p>
                        He also holds the record for the most pole positions in the sport, showcasing his unmatched qualifying skill. From his groundbreaking rookie season to becoming a global icon for excellence and resilience, Hamilton continues to shape the legacy of Formula 1.
                    </p>
                </div>

                <div class="mt-10 flex flex-col gap-4 sm:max-w-[360px]">
                    <button type="button"
                        class="flex h-12 w-full items-center justify-center rounded-full px-8 py-2 text-[20px] leading-[25px] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)]"
                        style="background-image: linear-gradient(-26deg, rgba(255,255,255,0) 28.673%, rgba(255,255,255,0.1) 71.327%), linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%);">
                        Follow Lewis
                    </button>
                    <NuxtLink to="/icons"
                        class="flex h-12 w-full items-center justify-center rounded-full px-8 py-2 text-[20px] leading-[30px] text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)]"
                        style="background-image: linear-gradient(154deg,#977b13 28.673%,#d4af37 71.327%);">
                        Meet Our Icons
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="relative h-[420px] overflow-hidden sm:h-[620px] lg:h-[925px]">
            <img :src="storyBg" alt="Lewis Hamilton celebrating with a trophy"
                class="absolute inset-0 h-full w-full object-cover object-bottom">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_68%,rgba(0,0,0,0.2)_100%)]" />
        </div>
    </section>
</template>
