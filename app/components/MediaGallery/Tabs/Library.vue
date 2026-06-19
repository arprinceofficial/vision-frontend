<script setup>
const props = defineProps({
    multiple: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['selectMedia']);

const mediaList = ref([]);
const isLoading = ref(false);
const categories = ref([]);
const selectedCategoryId = ref('');
const searchQuery = ref('');
const selectedMedia = ref(null);
const selectedMediaList = ref([]); // For multiple mode

const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: 'ajax'
});

const loadCategories = async () => {
    try {
        const getData = await $fetchAdmin('v1/admin/media-categories/all', {
            method: 'POST',
            body: { paginate: false, length: 100 }
        });
        categories.value = getData.data?.data || getData.data || [];
    } catch (e) {
        console.error('Failed to load categories', e);
    }
};

const loadMedia = async (page = 1) => {
    isLoading.value = true;
    try {
        const body = {
            paginate: true,
            page: page,
            length: 10,
            search: searchQuery.value || '',
            status: '1',
        };

        if (selectedCategoryId.value) {
            body.cat_id = selectedCategoryId.value;
        }

        const getData = await $fetchAdmin('v1/admin/media-galleries/all', {
            method: 'POST',
            body,
        });

        mediaList.value = getData.data?.data || getData.data || [];
        if (getData.data?.meta) {
            paginationConfig.value.data = getData.data.meta;
        }
    } catch (e) {
        console.error('Failed to fetch media', e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadCategories();
    loadMedia();
});

watch(selectedCategoryId, () => {
    selectedMedia.value = null; // reset selection when category changes
    loadMedia(1);
});

// To receive pagination events if we had access to the component's emitted events:
const handlePageChange = (newPage) => {
    loadMedia(newPage);
};

const selectItem = (item) => {
    if (props.multiple) {
        const url = defineUrl(item);
        const idx = selectedMediaList.value.findIndex((m) => defineUrl(m) === url);
        if (idx > -1) {
            selectedMediaList.value.splice(idx, 1);
        } else {
            selectedMediaList.value.push(item);
        }
    } else {
        selectedMedia.value = item;
    }
};

const isSelected = (item) => {
    if (props.multiple) {
        const url = defineUrl(item);
        return selectedMediaList.value.some((m) => defineUrl(m) === url);
    }
    return selectedMedia.value?.id === item.id;
};

const defineUrl = (item) => {
    return item.content || item.file_url || item.url || item.path || item.file_path || item.image || item.file;
};

const clearAll = () => {
    selectedCategoryId.value = '';
    searchQuery.value = '';
    selectedMedia.value = null;
    selectedMediaList.value = [];
    loadMedia(1);
};

const confirmSelection = () => {
    if (props.multiple) {
        if (selectedMediaList.value.length > 0) {
            const urls = selectedMediaList.value.map((m) => defineUrl(m));
            emit('selectMedia', urls);
        }
    } else {
        if (selectedMedia.value) {
            emit('selectMedia', defineUrl(selectedMedia.value));
        }
    }
};

const selectionCount = computed(() => {
    if (props.multiple) return selectedMediaList.value.length;
    return selectedMedia.value ? 1 : 0;
});

const hasSelection = computed(() => {
    return selectionCount.value > 0;
});

const isVideo = (url) => {
    if (!url) return false;
    const ext = url.split('.').pop().toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext);
};

const getSelectedIndex = (item) => {
    const url = defineUrl(item);
    return selectedMediaList.value.findIndex((m) => defineUrl(m) === url);
};
</script>

