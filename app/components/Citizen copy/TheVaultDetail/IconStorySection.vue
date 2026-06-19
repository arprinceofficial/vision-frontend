<script setup lang="ts">
const heroPhoto = '/assets/images/citizen/the-vault/detail/spotlight-bg-lewis.jpg'
const itemOne = '/assets/images/citizen/the-vault/detail/icon-item-01.png'
const itemTwo = '/assets/images/citizen/the-vault/detail/icon-item-03.jpg'
</script>

<template>
    <section class="relative overflow-hidden bg-black">
        <div class="relative lg:hidden">
            <div class="relative min-h-[980px] sm:min-h-[1100px]">
                <img :src="heroPhoto" alt="Lewis Hamilton" class="absolute inset-0 h-full w-full object-cover grayscale">
                <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.88)_100%)]" />

                <div class="relative mx-auto w-full max-w-[1371px] px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
                    <div class="flex flex-col items-center gap-5 text-center sm:gap-6">
                        <h2
                            class="bg-[linear-gradient(152.61deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.3rem,9vw,5.4rem)] leading-[0.82] text-transparent drop-shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
                            LEWIS HAMILTON
                        </h2>

                        <button type="button"
                            class="flex h-11 w-full max-w-[320px] items-center justify-center rounded-[999px] px-8 py-2 text-[clamp(1rem,2.4vw,1.25rem)] leading-[1.2] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)]"
                            style="background-image: linear-gradient(-26.19deg, rgba(255,255,255,0) 28.673%, rgba(255,255,255,0.1) 71.327%), linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%);">
                            Follow Lewis
                        </button>
                    </div>

                    <blockquote
                        class="mt-10 whitespace-pre-wrap text-center text-[clamp(1.4rem,5vw,2.3rem)] italic leading-[1.1] text-white drop-shadow-[0px_3px_18px_rgba(0,0,0,0.25)] sm:mt-12">
                        &quot;That&apos;s when it all started...
                        I went from a driver
                        to the driver&quot;
                    </blockquote>

                    <div class="mt-12 sm:mt-16">
                        <p class="[font-family:var(--font-family-Headings)] text-[clamp(1.8rem,6vw,3.2rem)] leading-[0.9] text-white">
                            ITEMS FROM THIS ICON
                        </p>

                        <button type="button"
                            class="mt-4 flex h-9 w-[130px] items-center justify-center rounded-[999px] bg-white px-8 py-2 text-[14px] leading-[18px] text-black shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                            See All
                        </button>

                        <article
                            class="relative mt-5 overflow-hidden rounded-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.25)]">
                            <div class="absolute inset-0 rounded-[16px] border border-white bg-black/20 backdrop-blur-[50px]" />

                            <div class="relative grid grid-cols-2 gap-2 p-2">
                                <div class="h-[180px] overflow-hidden rounded-[12px] bg-white sm:h-[220px]">
                                    <img :src="itemOne" alt="Icon item one" class="h-full w-full object-cover">
                                </div>
                                <div class="h-[180px] overflow-hidden rounded-[12px] bg-white sm:h-[220px]">
                                    <img :src="itemTwo" alt="Icon item two" class="h-full w-full object-cover">
                                </div>
                            </div>

                            <div
                                class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
                        </article>
                    </div>
                </div>
            </div>
        </div>

    <section class="relative hidden h-[1965px] overflow-hidden bg-black lg:block">
        <img :src="heroPhoto" alt="Lewis Hamilton" class="absolute inset-0 h-full w-full object-cover grayscale">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.88)_100%)]" />

        <div class="relative mx-auto h-full w-full max-w-[1371px]">
            <div class="flex flex-col items-center justify-center w-full gap-[32px] pt-[88px]">
                <h2
                    class="bg-[linear-gradient(152.61deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[154px] leading-[123px] text-transparent drop-shadow-[0px_4px_24px_rgba(0,0,0,0.4)]">
                    LEWIS HAMILTON
                </h2>

                <button type="button"
                    class="flex h-[48px] w-[360px] items-center justify-center rounded-[999px] px-[32px] py-[10px] text-[20px] leading-[25px] text-white shadow-[0px_4px_24px_rgba(0,0,0,0.25)]"
                    style="background-image: linear-gradient(-26.19deg, rgba(255,255,255,0) 28.673%, rgba(255,255,255,0.1) 71.327%), linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%);">
                    Follow Lewis
                </button>
            </div>

            <blockquote
                class="absolute left-[81px] top-[369px] w-[513.75px] whitespace-pre-wrap text-[60px] italic leading-[60px] text-white drop-shadow-[0px_3px_18px_rgba(0,0,0,0.25)]">
                &quot;That&apos;s when it all started...
                I went from a driver
                to the driver&quot;
            </blockquote>
            <div class="absolute inset-x-0 top-[1527px] flex justify-end pr-[81px]">
                <div class="flex w-[524px] flex-col items-start">
                    <p class="[font-family:var(--font-family-Headings)] text-[63px] leading-[63px] text-white">
                        ITEMS FROM THIS ICON
                    </p>

                    <button type="button"
                        class="mt-[28px] flex h-[32px] w-[130px] items-center justify-center rounded-[999px] bg-white px-[32px] py-[10px] text-[16px] leading-[20px] text-black shadow-[0px_4px_24px_rgba(0,0,0,0.25)]">
                        See All
                    </button>

                    <article
                        class="relative mt-[32px] h-[266px] w-[524px] overflow-hidden rounded-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.25)]">
                    <div class="absolute inset-0 rounded-[16px] border border-white bg-black/20 backdrop-blur-[50px]" />
    
                    <div class="relative flex gap-[8px] p-[8px]">
                        <div class="h-[250px] w-[250px] overflow-hidden rounded-[16px] bg-white">
                            <img :src="itemOne" alt="Icon item one" class="h-full w-full object-cover">
                        </div>
                        <div class="h-[250px] w-[250px] overflow-hidden rounded-[16px] bg-white">
                            <img :src="itemTwo" alt="Icon item two" class="h-full w-full object-cover">
                        </div>
                    </div>
    
                    <div
                        class="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)]" />
                    </article>
                </div>
            </div>
        </div>
    </section>
</section>
</template>
