<script setup lang="ts">
definePageMeta({
    layout: 'portal',
    middleware: ['auth-citizen']
})

useHead({
    title: 'Suitability Questionnaire | The Car Crowd'
})

type Stage = 'facts' | 'quiz' | 'success'
type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type QuizOption = {
    value: string
    label: string
}
type QuizQuestion = {
    id: string
    prompt: string
    options: QuizOption[]
}
type QuestionnaireSubmitResponse = {
    is_passed: boolean
    title: string
    message: string
    review_question_id?: string
}

const route = useRoute()
const stage = ref<Stage>(route.query.stage === 'quiz' ? 'quiz' : 'facts')
const currentStep = ref(1)
const isLoadingQuestions = ref(route.query.stage === 'quiz')
const isSubmittingQuestionnaire = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const answers = reactive<Record<string, string>>({})
const finalResult = ref<QuestionnaireSubmitResponse | null>(null)
const questions = ref<QuizQuestion[]>([])
const quizType = ref('')
const citizen_user = citizenUser()
const { onboardingQuizQuestions, submitOnboardingQuiz } = citizenAuth()

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

const activeQuestion = computed(() => {
    const index = Math.max(0, Math.min(currentStep.value - 1, questions.value.length - 1))
    return questions.value[index] ?? {
        id: '',
        prompt: '',
        options: []
    }
})
const totalQuestions = computed(() => questions.value.length)
const progress = computed(() => totalQuestions.value ? `${(currentStep.value / totalQuestions.value) * 100}%` : '0%')
const primaryActionLabel = computed(() => {
    if (isLoadingQuestions.value) return 'Loading...'
    if (isSubmittingQuestionnaire.value) return 'Submitting...'
    return currentStep.value === totalQuestions.value ? 'Submit Questionnaire' : 'Continue'
})

const getErrorMessage = (error: any, fallback: string) => (
    error?.response?._data?.message ||
    error?.data?.message ||
    fallback
)

const refreshCitizenUser = async () => {
    const refreshedUser = await fetchCitizenCurrentUser()
    if (refreshedUser) {
        citizen_user.value = refreshedUser
    }
}

const normalizeQuizQuestions = (response: any): QuizQuestion[] => {
    quizType.value = response?.data?.quiz_type || ''
    const apiQuestions = Array.isArray(response?.data?.questions) ? response.data.questions : []

    return apiQuestions.map((question: any, index: number) => ({
        id: String(question?.question_id || question?.id || `question${index + 1}`),
        prompt: question?.question_text || question?.title || '',
        options: Array.isArray(question?.options)
            ? question.options.map((option: any) => ({
                value: String(option?.key || option?.value || option?.id || ''),
                label: option?.text || option?.label || option?.title || '',
            })).filter((option: QuizOption) => option.value && option.label)
            : []
    }))
}

const loadQuizQuestions = async () => {
    isLoadingQuestions.value = true
    notice.value = null

    try {
        const response: any = await onboardingQuizQuestions()
        const normalizedQuestions = normalizeQuizQuestions(response)

        questions.value = normalizedQuestions
        currentStep.value = 1

        if (!normalizedQuestions.length) {
            notice.value = {
                title: 'No Questions Available',
                message: response?.message || 'No questionnaire questions were returned.',
                tone: 'warning'
            }
        }
    } catch (error: any) {
        questions.value = []
        notice.value = {
            title: 'Unable To Load Questions',
            message: getErrorMessage(error, 'Quiz questions could not be loaded.'),
            tone: 'error'
        }
    } finally {
        isLoadingQuestions.value = false
    }
}

const resetQuizState = () => {
    currentStep.value = 1
    notice.value = null
    Object.keys(answers).forEach((key) => {
        delete answers[key]
    })
    finalResult.value = null
}

const startQuiz = async () => {
    resetQuizState()
    stage.value = 'quiz'
    await loadQuizQuestions()
}

const previousQuestion = () => {
    if (currentStep.value > 1) {
        currentStep.value -= 1
        notice.value = null
    }
}

const selectAnswer = (questionId: string, answer: string) => {
    answers[questionId] = answer
    finalResult.value = null
    notice.value = null
}

