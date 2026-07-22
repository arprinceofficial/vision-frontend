<script setup lang="ts">
type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type CertificationFieldType = 'select' | 'input' | 'support' | 'confirmation'
type SelfCertificationOption = {
    id: string
    value: string
    letter: string
    title: string
    description: string
    statements: string[]
}
type SelfCertificationQuestionResponse = {
    question_id: string
    title: string
    instruction: string
    field_type: 'select'
    options: SelfCertificationOption[]
}
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
    field_label?: string
    placeholder?: string
    input_type?: string
    options?: CertificationQuestionOption[]
    support_message?: string
    confirmation_message?: string
}
type SubmitSelfCertificationPayload = {
    question_id: string
    selected_option: string
}
type SubmitSelfCertificationResponse = {
    next_question: CertificationQuestionResponse
}

const emit = defineEmits<{
    (event: 'next-question', question: CertificationQuestionResponse): void
}>()

const isSubmitting = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const mockSelfCertificationQuestion: SelfCertificationQuestionResponse = {
    question_id: 'self_certification_type',
    title: 'Self Certification',
    instruction: 'Please select one of the options below:',
    field_type: 'select',
    options: [
        {
            id: 'high_net_worth',
            value: 'high_net_worth',
            letter: 'A',
            title: 'High Net Worth Investor',
            description: 'You believe you are a High Net Worth investor because at least one of the below statements is most applicable to you',
            statements: [
                'You have an annual income of £100,000 or more',
                'You have net assets of £250,000 or more (Net assets do NOT include: your primary residence, your pension or any pension withdrawals)'
            ]
        },
        {
            id: 'sophisticated',
            value: 'sophisticated',
            letter: 'B',
            title: 'Self Certified Sophisticated Investor',
            description: 'You believe you are a Sophisticated Investor because at least one of the below statements is most applicable to you',
            statements: [
                'You have worked in Private Equity or in the provision of financial service for SMEs',
                'You have been the director of a company with an annual turnover of at least £1 million',
                'Made two or more investments into unlisted companies in the last two years.',
                'Been a member of a network or syndicate of business angels for more than 6 months'
            ]
        },
        {
            id: 'ordinary',
            value: 'ordinary',
            letter: 'C',
            title: 'Ordinary Investor',
            description: 'If the above statements do not apply to you or you are not sure which option best suits you please get in touch with the team.',
            statements: []
        }
    ]
}

const selfCertificationQuestion = ref<SelfCertificationQuestionResponse>(mockSelfCertificationQuestion)

// Replace this adapter with the API call later; the component already consumes this response shape.
const fetchSelfCertificationQuestion = async (): Promise<SelfCertificationQuestionResponse> => {
    return mockSelfCertificationQuestion
}

const supportQuestion: CertificationQuestionResponse = {
    question_id: 'ordinary_support',
    certification_id: 'ordinary',
    title: 'Contact Support',
    completed_label: 'ORDINARY INVESTOR',
    field_type: 'support',
    support_message: 'If the above statements do not apply to you or you are not sure which option best suits you please get in touch with the team.'
}

