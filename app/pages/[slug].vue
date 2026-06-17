<script setup lang="ts">
definePageMeta({
  layout: false
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

type PageConfig = {
  title: string
  eyebrow: string
  description: string
  type: 'auth' | 'status' | 'form' | 'showroom' | 'asset-list' | 'asset-detail' | 'checkout' | 'documents' | 'contact' | 'vote'
  icon?: string
  tone?: NoticeTone
  primary?: { label: string, to: string }
  secondary?: { label: string, to: string }
}

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const pageMap: Record<string, PageConfig> = {
  'forgot-password': {
    title: 'Forgot Your Password?',
    eyebrow: 'Account Recovery',
    description: 'Enter your registered email and we will prepare a secure reset link for your investor account.',
    type: 'auth',
    primary: { label: 'Send Reset Link', to: '/reset-password' },
    secondary: { label: 'Back to Login', to: '/login' }
  },
  'reset-password': {
    title: 'Create New Password',
    eyebrow: 'Password Reset',
    description: 'Choose a new password for your The Car Crowd portal access.',
    type: 'auth',
    primary: { label: 'Update Password', to: '/login' },
    secondary: { label: 'Back to Login', to: '/login' }
  },
  'otp-verification': {
    title: 'Verification Code',
    eyebrow: 'Secure Sign In',
    description: 'Enter the four digit code sent to your email inbox before continuing to the showroom.',
    type: 'auth',
    primary: { label: 'Verify Code', to: '/showroom' },
    secondary: { label: 'Back to Login', to: '/login' }
  },
  'about-you': {
    title: 'Tell Us About You',
    eyebrow: 'Investor Profile',
    description: 'Complete your profile basics so the onboarding checks can match your intended allocation.',
    type: 'form',
    primary: { label: 'Continue', to: '/profile-complete' }
  },
  'high-net-worth': {
    title: 'High Net Worth Investor',
    eyebrow: 'Self Certification',
    description: 'Review and confirm the high net worth declaration before moving into the suitability checks.',
    type: 'documents',
    primary: { label: 'Confirm Declaration', to: '/questionnaire' },
    secondary: { label: 'Back to Classification', to: '/investor-classification' }
  },
  sophisticated: {
    title: 'Sophisticated Investor',
    eyebrow: 'Self Certification',
    description: 'Confirm the sophisticated investor declaration that best applies to your experience.',
    type: 'documents',
    primary: { label: 'Confirm Declaration', to: '/questionnaire' },
    secondary: { label: 'Back to Classification', to: '/investor-classification' }
  },
  'profile-complete': {
    title: 'Profile Complete',
    eyebrow: 'Onboarding Progress',
    description: 'Your profile information is ready. Continue through the final compliance steps.',
    type: 'status',
    icon: 'pi-check',
    tone: 'success',
    primary: { label: 'Continue', to: '/nearly-there' }
  },
  'nearly-there': {
    title: 'Nearly There',
    eyebrow: 'Final Checks',
    description: 'A few short confirmations remain before you can reserve a classic car syndicate slot.',
    type: 'status',
    icon: 'pi-hourglass',
    tone: 'info',
    primary: { label: 'Review Documents', to: '/documents-review' }
  },
  congratulations: {
    title: 'Congratulations',
    eyebrow: 'Access Approved',
    description: 'Your investor journey is ready. You can now explore the showroom and follow live allocations.',
    type: 'status',
    icon: 'pi-star',
    tone: 'success',
    primary: { label: 'Open Showroom', to: '/showroom' }
  },
  'kyc-success': {
    title: 'Identity Verified',
    eyebrow: 'KYC Complete',
    description: 'Your identity and AML checks have been recorded successfully.',
    type: 'status',
    icon: 'pi-verified',
    tone: 'success',
    primary: { label: 'Continue to Payment', to: '/payment' },
    secondary: { label: 'My Profile', to: '/profile' }
  },
  'quiz-failed': {
    title: 'Suitability Review Needed',
    eyebrow: 'Questionnaire Result',
    description: 'Some answers need review before you can access live syndicate allocations.',
    type: 'status',
    icon: 'pi-exclamation-triangle',
    tone: 'warning',
    primary: { label: 'Retry Questionnaire', to: '/questionnaire' },
    secondary: { label: 'Contact Support', to: '/contact' }
  },
  countdown: {
    title: 'Allocation Window Opening Soon',
    eyebrow: 'Countdown',
    description: 'This allocation is not yet open. Register interest and return when the reservation window starts.',
    type: 'status',
    icon: 'pi-clock',
    tone: 'info',
    primary: { label: 'View Coming Soon Assets', to: '/coming-soon-assets' }
  },
  'learn-more': {
    title: 'How Syndicates Work',
    eyebrow: 'Investor Education',
    description: 'Understand the trust structure, voting rights, storage, insurance, and exit mechanics before allocating capital.',
    type: 'documents',
    primary: { label: 'Start Classification', to: '/investor-classification' },
    secondary: { label: 'View Showroom', to: '/showroom' }
  },
  showroom: {
    title: 'Investment Showroom',
    eyebrow: 'Live Classic Car Syndicates',
    description: 'Explore active, funded, and upcoming collectible car opportunities from one connected dashboard.',
    type: 'showroom'
  },
  'live-syndicate': {
    title: 'Live Syndicates',
    eyebrow: 'Open Allocations',
    description: 'Review the live cars currently accepting allocation reservations.',
    type: 'asset-list'
  },
  'funded-assets': {
    title: 'Funded Assets & Exits',
    eyebrow: 'Portfolio Archive',
    description: 'Track completed raises, exits, and historical asset performance.',
    type: 'asset-list'
  },
  'coming-soon-assets': {
    title: 'Coming Soon Assets',
    eyebrow: 'Pipeline',
    description: 'Preview the next classic car syndicates before their allocation windows open.',
    type: 'asset-list'
  },
  'car-detail': {
    title: 'Aston Martin Vanquish S',
    eyebrow: 'Live Syndicate',
    description: 'Pure V12 performance with a rare manual conversion, curated for a fractional classic car syndicate.',
    type: 'asset-detail',
    primary: { label: 'Reserve Allocation', to: '/cart' }
  },
  'asset-details': {
    title: 'Ferrari 365 GTB/4 Daytona',
    eyebrow: 'Asset Detail',
    description: 'A detailed view of the investment thesis, provenance, allocation metrics, and reservation controls.',
    type: 'asset-detail',
    primary: { label: 'Reserve Allocation', to: '/cart' }
  },
  'funded-details': {
    title: 'Porsche 911 Turbo',
    eyebrow: 'Funded Asset',
    description: 'Review the funded syndicate summary, member documents, and historical portfolio status.',
    type: 'asset-detail',
    primary: { label: 'View Signed Documents', to: '/signed-documents' },
    secondary: { label: 'Payment Details', to: '/payment-details' }
  },
  'coming-soon-details': {
    title: 'Lamborghini Diablo VT',
    eyebrow: 'Coming Soon',
    description: 'Preview the upcoming asset thesis and register interest before the raise opens.',
    type: 'asset-detail',
    primary: { label: 'Register Interest', to: '/countdown' }
  },
  cart: {
    title: 'Reservation Cart',
    eyebrow: 'Allocation Review',
    description: 'Confirm your selected syndicate slot before continuing through voting and documents.',
    type: 'checkout',
    primary: { label: 'Continue to Vote', to: '/syndicate-vote' },
    secondary: { label: 'Back to Asset', to: '/car-detail' }
  },
  payment: {
    title: 'Checkout Allocation',
    eyebrow: 'Payment Setup',
    description: 'Select bank transfer or crypto settlement for your reserved allocation.',
    type: 'checkout',
    primary: { label: 'Confirm Reservation', to: '/cart-success' },
    secondary: { label: 'Bank Details', to: '/bank-details' }
  },
  'payment-details': {
    title: 'Crypto Payment Details',
    eyebrow: 'Funds Settlement',
    description: 'Use the escrow wallet reference and amount below when making your crypto transfer.',
    type: 'checkout',
    primary: { label: 'I Have Paid', to: '/cart-success' },
    secondary: { label: 'Back to Cart', to: '/cart' }
  },
  'bank-details': {
    title: 'Bank Transfer Details',
    eyebrow: 'Escrow Settlement',
    description: 'Use these trust account details and your reference code for bank transfers.',
    type: 'checkout',
    primary: { label: 'Return to Dashboard', to: '/profile' },
    secondary: { label: 'Back to Payment', to: '/payment' }
  },
  'cart-success': {
    title: 'Reservation Confirmed',
    eyebrow: 'Cart Complete',
    description: 'Your allocation reservation has been logged. The support desk will reconcile payment and documents.',
    type: 'status',
    icon: 'pi-check',
    tone: 'success',
    primary: { label: 'Go to Dashboard', to: '/profile' },
    secondary: { label: 'View Showroom', to: '/showroom' }
  },
  'documents-review': {
    title: 'Documents Review',
    eyebrow: 'Syndicate Documents',
    description: 'Review the subscription deed, member terms, trust summary, and risk disclosures before signing.',
    type: 'documents',
    primary: { label: 'Continue to Agreement', to: '/agreement' }
  },
  agreement: {
    title: 'What Happens Next',
    eyebrow: 'Agreement Submitted',
    description: 'Your agreement pack has been queued for counter-signature, identity matching, and payment reconciliation.',
    type: 'documents',
    primary: { label: 'Continue to Signature', to: '/legal-signature' },
    secondary: { label: 'Contact Support', to: '/contact' }
  },
  'legal-signature': {
    title: 'Legal Signature',
    eyebrow: 'Execution',
    description: 'Apply your electronic signature to confirm the subscription deed and member declarations.',
    type: 'documents',
    primary: { label: 'Sign Documents', to: '/signed-documents' }
  },
  'signed-documents': {
    title: 'Signed Documents',
    eyebrow: 'Document Vault',
    description: 'Download executed documents and proceed to funds settlement when ready.',
    type: 'documents',
    primary: { label: 'Proceed to Payment Details', to: '/payment-details' }
  },
  'syndicate-documents': {
    title: 'Syndicate Documents',
    eyebrow: 'Voting Pack',
    description: 'Review the documents provided for this syndicate vote before submitting your instruction.',
    type: 'documents',
    primary: { label: 'Continue to Vote', to: '/syndicate-vote' }
  },
  'syndicate-vote': {
    title: 'Syndicate Vote',
    eyebrow: 'Member Instruction',
    description: 'Submit your voting instruction for the proposed syndicate action.',
    type: 'vote',
    primary: { label: 'Submit Vote', to: '/syndicate-documents' }
  },
  contact: {
    title: 'Contact Investor Support',
    eyebrow: 'Support Desk',
    description: 'Send a message to The Car Crowd team for onboarding, payment, or document support.',
    type: 'contact',
    primary: { label: 'Send Message', to: '/profile' }
  }
}

const page = computed<PageConfig>(() => pageMap[slug.value] || {
  title: 'Page Not Found',
  eyebrow: 'Unknown Template',
  description: 'This route is not mapped from the supplied HTML template directory yet.',
  type: 'status',
  icon: 'pi-question-circle',
  tone: 'warning',
  primary: { label: 'Go Home', to: '/' }
})

useHead(() => ({
  title: `${page.value.title} | The Car Crowd`
}))

const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const selectedPayment = ref('bank')
const selectedVote = ref('')

const assetCards = [
  {
    title: 'Aston Martin Vanquish S',
    tag: 'Live Raise',
    image: '/frontend/assets/images/AstonMartin.jpg',
    route: '/car-detail',
    detail: 'Manual converted V12 grand tourer with limited supply and strong collector demand.',
    value: 'GBP 250,000',
    progress: '68%'
  },
  {
    title: 'Ferrari 365 GTB/4 Daytona',
    tag: 'Live Raise',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    route: '/asset-details',
    detail: 'Blue-chip Ferrari profile with international provenance and scarcity.',
    value: 'GBP 425,000',
    progress: '82%'
  },
  {
    title: 'Porsche 911 Turbo',
    tag: 'Funded',
    image: '/frontend/assets/images/porsche.png',
    route: '/funded-details',
    detail: 'Funded archive holding with performance history and document access.',
    value: 'GBP 180,000',
    progress: '100%'
  },
  {
    title: 'Lamborghini Diablo VT',
    tag: 'Coming Soon',
    image: '/generated/ferrari-studio.png',
    route: '/coming-soon-details',
    detail: 'Upcoming allocation preview with interest registration.',
    value: 'GBP 315,000',
    progress: 'Preview'
  }
]

const processAction = (target?: string) => {
  if (!target) return
  notice.value = {
    title: 'Action Recorded',
    message: `Continuing to ${target}.`,
    tone: 'success'
  }
  window.setTimeout(() => {
    void navigateTo(target)
  }, 500)
}

const statusToneClass = computed(() => {
  if (page.value.tone === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-600'
  if (page.value.tone === 'warning') return 'border-amber-200 bg-amber-50 text-amber-600'
  if (page.value.tone === 'error') return 'border-red-200 bg-red-50 text-red-600'
  return 'border-tccBorder bg-tccLightBg text-tccNavy'
})

const detailImage = computed(() => {
  if (slug.value === 'funded-details') return '/frontend/assets/images/porsche.png'
  if (slug.value === 'asset-details') return '/frontend/assets/images/ferrari_berlinetta.png'
  if (slug.value === 'coming-soon-details') return '/generated/ferrari-studio.png'
  return '/frontend/assets/images/AstonMartin.jpg'
})
</script>

<template>
  <div v-if="page.type === 'auth'" class="flex min-h-screen flex-col justify-between bg-stone-50">
    <div class="grid flex-grow grid-cols-1 lg:grid-cols-12">
      <CitizenAuthHeroPanel description="Recover or verify your secure The Car Crowd investor account before returning to the showroom." />

      <section class="flex items-center justify-center bg-white p-8 sm:p-16 lg:col-span-7">
        <div class="w-full max-w-md space-y-8">
          <div class="space-y-2 text-center lg:text-left">
            <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ page.eyebrow }}</span>
            <h1 class="font-poppins text-3xl font-semibold text-tccNavy">{{ page.title }}</h1>
            <p class="text-xs text-tccMutedGray">{{ page.description }}</p>
          </div>

          <CitizenSharedActionNotice
            v-if="notice"
            :title="notice.title"
            :message="notice.message"
            :tone="notice.tone"
          />

          <form class="space-y-5" @submit.prevent="processAction(page.primary?.to)">
            <div v-if="slug !== 'otp-verification'" class="space-y-1">
              <label for="account-email" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Email Address</label>
              <input id="account-email" type="email" placeholder="john.doe@example.com" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
            </div>

            <div v-if="slug === 'reset-password'" class="space-y-4">
              <div class="space-y-1">
                <label for="new-password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">New Password</label>
                <input id="new-password" type="password" placeholder="New password" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
              </div>
              <div class="space-y-1">
                <label for="confirm-password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Confirm Password</label>
                <input id="confirm-password" type="password" placeholder="Confirm password" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
              </div>
            </div>

            <div v-if="slug === 'otp-verification'" class="flex justify-center gap-3">
              <input v-for="index in 4" :key="index" maxlength="1" inputmode="numeric" class="h-16 w-12 rounded-xl border border-tccBorder text-center font-poppins text-2xl font-semibold focus:outline-none focus:ring-1 focus:ring-tccNavy sm:w-14">
            </div>

            <button type="submit" class="w-full rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy">
              {{ page.primary?.label }}
            </button>
            <a v-if="page.secondary" :href="page.secondary.to" class="block text-center text-xs font-bold uppercase text-tccGold transition-colors hover:text-tccNavy">
              {{ page.secondary.label }}
            </a>
          </form>
        </div>
      </section>
    </div>
    <CitizenAuthStatsBar />
  </div>

  <div v-else class="flex min-h-screen flex-col bg-[#fcfbf9] text-gray-900">
    <AppHeaderCitizen />

    <main class="flex-grow">
      <section v-if="page.type === 'showroom'" class="bg-tccDarkNavy text-white">
        <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div class="space-y-6">
            <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ page.eyebrow }}</span>
            <h1 class="max-w-3xl font-poppins text-4xl font-semibold leading-tight sm:text-5xl">{{ page.title }}</h1>
            <p class="max-w-2xl text-sm font-light leading-relaxed text-white/75">{{ page.description }}</p>
            <div class="flex flex-wrap gap-3">
              <a href="#live-grid" class="rounded bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy">View Live Assets</a>
              <a href="/funded-assets" class="rounded border border-white/20 px-5 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white">Funded Archive</a>
            </div>
          </div>
          <img src="/generated/hero-aston-studio.png" alt="Classic car showroom" class="h-full min-h-[320px] w-full rounded-lg object-cover">
        </div>
      </section>

      <section
        v-if="page.type === 'showroom' || page.type === 'asset-list'"
        id="live-grid"
        class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div v-if="page.type === 'asset-list'" class="mb-8 space-y-2">
          <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ page.eyebrow }}</span>
          <h1 class="font-poppins text-3xl font-semibold text-tccNavy">{{ page.title }}</h1>
          <p class="max-w-2xl text-sm text-tccMutedGray">{{ page.description }}</p>
        </div>

        <div class="mb-8 flex flex-wrap gap-3">
          <a href="/showroom" class="rounded border border-tccBorder bg-white px-4 py-2 font-poppins text-xs font-semibold uppercase text-tccNavy">Showroom</a>
          <a href="/live-syndicate" class="rounded border border-tccBorder bg-white px-4 py-2 font-poppins text-xs font-semibold uppercase text-tccNavy">Live</a>
          <a href="/funded-assets" class="rounded border border-tccBorder bg-white px-4 py-2 font-poppins text-xs font-semibold uppercase text-tccNavy">Funded</a>
          <a href="/coming-soon-assets" class="rounded border border-tccBorder bg-white px-4 py-2 font-poppins text-xs font-semibold uppercase text-tccNavy">Coming Soon</a>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="asset in assetCards" :key="asset.title" class="overflow-hidden rounded-lg border border-tccBorder bg-white shadow-sm">
            <img :src="asset.image" :alt="asset.title" class="h-52 w-full object-cover">
            <div class="space-y-4 p-5">
              <div class="flex items-center justify-between gap-3">
                <span class="rounded bg-tccLightBg px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-tccGold">{{ asset.tag }}</span>
                <span class="text-xs font-semibold text-tccNavy">{{ asset.value }}</span>
              </div>
              <div>
                <h2 class="font-poppins text-lg font-semibold text-tccNavy">{{ asset.title }}</h2>
                <p class="mt-2 text-xs font-light leading-relaxed text-gray-600">{{ asset.detail }}</p>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div class="h-full rounded-full bg-tccGold" :style="{ width: asset.progress === 'Preview' ? '35%' : asset.progress }" />
              </div>
              <a :href="asset.route" class="block rounded bg-tccDarkNavy px-4 py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-tccNavy">
                View Details
              </a>
            </div>
          </article>
        </div>
      </section>

      <section v-else-if="page.type === 'asset-detail'" class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="overflow-hidden rounded-xl border border-tccBorder bg-white">
          <div class="relative h-[360px] bg-tccDeepBlack">
            <img :src="detailImage" :alt="page.title" class="h-full w-full object-cover opacity-70">
            <div class="absolute inset-0 bg-gradient-to-t from-tccDeepBlack via-transparent to-transparent" />
            <div class="absolute bottom-0 left-0 p-6 text-white sm:p-10">
              <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ page.eyebrow }}</span>
              <h1 class="mt-2 font-poppins text-4xl font-semibold">{{ page.title }}</h1>
              <p class="mt-3 max-w-2xl text-sm font-light text-white/75">{{ page.description }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[1fr_360px] lg:p-10">
            <div class="space-y-8">
              <section class="space-y-3">
                <h2 class="font-poppins text-2xl font-semibold text-tccNavy">Investment Analysis</h2>
                <p class="text-sm font-light leading-relaxed text-gray-600">
                  This page maps the supplied HTML detail template into the Nuxt prototype. It keeps the asset thesis, media gallery, metrics, risk notes, and next-step allocation actions connected to the wider portal flow.
                </p>
              </section>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div class="rounded-lg border border-tccBorder bg-stone-50 p-4">
                  <p class="text-[10px] uppercase tracking-wider text-tccMutedGray">Target Raise</p>
                  <p class="mt-1 font-poppins text-xl font-semibold text-tccNavy">GBP 250,000</p>
                </div>
                <div class="rounded-lg border border-tccBorder bg-stone-50 p-4">
                  <p class="text-[10px] uppercase tracking-wider text-tccMutedGray">Slots</p>
                  <p class="mt-1 font-poppins text-xl font-semibold text-tccNavy">100</p>
                </div>
                <div class="rounded-lg border border-tccBorder bg-stone-50 p-4">
                  <p class="text-[10px] uppercase tracking-wider text-tccMutedGray">Entry</p>
                  <p class="mt-1 font-poppins text-xl font-semibold text-tccNavy">GBP 2,500</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <img src="/frontend/assets/images/aston_martin_vanquish.png" alt="Gallery asset" class="h-40 w-full rounded-lg object-cover">
                <img src="/frontend/assets/images/ferrari_berlinetta.png" alt="Gallery asset" class="h-40 w-full rounded-lg object-cover">
                <img src="/frontend/assets/images/porsche.png" alt="Gallery asset" class="h-40 w-full rounded-lg object-cover">
                <img src="/generated/restoration-workshop.png" alt="Workshop" class="h-40 w-full rounded-lg object-cover">
              </div>
            </div>

            <aside class="h-fit space-y-5 rounded-xl border border-tccBorder bg-tccLightBg p-5">
              <h2 class="font-poppins text-xl font-semibold text-tccNavy">Syndicate Raise</h2>
              <div class="space-y-2 text-xs text-gray-600">
                <div class="flex justify-between"><span>Reserved</span><strong class="text-tccNavy">68%</strong></div>
                <div class="h-2 overflow-hidden rounded-full bg-white"><div class="h-full w-[68%] rounded-full bg-tccGold" /></div>
                <div class="flex justify-between"><span>Remaining Slots</span><strong class="text-tccNavy">32</strong></div>
                <div class="flex justify-between"><span>Minimum Allocation</span><strong class="text-tccNavy">GBP 2,500</strong></div>
              </div>
              <button v-if="page.primary" type="button" class="w-full rounded bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy" @click="processAction(page.primary.to)">
                {{ page.primary.label }}
              </button>
              <a v-if="page.secondary" :href="page.secondary.to" class="block rounded border border-tccBorder bg-white px-5 py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy">
                {{ page.secondary.label }}
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section v-else class="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full rounded-xl border border-tccBorder bg-white p-6 shadow-sm sm:p-10">
          <div class="mx-auto max-w-2xl space-y-3 text-center">
            <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ page.eyebrow }}</span>
            <h1 class="font-poppins text-3xl font-semibold text-tccNavy">{{ page.title }}</h1>
            <p class="text-sm font-light leading-relaxed text-tccMutedGray">{{ page.description }}</p>
          </div>

          <CitizenSharedActionNotice
            v-if="notice"
            class="mx-auto mt-6 max-w-2xl"
            :title="notice.title"
            :message="notice.message"
            :tone="notice.tone"
          />

          <div v-if="page.type === 'status'" class="mx-auto mt-8 max-w-2xl text-center">
            <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border text-3xl" :class="statusToneClass">
              <i class="pi" :class="page.icon || 'pi-check'" aria-hidden="true" />
            </div>
            <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a v-if="page.primary" :href="page.primary.to" class="rounded bg-tccDarkNavy px-6 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white">{{ page.primary.label }}</a>
              <a v-if="page.secondary" :href="page.secondary.to" class="rounded border border-tccBorder px-6 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy">{{ page.secondary.label }}</a>
            </div>
          </div>

          <form v-else-if="page.type === 'form' || page.type === 'contact'" class="mx-auto mt-8 max-w-2xl space-y-5" @submit.prevent="processAction(page.primary?.to)">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">First Name</label>
                <input class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm">
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Last Name</label>
                <input class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm">
              </div>
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Email Address</label>
              <input type="email" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm">
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">{{ page.type === 'contact' ? 'Message' : 'Investor Notes' }}</label>
              <textarea rows="5" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm" />
            </div>
            <button type="submit" class="w-full rounded-lg bg-tccGold px-6 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy">
              {{ page.primary?.label || 'Continue' }}
            </button>
          </form>

          <div v-else-if="page.type === 'checkout'" class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div class="space-y-5 rounded-lg border border-tccBorder bg-stone-50 p-5">
              <div class="flex flex-col gap-4 sm:flex-row">
                <img src="/frontend/assets/images/ferrari_berlinetta.png" alt="Selected allocation" class="h-32 w-full rounded-lg object-cover sm:w-44">
                <div>
                  <h2 class="font-poppins text-lg font-semibold text-tccNavy">Ferrari 365 GTB/4 Daytona</h2>
                  <p class="mt-2 text-xs font-light leading-relaxed text-gray-600">One reserved syndicate slot with trust beneficiary rights and member voting access.</p>
                </div>
              </div>

              <div v-if="slug === 'payment' || slug === 'payment-details'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" class="rounded-lg border p-4 text-left" :class="selectedPayment === 'bank' ? 'border-tccNavy bg-white' : 'border-tccBorder'" @click="selectedPayment = 'bank'">
                  <span class="font-poppins text-sm font-semibold text-tccNavy">Bank Transfer</span>
                  <p class="mt-1 text-xs text-gray-500">Escrow reference settlement.</p>
                </button>
                <button type="button" class="rounded-lg border p-4 text-left" :class="selectedPayment === 'crypto' ? 'border-tccNavy bg-white' : 'border-tccBorder'" @click="selectedPayment = 'crypto'">
                  <span class="font-poppins text-sm font-semibold text-tccNavy">Crypto Transfer</span>
                  <p class="mt-1 text-xs text-gray-500">USDT escrow wallet details.</p>
                </button>
              </div>

              <div class="rounded-lg border border-tccBorder bg-white p-4 text-xs leading-relaxed text-gray-600">
                <strong class="text-tccNavy">Reference:</strong> TCC-DAYTONA-09<br>
                <strong class="text-tccNavy">Escrow Account:</strong> TheCarCrowd Client Trust<br>
                <strong class="text-tccNavy">Amount Due:</strong> GBP 8,500.00
              </div>
            </div>

            <aside class="h-fit space-y-4 rounded-lg border border-tccBorder bg-white p-5">
              <h2 class="font-poppins text-lg font-semibold text-tccNavy">Reservation Summary</h2>
              <div class="space-y-2 text-xs text-gray-600">
                <div class="flex justify-between"><span>Allocation</span><strong>GBP 8,500.00</strong></div>
                <div class="flex justify-between"><span>Fees</span><strong>Included</strong></div>
                <div class="flex justify-between border-t border-tccBorder pt-2 text-tccNavy"><span>Total</span><strong>GBP 8,500.00</strong></div>
              </div>
              <button v-if="page.primary" type="button" class="w-full rounded bg-tccDarkNavy px-5 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white" @click="processAction(page.primary.to)">
                {{ page.primary.label }}
              </button>
              <a v-if="page.secondary" :href="page.secondary.to" class="block rounded border border-tccBorder px-5 py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy">
                {{ page.secondary.label }}
              </a>
            </aside>
          </div>

          <div v-else-if="page.type === 'vote'" class="mx-auto mt-8 max-w-2xl space-y-5">
            <label v-for="option in ['Approve proposed acquisition terms', 'Request further information', 'Abstain from this vote']" :key="option" class="flex cursor-pointer items-start gap-3 rounded-lg border p-4" :class="selectedVote === option ? 'border-tccNavy bg-tccLightBg' : 'border-tccBorder'">
              <input v-model="selectedVote" type="radio" :value="option" class="mt-1 accent-tccNavy">
              <span class="text-sm text-gray-700">{{ option }}</span>
            </label>
            <button type="button" class="w-full rounded bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy" @click="processAction(page.primary?.to)">
              {{ page.primary?.label }}
            </button>
          </div>

          <div v-else class="mx-auto mt-8 max-w-3xl space-y-5">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div v-for="item in ['Subscription Deed', 'Trust Summary', 'Risk Disclosure']" :key="item" class="rounded-lg border border-tccBorder bg-stone-50 p-4">
                <i class="pi pi-file-pdf text-xl text-tccGold" aria-hidden="true" />
                <h2 class="mt-3 font-poppins text-sm font-semibold text-tccNavy">{{ item }}</h2>
                <p class="mt-2 text-xs font-light leading-relaxed text-gray-600">Mapped from the supplied document flow and connected to the next portal step.</p>
              </div>
            </div>
            <div class="flex flex-col justify-center gap-3 sm:flex-row">
              <button v-if="page.primary" type="button" class="rounded bg-tccDarkNavy px-6 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white" @click="processAction(page.primary.to)">
                {{ page.primary.label }}
              </button>
              <a v-if="page.secondary" :href="page.secondary.to" class="rounded border border-tccBorder px-6 py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy">
                {{ page.secondary.label }}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooterPortal />
  </div>
</template>
