<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: 'ajax'
});

const isLoading = ref(false);
const data = ref([]);
const isSubmittingId = ref(null);

const search = ref('');
const lastPage = ref(1);

const loadData = async (page = 1) => {
    isLoading.value = true;
    try {
        const params = {
            page: page,
            length: 12,
        };

        if (search.value) {
            params.search = search.value;
        }

        const getData = await $fetchAdmin(`v1/admin/slots-post`, {
            method: 'GET',
            params: params
        });
        
        const list = getData?.data?.data ?? getData?.data ?? [];
        data.value = Array.isArray(list) ? list.map(item => ({
            ...item,
            input_slots: ''
        })) : [];
        
        paginationConfig.value.data = getData?.data?.meta ?? getData?.meta ?? (getData?.data || []);
        lastPage.value = getData?.data?.last_page ?? getData?.meta?.last_page ?? 1;
    } catch (e) {
        console.error('Error fetching data:', e.message);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadData(1);
});

const submitSlots = async (item) => {
    if (!item.input_slots && item.input_slots !== 0) return;
    
    isSubmittingId.value = item.id;
    try {
        const payload = {
            shares_total: item.input_slots,
            total_shares: item.input_slots,
            assetable_type: item.assetable_type,
            assetable_id: item.assetable_id
        };

        const res = await $fetchAdmin(`v1/admin/slots-post/${item.id}`, {
            method: 'PUT',
            body: payload
        });
        
        if (res.success || res.status) {
            item.shares_total = item.input_slots;
            item.total_shares = item.input_slots;
            item.input_slots = '';
            // update available shares if needed based on response, but for now just clear input
            if (res.data && res.data.shares_available !== undefined) {
                item.shares_available = res.data.shares_available;
            } else if (res.data && res.data.available_shares !== undefined) {
                item.available_shares = res.data.available_shares;
            }
        }
    } catch (e) {
        console.error(e);
        alert(e.response?._data?.message || 'Error updating slots.');
    } finally {
        isSubmittingId.value = null;
    }
};
</script>

<template>
    <div class="h-full mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div class="w-full max-w-7xl mx-auto overflow-auto">
            
            <div class="w-full flex flex-wrap md:flex-nowrap items-center gap-4 mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2 w-full md:w-auto">
                    <label for="search" class="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">Search Items</label>
                    <LazyInputText type="text" v-model="search" @keyup.enter="loadData(1)" class="w-full md:w-64" placeholder="Search by name or slug..." />
                </div>
                <Button label="Search" @click="loadData(1)" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 w-full">
                <template v-if="isLoading">
                    <div v-for="i in 6" :key="i" class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2332] rounded-lg p-6 shadow-sm">
                        <Skeleton width="80%" height="1.5rem" class="mb-4"></Skeleton>
                        <Skeleton width="100%" height="2.5rem" class="mb-4"></Skeleton>
                        <Skeleton width="40%" height="1rem" class="mb-2"></Skeleton>
                        <Skeleton width="40%" height="1rem"></Skeleton>
                    </div>
                </template>
                <template v-else>
                    <div v-if="data.length === 0" class="col-span-full text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        No fractional items found.
                    </div>
                    
                    <div v-for="item in data" :key="item.id" class="border-b border-gray-200 dark:border-gray-700 pb-6 relative flex flex-col justify-between">
                        
                        <h3 class="text-[15px] font-bold text-gray-900 dark:text-white mb-4">
                            Total Allocations for {{ item.item_name || item.assetable?.asset_name || `Item #${item.id}` }}
                        </h3>
                        
                        <div class="flex items-center mb-5 w-full">
                            <input 
                                type="number" 
                                v-model="item.input_slots" 
                                placeholder="Enter total no. of slots" 
                                class="flex-grow border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent text-gray-900 dark:text-white"
                                @keyup.enter="submitSlots(item)"
                            />
                            <button 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium rounded-r-md transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center min-w-[80px]"
                                @click="submitSlots(item)"
                                :disabled="isSubmittingId === item.id"
                            >
                                <span v-if="isSubmittingId === item.id" class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></span>
                                Submit
                            </button>
                        </div>
                        
                        <div class="text-gray-500 dark:text-gray-400 text-sm space-y-1.5">
                            <div>Total Allocations = {{ item.shares_total || item.total_shares || 0 }}</div>
                            <div class="font-bold text-gray-900 dark:text-gray-200">Remaining Allocations = {{ item.shares_available || item.available_shares || 0 }}</div>
                        </div>
                        
                    </div>
                </template>
            </div>
            
            <div class="mt-8 pt-4">
                <LazyPagination v-if="!isLoading && lastPage > 1" :config="paginationConfig" @loadData="loadData" />
            </div>
        </div>
    </div>
</template>
