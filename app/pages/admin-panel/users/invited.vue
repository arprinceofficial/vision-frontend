<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const { $optionsListAcIn } = useNuxtApp();
const optionsList = $optionsListAcIn();

const search = ref('');
const status = ref(optionsList[0]);
const isLoading = ref(false);
const data = ref([]);
const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: ''
});

const loadData = async () => {
    isLoading.value = true;
    try {
        const queryParams = new URLSearchParams({
            paginate: true,
            page: 1, // Defaulting to 1 for simplicity, can read from route.query if needed
            length: 10,
            search: search.value,
        });

        if (status.value.key === 'status') {
            queryParams.append('status', status.value.value);
        }

        const response = await $fetchAdmin(`v1/admin/onboarding/invitations?${queryParams.toString()}`, {
            method: 'GET'
        });
        
        data.value = response.data.data;
        paginationConfig.value.data = response.data.meta || {};
    } catch (e) {
        console.error('Failed to load invited users:', e.message);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadData();
});

const formatInvestmentType = (type) => {
    if (!type) return 'N/A';
    const parts = type.split('_');
    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

</script>
<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="w-full flex justify-between items-center gap-4 mb-4">
                <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">Invited Users</h1>
                <div class="flex gap-2">
                    <Button label="Add New User" @click="$router.push('/admin-panel/users/add')" class="text-xs" />
                    <Button label="Registered Users" @click="$router.push('/admin-panel/users')" class="text-xs" severity="success" />
                </div>
            </div>
            
            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto w-full text-center">
                                <thead class="sticky z-10 top-0 bg-[#1e293b] text-white">
                                    <tr>
                                        <th class="py-3 px-4 rounded-tl-md">
                                            Name
                                        </th>
                                        <th class="py-3 px-4">
                                            Email
                                        </th>
                                        <th class="py-3 px-4">
                                            Investment Type
                                        </th>
                                        <th class="py-3 px-4">
                                            Status
                                        </th>
                                        <th class="py-3 px-4">
                                            Invited On
                                        </th>
                                        <th class="py-3 px-4 rounded-tr-md">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading">
                                    <tr v-for="index in 5" :key="index">
                                        <td colspan="6" class="p-4">
                                            <Skeleton width="100%" height="2rem" />
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-if="data.length === 0">
                                        <td colspan="6" class="p-6 text-center text-gray-500">No invited users found.</td>
                                    </tr>
                                    <tr v-for="(item, index) in data" :key="index" class="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td class="py-4 px-4 text-sm text-gray-800 dark:text-gray-200">
                                            {{ item.first_name }} {{ item.last_name }}
                                        </td>
                                        <td class="py-4 px-4 text-sm text-gray-800 dark:text-gray-200">
                                            {{ item.email }}
                                        </td>
                                        <td class="py-4 px-4 text-sm text-gray-800 dark:text-gray-200">
                                            {{ formatInvestmentType(item.investment_type) }}
                                        </td>
                                        <td class="py-4 px-4">
                                            <span v-if="item.status === 'completed'" class="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Completed</span>
                                            <span v-else-if="item.status === 'pending'" class="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">Pending</span>
                                            <span v-else class="bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">{{ item.status || 'N/A' }}</span>
                                        </td>
                                        <td class="py-4 px-4 text-sm text-gray-800 dark:text-gray-200">
                                            {{ formatDate(item.created_at) }}
                                        </td>
                                        <td class="py-4 px-4 flex justify-center items-center gap-2">
                                            <span v-if="item.status === 'completed'" class="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                                <i class="pi pi-check"></i> Account Created
                                            </span>
                                            <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm bg-gray-800 text-white hover:bg-gray-700 w-8 h-8 flex items-center justify-center" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <LazyPagination v-if="!isLoading && data.length > 0" class="px-4 pb-4" :config="paginationConfig" />
                </div>
            </div>
        </div>
    </div>
</template>
