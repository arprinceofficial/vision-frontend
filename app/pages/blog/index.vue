<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

useHead({
    title: 'Blog & News - Vision148',
    meta: [
        {
            name: 'description',
            content:
                'Read Vision148 journal for collectible car market notes, build updates, ownership education, and member event stories.'
        }
    ]
})

type CmsBlogIssueNote = {
    id?: number | string | null
    label?: string | null
    value?: string | null
    detail?: string | null
}

type CmsBlogIssueNotesResponse = {
    data?: {
        data?: CmsBlogIssueNote[]
    }
}

type BlogIssueNote = {
    id: string
    label: string
    value: string
    detail: string
}

type CmsBlogCategory = {
    id?: number | string | null
    name?: string | null
    slug?: string | null
}

type CmsBlogPost = {
    id?: number | string | null
    title?: string | null
    slug?: string | null
    details?: string | null
    cat_id?: number | string | null
    category_info?: CmsBlogCategory | null
    date?: string | null
    readTime?: string | null
    read_time?: string | null
    image?: string | null
    excerpt?: string | null
    author?: string | null
    stat?: string | null
    body?: string[] | string | null
    takeaways?: string[] | string | null
    is_featured?: boolean | number | string | null
}

type CmsBlogCategoriesResponse = {
    data?: {
        data?: CmsBlogCategory[]
    }
}

type CmsBlogsResponse = {
    data?: {
        data?: CmsBlogPost[]
    }
}

type BlogCategoryFilter = {
    label: string
    value: string
}

type BlogPost = {
    id: string
    slug: string
    category: string
    categorySlug: string
    date: string
    readTime: string
    image: string
    title: string
    excerpt: string
    author: string
    stat: string
    body: string[]
    takeaways: string[]
    isFeatured: boolean
}

const selectedCategory = ref('all')
const currentPage = ref(1)
const postsPerPage = 3
const currentIssueMonth = computed(() => (
    new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())
))
const fallbackBlogImage = '/generated/restoration-workshop.png'
const categorySkeletonPills = ['w-16', 'w-28', 'w-20', 'w-24', 'w-28']
const blogPostSkeletonCards = [
    { titleWidth: 'w-5/6', bodyWidths: ['w-full', 'w-11/12', 'w-4/5'] },
    { titleWidth: 'w-4/5', bodyWidths: ['w-full', 'w-10/12', 'w-5/6'] },
    { titleWidth: 'w-3/4', bodyWidths: ['w-11/12', 'w-full', 'w-3/4'] },
]
const issueNoteSkeletonRows = [
    { labelWidth: 'w-20', valueWidth: 'w-32', detailWidths: ['w-full', 'w-4/5'] },
    { labelWidth: 'w-24', valueWidth: 'w-40', detailWidths: ['w-11/12', 'w-3/4'] },
    { labelWidth: 'w-16', valueWidth: 'w-28', detailWidths: ['w-full', 'w-5/6'] },
]

const {
    data: blogCategoriesData,
    pending: blogCategoriesPending,
    status: blogCategoriesStatus
} = useAsyncData<CmsBlogCategory[]>(
    'cms-blog-categories',
    async () => {
        const response = await $fetchCMS<CmsBlogCategoriesResponse>('v1/cms/blog-categories', {
            method: 'POST',
        })

        return Array.isArray(response?.data?.data) ? response.data.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false,
    }
)

const {
    data: blogsData,
    error: blogsError,
    pending: blogsPending,
    status: blogsStatus
} = useAsyncData<CmsBlogPost[]>(
    'cms-blogs',
    async () => {
        const response = await $fetchCMS<CmsBlogsResponse>('v1/cms/blogs', {
            method: 'POST',
        })

        return Array.isArray(response?.data?.data) ? response.data.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false,
    }
)

const {
    data: issueNotesData,
    error: issueNotesError,
    pending: issueNotesPending,
    status: issueNotesStatus
} = useAsyncData<CmsBlogIssueNote[]>(
    'cms-blog-issue-notes',
    async () => {
        const response = await $fetchCMS<CmsBlogIssueNotesResponse>('v1/cms/blog-issue-notes', {
            method: 'POST',
        })

        return Array.isArray(response?.data?.data) ? response.data.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false,
    }
)

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const slugify = (value: string) => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatDateLabel = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))

    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

const normalizeTextList = (value: string[] | string | null | undefined) => {
    if (Array.isArray(value)) {
        return value.map((item) => getFirstValue(item)).filter(Boolean)
    }

    const textValue = getFirstValue(value)
    if (!textValue) return []

    if (textValue.includes('<p')) {
        return textValue
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
    }

    return [textValue]
}

