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
    vehicleImage?: string
    collection: string
    year: string
    allocations: number
    allocationCost: number
    reference: string
    supportEmail: string
}

type AgreementAsset = Partial<AgreementRecord>

const route = useRoute()

type AllocationRequestResponse = {
    status?: boolean
    message?: string
    data?: Record<string, any> | null
}

type FractionalItemResponse = {
    status?: boolean
    message?: string
    data?: Record<string, any> | null
}

type AllocationRequest = {
    id: string
    slug: string
    state: number
    paymentStatus: string
    sharesCount: number
    totalAmount: number
    allocationCost: number
    vehicle: string
    vehicleImage: string
    reference: string
    documentSignatureId: string
    signedDocumentPath: {
        subscriptionAgreement: string
        termsAndConditions: string
        generatedAt: string
    }
}

type SignatureSubmitPayload = {
    signature_method: 'draw' | 'type' | 'upload'
    signature_type: 'canvas'
    signature_canvas: string
    signature_text?: string
    signature_style?: string
}

type UpdateAllocationRequestStateOptions = {
    includeAgreementFlags?: boolean
    syncStage?: boolean
}

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

const routeSegments = computed(() => {
    const params = route.params.slug
    const segments = Array.isArray(params) ? params : [params]

    return segments
        .flatMap((segment) => String(segment || '').split('/'))
        .filter(Boolean)
})

const slug = computed(() => routeSegments.value[0] || '')
const shareRouteCount = computed(() => {
    const shareSegment = routeSegments.value.find((segment) => /^a-\d+$/i.test(segment))
    if (!shareSegment) return 1

    const shareCount = Number(shareSegment.replace(/^a-/i, ''))
    return Number.isFinite(shareCount) && shareCount > 0 ? Math.round(shareCount) : 1
})

const allocationRequestSlug = computed(() => {
    const requestSegment = routeSegments.value.find((segment) => /^s-/i.test(segment))
    return requestSegment ? requestSegment.replace(/^s-/i, '') : ''
})

const allocationRequest = ref<AllocationRequest | null>(null)
const agreementAsset = ref<AgreementAsset | null>(null)
const isPreparingAllocation = ref(false)
const isUpdatingAllocationState = ref(false)
const isSubmittingSignature = ref(false)
const isSubmittingCart = ref(false)
const isSubmittingPaymentReceipt = ref(false)
const signatureSubmitError = ref('')
const paymentReceiptError = ref('')
const signedDocumentsStateUpdatedFor = ref('')
const preparedRoutePath = ref('')
const preparingRoutePath = ref('')

const getNumberValue = (value: unknown, fallback = 0) => {
    const numberValue = Number(value)
    return Number.isFinite(numberValue) ? numberValue : fallback
}

const getStringValue = (...values: unknown[]) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const getDocumentSignatureId = (item: Record<string, any>) => {
    const ids: unknown[] = [
        item.document_signature_id,
        item.documentSignatureId
    ]

    const collectSignatureIds = (value: unknown, depth = 0) => {
        if (!value || depth > 4) return

        if (Array.isArray(value)) {
            value.forEach((entry) => collectSignatureIds(entry, depth + 1))
            return
        }

        if (typeof value !== 'object') return

        const record = value as Record<string, any>
        ids.push(
            record.id,
            record.document_signature_id,
            record.documentSignatureId
        )

        collectSignatureIds(record.data, depth + 1)
        collectSignatureIds(record.document_signature, depth + 1)
        collectSignatureIds(record.documentSignature, depth + 1)
        collectSignatureIds(record.document_signatures, depth + 1)
        collectSignatureIds(record.documentSignatures, depth + 1)
    }

    collectSignatureIds(item.document_signature)
    collectSignatureIds(item.documentSignature)
    collectSignatureIds(item.document_signatures)
    collectSignatureIds(item.documentSignatures)

    return getStringValue(...ids)
}

