<script setup>
import { ref, onMounted, watch, computed } from 'vue';

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
const appliedCarId = ref(null);

const search = ref('');
const date = ref();
const lastPage = ref(1);
const totalRecords = ref(0);

const fetchData = async (page = 1) => {
    isLoading.value = true;
    try {
        const params = {
            page: page,
            length: 15, // The backend currently returns 15 anyway
        };

        if (appliedCarId.value) {
            params.car_id = appliedCarId.value;
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
            // Backend might still return cars, but we'll fetch them separately
            allocations.value = response.data.allocations?.data || [];
            paginationConfig.value.data = response.data.allocations || [];
            lastPage.value = response.data.allocations?.last_page || 1;
            totalRecords.value = response.data.allocations?.total || 0;
        }
    } catch (error) {
        console.error('Error fetching export preview data:', error);
    } finally {
        isLoading.value = false;
    }
};

const fetchFractionalItems = async () => {
    try {
        const itemRes = await $fetchAdmin('v1/admin/fractional-items', {
            method: 'GET'
        });
        const list = itemRes?.data?.data ?? itemRes?.data ?? [];
        cars.value = Array.isArray(list) ? list : [];
    } catch (error) {
        console.error('Error fetching fractional items:', error);
    }
};

onMounted(() => {
    fetchFractionalItems();
    fetchData(1);
});

const generateReport = () => {
    appliedCarId.value = selectedCarId.value;
    fetchData(1);
};

const resetFilter = () => {
    selectedCarId.value = null;
    appliedCarId.value = null;
    search.value = '';
    date.value = null;
    fetchData(1);
};

const formatStatus = (status) => {
    const s = parseInt(status);
    if (s === 0) return 'Pending Payment';
    if (s === 1) return 'Pending Verification';
    if (s === 2) return 'Accepted';
    if (s === 3 || s === -1) return 'Cancelled/Rejected';
    return 'Requested';
};

const formatCurrency = (value) => {
    if (!value) return '£0.00';
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().split('T')[0];
};

const formatAddress = (user) => {
    if (!user || !user.user_info) return 'N/A';
    const ui = user.user_info;
    const parts = [
        ui.house_no,
        ui.street_address || ui.street,
        ui.city || ui.town,
        ui.postal_code || ui.postcode
    ].filter(p => p && p.trim() !== '');
    return parts.length > 0 ? parts.join(', ') : 'N/A';
};

