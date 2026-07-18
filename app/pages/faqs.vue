<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Frequently Asked Questions - The Car Crowd',
  meta: [
    {
      name: 'description',
      content: 'Frequently asked questions about The Car Crowd syndicates and retail cars for sale.'
    }
  ]
})

type FaqTab = 'syndicate' | 'retail'

type FaqItem = {
  question: string
  answer: string[]
}

const activeTab = ref<FaqTab>('syndicate')
const openIndex = ref(0)

const syndicateFaqs: FaqItem[] = [
  {
    question: 'What is a Bear Trust Syndicate?',
    answer: [
      'A bear trust syndicate refers to a financial arrangement where assets, typically shares or property, are held by a trustee on behalf of a beneficiary without the trustee having any discretionary powers. The beneficiary is the true owner, and the trustee merely holds the asset in their name until it can be transferred to the beneficiary.',
      'In the context of a syndicate, multiple people or parties may come together to pool their resources to buy or hold an asset under a bear trust structure. The trust ensures that the syndicate members (or beneficiaries) retain ownership, while the trustee is responsible for managing the asset until it’s transferred to the rightful owners.',
      'This structure is commonly used in arrangements to streamline the holding of assets for a group.'
    ]
  },
  {
    question: 'Who owns the asset?',
    answer: [
      'The syndicate members are the beneficial owners of the asset. The trustee or manager holds and administers the asset on behalf of the group in line with the syndicate terms.'
    ]
  },
  {
    question: 'What are the eligibility requirements?',
    answer: [
      'Members must complete the required investor classification, onboarding checks, and any compliance steps before they can participate in a syndicate.'
    ]
  },
  {
    question: 'Can I exit a syndicate before the asset is sold?',
    answer: [
      'Exit options depend on the syndicate terms and available demand from other qualified buyers. The Car Crowd can help explain the available process when an exit request is made.'
    ]
  },
  {
    question: 'How does the selling process work/how can I exit?',
    answer: [
      'The selling process is normally managed through a structured decision, valuation, member communication, and sale process so the asset can move to the next custodian in an orderly way.'
    ]
  },
  {
    question: 'Personal tax and legal info',
    answer: [
      'Members should take their own independent tax, legal, and financial advice before joining or exiting any syndicate.'
    ]
  },
  {
    question: 'What are the fees?',
    answer: [
      'Fees are set out before participation and may include management, custody, transaction, storage, insurance, or sale-related costs depending on the syndicate.'
    ]
  },
  {
    question: 'What happens once the asset is sold?',
    answer: [
      'Once an asset is sold, the sale proceeds are reconciled against costs and then distributed to members in line with the syndicate terms.'
    ]
  },
  {
    question: 'What if the asset never sells?',
    answer: [
      'If an asset does not sell, the syndicate can review pricing, timing, storage, and future options with members before deciding the next step.'
    ]
  },
  {
    question: 'What if all the syndicate fails to sell all of its memberships, will I get my money back?',
    answer: [
      'If a syndicate does not complete as planned, the outcome depends on the terms of that specific offer and the stage reached in the process.'
    ]
  }
]

const retailFaqs: FaqItem[] = [
  {
    question: 'Why are these cars for sale if they were previously funded as investments?',
    answer: [
      'These cars have been held by a group of investors or syndicate members who collectively decided to sell the asset. Once a majority vote is passed at the most recent valuation, the asset is offered for sale to the public. This ensures that investors realise the value of their investment and the vehicles move on to their next custodian.'
    ]
  },
  {
    question: 'Are all of the cars for sale previous investment vehicles?',
    answer: [
      'Some cars may come from previous investment structures, while others may be sourced privately through The Car Crowd network.'
    ]
  },
  {
    question: 'Do the cars come with a warranty?',
    answer: [
      'Warranty availability depends on the individual car, age, condition, and sale terms. Any warranty information will be made clear before purchase.'
    ]
  },
  {
    question: 'Can I test drive the cars?',
    answer: [
      'Test drives may be available by appointment for serious buyers, subject to insurance, identity checks, and the vehicle owner’s approval.'
    ]
  },
  {
    question: 'How have the cars been stored and maintained?',
    answer: [
      'Cars are presented with available history, storage, and maintenance records so buyers can understand how each vehicle has been looked after.'
    ]
  },
  {
    question: 'Are these cars road-ready?',
    answer: [
      'Road-readiness depends on each car. The listing, inspection notes, and sale file will explain the current condition and any known preparation requirements.'
    ]
  },
  {
    question: 'Can I have the vehicle inspected by a third party?',
    answer: [
      'Yes, third-party inspections can usually be arranged for serious buyers before completion.'
    ]
  },
  {
    question: 'Do you offer finance?',
    answer: [
      'Finance options may be available through specialist partners depending on the car, buyer profile, and jurisdiction.'
    ]
  },
  {
    question: 'Do you offer delivery?',
    answer: [
      'Delivery and transport can be arranged with specialist partners after purchase.'
    ]
  },
  {
    question: 'Are these cars suitable for daily use?',
    answer: [
      'Suitability for daily use depends on the vehicle, age, maintenance condition, and intended usage. The team can advise on each car individually.'
    ]
  },
  {
    question: 'Can you help source a specific car if it’s not listed?',
    answer: [
      'Yes, The Car Crowd can help source specific collector cars through its private network.'
    ]
  }
]