const goToNextQuestion = () => {
    if (currentStep.value < totalQuestions.value) {
        currentStep.value += 1
        notice.value = null
        return
    }
}

const getOptionClasses = (optionValue: string) => {
    const questionId = activeQuestion.value.id
    const isSelected = answers[questionId] === optionValue

    if (!isSelected) return 'border-tccBorder'

    return 'border-tccNavy bg-tccLightBg'
}

const buildQuestionnairePayload = () => {
    const payload: Record<string, string> = {
        quiz_type: quizType.value
    }

    questions.value.forEach((question, index) => {
        payload[`question${index + 1}`] = answers[question.id] as string
    })

    return payload
}

const handlePrimaryAction = async () => {
    const question = activeQuestion.value

    if (!questions.value.length) {
        notice.value = {
            title: 'No Questions Available',
            message: 'Please try loading the questionnaire again.',
            tone: 'warning'
        }
        return
    }

    if (!question || !answers[question.id]) {
        notice.value = {
            title: 'Answer Required',
            message: 'Please select an option to proceed.',
            tone: 'warning'
        }
        return
    }

    if (currentStep.value < totalQuestions.value) {
        goToNextQuestion()
        return
    }

    const firstUnansweredIndex = questions.value.findIndex((quizQuestion) => !answers[quizQuestion.id])

    if (firstUnansweredIndex !== -1) {
        currentStep.value = firstUnansweredIndex + 1
        notice.value = {
            title: 'Answer Required',
            message: 'Please answer every question before submitting the questionnaire.',
            tone: 'warning'
        }
        return
    }

    isSubmittingQuestionnaire.value = true
    notice.value = null

    try {
        const payload = buildQuestionnairePayload()
        const response: any = await submitOnboardingQuiz(payload)
        const isSuccessfulResponse = response?.status === true || response?.success === true

        if (!isSuccessfulResponse) {
            notice.value = {
                title: response?.data?.title || 'Questionnaire Review Required',
                message: response?.message || 'Your submitted answers did not pass the suitability check.',
                tone: 'error'
            }
            return
        }

        finalResult.value = {
            is_passed: true,
            title: response?.data?.title || 'Suitability Verified Successfully',
            message: response?.message || 'Your answers have been submitted successfully.',
        }

        await refreshCitizenUser()
        stage.value = 'success'
        notice.value = null
    } catch (error: any) {
        notice.value = {
            title: 'Unable To Submit',
            message: getErrorMessage(error, 'Please try submitting the questionnaire again.'),
            tone: 'error'
        }
    } finally {
        isSubmittingQuestionnaire.value = false
    }
}

