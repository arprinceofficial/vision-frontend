<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'My Assets | The Car Crowd'
})

type AssetStatus = 'active' | 'pending' | 'funded' | 'exited'
type FilterId = 'all' | AssetStatus

const activeFilter = ref<FilterId>('all')

const filters: Array<{ id: FilterId, label: string }> = [
  { id: 'all', label: 'All Assets' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'funded', label: 'Funded' },
  { id: 'exited', label: 'Exited' }
]

const summaryStats = [
  { label: 'Portfolio Value', value: 'GBP 64,250', helper: '+8.4% weighted growth' },
  { label: 'Total Allocations', value: '7', helper: 'Across 4 automotive assets' },
  { label: 'Documents Signed', value: '5/6', helper: 'One allocation requires action' },
  { label: 'Cash Pending', value: 'GBP 4,000', helper: 'Awaiting bank transfer' }
]

const assets: Array<{
  title: string
  image: string
  alt: string
  status: AssetStatus
  statusLabel: string
  reference: string
  allocation: string
  units: string
  valuation: string
  performance: string
  progress: number
  nextStep: string
  actionLabel: string
  actionRoute: string
  description: string
}> = [
  {
    title: 'Ferrari 365 GTB/4 Daytona',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    alt: 'Ferrari 365 GTB/4 Daytona',
    status: 'funded',
    statusLabel: 'Funded',
    reference: 'TCC-DAYTONA-09',
    allocation: 'GBP 8,500',
    units: '1 syndicate slot',
    valuation: 'GBP 11,420',
    performance: '+34.3%',
    progress: 100,
    nextStep: 'Quarterly valuation report due 18 July',
    actionLabel: 'View Holding',
    actionRoute: '/car-detail',
    description: 'Completed allocation in a documented V12 grand tourer with ongoing custody, valuation, and member reporting.'
  },
  {
    title: 'Aston Martin V8 Vantage',
    image: '/frontend/assets/images/AstonMartin.jpg',
    alt: 'Aston Martin V8 Vantage',
    status: 'pending',
    statusLabel: 'Payment Pending',
    reference: 'TCC-ASTON-12',
    allocation: 'GBP 4,000',
    units: '1 syndicate slot',
    valuation: 'Reserved',
    performance: 'Awaiting funding',
    progress: 72,
    nextStep: 'Complete bank transfer to secure allocation',
    actionLabel: 'Complete Checkout',
    actionRoute: '/payment',
    description: 'Reserved allocation awaiting settlement before SPV documents and member register updates are finalized.'
  },
  {
    title: 'Porsche 997.1 Turbo',
    image: '/frontend/assets/images/porsche.png',
    alt: 'Porsche 997.1 Turbo',
    status: 'active',
    statusLabel: 'Live Allocation',
    reference: 'TCC-P997-04',
    allocation: 'GBP 18,750',
    units: '3 syndicate slots',
    valuation: 'GBP 21,300',
    performance: '+13.6%',
    progress: 86,
    nextStep: 'Member vote open for preservation work scope',
    actionLabel: 'Review Vote',
    actionRoute: '/questionnaire',
    description: 'Active modern classic allocation with funding nearly complete and governance actions available to members.'
  },
  {
    title: 'Ferrari 355 Berlinetta',
    image: '/frontend/assets/images/ferrari_328_GS.png',
    alt: 'Ferrari 355 Berlinetta',
    status: 'exited',
    statusLabel: 'Exited',
    reference: 'TCC-F355-02',
    allocation: 'GBP 14,000',
    units: '2 syndicate slots',
    valuation: 'GBP 19,080',
    performance: '+36.2%',
    progress: 100,
    nextStep: 'Exit documents archived in portfolio records',
    actionLabel: 'View Archive',
    actionRoute: '/funded-assets',
    description: 'Completed exit with realized proceeds, archived documents, and final performance reporting available.'
  }
]