const nextQuestionsByOption: Record<string, CertificationQuestionResponse> = {
    high_net_worth: {
        question_id: 'high_net_worth_statement',
        certification_id: 'high_net_worth',
        title: 'High-Net Worth Investor Statement',
        completed_label: 'HIGH NET WORTH INVESTOR',
        intro: 'Please read the below statements and select which one is most applicable to you (more than one may apply but you only need to select one).',
        field_type: 'select',
        options: [
            {
                id: 'income',
                value: 'income',
                number: '1',
                label: 'An annual income of £100,000 or more? Income does not include any one-off pension withdrawals.',
                next_question: {
                    question_id: 'high_net_worth_income_amount',
                    certification_id: 'high_net_worth',
                    title: 'High-Net Worth Investor Statement',
                    completed_label: 'HIGH NET WORTH INVESTOR',
                    field_type: 'input',
                    field_label: 'Please could you state your annual income (to the nearest £10,000) in the box below.',
                    placeholder: '100000',
                    input_type: 'number'
                }
            },
            {
                id: 'assets',
                value: 'assets',
                number: '2',
                label: 'Net assets of £250,000 or more? Net assets do not include: your home (primary residence), your pension (or any pension withdrawals) or any rights under qualifying contracts of insurance.',
                next_question: {
                    question_id: 'high_net_worth_net_assets',
                    certification_id: 'high_net_worth',
                    title: 'High-Net Worth Investor Statement',
                    completed_label: 'HIGH NET WORTH INVESTOR',
                    field_type: 'input',
                    field_label: 'Please could you state your total net assets (to the nearest £100,000) in the box below.',
                    placeholder: '100000',
                    input_type: 'number'
                }
            },
            {
                id: 'none',
                value: 'none',
                number: '3',
                label: 'None of these apply to me.',
                requires_support: true
            }
        ]
    },
    sophisticated: {
        question_id: 'sophisticated_statement',
        certification_id: 'sophisticated',
        title: 'Self Certified Sophisticated Investor Statement',
        completed_label: 'SELF CERTIFIED SOPHISTICATED INVESTOR',
        intro: 'Please read the below statements and select which one is most applicable to you (more than one may apply but you only need to select one).',
        field_type: 'select',
        options: [
            {
                id: 'private_equity',
                value: 'private_equity',
                number: '1',
                label: 'You have worked in Private Equity or in the provision of financial service for SMEs',
                next_question: {
                    question_id: 'sophisticated_private_equity_detail',
                    certification_id: 'sophisticated',
                    title: 'Self Certified Sophisticated Investor Statement',
                    completed_label: 'SELF CERTIFIED SOPHISTICATED INVESTOR',
                    field_type: 'input',
                    field_label: 'Please could you briefly state the role or experience that applies to you in the box below.',
                    placeholder: 'Private Equity',
                    input_type: 'text'
                }
            },
            {
                id: 'director',
                value: 'director',
                number: '2',
                label: 'You have been the director of a company with an annual turnover of at least £1 million',
                next_question: {
                    question_id: 'sophisticated_director_turnover',
                    certification_id: 'sophisticated',
                    title: 'Self Certified Sophisticated Investor Statement',
                    completed_label: 'SELF CERTIFIED SOPHISTICATED INVESTOR',
                    field_type: 'input',
                    field_label: 'Please could you state the company turnover (to the nearest £100,000) in the box below.',
                    placeholder: '1000000',
                    input_type: 'number'
                }
            },
            {
                id: 'investments',
                value: 'investments',
                number: '3',
                label: 'Made two or more investments into unlisted companies in the last two years.',
                next_question: {
                    question_id: 'sophisticated_investments_count',
                    certification_id: 'sophisticated',
                    title: 'Self Certified Sophisticated Investor Statement',
                    completed_label: 'SELF CERTIFIED SOPHISTICATED INVESTOR',
                    field_type: 'input',
                    field_label: 'Please could you briefly state the number of unlisted company investments made in the last two years.',
                    placeholder: '2',
                    input_type: 'number'
                }
            },
            {
                id: 'angel_network',
                value: 'angel_network',
                number: '4',
                label: 'Been a member of a network or syndicate of business angels for more than 6 months',
                next_question: {
                    question_id: 'sophisticated_angel_network_name',
                    certification_id: 'sophisticated',
                    title: 'Self Certified Sophisticated Investor Statement',
                    completed_label: 'SELF CERTIFIED SOPHISTICATED INVESTOR',
                    field_type: 'input',
                    field_label: 'Please could you state the name of the network or syndicate in the box below.',
                    placeholder: 'Network name',
                    input_type: 'text'
                }
            },
            {
                id: 'none',
                value: 'none',
                number: '5',
                label: 'None of these apply to me.',
                requires_support: true
            }
        ]
    },
    ordinary: supportQuestion
}

// Replace this adapter with the API call later; the component already consumes this response shape.
const submitSelfCertificationAnswer = async (payload: SubmitSelfCertificationPayload): Promise<SubmitSelfCertificationResponse> => {
    return {
        next_question: nextQuestionsByOption[payload.selected_option] || supportQuestion
    }
}

const selectOption = async (option: SelfCertificationOption) => {
    isSubmitting.value = true
    notice.value = null

    try {
        const response = await submitSelfCertificationAnswer({
            question_id: selfCertificationQuestion.value.question_id,
            selected_option: option.value
        })

        emit('next-question', response.next_question)
    } catch {
        notice.value = {
            title: 'Unable To Continue',
            message: 'Please try selecting your self certification option again.',
            tone: 'error'
        }
    } finally {
        isSubmitting.value = false
    }
}

onMounted(async () => {
    selfCertificationQuestion.value = await fetchSelfCertificationQuestion()
})
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-5xl">
            <div class="space-y-7">
                <div class="restomod-panel rounded-[2rem] p-6 sm:p-8">
                    <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                        selfCertificationQuestion.title }}</h1>
                </div>

                <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                    :tone="notice.tone" />

                <div class="restomod-panel rounded-[1.5rem] border-l-4 border-l-tccGold p-5">
                    <p class="text-sm font-semibold leading-relaxed text-white/80">{{
                        selfCertificationQuestion.instruction }}</p>
                </div>

                <div class="space-y-6">
                    <button v-for="option in selfCertificationQuestion.options" :key="option.id" type="button"
                        class="group w-full rounded-[1.25rem] border border-tccBorder bg-white/5 p-5 text-left shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-tccGold/55 hover:bg-tccGold/10 disabled:cursor-wait disabled:opacity-70"
                        :disabled="isSubmitting" @click="selectOption(option)">
                        <div class="flex items-start gap-4">
                            <span
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-tccNavy font-poppins text-sm font-bold text-white transition-colors group-hover:bg-tccGold group-hover:text-tccDarkNavy">
                                {{ option.letter }}
                            </span>
                            <div class="min-w-0 flex-grow">
                                <h2
                                    class="font-poppins text-base font-bold text-white transition-colors group-hover:text-tccGold">
                                    {{ option.title }}</h2>
                                <p class="mt-1 text-sm leading-snug text-white/75">{{ option.description }}</p>

                                <div v-if="option.statements.length" class="mt-3 space-y-2">
                                    <div v-for="(statement, index) in option.statements" :key="statement"
                                        class="flex items-start gap-3 text-sm leading-relaxed text-white/65">
                                        <span
                                            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-tccGold/40 bg-white/5 font-poppins text-[11px] font-bold text-tccGold">
                                            {{ index + 1 }}
                                        </span>
                                        <span>{{ statement }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
