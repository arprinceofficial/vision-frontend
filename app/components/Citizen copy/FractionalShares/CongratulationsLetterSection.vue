<script setup lang="ts">
const signedNote = '/assets/images/citizen/congratulations/signed-note.png'
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
    'Markings: Driver name panel “L. HAMILTON”, car number #44, sponsor badges including Petronas, Tommy Hilfiger, Epson, Pirelli, CrowdStrike, and Bose',
    'Use: Light race wear markings around cuffs and torso, consistent with practice-session use',
    'Certification: FIA-compliant, microtagged and serialised',
    'Storage Conditions: Climate-controlled, UV-protected display box'
]
</script>

<template>
    <section class="bg-black px-4 py-16 sm:px-6 lg:px-[71px] lg:pb-[120px] lg:pt-[180px]">
        <div class="mx-auto w-full max-w-[1371px]">
            <div class="mx-auto max-w-[900px] overflow-hidden rounded-[16px] shadow-[0px_20px_60px_rgba(0,0,0,0.35)]">
                <img :src="signedNote" alt="Signed note from Lewis Hamilton"
                    class="h-auto w-full object-cover">
            </div>

            <div class="mx-auto flex h-24 w-16 flex-col items-center justify-center lg:h-[214px]">
                <span class="h-14 w-px bg-white/70 lg:h-[132px]" />
                <span class="-mt-3 size-6 rotate-45 border-b-2 border-r-2 border-white/70" />
            </div>

            <div class="grid min-w-0 gap-6 rounded-[16px] bg-[rgba(62,62,62,0.5)] p-4 shadow-[0px_4px_40px_8px_rgba(0,0,0,0.25)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,441px)] lg:p-[60px]">
                <div class="rounded-[16px] border border-[#dadbdd] p-6 sm:p-8 lg:p-[60px]">
                    <dl class="grid gap-2 text-[16px] leading-6 text-white sm:text-[20px] sm:leading-7">
                        <div v-for="[label, value] in quickFacts" :key="label" class="grid gap-1 sm:grid-cols-[160px_1fr]">
                            <dt class="text-[#d0d1d4]">{{ label }}:</dt>
                            <dd>{{ value }}</dd>
                        </div>
                    </dl>

                    <div class="my-8 h-px bg-white/40" />

                    <p class="text-[16px] leading-6 text-[#d0d1d4] sm:text-[20px] sm:leading-7">
                        Key Specifications
                    </p>
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
    </section>
</template>
