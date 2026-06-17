<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Suitability Questionnaire | The Car Crowd'
})

type Stage = 'facts' | 'quiz' | 'success'
type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const stage = ref<Stage>('facts')
const currentStep = ref(1)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const answers = reactive<Record<string, string>>({})

const keyFacts = [
  {
    title: 'What is a Syndicated Trust Structure?',
    body: 'A syndicated trust refers to a financial arrangement where assets are held by a trustee on behalf of beneficiaries. The beneficiaries retain beneficial ownership, and the trustee acts as legal title custodian.'
  },
  {
    title: 'Are Syndicates Regulated?',
    body: 'Fractional ownership stakes inside private car syndicates are not a regulated activity in the UK. Values fluctuate and your capital is at risk.'
  },
  {
    title: 'What are the Management Fees?',
    body: 'Members pay a curation fee included within the syndicate total. An annual operations fee is paid after Year 1 to cover secure climate-controlled storage, insurance policies, and annual SPV company audits.'
  },
  {
    title: 'How does the Exit Process Work?',
    body: 'Exits are realized when the asset is sold. All syndicate members vote annually on whether to hold or realize. A 50.1% majority is required to execute a sale.'
  }
]

const questions = [
  {
    id: 'q1',
    prompt: 'What does it mean to have a syndicate slot which is the single beneficiary of a Trust?',
    correct: 'a',
    options: [
      { value: 'a', label: 'You hold ownership of a share in a syndicate enabling you and other members to decide on the day-to-day control of the asset held in the Trust.' },
      { value: 'b', label: "You are part of a syndicate but don't have any say in what happens to the Trust." },
      { value: 'c', label: 'It is like a traditional debt loan where you will receive fixed interest payments.' }
    ]
  },
  {
    id: 'q2',
    prompt: 'What can happen to the value of the vehicle asset held by the Trust?',
    correct: 'b',
    options: [
      { value: 'a', label: 'The value of classic automotive assets is guaranteed to rise in all conditions.' },
      { value: 'b', label: 'The value of the assets can go down as well as up, exposing capital to risk.' },
      { value: 'c', label: 'The valuation stays static for the entire duration of the syndicate.' }
    ]
  },
  {
    id: 'q3',
    prompt: 'What involvement does TheCarCrowd Limited have with the Syndicate?',
    correct: 'c',
    options: [
      { value: 'a', label: 'TheCarCrowd Limited acts as a commercial lender with discretion over asset purchases.' },
      { value: 'b', label: 'TheCarCrowd Limited manages marketing but has no role in trust operations.' },
      { value: 'c', label: 'TheCarCrowd Limited operates as the Trustee, executing operational decisions as voted by syndicate members. TCC may also own fractional slots.' }
    ]
  },
  {
    id: 'q4',
    prompt: 'What independent oversight does Legal Alternative provide?',
    correct: 'b',
    options: [
      { value: 'a', label: 'Legal Alternative regulates all crowdfunding sites within UK jurisdictions.' },
      { value: 'b', label: 'Legal Alternative is a second signatory for transactions, ensuring operations are performed in the interests of syndicate beneficiaries.' },
      { value: 'c', label: 'Legal Alternative holds custody of vehicle titles in a physical safety vault.' }
    ]
  }
]

const activeQuestion = computed(() => questions[currentStep.value - 1])
const progress = computed(() => `${(currentStep.value / questions.length) * 100}%`)

const startQuiz = () => {
  notice.value = null
  stage.value = 'quiz'
  currentStep.value = 1
}

const previousQuestion = () => {
  if (currentStep.value > 1) {
    currentStep.value -= 1
    notice.value = null
  }
}

const nextQuestion = () => {
  if (!answers[activeQuestion.value.id]) {
    notice.value = {
      title: 'Answer Required',
      message: 'Please select an option to proceed.',
      tone: 'warning'
    }
    return
  }

  notice.value = null

  if (currentStep.value < questions.length) {
    currentStep.value += 1
    return
  }

  const passed = questions.every(question => answers[question.id] === question.correct)

  if (passed) {
    stage.value = 'success'
    return
  }

  Object.keys(answers).forEach((key) => {
    delete answers[key]
  })
  currentStep.value = 1
  stage.value = 'facts'
  notice.value = {
    title: 'Incorrect Answers',
    message: 'Some answers did not match the regulatory suitability facts. Please review the key facts and try again.',
    tone: 'error'
  }
}
</script>