onMounted(() => {
    if (route.query.stage === 'quiz') {
        void startQuiz()
    }
})
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center bg-stone-50 px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-3xl">
            <div v-if="stage === 'facts'"
                class="space-y-8 rounded-xl border border-tccBorder bg-white p-6 shadow-sm sm:p-10">
                <div class="space-y-2 text-center">
                    <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Onboarding Step
                        2</span>
                    <h1 class="font-poppins text-3xl font-semibold text-tccNavy">Key Facts &amp; Disclosures</h1>
                    <p class="mx-auto max-w-md text-xs text-tccMutedGray">
                        Please review these essential disclosures before proceeding to our suitability questionnaire.
                    </p>
                </div>

                <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                    :tone="notice.tone" />

                <div class="space-y-6">
                    <article v-for="(fact, index) in keyFacts" :key="fact.title"
                        class="space-y-2 rounded-xl border border-tccBorder bg-stone-50 p-5">
                        <h2 class="flex items-center gap-2 font-poppins text-sm font-bold text-tccNavy">
                            <span
                                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tccNavy text-[10px] text-white">{{
                                index + 1 }}</span>
                            {{ fact.title }}
                        </h2>
                        <p class="pl-7 text-xs font-light leading-relaxed text-gray-600">{{ fact.body }}</p>
                    </article>
                </div>

                <div class="border-t border-tccBorder pt-6 text-center">
                    <button type="button"
                        class="rounded-md bg-tccDarkNavy px-8 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-tccNavy"
                        @click="startQuiz">
                        Continue to Suitability Questionnaire &rarr;
                    </button>
                </div>
            </div>

            <div v-else-if="stage === 'quiz'"
                class="space-y-8 rounded-xl border border-tccBorder bg-white p-6 shadow-sm sm:p-10">
                <div
                    class="flex flex-col gap-3 border-b border-tccBorder pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 class="font-poppins text-lg font-semibold text-tccNavy">Suitability Questionnaire</h1>
                        <p class="text-xs text-tccMutedGray">Answer all questions to confirm investment suitability</p>
                    </div>
                    <span class="font-poppins text-xs font-bold text-tccGold">Step {{ currentStep }} of {{
                        totalQuestions }}</span>
                </div>

                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div class="h-1.5 rounded-full bg-tccGold transition-all duration-300"
                        :style="{ width: progress }" />
                </div>

                <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                    :tone="notice.tone" />

                <div v-if="isLoadingQuestions" class="space-y-4" aria-busy="true">
                    <div class="h-5 w-4/5 animate-pulse rounded-full bg-gray-200" />
                    <div class="space-y-3">
                        <div v-for="index in 3" :key="index"
                            class="h-14 animate-pulse rounded-lg border border-tccBorder bg-stone-50" />
                    </div>
                </div>

                <div v-else-if="!questions.length"
                    class="rounded-lg border border-tccBorder bg-stone-50 p-5 text-center text-sm text-tccMutedGray">
                    No questionnaire questions are available right now.
                </div>

                <div v-else class="space-y-4">
                    <h2 class="font-poppins text-base font-semibold text-tccNavy">
                        {{ currentStep }}. {{ activeQuestion.prompt }}
                    </h2>
                    <div class="space-y-3">
                        <label v-for="option in activeQuestion.options" :key="option.value"
                            class="flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all hover:border-tccNavy hover:bg-stone-50"
                            :class="getOptionClasses(option.value)">
                            <input :checked="answers[activeQuestion.id] === option.value" type="radio"
                                :name="activeQuestion.id" :value="option.value" class="mt-1 accent-tccNavy"
                                :disabled="isSubmittingQuestionnaire"
                                @change="selectAnswer(activeQuestion.id, option.value)">
                            <span class="text-xs font-light text-gray-700">{{ option.label }}</span>
                        </label>
                    </div>
                </div>

                <div class="flex items-center justify-between border-t border-tccBorder pt-6">
                    <button type="button"
                        class="text-xs font-semibold text-tccNavy transition-colors hover:text-tccGold disabled:cursor-not-allowed disabled:opacity-40"
                        :disabled="currentStep === 1" @click="previousQuestion">
                        &larr; Back
                    </button>
                    <button type="button"
                        class="rounded bg-tccGold px-6 py-2.5 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow transition-colors hover:bg-tccLightGold"
                        :disabled="isLoadingQuestions || isSubmittingQuestionnaire" @click="handlePrimaryAction">
                        {{ primaryActionLabel }} <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </div>

            <div v-else class="space-y-8 rounded-xl border border-tccBorder bg-white p-6 text-center shadow-sm sm:p-10">
                <div
                    class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <i class="pi pi-check text-2xl" aria-hidden="true" />
                </div>

                <div class="space-y-2">
                    <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Verification
                        Complete</span>
                    <h1 class="font-poppins text-2xl font-semibold text-tccNavy">
                        {{ finalResult?.title || 'Suitability Verified Successfully' }}</h1>
                    <p class="mx-auto max-w-sm text-xs text-tccMutedGray">
                        {{ finalResult?.message || 'Thank you for completing the suitability steps. Your classification and quiz records are securely logged.' }}
                    </p>
                </div>

                <div class="mx-auto max-w-md space-y-2 rounded-lg border border-tccBorder bg-tccLightBg p-5 text-left">
                    <h2 class="font-poppins text-xs font-bold uppercase text-tccNavy">Next Step: KYC Profile</h2>
                    <p class="text-[11px] font-light leading-relaxed text-gray-600">
                        We must now perform identity and AML checks before accepting any investment capital. Please
                        proceed to upload your KYC documentation.
                    </p>
                </div>

                <div class="border-t border-tccBorder pt-6">
                    <a href="/kyc"
                        class="inline-block rounded-md bg-tccDarkNavy px-8 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-tccNavy">
                        Continue to KYC verification &rarr;
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>
