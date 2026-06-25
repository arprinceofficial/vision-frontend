<template>
  <footer class="overflow-hidden border-t border-white/10 bg-tccDeepBlack text-white">
    <div class="restomod-marquee">
      <div class="restomod-marquee-track">
        <span v-for="item in 10" :key="item">The Car Crowd Syndicate</span>
        <span v-for="item in 10" :key="`repeat-${item}`">Built In The Open</span>
      </div>
    </div>

    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
      <div class="space-y-5">
        <img src="/TCC-Logo.jpeg" alt="The Car Crowd" class="h-8 w-auto">
        <p class="max-w-xl text-sm leading-relaxed text-white/60">
          Collective ownership for rare automotive assets, combining transparent syndicate structures, specialist curation, and member access to the build journey.
        </p>
        <p class="text-xs font-semibold uppercase tracking-[0.26em] text-tccGold">
          Built in the open. Driven for life.
        </p>
      </div>

      <div>
        <h2 class="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-white">Explore</h2>
        <div class="mt-5 grid gap-3 text-sm text-white/60">
          <a href="/showroom" class="transition-colors hover:text-tccGold">Showroom</a>
          <a href="/live-syndicate" class="transition-colors hover:text-tccGold">Live Syndicates</a>
          <a href="/funded-assets" class="transition-colors hover:text-tccGold">Funded Assets</a>
          <a href="/learn-more" class="transition-colors hover:text-tccGold">How It Works</a>
        </div>
      </div>

      <div>
        <h2 class="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-white">Members</h2>
        <div class="mt-5 grid gap-3 text-sm text-white/60">
          <a href="/investor-classification" class="transition-colors hover:text-tccGold">Classification</a>
          <a href="/questionnaire" class="transition-colors hover:text-tccGold">Suitability</a>
          <a href="/kyc" class="transition-colors hover:text-tccGold">KYC Status</a>
          <a href="/contact" class="transition-colors hover:text-tccGold">Contact</a>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10 px-4 py-6 text-center text-[11px] leading-relaxed text-white/40">
      <p>TheCarCrowd Limited opportunities are not regulated by the UK Financial Conduct Authority. Your capital is at risk.</p>
      <p class="mt-1">&copy; 2026 The Car Crowd. Nuxt investor portal prototype.</p>
    </div>
  </footer>
</template>
