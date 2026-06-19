<script setup lang="ts">
const { citizen_user } = citizenAuth()

const props = defineProps<{
    id?: number
    endDate?: string
    currentHighestBid?: string
    startingPrice?: string
    bidIncrement?: string
    timeRemaining?: string
    popcornThresholdMinutes?: string
}>()

const router = useRouter()

const nowTimestamp = ref(Date.now())
const mountTimestamp = ref(Date.now())
const liveCurrentBid = ref(0)
const selectedAmount = ref(0)
const isConfirmModalOpen = ref(false)
const isSubmittingBid = ref(false)
const response_modal = ref({})
const successfulBidAt = ref<number | null>(null)

let timerInterval: ReturnType<typeof setInterval> | null = null

const parseAmount = (value?: string) => {
    if (!value) return 0
    const numeric = Number(String(value).replace(/,/g, '').trim())
    return Number.isNaN(numeric) ? 0 : numeric
}

const parseTimestamp = (value?: string) => {
    if (!value) return null
    const timestamp = new Date(value).getTime()
    return Number.isNaN(timestamp) ? null : timestamp
}

const parseTimeRemainingSeconds = (value?: string) => {
    if (!value) return null
    const trimmed = String(value).trim()
    if (!trimmed) return null

    if (/^\d+$/.test(trimmed)) {
        return Number(trimmed)
    }

    const parts = trimmed.split(':').map((part) => Number(part))
    if (parts.some((part) => Number.isNaN(part))) {
        return null
    }

    if (parts.length === 3) {
        const [hours = 0, minutes = 0, seconds = 0] = parts
        return Math.max(0, hours * 3600 + minutes * 60 + seconds)
    }

    if (parts.length === 4) {
        const [days = 0, hours = 0, minutes = 0, seconds = 0] = parts
        return Math.max(0, days * 86400 + hours * 3600 + minutes * 60 + seconds)
    }

    return null
}

const parseMinutesToSeconds = (value?: string) => {
    const minutes = parseAmount(value)
    return minutes > 0 ? Math.round(minutes * 60) : 60
}

const currentHighestBidValue = computed(() => liveCurrentBid.value)
const standardIncrementValue = computed(() => {
    const amount = parseAmount(props.startingPrice)
    return amount > 0 ? amount : 0
})
const displayedStandardIncrementValue = computed(() => {
    const amount = parseAmount(props.bidIncrement)
    return amount > 0 ? amount : 0
})
const perStepIncrementValue = computed(() => {
    const amount = parseAmount(props.bidIncrement)
    return amount > 0 ? amount : standardIncrementValue.value
})

const endTimestamp = computed(() => parseTimestamp(props.endDate))

const fallbackRemainingSeconds = computed(() => {
    if (endTimestamp.value === null) return null
    return Math.max(0, Math.floor((endTimestamp.value - nowTimestamp.value) / 1000))
})

const remainingSeconds = computed(() => {
    const fromApi = parseTimeRemainingSeconds(props.timeRemaining)
    if (fromApi !== null) {
        const elapsedSeconds = Math.floor((nowTimestamp.value - mountTimestamp.value) / 1000)
        return Math.max(0, fromApi - elapsedSeconds)
    }

    return fallbackRemainingSeconds.value ?? 0
})

const countdown = computed(() => {
    const totalSeconds = Math.max(0, remainingSeconds.value)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    }
})

const bidSteps = computed(() => {
    const step = perStepIncrementValue.value
    if (step <= 0 || selectedAmount.value <= step) return 1
    return Math.floor((selectedAmount.value - step) / step) + 1
})

const isCooldownActive = computed(() => {
    if (successfulBidAt.value === null) return false
    return nowTimestamp.value < successfulBidAt.value + parseMinutesToSeconds(props.popcornThresholdMinutes) * 1000
})

