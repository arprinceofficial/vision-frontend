<script setup lang="ts">
const posts = [
  {
    image: '/frontend/assets/images/AstonMartin.jpg',
    tag: 'Marques',
    date: 'June 10, 2026',
    title: 'Understanding the Manual Conversion Appeal',
    excerpt:
      'Why purist collectors are paying premiums for classic supercars converted back to traditional manual transmission.',
    author: 'David Miller'
  },
  {
    image: '/frontend/assets/images/porsche.png',
    tag: 'Markets',
    date: 'May 28, 2026',
    title: 'V12 Engine Scarcity & Growth Outlook',
    excerpt:
      'As manufacturers phase out twelve-cylinder power units, historical examples are showing stronger collector demand.',
    author: 'Sarah Holmes'
  }
]

const events = [
  {
    day: '24',
    month: 'Jun',
    type: 'Syndicate Private Preview',
    title: 'Ferrari 328 GTS Launch Evening',
    detail: 'Newark HQ - 6:30 PM'
  },
  {
    day: '08',
    month: 'Jul',
    type: 'Track Event',
    title: 'Donington Park Historic Track Day',
    detail: 'Donington Park - 9:00 AM'
  },
  {
    day: '19',
    month: 'Jul',
    type: 'Member Meetup',
    title: 'Annual Classic Cars Breakfast Meet',
    detail: 'Bicester Heritage - 10:00 AM'
  }
]
</script>

<template>
  <section class="bg-[#080705] py-20 text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div class="lg:col-span-8">
          <div class="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span class="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-tccGold">Syndicate Journal</span>
              <h2 class="mt-2 font-poppins text-3xl font-black text-white">From the Community</h2>
            </div>
            <a href="https://thecarcrowd.uk/blog/" target="_blank" rel="noopener noreferrer" class="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccGold hover:text-tccLightGold">
              View Blog
            </a>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article
              v-for="post in posts"
              :key="post.title"
              class="restomod-image-card flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5"
            >
              <div class="relative h-56 overflow-hidden bg-tccDeepBlack">
                <img :src="post.image" :alt="post.title" class="h-full w-full object-cover opacity-90">
                <span class="absolute bottom-4 left-4 rounded-full border border-white/20 bg-tccDeepBlack/75 px-3 py-1 font-poppins text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                  {{ post.tag }}
                </span>
              </div>
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span class="text-[10px] text-white/40">{{ post.date }}</span>
                  <h3 class="mt-2 font-poppins text-xl font-bold leading-tight text-white transition-colors hover:text-tccGold">
                    <a href="/learn-more">{{ post.title }}</a>
                  </h3>
                  <p class="news-card-excerpt mt-3 text-sm leading-relaxed text-white/60">{{ post.excerpt }}</p>
                </div>
                <div class="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/50">
                  <span>{{ post.author }}</span>
                  <a href="/learn-more" class="font-bold uppercase tracking-[0.14em] text-tccGold hover:text-tccLightGold">Read</a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <aside class="lg:col-span-4">
          <div class="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span class="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-tccGold">Member Access</span>
              <h2 class="mt-2 font-poppins text-3xl font-black text-white">Events</h2>
            </div>
            <a href="https://thecarcrowd.uk/the-events/" target="_blank" rel="noopener noreferrer" class="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccGold hover:text-tccLightGold">
              All
            </a>
          </div>

          <div class="space-y-4">
            <article
              v-for="event in events"
              :key="event.title"
              class="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition-colors duration-200 hover:border-tccGold/40"
            >
              <div class="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-tccGold font-poppins text-tccDarkNavy">
                <span class="text-xl font-black leading-none">{{ event.day }}</span>
                <span class="mt-1 text-[9px] font-bold uppercase tracking-[0.16em]">{{ event.month }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <span class="block text-[8px] font-bold uppercase tracking-[0.2em] text-tccGold">{{ event.type }}</span>
                <h3 class="mt-1 truncate text-sm font-semibold text-white">{{ event.title }}</h3>
                <p class="mt-0.5 text-[10px] text-white/50">{{ event.detail }}</p>
              </div>
              <a
                href="/contact"
                class="rounded-full border border-tccGold/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-tccGold transition-all hover:bg-tccGold hover:text-tccDarkNavy"
              >
                Join
              </a>
            </article>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
