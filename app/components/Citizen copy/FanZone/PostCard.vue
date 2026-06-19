<script setup lang="ts">
type Reply = {
  user: string
  time: string
  text: string
  likes: number
  avatar: string
}

type Post = {
  user: string
  tag: string
  time: string
  title: string
  body: string
  likes: number
  comments: number
  avatar: string
  image?: string
  expanded?: boolean
  replies?: Reply[]
  moderatorAvatar?: string
}

const props = defineProps<{
  post: Post
}>()
</script>

<template>
  <article class="rounded-2xl border border-black/10 bg-[#e9e9ea] p-4 text-[#202224] sm:p-6">
    <header class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3">
        <img :src="props.post.avatar" :alt="props.post.user" class="h-9 w-9 rounded-full object-cover" >
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-inter text-[clamp(1.1rem,2.7vw,1.625rem)] leading-none text-[#2a2b2d]">{{ props.post.user }}</p>
            <span class="font-inter rounded-full border border-[#d7b74a] bg-[#f7e8b3] px-2 py-0.5 text-[0.6875rem] text-[#866b14]">{{ props.post.tag }}</span>
          </div>
          <p class="font-inter mt-1 text-xs text-[#6f7278]">{{ props.post.time }}</p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#c6c8ce] text-[#7a7d82]"
        aria-label="More options"
      >
        <span class="inline-flex items-center justify-center gap-[0.15625rem]">
          <span class="h-[0.1875rem] w-[0.1875rem] rounded-full bg-current" />
          <span class="h-[0.1875rem] w-[0.1875rem] rounded-full bg-current" />
          <span class="h-[0.1875rem] w-[0.1875rem] rounded-full bg-current" />
        </span>
      </button>
    </header>

    <h3 class="font-inter mt-4 text-[clamp(1.35rem,4.2vw,2.125rem)] leading-tight text-[#222325]">{{ props.post.title }}</h3>
    <p class="font-inter mt-4 text-[clamp(1rem,2.8vw,1.6rem)] leading-[1.28] text-[#54565c]">{{ props.post.body }}</p>

    <img
      v-if="props.post.image"
      :src="props.post.image"
      :alt="props.post.title"
      class="mt-5 h-[13.75rem] w-full rounded-xl object-cover sm:h-[21.25rem]"
    >

    <div class="font-inter mt-4 flex items-center gap-6 border-y border-[#bdbfc5] py-3 text-[#787b80]">
      <button type="button" class="inline-flex items-center gap-2 text-sm">
        <span>♡</span>
        <span>{{ props.post.likes }}</span>
      </button>
      <button type="button" class="inline-flex items-center gap-2 text-sm">
        <span>◌</span>
        <span>{{ props.post.comments }}</span>
      </button>
      <button type="button" class="inline-flex items-center gap-2 text-sm">
        <span>➤</span>
      </button>
    </div>

    <section
      v-if="props.post.expanded"
      class="mt-5 rounded-[0.875rem] border border-[#8f949d] bg-[#e3e4e6] p-[0.875rem] sm:p-[1.125rem]"
    >
      <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div>
          <label class="flex h-[2.25rem] items-center rounded-full border border-[#b0b4bc] bg-[#e9eaed] px-4" for="join-conversation">
            <input
              id="join-conversation"
              type="text"
              placeholder="Join the conversation"
              class="w-full bg-transparent text-[0.8125rem] text-[#555c66] placeholder:text-[#8a8e96] focus:outline-none"
            >
          </label>

          <div class="mt-2 flex items-center gap-2 text-[0.6875rem] text-[#6f737a]">
            <span>Sort by:</span>
            <button type="button" class="font-semibold text-[#4e545d]">Best</button>
          </div>

          <div class="mt-3 space-y-4">
            <div
              v-for="reply in props.post.replies ?? []"
              :key="`${reply.user}-${reply.time}`"
              class="rounded-[0.75rem] bg-[#dcdee2] px-3 py-3"
            >
              <div class="flex items-center gap-2.5">
                <img :src="reply.avatar" :alt="reply.user" class="h-7 w-7 rounded-full object-cover ring-1 ring-black/5" >
                <p class="text-[0.75rem] font-bold text-[#1f2430]">{{ reply.user }}</p>
                <span class="text-[0.75rem] text-[#8a8e95]">{{ reply.time }}</span>
              </div>
              <p class="mt-2 text-[0.875rem] leading-[1.35] text-[#2e3340]">{{ reply.text }}</p>
              <div class="mt-2 flex items-center gap-5 text-[0.6875rem] text-[#79808a]">
                <button type="button" class="inline-flex items-center gap-1 hover:text-[#5e6570]">
                  <span>♡</span>
                  <span>{{ reply.likes }}</span>
                </button>
                <button type="button" class="hover:text-[#5e6570]">Reply</button>
              </div>
            </div>
          </div>

          <label class="mt-4 flex h-[2.25rem] items-center rounded-full border border-[#b0b4bc] bg-[#e9eaed] px-4" for="add-reply">
            <input
              id="add-reply"
              type="text"
              placeholder="Add a reply"
              class="w-full bg-transparent text-[0.8125rem] text-[#4b515d] placeholder:text-[#8a8e96] focus:outline-none"
            >
          </label>
        </div>

        <aside class="space-y-4 text-[#40434a]">
          <div class="space-y-1 text-[0.75rem] leading-tight text-[#444b58]">
            <p class="inline-flex items-center gap-2">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="5" y="7" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.5" />
                <path d="M8 7V5.5M16 7V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              <span>Created 25th Nov 2025</span>
            </p>
            <p class="inline-flex items-center gap-2">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" />
                <path d="M4 12H20M12 4C14 6 15 9 15 12C15 15 14 18 12 20M12 4C10 6 9 9 9 12C9 15 10 18 12 20" stroke="currentColor" stroke-width="1.2" />
              </svg>
              <span>Public</span>
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 sm:gap-5">
            <div>
              <p class="text-[clamp(2rem,6vw,2.5rem)] font-bold leading-none text-black">12K</p>
              <p class="mt-1 text-[0.75rem] text-[#676b73]">Visitors This Week</p>
            </div>
            <div>
              <p class="text-[clamp(2rem,6vw,2.5rem)] font-bold leading-none text-black">4K</p>
              <p class="mt-1 text-[0.75rem] text-[#676b73]">Contributions Today!</p>
            </div>
          </div>

          <div>
            <p class="text-[1.125rem] font-semibold uppercase tracking-wide text-[#676b73]">Moderators</p>
            <button
              type="button"
              class="mt-2 inline-flex h-[2.0625rem] w-full items-center justify-center gap-2 rounded-full bg-[#cfd2d8] px-4 text-[0.8125rem] font-semibold text-[#252830]"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5" />
                <path d="M5 8L12 13L19 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Message Mods
            </button>
            <div class="mt-3 flex items-center gap-2.5">
              <img
                :src="props.post.moderatorAvatar || props.post.avatar"
                alt="Moderator"
                class="h-8 w-8 rounded-full object-cover ring-1 ring-black/10"
              >
              <p class="text-[1.25rem] text-[#2f3440]">Chandila</p>
              <span class="rounded-full bg-[#3f4148] px-2 py-0.5 text-[0.625rem] font-medium text-white">Moderator</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </article>
</template>
