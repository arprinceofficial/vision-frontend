<template>
  <footer class="overflow-hidden border-t border-white/10 bg-tccDeepBlack text-white">
    <div class="restomod-marquee">
      <div class="restomod-marquee-track">
        <span v-for="item in 10" :key="item">Vision148 Syndicate</span>
        <span v-for="item in 10" :key="`repeat-${item}`">Built In The Open</span>
      </div>
    </div>

    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
      <div class="space-y-5">
        <div class="flex items-center gap-2">
          <img src="/logo-4-BrrnFFbn.jpeg" alt="Vision148"
            class="h-auto w-[100px] transition-transform duration-300 hover:scale-[1.02] sm:w-[40px]">
          <span
            class="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/80 leading-tight hidden sm:block pl-4">Syndicated<br>Restomod</span>
        </div>
        <p class="max-w-xl text-sm leading-relaxed text-white/60">
          Collective ownership for rare automotive assets, combining transparent syndicate structures, specialist
          curation, and member access to the build journey.
        </p>
        <p class="text-xs font-semibold uppercase tracking-[0.26em] text-tccGold">
          Built in the open. Driven for life.
        </p>
      </div>

      <div>
        <h2 class="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-white">Explore</h2>
        <div class="mt-5 grid gap-3 text-sm text-white/60">
          <NuxtLink to="/showroom" class="transition-colors hover:text-tccGold">Showroom</NuxtLink>
          <NuxtLink to="/live-syndicate" class="transition-colors hover:text-tccGold">Live Syndicates</NuxtLink>
          <NuxtLink to="/funded-assets" class="transition-colors hover:text-tccGold">Funded Assets</NuxtLink>
          <NuxtLink to="/learn-more" class="transition-colors hover:text-tccGold">How It Works</NuxtLink>
        </div>
      </div>

      <div>
        <h2 class="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-white">Members</h2>
        <div class="mt-5 grid gap-3 text-sm text-white/60">
          <NuxtLink to="/investor-classification" class="transition-colors hover:text-tccGold">Classification</NuxtLink>
          <NuxtLink to="/questionnaire" class="transition-colors hover:text-tccGold">Suitability</NuxtLink>
          <NuxtLink to="/kyc" class="transition-colors hover:text-tccGold">KYC Status</NuxtLink>
          <NuxtLink to="/contact" class="transition-colors hover:text-tccGold">Contact</NuxtLink>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10 px-4 py-6 text-center text-[11px] leading-relaxed text-white/40">
      <p>TheCarCrowd Limited opportunities are not regulated by the UK Financial Conduct Authority. Your capital is at
        risk.</p>
      <p class="mt-1">&copy; 2026 Vision148. Nuxt investor portal prototype.</p>
    </div>
  </footer>
</template>