const cooldownSecondsLeft = computed(() => {
    if (!isCooldownActive.value || successfulBidAt.value === null) return 0
    return Math.ceil((successfulBidAt.value + parseMinutesToSeconds(props.popcornThresholdMinutes) * 1000 - nowTimestamp.value) / 1000)
})

const isBidWindowClosed = computed(() => remainingSeconds.value <= 0)

const canPlaceBid = computed(() => {
    return !isSubmittingBid.value && !isCooldownActive.value && !isBidWindowClosed.value
})

const computedBidAmount = computed(() => {
    const baseBid = currentHighestBidValue.value > 0
        ? currentHighestBidValue.value
        : standardIncrementValue.value

    return baseBid + selectedAmount.value
})

const displayedCurrentBidValue = computed(() => {
    if (currentHighestBidValue.value > 0) {
        return currentHighestBidValue.value
    }

    return standardIncrementValue.value
})

const formattedCurrentBid = computed(() => {
    return displayedCurrentBidValue.value.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
})

const formattedStandardIncrement = computed(() => {
    return displayedStandardIncrementValue.value.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
})

const formattedSelectedAmount = computed(() => {
    return computedBidAmount.value.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
})

const handleIncrement = () => {
    selectedAmount.value += perStepIncrementValue.value
}

const handleDecrement = () => {
    selectedAmount.value = Math.max(
        perStepIncrementValue.value,
        selectedAmount.value - perStepIncrementValue.value
    )
}

const showBidError = (message: string) => {
    response_modal.value = {
        status: false,
        message,
    }
}

const openPlaceBid = async () => {
    if (!citizen_user.value) {
        await router.push('/signin')
        return
    }

    if (!canPlaceBid.value) {
        return
    }

    isConfirmModalOpen.value = true
}

const submitBid = async () => {
    if (!props.id) {
        showBidError('Auction is unavailable right now.')
        return
    }

    isSubmittingBid.value = true

    try {
        const response: any = await $fetchCitizen(`v1/customer/auctions/${props.id}/bid`, {
            method: 'POST',
            body: {
                amount: computedBidAmount.value,
            },
        })

        if (response?.status) {
            successfulBidAt.value = Date.now()
            liveCurrentBid.value = parseAmount(response?.data?.amount) || selectedAmount.value
            selectedAmount.value = perStepIncrementValue.value
            isConfirmModalOpen.value = false
        } else {
            showBidError(response?.message || 'Failed to place bid. Please try again.')
        }
    } catch (error: any) {
        showBidError(error?.data?.message || error?.response?._data?.message || error?.message || 'Failed to place bid. Please try again.')
    } finally {
        isSubmittingBid.value = false
    }
}

onMounted(() => {
    nowTimestamp.value = Date.now()
    mountTimestamp.value = Date.now()

    // Restore cooldown from last bid if it exists and is still active
    if (citizen_user.value?.data?.last_bidding_at) {
        const lastBidTimestamp = parseTimestamp(citizen_user.value.data.last_bidding_at)
        if (lastBidTimestamp !== null) {
            const cooldownDurationMs = parseMinutesToSeconds(props.popcornThresholdMinutes) * 1000
            const cooldownEndTime = lastBidTimestamp + cooldownDurationMs

            // Only restore if cooldown is still active
            if (nowTimestamp.value < cooldownEndTime) {
                successfulBidAt.value = lastBidTimestamp
            }
        }
    }

    timerInterval = setInterval(() => {
        nowTimestamp.value = Date.now()
    }, 1000)
})

onBeforeUnmount(() => {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
})

watch(
    perStepIncrementValue,
    (value) => {
        selectedAmount.value = value > 0 ? value : 0
    },
    { immediate: true }
)

watch(
    () => props.currentHighestBid,
    (value) => {
        liveCurrentBid.value = parseAmount(value)
    },
    { immediate: true }
)
</script>

