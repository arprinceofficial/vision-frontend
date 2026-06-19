<script setup lang="ts">
const heroVideo = '/assets/videos/bg-lewis.mp4'
const volumeIcon = '/assets/images/citizen/the-vault/detail/volume-icon.svg'
const daysIcon = '/assets/images/citizen/the-vault/detail/days-icon.svg'
</script>

<template>
    <section class="relative overflow-hidden bg-black">
        <div class="relative h-[680px] sm:h-[820px] lg:hidden">
            <video class="absolute inset-0 h-full w-full object-cover" :src="heroVideo" autoplay muted loop playsinline
                preload="auto" />

            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.82)_100%)]" />

            <div class="relative mx-auto flex h-full w-full max-w-[1512px] flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-10">
                <button type="button"
                    class="absolute right-4 top-4 flex size-[32px] items-center justify-center rounded-full bg-white/50 p-[8px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)] sm:right-6 sm:top-6">
                    <img :src="volumeIcon" alt="Volume" class="size-[16px]">
                </button>

                <div
                    class="mb-4 inline-flex h-[40px] w-fit items-center justify-center gap-2 rounded-[999px] bg-white py-[4px] pl-[8px] pr-[16px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                    <span class="flex size-[28px] items-center justify-center rounded-full bg-black p-[6px]">
                        <img :src="daysIcon" alt="Days" class="size-[16px]">
                    </span>
                    <span class="text-[14px] leading-[20px] text-black sm:text-[16px]">3 Days Remaining</span>
                </div>

                <p
                    class="bg-[linear-gradient(155.04deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.2rem,9vw,4.8rem)] leading-[0.8] text-transparent drop-shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
                    LEWIS HAMILTON&apos;S
                </p>

                <p
                    class="mt-1 [font-family:var(--font-family-Headings)] text-[clamp(2rem,8vw,4.8rem)] leading-[0.8] text-white/90 drop-shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                    HELMET FUJI 2007
                </p>

                <p class="mt-4 max-w-[52ch] text-[clamp(0.95rem,2.8vw,1.125rem)] leading-[1.45] text-[#dadbdd] invisible">
                    Experience a collector&apos;s masterpiece inspired by one of Lewis Hamilton&apos;s most iconic helmet
                    designs.
                    The Fuji 07 edition blends racing heritage with precision craftsmanship, making it a must own piece for
                    fans,
                    collectors and motorsport enthusiasts.
                </p>
            </div>
        </div>

        <div class="relative hidden h-[1252px] overflow-hidden bg-black lg:block">
        <video class="absolute inset-0 h-full w-full object-cover" :src="heroVideo" autoplay muted loop playsinline
            preload="auto" />

        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.82)_100%)]" />

        <div class="absolute bottom-0 left-1/2 h-[396px] w-[1518px] -translate-x-1/2 mix-blend-multiply"
            style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.24) 35.096%, rgba(0, 0, 0, 0.12) 48.558%, rgba(0, 0, 0, 0.09) 62.981%, rgba(0, 0, 0, 0.06) 76.923%, rgba(0, 0, 0, 0.03) 86.538%, rgba(0, 0, 0, 0.018) 94.712%);" />

        <div class="relative mx-auto h-full w-full max-w-[1512px]">
            <button type="button"
                class="absolute right-[72px] top-[158px] flex size-[32px] items-center justify-center rounded-full bg-white/50 p-[8px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                <img :src="volumeIcon" alt="Volume" class="size-[16px]">
            </button>

            <div
                class="absolute left-[70px] top-[521px] flex h-[48px] items-center justify-center gap-[10px] rounded-[999px] bg-white py-[4px] pl-[10px] pr-[24px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                <span class="flex size-[32px] items-center justify-center rounded-full bg-black p-[8px]">
                    <img :src="daysIcon" alt="Days" class="size-[20px]">
                </span>
                <span class="text-[20px] leading-[25px] text-black">3 Days Remaining</span>
            </div>

            <p
                class="absolute left-[63px] top-[601px] bg-[linear-gradient(155.04deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[154px] leading-[123px] text-transparent drop-shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
                LEWIS HAMILTON&apos;S
            </p>

            <p
                class="absolute left-[63px] top-[713px] [font-family:var(--font-family-Headings)] text-[154px] leading-[123px] text-white/90 drop-shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                HELMET FUJI 2007
            </p>

            <p class="absolute left-[70px] top-[860px] w-[788px] text-[20px] leading-[28px] text-[#dadbdd]">
                Experience a collector&apos;s masterpiece inspired by one of Lewis Hamilton&apos;s most iconic helmet
                designs.
                The Fuji 07 edition blends racing heritage with precision craftsmanship, making it a must own piece for
                fans,
                collectors and motorsport enthusiasts.
            </p>
        </div>
        </div>
    </section>
</template>
