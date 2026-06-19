type AuctionWatchlistResponse = {
    data?: {
        data?: Array<{
            auction_id?: number | string
            auction?: {
                id?: number | string
            }
        }>
    }
}

type ToggleAuctionWatchlistResponse = {
    status?: boolean
    message?: string
    data?: {
        watchlist?: boolean
        auction_id?: number | string
    }
}

export const useAuctionWatchlist = () => {
    const { citizen_user } = citizenAuth()
    const router = useRouter()
    const watchlistedAuctionIds = useState<string[]>('citizen-watchlisted-auction-ids', () => [])
    const togglingAuctionIds = ref<Set<string>>(new Set())
    const response_modal = ref({})

    const normalizeAuctionId = (id?: number | string | null) => String(id ?? '')

    const loadAuctionWatchlist = async () => {
        if (!citizen_user.value) {
            watchlistedAuctionIds.value = []
            return
        }

        try {
            const response = await $fetchCitizen<AuctionWatchlistResponse>('v1/customer/auctions/my-auctions-bids', {
                method: 'POST',
            })

            const rows = response?.data?.data ?? []
            watchlistedAuctionIds.value = Array.from(new Set(
                rows
                    .map((row) => normalizeAuctionId(row.auction_id ?? row.auction?.id))
                    .filter(Boolean)
            ))
        } catch (error) {
            console.error('Failed to load auction watchlist:', error)
            watchlistedAuctionIds.value = []
        }
    }

    const isAuctionWatchlisted = (auctionId?: number | string | null) => {
        const normalizedId = normalizeAuctionId(auctionId)
        return Boolean(normalizedId && watchlistedAuctionIds.value.includes(normalizedId))
    }

    const setToggleLoading = (auctionId: string, isLoading: boolean) => {
        const nextIds = new Set(togglingAuctionIds.value)

        if (isLoading) {
            nextIds.add(auctionId)
        } else {
            nextIds.delete(auctionId)
        }

        togglingAuctionIds.value = nextIds
    }

    const isTogglingAuction = (auctionId?: number | string | null) => {
        return togglingAuctionIds.value.has(normalizeAuctionId(auctionId))
    }

    const setWatchlistState = (auctionId: string, watchlist: boolean) => {
        if (!auctionId) return

        const nextIds = new Set(watchlistedAuctionIds.value)

        if (watchlist) {
            nextIds.add(auctionId)
        } else {
            nextIds.delete(auctionId)
        }

        watchlistedAuctionIds.value = Array.from(nextIds)
    }

    const watchlistButtonText = (auctionId?: number | string | null) => {
        return isAuctionWatchlisted(auctionId) ? 'Remove Watchlist' : 'Join Watchlist'
    }

    const toggleAuctionWatchlist = async (auctionId?: number | string | null) => {
        if (!citizen_user.value) {
            await router.push('/signin')
            return null
        }

        const normalizedId = normalizeAuctionId(auctionId)
        if (!normalizedId || togglingAuctionIds.value.has(normalizedId)) return null

        setToggleLoading(normalizedId, true)

        try {
            const response = await $fetchCitizen<ToggleAuctionWatchlistResponse>(
                `v1/customer/auctions/${normalizedId}/watchlist/toggle`,
                { method: 'POST' }
            )

            if (response?.status) {
                setWatchlistState(normalizeAuctionId(response.data?.auction_id) || normalizedId, Boolean(response.data?.watchlist))
            }

            response_modal.value = response || {
                status: false,
                message: 'Failed to update watchlist. Please try again.',
            }

            return response
        } catch (error: any) {
            response_modal.value = error?.response?._data || error?.data || {
                status: false,
                message: 'Failed to update watchlist. Please try again.',
            }
            return null
        } finally {
            setToggleLoading(normalizedId, false)
        }
    }

    return {
        response_modal,
        loadAuctionWatchlist,
        isAuctionWatchlisted,
        isTogglingAuction,
        watchlistButtonText,
        toggleAuctionWatchlist,
    }
}
