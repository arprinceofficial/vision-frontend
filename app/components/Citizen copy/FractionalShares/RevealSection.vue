<script setup lang="ts">
const revealFrame = '/assets/images/citizen/fractional-shares/reveal-frame.png'
const suitDisplay = '/assets/images/citizen/fractional-shares/suit-display.png'

const quickFacts = [
    ['Season', '2019'],
    ['Event Use', 'Monaco Grand Prix (Practice Sessions)'],
    ['Acquired', 'November 2025'],
    ['Authentication', 'Certified by F1 Authentic'],
    ['Current Location', 'Collectivault’s secure vault box']
]

const specifications = [
    'Driver: Lewis Hamilton',
    'Team: Mercedes-AMG Petronas Formula One Team',
    'Season: 2019',
    'Material: Nomex fire-resistant tri-layer construction',
    'Suit Colourway: Petronas teal + black + silver',
    'Markings: driver name panel “L. HAMILTON”, car number #44, sponsor badges including Petronas, Tommy Hilfiger, Epson, Pirelli, CrowdStrike, and Bose',
    'Use: Light race wear markings around cuffs and torso, consistent with practice-session use',
    'Certification: FIA-compliant, microtagged and serialised',
    'Storage Conditions: Climate-controlled, UV-protected display box'
]
</script>

<template>
    <section class="bg-black">
        <div class="mx-auto w-full max-w-[1512px] px-4 py-14 sm:px-6 lg:px-[72px] lg:py-[120px]">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div class="lg:order-2 lg:max-w-[440px] lg:text-right">
                    <h2 class="[font-family:var(--font-family-Headings)] text-[clamp(3rem,12vw,7.6875rem)] uppercase leading-[0.82] text-white">
                        The
                        <span class="bg-[linear-gradient(145deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                            Reveal
                        </span>
                    </h2>
                    <p class="mt-4 text-[16px] leading-6 text-[#d0d1d4] lg:text-[20px] lg:leading-7">
                        Check back in each day to explore new clues about what the item could be.
                    </p>
                </div>
            </div>
        </div>

        <div class="relative h-[300px] overflow-hidden sm:h-[520px] lg:h-[827px]">
            <img :src="revealFrame" alt="Lewis Hamilton reveal clip"
                class="absolute inset-0 h-full w-full object-cover object-center">
            <div class="absolute inset-0 bg-black/15" />
        </div>

        <div class="bg-[#111215] px-4 py-14 sm:px-6 lg:px-[72px] lg:py-[120px]">
            <div class="mx-auto w-full max-w-[1371px]">
                <h2
                    class="bg-[linear-gradient(151deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.5rem,10vw,6.125rem)] uppercase leading-[0.85] text-transparent">
                    Lewis Hamilton
                </h2>
                <p class="mt-2 [font-family:var(--font-family-Headings)] text-[clamp(2rem,4vw,3rem)] uppercase leading-none text-[#dadbdd]">
                    Mercedes-AMG Petronas - Racing Suit
                </p>

                <div class="mt-10 grid min-w-0 gap-6 rounded-[16px] bg-[rgba(62,62,62,0.5)] p-4 sm:p-6 lg:mt-[60px] lg:grid-cols-[minmax(0,1fr)_minmax(320px,441px)] lg:p-[60px]">
                    <div class="rounded-[16px] border border-[#dadbdd] p-6 sm:p-8 lg:p-[60px]">
                        <dl class="grid gap-2 text-[16px] leading-6 text-white sm:text-[20px] sm:leading-7">
                            <div v-for="[label, value] in quickFacts" :key="label" class="grid gap-1 sm:grid-cols-[160px_1fr]">
                                <dt class="text-[#d0d1d4]">{{ label }}:</dt>
                                <dd>{{ value }}</dd>
                            </div>
                        </dl>

                        <div class="my-8 h-px bg-white/40" />

                        <p class="text-[16px] leading-6 text-[#d0d1d4] sm:text-[20px] sm:leading-7">Key Specifications</p>
                        <ul class="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-5 text-[#d0d1d4] sm:text-[16px] sm:leading-6">
                            <li v-for="item in specifications" :key="item">{{ item }}</li>
                        </ul>
                    </div>

                    <div class="relative min-h-[360px] overflow-hidden rounded-[16px] border border-white bg-[rgba(34,37,43,0.7)] p-2 shadow-[inset_3px_3px_2px_rgba(255,255,255,0.1),inset_-2px_0_2px_rgba(255,255,255,0.2)] backdrop-blur-[50px] sm:min-h-[520px]">
                        <img :src="suitDisplay" alt="Hamilton racing suit in Collectivault display"
                            class="h-full min-h-[340px] w-full rounded-[14px] object-cover sm:min-h-[500px]">
                    </div>
                </div>
            </div>
        </div>

        <div class="px-4 py-14 sm:px-6 lg:px-[75px] lg:py-[120px]">
            <div class="mx-auto w-full max-w-[1371px]">
                <h2
                    class="[font-family:var(--font-family-Headings)] text-[clamp(2.7rem,6.5vw,6.125rem)] uppercase leading-[0.8] text-white">
                    Want to be part of the conversation?
                </h2>
                <p class="mt-4 text-[20px] italic leading-7 text-[#d0d1d4]">
                    Head to the <strong>Fan Zone</strong> to chat to other Collectors.
                </p>
                <NuxtLink to="/fan-zone"
                    class="mt-6 inline-flex h-12 w-full max-w-[260px] items-center justify-center rounded-full px-8 py-2 text-[22px] leading-[30px] text-black shadow-[0px_4px_12px_rgba(0,0,0,0.25)] sm:text-[24px]"
                    style="background-image: linear-gradient(146deg,#bc9a1d 28.673%,#d4af37 71.327%);">
                    Fan Zone
                </NuxtLink>
            </div>
        </div>
    </section>
</template>
