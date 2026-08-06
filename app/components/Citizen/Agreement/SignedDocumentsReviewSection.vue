<script setup lang="ts">
type AgreementRecord = {
    vehicle: string
    allocations: number
    reference: string
    supportEmail: string
}

defineProps<{
    agreement: AgreementRecord
}>()

const emit = defineEmits<{
    (event: 'proceed-to-vote'): void
}>()

const signedDate = '24/07/2026 16:48'

const signedDocuments = [
    {
        title: 'Signed Subscription Agreement',
        badge: 'Document 1 of 2',
        pages: '13 pages',
        clauses: [
            'Each Member shall have a weighted voting right which is determined by the proportion their Subscription makes up of the Target Amount.',
            'Decisions shall be passed on the basis of a simple majority of the weighted votes on a For or Against proposal.',
            'Where there are multiple options available, all options will be stated to the Members.'
        ]
    },
    {
        title: 'Signed Terms & Conditions',
        badge: 'Document 2 of 2',
        pages: '10 pages',
        clauses: [
            'Vision148',
            'PLATFORM TERMS AND CONDITIONS',
            'These terms set out the basis on which TheCarCrowd Limited enables prospective members to make vehicle-related subscriptions.'
        ]
    }
]
</script>

<template>
    <div class="space-y-6">
        <div class="text-center">
            <span
                class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-[0_0_36px_rgba(247,198,0,0.12)]">
                <i class="pi pi-file-edit text-2xl" aria-hidden="true" />
            </span>
            <h1 class="mt-4 font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
                Document Review
            </h1>
            <p class="mt-2 text-sm text-white/55">
                Final review of your signed investment documents
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div class="space-y-6">
                <section
                    class="rounded-xl border border-tccGold/35 bg-tccGold/10 p-5 text-center shadow-[0_18px_70px_rgba(0,0,0,0.22)] sm:p-6">
                    <h2 class="font-poppins text-xl font-black text-white">Documents Signed and Emailed</h2>
                    <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                        Your signed Subscription Agreement and Terms and Conditions have been emailed to you.
                        Signed by Nayab Navib Navib on {{ signedDate }}.
                    </p>
                </section>

                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-chart-line text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-lg font-black text-white">Investment Summary</h2>
                    </div>

                    <div class="mt-4 grid gap-3 sm:grid-cols-2">
                        <div class="rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span
                                class="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">Vehicle:</span>
                            <strong class="mt-1 block text-sm text-white">{{ agreement.vehicle }}</strong>
                        </div>
                        <div class="rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span class="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">Number of
                                Allocations:</span>
                            <strong class="mt-1 block text-sm text-white">{{ agreement.allocations }}</strong>
                        </div>
                        <div class="rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span class="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">Signed
                                Date:</span>
                            <strong class="mt-1 block text-sm text-white">{{ signedDate }}</strong>
                        </div>
                        <div class="rounded-lg border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
                            <span
                                class="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">Reference:</span>
                            <strong class="mt-1 block text-sm text-tccGold">{{ agreement.reference }}</strong>
                        </div>
                    </div>
                </section>

                <section class="space-y-4">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-file-pdf text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-lg font-black text-white">Signed Documents</h2>
                    </div>

                    <article v-for="document in signedDocuments" :key="document.title"
                        class="overflow-hidden rounded-xl border border-white/10 bg-[#0b0a08] text-white shadow-[0_18px_70px_rgba(0,0,0,0.22)]">
                        <div
                            class="flex flex-col gap-3 bg-tccDeepBlack px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex flex-wrap items-center gap-3">
                                <i class="pi pi-file-pdf text-tccGold" aria-hidden="true" />
                                <h3 class="font-poppins text-sm font-black sm:text-base">{{ document.title }}</h3>
                                <span
                                    class="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/75">
                                    {{ document.badge }}
                                </span>
                            </div>
                            <button type="button"
                                class="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                                <i class="pi pi-window-maximize text-xs" aria-hidden="true" />
                                Fullscreen
                            </button>
                        </div>

                        <div class="pdf-viewer-toolbar border-b px-3 py-2 text-xs">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-bars" aria-hidden="true" />
                                    <i class="pi pi-search" aria-hidden="true" />
                                    <span class="rounded border border-white/20 px-2 py-1 text-white">{{ document.pages
                                        }}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-minus" aria-hidden="true" />
                                    <i class="pi pi-plus" aria-hidden="true" />
                                    <i class="pi pi-download" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div class="pdf-viewer-surface max-h-[32rem] overflow-auto p-4 sm:p-6">
                            <div class="pdf-preview-page mx-auto min-h-[28rem] max-w-2xl p-6 sm:p-10">
                                <div class="border-t border-[#b8c0cc] pt-7">
                                    <p class="pdf-preview-kicker text-[11px] font-black uppercase tracking-[0.18em]">
                                        Dummy PDF Preview
                                    </p>
                                    <h4 class="pdf-preview-title mt-5 font-poppins text-xl font-black">{{ document.title
                                        }}</h4>
                                    <div class="pdf-preview-copy mt-6 space-y-4 text-sm leading-relaxed">
                                        <p v-for="clause in document.clauses" :key="clause">
                                            {{ clause }}
                                        </p>
                                    </div>
                                    <div class="pdf-preview-signature mt-10 rounded border border-dashed p-4">
                                        <span
                                            class="pdf-preview-kicker text-xs font-semibold uppercase tracking-[0.16em]">
                                            Signed electronically
                                        </span>
                                        <div
                                            class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <strong class="pdf-preview-title">Nayab Navib Navib</strong>
                                            <span class="pdf-preview-muted text-sm">{{ signedDate }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>
            </div>

            <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-clipboard-check text-tccGold" aria-hidden="true" />
                        <h2 class="font-poppins text-lg font-black text-white">Next Steps</h2>
                    </div>

                    <button type="button"
                        class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tccGold px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        @click="emit('proceed-to-vote')">
                        <i class="pi pi-check text-xs" aria-hidden="true" />
                        Proceed to Vote
                    </button>
                </section>

                <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
                    <div class="flex gap-3">
                        <i class="pi pi-headphones mt-1 text-tccGold" aria-hidden="true" />
                        <div>
                            <p>Need Assistance?</p>
                            <a :href="`mailto:${agreement.supportEmail}`"
                                class="font-black text-tccGold hover:text-tccLightGold">
                                {{ agreement.supportEmail }}
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<style scoped>
.pdf-viewer-toolbar {
    border-color: rgba(255, 255, 255, 0.18);
    background: #2f2f2f;
    color: rgba(255, 255, 255, 0.82);
}

.pdf-viewer-surface {
    background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 18rem),
        #4a4a4a;
}

.pdf-preview-page {
    color-scheme: light;
    background-color: #fffdf8 !important;
    color: #14110b !important;
    box-shadow: 0 20px 44px rgba(0, 0, 0, 0.28);
}

.pdf-preview-title {
    color: #14110b !important;
}

.pdf-preview-copy {
    color: #334155 !important;
}

.pdf-preview-kicker {
    color: #7b8794 !important;
}

.pdf-preview-muted {
    color: #64748b !important;
}

.pdf-preview-signature {
    border-color: #b8c0cc !important;
    background-color: #ffffff !important;
}
</style>
