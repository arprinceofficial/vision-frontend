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
            if (res.data && res.data.shares_total !== undefined) {
                item.shares_total = res.data.shares_total;
                item.total_shares = res.data.shares_total;
            } else {
                item.shares_total = (Number(item.shares_total) || 0) + Number(item.input_slots);
                item.total_shares = (Number(item.total_shares) || 0) + Number(item.input_slots);
            }

            if (res.data && res.data.shares_available !== undefined) {
                item.shares_available = res.data.shares_available;
            } else if (res.data && res.data.available_shares !== undefined) {
                item.available_shares = res.data.available_shares;
            } else {
                item.shares_available = (Number(item.shares_available) || 0) + Number(item.input_slots);
                item.available_shares = (Number(item.available_shares) || 0) + Number(item.input_slots);
            }

            item.input_slots = '';
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
            
            <div class="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1a2332] p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <div class="text-lg font-semibold text-gray-900 dark:text-white">
                        Allocation Management
                    </div>
                    <div class="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="relative w-full md:w-80">
                            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            <LazyInputText 
                                type="text" 
                                v-model="search" 
                                @keyup.enter="loadData(1)" 
                                class="w-full pl-10 !bg-gray-50 dark:!bg-[#131b26] dark:text-white" 
                                placeholder="Search items by name..." 
                            />
                        </div>
                        <Button label="Search" @click="loadData(1)" class="whitespace-nowrap" />
                    </div>
                </div>
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
                    
                    <div v-for="item in data" :key="item.id" class="bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-500/50 transition-all duration-200 relative flex flex-col justify-between shadow-sm hover:shadow-md">
                        
                        <div class="mb-5">
                            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2" :title="item.item_name || item.assetable?.asset_name || `Item #${item.id}`">
                                {{ item.item_name || item.assetable?.asset_name || `Item #${item.id}` }}
                            </h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Manage allocations</p>
                        </div>
                        
                        <div class="flex flex-col gap-4 mt-auto">
                            <!-- Stats Grid -->
                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-gray-50 dark:bg-[#131b26] rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                                    <div class="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Allocations</div>
                                    <div class="text-lg font-bold text-gray-900 dark:text-white">
                                        {{ item.shares_total || item.total_shares || 0 }}
                                    </div>
                                </div>
                                <div class="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-100 dark:border-blue-800/30">
                                    <div class="text-[11px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 mb-1">Remaining</div>
                                    <div class="text-lg font-bold text-blue-700 dark:text-blue-300">
                                        {{ item.shares_available || item.available_shares || 0 }}
                                    </div>
                                </div>
                            </div>

                            <!-- Input Group -->
                            <div class="flex items-stretch w-full mt-2">
                                <input 
                                    type="number" 
                                    v-model="item.input_slots" 
                                    placeholder="Enter slots to add" 
                                    class="flex-grow w-full min-w-0 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-[#131b26] text-gray-900 dark:text-white transition-all shadow-sm"
                                    @keyup.enter="submitSlots(item)"
                                />
                                <button 
                                    class="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium rounded-r-lg transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center min-w-[90px] shadow-sm"
                                    @click="submitSlots(item)"
                                    :disabled="isSubmittingId === item.id"
                                >
                                    <span v-if="isSubmittingId === item.id" class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                    <span>Submit</span>
                                </button>
                            </div>
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
