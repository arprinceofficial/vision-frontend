<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Frequently Asked Questions - Vision148',
    meta: [
        {
            name: 'description',
            content: 'Frequently asked questions about Vision148 syndicates and retail cars for sale.'
        }
    ]
})

type FaqItem = {
    id: number | string
    question: string
    answerHtml: string
}

type FaqTab = {
    label: string
    value: string
    faqs: FaqItem[]
}

type CmsFaqCategory = {
    id?: number | string | null
    title?: string | null
}

type CmsFaq = {
    id?: number | string | null
    title?: string | null
    description?: string | null
    status?: number | string | null
    cat_id?: number | string | null
    category?: CmsFaqCategory | null
}

type CmsFaqsResponse = {
    data?: {
        data?: CmsFaq[]
    }
}

const activeTab = ref('')
const openIndex = ref(0)
const faqSkeletonTabs = ['w-40', 'w-32']
const faqSkeletonRows = ['w-4/5', 'w-3/5', 'w-2/3', 'w-11/12', 'w-3/4', 'w-7/12']
const faqSkeletonAnswerRows = ['w-full', 'w-11/12', 'w-4/5']

const { data: cmsFaqs, error: faqsError, pending: faqsPending, status: faqsStatus } = useAsyncData<CmsFaq[]>(
    'cms-faqs',
    async () => {
        const response = await $fetchCMS<CmsFaqsResponse>('v1/cms/faqs', {
            method: 'POST',
        })

        return Array.isArray(response?.data?.data) ? response.data.data : []
    },
    {
        default: () => [],
        lazy: true,
    }
)

const getCategorySortValue = (value: string) => {
    const numericValue = Number(value)
    return Number.isFinite(numericValue) ? numericValue : Number.MAX_SAFE_INTEGER
}

const tabs = computed<FaqTab[]>(() => {
    const groupedFaqs = new Map<string, FaqTab>()

    for (const faq of cmsFaqs.value || []) {
        if (Number(faq?.status ?? 1) !== 1) continue

        const categoryId = faq.cat_id ?? faq.category?.id
        const question = faq.title?.trim()

        if (categoryId === null || categoryId === undefined || categoryId === '' || !question) continue

        const value = String(categoryId)

        if (!groupedFaqs.has(value)) {
            groupedFaqs.set(value, {
                label: faq.category?.title?.trim() || `Category ${value}`,
                value,
                faqs: [],
            })
        }

        groupedFaqs.get(value)?.faqs.push({
            id: faq.id ?? `${value}-${groupedFaqs.get(value)?.faqs.length ?? 0}`,
            question,
            answerHtml: faq.description || '',
        })
    }

    return Array.from(groupedFaqs.values())
        .filter((tab) => tab.faqs.length > 0)
        .sort((a, b) => getCategorySortValue(a.value) - getCategorySortValue(b.value))
})

const activeTabValue = computed(() => activeTab.value || tabs.value[0]?.value || '')
const activeFaqs = computed(() => tabs.value.find((tab) => tab.value === activeTabValue.value)?.faqs || [])
const shouldShowFaqSkeleton = computed(() => (
    !tabs.value.length && (faqsPending.value || faqsStatus.value === 'idle' || faqsStatus.value === 'pending')
))

watch(tabs, (newTabs) => {
    if (!newTabs.length) {
        activeTab.value = ''
        openIndex.value = -1
        return
    }

    if (!newTabs.some((tab) => tab.value === activeTab.value)) {
        activeTab.value = newTabs[0].value
        openIndex.value = 0
    }
}, { immediate: true })

const selectTab = (tab: string) => {
    activeTab.value = tab
    openIndex.value = 0
}