<template>
  <section class="flex min-h-[calc(100vh-64px)] items-center justify-center bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-3xl">
      <div v-if="stage === 'facts'" class="space-y-8 rounded-xl border border-tccBorder bg-white p-6 shadow-sm sm:p-10">
        <div class="space-y-2 text-center">
          <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Onboarding Step 2</span>
          <h1 class="font-poppins text-3xl font-semibold text-tccNavy">Key Facts &amp; Disclosures</h1>
          <p class="mx-auto max-w-md text-xs text-tccMutedGray">
            Please review these essential disclosures before proceeding to our suitability questionnaire.
          </p>
        </div>

        <CitizenSharedActionNotice
          v-if="notice"
          :title="notice.title"
          :message="notice.message"
          :tone="notice.tone"
        />

        <div class="space-y-6">
          <article
            v-for="(fact, index) in keyFacts"
            :key="fact.title"
            class="space-y-2 rounded-xl border border-tccBorder bg-stone-50 p-5"
          >
            <h2 class="flex items-center gap-2 font-poppins text-sm font-bold text-tccNavy">
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tccNavy text-[10px] text-white">{{ index + 1 }}</span>
              {{ fact.title }}
            </h2>
            <p class="pl-7 text-xs font-light leading-relaxed text-gray-600">{{ fact.body }}</p>
          </article>
        </div>

        <div class="border-t border-tccBorder pt-6 text-center">
          <button
            type="button"
            class="rounded-md bg-tccDarkNavy px-8 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-tccNavy"
            @click="startQuiz"
          >
            Continue to Suitability Questionnaire &rarr;
          </button>
        </div>
      </div>

      <div v-else-if="stage === 'quiz'" class="space-y-8 rounded-xl border border-tccBorder bg-white p-6 shadow-sm sm:p-10">
        <div class="flex flex-col gap-3 border-b border-tccBorder pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="font-poppins text-lg font-semibold text-tccNavy">Suitability Questionnaire</h1>
            <p class="text-xs text-tccMutedGray">Answer all questions to confirm investment suitability</p>
          </div>
          <span class="font-poppins text-xs font-bold text-tccGold">Step {{ currentStep }} of {{ questions.length }}</span>
        </div>

        <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div class="h-1.5 rounded-full bg-tccGold transition-all duration-300" :style="{ width: progress }" />
        </div>

        <CitizenSharedActionNotice
          v-if="notice"
          :title="notice.title"
          :message="notice.message"
          :tone="notice.tone"
        />

        <div class="space-y-4">
          <h2 class="font-poppins text-base font-semibold text-tccNavy">
            {{ currentStep }}. {{ activeQuestion.prompt }}
          </h2>
          <div class="space-y-3">
            <label
              v-for="option in activeQuestion.options"
              :key="option.value"
              class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all hover:border-tccNavy hover:bg-stone-50"
              :class="answers[activeQuestion.id] === option.value ? 'border-tccNavy bg-tccLightBg' : 'border-tccBorder'"
            >
              <input
                v-model="answers[activeQuestion.id]"
                type="radio"
                :name="activeQuestion.id"
                :value="option.value"
                class="mt-1 accent-tccNavy"
              >
              <span class="text-xs font-light text-gray-700">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-tccBorder pt-6">
          <button
            type="button"
            class="text-xs font-semibold text-tccNavy transition-colors hover:text-tccGold disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentStep === 1"
            @click="previousQuestion"
          >
            &larr; Back
          </button>
          <button
            type="button"
            class="rounded bg-tccGold px-6 py-2.5 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow transition-colors hover:bg-tccLightGold"
            @click="nextQuestion"
          >
            {{ currentStep === questions.length ? 'Submit Quiz' : 'Continue' }} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      <div v-else class="space-y-8 rounded-xl border border-tccBorder bg-white p-6 text-center shadow-sm sm:p-10">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
          <i class="pi pi-check text-2xl" aria-hidden="true" />
        </div>

        <div class="space-y-2">
          <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Verification Complete</span>
          <h1 class="font-poppins text-2xl font-semibold text-tccNavy">Suitability Verified Successfully</h1>
          <p class="mx-auto max-w-sm text-xs text-tccMutedGray">
            Thank you for completing the suitability steps. Your classification and quiz records are securely logged.
          </p>
        </div>

        <div class="mx-auto max-w-md space-y-2 rounded-lg border border-tccBorder bg-tccLightBg p-5 text-left">
          <h2 class="font-poppins text-xs font-bold uppercase text-tccNavy">Next Step: KYC Profile</h2>
          <p class="text-[11px] font-light leading-relaxed text-gray-600">
            We must now perform identity and AML checks before accepting any investment capital. Please proceed to upload your KYC documentation.
          </p>
        </div>

        <div class="border-t border-tccBorder pt-6">
          <a
            href="/kyc"
            class="inline-block rounded-md bg-tccDarkNavy px-8 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-tccNavy"
          >
            Continue to KYC verification &rarr;
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