<template>
    <div class="flex flex-col h-[500px]">
        <!-- Top filter -->
        <div
            class="flex flex-wrap items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 gap-3">
            <div class="flex gap-2 w-full md:w-auto flex-1">
                <div class="w-1/2 md:w-64">
                    <!-- Added pt-0/pb-0 or standard PrimeVue class for height matching -->
                    <Select v-model="selectedCategoryId" :options="categories" optionLabel="category_name"
                        optionValue="id" placeholder="All Categories" class="w-full text-sm"
                        inputClass="h-[42px] flex items-center" filter showClear />
                </div>
                <div class="w-1/2 md:w-64">
                    <LazyInputText v-model="searchQuery" placeholder="Search media..."
                        class="w-full text-sm h-[45px!important] m-[0!important]" @keyup.enter="loadMedia(1)" />
                </div>
            </div>
            <div class="flex gap-2 h-[42px]">
                <Button label="Clear All" icon="pi pi-filter-slash" severity="danger" text @click="clearAll" />
                <Button label="Refresh" icon="pi pi-refresh" severity="secondary" text @click="loadMedia(1)" />
            </div>
        </div>

        <!-- Grid of media -->
        <div class="flex-1 overflow-y-auto py-4 pr-2 custom-scrollbar">
            <div v-if="isLoading" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <Skeleton v-for="i in 10" :key="i" width="100%" height="100px" class="rounded-lg" />
            </div>
            <div v-else-if="mediaList.length === 0"
                class="flex flex-col items-center justify-center h-full text-gray-400">
                <i class="pi pi-images text-5xl mb-2 opacity-50"></i>
                <p>No media found in the library.</p>
            </div>
            <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 px-2 py-1">
                <div v-for="(item, index) in mediaList" :key="index"
                    class="relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200"
                    :class="isSelected(item) ? 'border-sky-500 shadow-md transform scale-[1.02]' : 'border-transparent hover:border-gray-300'"
                    @click="selectItem(item)" :title="defineUrl(item)">
                    <!-- If it's video -->
                    <template v-if="isVideo(defineUrl(item))">
                        <video :src="defineUrl(item)" class="w-full h-full object-cover bg-gray-100" muted loop
                            playsinline @mouseover="$event.target.play()" @mouseleave="$event.target.pause()"></video>
                        <div class="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                            <i class="pi pi-video text-white text-2xl opacity-75"></i>
                        </div>
                    </template>
                    <!-- If it's image -->
                    <template v-else>
                        <img :src="defineUrl(item)" alt="Media" class="w-full h-full object-cover bg-gray-100"
                            @error="item.imageError = true" />
                        <div v-if="item.imageError"
                            class="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-none p-1">
                            <span class="text-[8px] text-white break-all">{{ Object.keys(item).join(', ') }}<br />{{
                                defineUrl(item) }}</span>
                        </div>
                    </template>

                    <!-- Title Overlay -->
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pt-4 pb-1.5 px-2 pointer-events-none text-center">
                        <span class="text-[11px] text-white font-medium truncate block w-full drop-shadow-md">{{ item.content_title || 'Untitled' }}</span>
                    </div>

                    <!-- Selected Check (single mode) -->
                    <div v-if="!multiple && isSelected(item)"
                        class="absolute top-1 right-1 bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                        <i class="pi pi-check text-xs"></i>
                    </div>

                    <!-- Selected Check with index badge (multiple mode) -->
                    <div v-if="multiple && isSelected(item)"
                        class="absolute top-1 right-1 bg-sky-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg text-xs font-bold">
                        {{ getSelectedIndex(item) + 1 }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Actions -->
        <div
            class="py-3 mt-1 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-transparent">
            <div class="text-sm text-gray-500 font-medium flex items-center min-w-[120px]">
                <span v-if="selectionCount > 0">{{ selectionCount }} item{{ selectionCount > 1 ? 's' : '' }} selected</span>
                <span v-else>0 items selected</span>
            </div>

            <div class="flex-1 flex justify-center">
                <LazyPagination v-if="paginationConfig.data && paginationConfig.data.total > 0"
                    :config="paginationConfig" @loadData="handlePageChange" class="!my-0 !border-t-0 !py-0" />
            </div>

            <div class="min-w-[120px] flex justify-end">
                <Button :label="multiple ? `Insert ${selectionCount} Item${selectionCount > 1 ? 's' : ''}` : 'Insert Selection'" icon="pi pi-check-circle" severity="primary" :disabled="!hasSelection"
                    @click="confirmSelection" class="px-6" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>
