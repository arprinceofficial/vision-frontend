<script setup>
import { ref, onMounted, watch } from 'vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth-admin']
});

const isLoading = ref(true);
const dataList = ref([]);
const selectedMethod = ref('');
const currentPage = ref(1);
const lastPage = ref(1);

const fetchData = async (page = 1) => {
    isLoading.value = true;
    try {
        let url = `v1/admin/reports/payments?page=${page}`;
        if (selectedMethod.value !== '') url += `&payment_method=${selectedMethod.value}`;
        
        const response = await $fetchAdmin(url);
        
        if (response?.data) {
            dataList.value = response.data.payments?.data || [];
            currentPage.value = response.data.payments?.current_page || 1;
            lastPage.value = response.data.payments?.last_page || 1;
        }
    } catch (error) {
        console.error('Error fetching report data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => fetchData());

watch([selectedMethod], () => fetchData(1));

const handleExport = async (format) => {
    let url = `v1/admin/reports/payments?format=${format}`;
    if (selectedMethod.value !== '') url += `&payment_method=${selectedMethod.value}`;
    
    try {
        const response = await $fetchAdmin(url, { responseType: 'blob' });
        const contentType = format === 'csv' ? 'text/csv' : 'application/pdf';
        const extension = format === 'csv' ? 'csv' : 'pdf';
        const blob = new Blob([response], { type: contentType });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `payments_report_${new Date().toISOString().split('T')[0]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
        console.error(`Failed to export ${format}:`, e);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { 
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
};
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
                <h1 class="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Payments Report</h1>
            </div>

            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <select v-model="selectedMethod" class="form-select bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500">
                    <option value="">All Payment Methods</option>
                    <option value="stripe">Stripe</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
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
                                <th class="px-2 first:pl-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">ID</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Customer</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Method</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-right">Amount (£)</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Status</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Date</div></th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-slate-200">
                            <tr v-if="dataList.length === 0">
                                <td colspan="6" class="px-2 py-3 text-center text-slate-500">No data available</td>
                            </tr>
                            <tr v-for="item in dataList" :key="item.id" v-else>
                                <td class="px-2 first:pl-5 py-3 whitespace-nowrap">
                                    <div class="text-left">#{{ item.id }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left font-medium">{{ item.user?.user_info?.first_name || item.user?.first_name }} {{ item.user?.user_info?.last_name || item.user?.last_name }}</div>
                                    <div class="text-xs text-slate-500">{{ item.user?.email }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left capitalize">{{ (item.payment_method || 'N/A').replace('_', ' ') }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-right font-medium text-emerald-500">{{ item.amount }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left">
                                        <div class="inline-flex font-medium rounded-full text-center px-2.5 py-0.5" 
                                            :class="item.status === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'">
                                            {{ item.status === 1 ? 'Completed' : 'Pending' }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left">{{ formatDate(item.paid_at || item.created_at) }}</div>
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
