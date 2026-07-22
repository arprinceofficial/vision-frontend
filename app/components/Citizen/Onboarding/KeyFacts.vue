<script setup lang="ts">
const emit = defineEmits<{
    (event: 'continue'): void
}>()

const keyFacts = [
    {
        title: 'What Is A Syndicated Trust Structure?',
        body: 'A syndicated trust refers to a financial arrangement where assets are held by a trustee on behalf of a beneficiary without the trustee having any discretionary powers. The beneficiary is the true owner, and the trustee merely holds the asset in their name until it can be transferred to the beneficiary. The trust ensures that the syndicate members (or beneficiaries) retain ownership, while the trustee is responsible for managing the asset until it’s transferred to the rightful owners.'
    },
    {
        title: 'Are Syndicates Regulated?',
        body: 'Taking a stake within a private syndicate is not a regulated activity in the UK and as such TheCarCrowd are not regulated by the Financial Conduct Authority. We follow all UK crowdfunding regulations and appoint independent administrators to provide additional piece of mind. Values of assets can go down as well as up and your capital is at risk.'
    },
    {
        title: 'Who Owns The Asset?',
        body: 'In a Bare Trust syndicate, the beneficiaries are the true owners of the asset, even though the asset is held in the name of the trustee. The trustee holds the asset purely on behalf of the beneficiaries, without having any discretionary power over it. The beneficiaries retain full beneficial ownership, and the trustee is simply a legal custodian until the asset is formally transferred.'
    },
    {
        title: 'What Are The Fees?',
        body: 'Syndicate members will pay a fixed curation fee to cover the sourcing, provenance checking, valuation and transport of the vehicle as well as any margin, which is included within the syndicate total and will not be charged as any additional fee on top. Furthermore, an operations fee to cover insurance and storage for the first year will also be applied upon membership purchase. Upon funding, all members must subscribe to a GoCardless annual subscription to cover the ongoing operations fee if they vote to retain the asset after the first year.'
    },
    {
        title: 'How Does The Selling Process Work/How Can I Exit?',
        body: 'You should assume that it will not be possible to exit your investment until another member takes ownership of your share within the syndicate. The asset will be periodically revalued. As a syndicate member you are expected to vote on whether to retain or realise the asset. Once sold, any profit will be distributed among the members. In order for the vote decision to be legitimate, a minimum of 15% of the shareholders must vote. A 50.1% is required to start the process.'
    },
    {
        title: 'Independent Oversight',
        body: 'The Trust appoints Legal Alternative as an independent body to provide oversight on the management of the Trust. Legal Alternative will review all transactions and be a second signatory for any debits or credits on the Trust Bank account acting independently to TheCarCrowd and in the interests of the Syndicate members.'
    }
]
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-4xl">
            <div class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                <div class="border-b border-tccBorder pb-5">
                    <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">Key Facts</h1>
                </div>

                <div class="space-y-5">
                    <article v-for="(fact, index) in keyFacts" :key="fact.title"
                        class="flex gap-4 rounded-[1.25rem] border border-tccBorder bg-white/5 p-5">
                        <span
                            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-tccGold/40 bg-white/5 font-poppins text-[11px] font-bold text-tccGold">
                            {{ index + 1 }}
                        </span>
                        <div class="min-w-0">
                            <h2 class="font-poppins text-sm font-black text-white">{{ fact.title }}</h2>
                            <p class="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">{{ fact.body }}</p>
                        </div>
                    </article>
                </div>

                <div class="flex justify-center border-t border-tccBorder pt-6">
                    <button type="button"
                        class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-10 py-3.5 font-poppins text-xs font-bold uppercase tracking-[0.12em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        @click="emit('continue')">
                        Continue
                        <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
