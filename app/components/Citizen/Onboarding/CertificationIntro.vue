<script setup lang="ts">
const emit = defineEmits<{
    (event: 'proceed'): void
}>()

const nextSteps = [
    {
        title: 'Self Certification',
        icon: 'pi-id-card',
        description: 'We are only able to offer our syndicates to qualified investors. You just need to self certify as either High Net worth or Sophisticated.'
    },
    {
        title: 'QUICK TEST',
        icon: 'pi-list-check',
        description: 'You will then need to complete a short multiple choice test. All information can be found in our Key Facts sheet.'
    }
]
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-3xl">
            <div class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                <div class="space-y-2 border-b border-tccBorder pb-6">
                    <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">Nearly There</h1>
                    <p class="max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                        To Complete Registration We Just Need You To Complete The Below Steps
                    </p>
                </div>

                <div class="space-y-7">
                    <article v-for="step in nextSteps" :key="step.title" class="flex gap-4">
                        <div
                            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-tccGold/35 bg-tccGold/10 text-tccGold shadow-lg shadow-black/20">
                            <i class="pi text-lg" :class="step.icon" aria-hidden="true" />
                        </div>
                        <div class="min-w-0 space-y-2">
                            <h2 class="font-poppins text-lg font-black leading-tight text-white">{{ step.title }}</h2>
                            <p class="text-sm leading-relaxed text-white/65 sm:text-base">{{ step.description }}</p>
                        </div>
                    </article>
                </div>

                <p class="border-t border-tccBorder pt-6 text-sm leading-relaxed text-white/70">
                    Thank you for joining us and if you require any further details please do contact the team at
                    <a href="mailto:support@thecarcrowd.co.uk"
                        class="font-bold text-tccGold transition-colors hover:text-tccLightGold">support@thecarcrowd.co.uk</a>
                </p>

                <div class="flex justify-center">
                    <button type="button"
                        class="inline-flex items-center justify-center gap-3 rounded-full bg-tccGold px-8 py-3.5 font-poppins text-xs font-bold uppercase tracking-[0.14em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
                        @click="emit('proceed')">
                        Let's Proceed
                        <i class="pi pi-arrow-right text-xs" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
