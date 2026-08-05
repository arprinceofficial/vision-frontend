<script setup>
const UploadModal = defineAsyncComponent(() => import('./components/UploadModal.vue'));

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
const permissions = ref({ edit: true, view: true });

const loadData = async () => {
    isLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/allocation-requests-without-documents`, {
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

// Upload Modal
const isOpenUploadModal = ref(false);
const selectedRequestId = ref(null);

const openUploadModal = (id) => {
    selectedRequestId.value = id;
    isOpenUploadModal.value = true;
};

const closeUploadModal = () => {
    selectedRequestId.value = null;
    isOpenUploadModal.value = false;
};

const handleUploadSuccess = () => {
    response_modal.value = { status: true, message: 'Documents uploaded successfully.' };
    closeUploadModal();
    loadData();
};
</script>

<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
                <div class="w-full md:w-auto flex flex-wrap gap-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Requests Without Documents</h3>
                </div>
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto w-full text-left">
                                <thead class="sticky z-10 top-0 bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th class="py-2 px-3">ID / Slug</th>
                                        <th class="py-2 px-3">Item Name</th>
                                        <th class="py-2 px-3">User</th>
                                        <th class="py-2 px-3 text-center">Status</th>
                                        <th class="py-2 px-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading">
                                    <tr v-for="index in 5" :key="index">
                                        <td v-for="col in 5" :key="col" class="py-2 px-3 text-center">
                                            <Skeleton width="100%" height="1.5rem"></Skeleton>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(item, index) in data" :key="index" class="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="text-sm font-semibold">#{{ item.id }}</div>
                                            <div class="text-xs text-gray-500">{{ item.slug }}</div>
                                        </td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">
                                            {{ item.fractional_item?.assetable?.asset_name || item.fractional_item?.item_name || 'N/A' }}
                                        </td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="text-sm">{{ item.user?.first_name }} {{ item.user?.last_name }}</div>
                                            <div class="text-xs text-gray-500">{{ item.user?.email }}</div>
                                        </td>
                                        <td class="py-2 px-3 text-center">
                                            <span class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">{{ item.status }}</span>
                                        </td>
                                        <td class="py-2 px-3 text-center">
                                            <button v-if="permissions.edit" @click="openUploadModal(item.id)" class="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 font-semibold" title="Upload Documents">
                                                <i class="fa-solid fa-upload mr-1"></i> Upload Docs
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="data.length === 0">
                                        <td colspan="5" class="text-center py-4 text-gray-500">No requests missing documents found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <LazyPagination v-if="!isLoading && paginationConfig?.data?.last_page > 1" class="px-4" :config="paginationConfig" />
                    <LazyResponseModal :response_modal="response_modal" />
                    
                    <UploadModal :isOpenModal="isOpenUploadModal" :requestId="selectedRequestId" @close="closeUploadModal" @submit="handleUploadSuccess" />
                </div>
            </div>
        </div>
    </div>
</template>
