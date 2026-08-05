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
const permissions = ref({ view: true });

const loadData = async () => {
    isLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/allocation-payments`, {
            method: 'GET',
            params: {
                page: route.query.page || 1,
                length: 10,
            }
        });
        const list = getData?.data?.data ?? getData?.data ?? [];
        data.value = Array.isArray(list) ? list : [];
        paginationConfig.value.data = getData?.data?.meta ?? getData?.meta ?? [];
    } catch (e) {
        console.log('Get Message', e.message);
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

const getPaymentReceiptUrl = (url) => {
    return typeof url === 'string' && url.trim() ? url : '';
};
</script>

<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
                <div class="w-full md:w-auto flex flex-wrap gap-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Allocation Payments</h3>
                </div>
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto w-full text-left">
                                <thead class="sticky z-10 top-0 bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th class="py-2 px-3">ID / Reference</th>
                                        <th class="py-2 px-3">User</th>
                                        <th class="py-2 px-3">Item</th>
                                        <th class="py-2 px-3 text-right">Amount</th>
                                        <th class="py-2 px-3 text-center">Method</th>
                                        <th class="py-2 px-3 text-center">Status</th>
                                        <th class="py-2 px-3 text-center">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading">
                                    <tr v-for="index in 5" :key="index">
                                        <td v-for="col in 7" :key="col" class="py-2 px-3 text-center">
                                            <Skeleton width="100%" height="1.5rem"></Skeleton>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(item, index) in data" :key="index" class="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="text-sm font-semibold">#{{ item.id }}</div>
                                            <div class="text-xs text-gray-500">{{ item.payment_intent_id || item.transaction_id || 'N/A' }}</div>
                                        </td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="text-sm">{{ item.user?.first_name }} {{ item.user?.last_name }}</div>
                                            <div class="text-xs text-gray-500">{{ item.user?.email }}</div>
                                        </td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">
                                            {{ item.allocation_request?.fractional_item?.item_name || item.allocation_request?.fractional_item?.assetable?.asset_name || 'N/A' }}
                                        </td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200 text-right">{{ item.amount }} {{ item.currency }}</td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200 text-center">{{ item.payment_method }}</td>
                                        <td class="py-2 px-3 text-center">
                                            <span class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">{{ item.status }}</span>
                                        </td>
                                        <td class="py-2 px-3 text-center">
                                            <a v-if="getPaymentReceiptUrl(item.payment_receipt)" :href="getPaymentReceiptUrl(item.payment_receipt)" target="_blank" class="text-blue-500 hover:text-blue-800" title="View Receipt">
                                                <i class="fa-solid fa-file-invoice"></i>
                                            </a>
                                            <span v-else class="text-gray-400">-</span>
                                        </td>
                                    </tr>
                                    <tr v-if="data.length === 0">
                                        <td colspan="7" class="text-center py-4 text-gray-500">No payments found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <LazyPagination v-if="!isLoading && paginationConfig?.data?.last_page > 1" class="px-4" :config="paginationConfig" />
                </div>
            </div>
        </div>
    </div>
</template>
