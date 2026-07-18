<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const { getBlogArticleBySlug, getRelatedBlogPosts } = useBlogPosts()

const slug = computed(() => String(route.params.slug || ''))
const article = computed(() => getBlogArticleBySlug(slug.value))
const relatedPosts = computed(() => {
  if (!article.value) {
    return []
  }

  return getRelatedBlogPosts(article.value.slug, article.value.category)
})

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog post not found'
  })
}

useHead(() => ({
  title: `${article.value?.title || 'Blog'} - The Car Crowd`,
  meta: [
    {
      name: 'description',
      content: article.value?.excerpt || 'Read The Car Crowd journal.'
    }
  ]
}))
</script>

<template>
  <div v-if="article" class="bg-tccDeepBlack text-white">
    <section class="relative overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white">
      <div class="absolute inset-0">
        <img :src="article.image" :alt="article.title" class="h-full w-full object-cover opacity-55">
        <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/45 via-tccDeepBlack/70 to-tccDeepBlack" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_62%_36%,transparent_0%,rgba(3,3,3,0.45)_36%,rgba(3,3,3,0.96)_100%)]" />
      </div>

      <div class="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center gap-2 font-poppins text-[10px] font-bold uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-tccGold"
        >
          <i class="pi pi-arrow-left text-[10px]" aria-hidden="true" />
          Back to Blog
        </NuxtLink>

        <div class="mt-10 max-w-5xl">
          <span class="restomod-eyebrow">{{ article.category }}</span>
          <h1 class="mt-6 font-poppins text-4xl font-black leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
            {{ article.title }}
          </h1>
          <p class="mt-6 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            {{ article.excerpt }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-l border-tccGold/50 pl-4 text-sm text-white/55">
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
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(320px,0.28fr)] lg:px-8">
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
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Key Takeaways</span>
            <div class="mt-6 space-y-4">
              <div
                v-for="takeaway in article.takeaways"
                :key="takeaway"
                class="flex gap-3 border-t border-white/10 pt-4 first:border-t-0 first:pt-0"
              >
                <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-tccGold" />
                <p class="text-sm leading-relaxed text-white/70">{{ takeaway }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Author</span>
            <div class="mt-5 flex items-center gap-4">
              <img src="/assets/images/user-placeholder.svg" :alt="article.author" class="h-12 w-12 rounded-full border border-white/20">
              <div>
                <strong class="block text-base font-bold text-white">{{ article.author }}</strong>
                <span class="mt-1 block text-xs text-white/45">The Car Crowd Journal</span>
              </div>
            </div>
            <p class="mt-5 text-sm leading-relaxed text-white/60">
              Notes from the market, workshop, and member experience teams behind The Car Crowd.
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
          <NuxtLink
            to="/blog"
            class="inline-flex items-center gap-2 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccGold hover:text-tccLightGold"
          >
            View All
            <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="post in relatedPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <div class="relative h-52 overflow-hidden bg-tccDeepBlack">
              <img :src="post.image" :alt="post.title" class="h-full w-full object-cover opacity-90">
              <span class="absolute left-4 top-4 rounded-full border border-white/20 bg-tccDeepBlack/75 px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                {{ post.category }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <span class="text-[10px] text-white/40">{{ post.date }} - {{ post.readTime }}</span>
              <h3 class="mt-3 font-poppins text-lg font-bold leading-tight text-white transition-colors group-hover:text-tccGold">
                {{ post.title }}
              </h3>
              <p class="news-card-excerpt mt-3 text-sm leading-relaxed text-white/60">{{ post.excerpt }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
