<script setup lang="ts">
useHead({
  title: 'Syndicated Restoration | The Car Crowd',
  meta: [
    {
      name: 'description',
      content: 'Share the investment, the experience, and the enjoyment of syndicated classic car restoration.'
    }
  ]
})

const benefitCards = [
  {
    title: 'Shared Costs',
    image: '/generated/restoration-workshop.png',
    alt: 'Classic car restoration workshop',
    body: 'Split restoration and maintenance costs across the group. Central storage, servicing, and management available at GP59 or The Car Crowd HQ (Nottinghamshire).'
  },
  {
    title: 'Build a Collection',
    image: '/frontend/assets/images/aston_martin_vanquish.png',
    alt: 'Classic car interior',
    body: 'For the same cost as buying a single car, you could hold fractional shares in multiple restorations, perhaps an Aston Martin DB6, a Lotus Esprit, and a Porsche 911, and enjoy them across different weekends throughout the year.'
  },
  {
    title: 'Fully Protected',
    image: '/generated/home-bg.png',
    alt: 'Restored Porsche 911',
    body: 'Fully protected with legally created agreements, central accounting for transparency and external auditors for peace of mind.'
  }
]

const howItWorks = [
  'GP59 and TheCarCrowd will provide all details for each Syndicate, including all costs and estimated length of restoration.',
  'Each Syndicate is split into a number of allocations ideally between 4-8 parties.',
  'You choose the syndicate allocations you want to join. Split into a number of allocations ideally between 4 - 8 parties.',
  'You will be fully involved in the restoration with regular updates, videos and visits.',
  'You then share access to the vehicle through a dedicated shared calendar, ensuring fair and flexible usage throughout the year.',
  'Syndicate members decide to vote when to sell each year and once sold you get your % of the sale price in line with your syndicate allocations.',
  'If you want to sell your allocation, you can offer it to other members or let us help find a new owner to provide liquidity at any time.'
]

const availableSyndicates = [
  {
    title: 'The 911 Restomod',
    description: 'The perfect combination of modern tech and old school thrills',
    image: '/generated/home-bg.png',
    alt: 'Porsche 911 restomod'
  },
  {
    title: 'The Aston Martin DB6',
    description: 'Possibly the best example in the UK',
    image: '/frontend/assets/images/AstonMartin.jpg',
    alt: 'Aston Martin DB6'
  },
  {
    title: 'The Lotus Esprit Series 1',
    description: 'Absolutely perfect and turnkey ready for Summer 2026',
    image: '/generated/hero-aston-studio.png',
    alt: 'Lotus Esprit Series 1'
  }
]

</script>

<template>
  <div class="bg-tccDeepBlack font-poppins text-white">
    <section class="relative flex min-h-[680px] items-end overflow-hidden bg-[#101515] pb-24 pt-24 text-white">
        <img
          src="/generated/restoration-workshop.png"
          alt="Classic car restoration in progress"
          class="absolute inset-0 h-full w-full object-cover"
        >
        <div class="absolute inset-0 bg-black/55" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-black/35" />

        <div class="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 sm:px-8 lg:px-12">
          <div class="max-w-4xl">
            <h1 class="text-[42px] font-bold leading-tight sm:text-[56px]">Syndicated Restoration</h1>
            <p class="mt-3 text-lg font-semibold leading-relaxed text-white">Share the investment, the experience, and the enjoyment.</p>
            <a
              href="#how-it-works"
              class="mt-10 inline-flex items-center gap-2 rounded-full bg-tccGold px-7 py-4 text-[15px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
            >
              Find Out More
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-tccDarkNavy text-white">
                <i class="fa-solid fa-arrow-up-right-from-square text-[9px]" aria-hidden="true" />
              </span>
            </a>
          </div>

          <div class="flex items-center justify-end gap-8">
            <div class="flex items-center gap-3 text-white">
              <span class="text-sm font-semibold uppercase tracking-[0.35em] opacity-85">GP</span>
              <span class="grid h-14 w-24 place-items-center rounded-full border-2 border-white/80 text-2xl font-bold leading-none">
                59
              </span>
            </div>
            <img src="/frontend/assets/images/TCClogowhite.png" alt="The Car Crowd" class="h-auto w-32">
          </div>
        </div>
      </section>

      <section class="border-y border-white/10 bg-[#050403] text-white">
        <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1.08fr_1fr]">
          <div class="border-white/10 px-6 py-14 sm:px-10 lg:border-r lg:px-14">
            <p class="max-w-[620px] text-[36px] font-semibold leading-[1.18] sm:text-[46px]">
              Restoration of a classic car can be expensive and often inaccessible, and once restored used for just a few weeks each year.
            </p>
          </div>
          <div class="grid">
            <div class="border-b border-white/10 px-6 py-12 sm:px-10 lg:px-14">
              <p class="text-[30px] font-normal leading-tight sm:text-[40px]">
                Now there is a <span class="text-tccGold">Better Way.</span>
              </p>
            </div>
            <div class="px-6 py-10 sm:px-10 lg:px-14">
              <p class="text-[30px] font-normal leading-snug sm:text-[40px]">
                Introducing <span class="text-tccGold">Syndicated<br class="hidden sm:block"> Restorations.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="border-b border-white/10 bg-[#080705] py-20 sm:py-24">
        <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 sm:px-10 md:grid-cols-3 lg:px-14">
          <article
            v-for="card in benefitCards"
            :key="card.title"
            class="overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <img :src="card.image" :alt="card.alt" class="h-56 w-full object-cover opacity-90">
            <div class="px-6 pb-10 pt-5">
              <h2 class="text-[23px] font-semibold leading-tight text-white">{{ card.title }}</h2>
              <p class="mt-4 text-[15px] leading-relaxed text-white/65">{{ card.body }}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="how-it-works" class="border-b border-white/10 bg-tccDeepBlack py-20 sm:py-28">
        <div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-14">
          <div>
            <p class="max-w-[455px] text-[38px] font-semibold leading-[1.42] text-white sm:text-[46px]">
              It's classic car ownership - smarter, more social, and more sustainable.
            </p>
          </div>
          <div>
            <div class="mb-9 flex items-center gap-6">
              <h2 class="whitespace-nowrap text-[28px] font-semibold uppercase tracking-wide text-tccGold">How It Works</h2>
              <span class="h-px flex-1 bg-white/20" />
            </div>
            <ul class="space-y-5">
              <li v-for="item in howItWorks" :key="item" class="flex gap-4 text-[15px] leading-relaxed text-white/70">
                <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-tccGold" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

    <section id="available" class="border-b border-white/10 bg-[#080705] py-20 sm:py-24">
        <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <h2 class="text-center text-[36px] font-semibold leading-tight text-white sm:text-[46px]">Syndicates Available Now</h2>

          <div class="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
            <article v-for="item in availableSyndicates" :key="item.title">
              <img :src="item.image" :alt="item.alt" class="aspect-[1.5/1] w-full rounded-md object-cover">
              <h3 class="mt-5 text-[20px] font-semibold leading-tight text-white">{{ item.title }}</h3>
              <p class="mt-1 min-h-8 text-[11px] leading-relaxed text-white/55">{{ item.description }}</p>
              <a href="/coming-soon-details" class="mt-8 inline-flex items-center gap-4 text-[16px] font-normal text-white/65 transition-colors hover:text-tccGold">
                <span class="grid h-9 w-9 place-items-center bg-tccGold text-tccDarkNavy">
                  <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
                </span>
                Read More
              </a>
            </article>
          </div>
        </div>
    </section>
  </div>
</template>
