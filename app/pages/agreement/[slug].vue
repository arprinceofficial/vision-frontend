<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

type AgreementStage = 'overview' | 'subscription' | 'terms'

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

const activeTimelineIndex = computed(() => (currentStage.value === 'overview' ? 0 : 1))
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
        <section class="border-b border-white/10 bg-tccDeepBlack">
            <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                <nav
                    class="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    <NuxtLink to="/" class="transition-colors hover:text-tccGold">Home</NuxtLink>
                    <span>/</span>
                    <NuxtLink to="/syndicates/lamborghini-diablo-vt-roadster"
                        class="transition-colors hover:text-tccGold">Live Syndicates</NuxtLink>
                    <span>/</span>
                    <span class="text-tccGold">{{ agreement.reference }}</span>
                </nav>
            </div>
        </section>

        <section class="bg-tccDeepBlack py-8 sm:py-10">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    class="overflow-hidden rounded-xl border border-white/20 bg-[#11100d] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                    <div class="overflow-x-auto px-4 py-5 sm:px-6">
                        <ol class="relative grid min-w-[820px] grid-cols-6 gap-3">
                            <li v-for="(step, index) in timelineSteps" :key="step.key" class="relative">
                                <div v-if="index < timelineSteps.length - 1"
                                    class="absolute left-[calc(50%+1.3rem)] right-[calc(-50%+1.3rem)] top-5 h-px bg-white/10"
                                    :class="index < activeTimelineIndex ? 'bg-tccGold/70' : 'bg-white/10'" />
                                <button type="button"
                                    class="relative z-10 flex w-full flex-col items-center gap-2 text-center"
                                    :class="index <= 1 ? 'cursor-pointer' : 'cursor-default'"
                                    @click="index === 0 ? showOverview() : index === 1 ? showSubscription() : undefined">
                                    <span
                                        class="grid h-10 w-10 place-items-center rounded-full border text-sm transition-colors"
                                        :class="index < activeTimelineIndex
                                            ? 'border-tccGold bg-tccGold text-tccDarkNavy'
                                            : index === activeTimelineIndex
                                                ? 'border-tccGold bg-tccGold/15 text-tccGold shadow-[0_0_0_6px_rgba(247,198,0,0.08)]'
                                                : 'border-white/10 bg-white/[0.04] text-white/30'">
                                        <i :class="step.icon" aria-hidden="true" />
                                    </span>
                                    <span class="text-[10px] font-black uppercase tracking-[0.16em]"
                                        :class="index <= activeTimelineIndex ? 'text-white' : 'text-white/40'">
                                        {{ step.label }}
                                    </span>
                                </button>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-tccDeepBlack pb-14 sm:pb-16">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div class="mb-6 grid gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-3">
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Vehicle</span>
                        <strong class="mt-1 block text-sm text-white sm:text-base">{{ agreement.vehicle }}</strong>
                    </div>
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Allocation</span>
                        <strong class="mt-1 block text-sm text-white sm:text-base">{{ agreement.allocations }} slot / {{
                            totalInvestment }}</strong>
                    </div>
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Reference</span>
                        <strong class="mt-1 block text-sm text-tccGold sm:text-base">{{ agreement.reference }}</strong>
                    </div>
                </div>

                <Transition name="agreement-fade" mode="out-in">
                    <div v-if="currentStage === 'overview'" key="overview"
                        class="rounded-xl border border-tccGold/20 bg-[#0b0a08] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] sm:p-6 lg:p-7">
                        <div class="rounded-lg border border-white/10 bg-[#11100d] p-5 text-white sm:p-7 lg:p-8">
                            <div class="text-center">
                                <span
                                    class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-tccDeepBlack text-tccGold shadow-lg shadow-tccGold/10 ring-1 ring-tccGold/35">
                                    <i class="pi pi-shield text-2xl" aria-hidden="true" />
                                </span>
                                <h1 class="mt-4 font-poppins text-2xl font-black leading-tight sm:text-3xl">
                                    What happens next?
                                </h1>
                            </div>

                            <div class="mt-7 grid gap-4 lg:grid-cols-3">
                                <article v-for="card in overviewCards" :key="card.title"
                                    class="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-center shadow-sm transition-colors hover:border-tccGold/45">
                                    <span
                                        class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-tccDeepBlack text-tccGold ring-1 ring-tccGold/30">
                                        <i :class="card.icon" class="text-xl" aria-hidden="true" />
                                    </span>
                                    <h2 class="mt-4 font-poppins text-base font-black leading-tight sm:text-lg">
                                        {{ card.title }}
                                    </h2>
                                    <p class="mt-3 text-sm leading-relaxed text-white/65">{{ card.copy }}</p>
                                </article>
                            </div>

                            <div class="mt-7 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-list-check text-tccGold" aria-hidden="true" />
                                    <h2 class="font-poppins text-lg font-black">For your information</h2>
                                </div>
                                <div class="mt-4 space-y-3">
                                    <div
                                        class="flex gap-3 rounded-md border-l-4 border-tccGold bg-tccDeepBlack/80 p-4 text-sm leading-relaxed text-white/70">
                                        <i class="pi pi-user-check mt-1 text-tccGold" aria-hidden="true" />
                                        <p>
                                            We will carry out a Know Your Customer (KYC) check, please do not worry this
                                            <strong class="text-white">will not</strong> leave a footprint on any credit report and is to
                                            clarify identity only.
                                        </p>
                                    </div>
                                    <div
                                        class="flex gap-3 rounded-md border-l-4 border-tccGold bg-tccDeepBlack/80 p-4 text-sm leading-relaxed text-white/70">
                                        <i class="pi pi-wallet mt-1 text-tccGold" aria-hidden="true" />
                                        <p>
                                            Please make sure funds are transferred from a bank account with the same name
                                            and address you have used to register with us.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                class="mt-6 flex flex-col gap-4 rounded-lg border border-tccGold/40 bg-tccGold/10 p-4 sm:flex-row sm:items-center">
                                <span
                                    class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-tccDeepBlack text-tccGold">
                                    <i class="pi pi-headphones" aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 class="font-poppins text-base font-black">Need Help?</h2>
                                    <p class="mt-1 text-sm text-white/70">
                                        Please reach out to us at
                                        <a :href="`mailto:${agreement.supportEmail}`"
                                            class="font-black text-tccGold underline decoration-tccGold/70 underline-offset-4">
                                            {{ agreement.supportEmail }}
                                        </a>
                                        if you have any problems.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center">
                            <button type="button"
                                class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                                @click="showSubscription">
                                <i class="pi pi-check-circle text-xs" aria-hidden="true" />
                                Let&apos;s Get Started
                            </button>
                        </div>
                    </div>

                    <div v-else key="documents"
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
                                    <strong class="text-white">Syndicate members</strong> and the <strong class="text-white">Bare Trust</strong> (the entity
                                    that holds the car).
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
                                    <strong class="text-white">{{ agreement.supportEmail }}</strong>.
                                </div>
                            </section>

                            <section v-else class="rounded-lg border border-tccGold/25 bg-white/[0.04] p-5 sm:p-6">
                                <h2 class="font-poppins text-xl font-black">Terms and Conditions</h2>
                                <p class="mt-4 text-sm leading-relaxed text-white/70">
                                    These terms set out the basis on which we, <strong class="text-white">TheCarCrowd Limited</strong>
                                    (registered with company number <strong class="text-white">12286089</strong>), enable prospective Members
                                    to join Syndicates that are the sole beneficiaries of a Bare Trust (which owns the
                                    car) through our Platform.
                                </p>
                                <div
                                    class="mt-5 rounded-md border-l-4 border-tccGold bg-tccDeepBlack/80 px-4 py-3 text-sm text-white/70">
                                    If anything is unclear, please reach out to
                                    <strong class="text-white">{{ agreement.supportEmail }}</strong> and the team will happily help.
                                </div>
                            </section>

                            <div class="rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                                <div class="mx-auto grid max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                                    <button type="button" class="group" @click="showSubscription">
                                        <span
                                            class="mx-auto grid h-11 w-11 place-items-center rounded-full border font-poppins text-base font-black transition-colors"
                                            :class="activeDocumentIndex >= 1 ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/[0.04] text-white/40'">
                                            1
                                        </span>
                                        <span
                                            class="mt-2 block text-[11px] font-black uppercase tracking-[0.12em] transition-colors"
                                            :class="activeDocumentIndex >= 1 ? 'text-white' : 'text-white/40'">
                                            Subscription Agreement
                                        </span>
                                    </button>
                                    <div class="h-px w-20 bg-white/15" />
                                    <button type="button" class="group" @click="showTerms">
                                        <span
                                            class="mx-auto grid h-11 w-11 place-items-center rounded-full border font-poppins text-base font-black transition-colors"
                                            :class="activeDocumentIndex >= 2 ? 'border-tccGold bg-tccGold text-tccDarkNavy' : 'border-white/15 bg-white/[0.04] text-white/40'">
                                            2
                                        </span>
                                        <span
                                            class="mt-2 block text-[11px] font-black uppercase tracking-[0.12em] transition-colors"
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
                                            {{ currentStage === 'subscription' ? 'Subscription Agreement' : 'Terms and Conditions' }}
                                        </h2>
                                        <span
                                            class="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/75">
                                            Document {{ activeDocumentIndex }} of 2
                                        </span>
                                    </div>
                                    <button type="button"
                                        class="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                                        <i class="pi pi-window-maximize text-xs" aria-hidden="true" />
                                        Fullscreen
                                    </button>
                                </div>
                                <div
                                    class="grid min-h-[420px] place-items-center bg-gradient-to-b from-white to-slate-50 p-6">
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
                                        @click="showSubscription">
                                        <i class="pi pi-arrow-left text-xs" aria-hidden="true" />
                                        Subscription Agreement
                                    </button>

                                    <button v-if="currentStage === 'subscription'" type="button"
                                        class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.16em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                                        @click="showTerms">
                                        Click here to review the Terms and Conditions
                                        <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                                    </button>

                                    <button v-else type="button"
                                        class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.16em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold">
                                        <i class="pi pi-pencil text-xs" aria-hidden="true" />
                                        Proceed To Sign Documents
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </section>
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
