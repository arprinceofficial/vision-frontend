<script setup>
import { ref, onMounted, watch } from 'vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth-admin']
});

const isLoading = ref(true);
const dataList = ref([]);
const cars = ref([]);
const selectedCarId = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const lastPage = ref(1);

const fetchData = async (page = 1) => {
    isLoading.value = true;
    try {
        let url = `v1/admin/reports/allocations?page=${page}`;
        if (selectedCarId.value) url += `&car_id=${selectedCarId.value}`;
        if (selectedStatus.value !== '') url += `&status=${selectedStatus.value}`;
        
        const response = await $fetchAdmin(url);
        
        if (response?.data) {
            cars.value = response.data.cars || [];
            dataList.value = response.data.allocations?.data || [];
            currentPage.value = response.data.allocations?.current_page || 1;
            lastPage.value = response.data.allocations?.last_page || 1;
        }
    } catch (error) {
        console.error('Error fetching report data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => fetchData());

watch([selectedCarId, selectedStatus], () => fetchData(1));

const formatStatus = (status) => {
    const s = parseInt(status);
    if (s === 0) return 'Pending Payment';
    if (s === 1) return 'Pending Verification';
    if (s === 2) return 'Completed';
    if (s === 3 || s === -1) return 'Cancelled/Rejected';
    return 'Unknown';
};

const handleExport = async (format) => {
    let url = `v1/admin/reports/allocations?format=${format}`;
    if (selectedCarId.value) url += `&car_id=${selectedCarId.value}`;
    if (selectedStatus.value !== '') url += `&status=${selectedStatus.value}`;
    
    try {
        const response = await $fetchAdmin(url, { responseType: 'blob' });
        const contentType = format === 'csv' ? 'text/csv' : 'application/pdf';
        const extension = format === 'csv' ? 'csv' : 'pdf';
        const blob = new Blob([response], { type: contentType });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `allocations_report_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
        console.error(`Failed to export ${format}:`, e);
    }
};
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
                <h1 class="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Allocations Report</h1>
            </div>

            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <select v-model="selectedStatus" class="form-select bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500">
                    <option value="">All Statuses</option>
                    <option value="0">Pending Payment</option>
                    <option value="1">Pending Verification</option>
                    <option value="2">Completed</option>
                    <option value="3">Cancelled/Rejected</option>
                </select>

                <select v-model="selectedCarId" class="form-select bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500">
                    <option value="">All Cars</option>
                    <option v-for="car in cars" :key="car.id" :value="car.id">
                        {{ car.item_name || car.assetable?.asset_name || `Car #${car.id}` }}
                    </option>
                </select>

                <button @click="handleExport('csv')" class="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                    <span class="hidden xs:block">Export CSV</span>
                </button>
                <button @click="handleExport('pdf')" class="btn bg-rose-500 hover:bg-rose-600 text-white">
                    <span class="hidden xs:block">Export PDF</span>
                </button>
            </div>
        </div>

        <div class="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
            <header class="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 class="font-semibold text-slate-800 dark:text-slate-100">Data Preview</h2>
            </header>
            
            <div class="p-3">
                <div v-if="isLoading" class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
                
                <div class="overflow-x-auto" v-else>
                    <table class="table-auto w-full dark:text-slate-300">
                        <thead class="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
                            <tr>
                                <th class="px-2 first:pl-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">Customer</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Asset</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-right">Shares</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-right">Total (£)</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Status</div></th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-slate-200">
                            <tr v-if="dataList.length === 0">
                                <td colspan="5" class="px-2 py-3 text-center text-slate-500">No data available</td>
                            </tr>
                            <tr v-for="item in dataList" :key="item.id" v-else>
                                <td class="px-2 first:pl-5 py-3 whitespace-nowrap">
                                    <div class="text-left font-medium">{{ item.user?.user_info?.first_name || item.user?.first_name }} {{ item.user?.user_info?.last_name || item.user?.last_name }}</div>
                                    <div class="text-xs text-slate-500">{{ item.user?.email }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left">{{ item.fractional_item?.item_name || item.fractional_item?.assetable?.asset_name || 'N/A' }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-right">{{ item.shares_count }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-right font-medium text-emerald-500">{{ item.total_amount }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left">
                                        <div class="inline-flex font-medium rounded-full text-center px-2.5 py-0.5" 
                                            :class="{
                                                'bg-emerald-100 text-emerald-600': item.status === 2,
                                                'bg-amber-100 text-amber-600': item.status === 0 || item.status === 1,
                                                'bg-rose-100 text-rose-500': item.status === 3 || item.status === -1
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
        </div>
        
        <div class="mt-8" v-if="lastPage > 1">
            <div class="flex justify-between items-center w-full">
                <button :disabled="currentPage <= 1" @click="fetchData(currentPage - 1)" class="btn bg-white border-slate-200 text-slate-500 disabled:opacity-50">Previous</button>
                <div class="text-sm text-slate-500">
                    Page <span class="font-medium text-slate-800">{{ currentPage }}</span> of <span class="font-medium text-slate-800">{{ lastPage }}</span>
                </div>
                <button :disabled="currentPage >= lastPage" @click="fetchData(currentPage + 1)" class="btn bg-white border-slate-200 text-slate-500 disabled:opacity-50">Next</button>
            </div>
        </div>
    </div>
</template>
