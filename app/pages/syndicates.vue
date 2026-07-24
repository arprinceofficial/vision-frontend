<script setup lang="ts">
useHead({
  title: 'Syndicates | The Car Crowd',
  meta: [
    {
      name: 'description',
      content: 'Join The Car Crowd syndicates for curated collectible car opportunities, funded assets, and member-managed ownership.'
    }
  ]
})

const featuredIn = ['Forbes', 'London', 'Alternative Investor', 'Autocar', 'The Telegraph']

const currentSyndicates = [
  {
    status: 'Live Now',
    title: '348 TS',
    marque: 'Ferrari',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    alt: 'Ferrari 348 TS',
    action: 'Find Out More',
    to: '/car-detail',
    isLive: true
  },
  {
    status: 'Live Now',
    title: 'Lamborghini',
    marque: 'Diablo VT Roadster',
    image: '/generated/hero-aston-studio.png',
    alt: 'Lamborghini Diablo VT Roadster',
    action: 'Find Out More',
    to: '/car-detail',
    isLive: true
  },
  {
    status: 'Coming Soon',
    title: 'Ferrari',
    marque: 'Ferrari 599 GTO',
    image: '/generated/ferrari-studio.png',
    alt: 'Ferrari 599 GTO',
    action: 'Register Interest',
    to: '/coming-soon-details',
    isLive: false
  },
  {
    status: 'Coming Soon',
    title: 'RS200',
    marque: 'Ford',
    image: '/generated/retail/ford-sierra-card.png',
    alt: 'Ford RS200',
    action: 'Register Interest',
    to: '/coming-soon-details',
    isLive: false
  }
]

const fundedSyndicates = [
  {
    title: 'Jaguar',
    model: 'XJ220',
    image: '/generated/home-bg.png',
    alt: 'Jaguar XJ220',
    to: '/funded-details'
  },
  {
    title: 'Ferrari',
    model: '360 Challenge Stradale',
    image: '/frontend/assets/images/ferrari_328_GS.png',
    alt: 'Ferrari 360 Challenge Stradale',
    to: '/funded-details'
  },
  {
    title: 'Ferrari',
    model: '512 M',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    alt: 'Ferrari 512 M',
    to: '/funded-details'
  }
]

const howItWorks = [
  {
    title: 'Management',
    image: '/generated/experiential.jpeg',
    alt: 'Syndicate management and member events',
    body: 'You are in control, with votes held on every key day-to-day decision regarding the asset, including when to sell it. TheCarCrowd arranges the management of assets, including storage, insurance and maintenance, on the trust’s behalf, and you can view your asset at any time.'
  },
  {
    title: 'Join Together',
    image: '/generated/partner image.png',
    alt: 'Members joining together at a collectible car event',
    body: 'Join together with other members to own the asset outright. You have direct ownership rights of the asset along with the other syndicate members. All details of the level of funding can be found in the Syndicate Agreement, available to view to fully registered.'
  },
  {
    title: 'Registration',
    image: '/frontend/assets/images/first_car_carousel.jpg',
    alt: 'Syndicate registration consultation',
    body: 'Complete the registration journey to check your eligibility, as we can only allow high-net-worth and sophisticated investors to join our syndicates. We will also ask you to complete a few qualification questions to make sure you understand how our syndicates work.'
  }
]

const expertPanels = [
  {
    title: 'Data Led Decisions',
    image: '/generated/retail/ford-sierra-exterior-3.png',
    alt: 'Data led collectible car research',
    body: 'Our experts conduct a meticulous, detailed inspection of every asset we bring to the platform, and all vehicle history and condition reports are available electronically for every syndicate member.'
  },
  {
    title: 'Investments Curated for You',
    image: '/generated/partner image.png',
    alt: 'Curated collectible car investments',
    body: 'We use our proprietary data analytics tool to fuel our investment thesis. We look at data from the last 10 years to visualise trends and patterns and identify the best options for you. Plus potential future returns are Capital Gains Tax free.'
  }
]
</script>

