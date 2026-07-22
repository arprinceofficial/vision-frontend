<script setup lang="ts">
definePageMeta({
    layout: 'portal'
})

useHead({
    title: 'Investor Self-Certification | The Car Crowd'
})

type CertificationFlowView = 'intro' | 'options' | 'statement' | 'keyFacts'
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

const activeView = ref<CertificationFlowView>('intro')
const certificationQuestion = ref<CertificationQuestionResponse | null>(null)

const showOptions = () => {
    activeView.value = 'options'
}

const showStatement = (question: CertificationQuestionResponse) => {
    certificationQuestion.value = question
    activeView.value = 'statement'
}

const showKeyFacts = () => {
    activeView.value = 'keyFacts'
}

const goToQuestionnaire = () => {
    void navigateTo('/questionnaire?stage=quiz')
}
</script>

<template>
    <CitizenOnboardingCertificationIntro v-if="activeView === 'intro'" @proceed="showOptions" />

    <CitizenOnboardingSelfCertificationOptions v-else-if="activeView === 'options'" @next-question="showStatement" />

    <CitizenOnboardingInvestorCertificationStatement v-else-if="activeView === 'statement' && certificationQuestion"
        :question="certificationQuestion" @back="showOptions" @show-key-facts="showKeyFacts" />

    <CitizenOnboardingKeyFacts v-else-if="activeView === 'keyFacts'" @continue="goToQuestionnaire" />

    <CitizenOnboardingCertificationIntro v-else @proceed="showOptions" />
</template>