const tabs: Array<{ label: string, value: FaqTab, faqs: FaqItem[] }> = [
  { label: 'Syndicate FAQ', value: 'syndicate', faqs: syndicateFaqs },
  { label: 'Retail FAQ', value: 'retail', faqs: retailFaqs }
]

const activeFaqs = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.faqs || syndicateFaqs)

const selectTab = (tab: FaqTab) => {
  activeTab.value = tab
  openIndex.value = 0
}

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <div class="bg-tccDeepBlack text-white">
    <section class="relative min-h-[560px] overflow-hidden border-b border-white/10 bg-tccDeepBlack text-white">
      <div class="absolute inset-0">
        <img
          src="/generated/faqs/question-cars.png"
          alt="The Car Crowd cars"
          class="h-full w-full object-cover opacity-60"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-tccDeepBlack/45 via-tccDeepBlack/65 to-tccDeepBlack" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,transparent_0%,rgba(3,3,3,0.42)_34%,rgba(3,3,3,0.98)_100%)]" />
      </div>

      <div class="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div class="max-w-5xl">
          <span class="restomod-eyebrow">FAQs</span>
          <h1 class="mt-6 font-poppins text-5xl font-black leading-[0.92] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Frequently Asked Questions
          </h1>
          <p class="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            Find clear answers about syndicate ownership, exits, retail vehicles, inspections, and sourcing.
          </p>
          <NuxtLink
            to="/contact"
            class="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
          >
            Book a call
            <i class="pi pi-arrow-up-right text-[10px]" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="border-b border-white/10 bg-[#080705] py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-10 flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4 sm:justify-start">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="rounded-full border px-5 py-3 font-poppins text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            :class="activeTab === tab.value ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/5 text-white/60 hover:border-tccGold/60 hover:text-tccGold'"
            @click="selectTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.56fr)_minmax(360px,0.44fr)] lg:items-start">
          <div class="space-y-4">
            <article
              v-for="(faq, index) in activeFaqs"
              :key="faq.question"
              class="overflow-hidden rounded-[1.25rem] border bg-white/5 transition-colors"
              :class="openIndex === index ? 'border-tccGold/45' : 'border-white/10 hover:border-white/20'"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                :aria-expanded="openIndex === index"
                @click="toggleFaq(index)"
              >
                <span class="text-base font-medium leading-relaxed text-white sm:text-lg">{{ faq.question }}</span>
                <span
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-tccGold"
                  aria-hidden="true"
                >
                  <i :class="openIndex === index ? 'pi pi-minus' : 'pi pi-plus'" class="text-xs" />
                </span>
              </button>

              <div v-show="openIndex === index" class="border-t border-white/10 px-5 py-5 sm:px-6">
                <div class="space-y-4 text-sm leading-relaxed text-white/70 sm:text-base">
                  <p v-for="paragraph in faq.answer" :key="paragraph">
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <aside class="lg:sticky lg:top-24">
            <div class="restomod-panel overflow-hidden rounded-[1.75rem]">
              <div class="p-6 text-center sm:p-8">
                <span class="restomod-eyebrow mx-auto">Any Question?</span>
                <h2 class="mt-5 font-poppins text-3xl font-black leading-tight text-white sm:text-4xl">
                  Any Question?
                </h2>
                <p class="mt-4 text-sm leading-relaxed text-white/60">
                  You can ask anything you want to know Feedback
                </p>
              </div>
              <div class="restomod-image-card overflow-hidden border-t border-white/10">
                <img
                  src="/generated/faqs/question-cars.png"
                  alt="Red collector cars"
                  class="h-[520px] w-full object-cover"
                >
              </div>
              <div class="p-6 sm:p-8">
                <NuxtLink
                  to="/contact"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-bold uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                >
                  Book a call
                  <i class="pi pi-arrow-up-right text-[10px]" aria-hidden="true" />
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
