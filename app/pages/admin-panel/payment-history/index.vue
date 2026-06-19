<script setup>
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const route = useRoute();

const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: ''
});

const isLoading = ref(false);
const data = ref([]);
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

    try {
        // API: GET v1/admin/auctions/payment-history
        const getData = await $fetchAdmin('v1/admin/auctions/payment-history', {
            method: 'GET',
            params: {
                page: route.query.page ? route.query.page : 1,
                length: 10,
            },
        });

        const list = getData?.data?.data ?? getData?.data ?? [];
        data.value = Array.isArray(list) ? list : [];

        // If API returns pagination meta, wire it up.
        paginationConfig.value.data = getData?.data?.meta ?? getData?.meta ?? [];
    } catch (e) {
        response_modal.value = e?.response?._data || {
            status: false,
            message: e?.message || 'Failed to load payment history.'
        };
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
</script>

<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="border-b border-gray-200">
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 py-2 px-4">Payment History</h4>
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
                                        <th width="15%"><span>Date</span></th>
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
                                        <td><Skeleton width="7rem" class="mb-2"></Skeleton></td>
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
                                        <td class="text-gray-800 dark:text-gray-200">{{ item.created_at || '-' }}</td>
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
                                        <td colspan="7" class="py-6 text-center text-gray-500 dark:text-gray-300">
                                            No payment history found.
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
                            @click="closeDetailsModal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>
