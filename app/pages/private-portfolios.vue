<script setup lang="ts">
useHead({
  title: 'Private Portfolios | The Car Crowd',
  meta: [
    {
      name: 'description',
      content: 'Private collectible car portfolio curation, sourcing, custody, and realisation from The Car Crowd.'
    }
  ]
})

const featuredIn = ['Forbes', 'London', 'Alternative Investor', 'Autocar', 'The Telegraph']

const investmentCards = [
  {
    title: 'Access Our Investment Thesis',
    image: '/frontend/assets/images/ferrari_328_GS.png',
    alt: 'Classic Ferrari detail',
    body: 'Our proprietary investment thesis, created over the past 5 years from over 1 million data points, identifies the most investable collectable cars. Let us help take the emotion out of selecting the best cars for your portfolio.'
  },
  {
    title: 'Simple and Easy',
    image: '/frontend/assets/images/aston_martin_vanquish.png',
    alt: 'Prestige car interior with sporting seats',
    body: 'Let our team provide a full range of services from selection, sourcing and storage all the way through to sales. We manage your portfolio from end-to-end, giving you complete peace of mind.'
  },
  {
    title: 'True Diversification',
    image: '/generated/ferrari-studio.png',
    alt: 'Classic car keys and collection detail',
    body: 'Collectible cars are uncorrelated to traditional investment options and are asset-backed, helping to reduce risk. Plus, in the UK, any returns benefit from being Capital Gains Tax free.'
  }
]

const portfolioServices = [
  {
    title: 'Portfolio Consulting',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    alt: 'Red classic Ferrari collection',
    body: 'Our curators work with you to determine your investment motivations, as well as the exact objectives and requirements for your portfolio.'
  },
  {
    title: 'Asset Curation',
    image: '/frontend/assets/images/ferrari_328_GS.png',
    alt: 'Classic Ferrari in a private garage',
    body: 'Over 60 years of collecting classic and prestige cars, combined with a data-driven approach to identifying the best-appreciating classics worldwide.'
  },
  {
    title: 'True Diversification',
    image: '/frontend/assets/images/first_car_carousel.jpg',
    alt: 'Curated cars on a private road',
    body: 'Collectible cars are uncorrelated to traditional investment options and are asset-backed, helping to reduce risk. Plus, in the UK, any returns benefit from being Capital Gains Tax free.'
  },
  {
    title: 'Asset Custody',
    image: '/generated/partner image.png',
    alt: 'Specialist automotive custody partner facility',
    body: 'Join together with other members to own the asset outright. You have direct ownership rights of the asset along with the other syndicate members.'
  },
  {
    title: 'Asset Realisation',
    image: '/frontend/assets/images/porsche.jpeg',
    alt: 'Collectible car badge and bodywork',
    body: 'Maximising your returns via a global network of buyers. Quarterly valuations using third-party market reports.'
  },
  {
    title: 'Asset Experience',
    image: '/generated/experiential.jpeg',
    alt: 'Private driving experience with a collectible car',
    body: 'You can drive your cars as much or as little as you like. We also provide access to curated experiences and concierge delivery of your assets across Europe.'
  }
]
</script>

