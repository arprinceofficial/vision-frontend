<script setup lang="ts">
defineProps<{
    supportEmail: string
}>()

const emit = defineEmits<{
    (event: 'get-started'): void
}>()

type OverviewCard = {
    icon: string
    title: string
    copy: string
}

const cards: OverviewCard[] = [
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
</script>

<template>
    <div
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
                <article v-for="card in cards" :key="card.title"
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
                            <strong class="text-white">will not</strong> leave a footprint on any credit report and is
                            to clarify identity only.
                        </p>
                    </div>
                    <div
                        class="flex gap-3 rounded-md border-l-4 border-tccGold bg-tccDeepBlack/80 p-4 text-sm leading-relaxed text-white/70">
                        <i class="pi pi-wallet mt-1 text-tccGold" aria-hidden="true" />
                        <p>
                            Please make sure funds are transferred from a bank account with the same name and address
                            you have used to register with us.
                        </p>
                    </div>
                </div>
            </div>

            <div
                class="mt-6 flex flex-col gap-4 rounded-lg border border-tccGold/40 bg-tccGold/10 p-4 sm:flex-row sm:items-center">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-tccDeepBlack text-tccGold">
                    <i class="pi pi-headphones" aria-hidden="true" />
                </span>
                <div>
                    <h2 class="font-poppins text-base font-black">Need Help?</h2>
                    <p class="mt-1 text-sm text-white/70">
                        Please reach out to us at
                        <a :href="`mailto:${supportEmail}`"
                            class="font-black text-tccGold underline decoration-tccGold/70 underline-offset-4">
                            {{ supportEmail }}
                        </a>
                        if you have any problems.
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center">
            <button type="button"
                class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-6 py-3 font-poppins text-[11px] font-black uppercase tracking-[0.18em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
                @click="emit('get-started')">
                <i class="pi pi-check-circle text-xs" aria-hidden="true" />
                Let&apos;s Get Started
            </button>
        </div>
    </div>
</template>
