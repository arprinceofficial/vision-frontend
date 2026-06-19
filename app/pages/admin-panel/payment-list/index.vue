<script setup>
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const route = useRoute();

const statusOptions = [
	{ name: 'All', key: 'status', value: '1' }, // Pending
	{ name: 'Verify', key: 'status', value: 'verify' },
	{ name: 'Reject', key: 'status', value: 'reject' },
];

const status = ref(statusOptions[0]);

const paginationConfig = ref({
	data: [],
	lang: 'en',
	align: 'center',
	action: ''
});

const isLoading = ref(false);
const isActionLoading = ref(false);
const data = ref([]);
const permissions = ref({});
const response_modal = ref({});

const isOpenDetailsModal = ref(false);
const selectedPayment = ref(null);

const openDetailsModal = (item) => {
	selectedPayment.value = item;
	isOpenDetailsModal.value = true;
};

const closeDetailsModal = () => {
	selectedPayment.value = null;
	isOpenDetailsModal.value = false;
};

const getPaymentReceiptUrl = computed(() => {
	const url = selectedPayment.value?.payment_receipt;
	return typeof url === 'string' && url.trim() ? url : '';
});

const loadData = async () => {
	isLoading.value = true;
	permissions.value = {};

	try {
		const getData = await $fetchAdmin(`v1/admin/auctions/payments`, {
			method: 'POST',
			body: {
				paginate: true,
				page: route.query.page ? route.query.page : 1,
				length: 10,
				status: status.value?.key === 'status' ? status.value.value : '',
			},
		});

		const list = getData?.data?.data ?? [];
		data.value = Array.isArray(list) ? list : [];
		permissions.value = getData?.data?.permissions ?? {};

		// Support both `meta` (common) and `data.meta` shapes.
		paginationConfig.value.data = getData?.data?.meta ?? getData?.data?.data?.meta ?? getData?.data?.data?.pagination ?? [];
	} catch (e) {
		// keep silent for consistency with other admin pages
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => {
	loadData();
});

watch(() => route.query, () => {
	loadData();
});

const resetPagination = () => {
	const query = { ...route.query };
	delete query.page;
	navigateTo({ query }, { replace: true });
};

const onChangeHandler = () => {
	loadData();
	resetPagination();
};

const verifyPayment = async () => {
	if (!selectedPayment.value?.id) return;

	isActionLoading.value = true;
	response_modal.value = {};

	try {
		const res = await $fetchAdmin(`v1/admin/auctions/${selectedPayment.value.id}/verify-payment`, {
			method: 'POST',
		});
		response_modal.value = res;
		if (res?.status) {
			closeDetailsModal();
			await loadData();
		}
	} catch (e) {
		response_modal.value = e?.response?._data || {
			status: false,
			message: e?.message || 'Verification failed.',
		};
	} finally {
		isActionLoading.value = false;
	}
};

const rejectPayment = async () => {
	if (!selectedPayment.value?.id) return;

	isActionLoading.value = true;
	response_modal.value = {};

	try {
		const res = await $fetchAdmin(`v1/admin/auctions/${selectedPayment.value.id}/reject-payment`, {
			method: 'POST',
		});
		response_modal.value = res;
		if (res?.status) {
			closeDetailsModal();
			await loadData();
		}
	} catch (e) {
		response_modal.value = e?.response?._data || {
			status: false,
			message: e?.message || 'Rejection failed.',
		};
	} finally {
		isActionLoading.value = false;
	}
};
</script>

<template>
	<div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
		<div class="h-full w-full overflow-auto">
			<!-- <div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
				<div class="w-full md:w-auto flex flex-wrap gap-4">
					<div class="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto">
						<div class="flex items-center gap-3 w-full md:w-auto">
							<label for="status" class="text-gray-800 dark:text-gray-200">Status</label>
							<Select v-model="status" :options="statusOptions" optionLabel="name" @change="onChangeHandler"
								placeholder="Select" class="w-full md:w-auto" />
						</div>
					</div>
				</div>
			</div> -->

			<div class="pb-2 flex flex-col justify-between w-full">
				<div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
					<div class="border-b border-gray-200">
						<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 py-2 px-4">Payments</h4>
					</div>

					<div class="p-4">
						<div class="custom_table overflow-auto border-b border-gray-200">
							<table class="table table-auto">
								<thead class="sticky z-10 top-0">
									<tr>
										<th width="20%"><span>Auction</span></th>
										<th width="20%"><span>User</span></th>
										<th width="10%"><span>Amount</span></th>
										<th width="15%"><span>Method</span></th>
										<th width="10%"><span>Status</span></th>
										<th width="10%"><span>Action</span></th>
									</tr>
								</thead>

								<tbody v-if="isLoading">
									<tr v-for="(index) in 10" :key="index">
										<td><Skeleton width="8rem" class="mb-2"></Skeleton></td>
										<td><Skeleton width="8rem" class="mb-2"></Skeleton></td>
										<td><Skeleton width="5rem" class="mb-2"></Skeleton></td>
										<td><Skeleton width="6rem" class="mb-2"></Skeleton></td>
										<td><div class="flex justify-center"><Skeleton width="5rem"></Skeleton></div></td>
										<td>
											<div class="flex justify-center items-center gap-2">
												<Skeleton size="1.5rem"></Skeleton>
											</div>
										</td>
									</tr>
								</tbody>

								<tbody v-else>
									<tr v-for="(item, index) in data" :key="index">
										<td class="text-gray-800 dark:text-gray-200">{{ item.auction_name || '-' }}</td>
										<td class="text-gray-800 dark:text-gray-200">{{ item.user_name || '-' }}</td>
										<td class="text-gray-800 dark:text-gray-200">{{ item.amount || '-' }}</td>
										<td class="text-gray-800 dark:text-gray-200">{{ item.payment_method || '-' }}</td>
										<td class="text-gray-800 dark:text-gray-200">{{ item.status_text || '-' }}</td>
										<td>
											<div class="flex justify-center items-center gap-2">
												<button type="button"
													class="text-xs px-3 py-1 rounded-md bg-sky-600 text-white hover:bg-sky-700"
													@click="openDetailsModal(item)">
													View
												</button>
											</div>
										</td>
									</tr>

									<tr v-if="!data?.length">
										<td colspan="6" class="py-6 text-center text-gray-500 dark:text-gray-300">
											No payments found.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<LazyPagination v-if="!isLoading && paginationConfig?.data?.last_page > 1" class="px-4" :config="paginationConfig" />
					<LazyResponseModal :response_modal="response_modal" />
				</div>
			</div>
		</div>

		<!-- Details Modal -->
		<Teleport to="body">
			<div v-if="isOpenDetailsModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
				<div class="absolute inset-0 bg-black/60" @click="closeDetailsModal" />

				<div class="relative w-[calc(100%-24px)] max-w-2xl rounded-xl bg-white dark:bg-gray-900 p-5 shadow-xl">
					<div class="flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-3">
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Details</h3>
							<p class="text-xs text-gray-500 dark:text-gray-400">ID: #{{ selectedPayment?.id || '-' }}</p>
						</div>

						<button type="button"
							class="h-8 w-8 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
							@click="closeDetailsModal">
							<i class="fa-solid fa-xmark" />
						</button>
					</div>

					<div class="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Auction:</span> {{ selectedPayment?.auction_name || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">User:</span> {{ selectedPayment?.user_name || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Email:</span> {{ selectedPayment?.user_email || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Amount:</span> {{ selectedPayment?.amount || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Method:</span> {{ selectedPayment?.payment_method || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Status:</span> {{ selectedPayment?.status_text || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Transaction ID:</span> {{ selectedPayment?.transaction_id || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Bank Name:</span> {{ selectedPayment?.bank_name || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200 sm:col-span-2"><span class="text-gray-500">Admin Notes:</span> {{ selectedPayment?.admin_notes || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Processed At:</span> {{ selectedPayment?.processed_at || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Created At:</span> {{ selectedPayment?.created_at || '-' }}</div>
						<div class="text-gray-800 dark:text-gray-200"><span class="text-gray-500">Updated At:</span> {{ selectedPayment?.updated_at || '-' }}</div>

						<div v-if="getPaymentReceiptUrl" class="sm:col-span-2">
							<p class="text-gray-500 mb-1">Receipt</p>
							<a :href="getPaymentReceiptUrl" target="_blank" class="text-sky-600 hover:underline">
								View receipt
							</a>
						</div>
					</div>

					<div class="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
						<button type="button"
							class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
							:disabled="isActionLoading"
							@click="closeDetailsModal">
							Close
						</button>
						<button type="button"
							class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
							:disabled="isActionLoading"
							@click="rejectPayment">
							{{ isActionLoading ? 'Please wait...' : 'Reject' }}
						</button>
						<button type="button"
							class="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
							:disabled="isActionLoading"
							@click="verifyPayment">
							{{ isActionLoading ? 'Please wait...' : 'Verify' }}
						</button>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>