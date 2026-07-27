<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

type AgreementStage =
    | 'overview'
    | 'subscription'
    | 'terms'
    | 'signature'
    | 'signed-documents'
    | 'vote'
    | 'cart'
    | 'payment-agreement'
    | 'bank-transfer'

type TimelineStep = {
    key: string
    label: string
    icon: string
}

type AgreementRecord = {
    id: string
    vehicle: string
    collection: string
    year: string
    allocations: number
    allocationCost: number
    reference: string
    supportEmail: string
}

const route = useRoute()

const agreementRecords: AgreementRecord[] = [
    {
        id: 'NN93366393',
        vehicle: 'Diablo VT Roadster Lamborghini',
        collection: 'Modern Classics Collection',
        year: '1997',
        allocations: 1,
        allocationCost: 5000,
        reference: 'NN93366393',
        supportEmail: 'support@thecarcrowd.co.uk'
    }
]

const slug = computed(() => String(route.params.slug || ''))
const agreement = computed<AgreementRecord>(() => {
    const normalizedSlug = slug.value.toLowerCase()
    const matchedAgreement = agreementRecords.find((record) => record.id.toLowerCase() === normalizedSlug)

    return matchedAgreement ?? agreementRecords[0]!
})

const currentStage = ref<AgreementStage>('overview')
const isReadyToSignModalOpen = ref(false)
const isPaymentConfirmationModalOpen = ref(false)

const timelineSteps: TimelineStep[] = [
    { key: 'what-happens-next', label: 'What Happens Next', icon: 'pi pi-verified' },
    { key: 'documents', label: 'Documents', icon: 'pi pi-file' },
    { key: 'syndicate-vote', label: 'Syndicate Vote', icon: 'pi pi-users' },
    { key: 'cart', label: 'Cart', icon: 'pi pi-shopping-cart' },
    { key: 'final-agreement', label: 'Final Agreement', icon: 'pi pi-file-check' },
    { key: 'payment', label: 'Payment', icon: 'pi pi-credit-card' }
]

const activeTimelineIndex = computed(() => {
    const stageIndexMap: Record<AgreementStage, number> = {
        overview: 0,
        subscription: 1,
        terms: 1,
        signature: 1,
        'signed-documents': 1,
        vote: 2,
        cart: 3,
        'payment-agreement': 4,
        'bank-transfer': 5
    }

    return stageIndexMap[currentStage.value]
})
const activeDocumentIndex = computed(() => (currentStage.value === 'terms' ? 2 : 1))
const totalInvestment = computed(() => `GBP ${agreement.value.allocationCost.toLocaleString('en-GB')}`)

watch(currentStage, async () => {
    await nextTick()

    if (typeof window !== 'undefined') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}, { flush: 'post' })

const showOverview = () => {
    currentStage.value = 'overview'
}

const showSubscription = () => {
    currentStage.value = 'subscription'
}

const showTerms = () => {
    currentStage.value = 'terms'
}

const openReadyToSignModal = () => {
    isReadyToSignModalOpen.value = true
}

const closeReadyToSignModal = () => {
    isReadyToSignModalOpen.value = false
}

const proceedToSignature = () => {
    isReadyToSignModalOpen.value = false
    currentStage.value = 'signature'
}

const submitSignature = () => {
    currentStage.value = 'signed-documents'
}

const proceedToVote = () => {
    currentStage.value = 'vote'
}

const proceedToCart = () => {
    currentStage.value = 'cart'
}

const proceedToPaymentAgreement = () => {
    currentStage.value = 'payment-agreement'
}

const proceedToBankTransfer = () => {
    currentStage.value = 'bank-transfer'
}

const confirmPayment = () => {
    isPaymentConfirmationModalOpen.value = true
}

const closePaymentConfirmationModal = () => {
    isPaymentConfirmationModalOpen.value = false
}