const handleExport = async () => {
    const params = {};
    if (appliedCarId.value) {
        params.car_id = appliedCarId.value;
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

const activeCarName = computed(() => {
    if (!appliedCarId.value || !cars.value.length) return null;
    const car = cars.value.find(c => c.id === appliedCarId.value);
    return car ? (car.item_name || car.assetable?.asset_name) : null;
});
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <!-- Page header -->
        <div class="mb-6">
            <h1 class="text-2xl md:text-3xl text-[#2d3a4a] font-bold mb-1">Allocation Data Export & Report</h1>
            <p class="text-sm text-gray-500">Select a car to filter allocations or view/export overall car allocation records.</p>
        </div>

        <!-- Filter Card -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm mb-6">
            <div class="px-5 py-3 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <i class="fa-solid fa-filter text-blue-900 dark:text-blue-400"></i> Filter & Generate Report
            </div>
            <div class="p-5 flex flex-wrap items-end gap-4">
                <div class="w-full md:w-1/3">
                    <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Select Fractional Item</label>
                        <Select 
                        v-model="selectedCarId" 
                        :options="cars" 
                        optionLabel="item_name" 
                        optionValue="id" 
                        placeholder="-- All Cars (Show All Data) --" 
                        class="w-full"
                        panelClass="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    >
                        <template #option="slotProps">
                            <span>{{ slotProps.option.item_name || slotProps.option.assetable?.asset_name || `Car #${slotProps.option.id}` }}</span>
                        </template>
                        <template #value="slotProps">
                            <span v-if="slotProps.value">{{ cars.find(c => c.id === slotProps.value)?.item_name || cars.find(c => c.id === slotProps.value)?.assetable?.asset_name || `Car #${slotProps.value}` }}</span>
                            <span v-else>-- All Cars (Show All Data) --</span>
                        </template>
                    </Select>
                </div>
                
                <div class="flex gap-2">
                    <button @click="generateReport" class="bg-[#1e2f4a] hover:bg-gray-800 text-white px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors">
                        <i class="fa-solid fa-search"></i> Get Report
                    </button>
                    <button v-if="appliedCarId || search || date" @click="resetFilter" class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors">
                        <i class="fa-solid fa-rotate-left"></i> Reset Filter
                    </button>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden">
            <div class="px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div>
                    <h2 class="font-bold text-[#1e2f4a] dark:text-gray-200 flex items-center gap-2 mb-1">
                        <i class="fa-solid fa-table"></i> Report Preview 
                        <span v-if="activeCarName" class="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full font-medium ml-2">{{ activeCarName }}</span>
                    </h2>
                    <p class="text-xs text-gray-500">Total: {{ totalRecords }} records found</p>
                </div>
                
                <button @click="handleExport" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-medium flex items-center gap-2 text-sm transition-colors shadow-sm">
                    <i class="fa-solid fa-download"></i> Download CSV / Excel
                </button>
            </div>
            
            <div class="">
                <div v-if="isLoading" class="text-center py-12">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
                
                <div class="overflow-x-auto" v-else>
                    <table class="w-full text-left text-sm whitespace-nowrap">
                        <thead class="bg-[#1e2f4a] text-white">
                            <tr>
                                <th class="px-3 py-3 font-semibold">First Name</th>
                                <th class="px-3 py-3 font-semibold">Second Name</th>
                                <th class="px-3 py-3 font-semibold">Email address</th>
                                <th class="px-3 py-3 font-semibold">Asset</th>
                                <th class="px-3 py-3 font-semibold">Allocation value</th>
                                <th class="px-3 py-3 font-semibold text-center">Number of allocations</th>
                                <th class="px-3 py-3 font-semibold">Total value (£)</th>
                                <th class="px-3 py-3 font-semibold">Purchase Date</th>
                                <th class="px-3 py-3 font-semibold">Asset Funded Date</th>
                                <th class="px-3 py-3 font-semibold">Address</th>
                                <th class="px-3 py-3 font-semibold text-center">Reference ID</th>
                                <th class="px-3 py-3 font-semibold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-if="allocations.length === 0">
                                <td colspan="12" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No data available for export</td>
                            </tr>
                            <tr v-for="item in allocations" :key="item.id" v-else class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td class="px-3 py-3 text-gray-800 dark:text-gray-200">{{ item.user?.user_info?.first_name || item.user?.first_name || 'N/A' }}</td>
                                <td class="px-3 py-3 text-gray-800 dark:text-gray-200">{{ item.user?.user_info?.last_name || item.user?.last_name || 'N/A' }}</td>
                                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ item.user?.email || 'N/A' }}</td>
                                <td class="px-3 py-3 text-gray-800 dark:text-gray-200 font-medium">{{ item.fractional_item?.item_name || item.fractional_item?.assetable?.asset_name || 'N/A' }}</td>
                                <td class="px-3 py-3 text-gray-800 dark:text-gray-200">{{ formatCurrency(item.fractional_item?.price_per_share || 0) }}</td>
                                <td class="px-3 py-3 text-gray-800 dark:text-gray-200 text-center border border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm w-10 h-6 inline-flex justify-center items-center rounded m-2">{{ item.shares_count || 0 }}</td>
                                <td class="px-3 py-3 text-gray-800 dark:text-gray-200 font-medium">{{ formatCurrency(item.total_amount) }}</td>
                                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ formatDate(item.created_at) }}</td>
                                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ formatDate(item.fractional_item?.funded_at) }}</td>
                                <td class="px-3 py-3 text-gray-500 dark:text-gray-400 max-w-xs truncate" :title="formatAddress(item.user)">{{ formatAddress(item.user) }}</td>
                                <td class="px-3 py-3 text-pink-500 text-center font-medium">{{ item.slug || 'N/A' }}</td>
                                <td class="px-3 py-3 text-center">
                                    <span class="inline-flex font-bold rounded-md text-xs px-2 py-1 shadow-sm" 
                                        :class="{
                                            'bg-emerald-500 text-white': item.status === 2,
                                            'bg-amber-400 text-white': item.status === 0 || item.status === 1,
                                            'bg-rose-500 text-white': item.status === 3 || item.status === -1
                                        }">
                                        {{ formatStatus(item.status) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <LazyPagination v-if="!isLoading && lastPage > 1" :config="paginationConfig" @loadData="fetchData" />
            </div>
        </div>
        
    </div>
</template>
