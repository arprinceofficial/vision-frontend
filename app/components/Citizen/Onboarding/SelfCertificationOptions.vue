<script setup lang="ts">
const emit = defineEmits<{
    (event: 'select', id: string): void
}>()

const certificationContent = {
    title: 'Self Certification',
    instruction: 'Please select one of the options below:',
    options: [
        {
            id: 'high_net_worth',
            letter: 'A',
            title: 'High Net Worth Investor',
            description: 'You believe you are a High Net Worth investor because at least one of the below statements is most applicable to you',
            statements: [
                'You have an annual income of £100,000 or more',
                'You have net assets of £250,000 or more (Net assets do NOT include: your primary residence, your pension or any pension withdrawals)'
            ]
        },
        {
            id: 'sophisticated',
            letter: 'B',
            title: 'Self Certified Sophisticated Investor',
            description: 'You believe you are a Sophisticated Investor because at least one of the below statements is most applicable to you',
            statements: [
                'You have worked in Private Equity or in the provision of financial service for SMEs',
                'You have been the director of a company with an annual turnover of at least £1 million',
                'Made two or more investments into unlisted companies in the last two years.',
                'Been a member of a network or syndicate of business angels for more than 6 months'
            ]
        },
        {
            id: 'ordinary',
            letter: 'C',
            title: 'Ordinary Investor',
            description: 'If the above statements do not apply to you or you are not sure which option best suits you please get in touch with the team.',
            statements: []
        }
    ]
}
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-5xl">
            <div class="space-y-7">
                <div class="restomod-panel rounded-[2rem] p-6 sm:p-8">
                    <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{
                        certificationContent.title }}</h1>
                </div>

                <div class="restomod-panel rounded-[1.5rem] border-l-4 border-l-tccGold p-5">
                    <p class="text-sm font-semibold leading-relaxed text-white/80">{{ certificationContent.instruction
                        }}</p>
                </div>

                <div class="space-y-6">
                    <button v-for="option in certificationContent.options" :key="option.id" type="button"
                        class="group w-full rounded-[1.25rem] border border-tccBorder bg-white/5 p-5 text-left shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-tccGold/55 hover:bg-tccGold/10"
                        @click="emit('select', option.id)">
                        <div class="flex items-start gap-4">
                            <span
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-tccNavy font-poppins text-sm font-bold text-white transition-colors group-hover:bg-tccGold group-hover:text-tccDarkNavy">
                                {{ option.letter }}
                            </span>
                            <div class="min-w-0 flex-grow">
                                <h2
                                    class="font-poppins text-base font-bold text-white transition-colors group-hover:text-tccGold">
                                    {{ option.title }}</h2>
                                <p class="mt-1 text-sm leading-snug text-white/75">{{ option.description }}</p>

                                <div v-if="option.statements.length" class="mt-3 space-y-2">
                                    <div v-for="(statement, index) in option.statements" :key="statement"
                                        class="flex items-start gap-3 text-sm leading-relaxed text-white/65">
                                        <span
                                            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-tccGold/40 bg-white/5 font-poppins text-[11px] font-bold text-tccGold">
                                            {{ index + 1 }}
                                        </span>
                                        <span>{{ statement }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