const editPaymentCart = () => {
    isPaymentConfirmationModalOpen.value = false
    currentStage.value = 'cart'
}

const completePaymentConfirmation = () => {
    isPaymentConfirmationModalOpen.value = false
    void navigateTo('/profile/transactions')
}

useHead(() => ({
    title: `Agreement ${agreement.value.reference} - The Car Crowd`,
    meta: [
        {
            name: 'description',
            content: `Review documents for ${agreement.value.vehicle}.`
        }
    ]
}))
</script>

<template>
    <div class="bg-tccDeepBlack font-poppins text-white">
        <CitizenAgreementBreadcrumb :reference="agreement.reference" />

        <CitizenAgreementTimeline
            :steps="timelineSteps"
            :active-index="activeTimelineIndex"
            @show-overview="showOverview"
            @show-documents="showSubscription"
        />

        <section class="bg-tccDeepBlack pb-14 sm:pb-16">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <CitizenAgreementSummaryStrip :agreement="agreement" :total-investment="totalInvestment" />

                <Transition name="agreement-fade" mode="out-in">
                    <CitizenAgreementWhatHappensNextSection
                        v-if="currentStage === 'overview'"
                        key="overview"
                        :support-email="agreement.supportEmail"
                        @get-started="showSubscription"
                    />

                    <CitizenAgreementSignatureSection
                        v-else-if="currentStage === 'signature'"
                        key="signature"
                        :agreement="agreement"
                        @back-to-documents="showTerms"
                        @submit="submitSignature"
                    />

                    <CitizenAgreementSignedDocumentsReviewSection
                        v-else-if="currentStage === 'signed-documents'"
                        key="signed-documents"
                        :agreement="agreement"
                        @proceed-to-vote="proceedToVote"
                    />

                    <CitizenAgreementSyndicateVoteSection
                        v-else-if="currentStage === 'vote'"
                        key="vote"
                        :agreement="agreement"
                        @continue="proceedToCart"
                    />

                    <CitizenAgreementAllocationCartSection
                        v-else-if="currentStage === 'cart'"
                        key="cart"
                        :agreement="agreement"
                        @proceed-to-payment="proceedToPaymentAgreement"
                    />

                    <CitizenAgreementPaymentAgreementSection
                        v-else-if="currentStage === 'payment-agreement'"
                        key="payment-agreement"
                        :agreement="agreement"
                        @back-to-cart="proceedToCart"
                        @proceed-to-payment="proceedToBankTransfer"
                    />

                    <CitizenAgreementBankTransferDetailsSection
                        v-else-if="currentStage === 'bank-transfer'"
                        key="bank-transfer"
                        :agreement="agreement"
                        @back-to-cart="proceedToCart"
                        @confirm-payment="confirmPayment"
                    />

                    <CitizenAgreementDocumentReviewSection
                        v-else
                        key="documents"
                        :current-stage="currentStage"
                        :active-document-index="activeDocumentIndex"
                        :support-email="agreement.supportEmail"
                        @show-subscription="showSubscription"
                        @show-terms="showTerms"
                        @proceed-to-sign="openReadyToSignModal"
                    />
                </Transition>
            </div>
        </section>

        <CitizenAgreementReadyToSignModal
            :is-open-modal="isReadyToSignModalOpen"
            :support-email="agreement.supportEmail"
            @close="closeReadyToSignModal"
            @proceed="proceedToSignature"
        />

        <CitizenAgreementPaymentConfirmationModal
            :is-open-modal="isPaymentConfirmationModalOpen"
            :agreement="agreement"
            @close="closePaymentConfirmationModal"
            @edit-cart="editPaymentCart"
            @confirm="completePaymentConfirmation"
        />
    </div>
</template>

<style scoped>
.agreement-fade-enter-active,
.agreement-fade-leave-active {
    transition: opacity 180ms ease, transform 180ms ease;
}

.agreement-fade-enter-from,
.agreement-fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
}
</style>
