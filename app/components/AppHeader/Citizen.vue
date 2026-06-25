<script setup lang="ts">
const isMobileMenuOpen = ref(false)
const isProductsMenuOpen = ref(false)
const productsMenuRef = ref<HTMLElement | null>(null)
const route = useRoute()

const navLinks = [
  { label: 'Home', to: '/', activePaths: ['/'] },
  { label: 'My Assets', to: '/my-assets', activePaths: ['/my-assets'] },
  { label: 'Classification', to: '/investor-classification', activePaths: ['/investor-classification'] },
  { label: 'Suitability', to: '/questionnaire', activePaths: ['/questionnaire'] },
  { label: 'KYC Status', to: '/kyc', activePaths: ['/kyc'] },
  { label: 'My Profile', to: '/profile', activePaths: ['/profile'] }
]

const productLinks = [
  { label: 'Showroom', to: '/showroom' },
  { label: 'Live Syndicates', to: '/live-syndicate' },
  { label: 'Funded Assets', to: '/funded-assets' },
  { label: 'Coming Soon', to: '/coming-soon-assets' }
]

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  isProductsMenuOpen.value = false
}

const openProductsMenu = () => {
  isProductsMenuOpen.value = true
}

const closeProductsMenu = () => {
  isProductsMenuOpen.value = false
}

const isActive = (activePaths: string[]) => activePaths.includes(route.path)

const handleDocumentClick = (event: MouseEvent) => {
  if (!productsMenuRef.value?.contains(event.target as Node)) {
    closeProductsMenu()
  }
}

watch(
  () => route.path,
  () => {
    closeMobileMenu()
  }
)

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-tccDeepBlack/80 backdrop-blur-2xl">
    <nav class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex shrink-0 items-center" aria-label="The Car Crowd home" @click="closeMobileMenu">
        <img src="/TCC-Logo.jpeg" alt="The Car Crowd" class="h-auto w-[190px] max-w-[calc(100vw-5.75rem)] transition-transform duration-300 hover:scale-[1.02] sm:w-[220px] xl:w-[160px] 2xl:w-[200px]">
      </NuxtLink>

      <div class="hidden items-center space-x-4 xl:flex 2xl:space-x-6">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.to"
          class="font-poppins text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 2xl:text-[11px] 2xl:tracking-[0.18em]"
          :class="isActive(link.activePaths) ? 'text-tccGold hover:text-white' : 'text-white/70 hover:text-white'"
        >
          {{ link.label }}
        </a>

        <div
          ref="productsMenuRef"
          class="relative"
          @mouseenter="openProductsMenu"
          @mouseleave="closeProductsMenu"
        >
          <button
            type="button"
            class="flex items-center gap-1 font-poppins text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 hover:text-white focus:outline-none 2xl:text-[11px] 2xl:tracking-[0.18em]"
            :class="isProductsMenuOpen ? 'text-tccGold' : 'text-white/70'"
            :aria-expanded="isProductsMenuOpen"
            aria-controls="products-menu"
            aria-haspopup="true"
            @click.stop="openProductsMenu"
          >
            Our Products
            <svg
              class="h-3 w-3 transition-transform duration-200"
              :class="isProductsMenuOpen ? 'rotate-180' : ''"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>
          <div
            v-show="isProductsMenuOpen"
            id="products-menu"
            class="absolute right-0 top-full z-[100] w-60 pt-4"
            @click.stop
          >
            <div class="overflow-hidden rounded-[1.25rem] border border-tccGold/25 bg-[#050403] py-2 shadow-[0_24px_80px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
              <a
                v-for="product in productLinks"
                :key="product.label"
                :href="product.to"
                class="block px-5 py-3 text-xs font-semibold text-white/90 transition-colors hover:bg-tccGold hover:text-tccDarkNavy"
                @click="closeProductsMenu"
              >
                {{ product.label }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden items-center space-x-3 xl:flex">
        <a href="/profile" class="group relative" aria-label="Profile">
          <img
            src="/assets/images/user-placeholder.svg"
            alt="User"
            class="h-8 w-8 rounded-full border border-white/30 transition-colors duration-300 group-hover:border-tccGold"
          >
        </a>
        <a
          href="/login"
          class="rounded-full bg-tccGold px-5 py-2.5 font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-tccDarkNavy shadow-md shadow-tccGold/20 transition-all duration-300 hover:bg-tccLightGold"
        >
          Login
        </a>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-tccGold xl:hidden"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle mobile navigation"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <svg v-if="!isMobileMenuOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </nav>

    <div v-show="isMobileMenuOpen" id="mobile-menu" class="border-t border-white/10 bg-tccDeepBlack/95 backdrop-blur-xl xl:hidden">
      <div class="space-y-3 px-4 pb-4 pt-2">
        <a
          v-for="link in navLinks"
          :key="`mobile-${link.label}`"
          :href="link.to"
          class="block py-2 font-poppins text-xs font-semibold uppercase tracking-[0.18em]"
          :class="isActive(link.activePaths) ? 'text-tccGold' : 'text-white/90'"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </a>
        <a
          v-for="product in productLinks"
          :key="`mobile-product-${product.label}`"
          :href="product.to"
          class="block py-2 font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-white/90"
          @click="closeMobileMenu"
        >
          {{ product.label }}
        </a>
        <div class="border-t border-white/10 pt-3">
          <a
            href="/login"
            class="block w-full rounded bg-tccGold px-4 py-2 text-center font-poppins text-sm font-semibold text-tccDarkNavy transition-colors hover:bg-tccLightGold"
            @click="closeMobileMenu"
          >
            Login / Register
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
