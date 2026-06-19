<script setup>
const assets = {
    lockCircle: '/assets/images/exclusive-drop/begins/lock-circle.svg',
    lockGlyph: '/assets/images/exclusive-drop/begins/lock-glyph.svg',
}
</script>

<template>
    <article class="relative w-full max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center gap-8 md:gap-12">

        <h2
            class="text-center font-['Bebas_Neue'] text-[clamp(2rem,6.6vw,4.375rem)] uppercase leading-[0.9] text-white md:text-[80px] lg:text-[100px] ">
            MEDIA CLUES <span class="text-[#d4af37]">REVEAL</span>
        </h2>
        
        <div
            class="relative flex w-full aspect-[4/3] md:aspect-[16/9] lg:h-[700px] lg:aspect-auto items-center justify-center rounded-[16px] border border-[#d4af37]/30 bg-[rgba(180,174,165,0.1)] overflow-hidden shadow-2xl backdrop-blur-sm">

            <button
                class="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-4xl md:text-5xl text-white hover:scale-110 hover:text-[#d4af37] transition-all">
                &lt;
            </button>

            <div class="relative flex h-32 w-32 md:h-[194px] md:w-[194px] items-center justify-center">
                <img :src="assets.lockCircle" alt="Lock circle" class="absolute inset-0 h-full w-full object-contain">
                <img :src="assets.lockGlyph" alt="Lock"
                    class="relative z-10 h-14 w-10 md:h-[88px] md:w-[58px] object-contain">
            </div>

            <button
                class="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-4xl md:text-5xl text-white hover:scale-110 hover:text-[#d4af37] transition-all">
                &gt;
            </button>

            <div class="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div class="h-2 w-2 md:h-3 md:w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            </div>
        </div>
    </article>
</template>