const upcomingActions = [
  { title: 'Complete Aston Martin transfer', meta: 'Due this week', icon: 'pi-credit-card' },
  { title: 'Review Porsche member vote', meta: 'Open until Friday', icon: 'pi-check-square' },
  { title: 'Download Q2 valuation pack', meta: 'Available now', icon: 'pi-file-pdf' }
]

const documents = [
  { title: 'SPV Subscription Agreement', count: '4 files' },
  { title: 'Quarterly Valuation Reports', count: '8 files' },
  { title: 'Exit Statements', count: '2 files' }
]

const filteredAssets = computed(() => (
  activeFilter.value === 'all'
    ? assets
    : assets.filter((asset) => asset.status === activeFilter.value)
))

const statusBadgeClass = (status: AssetStatus) => {
  const classes: Record<AssetStatus, string> = {
    active: 'border-tccGold/40 bg-tccGold/10 text-tccGold',
    pending: 'border-amber-300/35 bg-amber-300/10 text-amber-200',
    funded: 'border-emerald-300/35 bg-emerald-400/10 text-emerald-200',
    exited: 'border-white/20 bg-white/10 text-white/70'
  }

  return classes[status]
}
</script>

<template>
  <section class="mx-auto w-full max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
    <div class="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <div class="restomod-reveal flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[1.75rem] border border-white/10 bg-tccDeepBlack p-6 sm:p-8 lg:p-10">
        <div class="max-w-2xl">
          <span class="restomod-eyebrow">Member Portfolio</span>
          <h1 class="mt-6 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            My Assets
          </h1>
          <p class="mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Track your reserved allocations, funded holdings, valuation movement, member actions, and document records in one portfolio view.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/showroom" class="rounded-full bg-tccGold px-6 py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.22em] text-tccDarkNavy transition-colors hover:bg-tccLightGold">
              Explore Assets
            </a>
            <a href="/profile" class="rounded-full border border-white/20 px-6 py-3 text-center font-poppins text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
              Account Profile
            </a>
          </div>
        </div>
      </div>

      <aside class="restomod-panel restomod-reveal flex flex-col justify-between rounded-[1.75rem] p-6 sm:p-8">
        <div>
          <p class="font-poppins text-[10px] font-bold uppercase tracking-[0.26em] text-tccGold">Portfolio Snapshot</p>
          <div class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/10">
            <div
              v-for="stat in summaryStats"
              :key="stat.label"
              class="bg-tccDeepBlack/80 p-5"
            >
              <span class="block font-poppins text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">{{ stat.label }}</span>
              <strong class="mt-2 block font-poppins text-2xl font-black text-white">{{ stat.value }}</strong>
              <p class="mt-1 text-[11px] text-white/50">{{ stat.helper }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8 rounded-[1.25rem] border border-tccGold/20 bg-tccGold/10 p-5">
          <div class="flex items-start gap-3">
            <i class="pi pi-shield-check mt-0.5 text-lg text-tccGold" aria-hidden="true" />
            <div>
              <h2 class="font-poppins text-sm font-bold text-white">Investor checks active</h2>
              <p class="mt-1 text-xs leading-relaxed text-white/60">
                Classification and KYC status are linked to allocation approval before any transfer is finalized.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div class="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
      <div class="space-y-6">
        <div class="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="font-poppins text-xl font-bold text-white">Asset Allocations</h2>
            <p class="mt-1 text-xs text-white/50">Filter holdings by lifecycle status.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="filter in filters"
              :key="filter.id"
              type="button"
              class="rounded-full border px-4 py-2 font-poppins text-[10px] font-bold uppercase tracking-[0.18em] transition-colors"
              :class="activeFilter === filter.id ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/5 text-white/70 hover:border-tccGold/50 hover:text-white'"
              @click="activeFilter = filter.id"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <article
            v-for="asset in filteredAssets"
            :key="asset.reference"
            class="restomod-image-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40"
          >
            <div class="relative h-56 overflow-hidden bg-tccDeepBlack">
              <img :src="asset.image" :alt="asset.alt" class="h-full w-full object-cover opacity-90">
              <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tccDeepBlack to-transparent" />
              <span
                class="absolute left-4 top-4 rounded-full border px-3 py-1.5 font-poppins text-[9px] font-bold uppercase tracking-[0.22em]"
                :class="statusBadgeClass(asset.status)"
              >
                {{ asset.statusLabel }}
              </span>
            </div>

            <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{{ asset.reference }}</p>
                  <h3 class="mt-2 font-poppins text-2xl font-bold leading-tight text-white">{{ asset.title }}</h3>
                </div>
                <div class="text-right">
                  <span class="block text-[10px] uppercase tracking-[0.18em] text-white/40">Return</span>
                  <strong class="mt-1 block text-lg font-black text-tccGold">{{ asset.performance }}</strong>
                </div>
              </div>

              <p class="news-card-excerpt mt-4 text-sm leading-relaxed text-white/60">{{ asset.description }}</p>

              <div class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                <div class="bg-tccDeepBlack/80 p-4">
                  <span class="block font-poppins text-[9px] uppercase tracking-[0.22em] text-white/40">Allocation</span>
                  <strong class="mt-1 block text-sm font-semibold text-white">{{ asset.allocation }}</strong>
                  <p class="mt-1 text-[11px] text-white/50">{{ asset.units }}</p>
                </div>
                <div class="bg-tccDeepBlack/80 p-4 text-right">
                  <span class="block font-poppins text-[9px] uppercase tracking-[0.22em] text-white/40">Value</span>
                  <strong class="mt-1 block text-sm font-semibold text-white">{{ asset.valuation }}</strong>
                  <p class="mt-1 text-[11px] text-white/50">Latest estimate</p>
                </div>
              </div>

              <div class="mt-6">
                <div class="mb-2 flex items-center justify-between text-xs">
                  <span class="font-medium text-white/50">Lifecycle Progress</span>
                  <span class="font-bold text-tccGold">{{ asset.progress }}%</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-white/10">
                  <div class="h-1.5 rounded-full bg-tccGold" :style="{ width: `${asset.progress}%` }" />
                </div>
              </div>

              <div class="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-xs leading-relaxed text-white/50">{{ asset.nextStep }}</p>
                <a :href="asset.actionRoute" class="shrink-0 rounded-full border border-white/20 px-4 py-2 text-center font-poppins text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                  {{ asset.actionLabel }}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="space-y-6">
        <section class="restomod-panel rounded-[1.5rem] p-6">
          <div class="flex items-center justify-between">
            <h2 class="font-poppins text-lg font-bold text-white">Required Actions</h2>
            <span class="rounded-full bg-tccGold px-2.5 py-1 text-[10px] font-bold text-tccDarkNavy">{{ upcomingActions.length }}</span>
          </div>

          <div class="mt-5 space-y-3">
            <div
              v-for="action in upcomingActions"
              :key="action.title"
              class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <i class="pi mt-0.5 text-tccGold" :class="action.icon" aria-hidden="true" />
              <div>
                <h3 class="text-sm font-semibold text-white">{{ action.title }}</h3>
                <p class="mt-1 text-[11px] text-white/50">{{ action.meta }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="restomod-panel rounded-[1.5rem] p-6">
          <h2 class="font-poppins text-lg font-bold text-white">Portfolio Documents</h2>
          <div class="mt-5 divide-y divide-white/10">
            <a
              v-for="document in documents"
              :key="document.title"
              href="/profile"
              class="flex items-center justify-between gap-3 py-4 text-sm transition-colors hover:text-tccGold"
            >
              <span class="flex min-w-0 items-center gap-3">
                <i class="pi pi-folder text-tccGold" aria-hidden="true" />
                <span class="truncate text-white/80">{{ document.title }}</span>
              </span>
              <span class="shrink-0 text-[11px] text-white/50">{{ document.count }}</span>
            </a>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>