const toggleFaq = (index: number) => {
    openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
    <div class="bg-tccDeepBlack text-white">
        <section class="relative min-h-[560px] overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white">
            <div class="absolute inset-0">
                <img src="/generated/faqs/question-cars.png" alt="Vision148 cars"
                    class="h-full w-full object-cover opacity-60">
                <div
                    class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/45 via-tccDeepBlack/65 to-tccDeepBlack" />
                <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,transparent_0%,rgba(3,3,3,0.42)_34%,rgba(3,3,3,0.98)_100%)]" />
            </div>

            <div class="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <div class="max-w-5xl">
                    <span class="restomod-eyebrow">FAQs</span>
                    <h1
                        class="mt-6 font-poppins text-5xl font-black leading-[0.92] tracking-normal text-white sm:text-6xl lg:text-7xl">
                        Frequently Asked Questions
                    </h1>
                    <p class="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                        Find clear answers about syndicate ownership, exits, retail vehicles, inspections, and sourcing.
                    </p>
                    <NuxtLink to="/contact"
                        class="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                        Book a call
                        <i class="pi pi-arrow-up-right text-[10px]" aria-hidden="true" />
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="mb-10 flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4 sm:justify-start">
                    <template v-if="shouldShowFaqSkeleton">
                        <span v-for="tabWidth in faqSkeletonTabs" :key="tabWidth"
                            class="h-[42px] animate-pulse rounded-full border border-white/15 bg-white/5"
                            :class="tabWidth" />
                    </template>
                    <template v-else>
                        <button v-for="tab in tabs" :key="tab.value" type="button"
                            class="rounded-full border px-5 py-3 font-poppins text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                            :class="activeTabValue === tab.value ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/5 text-white/60 hover:border-tccGold/60 hover:text-tccGold'"
                            @click="selectTab(tab.value)">
                            {{ tab.label }}
                        </button>
                    </template>
                </div>

                <div
                    class="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.56fr)_minmax(360px,0.44fr)] lg:items-start">
                    <div class="space-y-4">
                        <template v-if="shouldShowFaqSkeleton">
                            <span class="sr-only">Loading FAQs...</span>
                            <article v-for="(questionWidth, index) in faqSkeletonRows"
                                :key="`${questionWidth}-${index}`"
                                class="overflow-hidden rounded-[1.25rem] border bg-white/5 transition-colors"
                                :class="index === 0 ? 'border-tccGold/45' : 'border-white/10'">
                                <div class="flex w-full items-center justify-between gap-4 px-5 py-5 sm:px-6">
                                    <span class="h-5 animate-pulse rounded-full bg-white/10" :class="questionWidth" />
                                    <span
                                        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15"
                                        aria-hidden="true">
                                        <span class="h-3 w-3 animate-pulse rounded-full bg-tccGold/35" />
                                    </span>
                                </div>

                                <div v-if="index === 0" class="border-t border-white/10 px-5 py-5 sm:px-6">
                                    <div class="space-y-4">
                                        <span v-for="answerWidth in faqSkeletonAnswerRows" :key="answerWidth"
                                            class="block h-3 animate-pulse rounded-full bg-white/10"
                                            :class="answerWidth" />
                                    </div>
                                </div>
                            </article>
                        </template>
                        <div v-else-if="faqsError"
                            class="rounded-[1.25rem] border border-tccGold/30 bg-tccGold/10 px-5 py-6 text-sm leading-relaxed text-white/70 sm:px-6">
                            FAQs are unavailable right now. Please refresh and try again.
                        </div>
                        <div v-else-if="!activeFaqs.length"
                            class="rounded-[1.25rem] border border-white/10 bg-white/5 px-5 py-6 text-sm leading-relaxed text-white/60 sm:px-6">
                            No FAQs available for this category.
                        </div>
                        <template v-else>
                            <article v-for="(faq, index) in activeFaqs" :key="faq.id"
                                class="overflow-hidden rounded-[1.25rem] border bg-white/5 transition-colors"
                                :class="openIndex === index ? 'border-tccGold/45' : 'border-white/10 hover:border-white/20'">
                                <button type="button"
                                    class="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                                    :aria-expanded="openIndex === index" @click="toggleFaq(index)">
                                    <span class="text-base font-medium leading-relaxed text-white sm:text-lg">{{
                                        faq.question }}</span>
                                    <span
                                        class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-tccGold"
                                        aria-hidden="true">
                                        <i :class="openIndex === index ? 'pi pi-minus' : 'pi pi-plus'"
                                            class="text-xs" />
                                    </span>
                                </button>

                                <div v-show="openIndex === index" class="border-t border-white/10 px-5 py-5 sm:px-6">
                                    <div class="space-y-4 text-sm leading-relaxed text-white/70 sm:text-base"
                                        v-html="faq.answerHtml" />
                                </div>
                            </article>
                        </template>
                    </div>

                    <aside class="lg:sticky lg:top-24">
                        <div class="restomod-panel overflow-hidden rounded-[1.75rem]">
                            <div class="p-6 text-center sm:p-8">
                                <span class="restomod-eyebrow mx-auto">Any Question?</span>
                                <h2 class="mt-5 font-poppins text-3xl font-black leading-tight text-white sm:text-4xl">
                                    Any Question?
                                </h2>
                                <p class="mt-4 text-sm leading-relaxed text-white/60">
                                    You can ask anything you want to know Feedback
                                </p>
                            </div>
                            <div class="restomod-image-card overflow-hidden border-t border-white/10">
                                <img src="/generated/faqs/question-cars.png" alt="Red collector cars"
                                    class="h-[520px] w-full object-cover">
                            </div>
                            <div class="p-6 sm:p-8">
                                <NuxtLink to="/contact"
                                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                                    Book a call
                                    <i class="pi pi-arrow-up-right text-[10px]" aria-hidden="true" />
                                </NuxtLink>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </div>
</template>
