<script setup lang="ts">
definePageMeta({
    layout: 'portal'
})

type TransactionData = {
    id: string
    slug: string
    vehicle: string
    referenceId: string
    allocations: number
    signedDate: string
    supportEmail: string
}

type SignedDocumentData = {
    title: string
    badge: string
    url: string
    proxyUrl: string
    embedUrl: string
    downloadName: string
}

type DocumentInformationData = {
    icon: string
    title: string
    copy: string
}

type SignedDocumentsPageData = {
    transactions: TransactionData[]
    signatoryName: string
    signedDocumentsUrl: string
    termsConditionsUrl: string
}

type SignedDocumentsPayload = {
    transactions?: Array<Partial<TransactionData>>
    signatoryName?: unknown
    signed_documents?: unknown
    terms_conditions?: unknown
}

type SignedDocumentsResponse = {
    status?: boolean
    message?: string
    data?: SignedDocumentsPayload | null
}

const route = useRoute()
const isSignedDocumentsViewReady = ref(false)
const hasSignedDocumentsFetchSettled = ref(false)
const settledSignedDocumentsSlug = ref('')

const emptySignedDocumentsData: SignedDocumentsPageData = {
    transactions: [],
    signatoryName: '',
    signedDocumentsUrl: '',
    termsConditionsUrl: ''
}

const getStringValue = (value: unknown, fallback = '') => {
    if (value === null || value === undefined || String(value).trim() === '') return fallback
    return String(value).trim()
}

const getNumberValue = (value: unknown, fallback = 0) => {
    const numberValue = Number(value)
    return Number.isFinite(numberValue) ? numberValue : fallback
}

const getRouteParamValue = (value: unknown) => Array.isArray(value) ? value[0] : value
const requestSlug = computed(() => getStringValue(getRouteParamValue(route.params.id)))

const normalizeTransaction = (item: Partial<TransactionData> | null | undefined): TransactionData => ({
    id: getStringValue(item?.id),
    slug: getStringValue(item?.slug, requestSlug.value),
    vehicle: getStringValue(item?.vehicle),
    referenceId: getStringValue(item?.referenceId, item?.id),
    allocations: getNumberValue(item?.allocations),
    signedDate: getStringValue(item?.signedDate),
    supportEmail: getStringValue(item?.supportEmail, 'support@vision148.com')
})

const normalizeSignedDocumentsData = (payload: SignedDocumentsPayload | null | undefined): SignedDocumentsPageData => ({
    transactions: Array.isArray(payload?.transactions)
        ? payload.transactions.map((item) => normalizeTransaction(item))
        : [],
    signatoryName: getStringValue(payload?.signatoryName),
    signedDocumentsUrl: getStringValue(payload?.signed_documents),
    termsConditionsUrl: getStringValue(payload?.terms_conditions)
})

const {
    data: signedDocumentsData,
    pending: isSignedDocumentsLoading
} = useAsyncData<SignedDocumentsPageData>(
    'profile-signed-documents',
    async () => {
        const slug = requestSlug.value
        hasSignedDocumentsFetchSettled.value = false

        try {
            if (!slug) return emptySignedDocumentsData

            const response = await $fetchCitizen<SignedDocumentsResponse>(
                `v1/customer/allocation-requests/${slug}/signed-document-data`,
                { method: 'GET' }
            )

            return normalizeSignedDocumentsData(response?.data)
        } catch (error) {
            console.error('[Profile Signed Documents] Unable to load signed document data', error)
            return emptySignedDocumentsData
        } finally {
            settledSignedDocumentsSlug.value = slug
            hasSignedDocumentsFetchSettled.value = true
        }
    },
    {
        default: () => emptySignedDocumentsData,
        lazy: true,
        server: false,
        watch: [() => route.params.id]
    }
)

