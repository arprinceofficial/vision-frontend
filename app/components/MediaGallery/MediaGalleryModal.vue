<script setup>
import UploadTab from './Tabs/Upload.vue';
import LibraryTab from './Tabs/Library.vue';

const props = defineProps({
    visible: Boolean,
    multiple: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:visible', 'selectMedia']);

const isOpen = ref(false);
const activeTab = ref('library'); // 'upload' or 'library'

watch(() => props.visible, (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
        // Active tab reset logic if necessary
    }
});

const closeDialog = () => {
    isOpen.value = false;
    emit('update:visible', false);
};

const handleUploadSuccess = (data) => {
    // Navigate to library tab upon successful upload
    activeTab.value = 'library';
    // The library tab will need to reload, it does so implicitly if we force a re-mount or we can just rely on user refreshing/refresh button for now.
    // Or simpler: by changing the `activeTab` value using v-if, it forces re-mount of Library component and fetches freshest data.
};

const handleSelectMedia = (urlOrUrls) => {
    emit('selectMedia', urlOrUrls);
    closeDialog();
};
</script>

<template>
    <Dialog v-model:visible="isOpen" modal :style="{ width: '56rem' }" :closable="false"
        class="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
        @update:visible="(val) => emit('update:visible', val)">
        <!-- Custom Header -->
        <template #header>
            <div class="flex items-center justify-between w-full border-b border-gray-200 dark:border-gray-700 pb-3">
                <h4 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <i class="pi pi-images text-sky-500"></i> Media Gallery
                </h4>
                <button @click="closeDialog"
                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500">
                    <i class="pi pi-times text-lg"></i>
                </button>
            </div>
        </template>

        <!-- Body content with custom Tabs -->
        <div class="w-full flexflex-col gap-4">
            <!-- Tab Navigation -->
            <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button class="px-6 py-3 font-semibold text-sm transition-all relative"
                    :class="activeTab === 'library' ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                    @click="activeTab = 'library'">
                    <i class="pi pi-images mr-2"></i>Media Library
                    <div v-if="activeTab === 'library'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>
                </button>
                <button class="px-6 py-3 font-semibold text-sm transition-all relative"
                    :class="activeTab === 'upload' ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                    @click="activeTab = 'upload'">
                    <i class="pi pi-cloud-upload mr-2"></i>Upload File
                    <div v-if="activeTab === 'upload'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>
                </button>
            </div>

            <!-- Tab Content -->
            <div class="min-h-[400px]">
                <UploadTab v-if="activeTab === 'upload'" @uploadSuccess="handleUploadSuccess" />
                <LibraryTab v-if="activeTab === 'library'" :multiple="multiple" @selectMedia="handleSelectMedia" />
            </div>
        </div>
    </Dialog>
</template>