<template>
  <div class="bg-tccDeepBlack font-poppins text-white">
    <section class="relative flex min-h-[620px] items-end overflow-hidden bg-[#11100d] pb-20 pt-24 text-white">
      <img
        src="/frontend/assets/images/first_car_carousel.jpg"
        alt="Private collectible car portfolio"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-black/55" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/45" />

      <div class="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div class="max-w-4xl">
          <h1 class="text-[42px] font-bold leading-tight sm:text-[58px]">Private Portfolios</h1>
          <p class="mt-4 max-w-3xl text-[16px] font-medium leading-relaxed text-white/85 sm:text-lg">
            If you're passionate about cars, interested in alternatives, or looking to diversify, a private portfolio could be right for you.
          </p>
          <a
            href="#consultation"
            class="mt-9 inline-flex items-center gap-3 rounded-full bg-tccGold px-6 py-3.5 text-[14px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
          >
            Get In Touch
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

    <section class="border-b border-white/10 bg-[#050403] py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <div class="max-w-5xl">
          <h2 class="text-[34px] font-semibold leading-tight text-white sm:text-[44px]">Why Invest In A Private Portfolio?</h2>
          <p class="mt-5 text-[15px] leading-relaxed text-white/65">
            Building a private collection takes skill and know-how. Investing in the right assets at the right time, as well as balancing emotional and financial returns that fit your overall strategy can be tricky. Our experts are on-hand to guide you through the process to maximise profit and enjoyment.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <article
            v-for="card in investmentCards"
            :key="card.title"
            class="overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <img :src="card.image" :alt="card.alt" class="h-60 w-full object-cover opacity-90">
            <div class="px-6 pb-9 pt-5">
              <h3 class="text-[22px] font-semibold leading-tight text-white">{{ card.title }}</h3>
              <p class="mt-4 text-[15px] leading-relaxed text-white/65">{{ card.body }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden py-28 text-center text-white sm:py-36">
      <img
        src="/generated/porsche-studio.png"
        alt="Exceptional collector car"
        class="absolute inset-0 h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-black/60" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/60" />
      <div class="relative mx-auto max-w-4xl px-6">
        <h2 class="text-[38px] font-semibold leading-tight sm:text-[58px]">The art of curating exceptional machines</h2>
      </div>
    </section>

    <section id="consultation" class="border-y border-white/10 bg-[#080705] py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 class="text-[34px] font-semibold leading-tight text-white sm:text-[44px]">With You Every Step Of The Way</h2>
            <p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">
              Speak to our Private Office team to discuss personalised portfolio options that suit you.
            </p>
          </div>
          <a
            href="/contact"
            class="inline-flex items-center justify-center gap-3 rounded-full border border-tccGold/50 bg-tccGold px-6 py-3.5 text-[13px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold md:shrink-0"
          >
            Book A Call
            <i class="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
          </a>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="service in portfolioServices"
            :key="service.title"
            class="overflow-hidden rounded-md border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <img :src="service.image" :alt="service.alt" class="h-56 w-full object-cover opacity-90">
            <div class="px-6 pb-9 pt-5">
              <h3 class="text-[21px] font-semibold leading-tight text-white">{{ service.title }}</h3>
              <p class="mt-4 text-[15px] leading-relaxed text-white/65">{{ service.body }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#050403]">
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <div class="flex items-center px-6 py-20 sm:px-10 lg:px-14">
          <div class="max-w-2xl">
            <h2 class="text-[34px] font-semibold leading-tight text-white sm:text-[44px]">Safe and real assets</h2>
            <div class="mt-6 space-y-5 text-[16px] leading-relaxed text-white/68">
              <p>
                Placing capital into collectible cars presents a secure choice for wealth preservation and growth. The market for collector cars has generally shown attractive portfolio characteristics.
              </p>
              <p>
                Returns have been consistently high, values have not been impacted by global downturns, and correlations with other asset classes such as equities, bonds and property have been low.
              </p>
              <p>
                Unlike intangible assets, cars possess intrinsic value and cannot go bankrupt. This stability, together with the substantial potential returns, makes cars a compelling option for those seeking both security and financial growth.
              </p>
            </div>
            <a
              href="#consultation"
              class="mt-9 inline-flex items-center gap-3 rounded-full bg-tccGold px-6 py-3.5 text-[13px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
            >
              Find Out More
              <i class="fa-solid fa-circle-arrow-right text-[13px]" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div class="min-h-[520px]">
          <img
            src="/generated/partner image.png"
            alt="Collector cars stored with a specialist automotive partner"
            class="h-full w-full object-cover"
          >
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden border-b border-white/10 py-16 text-center text-white">
      <img src="/generated/hero-aston-studio.png" alt="Private portfolio collection" class="absolute inset-0 h-full w-full object-cover">
      <div class="absolute inset-0 bg-black/65" />
      <div class="relative mx-auto max-w-5xl px-6">
        <h2 class="text-[28px] font-semibold uppercase leading-tight tracking-[0.06em] text-white sm:text-[38px]">Ready To Build Your Dream Collection?</h2>
        <p class="mt-3 text-[14px] leading-relaxed text-white/70">Request a consultation with our expert team today.</p>
        <a
          href="/contact"
          class="mt-7 inline-flex items-center gap-3 rounded-full bg-tccGold px-6 py-3 text-[13px] font-bold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
        >
          Get Started
          <i class="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
        </a>
      </div>
    </section>
  </div>
</template>
