<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth-admin']
});

const isLoading = ref(true);
const dataList = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);

const fetchData = async (page = 1) => {
    isLoading.value = true;
    try {
        let url = `v1/admin/reports/email-logs?page=${page}`;
        const response = await $fetchAdmin(url);
        
        if (response?.data) {
            dataList.value = response.data.email_logs?.data || [];
            currentPage.value = response.data.email_logs?.current_page || 1;
            lastPage.value = response.data.email_logs?.last_page || 1;
        }
    } catch (error) {
        console.error('Error fetching report data:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => fetchData());

const handleExport = async (format) => {
    let url = `v1/admin/reports/email-logs?format=${format}`;
    
    try {
        const response = await $fetchAdmin(url, { responseType: 'blob' });
        const contentType = format === 'csv' ? 'text/csv' : 'application/pdf';
        const extension = format === 'csv' ? 'csv' : 'pdf';
        const blob = new Blob([response], { type: contentType });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `email_logs_report_${new Date().toISOString().split('T')[0]}.${extension}`;
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
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
    });
};
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div class="sm:flex sm:justify-between sm:items-center mb-8">
            <div class="mb-4 sm:mb-0">
                <h1 class="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Email Report</h1>
            </div>

            <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
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
                                <th class="px-2 first:pl-5 py-3 whitespace-nowrap"><div class="font-semibold text-left">Email Address</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Subject</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Status</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Error</div></th>
                                <th class="px-2 py-3 whitespace-nowrap"><div class="font-semibold text-left">Sent At</div></th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-slate-200">
                            <tr v-if="dataList.length === 0">
                                <td colspan="5" class="px-2 py-3 text-center text-slate-500">No data available</td>
                            </tr>
                            <tr v-for="log in dataList" :key="log.id" v-else>
                                <td class="px-2 first:pl-5 py-3 whitespace-nowrap">
                                    <div class="text-left font-medium">{{ log.email || 'N/A' }}</div>
                                    <div class="text-xs text-slate-500">ID: {{ log.id }}</div>
                                </td>
                                <td class="px-2 py-3">
                                    <div class="text-left truncate max-w-xs" :title="log.subject">{{ log.subject || 'N/A' }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left">
                                        <div class="inline-flex font-medium rounded-full text-center px-2.5 py-0.5" 
                                            :class="log.status == 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'">
                                            {{ log.status == 1 ? 'Sent' : 'Failed' }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left text-rose-500">{{ log.error_message || '-' }}</div>
                                </td>
                                <td class="px-2 py-3 whitespace-nowrap">
                                    <div class="text-left">{{ formatDate(log.created_at) }}</div>
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
