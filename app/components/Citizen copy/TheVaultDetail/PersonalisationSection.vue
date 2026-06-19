<script setup lang="ts">
const proofRing = '/assets/images/citizen/the-vault/detail/proof-ring.svg'
const proofCore = '/assets/images/citizen/the-vault/detail/proof-core.svg'
const giftIcon = '/assets/images/citizen/the-vault/detail/gift-icon.svg'
const careIcon = '/assets/images/citizen/the-vault/detail/care-icon.svg'
</script>

<template>
    <section class="bg-black px-3 py-10 sm:px-6 sm:py-14 lg:px-[72px] lg:py-[120px]">
        <div class="mx-auto w-full max-w-[1371px]">
            <h2
                class="text-center [font-family:var(--font-family-Headings)] text-[clamp(2rem,6.2vw,6.125rem)] leading-[0.8] tracking-[-0.02em] text-white/90">
                MAKE IT YOUR OWN WITH
                <span
                    class="bg-[linear-gradient(155deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                    &nbsp;PERSONALISATION
                </span>
            </h2>

            <div class="mt-8 grid grid-cols-1 gap-4 lg:mt-[120px] xl:grid-cols-3 xl:gap-[24px]">
                <article
                    class="relative flex min-h-[24rem] flex-col items-center justify-center rounded-[16px] border border-white px-4 py-8 sm:min-h-[28rem] sm:px-6 sm:py-10 lg:h-[591px] lg:px-[24px] lg:py-[36px]">
                    <div class="absolute inset-0 rounded-[16px] bg-[rgba(180,174,165,0.1)] backdrop-blur-[50px]" />

                    <div class="relative flex flex-col items-center gap-7 sm:gap-8 lg:gap-[44px]">
                        <div class="relative h-[190px] w-[190px] sm:h-[240px] sm:w-[240px] lg:h-[340px] lg:w-[336px]">
                            <img :src="proofRing" alt="" class="absolute inset-0 size-full">
                        </div>

                        <p
                            class="bg-[linear-gradient(162.7deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-center text-[clamp(1.35rem,3.4vw,2.37rem)] font-bold leading-[1.1] tracking-[-0.03em] text-transparent">
                            Personal Certificate
                        </p>
                    </div>

                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
                </article>

                <article
                    class="relative flex min-h-[24rem] flex-col items-center justify-center rounded-[16px] border border-white px-4 py-8 sm:min-h-[28rem] sm:px-6 sm:py-10 lg:h-[591px] lg:px-[24px] lg:py-[36px]">
                    <div class="absolute inset-0 rounded-[16px] bg-[rgba(180,174,165,0.1)] backdrop-blur-[50px]" />

                    <div class="relative flex flex-col items-center gap-7 sm:gap-8 lg:gap-[44px]">
                        <p
                            class="[font-family:var(--font-family-Headings)] text-[clamp(2.3rem,7vw,6.25rem)] leading-[0.78] tracking-[-0.04em] text-[#d4af37]">
                            GIFTING
                        </p>
                        <img :src="giftIcon" alt="Gifting" class="size-[130px] sm:size-[160px] lg:size-[200px]">
                        <p class="max-w-[273px] text-center text-[clamp(0.95rem,2.1vw,1.25rem)] font-semibold leading-[1.4] text-[#d0d1d4]">
                            Need an idea for a loved one? Why not gift a memory they will never forget.
                        </p>
                    </div>

                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
                </article>

                <article
                    class="relative flex min-h-[24rem] flex-col items-center justify-center rounded-[16px] border border-white px-4 py-8 sm:min-h-[28rem] sm:px-6 sm:py-10 lg:h-[591px] lg:px-[24px] lg:py-[36px]">
                    <div class="absolute inset-0 rounded-[16px] bg-[rgba(180,174,165,0.1)] backdrop-blur-[50px]" />

                    <div class="relative flex flex-col items-center gap-7 sm:gap-8 lg:gap-[44px]">
                        <p
                            class="[font-family:var(--font-family-Headings)] text-[clamp(2.3rem,7vw,6.25rem)] leading-[0.78] tracking-[-0.04em] text-[#d4af37]">
                            CARE GUIDE
                        </p>
                        <img :src="careIcon" alt="Care guide" class="size-[130px] sm:size-[160px] lg:size-[200px]">
                        <p class="max-w-[311px] text-center text-[clamp(0.95rem,2.1vw,1.25rem)] font-semibold leading-[1.4] text-[#d0d1d4]">
                            Take care of your item once you have received it to ensure it stands the test of time.
                        </p>
                    </div>

                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
                </article>
            </div>
        </div>
    </section>
</template>