const normalizeAllocationRequest = (item: Record<string, any> | null | undefined): AllocationRequest | null => {
    if (!item) return null

    const fractionalItem = item.fractional_item || item.fractionalItem || {}
    const sharesCount = getNumberValue(item.shares_count ?? item.sharesCount, shareRouteCount.value)
    const totalAmount = getNumberValue(item.total_amount ?? item.price)
    const allocationCost = sharesCount > 0 && totalAmount > 0
        ? totalAmount / sharesCount
        : getNumberValue(fractionalItem.per_share_value ?? fractionalItem.allocation_cost ?? agreementAsset.value?.allocationCost)
    const slugValue = getStringValue(item.slug, allocationRequestSlug.value)
    const signedDocumentPath = item.signed_document_path || item.signedDocumentPath || {}

    return {
        id: getStringValue(item.id),
        slug: slugValue,
        state: getNumberValue(item.state, 1),
        paymentStatus: getStringValue(item.payment_status, item.paymentStatus),
        sharesCount,
        totalAmount,
        allocationCost,
        vehicle: getStringValue(
            fractionalItem.asset_name,
            fractionalItem.item_name,
            fractionalItem.headline,
            fractionalItem.assetable?.name,
            agreementAsset.value?.vehicle,
            agreementRecords[0]?.vehicle
        ),
        vehicleImage: getStringValue(
            item.vehicle_image,
            item.vehicleImage,
            fractionalItem.vehicle_image,
            fractionalItem.vehicleImage,
            fractionalItem.image,
            fractionalItem.assetable?.vehicle_image,
            fractionalItem.assetable?.vehicleImage,
            fractionalItem.assetable?.image,
            agreementAsset.value?.vehicleImage
        ),
        reference: slugValue || getStringValue(item.reference, agreementAsset.value?.reference, agreementRecords[0]?.reference),
        documentSignatureId: getDocumentSignatureId(item),
        signedDocumentPath: {
            subscriptionAgreement: getStringValue(signedDocumentPath.subscription_agreement, signedDocumentPath.subscriptionAgreement),
            termsAndConditions: getStringValue(signedDocumentPath.terms_and_conditions, signedDocumentPath.termsAndConditions),
            generatedAt: getStringValue(signedDocumentPath.generated_at, signedDocumentPath.generatedAt)
        }
    }
}

const getSpecValue = (specs: unknown, labelPattern: RegExp) => {
    if (!Array.isArray(specs)) return ''

    const spec = specs.find((item: any) => labelPattern.test(getStringValue(item?.label)))
    return getStringValue((spec as any)?.value)
}

const normalizeAgreementAsset = (item: Record<string, any> | null | undefined): AgreementAsset | null => {
    if (!item) return null

    const assetable = item.assetable || {}
    const vehicle = getStringValue(
        item.vehicle,
        item.title,
        item.asset_name,
        item.item_name,
        item.headline,
        assetable.name
    )

    return {
        id: getStringValue(item.uid, item.allocationId, item.allocation_id, item.id),
        vehicle,
        vehicleImage: getStringValue(
            item.vehicle_image,
            item.vehicleImage,
            item.heroImage,
            item.image,
            assetable.vehicle_image,
            assetable.vehicleImage,
            assetable.image
        ),
        collection: getStringValue(item.collection, item.collection_name),
        year: getStringValue(item.year, assetable.year, getSpecValue(item.specs, /year/i)),
        allocationCost: getNumberValue(item.allocationCost ?? item.per_share_value ?? item.funded_current_price),
        reference: getStringValue(item.allocationId, item.allocation_id, item.slug),
        supportEmail: 'support@thecarcrowd.co.uk'
    }
}

const mergeAgreementAsset = (asset: AgreementAsset | null) => {
    if (!asset) return

    agreementAsset.value = {
        ...(agreementAsset.value || {}),
        ...(asset.id ? { id: asset.id } : {}),
        ...(asset.vehicle ? { vehicle: asset.vehicle } : {}),
        ...(asset.vehicleImage ? { vehicleImage: asset.vehicleImage } : {}),
        ...(asset.collection ? { collection: asset.collection } : {}),
        ...(asset.year ? { year: asset.year } : {}),
        ...(asset.allocationCost ? { allocationCost: asset.allocationCost } : {}),
        ...(asset.reference ? { reference: asset.reference } : {}),
        ...(asset.supportEmail ? { supportEmail: asset.supportEmail } : {})
    }
}

