<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Blog & News - The Car Crowd',
  meta: [
    {
      name: 'description',
      content:
        'Read The Car Crowd journal for collectible car market notes, build updates, ownership education, and member event stories.'
    }
  ]
})

const { categories, featuredPost, posts, issueNotes } = useBlogPosts()

type Category = (typeof categories)[number]

const selectedCategory = ref<Category>('All')

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'All') {
    return posts
  }

  return posts.filter((post) => post.category === selectedCategory.value)
})
</script>

<template>
  <div class="bg-tccDeepBlack text-white">
    <section class="relative min-h-[520px] overflow-hidden bg-tccDeepBlack text-white md:min-h-[620px]">
      <div class="absolute inset-0">
        <img
          src="/generated/restoration-workshop.png"
          alt="Classic car restoration workshop"
          class="h-full w-full object-cover opacity-70"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/35 via-tccDeepBlack/45 to-tccDeepBlack" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_64%_38%,transparent_0%,rgba(3,3,3,0.34)_34%,rgba(3,3,3,0.96)_100%)]" />
      </div>

      <div class="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-end px-4 pb-14 pt-24 sm:px-6 md:min-h-[620px] lg:px-8">
        <div class="max-w-5xl">
          <span class="restomod-eyebrow">Blog &amp; News</span>
          <h1 class="mt-6 max-w-5xl font-poppins text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            The Car Crowd Journal
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            Market notes, build-room updates, ownership education, and member stories from the world of collectible cars.
          </p>
          <div class="mt-9 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div class="border-l border-tccGold/50 pl-4">
              <span class="block font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Articles</span>
              <strong class="mt-1 block text-2xl font-black text-tccGold">{{ posts.length }}</strong>
            </div>
            <div class="border-l border-tccGold/50 pl-4">
              <span class="block font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Categories</span>
              <strong class="mt-1 block text-2xl font-black text-tccGold">{{ categories.length - 1 }}</strong>
            </div>
            <div class="border-l border-tccGold/50 pl-4">
              <span class="block font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">Issue</span>
              <strong class="mt-1 block text-2xl font-black text-tccGold">July</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <article class="restomod-image-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
          <div class="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            <div class="relative min-h-[320px] overflow-hidden bg-tccDeepBlack">
              <img :src="featuredPost.image" :alt="featuredPost.title" class="h-full w-full object-cover opacity-90">
              <span class="absolute left-5 top-5 rounded-full border border-tccGold/35 bg-tccDeepBlack/75 px-4 py-1.5 font-poppins text-[9px] font-bold uppercase tracking-[0.22em] text-tccGold">
                Featured
              </span>
            </div>
            <div class="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div class="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
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
              <div class="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <span class="text-sm text-white/50">{{ featuredPost.author }}</span>
                <NuxtLink
                  :to="`/blog/${featuredPost.slug}`"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.2em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                >
                  Read Story
                  <i class="pi pi-arrow-right text-[10px]" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </article>

        <aside class="restomod-panel rounded-[1.75rem] p-6 sm:p-8">
          <span class="font-poppins text-[10px] font-bold uppercase tracking-[0.24em] text-tccGold">Editor Notes</span>
          <h2 class="mt-4 font-poppins text-2xl font-black leading-tight text-white">This month in the garage</h2>
          <div class="mt-7 space-y-5">
            <div v-for="note in issueNotes" :key="note.label" class="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
              <span class="font-poppins text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">{{ note.label }}</span>
              <strong class="mt-1 block text-lg font-bold text-white">{{ note.value }}</strong>
              <p class="mt-2 text-sm leading-relaxed text-white/60">{{ note.detail }}</p>
            </div>
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
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              :aria-pressed="selectedCategory === category"
              class="rounded-full border px-4 py-2 font-poppins text-[10px] font-bold uppercase tracking-[0.18em] transition-colors"
              :class="selectedCategory === category ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/5 text-white/70 hover:border-tccGold/60 hover:text-tccGold'"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="post in filteredPosts"
            :id="post.slug"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="restomod-image-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <div class="relative h-60 overflow-hidden bg-tccDeepBlack">
              <img :src="post.image" :alt="post.title" class="h-full w-full object-cover opacity-90">
              <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tccDeepBlack to-transparent" />
              <span class="absolute left-5 top-5 rounded-full border border-white/20 bg-tccDeepBlack/75 px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                {{ post.category }}
              </span>
              <span class="absolute bottom-5 left-5 rounded-full bg-tccGold px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.18em] text-tccDarkNavy">
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
              <h3 class="mt-3 font-poppins text-xl font-bold leading-tight text-white transition-colors group-hover:text-tccGold">
                {{ post.title }}
              </h3>
              <p class="news-card-excerpt mt-4 text-sm leading-relaxed text-white/60">
                {{ post.excerpt }}
              </p>

              <div class="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div class="flex min-w-0 items-center gap-3">
                  <img
                    src="/assets/images/user-placeholder.svg"
                    :alt="post.author"
                    class="h-9 w-9 shrink-0 rounded-full border border-white/20"
                  >
                  <span class="truncate text-xs font-medium text-white/60">{{ post.author }}</span>
                </div>
                <span
                  class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tccGold/45 text-tccGold transition-all hover:bg-tccGold hover:text-tccDarkNavy"
                  aria-hidden="true"
                >
                  <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-12 flex justify-center">
          <div class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button type="button" class="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition-colors hover:text-tccGold" aria-label="Previous page">
              <i class="pi pi-chevron-left text-xs" aria-hidden="true" />
            </button>
            <button type="button" class="h-9 min-w-9 rounded-full bg-tccGold px-3 font-poppins text-sm font-bold text-tccDarkNavy">1</button>
            <button type="button" class="h-9 min-w-9 rounded-full px-3 font-poppins text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-tccGold">2</button>
            <button type="button" class="h-9 min-w-9 rounded-full px-3 font-poppins text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-tccGold">3</button>
            <button type="button" class="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-tccGold" aria-label="Next page">
              <i class="pi pi-chevron-right text-xs" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
