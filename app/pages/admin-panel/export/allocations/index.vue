<script setup>
import { ref, onMounted, watch } from 'vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth-admin']
});

const config = useRuntimeConfig();

const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: 'ajax'
});

const isLoading = ref(true);
const allocations = ref([]);
const cars = ref([]);
const selectedCarId = ref(null);

const search = ref('');
const date = ref();
const lastPage = ref(1);

const fetchData = async (page = 1) => {
    isLoading.value = true;
    try {
        const params = {
            page: page,
            length: 15, // The backend currently returns 15 anyway
        };

        if (selectedCarId.value) {
            params.car_id = selectedCarId.value;
        }

        if (search.value) {
            params.search = search.value;
        }

        if (date.value) {
            const dates = Array.isArray(date.value) ? date.value : [date.value];
            const formattedDates = dates.map(d => d ? new Date(d).toLocaleDateString('en-CA') : '').filter(Boolean);
            if (formattedDates.length > 0) {
                params.date = formattedDates.join(',');
            }
        }

        const response = await $fetchAdmin(`v1/admin/export/allocations`, {
            method: 'GET',
            params: params
        });
        
        if (response?.data) {
            cars.value = response.data.cars || [];
            allocations.value = response.data.allocations?.data || [];
            paginationConfig.value.data = response.data.allocations || [];
            lastPage.value = response.data.allocations?.last_page || 1;
        }
    } catch (error) {
        console.error('Error fetching export preview data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData(1);
});

watch(selectedCarId, () => {
    fetchData(1);
});

const formatStatus = (status) => {
    const s = parseInt(status);
    if (s === 0) return 'Pending Payment';
    if (s === 1) return 'Pending Verification';
    if (s === 2) return 'Completed';
    if (s === 3 || s === -1) return 'Cancelled/Rejected';
    return 'Unknown';
};

const handleExport = async () => {
    const params = {};
    if (selectedCarId.value) {
        params.car_id = selectedCarId.value;
    }
    if (search.value) {
        params.search = search.value;
    }
    if (date.value) {
        const dates = Array.isArray(date.value) ? date.value : [date.value];
        const formattedDates = dates.map(d => d ? new Date(d).toLocaleDateString('en-CA') : '').filter(Boolean);
        if (formattedDates.length > 0) {
            params.date = formattedDates.join(',');
        }
    }
    
    try {
        const response = await $fetchAdmin(`v1/admin/export/allocations/download`, { 
            method: 'GET',
            params: params,
            responseType: 'blob' 
        });
        const blob = new Blob([response], { type: 'text/csv' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `allocation_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
        console.error('Failed to export:', e);
    }
};
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <!-- Page header -->
        <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
                <h1 class="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Export Allocations</h1>
            </div>

            <!-- Header actions -->
            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <!-- Export button -->
                <button @click="handleExport" class="btn bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center px-4 py-2 rounded">
                    <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span class="hidden xs:block ml-2">Export CSV</span>
                </button>
            </div>
        </div>

        <div class="w-full flex flex-wrap md:flex-nowrap items-center gap-4 mb-8">
            <div class="flex items-center gap-2 w-full md:w-auto">
                <label for="search" class="text-gray-800 dark:text-gray-200">Search</label>
                <LazyInputText type="text" v-model="search" @keyup.enter="fetchData(1)" class="w-full md:w-auto" placeholder="Search by user or slug..." />
            </div>
            <div class="flex items-center gap-2 w-full md:w-auto">
                <label class="text-gray-800 dark:text-gray-200">Date</label>
                <DatePicker v-model="date" selectionMode="range" :manualInput="false" placeholder="Select Date Range" class="w-full md:w-auto" />
            </div>
            <div class="flex items-center gap-2 w-full md:w-auto">
                <label class="text-gray-800 dark:text-gray-200">Asset</label>
                <Select 
                    v-model="selectedCarId" 
                    :options="cars" 
                    optionLabel="item_name" 
                    optionValue="id" 
                    placeholder="All Cars" 
                    class="w-full md:w-48"
                    showClear
                >
                    <template #option="slotProps">
                        <span>{{ slotProps.option.item_name || slotProps.option.assetable?.asset_name || `Car #${slotProps.option.id}` }}</span>
                    </template>
                    <template #value="slotProps">
                        <span v-if="slotProps.value">{{ cars.find(c => c.id === slotProps.value)?.item_name || cars.find(c => c.id === slotProps.value)?.assetable?.asset_name || `Car #${slotProps.value}` }}</span>
                        <span v-else>All Cars</span>
                    </template>
                </Select>
            </div>
            <Button label="Search" @click="fetchData(1)" />
        </div>

        <!-- Table -->
        <div class="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            <header class="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 class="font-semibold text-slate-800 dark:text-slate-100">Data Preview <span class="text-slate-400 dark:text-slate-500 font-medium">(First 15 records shown)</span></h2>
            </header>
            
            <div class="p-3">
                <div v-if="isLoading" class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
                
                <div class="overflow-x-auto" v-else>
                    <table class="table-auto w-full dark:text-slate-300">
                        <thead class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">First Name</div></th>
                                <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">Second Name</div></th>
                                <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">Email</div></th>
                                <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">Asset</div></th>
                                <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-semibold text-right">Total (£)</div></th>
                                <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">Status</div></th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                            <tr v-if="allocations.length === 0">
                                <td colspan="6" class="px-2 first:pl-5 last:pr-5 py-3 text-center text-slate-500">No data available for export</td>
                            </tr>
                            <tr v-for="item in allocations" :key="item.id" v-else>
                                <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div class="text-left">{{ item.user?.user_info?.first_name || item.user?.first_name || 'N/A' }}</div>
                                </td>
                                <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div class="text-left">{{ item.user?.user_info?.last_name || item.user?.last_name || 'N/A' }}</div>
                                </td>
                                <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div class="text-left">{{ item.user?.email || 'N/A' }}</div>
                                </td>
                                <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div class="text-left">{{ item.fractional_item?.item_name || item.fractional_item?.assetable?.asset_name || 'N/A' }}</div>
                                </td>
                                <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div class="text-right font-medium text-emerald-500">{{ item.total_amount }}</div>
                                </td>
                                <td class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                                    <div class="text-left">
                                        <div class="inline-flex font-medium rounded-full text-center px-2.5 py-0.5" 
                                            :class="{
                                                'bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400': item.status === 2,
                                                'bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400': item.status === 0 || item.status === 1,
                                                'bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400': item.status === 3 || item.status === -1
                                            }">
                                            {{ formatStatus(item.status) }}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <LazyPagination v-if="!isLoading && lastPage > 1" class="px-4 pb-4" :config="paginationConfig" @loadData="fetchData" />
        </div>
        
    </div>
</template>
