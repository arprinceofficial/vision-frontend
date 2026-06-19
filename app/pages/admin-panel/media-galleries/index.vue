<script setup>
import UploadTab from '@/components/MediaGallery/Tabs/Upload.vue';
import EditMediaModal from './components/EditMediaModal.vue';

definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const { $optionsList } = useNuxtApp();
const optionsList = $optionsList();
const route = useRoute();

const status = ref(optionsList[0]);
const search = ref('');
const categories = ref([]);
const selectedCategoryId = ref('');
const data = ref([]);
const isLoading = ref(false);
const permissions = ref({ edit: true, delete: true, add: true }); // Defaulted to true, adjust if API sends them

const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: ''
});

const loadCategories = async () => {
    try {
        const getData = await $fetchAdmin('v1/admin/media-categories/all', {
            method: 'POST',
            body: { paginate: false, status: 1 }
        });
        categories.value = getData.data?.data || getData.data || [];
    } catch (e) {
        console.error("Failed to load categories.");
    }
};

const loadData = async () => {
    isLoading.value = true;
    try {
        const requestBody = {
            paginate: true,
            page: route.query.page || 1,
            length: 24,
            search: search.value,
            status: status.value.key === 'status' ? status.value.value : '',
            trashed: status.value.key === 'trashed' ? 'only' : ''
        };
        if (selectedCategoryId.value) {
            requestBody.cat_id = selectedCategoryId.value;
        }

        const getData = await $fetchAdmin('v1/admin/media-galleries/all', {
            method: 'POST',
            body: requestBody
        });

        data.value = getData.data?.data || getData.data || [];
        if (getData.data?.meta) {
            paginationConfig.value.data = getData.data.meta;
        }
        if (getData.data?.permissions) {
            permissions.value = getData.data.permissions;
        }
    } catch (e) {
        console.error('Failed to load media galleries', e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadCategories();
    loadData();
});

watch(() => route.query, () => {
    loadData();
});

const defineUrl = (item) => {
    return item.content || item.file_url || item.url || item.path || item.image || item.file;
};

const isVideo = (url) => {
    if (!url) return false;
    const ext = url.split('.').pop().toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv'].includes(ext);
};

const resetPagination = () => {
    const query = { ...route.query };
    delete query.page;
    navigateTo({ query }, { replace: true });
};

const onChangeHandler = () => {
    resetPagination();
    loadData();
};

const clearAll = () => {
    search.value = '';
    selectedCategoryId.value = '';
    status.value = optionsList[0];
    onChangeHandler();
};

const formatSize = (bytes) => {
    if (bytes === 0 || !bytes) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Upload Modal
const isUploadModalOpen = ref(false);
const handleUploadSuccess = () => {
    isUploadModalOpen.value = false;
    loadData();
};

// Edit Modal
const isEditModalOpen = ref(false);
const editItemParams = ref({});
const openEditModal = (item) => {
    editItemParams.value = item;
    isEditModalOpen.value = true;
};
const handleEditSuccess = () => {
    isEditModalOpen.value = false;
    loadData();
};

// Delete Modal
const isOpenConModal = ref(false);
const response_modal = ref({});
const deleteId = ref(null);

const openDeleteModal = (id) => {
    deleteId.value = id;
    isOpenConModal.value = true;
};

const deleteHandler = async () => {
    response_modal.value = {};
    try {
        const getData = await $fetchAdmin(`v1/admin/media-galleries/${deleteId.value}`, {
            method: 'DELETE',
        });

        if (getData.status === true) {
            response_modal.value = getData;
            data.value = data.value.filter(row => row.id !== deleteId.value);
        }
    } catch (e) {
        response_modal.value = e.response?._data || { message: 'Failed to delete.' };
    } finally {
        isOpenConModal.value = false;
    }
};

const restoreHandler = async (id) => {
    response_modal.value = {};
    try {
        const getData = await $fetchAdmin(`v1/admin/media-galleries/restore/${id}`, {
            method: 'POST',
        });

        if (getData.status === true) {
            response_modal.value = getData;
            data.value = data.value.filter(row => row.id !== id);
        }
    } catch (e) {
        response_modal.value = e.response?._data || { message: 'Failed to restore.' };
    }
};
</script>

<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <!-- Header Filter Bar -->
            <div class="w-full flex flex-wrap lg:flex-nowrap justify-between items-center gap-4 mb-6">
                <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <!-- Category -->
                    <div class="w-full sm:w-48">
                        <Select v-model="selectedCategoryId" :options="categories" optionLabel="category_name"
                            optionValue="id" placeholder="All Categories" class="w-full" filter showClear
                            @change="onChangeHandler" />
                    </div>
                    <!-- Status -->
                    <div class="w-full sm:w-48">
                        <Select v-model="status" :options="optionsList" optionLabel="name" @change="onChangeHandler" placeholder="Status" class="w-full" />
                    </div>
                    <!-- Search -->
                    <div class="w-full sm:w-56">
                        <span class="p-input-icon-left w-full relative">
                            <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <LazyInputText v-model="search" placeholder="Search title..." @keyup.enter="onChangeHandler"
                                class="w-full pl-10" />
                        </span>
                    </div>
                    <Button icon="pi pi-refresh" severity="secondary" text @click="clearAll"
                        v-tooltip.top="'Clear Filters'" />
                </div>

                <div class="flex items-center gap-3">
                    <Button v-if="permissions.add" label="Upload Media" icon="pi pi-cloud-upload" severity="primary"
                        @click="isUploadModalOpen = true" />
                </div>
            </div>

            <!-- Content Area -->
            <div
                class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
                <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100"><i
                            class="pi pi-images mr-2 text-sky-500"></i>Media Library</h2>
                </div>

                <div class="p-4 min-h-[400px]">
                    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <Skeleton v-for="i in 12" :key="i" width="100%" height="160px" class="rounded-xl" />
                    </div>
                    <div v-else-if="data.length === 0"
                        class="flex flex-col items-center justify-center py-20 text-gray-400">
                        <i class="pi pi-image text-6xl mb-4 opacity-30"></i>
                        <p class="text-lg">No media found.</p>
                        <Button label="Upload Your First Media" text icon="pi pi-plus" class="mt-4"
                            @click="isUploadModalOpen = true" />
                    </div>
                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div v-for="item in data" :key="item.id"
                            class="group relative bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <!-- Thumbnail -->
                            <div
                                class="aspect-square relative flex items-center justify-center bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                <template v-if="isVideo(defineUrl(item))">
                                    <video :src="defineUrl(item)" class="w-full h-full object-cover" muted loop
                                        playsinline @mouseover="$event.target.play()"
                                        @mouseleave="$event.target.pause()"></video>
                                    <div
                                        class="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                                        <i class="pi pi-video text-white text-3xl opacity-80 drop-shadow-md"></i>
                                    </div>
                                </template>
                                <template v-else>
                                    <img :src="defineUrl(item)" class="w-full h-full object-cover" alt="Media"
                                        @error="item.imgError = true" />
                                    <div v-if="item.imgError"
                                        class="absolute inset-0 flex items-center justify-center bg-gray-100 p-2 text-center text-xs text-red-500">
                                        Failed to load URL</div>
                                </template>
                            </div>

                            <!-- Information Bar -->
                            <div class="p-3 bg-white dark:bg-gray-800 h-20">
                                <div class="font-medium text-sm text-gray-800 dark:text-gray-100 truncate w-full"
                                    :title="item.content_title">{{
                                        item.content_title || 'Untitled File' }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">{{
                                    item.category?.category_name ||
                                    'Uncategorized' }}</div>
                                <div class="flex justify-between items-center mt-2 text-[10px] text-gray-400">
                                    <span>{{ formatSize(item.content_size) }}</span>
                                    <span v-if="status.key === 'trashed'"
                                        class="text-red-400 font-bold uppercase">Trashed</span>
                                    <span v-else-if="item.status === 1 || item.status === true" class="text-green-500" title="Active"><i class="pi pi-check-circle"></i></span>
                                    <span v-else class="text-red-400" title="Inactive"><i class="pi pi-times-circle"></i></span>
                                </div>
                            </div>

                            <!-- Action Overlay Map -->
                            <div
                                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                <template v-if="status.key === 'trashed' && permissions.delete">
                                    <Button icon="pi pi-refresh" rounded severity="success" aria-label="Restore"
                                        v-tooltip.top="'Restore'" @click="restoreHandler(item.id)" />
                                </template>
                                <template v-else>
                                    <Button v-if="permissions.edit" icon="pi pi-pencil" rounded severity="info"
                                        aria-label="Edit" v-tooltip.top="'Edit Details'" @click="openEditModal(item)" />
                                    <Button v-if="permissions.delete" icon="pi pi-trash" rounded severity="danger"
                                        aria-label="Delete" v-tooltip.top="'Delete Media'"
                                        @click="openDeleteModal(item.id)" />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="border-t border-gray-200 dark:border-gray-700 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl flex justify-center">
                    <LazyPagination v-if="paginationConfig.data?.total > 0 && !isLoading" :config="paginationConfig" />
                </div>
            </div>

            <!-- Global Modals -->
            <Dialog v-model:visible="isUploadModalOpen" modal header="Upload New Media" :style="{ width: '800px' }"
                :draggable="false">
                <UploadTab @uploadSuccess="handleUploadSuccess" />
            </Dialog>
            <EditMediaModal :isOpenModal="isEditModalOpen" :item="editItemParams" :categories="categories"
                @close="isEditModalOpen = false" @updated="handleEditSuccess" />
            <LazyConfirmModal :isOpenConModal="isOpenConModal" @confirm="deleteHandler"
                @update:isOpenConModal="isOpenConModal = $event" />
            <LazyResponseModal :response_modal="response_modal" />
        </div>
    </div>
</template>

<style scoped>
/* Specific clean UI touches */
.p-input-icon-left>i {
    z-index: 10;
}
</style>
