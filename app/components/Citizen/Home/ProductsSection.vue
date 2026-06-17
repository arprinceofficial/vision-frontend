<script setup lang="ts">
const products = [
  {
    image: '/generated/restoration-workshop.png',
    alt: 'Syndicated Restoration',
    badge: 'Restoration',
    title: 'Syndicated Restoration',
    description:
      'Pool capital with other collectors to purchase historic motor vehicles requiring sympathetic mechanical and body restoration. Reap returns upon completion and public auction.',
    action: 'Learn More',
    to: 'https://thecarcrowd.uk/syndicate-restoration/',
    disabled: false
  },
  {
    image: '/frontend/assets/images/assetsmarket.png',
    alt: 'Private Portfolio',
    badge: 'Private Portfolio',
    title: 'Private Portfolio',
    description:
      'A curated holding of multiple premium cars managed end-to-end by TCC experts. Spreads risk across eras, marques, and market sectors for premium long-term stability.',
    action: 'Learn More',
    to: 'https://thecarcrowd.uk/private-portfolios/',
    disabled: false
  },
  {
    image: '/generated/hero-aston-studio.png',
    alt: 'Syndicated Drive',
    badge: 'Drive',
    title: 'Syndicated Drive',
    description:
      'Invest in iconic modern classics that syndicate members can rent or drive for track events and historic rallies. Earn rental yield alongside asset capital growth.',
    action: 'Coming Soon',
    to: '',
    disabled: true
  }
]
</script>

<template>
  <section id="products" class="border-b border-tccBorder bg-[#f7f4f0] py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mb-12 max-w-3xl text-center">
        <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Our Offering</span>
        <h2 class="mt-1 font-poppins text-3xl font-semibold text-tccNavy sm:text-4xl">TCC Investment Products</h2>
        <p class="mt-2 text-xs text-tccMutedGray">Tailored structures matching diverse investor risk profiles and collectible car preferences.</p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <article
          v-for="product in products"
          :key="product.title"
          class="flex h-full flex-col overflow-hidden rounded-lg border border-tccBorder bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="relative h-48 overflow-hidden">
            <img :src="product.image" :alt="product.alt" class="h-full w-full object-cover">
            <span class="absolute left-4 top-4 rounded bg-tccNavy px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
              {{ product.badge }}
            </span>
          </div>
          <div class="flex flex-1 flex-col justify-between p-6">
            <div>
              <h3 class="font-poppins text-lg font-semibold text-tccNavy">{{ product.title }}</h3>
              <p class="mt-2 text-xs leading-relaxed text-gray-600">{{ product.description }}</p>
            </div>
            <a
              v-if="!product.disabled"
              :href="product.to"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-6 block rounded border border-tccNavy py-2.5 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy transition-colors duration-200 hover:bg-tccNavy hover:text-white"
            >
              {{ product.action }}
            </a>
            <span
              v-else
              class="mt-6 block cursor-not-allowed rounded border border-gray-200 bg-gray-100 py-2.5 text-center font-poppins text-xs font-bold uppercase tracking-wider text-gray-400"
            >
              {{ product.action }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
