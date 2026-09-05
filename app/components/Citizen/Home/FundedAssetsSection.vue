<script setup lang="ts">
type CmsFundedAsset = {
    status?: string | null
    slug?: string | null
    image?: string | null
    alt?: string | null
    collection?: string | null
    title?: string | null
    description?: string | null
    cagr?: string | null
}

type CmsFundedAssetsResponse = {
    data?: CmsFundedAsset[]
}

type FundedAsset = {
    image: string
    alt: string
    badge: string
    title: string
    cagr: string
    value: string
    exited: boolean
}

const fallbackFundedAssetImage = '/generated/porsche-studio.png'

const {
    data: fundedAssetsData,
    error: fundedAssetsError,
    pending: fundedAssetsPending,
    status: fundedAssetsStatus
} = useAsyncData<CmsFundedAsset[]>(
    'citizen-fractional-funded-assets',
    async () => {
        const response = await $fetchCitizen<CmsFundedAssetsResponse>('v1/customer/fractional/funded', {
            method: 'GET'
        })

        return Array.isArray(response?.data) ? response.data : []
    },
    {
        default: () => [],
        lazy: true,
        server: false
    }
)

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const normalizeFundedAsset = (item: CmsFundedAsset): FundedAsset | null => {
    const title = getFirstValue(item.title)

    if (!title) return null

    const statusText = getFirstValue(item.status) || 'Funded'
    const isExited = statusText.toLowerCase() === 'exited' || statusText.toLowerCase() === 'sold'
    
    // Default to static placeholders for value until added to the CMS API, but handle it gracefully
    const displayValue = isExited ? 'Exit Value: TBC' : 'Current Value: TBC'

    return {
        image: getFirstValue(item.image) || fallbackFundedAssetImage,
        alt: getFirstValue(item.alt) || title,
        badge: isExited ? 'Exited Asset' : 'Funded Complete',
        title,
        cagr: getFirstValue(item.cagr) || 'TBC',
        value: displayValue,
        exited: isExited
    }
}

const fundedAssets = computed<FundedAsset[]>(() => (
    (fundedAssetsData.value || [])
        .map(normalizeFundedAsset)
        .filter((item): item is FundedAsset => Boolean(item))
))
</script>

<template>
    <section id="funded-assets" class="border-b border-white/10 bg-tccDeepBlack py-20 text-white">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-12 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                    <span class="restomod-eyebrow">Track Record</span>
                    <h2 class="mt-5 font-poppins text-4xl font-black leading-tight text-white sm:text-5xl">Funded &amp;
                        Exited Assets</h2>
                </div>
                <p class="max-w-2xl text-sm leading-relaxed text-white/60 lg:justify-self-end">
                    Historical performance of classic automotive assets successfully completed and managed by The Car
                    Crowd.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <article v-for="asset in fundedAssets" :key="asset.title"
                    class="restomod-image-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-tccGold/40">
                    <div class="relative h-52 overflow-hidden bg-tccDeepBlack">
                        <div class="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full border px-3 py-1 text-[8px] font-bold uppercase tracking-[0.22em]"
                            :class="asset.exited ? 'border-tccGold/30 bg-tccGold text-tccDarkNavy' : 'border-emerald-300/30 bg-emerald-400/20 text-emerald-100'">
                            {{ asset.badge }}
                        </div>
                        <img :src="asset.image" :alt="asset.alt" class="h-full w-full object-cover opacity-90">
                    </div>
                    <div class="p-5">
                        <h3 class="font-poppins text-lg font-bold leading-tight text-white">{{ asset.title }}</h3>
                        <div class="mt-3 flex items-baseline gap-2">
                            <span class="text-2xl font-black text-tccGold">{{ asset.cagr }}</span>
                            <span
                                class="font-poppins text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">CAGR</span>
                        </div>
                        <p class="mt-1 text-xs text-white/50">{{ asset.value }}</p>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