<template>
    <!-- <pre>{{ citizen_user }}</pre> -->
    <article class="relative w-full max-w-[1400px] mx-auto px-4 py-16 lg:py-24">

        <div class="w-full rounded-[16px] bg-black/10 backdrop-blur-[20px] p-4 md:p-8 lg:p-12">

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                <div
                    class="relative flex flex-col items-center justify-center overflow-hidden rounded-[16px] min-h-[500px] lg:min-h-[700px] py-12 px-6">

                    <div class="absolute inset-0 z-10 pointer-events-none rounded-[16px] p-[1.5px]" style="background: linear-gradient(90deg, #d4af37 -50%, rgba(212,175,55,0.05) 45%, rgba(212,175,55,0.05) 55%, #d4af37 100%);
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor; mask-composite: exclude;">
                    </div>

                    <div class="absolute inset-0 z-0 bg-[#0a0a0a]/90 backdrop-blur-[10px]"></div>

                    <div class="relative z-20 flex flex-col items-center justify-center w-full text-center space-y-12">

                        <p
                            class="bg-gradient-to-b from-[#bc9a1d] to-[#d4af37] bg-clip-text text-4xl md:text-5xl lg:text-[50px] font-bold tracking-tight text-transparent uppercase">
                            Current Bid
                        </p>

                        <div
                            class="flex items-center justify-center w-full max-w-[90%] rounded-[16px] border border-white/20 bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] px-6 py-6 md:px-10 md:py-8 font-['Bebas_Neue'] text-[10vw] md:text-7xl lg:text-[85px] leading-none tracking-[-2px] text-white shadow-[inset_0px_1px_1px_rgba(255,255,255,0.1)] break-all">
                            {{ formattedCurrentBid }}
                        </div>

                        <div class="flex flex-col items-center gap-4">
                            <p class="text-2xl md:text-3xl lg:text-[38px] font-bold text-white">Time Left:</p>

                            <div
                                class="flex flex-wrap justify-center items-baseline gap-2 md:gap-4 font-bold text-white">
                                <div class="flex items-baseline"><span class="text-3xl md:text-4xl lg:text-[45px]">{{
                                        countdown.days }}</span><span
                                        class="text-lg md:text-xl ml-1 font-normal opacity-70">days</span></div>
                                <span class="text-xl md:text-2xl">:</span>
                                <div class="flex items-baseline"><span class="text-3xl md:text-4xl lg:text-[45px]">{{
                                        countdown.hours }}</span><span
                                        class="text-lg md:text-xl ml-1 font-normal opacity-70">hrs</span></div>
                                <span class="text-xl md:text-2xl">:</span>
                                <div class="flex items-baseline"><span class="text-3xl md:text-4xl lg:text-[45px]">{{
                                        countdown.minutes }}</span><span
                                        class="text-lg md:text-xl ml-1 font-normal opacity-70">mins</span></div>
                                <span class="text-xl md:text-2xl">:</span>
                                <div class="flex items-baseline"><span
                                        class="bg-gradient-to-b from-[#bc9a1d] to-[#d4af37] bg-clip-text text-3xl md:text-4xl lg:text-[45px] text-transparent">{{
                                        countdown.seconds }}</span><span
                                        class="text-lg md:text-xl ml-1 font-normal opacity-70">sec</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="relative flex flex-col items-center justify-center overflow-hidden rounded-[16px] min-h-[500px] lg:min-h-[700px] py-12 px-6">

                    <div class="absolute inset-0 z-10 pointer-events-none rounded-[16px] p-[1.5px]" style="background: linear-gradient(90deg, #d4af37 -50%, rgba(212,175,55,0.05) 45%, rgba(212,175,55,0.05) 55%, #d4af37 100%);
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor; mask-composite: exclude;">
                    </div>

                    <div class="absolute inset-0 z-0 bg-[#0a0a0a]/90 backdrop-blur-[10px]"></div>

                    <div class="relative z-20 flex flex-col items-center justify-center w-full text-center space-y-10">

                        <div>
                            <p class="text-2xl md:text-3xl lg:text-[35px] font-bold text-white">Standard Increment:</p>
                            <p
                                class="mt-2 font-['Bebas_Neue'] text-5xl md:text-6xl lg:text-[55px] text-[#00d7a5] tracking-wide">
                                {{ formattedStandardIncrement }}
                            </p>
                        </div>

                        <div class="flex items-center gap-8 md:gap-12">
                            <button type="button"
                                class="h-16 w-16 md:h-[80px] md:w-[80px] rounded-full bg-white/10 flex items-center justify-center text-4xl text-white hover:bg-white/20 transition-all shadow-lg border border-white/5"
                                @click="handleDecrement">-</button>
                            <p
                                class="font-['Bebas_Neue'] text-7xl md:text-[90px] lg:text-[110px] text-white leading-none">
                                {{ bidSteps }}</p>
                            <button type="button"
                                class="h-16 w-16 md:h-[80px] md:w-[80px] rounded-full bg-white/10 flex items-center justify-center text-4xl text-white hover:bg-white/20 transition-all shadow-lg border border-white/5"
                                @click="handleIncrement">+</button>
                        </div>

                        <p
                            class="font-['Bebas_Neue'] text-5xl md:text-6xl lg:text-[75px] text-white uppercase tracking-tighter w-full leading-none">
                            your bid = {{ formattedSelectedAmount }}
                        </p>

                        <p v-if="isCooldownActive" class="text-[#d4af37] text-sm md:text-base">
                            You can place your next bid in {{ cooldownSecondsLeft }}s.
                        </p>

                        <button type="button" :disabled="!canPlaceBid"
                            class="w-full max-w-[460px] h-16 md:h-[85px] rounded-full bg-gradient-to-r from-[#bc9a1d] to-[#d4af37] text-2xl md:text-[32px] font-bold text-black shadow-[0_10px_30px_rgba(188,154,29,0.3)] hover:scale-[1.02] transition-transform mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            @click="openPlaceBid">
                            {{ isSubmittingBid ? 'Placing...' : 'Place Bid' }}
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <Transition enter-active-class="transition duration-200" leave-active-class="transition duration-150"
            enter-from-class="opacity-0" leave-to-class="opacity-0">
            <div v-if="isConfirmModalOpen"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
                @click.self="isConfirmModalOpen = false">
                <div
                    class="w-full max-w-[820px] rounded-[20px] border border-[#d4af37] bg-black px-6 py-10 shadow-[0_16px_40px_rgba(0,0,0,0.45)] md:px-10 md:py-12">
                    <h3 class="text-center text-[clamp(2.1rem,6vw,4.2rem)] uppercase leading-[0.9] font-['Bebas_Neue']">
                        <span
                            class="bg-gradient-to-b from-[#bc9a1d] to-[#d4af37] bg-clip-text text-transparent">Confirm</span>
                        <span class="text-white"> Your Bid</span>
                    </h3>

                    <p class="mt-6 text-center text-[clamp(1.2rem,2.3vw,2rem)] leading-[1.4] text-white/90">
                        Are you sure<br>
                        you want to make this bid?
                    </p>

                    <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                        <button type="button"
                            class="h-14 rounded-full bg-gradient-to-r from-[#444] to-[#222] text-[clamp(1.3rem,2.2vw,2rem)] font-medium text-white"
                            @click="isConfirmModalOpen = false">
                            Cancel
                        </button>

                        <button type="button" :disabled="isSubmittingBid"
                            class="h-14 rounded-full bg-gradient-to-r from-[#bc9a1d] to-[#d4af37] text-[clamp(1.3rem,2.2vw,2rem)] font-medium text-black disabled:opacity-60"
                            @click="submitBid">
                            {{ isSubmittingBid ? 'Placing...' : 'Yes' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <LazyResponseModal :response_modal="response_modal" />
    </article>
</template>
