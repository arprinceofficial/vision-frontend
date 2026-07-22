<script setup lang="ts">
type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type StatementPhase = 'statement' | 'detail' | 'complete' | 'support'
type CertificationStatement = {
    id: string
    number: string
    text: string
    detailQuestion?: string
    placeholder?: string
    requiresSupport?: boolean
}
type CertificationContent = {
    title: string
    completedLabel: string
    intro: string
    statements: CertificationStatement[]
}

const props = defineProps<{
    certificationId: string
}>()

const emit = defineEmits<{
    (event: 'back'): void
    (event: 'show-key-facts'): void
}>()

const phase = ref<StatementPhase>('statement')
const selectedStatementId = ref('')
const detailValue = ref('')
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const statementContent = {
    high_net_worth: {
        title: 'High-Net Worth Investor Statement',
        completedLabel: 'HIGH NET WORTH INVESTOR',
        intro: 'Please read the below statements and select which one is most applicable to you (more than one may apply but you only need to select one).',
        statements: [
            {
                id: 'income',
                number: '1',
                text: 'An annual income of £100,000 or more? Income does not include any one-off pension withdrawals.',
                detailQuestion: 'Please could you state your annual income (to the nearest £10,000) in the box below.',
                placeholder: '100000'
            },
            {
                id: 'assets',
                number: '2',
                text: 'Net assets of £250,000 or more? Net assets do not include: your home (primary residence), your pension (or any pension withdrawals) or any rights under qualifying contracts of insurance.',
                detailQuestion: 'Please could you state your total net assets (to the nearest £100,000) in the box below.',
                placeholder: '100000'
            },
            {
                id: 'none',
                number: '3',
                text: 'None of these apply to me.',
                requiresSupport: true
            }
        ]
    },
    sophisticated: {
        title: 'Self Certified Sophisticated Investor Statement',
        completedLabel: 'SELF CERTIFIED SOPHISTICATED INVESTOR',
        intro: 'Please read the below statements and select which one is most applicable to you (more than one may apply but you only need to select one).',
        statements: [
            {
                id: 'private_equity',
                number: '1',
                text: 'You have worked in Private Equity or in the provision of financial service for SMEs',
                detailQuestion: 'Please could you briefly state the role or experience that applies to you in the box below.',
                placeholder: 'Private Equity'
            },
            {
                id: 'director',
                number: '2',
                text: 'You have been the director of a company with an annual turnover of at least £1 million',
                detailQuestion: 'Please could you state the company turnover (to the nearest £100,000) in the box below.',
                placeholder: '1000000'
            },
            {
                id: 'investments',
                number: '3',
                text: 'Made two or more investments into unlisted companies in the last two years.',
                detailQuestion: 'Please could you briefly state the number of unlisted company investments made in the last two years.',
                placeholder: '2'
            },
            {
                id: 'angel_network',
                number: '4',
                text: 'Been a member of a network or syndicate of business angels for more than 6 months',
                detailQuestion: 'Please could you state the name of the network or syndicate in the box below.',
                placeholder: 'Network name'
            },
            {
                id: 'none',
                number: '5',
                text: 'None of these apply to me.',
                requiresSupport: true
            }
        ]
    },
    ordinary: {
        title: 'Ordinary Investor',
        completedLabel: 'ORDINARY INVESTOR',
        intro: 'If the above statements do not apply to you or you are not sure which option best suits you please get in touch with the team.',
        statements: []
    }
} satisfies Record<string, CertificationContent>

const certification = computed<CertificationContent>(() => {
    const content = statementContent[props.certificationId as keyof typeof statementContent]

    if (content) {
        return content
    }

    return statementContent.high_net_worth
})
const selectedStatement = computed(() => certification.value.statements.find((statement) => statement.id === selectedStatementId.value))

const setNotice = (title: string, message: string, tone: NoticeTone) => {
    notice.value = { title, message, tone }
}

const resetStatement = () => {
    phase.value = props.certificationId === 'ordinary' ? 'support' : 'statement'
    selectedStatementId.value = ''
    detailValue.value = ''
    notice.value = null
}

