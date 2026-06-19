<script setup>
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const { $viewFormatDateTime } = useNuxtApp();

const auctions = ref([]);
const selectedAuctionId = ref(null);
const isAuctionsLoading = ref(false);

const bids = ref([]);
const isBidsLoading = ref(false);
const paginationConfig = ref({
	data: {},
	lang: 'en',
	align: 'center',
	action: 'ajax',
});

const response_modal = ref({});

const isOpenConModal = ref(false);
const selectedBid = ref(null);

const normalizeAuctionsResponse = (payload) => {
	const list = payload?.data?.data ?? payload?.data ?? [];
	return Array.isArray(list) ? list : [];
};

const normalizeBidsResponse = (payload) => {
	const responseData = payload?.data ?? {};
	const list = responseData?.data ?? responseData ?? [];

	return {
		bids: Array.isArray(list) ? list : [],
		meta: responseData?.meta ?? {},
	};
};

const loadAuctions = async () => {
	isAuctionsLoading.value = true;
	try {
		const getData = await $fetchAdmin(`v1/admin/auctions/all`, {
			method: 'POST',
			body: {
				paginate: false,
				page: 1,
				length: 500,
			},
		});
		auctions.value = normalizeAuctionsResponse(getData);
	} catch (e) {
	} finally {
		isAuctionsLoading.value = false;
	}
};

const loadBids = async (page = 1) => {
	if (!selectedAuctionId.value) {
		bids.value = [];
		paginationConfig.value.data = {};
		return;
	}
	isBidsLoading.value = true;
	try {
		const getData = await $fetchAdmin(`v1/admin/auctions/${selectedAuctionId.value}/bids`, {
			method: 'GET',
			query: {
				page,
			},
		});
		const normalized = normalizeBidsResponse(getData);
		bids.value = normalized.bids;
		paginationConfig.value.data = normalized.meta;
	} catch (e) {
		bids.value = [];
		paginationConfig.value.data = {};
	} finally {
		isBidsLoading.value = false;
	}
};

onMounted(() => {
	loadAuctions();
});

watch(selectedAuctionId, () => {
	loadBids(1);
});

const openDetermineWinnerModal = (bid) => {
	selectedBid.value = bid;
	isOpenConModal.value = true;
};

const onUpdateConfirmModal = (value) => {
	isOpenConModal.value = value;
	if (!value) {
		selectedBid.value = null;
	}
};

const determineWinnerHandler = async () => {
	if (!selectedAuctionId.value || !selectedBid.value?.id) return;

	response_modal.value = {};
	try {
		const getData = await $fetchAdmin(`v1/admin/auctions/${selectedAuctionId.value}/determine-winner`, {
			method: 'POST',
			body: {
				bid_id: selectedBid.value.id,
			},
		});
		response_modal.value = getData;
		if (getData?.status === true) {
			await loadBids();
		}
	} catch (e) {
		if (e.response?.status === 400 || e.response?.status === 409 || e.response?.status === 422) {
			response_modal.value = e.response._data;
		} else {
			response_modal.value = {
				status: false,
				message: 'Something went wrong. Please try again later.',
			};
		}
	}
};
</script>

<template>
	<div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
		<div class="h-full w-full overflow-auto">
			<div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
				<div class="w-full md:w-auto flex flex-wrap gap-4">
					<div class="flex items-center gap-3 w-full md:w-auto">
						<label for="auction" class="text-gray-800 dark:text-gray-200">Auction</label>
						<Select v-model="selectedAuctionId" :options="auctions" filter optionLabel="headline"
							optionValue="id" placeholder="Select" class="w-full md:w-[26rem]"
							:loading="isAuctionsLoading" />
					</div>
				</div>
			</div>

			<div class="pb-2 flex flex-col justify-between w-full">
				<div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
					<div class="border-b border-gray-200">
						<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 py-2 px-4">Bids</h4>
					</div>

					<div class="p-4">
						<div class="custom_table overflow-auto border-b border-gray-200">
							<table class="table table-auto">
								<thead class="sticky z-10 top-0">
									<tr>
										<!-- <th width="8%"><span>ID</span></th> -->
										<th width="30%"><span>User</span></th>
										<th width="12%"><span>Amount</span></th>
										<th width="10%"><span>Status</span></th>
										<th width="20%"><span>Action</span></th>
										<!-- <th width="20%"><span>Created At</span></th> -->
									</tr>
								</thead>

								<tbody v-if="isBidsLoading">
									<tr v-for="(index) in 10" :key="index">
										<!-- <td><Skeleton width="3rem" class="mb-2"></Skeleton></td> -->
										<td><Skeleton width="12rem" class="mb-2"></Skeleton></td>
										<td><Skeleton width="6rem" class="mb-2"></Skeleton></td>
										<td><Skeleton width="4rem" class="mb-2"></Skeleton></td>
										<td><Skeleton width="9rem" height="2rem" borderRadius="10px"></Skeleton></td>
										<!-- <td><Skeleton width="10rem" class="mb-2"></Skeleton></td> -->
									</tr>
								</tbody>

								<tbody v-else-if="!selectedAuctionId">
									<tr>
										<td colspan="4" class="text-center py-6 text-gray-600 dark:text-gray-300">
											Select an auction to view bids.
										</td>
									</tr>
								</tbody>

								<tbody v-else>
									<tr v-for="(item, index) in bids" :key="index">
										<!-- <td class="text-gray-800 dark:text-gray-200 text-center">{{ item.id }}</td> -->
										<td class="text-gray-800 dark:text-gray-200">
											<div class="flex flex-col">
												<span class="font-medium">{{ item.user?.username || '-' }}</span>
												<span class="text-xs text-gray-500 dark:text-gray-400">{{ item.user?.email || '-' }}</span>
											</div>
										</td>
										<td class="text-gray-800 dark:text-gray-200 text-right">{{ item.amount }}</td>
										<td class="text-gray-800 dark:text-gray-200 text-center">{{ item.status_description }}</td>
										<td>
											<div v-if="!item.already_selected" class="flex justify-center items-center">
												<Button label="Determine Winner" class="text-xs"
													@click="openDetermineWinnerModal(item)" />
											</div>
                                            <div v-else class="text-center text-green-600 dark:text-green-400 font-medium">
                                                Winner
                                            </div>
										</td>
                                        <!-- <td class="text-gray-800 dark:text-gray-200 text-center">
                                            {{ item.created_at ? $viewFormatDateTime(item.created_at) : '-' }}
                                        </td> -->
                          
									</tr>

									<tr v-if="bids.length === 0">
										<td colspan="4" class="text-center py-6 text-gray-600 dark:text-gray-300">
											No bids found.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<LazyPagination v-if="!isBidsLoading && selectedAuctionId && paginationConfig.data?.total > 0"
						class="px-4" :config="paginationConfig" @loadData="loadBids" />

					<LazyConfirmModal :isOpenConModal="isOpenConModal" title="Determine Winner"
						message="Are you sure Determine Winner for this User?" @confirm="determineWinnerHandler"
						@update:isOpenConModal="onUpdateConfirmModal" />
					<LazyResponseModal :response_modal="response_modal" />
				</div>
			</div>
		</div>
	</div>
</template>
