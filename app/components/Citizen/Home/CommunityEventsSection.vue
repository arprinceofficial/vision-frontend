<script setup lang="ts">
const posts = [
  {
    image: '/frontend/assets/images/AstonMartin.jpg',
    tag: 'Marques',
    date: 'June 10, 2026',
    title: 'Understanding the Manual Conversion Appeal',
    excerpt:
      'Why purist collectors are paying significant premiums for classic paddle-shift supercars converted back to traditional gated manuals.',
    author: 'David Miller'
  },
  {
    image: '/frontend/assets/images/porsche.png',
    tag: 'Markets',
    date: 'May 28, 2026',
    title: 'V12 Engine Scarcity & Growth Outlook',
    excerpt:
      'As manufacturers phase out twelve-cylinder power units, historical examples from top-tier brands are showing unprecedented capital protection qualities.',
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
  <section class="border-b border-tccBorder bg-[#f7f4f0] py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div class="lg:col-span-8">
          <div class="mb-8 flex items-baseline justify-between border-b border-gray-200 pb-3">
            <h2 class="font-poppins text-2xl font-semibold text-tccNavy">From the Community</h2>
            <a href="https://thecarcrowd.uk/blog/" target="_blank" rel="noopener noreferrer" class="font-poppins text-xs font-bold uppercase tracking-wider text-tccGold hover:text-tccLightGold">
              View Blog &rarr;
            </a>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article
              v-for="post in posts"
              :key="post.title"
              class="flex flex-col justify-between overflow-hidden rounded-lg border border-tccBorder bg-white shadow-sm"
            >
              <div class="relative h-44 bg-gray-100">
                <img :src="post.image" :alt="post.title" class="h-full w-full object-cover">
                <span class="absolute bottom-3 left-3 rounded bg-tccDarkNavy/90 px-2 py-0.5 font-poppins text-[9px] font-bold uppercase text-white">
                  {{ post.tag }}
                </span>
              </div>
              <div class="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span class="text-[10px] text-tccMutedGray">{{ post.date }}</span>
                  <h3 class="mt-1 font-poppins text-base font-semibold text-tccNavy transition-colors hover:text-tccGold">
                    <a href="/learn-more">{{ post.title }}</a>
                  </h3>
                  <p class="news-card-excerpt mt-2 text-xs leading-relaxed text-gray-600">{{ post.excerpt }}</p>
                </div>
                <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-tccMutedGray">
                  <span>{{ post.author }}</span>
                  <a href="/learn-more" class="font-bold text-tccGold hover:underline">Read Article &rarr;</a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <aside class="lg:col-span-4">
          <div class="mb-8 flex items-baseline justify-between border-b border-gray-200 pb-3">
            <h2 class="font-poppins text-2xl font-semibold text-tccNavy">Member Events</h2>
            <a href="https://thecarcrowd.uk/the-events/" target="_blank" rel="noopener noreferrer" class="font-poppins text-xs font-bold uppercase tracking-wider text-tccGold hover:text-tccLightGold">
              All Events &rarr;
            </a>
          </div>

          <div class="space-y-4">
            <article
              v-for="event in events"
              :key="event.title"
              class="flex items-center gap-4 rounded-lg border border-tccBorder bg-white p-4 transition-colors duration-200 hover:border-tccGold"
            >
              <div class="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded bg-tccNavy font-poppins text-white">
                <span class="text-lg font-bold leading-none">{{ event.day }}</span>
                <span class="mt-1 text-[9px] font-semibold uppercase tracking-wider">{{ event.month }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <span class="block text-[8px] font-bold uppercase tracking-wider text-tccGold">{{ event.type }}</span>
                <h3 class="mt-0.5 truncate text-xs font-semibold text-tccNavy">{{ event.title }}</h3>
                <p class="mt-0.5 text-[10px] text-tccMutedGray">{{ event.detail }}</p>
              </div>
              <a
                href="/contact"
                class="rounded border border-tccGold px-3 py-1.5 text-[10px] font-bold text-tccGold transition-all hover:bg-tccGold hover:text-tccDarkNavy"
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
