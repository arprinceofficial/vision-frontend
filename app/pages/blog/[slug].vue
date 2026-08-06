<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

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

type CmsBlogDetailsResponse = {
  data?: CmsBlogPost | null
}

type CmsBlogsResponse = {
  data?: {
    data?: CmsBlogPost[]
  }
}

type BlogArticle = {
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
  body: string[]
  takeaways: string[]
}

const fallbackBlogImage = '/generated/restoration-workshop.png'
const detailSkeletonParagraphs = ['w-full', 'w-11/12', 'w-10/12']
const detailSkeletonTakeaways = ['w-11/12', 'w-4/5', 'w-10/12']
const relatedSkeletonCards = ['w-5/6', 'w-4/5', 'w-3/4']

const {
  data: articleData,
  error: articleError,
  pending: articlePending,
  status: articleStatus
} = useAsyncData<CmsBlogPost | null>(
  `cms-blog-${slug.value}`,
  async () => {
    if (!slug.value) return null

    const response = await $fetchCMS<CmsBlogDetailsResponse>(`v1/cms/blogs/${slug.value}`, {
      method: 'POST',
    })

    return response?.data || null
  },
  {
    default: () => null,
    lazy: true,
    server: false,
    watch: [slug],
  }
)

const {
  data: relatedBlogsData,
  error: relatedBlogsError,
  pending: relatedBlogsPending,
  status: relatedBlogsStatus
} = useAsyncData<CmsBlogPost[]>(
  'cms-related-blogs',
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

const normalizeBlogArticle = (post: CmsBlogPost): BlogArticle | null => {
  const articleSlug = getFirstValue(post.slug)
  const title = getFirstValue(post.title)

  if (!articleSlug || !title) return null

  const category = getFirstValue(post.category_info?.name) || 'Journal'
  const categorySlug = getFirstValue(post.category_info?.slug) || slugify(category)
  const body = normalizeTextList(post.body)
  const details = normalizeTextList(post.details)

  return {
    id: getFirstValue(post.id) || articleSlug,
    slug: articleSlug,
    category,
    categorySlug,
    date: formatDateLabel(getFirstValue(post.date)),
    readTime: getFirstValue(post.readTime, post.read_time) || 'Read time',
    image: getFirstValue(post.image) || fallbackBlogImage,
    title,
    excerpt: getFirstValue(post.excerpt) || details[0] || 'Read Vision148 journal.',
    author: getFirstValue(post.author) || 'Vision148',
    body: body.length ? body : details,
    takeaways: normalizeTextList(post.takeaways),
  }
}

const article = computed(() => (
  articleData.value ? normalizeBlogArticle(articleData.value) : null
))

const relatedPosts = computed(() => {
  if (!article.value) return []

  const normalizedPosts = (relatedBlogsData.value || [])
    .map(normalizeBlogArticle)
    .filter((post): post is BlogArticle => Boolean(post))
    .filter((post) => post.slug !== article.value?.slug)

  const related = normalizedPosts.filter((post) => post.categorySlug === article.value?.categorySlug)
  const fallback = normalizedPosts.filter((post) => post.categorySlug !== article.value?.categorySlug)

  return [...related, ...fallback].slice(0, 3)
})

const shouldShowArticleSkeleton = computed(() => (
  !article.value && (articlePending.value || articleStatus.value === 'idle' || articleStatus.value === 'pending')
))

const shouldShowRelatedPostsSkeleton = computed(() => (
  Boolean(article.value) && !relatedPosts.value.length && (relatedBlogsPending.value || relatedBlogsStatus.value === 'idle' || relatedBlogsStatus.value === 'pending')
))

useHead(() => ({
  title: `${article.value?.title || 'Blog'} - Vision148`,
  meta: [
    {
      name: 'description',
      content: article.value?.excerpt || 'Read Vision148 journal.'
    }
  ]
}))
</script>

<template>
  <div v-if="shouldShowArticleSkeleton" class="bg-tccDeepBlack text-white">
    <section class="relative overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white">
      <div class="absolute inset-0">
        <img :src="fallbackBlogImage" alt="Blog loading" class="h-full w-full object-cover opacity-30">
        <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/45 via-tccDeepBlack/70 to-tccDeepBlack" />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_62%_36%,transparent_0%,rgba(3,3,3,0.45)_36%,rgba(3,3,3,0.96)_100%)]" />
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <div class="h-4 w-36 animate-pulse rounded-full bg-white/10" />

        <div class="mt-10 max-w-5xl animate-pulse">
          <span class="block h-4 w-32 rounded-full bg-tccGold/20" />
          <div class="mt-6 space-y-4">
            <span class="block h-10 w-11/12 rounded-full bg-white/10 sm:h-14" />
            <span class="block h-10 w-4/5 rounded-full bg-white/10 sm:h-14" />
          </div>
          <div class="mt-6 space-y-3">
            <span class="block h-4 w-full max-w-3xl rounded-full bg-white/10" />
            <span class="block h-4 w-10/12 max-w-3xl rounded-full bg-white/10" />
          </div>
          <div class="mt-8 flex flex-wrap gap-4 border-l border-tccGold/50 pl-4">
            <span class="h-4 w-32 rounded-full bg-white/10" />
            <span class="h-4 w-20 rounded-full bg-white/10" />
            <span class="h-4 w-28 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
      <div
        class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(320px,0.28fr)] lg:px-8">
        <article class="min-w-0 animate-pulse">
          <div class="h-[320px] rounded-[1.75rem] border border-white/10 bg-white/10 sm:h-[460px]" />
          <div class="mt-10 space-y-4">
            <span v-for="paragraphWidth in detailSkeletonParagraphs" :key="paragraphWidth"
              class="block h-4 rounded-full bg-white/10" :class="paragraphWidth" />
          </div>
        </article>

        <aside class="space-y-6">
          <div class="restomod-panel animate-pulse rounded-[1.75rem] p-6">
            <span class="block h-3 w-28 rounded-full bg-tccGold/20" />
            <div class="mt-6 space-y-4">
              <div v-for="takeawayWidth in detailSkeletonTakeaways" :key="takeawayWidth"
                class="flex gap-3 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-tccGold/30" />
                <span class="h-3 rounded-full bg-white/10" :class="takeawayWidth" />
              </div>
            </div>
          </div>

          <div class="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <span class="block h-3 w-16 rounded-full bg-tccGold/20" />
            <div class="mt-5 flex items-center gap-4">
              <span class="h-12 w-12 rounded-full bg-white/10" />
              <div class="space-y-2">
                <span class="block h-4 w-32 rounded-full bg-white/10" />
                <span class="block h-3 w-40 rounded-full bg-white/10" />
              </div>
            </div>
            <div class="mt-5 space-y-3">
              <span class="block h-3 w-full rounded-full bg-white/10" />
              <span class="block h-3 w-4/5 rounded-full bg-white/10" />
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>

  <div v-else-if="article" class="bg-tccDeepBlack text-white">
    <section class="relative overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white">
      <div class="absolute inset-0">
        <img :src="article.image" :alt="article.title" class="h-full w-full object-cover opacity-55">
        <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/45 via-tccDeepBlack/70 to-tccDeepBlack" />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_62%_36%,transparent_0%,rgba(3,3,3,0.45)_36%,rgba(3,3,3,0.96)_100%)]" />
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <NuxtLink to="/blog"
          class="inline-flex items-center gap-2 font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-tccGold">
          <i class="pi pi-arrow-left text-[10px]" aria-hidden="true" />
          Back to Blog
        </NuxtLink>

        <div class="mt-10 max-w-5xl">
          <span class="restomod-eyebrow">{{ article.category }}</span>
          <h1
            class="mt-6 font-poppins text-4xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
            {{ article.title }}
          </h1>
          <p class="mt-6 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            {{ article.excerpt }}
          </p>

          <div
            class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-l border-tccGold/50 pl-4 text-sm text-white/55">
            <span class="inline-flex items-center gap-2">
              <i class="pi pi-calendar text-xs text-tccGold" aria-hidden="true" />
              {{ article.date }}
            </span>
            <span>{{ article.readTime }}</span>
            <span>{{ article.author }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
      <div
        class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(320px,0.28fr)] lg:px-8">
        <article class="min-w-0">
          <div class="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
            <img :src="article.image" :alt="article.title" class="h-[320px] w-full object-cover sm:h-[460px]">
          </div>

          <div class="mt-10 space-y-6 text-base leading-relaxed text-white/70 sm:text-lg">
            <p v-for="paragraph in article.body" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </article>

        <aside class="space-y-6">
          <div class="restomod-panel rounded-[1.75rem] p-6">
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Key
              Takeaways</span>
            <div class="mt-6 space-y-4">
              <div v-for="takeaway in article.takeaways" :key="takeaway"
                class="flex gap-3 border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-tccGold" />
                <p class="text-sm leading-relaxed text-white/70">{{ takeaway }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Author</span>
            <div class="mt-5 flex items-center gap-4">
              <img src="/assets/images/user-placeholder.svg" :alt="article.author"
                class="h-12 w-12 rounded-full border border-white/20">
              <div>
                <strong class="block text-base font-bold text-white">{{ article.author }}</strong>
                <span class="mt-1 block text-xs text-white/45">Vision148 Journal</span>
              </div>
            </div>
            <p class="mt-5 text-sm leading-relaxed text-white/60">
              Notes from the market, workshop, and member experience teams behind Vision148.
            </p>
          </div>
        </aside>
      </div>
    </section>

    <section class="bg-tccDeepBlack py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="restomod-eyebrow">Related Reading</span>
            <h2 class="mt-5 font-poppins text-3xl font-black leading-tight text-white sm:text-4xl">
              Continue the journal.
            </h2>
          </div>
          <NuxtLink to="/blog"
            class="inline-flex items-center gap-2 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccGold hover:text-tccLightGold">
            View All
            <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div v-if="shouldShowRelatedPostsSkeleton" class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article v-for="titleWidth in relatedSkeletonCards" :key="titleWidth"
            class="restomod-image-card flex h-full animate-pulse flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
            <div class="h-52 bg-white/10" />
            <div class="flex flex-1 flex-col p-5">
              <span class="h-3 w-32 rounded-full bg-white/10" />
              <span class="mt-4 h-5 rounded-full bg-white/10" :class="titleWidth" />
              <div class="mt-4 space-y-3">
                <span class="block h-3 w-full rounded-full bg-white/10" />
                <span class="block h-3 w-4/5 rounded-full bg-white/10" />
              </div>
            </div>
          </article>
        </div>
        <div v-else-if="relatedBlogsError"
          class="rounded-[1.5rem] border border-tccGold/30 bg-tccGold/10 px-5 py-6 text-sm leading-relaxed text-white/70 sm:px-6">
          Related articles are unavailable right now. Please refresh and try again.
        </div>
        <div v-else-if="relatedPosts.length" class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <NuxtLink v-for="post in relatedPosts" :key="post.slug" :to="`/blog/${post.slug}`"
            class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
            <div class="relative h-52 overflow-hidden bg-tccDeepBlack">
              <img :src="post.image" :alt="post.title" class="h-full w-full object-cover opacity-90">
              <span
                class="absolute left-4 top-4 rounded-full border border-white/20 bg-tccDeepBlack/75 px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                {{ post.category }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <span class="text-[10px] text-white/40">{{ post.date }} - {{ post.readTime }}</span>
              <h3
                class="mt-3 font-poppins text-lg font-bold leading-tight text-white transition-colors group-hover:text-tccGold">
                {{ post.title }}
              </h3>
              <p class="news-card-excerpt mt-3 text-sm leading-relaxed text-white/60">{{ post.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="bg-tccDeepBlack px-4 py-24 text-white sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center">
      <span class="restomod-eyebrow">Journal</span>
      <h1 class="mt-5 font-poppins text-3xl font-black text-white">Blog post not found</h1>
      <p class="mt-4 text-sm leading-relaxed text-white/60">
        {{ articleError ? 'The article could not be loaded right now. Please refresh and try again.' : 'The article is unavailable right now or may have been removed.' }}
      </p>
      <NuxtLink to="/blog"
        class="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.2em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
        Back to Blog
        <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>
