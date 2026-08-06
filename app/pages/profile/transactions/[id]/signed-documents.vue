<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

const route = useRoute()
const { getTransactionById } = useProfileDashboard()

const transaction = computed(() => getTransactionById(String(route.params.id || '')))

useHead(() => ({
  title: `${transaction.value.referenceId} Signed Documents | Vision148`
}))

const signedDocuments = [
  {
    title: 'Signed Subscription Agreement',
    badge: 'Document 1 of 2',
    pages: '13 pages',
    clauses: [
      'Each Member shall have a weighted voting right which is determined by the proportion their Subscription makes up of the Target Amount.',
      'Decisions shall be passed on the basis of a simple majority of weighted votes on a For or Against proposal.',
      'Where there are multiple options available, all options will be stated to the Members before voting.'
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
  <section class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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
            Signed by Nayab Navib Navib on {{ transaction.signedDate }}.
          </p>
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-white">
          <div class="flex items-center gap-3">
            <i class="pi pi-chart-line text-tccGold" aria-hidden="true" />
            <h2 class="font-poppins text-lg font-black">Investment Summary</h2>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
              <span class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Vehicle</span>
              <strong class="mt-1 block text-[13px] text-white">{{ transaction.vehicle }}</strong>
            </div>
            <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
              <span class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Number of
                Allocations</span>
              <strong class="mt-1 block text-[13px] text-white">{{ transaction.allocations }}</strong>
            </div>
            <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
              <span class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Signed Date</span>
              <strong class="mt-1 block text-[13px] text-white">{{ transaction.signedDate }}</strong>
            </div>
            <div class="rounded-xl border border-white/10 bg-tccDeepBlack/70 px-4 py-3">
              <span class="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Reference</span>
              <strong class="mt-1 block font-mono text-[13px] text-tccGold">{{ transaction.referenceId }}</strong>
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
                <button type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:border-tccGold hover:text-tccGold">
                  <i class="pi pi-window-maximize text-xs" aria-hidden="true" />
                  Fullscreen
                </button>
                <button type="button"
                  class="inline-flex items-center justify-center gap-2 rounded-lg border border-tccGold/35 bg-tccGold/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy">
                  <i class="pi pi-download text-xs" aria-hidden="true" />
                  Download
                </button>
              </div>
            </header>

            <div class="pdf-viewer-toolbar border-b px-3 py-2 text-[11px]">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <i class="pi pi-bars" aria-hidden="true" />
                  <i class="pi pi-search" aria-hidden="true" />
                  <span class="rounded border border-white/20 px-2 py-1 text-white">{{ document.pages }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <i class="pi pi-minus" aria-hidden="true" />
                  <i class="pi pi-plus" aria-hidden="true" />
                  <i class="pi pi-download" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div class="pdf-viewer-surface max-h-[32rem] overflow-auto p-4 sm:p-5">
              <div class="pdf-preview-page mx-auto min-h-[28rem] max-w-2xl p-6 sm:p-8">
                <div class="border-t border-[#c6ccd6] pt-8">
                  <p class="pdf-preview-kicker text-[11px] font-black uppercase tracking-[0.18em]">Dummy PDF Preview</p>
                  <h4 class="pdf-preview-title mt-5 font-poppins text-lg font-black">{{ document.title }}</h4>
                  <div class="pdf-preview-copy mt-6 space-y-4 text-[13px] leading-relaxed">
                    <p v-for="clause in document.clauses" :key="clause">{{ clause }}</p>
                  </div>
                  <div class="pdf-preview-signature mt-12 rounded border border-dashed p-4">
                    <span class="pdf-preview-kicker text-xs font-semibold uppercase tracking-[0.16em]">Signed
                      electronically</span>
                    <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <strong class="pdf-preview-title">Nayab Navib Navib</strong>
                      <span class="pdf-preview-muted text-[13px]">{{ transaction.signedDate }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>

      <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <NuxtLink :to="`/profile/transactions/${transaction.id}/payment-details`"
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
            <div v-for="item in [
              { icon: 'pi-check-circle', title: 'Documents Signed', copy: 'All documents have been signed' },
              { icon: 'pi-eye', title: 'Review Anytime', copy: 'View your documents whenever needed' },
              { icon: 'pi-download', title: 'Download Copies', copy: 'Save PDFs for your records' }
            ]" :key="item.title" class="flex gap-3 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-4">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tccGold/10 text-tccGold">
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
              <a :href="`mailto:${transaction.supportEmail}`" class="font-black text-tccGold hover:text-tccLightGold">
                {{ transaction.supportEmail }}
              </a>
            </div>
          </div>
        </div>

        <NuxtLink :to="`/profile/transactions/${transaction.id}`"
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
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 18rem),
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
