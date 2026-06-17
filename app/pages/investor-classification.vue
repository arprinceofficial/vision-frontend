<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Investor Self-Certification | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const selectedClassification = ref('')
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const cards = [
  {
    id: 'high_net_worth',
    letter: 'A',
    title: 'High Net Worth Investor',
    intro: 'You qualify under this category if at least one of the following statements applies:',
    points: [
      'You earn an annual personal income of GBP 100,000 or more.',
      'You hold net financial assets of GBP 250,000 or more, excluding your primary residence, pensions, or insurance policies.'
    ]
  },
  {
    id: 'sophisticated',
    letter: 'B',
    title: 'Self Certified Sophisticated Investor',
    intro: 'You qualify under this category if at least one of the following statements applies:',
    points: [
      'Worked in private equity or provision of financial services for SMEs.',
      'Served as director of a company with GBP 1M+ annual turnover.',
      'Made two or more investments in unlisted companies within the last 24 months.',
      'Been a member of a business angel network for 6+ months.'
    ],
    grid: true
  },
  {
    id: 'ordinary',
    letter: 'C',
    title: 'Ordinary Retail Investor',
    intro: 'Select this if the above declarations do not apply to you, or you are unsure. Our support team will contact you to discuss your options.',
    points: []
  }
]

const selectClassification = (id: string) => {
  selectedClassification.value = id

  if (id === 'ordinary') {
    notice.value = {
      title: 'Restricted Access',
      message: 'Fractional classic automobile syndicates are restricted to verified Sophisticated or High Net Worth investors. Our support desk will contact you shortly.',
      tone: 'warning'
    }
    window.setTimeout(() => {
      selectedClassification.value = ''
    }, 900)
    return
  }

  notice.value = {
    title: 'Certification Selected',
    message: 'Your classification has been recorded. Redirecting to the suitability questionnaire.',
    tone: 'success'
  }
  window.setTimeout(() => {
    void navigateTo('/questionnaire')
  }, 650)
}
</script>

<template>
  <CitizenOnboardingStepCard
    eyebrow="Onboarding Step 1"
    title="Investor Self-Certification"
    description="To access fractional classic car syndicates, we must confirm your financial experience level."
  >
    <div class="flex items-center gap-4 rounded-r-md border-l-4 border-tccNavy bg-tccLightBg p-4">
      <i class="pi pi-list-check shrink-0 text-lg text-tccNavy" aria-hidden="true" />
      <p class="text-xs font-medium leading-relaxed text-tccNavy">
        Please select the statement below that best corresponds to your circumstances. Click a card to confirm your certification.
      </p>
    </div>

    <CitizenSharedActionNotice
      v-if="notice"
      :title="notice.title"
      :message="notice.message"
      :tone="notice.tone"
    />

    <div class="space-y-6">
      <button
        v-for="card in cards"
        :key="card.id"
        type="button"
        class="group w-full cursor-pointer rounded-xl border p-5 text-left transition-all duration-300 hover:border-tccNavy hover:shadow-md"
        :class="selectedClassification === card.id ? 'border-tccNavy shadow-md' : 'border-tccBorder'"
        @click="selectClassification(card.id)"
      >
        <div class="flex items-start gap-4">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-tccNavy font-poppins text-sm font-bold text-white transition-colors group-hover:bg-tccGold group-hover:text-tccDarkNavy">
            {{ card.letter }}
          </div>
          <div class="min-w-0 flex-grow space-y-2">
            <h3 class="font-poppins text-base font-semibold text-tccNavy transition-colors group-hover:text-tccGold">
              {{ card.title }}
            </h3>
            <p class="text-xs font-light leading-relaxed text-gray-600">
              {{ card.intro }}
            </p>
            <div v-if="card.points.length" class="mt-2 gap-3" :class="card.grid ? 'grid grid-cols-1 sm:grid-cols-2' : 'space-y-2'">
              <div
                v-for="(point, index) in card.points"
                :key="point"
                class="flex items-start gap-2 text-xs font-light text-gray-500"
              >
                <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[10px] font-semibold text-tccNavy">{{ index + 1 }}</span>
                <span>{{ point }}</span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>

    <div class="border-t border-tccBorder pt-6 text-center">
      <a href="mailto:support@thecarcrowd.co.uk" class="text-xs font-semibold text-tccNavy underline decoration-tccGold transition-colors hover:text-tccGold">
        Need assistance? Contact our investor support desk.
      </a>
    </div>
  </CitizenOnboardingStepCard>
</template>
