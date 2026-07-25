<script setup lang="ts">
type AgreementRecord = {
    supportEmail: string
}

defineProps<{
    agreement: AgreementRecord
}>()

const emit = defineEmits<{
    (event: 'continue'): void
}>()

const isAgreed = ref(false)

const resolutions = [
    'TheCarCrowd (Trustee) will appoint a Vehicle Operations Manager to manage the asset as per Schedule 1 in the Subscription agreement.',
    'TheCarCrowd will support and execute all marketing and sales activities.',
    'Legal Alternative are appointed as the independent auditor and administrator of the Trust.'
]

const votingSteps = [
    {
        title: 'Review Resolutions',
        copy: 'Read all 3 syndicate resolutions'
    },
    {
        title: 'Confirm Agreement',
        copy: 'Check the agreement box'
    },
    {
        title: 'Submit Vote and Continue',
        copy: 'Proceed to complete allocation'
    }
]
</script>

<template>
    <div class="space-y-6">
        <div class="text-center">
            <span class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-[0_0_36px_rgba(247,198,0,0.12)]">
                <i class="pi pi-users text-2xl" aria-hidden="true" />
            </span>
            <h1 class="mt-4 font-poppins text-2xl font-black leading-tight text-white sm:text-3xl">
                Syndicate Member Vote
            </h1>
            <p class="mt-2 text-sm text-white/55">
                Nearly there. Just a few more steps to complete your allocation
            </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <section class="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_18px_70px_rgba(0,0,0,0.24)]">
                <div class="border-b border-tccGold/20 bg-[#11100d] px-5 py-8 text-center sm:px-8">
                    <span class="mx-auto grid h-14 w-14 place-items-center rounded-full border border-tccGold/35 bg-tccGold/10 text-tccGold">
                        <i class="pi pi-clipboard text-2xl" aria-hidden="true" />
                    </span>
                    <h2 class="mt-4 font-poppins text-xl font-black text-white sm:text-2xl">
                        Your Vote is Required
                    </h2>
                    <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                        As a syndicate member you have responsibility to vote on the day to day operational topics for the asset.
                        Please see the first 3 resolutions to be voted on, we will execute each resolution based on the majority decision.
                    </p>
                </div>

                <div class="space-y-5 p-5 sm:p-6">
                    <div>
                        <div class="flex items-center gap-3">
                            <i class="pi pi-list-check text-tccGold" aria-hidden="true" />
                            <h2 class="font-poppins text-lg font-black text-white">Resolutions</h2>
                        </div>

                        <div class="mt-4 space-y-3">
                            <div
                                v-for="(resolution, index) in resolutions"
                                :key="resolution"
                                class="flex gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 p-4 text-sm leading-relaxed text-white/75"
                            >
                                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tccGold font-black text-tccDarkNavy">
                                    {{ index + 1 }}
                                </span>
                                <p>{{ resolution }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-4 rounded-xl border border-tccGold/35 bg-tccGold/10 p-5">
                        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-tccGold text-tccDarkNavy">
                            <i class="pi pi-exclamation-circle" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 class="font-poppins text-sm font-black text-white">Important Notice</h3>
                            <p class="mt-1 text-sm leading-relaxed text-white/70">
                                If you <strong class="text-white">DO NOT</strong> agree with these resolutions, please email us at
                                <a :href="`mailto:${agreement.supportEmail}`" class="font-black text-tccGold hover:text-tccLightGold">
                                    {{ agreement.supportEmail }}
                                </a>
                                before proceeding.
                            </p>
                        </div>
                    </div>

                    <label class="flex cursor-pointer gap-4 rounded-xl border border-white/10 bg-tccDeepBlack/70 p-5 transition-colors hover:border-tccGold/40">
                        <input
                            v-model="isAgreed"
                            type="checkbox"
                            class="mt-1 h-5 w-5 shrink-0 rounded border-white/25 bg-transparent text-tccGold focus:ring-tccGold"
                        />
                        <span>
                            <strong class="block text-sm font-black text-white sm:text-base">
                                I vote in agreement for all the above resolutions
                            </strong>
                            <span class="mt-1 block text-sm text-white/55">
                                and understand my responsibilities as a Syndicate member.
                            </span>
                        </span>
                    </label>

                    <button
                        type="button"
                        class="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-poppins text-xs font-black uppercase tracking-[0.14em] transition-colors"
                        :class="isAgreed
                            ? 'bg-tccGold text-tccDarkNavy shadow-lg shadow-tccGold/20 hover:bg-tccLightGold'
                            : 'cursor-not-allowed bg-white/10 text-white/35'"
                        :disabled="!isAgreed"
                        @click="emit('continue')"
                    >
                        <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                        Continue
                    </button>
                </div>
            </section>

            <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <section class="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 class="font-poppins text-lg font-black text-white">Voting Process</h2>
                    <div class="mt-4 space-y-3">
                        <div
                            v-for="(step, index) in votingSteps"
                            :key="step.title"
                            class="flex gap-3 rounded-lg border border-white/10 bg-tccDeepBlack/70 p-3"
                        >
                            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tccGold text-sm font-black text-tccDarkNavy">
                                {{ index + 1 }}
                            </span>
                            <div>
                                <h3 class="text-sm font-black text-white">{{ step.title }}</h3>
                                <p class="text-xs text-white/50">{{ step.copy }}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
                    <div class="flex gap-3">
                        <i class="pi pi-headphones mt-1 text-tccGold" aria-hidden="true" />
                        <div>
                            <p>Need Assistance?</p>
                            <a :href="`mailto:${agreement.supportEmail}`" class="font-black text-tccGold hover:text-tccLightGold">
                                {{ agreement.supportEmail }}
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>
