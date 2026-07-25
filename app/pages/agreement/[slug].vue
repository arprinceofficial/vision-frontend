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
const agreement = computed(() => {
    const normalizedSlug = slug.value.toLowerCase()

    return agreementRecords.find((record) => record.id.toLowerCase() === normalizedSlug) || agreementRecords[0]
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

const overviewCards = [
    {
        icon: 'pi pi-check-circle',
        title: 'Review and sign the documents',
        copy: 'This is the formal bit. Take your time to read the Subscription Agreement and Terms & Conditions. Then you can eSign them and a copy will be emailed to you.'
    },
    {
        icon: 'pi pi-building-columns',
        title: 'Syndicate Vote',
        copy: 'As a Syndicate member you will be asked to vote on day to day operational topics for the Asset. The first vote will be about storage.'
    },
    {
        icon: 'pi pi-clock',
        title: 'Funds transfer into Escrow account',
        copy: 'We have set up a dedicated Escrow account for you to transfer the funds for your allocation or allocations.'
    }
]

const documentCards = [
    {
        icon: 'pi pi-file-pdf',
        title: 'Subscription Agreement',
        copy: 'Review the legal agreement between you, as part of the Syndicate, and the Trust that holds the asset.'
    },
    {
        icon: 'pi pi-file',
        title: 'Terms and Conditions',
        copy: 'Understand your rights, obligations, and the operational details of being a Syndicate member.'
    },
    {
        icon: 'pi pi-pencil',
        title: 'Digital Signature',
        copy: 'You are now able to digitally sign the documents and copies will be emailed to you and available on the platform.'
    }
]

const subscriptionBullets = [
    'Cost of asset and associated fees',
    'The Bare Trust name which will hold the asset',
    'The syndicate being the sole beneficiary of the Bare Trust'
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
                        :cards="overviewCards"
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
                        :document-cards="documentCards"
                        :subscription-bullets="subscriptionBullets"
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