const normalizeFeaturedValue = (value: boolean | number | string | null | undefined) => {
    if (value === true || value === 1) return true
    return String(value).toLowerCase() === 'true' || String(value) === '1'
}

const normalizeBlogCategory = (category: CmsBlogCategory): BlogCategoryFilter | null => {
    const label = getFirstValue(category.name)

    if (!label) return null

    return {
        label,
        value: getFirstValue(category.slug) || slugify(label),
    }
}

const normalizeBlogPost = (post: CmsBlogPost): BlogPost | null => {
    const slug = getFirstValue(post.slug)
    const title = getFirstValue(post.title)

    if (!slug || !title) return null

    const category = getFirstValue(post.category_info?.name) || 'Journal'
    const categorySlug = getFirstValue(post.category_info?.slug) || slugify(category)
    const body = normalizeTextList(post.body)
    const details = normalizeTextList(post.details)

    return {
        id: getFirstValue(post.id) || slug,
        slug,
        category,
        categorySlug,
        date: formatDateLabel(getFirstValue(post.date)),
        readTime: getFirstValue(post.readTime, post.read_time) || 'Read time',
        image: getFirstValue(post.image) || fallbackBlogImage,
        title,
        excerpt: getFirstValue(post.excerpt) || details[0] || 'Read the latest from Vision148 journal.',
        author: getFirstValue(post.author) || 'Vision148',
        stat: getFirstValue(post.stat) || category,
        body: body.length ? body : details,
        takeaways: normalizeTextList(post.takeaways),
        isFeatured: normalizeFeaturedValue(post.is_featured),
    }
}

const normalizeIssueNote = (note: CmsBlogIssueNote, index: number): BlogIssueNote | null => {
    const label = getFirstValue(note.label)
    const value = getFirstValue(note.value)
    const detail = getFirstValue(note.detail)

    if (!label || !value || !detail) return null

    return {
        id: getFirstValue(note.id) || `${label}-${index}`,
        label,
        value,
        detail,
    }
}

const categories = computed<BlogCategoryFilter[]>(() => {
    const cmsCategories = (blogCategoriesData.value || [])
        .map(normalizeBlogCategory)
        .filter((category): category is BlogCategoryFilter => Boolean(category))

    return [
        { label: 'All', value: 'all' },
        ...cmsCategories,
    ]
})

const allPosts = computed<BlogPost[]>(() => (
    (blogsData.value || [])
        .map(normalizeBlogPost)
        .filter((post): post is BlogPost => Boolean(post))
))

const featuredPost = computed<BlogPost | null>(() => (
    allPosts.value.find((post) => post.isFeatured) || allPosts.value[0] || null
))

const posts = computed<BlogPost[]>(() => (
    allPosts.value.filter((post) => post.slug !== featuredPost.value?.slug)
))

const filteredPosts = computed(() => {
    if (selectedCategory.value === 'all') {
        return posts.value
    }

    return posts.value.filter((post) => post.categorySlug === selectedCategory.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / postsPerPage)))

const pageNumbers = computed(() => (
    Array.from({ length: totalPages.value }, (_, index) => index + 1)
))

const paginatedPosts = computed(() => {
    const startIndex = (currentPage.value - 1) * postsPerPage

    return filteredPosts.value.slice(startIndex, startIndex + postsPerPage)
})

const issueNotes = computed<BlogIssueNote[]>(() => (
    (issueNotesData.value || [])
        .map(normalizeIssueNote)
        .filter((note): note is BlogIssueNote => Boolean(note))
))

const shouldShowIssueNotesSkeleton = computed(() => (
    !issueNotes.value.length && (issueNotesPending.value || issueNotesStatus.value === 'idle' || issueNotesStatus.value === 'pending')
))

const shouldShowCategoriesSkeleton = computed(() => (
    categories.value.length === 1 && (blogCategoriesPending.value || blogCategoriesStatus.value === 'idle' || blogCategoriesStatus.value === 'pending')
))

const shouldShowBlogPostsSkeleton = computed(() => (
    !allPosts.value.length && (blogsPending.value || blogsStatus.value === 'idle' || blogsStatus.value === 'pending')
))

const shouldShowPagination = computed(() => (
    !shouldShowBlogPostsSkeleton.value && !blogsError.value && filteredPosts.value.length > postsPerPage
))

const scrollToJournalGrid = () => {
    if (!import.meta.client) return

    nextTick(() => {
        document.getElementById('journal-grid')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    })
}

const selectCategory = (categoryValue: string) => {
    selectedCategory.value = categoryValue
    currentPage.value = 1
}

const selectPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages.value)

    if (nextPage === currentPage.value) return

    currentPage.value = nextPage
    scrollToJournalGrid()
}

watch(categories, (newCategories) => {
    if (!newCategories.some((category) => category.value === selectedCategory.value)) {
        selectedCategory.value = 'all'
    }
}, { immediate: true })

watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages) {
        currentPage.value = newTotalPages
    }
})
</script>

<template>
    <div class="bg-tccDeepBlack text-white">
        <section class="relative min-h-[520px] overflow-hidden bg-tccDeepBlack text-white md:min-h-[620px]">
            <div class="absolute inset-0">
                <img src="/generated/restoration-workshop.png" alt="Classic car restoration workshop"
                    class="h-full w-full object-cover opacity-70">
                <div
                    class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/35 via-tccDeepBlack/45 to-tccDeepBlack" />
                <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_64%_38%,transparent_0%,rgba(3,3,3,0.34)_34%,rgba(3,3,3,0.96)_100%)]" />
            </div>

            <div
                class="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-end px-4 pb-14 pt-24 sm:px-6 md:min-h-[620px] lg:px-8">
                <div class="max-w-5xl">
                    <span class="restomod-eyebrow">Blog &amp; News</span>
                    <h1
                        class="mt-6 max-w-5xl font-poppins text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
                        Vision148 Journal
                    </h1>
                    <p class="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                        Market notes, build-room updates, ownership education, and member stories from the world of
                        collectible cars.
                    </p>
                    <div class="mt-9 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                        <div class="border-l border-tccGold/50 pl-4">
                            <span
                                class="block font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Articles</span>
                            <span v-if="shouldShowBlogPostsSkeleton"
                                class="mt-2 block h-7 w-10 animate-pulse rounded-full bg-tccGold/20" />
                            <strong v-else class="mt-1 block text-2xl font-black text-tccGold">{{ allPosts.length
                            }}</strong>
                        </div>
                        <div class="border-l border-tccGold/50 pl-4">
                            <span
                                class="block font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Categories</span>
                            <span v-if="shouldShowCategoriesSkeleton"
                                class="mt-2 block h-7 w-10 animate-pulse rounded-full bg-tccGold/20" />
                            <strong v-else class="mt-1 block text-2xl font-black text-tccGold">{{ categories.length - 1
                                }}</strong>
                        </div>
                        <div class="border-l border-tccGold/50 pl-4">
                            <span
                                class="block font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Issue</span>
                            <strong class="mt-1 block text-2xl font-black text-tccGold">{{ currentIssueMonth }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
            <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
                <article v-if="shouldShowBlogPostsSkeleton"
                    class="restomod-image-card animate-pulse overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
                    <div class="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
                        <div class="min-h-[320px] bg-white/10" />
                        <div class="flex flex-col justify-between p-6 sm:p-8">
                            <div>
                                <div class="flex flex-wrap items-center gap-3">
                                    <span class="h-3 w-24 rounded-full bg-white/10" />
                                    <span class="h-3 w-28 rounded-full bg-white/10" />
                                    <span class="h-3 w-20 rounded-full bg-white/10" />
                                </div>
                                <div class="mt-5 space-y-3">
                                    <span class="block h-8 w-11/12 rounded-full bg-white/10" />
                                    <span class="block h-8 w-4/5 rounded-full bg-white/10" />
                                </div>
                                <div class="mt-6 space-y-3">
                                    <span class="block h-3 w-full rounded-full bg-white/10" />
                                    <span class="block h-3 w-11/12 rounded-full bg-white/10" />
                                    <span class="block h-3 w-4/5 rounded-full bg-white/10" />
                                </div>
                            </div>
                            <div class="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                                <span class="h-4 w-36 rounded-full bg-white/10" />
                                <span class="h-11 w-36 rounded-full bg-tccGold/20" />
                            </div>
                        </div>
                    </div>
                </article>
                <div v-else-if="blogsError"
                    class="rounded-[1.75rem] border border-tccGold/30 bg-tccGold/10 px-6 py-8 text-sm leading-relaxed text-white/70 sm:px-8">
                    Blog posts are unavailable right now. Please refresh and try again.
                </div>
                <article v-else-if="featuredPost"
                    class="restomod-image-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
                    <div class="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
                        <div class="relative min-h-[320px] overflow-hidden bg-tccDeepBlack">
                            <img :src="featuredPost.image" :alt="featuredPost.title"
                                class="h-full w-full object-cover opacity-90">
                            <span
                                class="absolute left-5 top-5 rounded-full border border-tccGold/35 bg-tccDeepBlack/75 px-4 py-1.5 font-poppins text-[9px] font-bold uppercase tracking-[0.22em] text-tccGold">
                                Featured
                            </span>
                        </div>
                        <div class="flex flex-col justify-between p-6 sm:p-8">
                            <div>
                                <div
                                    class="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                                    <span class="text-tccGold">{{ featuredPost.category }}</span>
                                    <span>{{ featuredPost.date }}</span>
                                    <span>{{ featuredPost.readTime }}</span>
                                </div>
                                <h2 class="mt-5 font-poppins text-3xl font-black leading-tight text-white sm:text-4xl">
                                    {{ featuredPost.title }}
                                </h2>
                                <p class="mt-5 text-sm leading-relaxed text-white/60 sm:text-base">
                                    {{ featuredPost.excerpt }}
                                </p>
                            </div>
                            <div
                                class="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <span class="text-sm text-white/50">{{ featuredPost.author }}</span>
                                <NuxtLink :to="`/blog/${featuredPost.slug}`"
                                    class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.2em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                                    Read Story
                                    <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </article>
                <div v-else
                    class="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-8 text-sm leading-relaxed text-white/60 sm:px-8">
                    Blog posts are unavailable right now.
                </div>

                <aside class="restomod-panel rounded-[1.75rem] p-6 sm:p-8">
                    <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Editor
                        Notes</span>
                    <h2 class="mt-4 font-poppins text-2xl font-black leading-tight text-white">This month in the garage
                    </h2>
                    <div class="mt-7 space-y-5">
                        <template v-if="shouldShowIssueNotesSkeleton">
                            <div v-for="(noteSkeleton, skeletonIndex) in issueNoteSkeletonRows"
                                :key="`issue-note-skeleton-${skeletonIndex}`"
                                class="animate-pulse border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                                <span class="block h-3 rounded-full bg-white/10" :class="noteSkeleton.labelWidth" />
                                <span class="mt-2 block h-5 rounded-full bg-white/10"
                                    :class="noteSkeleton.valueWidth" />
                                <div class="mt-3 space-y-2">
                                    <span v-for="detailWidth in noteSkeleton.detailWidths" :key="detailWidth"
                                        class="block h-3 rounded-full bg-white/10" :class="detailWidth" />
                                </div>
                            </div>
                        </template>
                        <div v-else-if="issueNotesError"
                            class="rounded-[1.25rem] border border-tccGold/30 bg-tccGold/10 px-5 py-5 text-sm leading-relaxed text-white/70">
                            Editor notes are unavailable right now. Please refresh and try again.
                        </div>
                        <div v-else-if="!issueNotes.length"
                            class="rounded-[1.25rem] border border-white/10 bg-white/5 px-5 py-5 text-sm leading-relaxed text-white/60">
                            Editor notes are unavailable right now.
                        </div>
                        <template v-else>
                            <div v-for="note in issueNotes" :key="note.id"
                                class="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                                <span
                                    class="font-poppins text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">{{
                                        note.label }}</span>
                                <strong class="mt-1 block text-lg font-bold text-white">{{ note.value }}</strong>
                                <p class="mt-2 text-sm leading-relaxed text-white/60">{{ note.detail }}</p>
                            </div>
                        </template>
                    </div>
                </aside>
            </div>
        </section>

        <section id="journal-grid" class="bg-tccDeepBlack py-20 text-white">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div>
                        <span class="restomod-eyebrow">Latest Articles</span>
                        <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">
                            Insights from the road, workshop, and market.
                        </h2>
                    </div>

                    <div class="flex flex-wrap gap-2 lg:justify-end">
                        <template v-if="shouldShowCategoriesSkeleton">
                            <span v-for="(pillWidth, skeletonIndex) in categorySkeletonPills"
                                :key="`category-skeleton-${skeletonIndex}`"
                                class="h-[38px] animate-pulse rounded-full border border-white/10 bg-white/10"
                                :class="pillWidth" />
                        </template>
                        <template v-else>
                            <button v-for="category in categories" :key="category.value" type="button"
                                :aria-pressed="selectedCategory === category.value"
                                class="rounded-full border px-4 py-2 font-poppins text-[10px] font-bold uppercase tracking-[0.18em] transition-colors"
                                :class="selectedCategory === category.value ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/5 text-white/70 hover:border-tccGold/60 hover:text-tccGold'"
                                @click="selectCategory(category.value)">
                                {{ category.label }}
                            </button>
                        </template>
                    </div>
                </div>

                <div v-if="shouldShowBlogPostsSkeleton" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <article v-for="(cardSkeleton, skeletonIndex) in blogPostSkeletonCards"
                        :key="`blog-post-skeleton-${skeletonIndex}`"
                        class="restomod-image-card flex h-full animate-pulse flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
                        <div class="h-60 bg-white/10" />
                        <div class="flex flex-1 flex-col p-6">
                            <div class="flex gap-3">
                                <span class="h-3 w-24 rounded-full bg-white/10" />
                                <span class="h-3 w-20 rounded-full bg-white/10" />
                            </div>
                            <span class="mt-4 block h-5 rounded-full bg-white/10" :class="cardSkeleton.titleWidth" />
                            <div class="mt-5 space-y-3">
                                <span v-for="bodyWidth in cardSkeleton.bodyWidths" :key="bodyWidth"
                                    class="block h-3 rounded-full bg-white/10" :class="bodyWidth" />
                            </div>
                            <div class="mt-auto flex items-center justify-between border-t border-white/10 pt-5">
                                <span class="h-9 w-32 rounded-full bg-white/10" />
                                <span class="h-10 w-10 rounded-full bg-white/10" />
                            </div>
                        </div>
                    </article>
                </div>
                <div v-else-if="blogsError"
                    class="rounded-[1.5rem] border border-tccGold/30 bg-tccGold/10 px-5 py-6 text-sm leading-relaxed text-white/70 sm:px-6">
                    Blog posts are unavailable right now. Please refresh and try again.
                </div>
                <div v-else-if="!filteredPosts.length"
                    class="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-6 text-sm leading-relaxed text-white/60 sm:px-6">
                    No articles are available for this category right now.
                </div>
                <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <NuxtLink v-for="post in paginatedPosts" :id="post.slug" :key="post.slug" :to="`/blog/${post.slug}`"
                        class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                        <div class="relative h-60 overflow-hidden bg-tccDeepBlack">
                            <img :src="post.image" :alt="post.title" class="h-full w-full object-cover opacity-90">
                            <div
                                class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tccDeepBlack to-transparent" />
                            <span
                                class="absolute left-5 top-5 rounded-full border border-white/20 bg-tccDeepBlack/75 px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                                {{ post.category }}
                            </span>
                            <span
                                class="absolute bottom-5 left-5 rounded-full bg-tccGold px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.18em] text-tccDarkNavy">
                                {{ post.stat }}
                            </span>
                        </div>

                        <div class="flex flex-1 flex-col p-6">
                            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/40">
                                <span class="inline-flex items-center gap-1.5">
                                    <i class="pi pi-calendar text-[9px]" aria-hidden="true" />
                                    {{ post.date }}
                                </span>
                                <span>{{ post.readTime }}</span>
                            </div>
                            <h3
                                class="mt-3 font-poppins text-xl font-bold leading-tight text-white transition-colors group-hover:text-tccGold">
                                {{ post.title }}
                            </h3>
                            <p class="news-card-excerpt mt-4 text-sm leading-relaxed text-white/60">
                                {{ post.excerpt }}
                            </p>

                            <div class="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                                <div class="flex min-w-0 items-center gap-3">
                                    <img src="/assets/images/user-placeholder.svg" :alt="post.author"
                                        class="h-9 w-9 shrink-0 rounded-full border border-white/20">
                                    <span class="truncate text-xs font-medium text-white/60">{{ post.author }}</span>
                                </div>
                                <span
                                    class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tccGold/45 text-tccGold transition-all hover:bg-tccGold hover:text-tccDarkNavy"
                                    aria-hidden="true">
                                    <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                                </span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>

                <div v-if="shouldShowPagination" class="mt-12 flex justify-center">
                    <div class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                        <button type="button"
                            class="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-tccGold disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:text-white/30"
                            aria-label="Previous page" :disabled="currentPage === 1"
                            @click="selectPage(currentPage - 1)">
                            <i class="pi pi-chevron-left text-xs" aria-hidden="true" />
                        </button>
                        <button v-for="pageNumber in pageNumbers" :key="pageNumber" type="button"
                            class="h-9 min-w-9 rounded-full px-3 font-poppins text-sm font-bold transition-colors"
                            :class="currentPage === pageNumber ? 'bg-tccGold text-tccDarkNavy' : 'text-white/70 hover:bg-white/10 hover:text-tccGold'"
                            :aria-current="currentPage === pageNumber ? 'page' : undefined"
                            @click="selectPage(pageNumber)">
                            {{ pageNumber }}
                        </button>
                        <button type="button"
                            class="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-tccGold disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:text-white/30"
                            aria-label="Next page" :disabled="currentPage === totalPages"
                            @click="selectPage(currentPage + 1)">
                            <i class="pi pi-chevron-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