const readStoredAgreementAsset = () => {
    if (!import.meta.client || !slug.value) return

    const storedAsset = sessionStorage.getItem(`agreement-asset:${slug.value}`)
    if (!storedAsset) return

    try {
        const parsedAsset = JSON.parse(storedAsset)
        const asset = normalizeAgreementAsset(parsedAsset)

        if (asset) {
            mergeAgreementAsset(asset)
        }
    } catch {
        sessionStorage.removeItem(`agreement-asset:${slug.value}`)
    }
}

const getAgreementFallback = (matchedAgreement: AgreementRecord | undefined) => {
    const fallbackAgreement = matchedAgreement ?? agreementRecords[0]!
    const asset = agreementAsset.value

    if (!asset) return fallbackAgreement

    return {
        ...fallbackAgreement,
        ...asset,
        id: slug.value || asset.id || fallbackAgreement.id,
        vehicle: asset.vehicle || fallbackAgreement.vehicle,
        vehicleImage: asset.vehicleImage || fallbackAgreement.vehicleImage,
        collection: asset.collection || fallbackAgreement.collection,
        year: asset.year || fallbackAgreement.year,
        allocations: shareRouteCount.value,
        allocationCost: asset.allocationCost || fallbackAgreement.allocationCost,
        reference: allocationRequestSlug.value || asset.reference || fallbackAgreement.reference,
        supportEmail: asset.supportEmail || fallbackAgreement.supportEmail
    }
}