<template>
  <div class="bg-tccDeepBlack font-poppins text-white">
    <section class="relative flex min-h-[620px] items-end overflow-hidden bg-[#101515] pb-20 pt-24 text-white">
      <img
        src="/frontend/assets/images/porsche.jpeg"
        alt="The Car Crowd syndicate collectible car"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-black/55" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/45" />

      <div class="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="max-w-4xl">
          <h1 class="text-[38px] font-bold leading-tight sm:text-[58px]">TheCarCrowd Syndicates</h1>
          <p class="mt-4 max-w-3xl text-[16px] font-medium leading-relaxed text-white/85 sm:text-lg">
            Our syndicates allow you to join together with other like minded individuals and benefit from potential future appreciation.
          </p>
          <a
            href="#current-syndicates"
            class="mt-9 inline-flex items-center gap-3 rounded-full bg-tccGold px-6 py-3.5 text-[14px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
          >
            Join Syndicate
            <span class="grid h-5 w-5 place-items-center rounded-full bg-tccDarkNavy text-white">
              <i class="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>
    </section>

    <section class="border-y border-white/10 bg-[#080705] py-7 text-white">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="flex items-center gap-5">
          <span class="h-px flex-1 bg-white/15" />
          <h2 class="text-center text-[16px] font-semibold text-white/90">Featured In</h2>
          <span class="h-px flex-1 bg-white/15" />
        </div>
        <div class="mt-7 grid grid-cols-2 gap-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white/55 sm:grid-cols-5">
          <span v-for="item in featuredIn" :key="item">{{ item }}</span>
        </div>
      </div>
    </section>

    <section id="current-syndicates" class="border-b border-white/10 bg-[#050403] py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <h2 class="text-center text-[36px] font-semibold leading-tight text-white sm:text-[46px]">Current Syndicates</h2>

        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in currentSyndicates"
            :key="`${item.title}-${item.marque}`"
            class="group relative min-h-[360px] overflow-hidden rounded-md border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <img :src="item.image" :alt="item.alt" class="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105">
            <div class="absolute inset-0 bg-black/45" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
            <span
              class="absolute left-4 top-4 rounded-sm px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
              :class="item.isLive ? 'bg-emerald-400 text-tccDarkNavy' : 'bg-tccDeepBlack text-white'"
            >
              {{ item.status }}
            </span>

            <div class="absolute inset-x-0 bottom-0 p-6">
              <h3 class="text-[30px] font-semibold leading-none text-white">{{ item.title }}</h3>
              <p class="mt-2 text-[13px] font-medium text-white/75">{{ item.marque }}</p>
              <a :href="item.to" class="mt-7 inline-flex items-center gap-4 text-[13px] font-semibold text-white/85 transition-colors hover:text-tccGold">
                <span class="grid h-9 w-9 place-items-center bg-tccGold text-tccDarkNavy">
                  <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
                </span>
                {{ item.action }}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <h2 class="text-center text-[36px] font-semibold leading-tight text-white sm:text-[46px]">Funded Syndicates</h2>

        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <article
            v-for="item in fundedSyndicates"
            :key="`${item.title}-${item.model}`"
            class="group relative min-h-[360px] overflow-hidden rounded-md border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <img :src="item.image" :alt="item.alt" class="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
            <div class="absolute inset-x-0 bottom-0 p-6">
              <h3 class="text-[30px] font-semibold leading-none text-white">{{ item.title }}</h3>
              <p class="mt-2 text-[13px] font-medium text-white/75">{{ item.model }}</p>
              <a :href="item.to" class="mt-6 inline-flex items-center gap-4 text-[13px] font-semibold text-white/85 transition-colors hover:text-tccGold">
                <span class="grid h-9 w-9 place-items-center bg-tccGold text-tccDarkNavy">
                  <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
                </span>
                Find Out More
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#050403] py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <h2 class="text-center text-[36px] font-semibold leading-tight text-white sm:text-[46px]">How It Works</h2>

        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <article
            v-for="item in howItWorks"
            :key="item.title"
            class="overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <img :src="item.image" :alt="item.alt" class="h-56 w-full object-cover opacity-90">
            <div class="px-6 pb-9 pt-5">
              <h3 class="text-[22px] font-semibold leading-tight text-white">{{ item.title }}</h3>
              <p class="mt-4 text-[15px] leading-relaxed text-white/65">{{ item.body }}</p>
              <a href="/register" class="mt-8 inline-flex items-center gap-3 text-[13px] font-medium text-white/70 transition-colors hover:text-tccGold">
                <span class="grid h-9 w-9 place-items-center bg-tccGold text-tccDarkNavy">
                  <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
                </span>
                Join Us
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-20 sm:py-24">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:px-14">
        <div class="lg:col-span-8">
          <h2 class="max-w-4xl text-[34px] font-semibold leading-tight text-white sm:text-[46px]">
            Fuel Your Future with These Experts in Collectible Cars
          </h2>
          <img
            src="/frontend/assets/images/first_car_carousel.jpg"
            alt="Collectible car experts with syndicate assets"
            class="mt-8 aspect-[1.75/1] w-full rounded-md object-cover"
          >
          <div class="mt-8 max-w-4xl">
            <h3 class="text-[22px] font-semibold text-white">The First And Largest</h3>
            <p class="mt-4 text-[15px] leading-relaxed text-white/65">
              We are the UK's first platform dedicated to collectible cars with industry-leading experience in both automotive and financial services. We are the largest collectible car asset specialist in the UK.
            </p>
          </div>
        </div>

        <div class="space-y-9 border-white/10 lg:col-span-4 lg:border-l lg:pl-10">
          <article v-for="panel in expertPanels" :key="panel.title">
            <img :src="panel.image" :alt="panel.alt" class="aspect-[1.65/1] w-full rounded-md object-cover">
            <h3 class="mt-5 text-[22px] font-semibold text-white">{{ panel.title }}</h3>
            <p class="mt-3 text-[15px] leading-relaxed text-white/65">{{ panel.body }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
