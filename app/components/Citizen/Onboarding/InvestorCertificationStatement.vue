<script setup lang="ts">
type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type CertificationFieldType = 'select' | 'input' | 'support' | 'confirmation'
type CertificationQuestionOption = {
    id: string
    value: string
    number: string
    label: string
    requires_support?: boolean
    next_question?: CertificationQuestionResponse
}
type CertificationQuestionResponse = {
    question_id: string
    certification_id: string
    title: string
    completed_label: string
    intro?: string
    field_type: CertificationFieldType
    number?: string
    field_label?: string
    placeholder?: string
    input_type?: string
    options?: CertificationQuestionOption[]
    support_message?: string
    confirmation_message?: string
}
type CertificationAnswerPayload = {
    question_id: string
    certification_id: string
    field_type: CertificationFieldType
    selected_option?: string
    input_value?: string
}
type CertificationAnswerResponse = {
    next_question: CertificationQuestionResponse
}

const props = defineProps<{
    question: CertificationQuestionResponse
}>()

const emit = defineEmits<{
    (event: 'back'): void
    (event: 'show-key-facts'): void
}>()

const currentQuestion = ref<CertificationQuestionResponse>(props.question)
const previousQuestions = ref<CertificationQuestionResponse[]>([])
const selectedOption = ref('')
const inputValue = ref<string | number>('')
const isSubmitting = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const isSelectQuestion = computed(() => currentQuestion.value.field_type === 'select')
const isInputQuestion = computed(() => currentQuestion.value.field_type === 'input')
const isSupportQuestion = computed(() => currentQuestion.value.field_type === 'support')
const isConfirmationQuestion = computed(() => currentQuestion.value.field_type === 'confirmation')
const inputType = computed(() => currentQuestion.value.input_type || 'text')
const currentOptions = computed(() => currentQuestion.value.options || [])

const defaultConfirmationMessage = 'Before you can view the investment proposition, we need you to complete a short test and review some information about the investment structure.'

const setNotice = (title: string, message: string, tone: NoticeTone) => {
    notice.value = { title, message, tone }
}

const resetAnswerState = () => {
    selectedOption.value = ''
    inputValue.value = ''
    notice.value = null
}

const getInputAnswerValue = () => String(inputValue.value ?? '').trim()

const selectOption = (option: CertificationQuestionOption) => {
    selectedOption.value = option.value
    notice.value = null

    console.log('[InvestorCertificationStatement] selected option', {
        question_id: currentQuestion.value.question_id,
        selected_option: option.value,
        option
    })
}

const getConfirmationQuestion = (question: CertificationQuestionResponse): CertificationQuestionResponse => ({
    question_id: `${question.certification_id}_confirmation`,
    certification_id: question.certification_id,
    title: 'Congratulations!',
    completed_label: question.completed_label,
    field_type: 'confirmation',
    confirmation_message: defaultConfirmationMessage
})

const getSupportQuestion = (question: CertificationQuestionResponse): CertificationQuestionResponse => ({
    question_id: `${question.certification_id}_support`,
    certification_id: question.certification_id,
    title: 'Contact Support',
    completed_label: question.completed_label,
    field_type: 'support',
    support_message: 'If the above statements do not apply to you or you are not sure which option best suits you please get in touch with the team.'
})

const applyNextQuestion = (nextQuestion: CertificationQuestionResponse) => {
    previousQuestions.value.push(currentQuestion.value)
    currentQuestion.value = nextQuestion
    resetAnswerState()
}

const goBack = () => {
    const previousQuestion = previousQuestions.value.pop()

    if (previousQuestion) {
        currentQuestion.value = previousQuestion
        resetAnswerState()
        return
    }

    emit('back')
}

// Replace this adapter with the API call later; the component already consumes this response shape.
const submitCertificationAnswer = async (payload: CertificationAnswerPayload): Promise<CertificationAnswerResponse> => {
    if (payload.field_type === 'select') {
        const selected = currentQuestion.value.options?.find((option) => option.value === payload.selected_option)

        if (selected?.requires_support) {
            return { next_question: getSupportQuestion(currentQuestion.value) }
        }

        if (selected?.next_question) {
            return {
                next_question: {
                    ...selected.next_question,
                    number: selected.number
                }
            }
        }
    }

    return {
        next_question: getConfirmationQuestion(currentQuestion.value)
    }
}

const submitCurrentAnswer = async () => {
    const normalizedInputValue = getInputAnswerValue()

    if (isSelectQuestion.value && !selectedOption.value) {
        setNotice('Answer Required', 'Please select one of the statements before continuing.', 'warning')
        return
    }

    if (isInputQuestion.value && !normalizedInputValue) {
        setNotice('Answer Required', 'Please complete the box below before continuing.', 'warning')
        return
    }

    isSubmitting.value = true
    notice.value = null

    try {
        const payload: CertificationAnswerPayload = {
            question_id: currentQuestion.value.question_id,
            certification_id: currentQuestion.value.certification_id,
            field_type: currentQuestion.value.field_type,
            selected_option: selectedOption.value || undefined,
            input_value: normalizedInputValue || undefined
        }

        console.log('[InvestorCertificationStatement] submit answer', payload)

        const response = await submitCertificationAnswer(payload)

        console.log('[InvestorCertificationStatement] answer response', response)

        applyNextQuestion(response.next_question)
    } catch {
        setNotice('Unable To Continue', 'Please try submitting your answer again.', 'error')
    } finally {
        isSubmitting.value = false
    }
}

