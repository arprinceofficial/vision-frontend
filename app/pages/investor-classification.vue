<script setup lang="ts">
definePageMeta({
    layout: 'portal'
})

useHead({
    title: 'Investor Self-Certification | The Car Crowd'
})

type CertificationFlowView = 'intro' | 'options' | 'statement' | 'keyFacts'

const activeView = ref<CertificationFlowView>('intro')
const selectedCertificationId = ref('high_net_worth')

const showOptions = () => {
    activeView.value = 'options'
}

const showStatement = (certificationId: string) => {
    selectedCertificationId.value = certificationId
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

    <CitizenOnboardingSelfCertificationOptions v-else-if="activeView === 'options'" @select="showStatement" />

    <CitizenOnboardingInvestorCertificationStatement v-else-if="activeView === 'statement'"
        :certification-id="selectedCertificationId" @back="showOptions" @show-key-facts="showKeyFacts" />

    <CitizenOnboardingKeyFacts v-else @continue="goToQuestionnaire" />
</template>
