<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        auctionName?: string
        auctionImage?: string
        paidAmount?: string | number
        paidAt?: string
        orderId?: string
        invoiceUrl?: string
    }>(),
    {
        auctionName: '',
        auctionImage: '',
        paidAmount: '',
        paidAt: '',
        orderId: '',
        invoiceUrl: '',
    }
)

const fallbackImage = '/assets/images/congratulations/gloves.jpg'

const itemName = computed(() => {
    const name = (props.auctionName || '').trim()
    return name ? name : 'Auction Item'
})

const itemImage = computed(() => {
    const img = (props.auctionImage || '').trim()
    return img ? img : fallbackImage
})

const formattedAmount = computed(() => {
    const amount = props.paidAmount
    if (amount === null || amount === undefined) return '-'
    const str = String(amount).trim()
    return str ? str : '-'
})

const formattedPaidAt = computed(() => {
    const raw = (props.paidAt || '').trim()
    if (!raw) return '-'
    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) return raw
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
})

const formattedOrderId = computed(() => {
    const id = (props.orderId || '').trim()
    return id ? id : '-'
})

const summaryRows = computed(() => [
    { label: 'Final Hammer Price:', value: formattedAmount.value },
    { label: 'Total Cost:', value: formattedAmount.value, highlight: true },
    { label: 'Order ID:', value: formattedOrderId.value },
    { label: 'Date of Purchase:', value: formattedPaidAt.value }
])

const invoiceLabel = computed(() => (props.invoiceUrl ? 'Download Your Invoice' : 'Invoice Unavailable'))
</script>

<template>
    <section class="bg-black px-4 py-12 sm:py-16">
        <div class="order-summary-card" data-node-id="894:5089" data-name="Card">
            <h2 class="order-summary-title" data-node-id="894:5091">
                Order Summary
            </h2>

            <div class="order-summary-image-card" data-node-id="894:5095">
                <img :src="itemImage" :alt="itemName" class="order-summary-image" data-node-id="894:5096">
            </div>

            <dl class="order-summary-details" data-node-id="894:5092">
                <template v-for="row in summaryRows" :key="row.label">
                    <dt class="font-semibold">{{ row.label }}</dt>
                    <dd :class="{ 'is-highlighted': row.highlight }">
                        {{ row.value }}
                    </dd>
                </template>
            </dl>

            <a v-if="invoiceUrl" :href="invoiceUrl" class="order-summary-button" data-node-id="894:5094" target="_blank" rel="noopener">
                {{ invoiceLabel }}
            </a>
            <button v-else type="button" class="order-summary-button opacity-60 cursor-not-allowed" data-node-id="894:5094" disabled>
                {{ invoiceLabel }}
            </button>
        </div>
    </section>
</template>

<style scoped>
.order-summary-card {
    container-type: inline-size;
    position: relative;
    aspect-ratio: 1136 / 674;
    width: 100%;
    max-width: 1136px;
    margin: 0 auto;
    overflow: hidden;
    border: 1px solid #ffffff;
    border-radius: 16px;
    background: #111215;
    color: #ffffff;
    box-shadow:
        inset 3px 3px 2px rgba(255, 255, 255, 0.1),
        inset -2px 0 2px rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(50px);
}

.order-summary-title {
    position: absolute;
    left: 17.61%;
    top: 17.95%;
    font-family: var(--font-family-Headings);
    font-size: 6.95cqw;
    font-weight: 400;
    line-height: 5.55cqw;
    letter-spacing: -0.139cqw;
    text-transform: uppercase;
    white-space: nowrap;
}

.order-summary-details {
    position: absolute;
    left: 10.3%;
    top: 44.06%;
    display: grid;
    grid-template-columns: 19.37cqw 19.54cqw;
    column-gap: 10.04cqw;
    row-gap: 0;
    margin: 0;
    font-family: var(--font-family-Body);
    font-size: 2.11cqw;
    line-height: 2.82cqw;
}

.order-summary-details dt,
.order-summary-details dd {
    height: 2.82cqw;
    margin: 0;
    white-space: nowrap;
}

.order-summary-details dt {
    position: relative;
    top: 0.62cqw;
    font-weight: 700;
}

.order-summary-details dd {
    text-align: right;
    font-weight: 400;
}

.order-summary-details .is-highlighted {
    color: #d4af37;
    font-weight: 700;
}

.order-summary-image-card {
    position: absolute;
    left: 70.07%;
    top: 18.25%;
    width: 21.13%;
    height: 51.78%;
    overflow: hidden;
    border-radius: 24px;
    background: #ffffff;
}

.order-summary-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.order-summary-button {
    position: absolute;
    left: 20.33%;
    top: 76.26%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28.96%;
    height: 7.12%;
    border-radius: 9999px;
    background:
        linear-gradient(-28.289deg, rgba(255, 255, 255, 0) 28.673%, rgba(255, 255, 255, 0.1) 71.327%),
        linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%);
    color: #ffffff;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25));
    font-family: var(--font-family-Body);
    font-size: 2.11cqw;
    font-weight: 400;
    line-height: 2.64cqw;
    text-align: center;
    transition: opacity 150ms ease;
}

.order-summary-button:hover {
    opacity: 0.9;
}

.order-summary-button:focus-visible {
    outline: 2px solid #d4af37;
    outline-offset: 2px;
}
</style>