const agreement = computed<AgreementRecord>(() => {
    const normalizedSlug = slug.value.toLowerCase()
    const matchedAgreement = agreementRecords.find((record) => record.id.toLowerCase() === normalizedSlug)
    const request = allocationRequest.value
    const fallbackAgreement = getAgreementFallback(matchedAgreement)

    if (request) {
        return {
            ...fallbackAgreement,
            id: slug.value || fallbackAgreement.id,
            vehicle: request.vehicle || fallbackAgreement.vehicle,
            vehicleImage: request.vehicleImage || fallbackAgreement.vehicleImage,
            allocations: routeSegments.value.length > 1 ? shareRouteCount.value : request.sharesCount,
            allocationCost: request.allocationCost || fallbackAgreement.allocationCost,
            reference: request.reference || allocationRequestSlug.value || ''
        }
    }

    if (routeSegments.value.length > 1) {
        return {
            ...fallbackAgreement,
            id: slug.value || fallbackAgreement.id,
            allocations: shareRouteCount.value,
            reference: allocationRequestSlug.value || ''
        }
    }

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

const requestStateStageMap: Record<number, AgreementStage> = {
    1: 'overview',
    2: 'subscription',
    3: 'vote',
    4: 'cart',
    5: 'payment-agreement',
    6: 'bank-transfer'
}

const isAllocationPaid = computed(() => getStringValue(allocationRequest.value?.paymentStatus) === '1')
const activeTimelineIndex = computed(() => (
    isAllocationPaid.value ? timelineSteps.length - 1 : stageIndexMap[currentStage.value]
))
const activeDocumentIndex = computed(() => (currentStage.value === 'terms' ? 2 : 1))
const totalInvestment = computed(() => `GBP ${(agreement.value.allocations * agreement.value.allocationCost).toLocaleString('en-GB')}`)
const signedDocumentPath = computed(() => allocationRequest.value?.signedDocumentPath || {
    subscriptionAgreement: '',
    termsAndConditions: '',
    generatedAt: ''
})
const documentSignatureId = computed(() => allocationRequest.value?.documentSignatureId || '')
const setStageFromRequestState = (state: number) => {
    currentStage.value = requestStateStageMap[state] || 'overview'
}

const getAllocationRequestSlug = () => getStringValue(allocationRequest.value?.slug, allocationRequestSlug.value)

const fetchAllocationRequestData = async (requestSlug: string) => {
    if (!requestSlug) return null

    const response = await $fetchCitizen<AllocationRequestResponse>(`v1/customer/allocation-requests/${requestSlug}`, {
        method: 'GET'
    })
    const request = normalizeAllocationRequest(response?.data)

    if (request) {
        allocationRequest.value = request
    }

    return request
}

const fetchAllocationRequest = async (requestSlug: string) => {
    const request = await fetchAllocationRequestData(requestSlug)

    if (request) {
        setStageFromRequestState(request.state)

        if (request.state === 2) {
            try {
                await updateAllocationRequestState(2)
            } catch (error) {
                console.error('[Agreement] Unable to refresh document state', error)
            }
        }
    }
}

const ensureDocumentSignatureId = async () => {
    if (documentSignatureId.value) return documentSignatureId.value

    const requestSlug = getAllocationRequestSlug()
    if (!requestSlug) return ''

    const request = await fetchAllocationRequestData(requestSlug)
    return request?.documentSignatureId || documentSignatureId.value
}

const updateAllocationRequestState = async (state: number, options: UpdateAllocationRequestStateOptions = {}) => {
    const requestSlug = getAllocationRequestSlug()
    if (!requestSlug || isUpdatingAllocationState.value) return

    const includeAgreementFlags = options.includeAgreementFlags ?? state === 2
    const syncStage = options.syncStage ?? true
    const body = includeAgreementFlags
        ? {
            state,
            agree_terms: true,
            agree_documents: true,
            agree_support: true
        }
        : { state }

    isUpdatingAllocationState.value = true

    try {
        const response = await $fetchCitizen<AllocationRequestResponse>(`v1/customer/allocation-requests/${requestSlug}/update-state`, {
            method: 'POST',
            body
        })
        const request = normalizeAllocationRequest(response?.data)

        if (request) {
            allocationRequest.value = request
            if (syncStage) {
                setStageFromRequestState(request.state)
            }
            return
        }

        if (syncStage) {
            setStageFromRequestState(state)
        }
    } finally {
        isUpdatingAllocationState.value = false
    }
}

const fetchAgreementAsset = async () => {
    if (!slug.value || routeSegments.value.length <= 1) return

    readStoredAgreementAsset()

    try {
        const response = await $fetchCitizen<FractionalItemResponse>(`v1/customer/fractional-items/${slug.value}`, {
            method: 'GET'
        })
        const asset = normalizeAgreementAsset(response?.data)

        if (asset) {
            mergeAgreementAsset(asset)
        }
    } catch {
        readStoredAgreementAsset()
    }
}

const requestShares = async () => {
    if (!slug.value || allocationRequestSlug.value || isPreparingAllocation.value) return

    isPreparingAllocation.value = true

    try {
        const response = await $fetchCitizen<AllocationRequestResponse>(`v1/customer/fractional-items/${slug.value}/request-shares`, {
            method: 'POST',
            body: {
                shares_count: shareRouteCount.value
            }
        })
        const request = normalizeAllocationRequest(response?.data)
        const requestAsset = normalizeAgreementAsset(response?.data?.fractional_item || response?.data?.fractionalItem)

        if (requestAsset) {
            mergeAgreementAsset(requestAsset)
        }

        if (!request?.slug) return

        allocationRequest.value = request
        setStageFromRequestState(request.state)

        await navigateTo(`/agreement/${encodeURIComponent(slug.value)}/a-${shareRouteCount.value}/s-${encodeURIComponent(request.slug)}`, {
            replace: true
        })
    } finally {
        isPreparingAllocation.value = false
    }
}

const prepareAllocationFlow = async () => {
    const currentRoutePath = route.fullPath

    if (
        !slug.value ||
        preparedRoutePath.value === currentRoutePath ||
        preparingRoutePath.value === currentRoutePath
    ) {
        return null
    }

    preparingRoutePath.value = currentRoutePath

    try {
        await fetchAgreementAsset()

        if (allocationRequestSlug.value) {
            await fetchAllocationRequest(allocationRequestSlug.value)
            preparedRoutePath.value = currentRoutePath
            return allocationRequest.value
        }

        if (routeSegments.value.length > 1) {
            await requestShares()
            preparedRoutePath.value = currentRoutePath
            return allocationRequest.value
        }

        preparedRoutePath.value = currentRoutePath
        return null
    } finally {
        if (preparingRoutePath.value === currentRoutePath) {
            preparingRoutePath.value = ''
        }
    }
}

const {
    pending: allocationFlowPending,
    status: allocationFlowStatus
} = await useAsyncData(
    'agreement-allocation-flow',
    async () => {
        return prepareAllocationFlow()
    },
    {
        default: () => null,
        lazy: true,
        server: false,
        watch: [() => route.fullPath]
    }
)

const isAllocationRoute = computed(() => routeSegments.value.length > 1)
const displayedReference = computed(() => (
    isAllocationRoute.value
        ? getStringValue(allocationRequest.value?.reference, allocationRequestSlug.value)
        : agreement.value.reference
))
const isAllocationFlowLoading = computed(() => (
    isPreparingAllocation.value ||
    preparingRoutePath.value === route.fullPath ||
    allocationFlowPending.value ||
    allocationFlowStatus.value === 'pending' ||
    (
        isAllocationRoute.value &&
        preparedRoutePath.value !== route.fullPath &&
        allocationFlowStatus.value !== 'error'
    )
))
const isReferenceLoading = computed(() => (
    isAllocationRoute.value &&
    !displayedReference.value &&
    isAllocationFlowLoading.value
))
const shouldShowAgreementSkeleton = computed(() => (
    isAllocationRoute.value &&
    !allocationRequest.value &&
    isAllocationFlowLoading.value
))
const isGetStartedLoading = computed(() => (
    isAllocationRoute.value && (
        isAllocationFlowLoading.value ||
        isUpdatingAllocationState.value
    )
))

const updateSignedDocumentsState = async () => {
    const requestSlug = getAllocationRequestSlug()
    if (!requestSlug || signedDocumentsStateUpdatedFor.value === requestSlug || isUpdatingAllocationState.value) return

    signedDocumentsStateUpdatedFor.value = requestSlug

    try {
        await updateAllocationRequestState(3, {
            includeAgreementFlags: false,
            syncStage: false
        })
    } catch (error) {
        signedDocumentsStateUpdatedFor.value = ''
        console.error('[Agreement] Unable to update signed document state', error)
    }
}

onMounted(() => {
    void prepareAllocationFlow()
})

watch(currentStage, async (stage) => {
    await nextTick()

    if (typeof window !== 'undefined') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    if (stage === 'signed-documents') {
        await updateSignedDocumentsState()
    }
}, { flush: 'post' })

const showOverview = () => {
    currentStage.value = 'overview'
}

const showSubscription = () => {
    currentStage.value = 'subscription'
}

const getStarted = async () => {
    if (!isAllocationRoute.value) {
        showSubscription()
        return
    }

    if (!getAllocationRequestSlug()) {
        await prepareAllocationFlow()
    }

    if (!getAllocationRequestSlug()) return

    try {
        await updateAllocationRequestState(2)
    } catch (error) {
        console.error('[Agreement] Unable to update allocation state', error)
    }
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

const submitSignature = async (payload: SignatureSubmitPayload) => {
    if (isSubmittingSignature.value) return

    isSubmittingSignature.value = true
    signatureSubmitError.value = ''

    try {
        const signatureDocumentId = await ensureDocumentSignatureId()

        if (!signatureDocumentId) {
            console.error('[Agreement] Document signature id is missing')
            signatureSubmitError.value = 'Document signature is not ready yet. Please reload the agreement and try again.'
            return
        }

        const response = await $fetchCitizen<AllocationRequestResponse>(`v1/customer/documents/${signatureDocumentId}/sign`, {
            method: 'POST',
            body: payload
        })
        const request = normalizeAllocationRequest(response?.data?.allocation_request || response?.data?.allocationRequest || response?.data)

        if (request?.slug) {
            allocationRequest.value = request
            setStageFromRequestState(request.state)
        }

        signatureSubmitError.value = ''
        currentStage.value = 'signed-documents'
    } catch (error) {
        console.error('[Agreement] Unable to submit signature', error)
        signatureSubmitError.value = getStringValue(
            (error as any)?.data?.message,
            (error as any)?.response?._data?.message,
            (error as any)?.message,
            'Unable to submit signature. Please try again.'
        )
    } finally {
        isSubmittingSignature.value = false
    }
}

const proceedToVote = async () => {
    if (!isAllocationRoute.value) {
        currentStage.value = 'vote'
        return
    }

    try {
        await updateAllocationRequestState(3, {
            includeAgreementFlags: false,
            syncStage: true
        })
    } catch (error) {
        console.error('[Agreement] Unable to proceed to vote', error)
    }
}

const proceedToCart = async () => {
    if (!isAllocationRoute.value) {
        currentStage.value = 'cart'
        return
    }

    try {
        await updateAllocationRequestState(4, {
            includeAgreementFlags: false,
            syncStage: true
        })
    } catch (error) {
        console.error('[Agreement] Unable to continue from vote', error)
    }
}

const proceedToPaymentAgreement = async () => {
    if (!isAllocationRoute.value) {
        currentStage.value = 'payment-agreement'
        return
    }

    const requestSlug = getAllocationRequestSlug()
    if (!requestSlug || isSubmittingCart.value) return

    isSubmittingCart.value = true

    try {
        const response = await $fetchCitizen<AllocationRequestResponse>(`v1/customer/allocation-requests/${requestSlug}/cart`, {
            method: 'POST',
            body: {
                shares_count: agreement.value.allocations,
                payment_method: 'bank_transfer',
                state: 5
            }
        })
        const request = normalizeAllocationRequest(response?.data?.allocation_request || response?.data?.allocationRequest || response?.data)

        if (request?.slug) {
            allocationRequest.value = request
        }

        currentStage.value = 'payment-agreement'
    } catch (error) {
        console.error('[Agreement] Unable to submit cart', error)
    } finally {
        isSubmittingCart.value = false
    }
}

const proceedToBankTransfer = async () => {
    if (!isAllocationRoute.value) {
        currentStage.value = 'bank-transfer'
        return
    }

    try {
        await updateAllocationRequestState(6, {
            includeAgreementFlags: false,
            syncStage: true
        })
    } catch (error) {
        console.error('[Agreement] Unable to proceed to payment', error)
    }
}

const getPaymentAllocationRequestId = async () => {
    if (allocationRequest.value?.id) return allocationRequest.value.id

    const requestSlug = getAllocationRequestSlug()
    if (!requestSlug) return ''

    const request = await fetchAllocationRequestData(requestSlug)
    return request?.id || allocationRequest.value?.id || ''
}

const confirmPayment = async (receiptImage: string) => {
    if (isSubmittingPaymentReceipt.value) return

    isSubmittingPaymentReceipt.value = true
    paymentReceiptError.value = ''

    try {
        const requestId = await getPaymentAllocationRequestId()

        if (!requestId) {
            paymentReceiptError.value = 'Allocation request id is missing. Please reload and try again.'
            return
        }

        const response = await $fetchCitizen<AllocationRequestResponse>(`v1/customer/allocation-requests/${requestId}/pay`, {
            method: 'POST',
            body: {
                payment_method: 'bank_transfer',
                receipt_image: receiptImage
            }
        })
        const request = normalizeAllocationRequest(response?.data?.allocation_request || response?.data?.allocationRequest || response?.data)

        if (request?.slug) {
            allocationRequest.value = request
        }

        isPaymentConfirmationModalOpen.value = true
    } catch (error) {
        console.error('[Agreement] Unable to confirm payment', error)
        paymentReceiptError.value = getStringValue(
            (error as any)?.data?.message,
            (error as any)?.response?._data?.message,
            (error as any)?.message,
            'Unable to confirm payment. Please try again.'
        )
    } finally {
        isSubmittingPaymentReceipt.value = false
    }
}

const closePaymentConfirmationModal = () => {
    isPaymentConfirmationModalOpen.value = false
    void navigateTo('/')
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
        <CitizenAgreementBreadcrumb :reference="displayedReference" :is-reference-loading="isReferenceLoading" />

        <CitizenAgreementPageSkeleton v-if="shouldShowAgreementSkeleton" />

        <template v-else>
            <CitizenAgreementTimeline :steps="timelineSteps" :active-index="activeTimelineIndex"
                @show-overview="showOverview" @show-documents="showSubscription" />

            <section class="bg-tccDeepBlack pb-14 sm:pb-16">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <CitizenAgreementSummaryStrip :agreement="agreement" :total-investment="totalInvestment"
                        :reference="displayedReference" :is-reference-loading="isReferenceLoading" />

                    <Transition name="agreement-fade" mode="out-in">
                        <CitizenAgreementPaidStatusSection v-if="isAllocationPaid" key="already-paid"
                            :agreement="agreement" :reference="displayedReference" :total-investment="totalInvestment" />

                        <CitizenAgreementWhatHappensNextSection v-else-if="currentStage === 'overview'" key="overview"
                            :support-email="agreement.supportEmail" :is-loading="isGetStartedLoading"
                            @get-started="getStarted" />

                        <CitizenAgreementSignatureSection v-else-if="currentStage === 'signature'" key="signature"
                            :agreement="agreement" :is-submitting="isSubmittingSignature"
                            :submit-error="signatureSubmitError" @back-to-documents="showTerms"
                            @submit="submitSignature" />

                        <CitizenAgreementSignedDocumentsReviewSection v-else-if="currentStage === 'signed-documents'"
                            key="signed-documents" :agreement="agreement" :is-loading="isUpdatingAllocationState"
                            @proceed-to-vote="proceedToVote" />

                        <CitizenAgreementSyndicateVoteSection v-else-if="currentStage === 'vote'" key="vote"
                            :agreement="agreement" :is-loading="isUpdatingAllocationState" @continue="proceedToCart" />

                        <CitizenAgreementAllocationCartSection v-else-if="currentStage === 'cart'" key="cart"
                            :agreement="agreement" :is-loading="isSubmittingCart"
                            @proceed-to-payment="proceedToPaymentAgreement" />

                        <CitizenAgreementPaymentAgreementSection v-else-if="currentStage === 'payment-agreement'"
                            key="payment-agreement" :agreement="agreement" :is-loading="isUpdatingAllocationState"
                            @back-to-cart="proceedToCart" @proceed-to-payment="proceedToBankTransfer" />

                        <CitizenAgreementBankTransferDetailsSection v-else-if="currentStage === 'bank-transfer'"
                            key="bank-transfer" :agreement="agreement" :is-loading="isSubmittingPaymentReceipt"
                            :submit-error="paymentReceiptError" @back-to-cart="proceedToCart"
                            @confirm-payment="confirmPayment" />

                        <CitizenAgreementDocumentReviewSection v-else key="documents" :current-stage="currentStage"
                            :active-document-index="activeDocumentIndex" :support-email="agreement.supportEmail"
                            :subscription-agreement-url="signedDocumentPath.subscriptionAgreement"
                            :terms-and-conditions-url="signedDocumentPath.termsAndConditions"
                            @show-subscription="showSubscription" @show-terms="showTerms"
                            @proceed-to-sign="openReadyToSignModal" />
                    </Transition>
                </div>
            </section>
        </template>

        <CitizenAgreementReadyToSignModal :is-open-modal="isReadyToSignModalOpen"
            :support-email="agreement.supportEmail" @close="closeReadyToSignModal" @proceed="proceedToSignature" />

        <CitizenAgreementPaymentConfirmationModal :is-open-modal="isPaymentConfirmationModalOpen" :agreement="agreement"
            @close="closePaymentConfirmationModal" @edit-cart="editPaymentCart"
            @confirm="completePaymentConfirmation" />
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
