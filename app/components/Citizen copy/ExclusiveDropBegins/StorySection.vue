<script setup lang="ts">
type StoryCard = {
    type?: 'image' | 'text'
    image?: string | null
    button_link?: string | null
    button_text?: string | null
    title_color?: string | null
    title_white?: string | null
}

type StorySectionPayload = {
    cards?: StoryCard[]
    upper_part?: {
        bg_image?: string
        headline?: string
        subhead_line?: string
    }
}

const props = withDefaults(
    defineProps<{
        storySection?: StorySectionPayload
        iconName?: string
    }>(),
    {
        storySection: () => ({}),
        iconName: 'Johnny Nelson',
    }
)

const fallbackStoryHero = '/assets/images/exclusive-drop/begins/story-bg.jpg'
const fallbackStoryCardOne = '/assets/images/exclusive-drop/begins/story-1.png'
const fallbackStoryCardTwo = '/assets/images/exclusive-drop/begins/story-2.png'
const fallbackStoryExcerpt = `is a former British professional boxer and the longest-reigning Cruiserweight World Champion in history. He dominated the division from 1999 to 2005, defending his WBO (World Boxing Organisation) title a record 13 times.\n\nNelson is known for his resilience and technical skill, he became one of the most respected figures in British boxing.`

const cards = computed(() => props.storySection?.cards ?? [])
const imageCards = computed(() => cards.value.filter((card) => card?.type === 'image'))
const textCard = computed(() => cards.value.find((card) => card?.type === 'text'))

const storyHero = computed(() => props.storySection?.upper_part?.bg_image || fallbackStoryHero)
const storyCardOne = computed(() => imageCards.value[0]?.image || fallbackStoryCardOne)
const storyCardTwo = computed(() => imageCards.value[1]?.image || fallbackStoryCardTwo)
const storyHeadline = computed(() => props.storySection?.upper_part?.headline || `THE ${props.iconName}`)
const storySubheadline = computed(() => props.storySection?.upper_part?.subhead_line || 'STORY SO FAR')

const storyTitleColor = computed(() => textCard.value?.title_color || props.iconName)
const storyExcerpt = computed(() => textCard.value?.title_white || fallbackStoryExcerpt)
const storyButtonText = computed(() => textCard.value?.button_text || `Read More About ${props.iconName}'s Story`)
const storyButtonLink = computed(() => textCard.value?.button_link || '')
</script>

<template>
    <section class="relative mx-auto w-full max-w-[1512px]">
        <div class="hidden w-full px-[72px] pt-2 xl:block">
            <div class="grid gap-10">
                <div class="grid overflow-hidden rounded-[16px]">
                    <div class="col-start-1 row-start-1 aspect-[1371/1635] w-full">
                        <img :src="storyHero" :alt="iconName" class="h-full w-full object-cover" />
                    </div>

                    <div class="col-start-1 row-start-1 flex items-end justify-center">
                        <div class="w-full px-10 pb-10 text-center">
                            <p
                                class="bg-[linear-gradient(155.4764deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(3rem,5.4vw,6.25rem)] leading-[0.75] tracking-[-0.03em] text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                {{ storyHeadline }}
                            </p>
                            <p
                                class="mt-2 [font-family:var(--font-family-Headings)] text-[clamp(6rem,12.5vw,15rem)] leading-[0.75] tracking-[-0.03em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                                {{ storySubheadline }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="rounded-[16px] border-2 border-[#977b13] p-8">
                    <div class="grid grid-cols-3 gap-8">
                        <div class="aspect-[420/592] overflow-hidden rounded-[16px] border border-[#977b13] bg-black">
                            <img :src="storyCardOne" alt="Story card" class="h-full w-full object-cover" />
                        </div>

                        <div class="aspect-[420/596] overflow-hidden rounded-[16px] border border-[#977b13] bg-black">
                            <img :src="storyCardTwo" alt="Story card" class="h-full w-full object-cover" />
                        </div>

                        <article class="flex flex-col rounded-[16px] border border-[#977b13] bg-[#07080a] p-8">
                            <p
                                class="mx-auto max-w-[353px] whitespace-pre-wrap text-center text-[21.33px] font-bold leading-[31.995px]">
                                <span class="text-[#d4af37]">{{ storyTitleColor }} &nbsp;</span>
                                <span class="font-normal text-white">{{ storyExcerpt }}</span>
                            </p>

                            <NuxtLink :to="storyButtonLink || undefined"
                                class="mx-auto mt-auto flex min-h-[40px] w-full max-w-[325px] items-center justify-center rounded-full bg-[linear-gradient(158.19deg,#977b13_28.673%,#d4af37_71.327%)] px-4 py-2 text-center text-[16px] leading-[20px] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                                {{ storyButtonText }}
                            </NuxtLink>
                        </article>
                    </div>
                </div>
            </div>
        </div>

        <div class="px-4 pb-14 xl:hidden sm:px-6 sm:pb-20">
            <div
                class="relative h-[54vh] min-h-[360px] w-full overflow-hidden rounded-[16px] border border-[#977b13] sm:min-h-[520px]">
                <img :src="storyHero" :alt="iconName" class="h-full w-full object-cover" />
                <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.85)_100%)]" />
                <div class="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
                    <p
                        class="bg-[linear-gradient(155.4764deg,#977b13_28.673%,#d4af37_71.327%)] bg-clip-text [font-family:var(--font-family-Headings)] text-[clamp(1.8rem,6vw,3.3rem)] leading-[0.84] tracking-[-0.03em] text-transparent">
                        {{ storyHeadline }}
                    </p>
                    <p
                        class="mt-2 [font-family:var(--font-family-Headings)] text-[clamp(2.6rem,12vw,6.8rem)] leading-[0.76] tracking-[-0.03em] text-white">
                        {{ storySubheadline }}
                    </p>
                </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                <div class="h-[360px] overflow-hidden rounded-[16px] border border-[#977b13] sm:h-[520px]">
                    <img :src="storyCardOne" alt="Story card" class="h-full w-full object-cover" />
                </div>

                <div class="h-[360px] overflow-hidden rounded-[16px] border border-[#977b13] sm:h-[520px]">
                    <img :src="storyCardTwo" alt="Story card" class="h-full w-full object-cover" />
                </div>

                <article
                    class="relative rounded-[16px] border border-[#977b13] bg-[#07080a] px-4 py-6 md:col-span-2 md:px-6 lg:col-span-1">
                    <p
                        class="mx-auto max-w-[353px] whitespace-pre-wrap text-center text-[clamp(1rem,2.7vw,1.333rem)] font-bold leading-[1.45]">
                        <span class="text-[#d4af37]">{{ storyTitleColor }} &nbsp;</span>
                        <span class="font-normal text-white">{{ storyExcerpt }}</span>
                    </p>

                    <NuxtLink :to="storyButtonLink || undefined"
                        class="mx-auto mt-6 flex min-h-[40px] w-full max-w-[325px] items-center justify-center rounded-full bg-[linear-gradient(158.19deg,#977b13_28.673%,#d4af37_71.327%)] px-4 py-2 text-center text-[clamp(0.88rem,2.3vw,1rem)] leading-[1.25] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                        {{ storyButtonText }}
                    </NuxtLink>
                </article>
            </div>
        </div>
    </section>
</template>