const pageData = computed(() => signedDocumentsData.value ?? emptySignedDocumentsData)
const transaction = computed<TransactionData>(() => pageData.value.transactions[0] ?? {
    id: requestSlug.value,
    slug: requestSlug.value,
    vehicle: '',
    referenceId: requestSlug.value,
    allocations: 0,
    signedDate: '',
    supportEmail: 'support@vision148.com'
})
const transactionRouteId = computed(() => transaction.value.slug || requestSlug.value || transaction.value.id)
const getDocumentProxyUrl = (url: string) => (
    url ? `/api/agreement-document?url=${encodeURIComponent(url)}` : ''
)
const getDocumentEmbedUrl = (url: string) => {
    const proxyUrl = getDocumentProxyUrl(url)
    return proxyUrl ? `${proxyUrl}#toolbar=1&navpanes=0` : ''
}
const signedDocuments = computed<SignedDocumentData[]>(() => [
    {
        title: 'Signed Subscription Agreement',
        badge: 'Document 1 of 2',
        url: pageData.value.signedDocumentsUrl,
        proxyUrl: getDocumentProxyUrl(pageData.value.signedDocumentsUrl),
        embedUrl: getDocumentEmbedUrl(pageData.value.signedDocumentsUrl),
        downloadName: `Signed Subscription Agreement-${transactionRouteId.value}.pdf`
    },
    {
        title: 'Signed Terms & Conditions',
        badge: 'Document 2 of 2',
        url: pageData.value.termsConditionsUrl,
        proxyUrl: getDocumentProxyUrl(pageData.value.termsConditionsUrl),
        embedUrl: getDocumentEmbedUrl(pageData.value.termsConditionsUrl),
        downloadName: `Signed Terms and Conditions-${transactionRouteId.value}.pdf`
    }
].filter((document) => document.url))
const documentInformation = computed<DocumentInformationData[]>(() => [
    {
        icon: 'pi-check-circle',
        title: 'Documents Signed',
        copy: 'All documents have been signed'
    },
    {
        icon: 'pi-eye',
        title: 'Review Anytime',
        copy: 'View your documents whenever needed'
    },
    {
        icon: 'pi-download',
        title: 'Download Copies',
        copy: 'Save PDFs for your records'
    }
])
const hasCachedCurrentSignedDocumentsData = computed(() => (
    Boolean(requestSlug.value) &&
    pageData.value.transactions.some((item) => item.slug === requestSlug.value) &&
    Boolean(pageData.value.signedDocumentsUrl || pageData.value.termsConditionsUrl)
))
const hasLoadedCurrentSignedDocuments = computed(() => (
    hasCachedCurrentSignedDocumentsData.value ||
    (hasSignedDocumentsFetchSettled.value && settledSignedDocumentsSlug.value === requestSlug.value)
))
const shouldShowSignedDocumentsSkeleton = computed(() => (
    !isSignedDocumentsViewReady.value ||
    isSignedDocumentsLoading.value ||
    !hasLoadedCurrentSignedDocuments.value
))

watch(requestSlug, () => {
    if (settledSignedDocumentsSlug.value !== requestSlug.value) {
        hasSignedDocumentsFetchSettled.value = false
    }
})

onMounted(() => {
    window.requestAnimationFrame(() => {
        isSignedDocumentsViewReady.value = true
    })
})

useHead(() => ({
    title: `${transaction.value.referenceId || 'Transaction'} Signed Documents | Vision148`
}))
</script>

