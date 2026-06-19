<script setup lang="ts">
const volumeIcon = '/assets/images/exclusive-drop/begins/volume.svg'

const props = withDefaults(
    defineProps<{
        name?: string
        title?: string
        yearsActive?: string
        bgVideo?: string
        backdropVideo?: string
        bgImage?: string
    }>(),
    {
        name: 'JOHNNY NELSON mbe',
        title: 'World Cruiserweight Champion',
        yearsActive: '1999-2006',
        bgVideo: '',
        backdropVideo: '',
        bgImage: '',
    }
)

const fallbackVideo = '/assets/videos/hero-background.mp4'

const heroVideo = computed(() => props.bgVideo || props.backdropVideo || fallbackVideo)
const heroImage = computed(() => props.bgImage || '')
const heroName = computed(() => props.name || 'JOHNNY NELSON mbe')
const heroTitleLine = computed(() => {
    const title = props.title?.trim() || 'World Cruiserweight Champion'
    const years = props.yearsActive?.trim()

    return years ? `${title} ${years}` : title
})
</script>

<template>
    <section class="relative h-[72vh] min-h-[520px] w-full overflow-hidden bg-black sm:min-h-[760px] lg:h-[985px] lg:min-h-[985px]">
        <video v-if="heroVideo"
            class="absolute inset-0 h-full w-full object-cover" :src="heroVideo" autoplay loop muted playsinline
            preload="auto" />
        <img v-else-if="heroImage" class="absolute inset-0 h-full w-full object-cover" :src="heroImage" :alt="heroName" />

        <div
            class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.75)_80%,#111215_100%)]" />

        <div class="relative mx-auto h-full w-full max-w-[1512px] px-4 sm:px-6 lg:px-0">
            <div class="absolute bottom-10 left-4 right-4 sm:bottom-14 sm:left-6 sm:right-6 lg:bottom-8 lg:left-[64px] lg:right-auto">
                <p
                    class="bg-[linear-gradient(157.6502deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(2.8rem,11vw,9.625rem)] uppercase leading-[0.8] tracking-[-0.03em] text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                    {{ heroName }}
                </p>
                <p
                    class="mt-2 [font-family:var(--font-family-Headings)] text-[clamp(1.2rem,4.8vw,3.9375rem)] leading-[0.95] tracking-[-0.02em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                    {{ heroTitleLine }}
                </p>
            </div>

            <button type="button"
                class="absolute right-4 top-5 flex size-[32px] items-center justify-center rounded-full bg-white/50 p-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:right-6 sm:top-7 lg:right-[72px] lg:top-[50px]">
                <img :src="volumeIcon" alt="Volume" class="size-[16px]" />
            </button>
        </div>
    </section>
</template>
