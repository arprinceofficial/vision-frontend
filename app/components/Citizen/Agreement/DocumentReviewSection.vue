<script setup lang="ts">
const props = withDefaults(defineProps<{
    currentStage: string
    activeDocumentIndex: number
    supportEmail: string
    subscriptionAgreementUrl?: string
    termsAndConditionsUrl?: string
}>(), {
    subscriptionAgreementUrl: '',
    termsAndConditionsUrl: ''
})

const emit = defineEmits<{
    (event: 'show-subscription'): void
    (event: 'show-terms'): void
    (event: 'proceed-to-sign'): void
}>()

type DocumentCard = {
    icon: string
    title: string
    copy: string
}

const documentCards: DocumentCard[] = [
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

const subscriptionBullets: string[] = [
    'Cost of asset and associated fees',
    'The Bare Trust name which will hold the asset',
    'The syndicate being the sole beneficiary of the Bare Trust'
]

const activeDocumentTitle = computed(() => (
    props.currentStage === 'subscription' ? 'Subscription Agreement' : 'Terms and Conditions'
))

const activeDocumentUrl = computed(() => (
    props.currentStage === 'subscription'
        ? props.subscriptionAgreementUrl
        : props.termsAndConditionsUrl
))

const activeDocumentProxyUrl = computed(() => (
    activeDocumentUrl.value ? `/api/agreement-document?url=${encodeURIComponent(activeDocumentUrl.value)}` : ''
))

const activeDocumentEmbedUrl = computed(() => (
    activeDocumentProxyUrl.value ? `${activeDocumentProxyUrl.value}#toolbar=1&navpanes=0` : ''
))
</script>

<template>
    <div
        class="overflow-hidden rounded-xl border border-tccGold/20 bg-[#0b0a08] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
        <div class="border-b border-tccGold/20 bg-[#11100d] px-5 py-7 text-white sm:px-7">
            <h1 class="text-center font-poppins text-2xl font-black sm:text-3xl">
                Document Review and eSign
            </h1>
            <div class="mt-7 grid gap-4 md:grid-cols-3">
                <article v-for="card in documentCards" :key="card.title"
                    class="rounded-lg border border-white/10 bg-white/[0.05] p-5 text-center text-white transition-colors hover:border-tccGold/45">
                    <span
                        class="mx-auto grid h-12 w-12 place-items-center rounded-md bg-tccDeepBlack text-tccGold ring-1 ring-tccGold/30">
                        <i :class="card.icon" class="text-lg" aria-hidden="true" />
                    </span>
                    <h2 class="mt-4 font-poppins text-base font-black">{{ card.title }}</h2>
                    <p class="mt-3 text-sm leading-relaxed text-white/60">{{ card.copy }}</p>
                </article>
            </div>
        </div>

        <div class="space-y-5 p-4 sm:p-6">
            <section v-if="currentStage === 'subscription'"
                class="rounded-lg border border-tccGold/25 bg-white/[0.04] p-5 sm:p-6">
                <h2 class="font-poppins text-xl font-black">Subscription Agreement</h2>
                <p class="mt-4 text-sm leading-relaxed text-white/70">
                    The Subscription Agreement is the formal arrangement between the
                    <strong class="text-white">Syndicate members</strong> and the
                    <strong class="text-white">Bare Trust</strong> (the entity that holds the car).
                </p>
                <p class="mt-4 text-sm font-black text-white">
                    You will see clauses that cover in detail the:
                </p>
                <ul class="mt-4 space-y-3 text-sm text-white/70">
                    <li v-for="item in subscriptionBullets" :key="item" class="flex gap-3">
                        <i class="pi pi-check-circle mt-1 text-tccGold" aria-hidden="true" />
                        <span>{{ item }}</span>
                    </li>
                </ul>
                <div
                    class="mt-5 rounded-md border-l-4 border-tccGold bg-tccDeepBlack/80 px-4 py-3 text-sm text-white/70">
                    Please review, if you have any questions please get in touch with the team at
                    <strong class="text-white">{{ supportEmail }}</strong>.
                </div>
            </section>

            <section v-else class="rounded-lg border border-tccGold/25 bg-white/[0.04] p-5 sm:p-6">
                <h2 class="font-poppins text-xl font-black">Terms and Conditions</h2>
                <p class="mt-4 text-sm leading-relaxed text-white/70">
                    These terms set out the basis on which we, <strong class="text-white">TheCarCrowd Limited</strong>
                    (registered with company number <strong class="text-white">12286089</strong>), enable prospective
                    Members
                    to join Syndicates that are the sole beneficiaries of a Bare Trust (which owns the car) through our
                    Platform.
                </p>
                <div
                    class="mt-5 rounded-md border-l-4 border-tccGold bg-tccDeepBlack/80 px-4 py-3 text-sm text-white/70">
                    If anything is unclear, please reach out to
                    <strong class="text-white">{{ supportEmail }}</strong> and the team will happily help.
                </div>
            </section>

            <div class="rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                <div class="mx-auto grid max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                    <button type="button" class="group" @click="emit('show-subscription')">
                        <span
                            class="mx-auto grid h-11 w-11 place-items-center rounded-full border font-poppins text-base font-black transition-colors"
                            :class="activeDocumentIndex >= 1 ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/[0.04] text-white/40'">
                            1
                        </span>
                        <span class="mt-2 block text-[11px] font-black uppercase tracking-[0.12em] transition-colors"
                            :class="activeDocumentIndex >= 1 ? 'text-white' : 'text-white/40'">
                            Subscription Agreement
                        </span>
                    </button>
                    <div class="h-px w-20 bg-white/15" />
                    <button type="button" class="group" @click="emit('show-terms')">
                        <span
                            class="mx-auto grid h-11 w-11 place-items-center rounded-full border font-poppins text-base font-black transition-colors"
                            :class="activeDocumentIndex >= 2 ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/[0.04] text-white/40'">
                            2
                        </span>
                        <span class="mt-2 block text-[11px] font-black uppercase tracking-[0.12em] transition-colors"
                            :class="activeDocumentIndex >= 2 ? 'text-white' : 'text-white/40'">
                            Terms and Conditions
                        </span>
                    </button>
                </div>
            </div>

            <section class="overflow-hidden rounded-lg border border-white/10 bg-white">
                <div
                    class="flex flex-col gap-3 bg-tccDeepBlack px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex flex-wrap items-center gap-3">
                        <i class="pi pi-file-pdf text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-base font-black">
                            {{ activeDocumentTitle }}
                        </h2>
                        <span
                            class="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/75">
                            Document {{ activeDocumentIndex }} of 2
                        </span>
                    </div>
                    <a :href="activeDocumentProxyUrl || undefined" target="_blank" rel="noopener"
                        class="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold"
                        :class="!activeDocumentProxyUrl ? 'pointer-events-none opacity-50' : ''"
                        :aria-disabled="!activeDocumentProxyUrl">
                        <i class="pi pi-window-maximize text-xs" aria-hidden="true" />
                        Fullscreen
                    </a>
                </div>
                <div v-if="activeDocumentEmbedUrl" class="min-h-[520px] bg-white">
                    <iframe
                        :src="activeDocumentEmbedUrl"
                        :title="activeDocumentTitle"
                        class="block h-[72vh] min-h-[520px] w-full border-0 bg-white"
                    />
                </div>
                <div v-else class="grid min-h-[420px] place-items-center bg-gradient-to-b from-white to-slate-50 p-6">
                    <div
                        class="rounded-lg border border-slate-200 bg-white px-5 py-4 text-center shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                        <i class="pi pi-spin pi-spinner text-tccGold" aria-hidden="true" />
                        <span class="ml-2 text-sm font-black text-tccDarkNavy">Loading document...</span>
                    </div>
                </div>
            </section>

            <div class="border-t border-white/10 pt-5">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <button v-if="currentStage === 'terms'" type="button"
                        class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.16em] text-white transition-colors hover:border-tccGold hover:text-tccGold"
                        @click="emit('show-subscription')">
                        <i class="pi pi-arrow-left text-xs" aria-hidden="true" />
                        Subscription Agreement
                    </button>

                    <button v-if="currentStage === 'subscription'" type="button"
                        class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.16em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        @click="emit('show-terms')">
                        Click here to review the Terms and Conditions
                        <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                    </button>

                    <button v-else type="button"
                        class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.16em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        @click="emit('proceed-to-sign')">
                        <i class="pi pi-pencil text-xs" aria-hidden="true" />
                        Proceed To Sign Documents
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