<template>
    <ProfileSignedDocumentsSkeleton v-if="shouldShowSignedDocumentsSkeleton" />

    <section v-else class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="mb-7 text-center">
            <span
                class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-[0_0_42px_rgba(247,198,0,0.14)]">
                <i class="pi pi-file-edit text-xl" aria-hidden="true" />
            </span>
            <h1 class="mt-3 font-poppins text-2xl font-black text-white sm:text-3xl">Signed Documents</h1>
            <p class="mt-2 text-[13px] text-white/55">View your signed investment documents</p>
        </div>

        <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <main class="space-y-5">
                <section
                    class="rounded-2xl border border-tccGold/35 bg-tccGold/10 p-5 text-center shadow-[0_22px_80px_rgba(0,0,0,0.28)]">
                    <h2 class="font-poppins text-lg font-black text-white">Documents Available</h2>
                    <p class="mx-auto mt-2.5 max-w-2xl text-[13px] leading-relaxed text-white/72">
                        Your signed investment documents are ready for review.
                        Signed by {{ pageData.signatoryName }} on {{ transaction.signedDate }}.
                    </p>
                </section>

                <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-chart-line text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-lg font-black">Investment Summary</h2>
                    </div>

                    <div class="mt-5 grid gap-3 sm:grid-cols-2">
                        <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span
                                class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Vehicle</span>
                            <strong class="mt-1 block text-[13px] text-white">{{ transaction.vehicle }}</strong>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Number of
                                Allocations</span>
                            <strong class="mt-1 block text-[13px] text-white">{{ transaction.allocations }}</strong>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Signed
                                Date</span>
                            <strong class="mt-1 block text-[13px] text-white">{{ transaction.signedDate }}</strong>
                        </div>
                        <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span
                                class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Reference</span>
                            <strong class="mt-1 block font-mono text-[13px] text-tccGold">{{ transaction.referenceId
                            }}</strong>
                        </div>
                    </div>
                </section>

                <section class="space-y-4">
                    <div class="flex items-center gap-3 text-white">
                        <i class="pi pi-file-pdf text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-lg font-black">Signed Documents</h2>
                    </div>

                    <article v-for="document in signedDocuments" :key="document.title"
                        class="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0a08] text-white shadow-[0_22px_80px_rgba(0,0,0,0.26)]">
                        <header
                            class="flex flex-col gap-3 bg-tccDeepBlack px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex flex-wrap items-center gap-3">
                                <i class="pi pi-file-pdf text-tccGold" aria-hidden="true" />
                                <h3 class="font-poppins text-[13px] font-black sm:text-sm">{{ document.title }}</h3>
                                <span
                                    class="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/70">
                                    {{ document.badge }}
                                </span>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                <a :href="document.proxyUrl || undefined" target="_blank" rel="noopener"
                                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                                    <i class="pi pi-window-maximize text-xs" aria-hidden="true" />
                                    Fullscreen
                                </a>
                                <a :href="document.proxyUrl || undefined" :download="document.downloadName"
                                    class="inline-flex items-center justify-center gap-2 rounded-lg border border-tccGold/35 bg-tccGold/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy">
                                    <i class="pi pi-download text-xs" aria-hidden="true" />
                                    Download
                                </a>
                            </div>
                        </header>

                        <div class="pdf-viewer-toolbar border-b px-3 py-2 text-[11px]">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-bars" aria-hidden="true" />
                                    <i class="pi pi-search" aria-hidden="true" />
                                    <span class="rounded border border-white/20 px-2 py-1 text-white">{{ document.badge
                                        }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-minus" aria-hidden="true" />
                                    <i class="pi pi-plus" aria-hidden="true" />
                                    <i class="pi pi-download" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div class="pdf-viewer-surface bg-white">
                            <iframe v-if="document.embedUrl" :src="document.embedUrl" :title="document.title"
                                class="block h-[72vh] min-h-[520px] w-full border-0 bg-white" />
                            <div v-else
                                class="grid min-h-[420px] place-items-center bg-gradient-to-b from-white to-slate-50 p-6">
                                <div
                                    class="rounded-lg border border-slate-200 bg-white px-5 py-4 text-center shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                                    <i class="pi pi-spin pi-spinner text-tccGold" aria-hidden="true" />
                                    <span class="ml-2 text-sm font-black text-tccDarkNavy">Loading document...</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            </main>

            <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <NuxtLink :to="`/profile/transactions/${transactionRouteId}/payment-details`"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tccGold px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold">
                    <i class="pi pi-credit-card text-[10px]" aria-hidden="true" />
                    Go to Payment Details
                </NuxtLink>

                <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-info-circle text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-base font-black">Document Information</h2>
                    </div>

                    <div class="mt-4 space-y-3">
                        <div v-for="item in documentInformation" :key="item.title"
                            class="flex gap-3 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-4">
                            <span
                                class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tccGold/10 text-tccGold">
                                <i class="pi text-sm" :class="item.icon" aria-hidden="true" />
                            </span>
                            <div>
                                <h3 class="font-poppins text-[13px] font-black">{{ item.title }}</h3>
                                <p class="mt-1 text-xs text-white/55">{{ item.copy }}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-[13px] text-white/60">
                    <div class="flex gap-3">
                        <i class="pi pi-headphones mt-1 text-tccGold" aria-hidden="true" />
                        <div>
                            <p>Need Assistance?</p>
                            <a :href="`mailto:${transaction.supportEmail}`"
                                class="font-black text-tccGold hover:text-tccLightGold">
                                {{ transaction.supportEmail }}
                            </a>
                        </div>
                    </div>
                </div>

                <NuxtLink :to="`/profile/transactions/${transactionRouteId}`"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-tccGold hover:text-tccGold">
                    <i class="pi pi-arrow-left text-[10px]" aria-hidden="true" />
                    Back to Allocation Details
                </NuxtLink>
            </aside>
        </div>
    </section>
</template>

<style scoped>
.pdf-viewer-toolbar {
    border-color: rgba(255, 255, 255, 0.18);
    background: #2f2f2f;
    color: rgba(255, 255, 255, 0.82);
}

.pdf-viewer-surface {
    background: #ffffff;
}
</style>
