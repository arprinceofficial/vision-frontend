<script setup lang="ts">
const features = [
    {
        titleTop: 'LIMITED',
        titleBottom: 'TIME',
        description: 'The Vault features a small selection of rare memorabilia. Items are available for a limited number of days.',
        icon: '/assets/images/citizen/the-vault/feature-limited-icon.png',
        titleWidth: 'max-w-[16rem]',
        bodyWidth: 'max-w-[17rem]',
        ringRadius: 'rounded-[148.5px]'
    },
    {
        titleTop: 'UNIQUE',
        titleBottom: 'Stories',
        description: 'Discover the story behind each piece: provenance, media, authentication, and why it matters.',
        icon: '/assets/images/citizen/the-vault/feature-unique-icon.png',
        titleWidth: 'max-w-[17.5rem]',
        bodyWidth: 'max-w-[20.5rem]',
        ringRadius: 'rounded-[56.25px]'
    },
    {
        titleTop: 'FULL',
        titleBottom: 'VERIFICATION',
        description: 'Every item is fully verified and ready to own or gift.',
        icon: '/assets/images/citizen/the-vault/feature-verify-icon.png',
        titleWidth: 'max-w-[18rem]',
        bodyWidth: 'max-w-[16rem]',
        ringRadius: 'rounded-[56.25px]'
    }
]
</script>

<template>
    <section class="bg-black px-3 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16 xl:px-[72px] xl:py-[120px]">
        <div class="mx-auto grid w-full max-w-[1512px] grid-cols-1 items-center gap-4 xl:grid-cols-3 xl:gap-[24px]">
            <article v-for="item in features" :key="item.titleBottom"
                class="relative mx-auto flex h-auto min-h-[25rem] w-full max-w-[441px] flex-col items-center justify-center rounded-[16px] border border-white px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[32rem] xl:h-[591px] xl:px-[24px] xl:py-[36px]">
                <div class="absolute inset-0 rounded-[16px] bg-[rgba(180,174,165,0.1)] backdrop-blur-[50px]" />

                <div class="relative flex flex-col items-center gap-7 lg:gap-8 xl:gap-[44px]">
                    <div class="flex h-[86px] w-[86px] items-center justify-center border-[2px] border-[#d0d1d4] sm:h-[96px] sm:w-[96px] xl:h-[108px] xl:w-[108px] xl:border-[3px]"
                        :class="item.ringRadius">
                        <img :src="item.icon" alt="Feature icon" class="h-[52px] w-[52px] sm:h-[58px] sm:w-[58px] xl:h-[67.5px] xl:w-[67.5px]">
                    </div>

                    <div class="w-full text-center [font-family:var(--font-family-Headings)] tracking-[-1px] xl:tracking-[-4px]"
                        :class="item.titleWidth">
                        <p class="text-[clamp(1.9rem,3.2vw,3.8rem)] leading-[0.82] text-[#d0d1d4] xl:text-[100px] xl:leading-[78px]">{{ item.titleTop }}</p>
                        <p
                            class="bg-[linear-gradient(115deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-[clamp(1.9rem,3.2vw,3.8rem)] leading-[0.82] text-transparent xl:text-[100px] xl:leading-[78px]">
                            {{ item.titleBottom }}
                        </p>
                    </div>

                    <p class="w-full text-center text-[clamp(0.95rem,1.6vw,1.18rem)] font-bold leading-[1.5] text-[#d0d1d4] xl:text-[21.33px] xl:leading-[31.995px]"
                        :class="item.bodyWidth">
                        {{ item.description }}
                    </p>
                </div>

                <div
                    class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
            </article>
        </div>
    </section>
</template>
