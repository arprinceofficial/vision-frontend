<script setup lang="ts">
const posts = [
  {
    user: 'SportsFanatic23',
    tag: 'Boxing',
    time: '2h ago',
    title: 'Predictions are Johnny Nelson item is being dropped for this week! 🥊',
    body: "Cannot lie... I have got a feeling Johnny Nelson is about to drop something wild this week! I do not know what it is, but the hype is real and I am here for every second of it. Stay ready, people... this one is gonna hit different.",
    likes: 342,
    comments: 28,
    avatar: '/assets/images/citizen/fan-zone/avatar.png',
    image: '/assets/images/citizen/fan-zone/icons-johnny.png',
    moderatorAvatar: '/assets/images/citizen/home/icons-andy.png',
    expanded: true,
    replies: [
      {
        user: 'SarahSportsCards',
        time: '1h ago',
        text: "I am jealous, can we see pics of them once they are on display?",
        likes: 642,
        avatar: '/assets/images/citizen/home/icons-jessica.png'
      },
      {
        user: 'DavidNFL',
        time: '1h ago',
        text: 'I second this. The whole experience including the unboxing process.',
        likes: 42,
        avatar: '/assets/images/citizen/home/icons-andy.png'
      },
      {
        user: 'MikeCollector23',
        time: '2h ago',
        text: 'Update us once the set up is complete. Hoping it will look great on display.',
        likes: 62,
        avatar: '/assets/images/citizen/home/icons-mo.png'
      }
    ]
  },
  {
    user: 'VaultCollector',
    tag: 'Formula 1',
    time: '5h ago',
    title: 'Which Hamilton legends would you like to see on the platform?',
    body: "His 2008 collection on the site blew my mind - but what about his gear from iconic Monaco Grand Prix races? Would love to see gloves, helmets or even pieces from the car. What is on your wishlist?",
    likes: 189,
    comments: 45,
    avatar: '/assets/images/citizen/home/icons-lewis.png'
  },
  {
    user: 'IconHunter',
    tag: 'Formula 1',
    time: '8h ago',
    title: "Hamilton's early game pieces are up for discussion",
    body: "Seeing some speculation that a limited run from Lewis's karting days might drop soon. Anyone heard anything about this? The nostalgia alone would make this a grail-level piece for collectors. His journey from karting to 7-time champion is legendary.",
    likes: 567,
    comments: 93,
    avatar: '/assets/images/citizen/home/icons-lewis.png'
  },
  {
    user: 'MemorabiliaNewbie',
    tag: 'Boxing',
    time: '12h ago',
    title: 'Instant test game pieces are up for discussion',
    body: "Guys, let us talk about the Sheffield legend. Johnny Nelson does not get the recognition he deserves. 13-year undefeated cruiserweight reign! The items from his career on this platform are absolute gems.",
    likes: 124,
    comments: 67,
    avatar: '/assets/images/citizen/home/icons-johnny.png'
  },
  {
    user: 'LegendaryItems',
    tag: 'Cricket',
    time: '1d ago',
    title: 'Graeme Swann signed Ashes ball - worth the investment?',
    body: 'Just spotted the 2010-11 Ashes signed ball from Swann. That series was iconic and he was absolutely instrumental. For £850, is this a good entry point for cricket memorabilia? His spin bowling stats speak for themselves.',
    likes: 892,
    comments: 156,
    avatar: '/assets/images/citizen/fan-zone/avatar.png',
    image: '/assets/images/citizen/fan-zone/icons-graeme.png'
  }
]
</script>

<template>
  <section class="mx-auto w-full max-w-[1512px] px-4 pb-16 pt-6 [font-family:var(--font-family-Body)] sm:px-6 lg:px-[72px] lg:pb-24 lg:pt-10">
    <div class="space-y-6 sm:space-y-8">
      <CitizenFanZonePostCard
        v-for="post in posts"
        :key="`${post.user}-${post.time}-${post.title}`"
        :post="post"
      />
    </div>
  </section>
</template>
