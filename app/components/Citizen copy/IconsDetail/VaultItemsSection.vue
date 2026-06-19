<script setup lang="ts">
const vaultItemPrimary = '/assets/images/citizen/icons/detail/vault-item-01.jpg'
const navArrow = '/assets/images/citizen/icons/detail/nav-arrow.svg'
const arrowRight = '/assets/images/citizen/icons/detail/arrow-right-25.svg'
const daysIcon = '/assets/images/citizen/icons/detail/days-icon.svg'
const pagerDotActive = '/assets/images/citizen/icons/detail/pager-dot-active.svg'
const pagerDot = '/assets/images/citizen/icons/detail/pager-dot.svg'

const props = withDefaults(
    defineProps<{
        iconName?: string
    }>(),
    {
        iconName: 'JOHNNY',
    }
)

const vaultHeadingName = computed(() => {
    const normalized = (props.iconName || 'JOHNNY').trim()
    const firstWord = normalized.split(' ').filter(Boolean)[0]

    return firstWord || 'JOHNNY'
})
</script>

<template>
    <section class="relative">
        <div class="flex min-h-[160px] items-center justify-center px-4 py-10 sm:min-h-[220px] sm:px-8 sm:py-16 lg:h-[266px] lg:px-[48px] lg:py-[98px]">
            <h2
                class="text-center [font-family:var(--font-family-Headings)] text-[clamp(2.4rem,10vw,6.25rem)] leading-[0.75] tracking-[-0.03em] text-white">
                {{ vaultHeadingName }}&apos;S
                <span
                    class="bg-[linear-gradient(169.665deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                    VAULT ITEMS
                </span>
            </h2>
        </div>

        <article class="relative mx-auto mt-4 hidden h-[985px] w-full max-w-[1513px] overflow-hidden bg-[#111215] xl:block">
            <img :src="vaultItemPrimary" alt="Vault item" class="absolute left-[3.17%] top-[2.15%] h-[108.85%] w-[119.56%] max-w-none" />
            <div class="absolute left-0 top-0 h-[985px] w-[860px]" />
            <div class="absolute left-0 top-0 h-[381px] w-[1513px]" />

            <div class="absolute left-[68px] top-[88px] flex flex-col gap-[32px]">
                <div class="flex flex-col gap-[16px] [font-family:var(--font-family-Headings)] leading-none">
                    <h3 class="text-[98px] leading-[78px] tracking-[-1.96px] text-white">
                        WORLD TITLE WINNING
                        <br>
                        BOUT WORN BOXING GLOVES
                    </h3>
                    <p class="bg-[linear-gradient(167.834deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-[64px] leading-[63px] text-transparent">
                        JOHNNY NELSON MBE
                    </p>
                </div>

                <button type="button"
                    class="flex h-[40px] w-[222.5px] items-center justify-center gap-[5px] rounded-full bg-[linear-gradient(153.958deg,rgba(255,255,255,0)_29.076%,rgba(255,255,255,0.1)_70.924%),linear-gradient(90deg,#22252b_0%,#22252b_100%)] px-[30px] text-[20px] leading-[25px] text-white shadow-[0_5px_30px_rgba(0,0,0,0.25)]">
                    Discover More
                    <img :src="arrowRight" alt="arrow" class="size-[25px]" />
                </button>
            </div>

            <div class="absolute left-[68px] top-[869px] flex items-center gap-[24px]">
                <div
                    class="flex h-[48px] items-center gap-[10px] rounded-full bg-white py-[4px] pl-[10px] pr-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                    <span class="grid size-[32px] place-items-center rounded-full bg-black p-[8px]">
                        <img :src="daysIcon" alt="days" class="size-[20px]" />
                    </span>
                    <span class="text-[20px] leading-[25px] text-black">4 Days Remaining</span>
                </div>

                <button type="button"
                    class="h-[48px] w-[236px] rounded-full bg-[linear-gradient(143.12deg,#977b13_28.673%,#d4af37_71.327%)] text-[24px] leading-[30px] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                    Place Bid
                </button>
            </div>

            <div class="absolute left-1/2 top-1/2 flex w-[1368px] -translate-x-1/2 -translate-y-1/2 items-center justify-between">
                <button type="button" class="grid size-[40px] place-items-center">
                    <img :src="navArrow" alt="Next" class="h-[40px] w-[20px]" />
                </button>
                <button type="button" class="grid size-[40px] place-items-center">
                    <img :src="navArrow" alt="Prev" class="h-[40px] w-[20px] rotate-180" />
                </button>
            </div>

            <div
                class="absolute left-1/2 top-[913px] flex -translate-x-1/2 items-center rounded-full bg-black/20 px-[8px] py-[6px] shadow-[0_0_10px_rgba(0,0,0,0.55)]">
                <div class="flex items-center gap-[12px]">
                    <img :src="pagerDotActive" alt="active" class="h-[12px] w-[12px]" />
                    <img :src="pagerDot" alt="dot" class="h-[12px] w-[12px]" />
                    <img :src="pagerDot" alt="dot" class="h-[12px] w-[12px]" />
                </div>
            </div>
        </article>

        <article class="relative mx-4 mt-4 overflow-hidden rounded-[16px] bg-[#111215] sm:mx-6 xl:hidden">
            <img :src="vaultItemPrimary" alt="Vault item" class="absolute inset-0 h-full w-full object-cover" />
            <div class="absolute inset-0 bg-[linear-gradient(92deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.48)_58%,rgba(0,0,0,0.6)_100%)]" />

            <div class="relative z-10 flex min-h-[620px] flex-col justify-between p-4 sm:min-h-[720px] sm:p-6">
                <div>
                    <div class="flex items-center justify-between">
                        <button type="button" class="grid size-8 place-items-center sm:size-10">
                            <img :src="navArrow" alt="Next" class="h-8 w-4 sm:h-[40px] sm:w-[20px]" />
                        </button>
                        <button type="button" class="grid size-8 place-items-center sm:size-10">
                            <img :src="navArrow" alt="Prev" class="h-8 w-4 rotate-180 sm:h-[40px] sm:w-[20px]" />
                        </button>
                    </div>

                    <div class="mt-8 [font-family:var(--font-family-Headings)] leading-[0.8] sm:mt-10">
                        <h3 class="text-[clamp(2rem,8vw,6.125rem)] tracking-[-0.03em] text-white">
                            WORLD TITLE WINNING
                            <br>
                            BOUT WORN BOXING GLOVES
                        </h3>
                        <p
                            class="mt-3 bg-[linear-gradient(167.834deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-[clamp(1.45rem,5vw,4rem)] leading-[0.9] text-transparent">
                            JOHNNY NELSON MBE
                        </p>
                    </div>

                    <button type="button"
                        class="mt-6 flex min-h-[40px] w-full max-w-[250px] items-center justify-center gap-[5px] rounded-full bg-[linear-gradient(153.958deg,rgba(255,255,255,0)_29.076%,rgba(255,255,255,0.1)_70.924%),linear-gradient(90deg,#22252b_0%,#22252b_100%)] px-6 py-2 text-[clamp(0.95rem,2.5vw,1.25rem)] leading-[1.25] text-white shadow-[0_5px_30px_rgba(0,0,0,0.25)]">
                        Discover More
                        <img :src="arrowRight" alt="arrow" class="size-[20px] sm:size-[25px]" />
                    </button>
                </div>

                <div>
                    <div class="flex justify-center">
                        <div class="flex items-center gap-2 rounded-full bg-black/20 px-2 py-1.5 shadow-[0_0_10px_rgba(0,0,0,0.55)]">
                            <img :src="pagerDotActive" alt="active" class="h-2.5 w-2.5 sm:h-[12px] sm:w-[12px]" />
                            <img :src="pagerDot" alt="dot" class="h-2.5 w-2.5 sm:h-[12px] sm:w-[12px]" />
                            <img :src="pagerDot" alt="dot" class="h-2.5 w-2.5 sm:h-[12px] sm:w-[12px]" />
                        </div>
                    </div>

                    <div class="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div
                            class="flex min-h-[44px] w-full items-center justify-center gap-[10px] rounded-full bg-white px-3 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:w-auto sm:justify-start sm:py-[4px] sm:pl-[10px] sm:pr-[24px]">
                            <span class="grid size-7 place-items-center rounded-full bg-black p-[7px] sm:size-[32px] sm:p-[8px]">
                                <img :src="daysIcon" alt="days" class="size-[16px] sm:size-[20px]" />
                            </span>
                            <span class="text-[clamp(0.9rem,2.5vw,1.25rem)] leading-[1.2] text-black">4 Days Remaining</span>
                        </div>

                        <button type="button"
                            class="min-h-[44px] w-full rounded-full bg-[linear-gradient(143.12deg,#977b13_28.673%,#d4af37_71.327%)] px-6 py-2 text-[clamp(1rem,2.8vw,1.5rem)] leading-[1.2] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:w-auto sm:min-w-[210px]">
                            Place Bid
                        </button>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>
