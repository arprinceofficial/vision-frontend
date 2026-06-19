<script setup lang="ts">
const send = '/assets/images/exclusive-drop/begins/send-hero.svg';

const props = withDefaults(
    defineProps<{
        winnerName?: string
        iconName?: string
    }>(),
    {
        winnerName: '',
        iconName: '',
    }
)

const displayWinnerName = computed(() => {
    const name = (props.winnerName || '').trim()
    return name ? name : 'Winner'
})

const displayIconName = computed(() => {
    const name = (props.iconName || '').trim()
    return name ? name : 'MY LEGACY'
})
</script>

<template>
    <section class="relative w-full overflow-hidden bg-black" style="min-height:clamp(440px,50vh,985px);overflow-x:hidden;">
        <div class="relative mx-auto min-h-full w-full max-w-[1512px] flex items-center justify-center py-10 sm:py-16 lg:py-24">
            <div class="flex flex-col items-center z-10 gap-4 px-4 sm:px-6">
                <p
                    class="bg-[linear-gradient(124.692deg,#bc9a1d_28.673%,#d4af37_71.327%)] text-transparent bg-clip-text [font-family:var(--font-family-Headings)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-[clamp(20px,4vw,72px)] leading-[0.8] tracking-[-1.1px]">
                    YOU WON THE AUCTION
                </p>

                <p
                    class="text-white/90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)] [font-family:var(--font-family-Headings)] text-[clamp(3rem,9vw,9rem)] leading-[0.72] tracking-[-1.1px] text-center w-full max-w-[95vw] break-words">
                    CONGRATULATIONS
                </p>
                <button type="button"
                    class="inline-flex mt-6 items-center justify-center gap-2 rounded-full bg-[#22252b] px-12 py-2 text-lg border border-white/10 hover:scale-105 transition-transform shadow-xl">
                    <span>Share</span>
                    <img :src="send" alt="Send" class="h-5 w-5 sm:h-6 sm:w-6">
                </button>

                <h2
                    class="text-center font-['Bebas_Neue'] text-[clamp(1.4rem,4.5vw,2.6rem)] sm:text-[clamp(2rem,6.6vw,4.375rem)] uppercase leading-[0.9] text-white mt-4">
                    <span class="text-[#d4af37]">{{ displayWinnerName }}</span>&nbsp; YOU ARE CUSTODIAN OF {{ displayIconName }}
                </h2>
            </div>
        </div>
    </section>
</template>
