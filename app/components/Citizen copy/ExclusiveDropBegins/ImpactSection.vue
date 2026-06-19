<script setup lang="ts">
const assets = {
    impactBg: '/assets/images/exclusive-drop/begins/impact-bg.jpg',
    johnny: '/assets/images/exclusive-drop/begins/johnny.png',
    boxingFutures: '/assets/images/exclusive-drop/begins/boxing-futures.png'
}

type DifferenceCard = {
    image?: string | null
    description?: string | null
    is_description?: boolean
    icon_first_name?: string
}

const props = defineProps<{
    differenceCards?: DifferenceCard[]
}>()

const firstCard = computed(() => props.differenceCards?.[0])
const secondCard = computed(() => props.differenceCards?.[1])
const iconFirstName = computed(() => secondCard.value?.icon_first_name || '')
const firstCardImage = computed(() => firstCard.value?.image || assets.johnny)
const secondCardImage = computed(() => secondCard.value?.image || assets.boxingFutures)
const secondCardDescription = computed(
    () => secondCard.value?.description || 'Changing lives through Non-Contact Boxing. We help young people reach their potential.'
)

const baseWidth = 1370
const baseHeight = 1746

const frameRef = ref<HTMLElement | null>(null)
const frameWidth = ref(baseWidth)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
    if (!frameRef.value) {
        return
    }

    resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
            return
        }

        frameWidth.value = Math.min(entry.contentRect.width, baseWidth)
    })

    resizeObserver.observe(frameRef.value)
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})

const scale = computed(() => Math.min(frameWidth.value / baseWidth, 1))

const scaledHeight = computed(() => Math.round(baseHeight * scale.value))

const canvasStyle = computed(() => ({
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left'
}))
</script>

<template>
    <section class="relative overflow-hidden bg-black pb-10" style="font-family: 'Roboto', sans-serif;">
        <h2
            class="mt-0 sm:mt-10 text-center font-['Bebas_Neue'] text-[30px] uppercase leading-none text-white sm:text-[56px] lg:text-[100px] pb-10">
            YOUR BID MAKES A <span class="text-[#d4af37]">DIFFERENCE</span>
        </h2>
        <div ref="frameRef" class="relative mx-auto w-full max-w-[1370px]" :style="{ height: `${scaledHeight}px` }">
            <div class="absolute left-0 top-0 overflow-hidden rounded-[16px] border border-[#d4af37]"
                :style="canvasStyle">
                <div class="absolute inset-0 overflow-hidden rounded-[16px]">
                    <img :src="assets.impactBg" alt=""
                        class="absolute left-[-0.47%] top-[-43.41%] h-[120.5%] w-[115.32%] max-w-none grayscale">
                </div>

                <div class="absolute inset-0 rounded-[16px] bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,#000_75%)]" />

                <article
                    class="absolute left-[68px] top-[857px] h-[820px] w-[605px] overflow-hidden rounded-[16px] shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
                    <div class="absolute inset-0 z-10 pointer-events-none rounded-[16px] p-[1.5px]" style="background: linear-gradient(90deg, #d4af37 -20%, rgba(212,175,55,0.05) 45%, rgba(212,175,55,0.05) 55%, #d4af37 100%);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor; mask-composite: exclude;">
                    </div>

                    <div class="relative h-full w-full bg-black/40 backdrop-blur-[12px] rounded-[16px]">
                        <p
                            class="absolute left-1/2 top-[67px] -translate-x-1/2 text-center font-['Bebas_Neue'] text-[100px] leading-[0.8] tracking-[-3px] text-white whitespace-nowrap">
                            YOUR <span class="text-[#d4af37]">PURCHASE</span>
                        </p>

                        <svg class="absolute left-1/2 top-[180px] h-[20px] w-[40px] -translate-x-1/2"
                            viewBox="0 0 40 20" fill="none">
                            <path d="M3 2L20 18L37 2" stroke="white" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <img :src="firstCardImage" alt="Johnny Nelson"
                            class="absolute left-1/2 top-[289px] h-[260px] w-[260px] -translate-x-1/2 rounded-full border-4 border-[#d4af37] object-cover">

                        <p
                            class="absolute left-1/2 top-[649px] -translate-x-1/2 text-center font-['Bebas_Neue'] text-[100px] leading-[0.8] tracking-[-3px] text-white whitespace-nowrap">
                            BECOMES <span class="text-[#d4af37]">YOURS</span>
                        </p>
                    </div>
                </article>

                <article
                    class="absolute left-[697px] top-[857px] h-[820px] w-[605px] overflow-hidden rounded-[16px] shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
                    <div class="absolute inset-0 z-10 pointer-events-none rounded-[16px] p-[1.5px]" style="background: linear-gradient(90deg, #d4af37 -20%, rgba(212,175,55,0.05) 45%, rgba(212,175,55,0.05) 55%, #d4af37 100%);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor; mask-composite: exclude;">
                    </div>

                    <div class="relative h-full w-full bg-black/40 backdrop-blur-[12px] rounded-[16px]">
                        <p
                            class="absolute left-1/2 top-[67px] -translate-x-1/2 text-center font-['Bebas_Neue'] text-[100px] leading-[0.8] tracking-[-3px] text-white whitespace-nowrap">
                            10% <span class="text-[#d4af37]">SUPPORTS</span>
                        </p>

                        <svg class="absolute left-1/2 top-[180px] h-[20px] w-[40px] -translate-x-1/2"
                            viewBox="0 0 40 20" fill="none">
                            <path d="M3 2L20 18L37 2" stroke="white" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <img :src="secondCardImage" alt="Boxing Futures"
                            class="absolute left-1/2 top-[240px] h-[220px] w-[220px] -translate-x-1/2 object-contain">

                        <p
                            class="absolute left-1/2 top-[510px] w-[450px] -translate-x-1/2 text-center text-[26px] font-medium leading-tight text-[#d0d1d4]">
                            {{ secondCardDescription }}
                        </p>

                        <button type="button"
                            class="absolute left-1/2 bottom-[60px] flex h-[40px] -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-full px-8 text-[14px] font-bold text-black shadow-lg bg-gradient-to-r from-[#977b13] to-[#d4af37] uppercase tracking-wide">
                            Read More About {{ iconFirstName }} Charity
                        </button>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
