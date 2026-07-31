<script setup lang="ts">
definePageMeta({
    layout: 'portal',
    middleware: ['auth-citizen']
})

useHead({
    title: 'Investor Self-Certification | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type CertificationFlowView = 'selectInvestment' | 'selectStatement' | 'input' | 'support' | 'confirmation'
type QuizOption = {
    id: string
    value: string
    title?: string
    label?: string
    letter?: string
    number?: string
    description?: string
    statements?: string[]
    requires_support?: boolean
    next_question?: Partial<QuizQuestion> & {
        field_type?: string
        field_label?: string
    }
}
type QuizQuestion = {
    id?: number
    question_id: string
    certification_id?: string | null
    completed_label?: string | null
    type: 'select' | 'input' | string
    title: string
    question_text?: string | null
    question_description?: string | null
    options: QuizOption[]
    depends_on_option?: string | null
    field_type?: string
    field_label?: string
    input_type?: string
    placeholder?: string
}

const citizen_user = citizenUser()
const {
    onboardingQuizQuestions,
    submitOnboardingCertification,
} = citizenAuth()

if (citizen_user.value === undefined) {
    citizen_user.value = await fetchCitizenCurrentUser()
}

const requiredOnboardingRoute = getCustomerOnboardingRoute(citizen_user.value)
if (requiredOnboardingRoute && requiredOnboardingRoute !== '/investor-classification') {
    await navigateTo(requiredOnboardingRoute, { replace: true })
}

const activeView = ref<CertificationFlowView>('selectInvestment')
const stepOneQuestion = ref<QuizQuestion | null>(null)
const stepTwoQuestion = ref<QuizQuestion | null>(null)
const stepThreeQuestion = ref<QuizQuestion | null>(null)
const selectedInvestmentOption = ref<QuizOption | null>(null)
const selectedStatementOption = ref<QuizOption | null>(null)
const detailAnswer = ref('')
const completedCertificationLabel = ref('')
const isLoadingQuestion = ref(false)
const isSubmitting = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const currentStatementOptions = computed(() => stepTwoQuestion.value?.options || [])
const inputQuestion = computed(() => stepThreeQuestion.value)
const inputType = computed(() => inputQuestion.value?.input_type || 'text')
const inputLabel = computed(() => (
    inputQuestion.value?.field_label ||
    inputQuestion.value?.question_text ||
    inputQuestion.value?.question_description ||
    ''
))
const inputPlaceholder = computed(() => inputQuestion.value?.placeholder || '')
const inputNumber = computed(() => selectedStatementOption.value?.number || '1')
const isBusy = computed(() => isLoadingQuestion.value || isSubmitting.value)
const defaultConfirmationMessage = 'Before you can view the investment proposition, we need you to complete a short test and review some information about the investment structure.'
const supportTitle = computed(() => stepTwoQuestion.value?.title || 'Contact Support')
const supportMessage = computed(() => (
    stepTwoQuestion.value?.question_text ||
    stepTwoQuestion.value?.question_description ||
    'If the above statements do not apply to you or you are not sure which option best suits you please get in touch with the team.'
))

const getFirstQuestion = (response: any): QuizQuestion | null => {
    const question = response?.data?.questions?.[0]
    return question ? normalizeQuestion(question) : null
}

const normalizeQuestion = (question: any): QuizQuestion => ({
    id: question?.id,
    question_id: question?.question_id || '',
    certification_id: question?.certification_id ?? null,
    completed_label: question?.completed_label ?? null,
    type: question?.type || question?.field_type || 'select',
    title: question?.title || '',
    question_text: question?.question_text || question?.intro || question?.field_label || '',
    question_description: question?.question_description || '',
    options: Array.isArray(question?.options) ? question.options.map(normalizeOption) : [],
    depends_on_option: question?.depends_on_option ?? null,
    field_type: question?.field_type,
    field_label: question?.field_label,
    input_type: question?.input_type,
    placeholder: question?.placeholder,
})

const normalizeOption = (option: any): QuizOption => ({
    id: String(option?.id || option?.value || ''),
    value: String(option?.value || option?.id || ''),
    title: option?.title,
    label: option?.label || option?.title,
    letter: option?.letter,
    number: option?.number,
    description: option?.description,
    statements: Array.isArray(option?.statements) ? option.statements : [],
    requires_support: Boolean(option?.requires_support),
    next_question: option?.next_question,
})

const normalizeNextQuestion = (option: QuizOption): QuizQuestion | null => {
    if (!option.next_question) return null

    return normalizeQuestion({
        ...option.next_question,
        type: option.next_question.field_type || 'input',
        options: [],
    })
}

const getErrorMessage = (error: any, fallback: string) => (
    error?.response?._data?.message ||
    error?.data?.message ||
    fallback
)

const setNotice = (title: string, message: string, tone: NoticeTone) => {
    notice.value = { title, message, tone }
}

const getOptionTitle = (option: QuizOption) => option.title || option.label || option.value

const getOptionLetter = (option: QuizOption, index: number) => (
    option.letter || String.fromCharCode(65 + index)
)

const getStatementNumber = (option: QuizOption, index: number) => (
    option.number || String(index + 1)
)

const getQuestionKey = (option: QuizOption, index: number) => {
    const number = Number(option.number)
    if (Number.isFinite(number) && number > 0 && number <= 26) {
        return `question_${String.fromCharCode(96 + number)}`
    }

    const letter = option.letter?.toLowerCase()
    if (letter && /^[a-z]$/.test(letter)) return `question_${letter}`

    return `question_${String.fromCharCode(97 + index)}`
}

const getInvestmentType = () => {
    const investmentType = selectedInvestmentOption.value?.value || ''
    return investmentType === 'ordinary' ? 'ordinary_investor' : investmentType
}

const getPayloadStatementOptions = () => (
    currentStatementOptions.value.filter((option) => option.value !== 'none' && !option.requires_support)
)

const getCertificationPayload = () => {
    const payload: Record<string, string | null> = {
        investment_type: getInvestmentType()
    }

    if (!selectedInvestmentOption.value || selectedInvestmentOption.value.value === 'ordinary') {
        return payload
    }

    getPayloadStatementOptions().forEach((option, index) => {
        payload[getQuestionKey(option, index)] = option.value === selectedStatementOption.value?.value ? 'Yes' : 'No'
    })

    const detailKey = selectedStatementOption.value?.value
    if (!detailKey) return payload

    if (selectedInvestmentOption.value.value === 'high_net_worth') {
        payload.income = null
        payload.assets = null
    }

    payload[detailKey] = detailAnswer.value.trim() || null

    return payload
}

const refreshCitizenUser = async () => {
    const refreshedUser = await fetchCitizenCurrentUser()
    if (refreshedUser) {
        citizen_user.value = refreshedUser
    }
}

const loadStepOneQuestion = async () => {
    isLoadingQuestion.value = true
    notice.value = null

    try {
        const response = await onboardingQuizQuestions()
        const question = getFirstQuestion(response)
        if (!question) throw new Error('Missing self-certification question.')

        stepOneQuestion.value = question
        activeView.value = 'selectInvestment'
    } catch (error: any) {
        setNotice(
            'Unable To Load Questions',
            getErrorMessage(error, 'Self-certification questions could not be loaded.'),
            'error'
        )
    } finally {
        isLoadingQuestion.value = false
    }
}

const loadStepTwoQuestion = async (dependsOnOption: string) => {
    isLoadingQuestion.value = true
    notice.value = null

    try {
        const response = await onboardingQuizQuestions({
            step: 2,
            depends_on_option: dependsOnOption,
        })
        const question = getFirstQuestion(response)

        if (!question) {
            stepTwoQuestion.value = null
            selectedStatementOption.value = null
            stepThreeQuestion.value = null
            detailAnswer.value = ''
            activeView.value = 'support'
            return
        }

        stepTwoQuestion.value = question
        selectedStatementOption.value = null
        stepThreeQuestion.value = null
        detailAnswer.value = ''

        if (question.type === 'input' || question.field_type === 'input') {
            stepThreeQuestion.value = question
            activeView.value = 'input'
            return
        }

        if (question.type === 'support' || question.field_type === 'support' || !question.options.length) {
            activeView.value = 'support'
            return
        }

        activeView.value = 'selectStatement'
    } catch (error: any) {
        setNotice(
            'Unable To Continue',
            getErrorMessage(error, 'Please try selecting your self-certification option again.'),
            'error'
        )
    } finally {
        isLoadingQuestion.value = false
    }
}

const loadStepThreeQuestion = async (option: QuizOption) => {
    isLoadingQuestion.value = true
    notice.value = null

    try {
        const response = await onboardingQuizQuestions({
            step: 3,
            depends_on_option: option.value,
        })
        const question = getFirstQuestion(response) || normalizeNextQuestion(option)
        if (!question) throw new Error('Missing certification detail question.')

        stepThreeQuestion.value = question
        detailAnswer.value = ''
        activeView.value = 'input'
    } catch (error: any) {
        const fallbackQuestion = normalizeNextQuestion(option)

        if (fallbackQuestion) {
            stepThreeQuestion.value = fallbackQuestion
            detailAnswer.value = ''
            activeView.value = 'input'
            return
        }

        setNotice(
            'Unable To Continue',
            getErrorMessage(error, 'Please try selecting your statement again.'),
            'error'
        )
    } finally {
        isLoadingQuestion.value = false
    }
}

const submitCertification = async () => {
    isSubmitting.value = true
    notice.value = null

    try {
        const response: any = await submitOnboardingCertification(getCertificationPayload())
        const isSuccessfulResponse = response?.status === true || response?.success === true

        if (!isSuccessfulResponse) {
            setNotice('Unable To Submit', response?.message || 'Please try submitting your certification again.', 'error')
            return
        }

        completedCertificationLabel.value = (
            response?.data?.completed_label ||
            stepThreeQuestion.value?.completed_label ||
            stepTwoQuestion.value?.completed_label ||
            selectedInvestmentOption.value?.title?.toUpperCase() ||
            selectedInvestmentOption.value?.label?.toUpperCase() ||
            'SELF CERTIFIED INVESTOR'
        )

        await refreshCitizenUser()
        activeView.value = 'confirmation'
    } catch (error: any) {
        setNotice(
            'Unable To Submit',
            getErrorMessage(error, 'Please try submitting your certification again.'),
            'error'
        )
    } finally {
        isSubmitting.value = false
    }
}

const selectInvestmentOption = async (option: QuizOption) => {
    selectedInvestmentOption.value = option
    notice.value = null

    await loadStepTwoQuestion(option.value)
}

const selectStatementOption = (option: QuizOption) => {
    selectedStatementOption.value = option
    notice.value = null
}

const continueFromStatement = async () => {
    if (!selectedStatementOption.value) {
        setNotice('Answer Required', 'Please select one of the statements before continuing.', 'warning')
        return
    }

    if (selectedStatementOption.value.requires_support || selectedStatementOption.value.value === 'none') {
        activeView.value = 'support'
        return
    }

    await loadStepThreeQuestion(selectedStatementOption.value)
}

const submitDetailAnswer = async () => {
    if (!detailAnswer.value.trim()) {
        setNotice('Answer Required', 'Please complete the box below before continuing.', 'warning')
        return
    }

    await submitCertification()
}

const backToInvestmentOptions = () => {
    activeView.value = 'selectInvestment'
    selectedInvestmentOption.value = null
    selectedStatementOption.value = null
    stepTwoQuestion.value = null
    stepThreeQuestion.value = null
    detailAnswer.value = ''
    notice.value = null
}

const backToStatementOptions = () => {
    activeView.value = 'selectStatement'
    stepThreeQuestion.value = null
    detailAnswer.value = ''
    notice.value = null
}

const backFromSupport = () => {
    if (stepTwoQuestion.value?.options.length) {
        backToStatementOptions()
        return
    }

    backToInvestmentOptions()
}

const goToQuestionnaire = async () => {
    await refreshCitizenUser()
    await navigateTo('/questionnaire?stage=quiz')
}

onMounted(() => {
    if (!stepOneQuestion.value) {
        void loadStepOneQuestion()
    }
})
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-5xl">
            <div class="space-y-7">
                <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                    :tone="notice.tone" />

                <div v-if="isLoadingQuestion && !stepOneQuestion" class="space-y-7" aria-busy="true">
                    <div class="restomod-panel rounded-[2rem] p-6 sm:p-8">
                        <div class="h-10 w-72 animate-pulse rounded-lg bg-white/10" />
                    </div>
                    <div class="restomod-panel rounded-[1.5rem] p-5">
                        <div class="h-4 w-96 max-w-full animate-pulse rounded-full bg-white/10" />
                    </div>
                    <div class="space-y-6">
                        <div v-for="index in 3" :key="index"
                            class="h-32 animate-pulse rounded-[1.25rem] border border-white/10 bg-white/10" />
                    </div>
                </div>

                <template v-else-if="activeView === 'selectInvestment' && stepOneQuestion">
                    <div class="restomod-panel rounded-[2rem] p-6 sm:p-8">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            stepOneQuestion.title }}</h1>
                    </div>

                    <div class="restomod-panel rounded-[1.5rem] border-l-4 border-l-tccGold p-5">
                        <p class="text-sm font-semibold leading-relaxed text-white/80">{{
                            stepOneQuestion.question_text }}</p>
                    </div>

                    <div class="space-y-6">
                        <button v-for="(option, index) in stepOneQuestion.options" :key="option.id" type="button"
                            class="group w-full rounded-[1.25rem] border border-tccBorder bg-white/5 p-5 text-left shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-tccGold/55 hover:bg-tccGold/10 disabled:cursor-wait disabled:opacity-70"
                            :disabled="isBusy" @click="selectInvestmentOption(option)">
                            <div class="flex items-start gap-4">
                                <span
                                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-tccNavy font-poppins text-sm font-bold text-white transition-colors group-hover:bg-tccGold group-hover:text-tccDarkNavy">
                                    {{ getOptionLetter(option, index) }}
                                </span>
                                <div class="min-w-0 flex-grow space-y-3">
                                    <div>
                                        <h2
                                            class="font-poppins text-base font-bold text-white transition-colors group-hover:text-tccGold">
                                            {{ getOptionTitle(option) }}</h2>
                                        <p v-if="option.description" class="mt-1 text-sm leading-snug text-white/75">
                                            {{ option.description }}</p>
                                    </div>

                                    <ol v-if="option.statements?.length" class="space-y-2">
                                        <li v-for="(statement, statementIndex) in option.statements"
                                            :key="statement"
                                            class="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                                            <span
                                                class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-tccGold/60 text-[10px] font-bold text-tccGold">
                                                {{ statementIndex + 1 }}
                                            </span>
                                            <span>{{ statement }}</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </button>
                    </div>
                </template>

                <div v-else-if="activeView === 'selectStatement' && stepTwoQuestion"
                    class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                    <div class="space-y-4 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            stepTwoQuestion.title }}</h1>
                        <p v-if="stepTwoQuestion.question_text"
                            class="rounded-[1.25rem] border-l-4 border-l-tccGold bg-white/5 p-5 text-sm font-semibold leading-relaxed text-white/80">
                            {{ stepTwoQuestion.question_text }}
                        </p>
                    </div>

                    <div class="space-y-4">
                        <label v-for="(option, index) in currentStatementOptions" :key="option.id"
                            class="group flex cursor-pointer items-start gap-4 rounded-[1.25rem] border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-tccGold/55 hover:bg-tccGold/10"
                            :class="selectedStatementOption?.value === option.value ? 'border-tccGold bg-tccGold/15 shadow-[0_0_0_1px_rgba(247,198,0,0.35)]' : 'border-tccBorder bg-white/5'">
                            <input class="sr-only" type="radio" :name="stepTwoQuestion.question_id"
                                :value="option.value" :checked="selectedStatementOption?.value === option.value"
                                :disabled="isBusy" @change="selectStatementOption(option)">
                            <span
                                class="flex h-7 w-7 shrink-0 items-center justify-center rounded border font-poppins text-xs font-bold transition-colors"
                                :class="selectedStatementOption?.value === option.value ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-tccGold/40 bg-white/5 text-tccGold'">
                                {{ getStatementNumber(option, index) }}
                            </span>
                            <span
                                class="min-w-0 flex-1 text-sm leading-relaxed text-white/75 transition-colors group-hover:text-white">
                                {{ option.label || option.title }}
                            </span>
                            <i v-if="selectedStatementOption?.value === option.value"
                                class="pi pi-check-circle ml-auto shrink-0 text-base text-tccGold" aria-hidden="true" />
                        </label>
                    </div>

                    <div class="flex flex-col gap-3 border-t border-tccBorder pt-6 sm:flex-row sm:justify-between">
                        <button type="button"
                            class="rounded-full border border-tccBorder px-8 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            :disabled="isBusy" @click="backToInvestmentOptions">
                            Back
                        </button>
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-10 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold disabled:cursor-wait disabled:opacity-70"
                            :disabled="isBusy" @click="continueFromStatement">
                            {{ isLoadingQuestion ? 'Loading...' : 'Continue' }}
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div v-else-if="activeView === 'input' && inputQuestion"
                    class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                    <div class="space-y-4 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            inputQuestion.title }}</h1>
                    </div>

                    <div class="space-y-4">
                        <label for="statement-detail"
                            class="flex items-start gap-4 text-base font-bold leading-relaxed text-white">
                            <span
                                class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-tccGold/40 bg-white/5 font-poppins text-xs font-bold text-tccGold">
                                {{ inputNumber }}
                            </span>
                            <span>{{ inputLabel }}</span>
                        </label>
                        <input id="statement-detail" v-model="detailAnswer" :type="inputType"
                            :placeholder="inputPlaceholder"
                            class="w-full rounded-lg border border-tccGold bg-[#2c3340] px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-tccGold">
                    </div>

                    <div class="border-t border-tccBorder pt-6 text-center">
                        <a href="mailto:support@thecarcrowd.co.uk"
                            class="text-sm font-semibold text-tccGold underline transition-colors hover:text-tccLightGold">
                            To Contact Support Click Here
                        </a>
                    </div>

                    <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button type="button"
                            class="rounded-full border border-tccBorder px-12 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            :disabled="isBusy" @click="backToStatementOptions">
                            Back
                        </button>
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-12 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold disabled:cursor-wait disabled:opacity-70"
                            :disabled="isBusy" @click="submitDetailAnswer">
                            {{ isSubmitting ? 'Submitting...' : 'Continue' }}
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div v-else-if="activeView === 'support'" class="restomod-panel space-y-7 rounded-[2rem] p-6 sm:p-10">
                    <div class="space-y-3 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            supportTitle }}</h1>
                        <p class="text-sm leading-relaxed text-white/65">
                            {{ supportMessage }}
                        </p>
                    </div>

                    <div
                        class="rounded-[1.25rem] border border-tccBorder bg-white/5 p-5 text-sm leading-relaxed text-white/75">
                        Our support team can help confirm whether self certification is suitable before you continue.
                    </div>

                    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                        <button type="button"
                            class="rounded-full border border-tccBorder px-10 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            :disabled="isBusy"
                            @click="backFromSupport">
                            Back
                        </button>
                        <a href="mailto:support@thecarcrowd.co.uk"
                            class="rounded-full bg-tccGold px-10 py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold">
                            To Contact Support Click Here
                        </a>
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-10 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold disabled:cursor-wait disabled:opacity-70"
                            :disabled="isBusy" @click="submitCertification">
                            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div v-else-if="activeView === 'confirmation'"
                    class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                    <div class="space-y-5 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">
                            Congratulations!</h1>
                    </div>

                    <div class="space-y-4">
                        <p class="text-sm text-white/65">You have self certified as a</p>
                        <p class="font-poppins text-base font-black uppercase text-tccGold">{{
                            completedCertificationLabel }}</p>
                        <p class="max-w-2xl text-sm leading-relaxed text-white/70">
                            {{ defaultConfirmationMessage }}
                        </p>
                    </div>

                    <div class="flex justify-center border-t border-tccBorder pt-6">
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-8 py-3.5 font-poppins text-xs font-bold uppercase tracking-[0.12em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold disabled:cursor-wait disabled:opacity-70"
                            :disabled="isSubmitting" @click="goToQuestionnaire">
                            Go To The Key Facts And Quick Test
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
