<script setup lang="ts">
const assets = {
    badgeShape: '/assets/images/exclusive-drop/begins/badge-shape.svg',
    badgeRing: '/assets/images/exclusive-drop/begins/badge-ring.svg',
    star: '/assets/images/exclusive-drop/begins/star.svg',
    qr: '/assets/images/exclusive-drop/begins/qr.svg',
    psaLogo: '/assets/images/exclusive-drop/begins/psa-logo.png'
}

const psaHighlights = [
    { icon: '/assets/images/exclusive-drop/begins/shield.svg', text: 'Independent Authentication' },
    { icon: '/assets/images/exclusive-drop/begins/magnify.svg', text: 'Expert Evaluation' },
    { icon: '/assets/images/exclusive-drop/begins/graph-up.svg', text: 'Preserves Value' }
]
</script>

<template>
    <section class="bg-black px-3 py-10 sm:px-6 sm:py-14 lg:px-[72px] lg:py-[120px]">
        <div class="mx-auto w-full max-w-[1371px]">
            <h2
                class="text-center [font-family:var(--font-family-Headings)] text-[clamp(2rem,6.2vw,6.125rem)] leading-[0.8] tracking-[-0.02em] text-white/90">
                INDEPENDENTLY VERIFIED AS
                <span
                    class="bg-[linear-gradient(155deg,#bc9a1d_28.673%,#d4af37_71.327%)] bg-clip-text text-transparent">
                    &nbsp;AUTHENTIC
                </span>
            </h2>

            <div class="mt-5 grid grid-cols-1 gap-3 lg:mt-8 xl:grid-cols-3 xl:gap-6">
                <article
                    class="flex min-h-[18rem] flex-col items-center justify-center rounded-xl border border-white/35 bg-[rgba(180,174,165,0.1)] p-4 text-center sm:min-h-[20rem] lg:min-h-[30rem] lg:rounded-2xl lg:p-6">
                    <div class="relative mx-auto h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] lg:h-[220px] lg:w-[220px]">
                        <img :src="assets.badgeShape" alt="Badge" class="absolute inset-0 h-full w-full">
                    </div>
                    <p class="mt-3 bg-clip-text text-[clamp(0.95rem,2.8vw,1.75rem)] font-bold leading-[1.2] text-transparent lg:mt-4"
                        style="background-image: linear-gradient(162deg, #977b13 28.673%, #d4af37 71.327%);">
                        Certified Authentic
                    </p>
                </article>

                <article
                    class="flex min-h-[18rem] flex-col items-center justify-center rounded-xl border border-white/35 bg-[rgba(180,174,165,0.1)] p-4 text-center sm:min-h-[20rem] lg:min-h-[30rem] lg:rounded-2xl lg:p-6">
                    <p class="font-['Bebas_Neue'] text-[clamp(2rem,7vw,4.375rem)] uppercase leading-none text-white">
                        SCAN <span class="text-[#d4af37]">me</span>
                    </p>
                    <img :src="assets.qr" alt="QR code"
                        class="mx-auto mt-3 h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] lg:mt-5 lg:h-[210px] lg:w-[210px]">
                    <p class="mt-3 text-[clamp(0.85rem,2.2vw,1.3125rem)] font-semibold leading-[1.3] text-[#d4af37] lg:mt-4">
                        Scan QR Code <span class="font-normal text-[#d0d1d4]">for instant access to Certification
                            Verification.</span>
                    </p>
                </article>

                <article
                    class="flex min-h-[18rem] flex-col items-center justify-center rounded-xl border border-white/35 bg-[rgba(180,174,165,0.1)] p-4 lg:min-h-[30rem] lg:rounded-2xl lg:p-6">
                    <p class="text-center text-[clamp(0.85rem,2.2vw,1.625rem)] font-semibold leading-[1.3] text-[#d0d1d4]">
                        Independently verified by the world's most trusted grading service:
                    </p>
                    <img :src="assets.psaLogo" alt="PSA" class="mx-auto mt-3 h-7 w-auto sm:h-9 lg:mt-6 lg:h-16">
                    <div class="mt-3 w-full max-w-[22rem] space-y-2 lg:mt-8 lg:space-y-4">
                        <div v-for="item in psaHighlights" :key="item.text"
                            class="flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 lg:gap-4 lg:px-6 lg:py-3">
                            <img :src="item.icon" :alt="item.text" class="h-4 w-4 lg:h-8 lg:w-8">
                            <p class="text-[clamp(0.78rem,1.9vw,1.125rem)] leading-[1.25] text-[#d0d1d4]">{{ item.text }}</p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