watch(
    () => props.question,
    (question) => {
        currentQuestion.value = question
        previousQuestions.value = []
        resetAnswerState()
    }
)
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-5xl">
            <div class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                    :tone="notice.tone" />

                <div v-if="isSelectQuestion" class="space-y-7">
                    <div class="space-y-4 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            currentQuestion.title }}</h1>
                        <div v-if="currentQuestion.intro"
                            class="rounded-[1.25rem] border-l-4 border-l-tccGold bg-white/5 p-5">
                            <p class="text-sm font-semibold leading-relaxed text-white/80">{{ currentQuestion.intro }}
                            </p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <label v-for="option in currentOptions" :key="option.id"
                            class="group flex cursor-pointer items-start gap-4 rounded-[1.25rem] border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-tccGold/55 hover:bg-tccGold/10"
                            :class="selectedOption === option.value ? 'border-tccGold bg-tccGold/15 shadow-[0_0_0_1px_rgba(247,198,0,0.35)]' : 'border-tccBorder bg-white/5'">
                            <input class="sr-only" type="radio" :name="currentQuestion.question_id"
                                :value="option.value" :checked="selectedOption === option.value"
                                :disabled="isSubmitting" @change="selectOption(option)">
                            <span
                                class="flex h-7 w-7 shrink-0 items-center justify-center rounded border font-poppins text-xs font-bold transition-colors"
                                :class="selectedOption === option.value ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-tccGold/40 bg-white/5 text-tccGold'">
                                {{ option.number }}
                            </span>
                            <span
                                class="min-w-0 flex-1 text-sm leading-relaxed text-white/75 transition-colors group-hover:text-white">{{
                                option.label }}</span>
                            <i v-if="selectedOption === option.value"
                                class="pi pi-check-circle ml-auto shrink-0 text-base text-tccGold" aria-hidden="true" />
                        </label>
                    </div>

                    <div class="flex flex-col gap-3 border-t border-tccBorder pt-6 sm:flex-row sm:justify-between">
                        <button type="button"
                            class="rounded-full border border-tccBorder px-8 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            @click="goBack">
                            Back
                        </button>
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-10 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold disabled:cursor-wait disabled:opacity-70"
                            :disabled="isSubmitting" @click="submitCurrentAnswer">
                            Continue
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div v-else-if="isInputQuestion" class="space-y-8">
                    <div class="space-y-4 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            currentQuestion.title }}</h1>
                    </div>

                    <div class="space-y-4">
                        <label for="statement-detail"
                            class="flex items-start gap-4 text-base font-bold leading-relaxed text-white">
                            <span v-if="currentQuestion.number"
                                class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-tccGold/40 bg-white/5 font-poppins text-xs font-bold text-tccGold">
                                {{ currentQuestion.number }}
                            </span>
                            <span>{{ currentQuestion.field_label }}</span>
                        </label>
                        <input id="statement-detail" v-model="inputValue" :type="inputType"
                            :placeholder="currentQuestion.placeholder"
                            class="w-full rounded-lg border border-tccBorder px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
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
                            @click="goBack">
                            Back
                        </button>
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-12 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold disabled:cursor-wait disabled:opacity-70"
                            :disabled="isSubmitting" @click="submitCurrentAnswer">
                            Continue
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div v-else-if="isSupportQuestion" class="space-y-7">
                    <div class="space-y-3 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            currentQuestion.title }}</h1>
                        <p class="text-sm leading-relaxed text-white/65">{{ currentQuestion.support_message }}</p>
                    </div>

                    <div
                        class="rounded-[1.25rem] border border-tccBorder bg-white/5 p-5 text-sm leading-relaxed text-white/75">
                        Our support team can help confirm whether self certification is suitable before you continue.
                    </div>

                    <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button type="button"
                            class="rounded-full border border-tccBorder px-10 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            @click="goBack">
                            Back
                        </button>
                        <a href="mailto:support@thecarcrowd.co.uk"
                            class="rounded-full bg-tccGold px-10 py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold">
                            To Contact Support Click Here
                        </a>
                    </div>
                </div>

                <div v-else-if="isConfirmationQuestion" class="space-y-8">
                    <div class="space-y-5 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">
                            {{ currentQuestion.title }}</h1>
                    </div>

                    <div class="space-y-4">
                        <p class="text-sm text-white/65">You have self certified as a</p>
                        <p class="font-poppins text-base font-black uppercase text-tccGold">{{
                            currentQuestion.completed_label }}</p>
                        <p class="max-w-2xl text-sm leading-relaxed text-white/70">
                            {{ currentQuestion.confirmation_message || defaultConfirmationMessage }}
                        </p>
                    </div>

                    <div class="flex justify-center border-t border-tccBorder pt-6">
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-8 py-3.5 font-poppins text-xs font-bold uppercase tracking-[0.12em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                            @click="emit('show-key-facts')">
                            Go To The Key Facts And Quick Test
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