const selectStatement = (statementId: string) => {
    const statement = certification.value.statements.find((item) => item.id === statementId)

    if (!statement) return

    selectedStatementId.value = statementId
    detailValue.value = ''
    notice.value = null

    if (statement.requiresSupport) {
        phase.value = 'support'
        return
    }

    phase.value = statement.detailQuestion ? 'detail' : 'complete'
}

const continueFromDetail = () => {
    if (!detailValue.value.trim()) {
        setNotice('Answer Required', 'Please complete the box below before continuing.', 'warning')
        return
    }

    phase.value = 'complete'
    notice.value = null
}

watch(
    () => props.certificationId,
    () => {
        resetStatement()
    },
    { immediate: true }
)
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-5xl">
            <div class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                    :tone="notice.tone" />

                <div v-if="phase === 'statement'" class="space-y-7">
                    <div class="space-y-4 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            certification.title }}</h1>
                        <div class="rounded-[1.25rem] border-l-4 border-l-tccGold bg-white/5 p-5">
                            <p class="text-sm font-semibold leading-relaxed text-white/80">{{ certification.intro }}</p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <button v-for="statement in certification.statements" :key="statement.id" type="button"
                            class="group flex w-full items-start gap-4 rounded-[1.25rem] border border-tccBorder bg-white/5 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-tccGold/55 hover:bg-tccGold/10"
                            @click="selectStatement(statement.id)">
                            <span
                                class="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-tccGold/40 bg-white/5 font-poppins text-xs font-bold text-tccGold">
                                {{ statement.number }}
                            </span>
                            <span
                                class="text-sm leading-relaxed text-white/75 transition-colors group-hover:text-white">{{
                                statement.text }}</span>
                        </button>
                    </div>

                    <div class="flex justify-start border-t border-tccBorder pt-6">
                        <button type="button"
                            class="rounded-full border border-tccBorder px-8 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            @click="emit('back')">
                            Back
                        </button>
                    </div>
                </div>

                <div v-else-if="phase === 'detail' && selectedStatement" class="space-y-8">
                    <div class="space-y-4 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                            certification.title }}</h1>
                    </div>

                    <div class="space-y-4">
                        <label for="statement-detail"
                            class="flex items-start gap-4 text-base font-bold leading-relaxed text-white">
                            <span
                                class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-tccGold/40 bg-white/5 font-poppins text-xs font-bold text-tccGold">
                                {{ selectedStatement.number }}
                            </span>
                            <span>{{ selectedStatement.detailQuestion }}</span>
                        </label>
                        <input id="statement-detail" v-model="detailValue" type="text"
                            :placeholder="selectedStatement.placeholder"
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
                            @click="phase = 'statement'">
                            Back
                        </button>
                        <button type="button"
                            class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-12 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                            @click="continueFromDetail">
                            Continue
                            <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div v-else-if="phase === 'support'" class="space-y-7">
                    <div class="space-y-3 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">Contact Support
                        </h1>
                        <p class="text-sm leading-relaxed text-white/65">
                            If the above statements do not apply to you or you are not sure which option best suits you
                            please get in touch with the team.
                        </p>
                    </div>

                    <div
                        class="rounded-[1.25rem] border border-tccBorder bg-white/5 p-5 text-sm leading-relaxed text-white/75">
                        Our support team can help confirm whether self certification is suitable before you continue.
                    </div>

                    <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button type="button"
                            class="rounded-full border border-tccBorder px-10 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-tccGold hover:text-tccGold"
                            @click="emit('back')">
                            Back
                        </button>
                        <a href="mailto:support@thecarcrowd.co.uk"
                            class="rounded-full bg-tccGold px-10 py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold">
                            To Contact Support Click Here
                        </a>
                    </div>
                </div>

                <div v-else class="space-y-8">
                    <div class="space-y-5 border-b border-tccBorder pb-6">
                        <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">
                            Congratulations!</h1>
                    </div>

                    <div class="space-y-4">
                        <p class="text-sm text-white/65">You have self certified as a</p>
                        <p class="font-poppins text-base font-black uppercase text-tccGold">{{
                            certification.completedLabel }}</p>
                        <p class="max-w-2xl text-sm leading-relaxed text-white/70">
                            Before you can view the investment proposition, we need you to complete a short test and
                            review some information about the investment structure.
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
