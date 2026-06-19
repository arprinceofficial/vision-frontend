<script setup lang="ts">
const replies = [
  {
    user: 'MikeCollector23',
    time: '2h ago',
    text: 'Update us once the setup is complete. Hoping it will look great on display!',
    likes: 64
  },
  {
    user: 'DavidNFL',
    time: '1h ago',
    text: 'I second this. The whole experience including the unboxing process.',
    likes: 42
  },
  {
    user: 'SarahSportsCards',
    time: '1h ago',
    text: "I'm jealous. Can we see pics of them once they are on display?",
    likes: 642
  }
]
</script>

<template>
  <section class="mx-auto w-full max-w-[1512px] px-4 pt-10 [font-family:var(--font-family-Body)] sm:px-6 lg:px-[72px] lg:pt-12">
    <article class="overflow-hidden rounded-[20px] border border-black/10 bg-[#f0f0f0] text-[#171717] shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
      <div class="border-b border-black/10 px-5 py-5 sm:px-8 sm:py-7">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="h-11 w-11 rounded-full bg-gradient-to-br from-[#d5d9e0] to-[#9ba3af]" />
            <div class="flex flex-col">
              <p class="text-[15px] font-bold text-black">SportsFanatic23</p>
              <div class="flex items-center gap-2 text-[13px] text-[#737780]">
                <span class="rounded-full border border-black/20 px-2 py-0.5 text-[12px] font-medium uppercase tracking-wide text-black">Boxing</span>
                <span>2h ago</span>
              </div>
            </div>
          </div>
          <button type="button" class="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85">
            Join Thread
          </button>
        </div>

        <h2 class="mt-6 text-[clamp(1.5rem,4vw,2.125rem)] font-medium leading-tight text-[#171717]">
          Predictions are Johnny Nelson item is being dropped for this week!
        </h2>
        <p class="mt-4 text-[clamp(1rem,2.4vw,1.375rem)] leading-[1.4] text-[#525252]">
          Cannot lie. I have a feeling Johnny Nelson is about to drop something wild this week. I do not know what it is,
          but the hype is real and I am here for every second of it. Stay ready people, this one is going to hit different.
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-black/10 pt-5">
          <button type="button" class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#171717] shadow-sm transition hover:bg-black/5">
            <span>Likes</span>
            <span>342</span>
          </button>
          <button type="button" class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#171717] shadow-sm transition hover:bg-black/5">
            <span>Comments</span>
            <span>28</span>
          </button>
          <button type="button" class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#171717] shadow-sm transition hover:bg-black/5">
            Share
          </button>
        </div>
      </div>

      <div class="space-y-5 bg-white px-5 py-6 sm:px-8 sm:py-8">
        <div
          v-for="reply in replies"
          :key="`${reply.user}-${reply.time}`"
          class="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 sm:p-5"
        >
          <p class="text-sm leading-relaxed text-[#4a4a4a] sm:text-[15px]">{{ reply.text }}</p>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-sm">
              <span class="font-bold text-[#171717]">{{ reply.user }}</span>
              <span class="text-[#85898f]">{{ reply.time }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" class="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#4f5560] transition hover:bg-black/5">
                Like {{ reply.likes }}
              </button>
              <button type="button" class="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-[#4f5560] transition hover:bg-black/5">
                Reply
              </button>
            </div>
          </div>
        </div>

        <label class="flex items-center justify-between gap-3 rounded-full border border-black/15 bg-[#f3f4f6] px-4 py-3" for="fan-zone-reply">
          <input
            id="fan-zone-reply"
            type="text"
            placeholder="Add a reply"
            class="w-full bg-transparent text-sm text-[#171717] placeholder:text-[#878b92] focus:outline-none"
          >
          <span class="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">Send</span>
        </label>
      </div>
    </article>
  </section>
</template>
