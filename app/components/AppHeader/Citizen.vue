<script setup lang="ts">
const isMobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'My Assets', to: '/profile' },
  { label: 'Classification', to: '/investor-classification' },
  { label: 'Suitability', to: '/questionnaire' },
  { label: 'KYC Status', to: '/kyc' },
  { label: 'My Profile', to: '/profile' }
]

const productLinks = [
  { label: 'Syndicated Restoration', to: '/#products' },
  { label: 'Private Portfolio', to: '/#products' },
  { label: 'Syndicated Drive', to: '/#products' }
]

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-tccDarkNavy">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex shrink-0 items-center" aria-label="The Car Crowd home" @click="closeMobileMenu">
        <img src="/svg/TCC-Logo.svg" alt="The Car Crowd" class="h-6 w-auto transition-transform duration-300 hover:scale-[1.02] sm:h-7">
      </NuxtLink>

      <div class="hidden items-center space-x-6 lg:flex">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.to"
          class="font-poppins text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
          :class="link.label === 'Home' ? 'text-tccGold hover:text-white' : 'text-white/80 hover:text-white'"
        >
          {{ link.label }}
        </a>

        <div class="group relative">
          <button
            type="button"
            class="flex items-center gap-1 font-poppins text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors duration-200 hover:text-white focus:outline-none"
          >
            Our Products
            <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="absolute left-0 mt-2 hidden w-52 overflow-hidden rounded-md border border-white/10 bg-tccDarkNavy py-1 shadow-2xl group-hover:block">
            <a
              v-for="product in productLinks"
              :key="product.label"
              :href="product.to"
              class="block px-4 py-2 text-xs font-medium text-white/95 transition-colors hover:bg-white/10 hover:text-tccGold"
            >
              {{ product.label }}
            </a>
          </div>
        </div>
      </div>

      <div class="hidden items-center space-x-4 lg:flex">
        <a href="/profile" class="group relative" aria-label="Profile">
          <img
            src="/assets/images/user-placeholder.svg"
            alt="User"
            class="h-8 w-8 rounded-full border border-white/40 transition-colors duration-300 group-hover:border-tccGold"
          >
        </a>
        <a
          href="/login"
          class="rounded bg-tccGold px-4 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-md shadow-tccGold/10 transition-all duration-300 hover:bg-tccLightGold"
        >
          Login
        </a>
      </div>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-tccGold lg:hidden"
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

    <div v-show="isMobileMenuOpen" id="mobile-menu" class="border-t border-white/10 bg-tccNavy lg:hidden">
      <div class="space-y-3 px-4 pb-4 pt-2">
        <a
          v-for="link in navLinks"
          :key="`mobile-${link.label}`"
          :href="link.to"
          class="block py-2 font-poppins text-sm font-medium"
          :class="link.label === 'Home' ? 'text-tccGold' : 'text-white/90'"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </a>
        <a href="/#products" class="block py-2 font-poppins text-sm font-medium text-white/90" @click="closeMobileMenu">
          Our Products
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
