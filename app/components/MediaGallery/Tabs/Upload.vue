<script setup>
const emit = defineEmits(['uploadSuccess']);

const files = ref([]);
const filePreviews = ref([]);
const isDragging = ref(false);
const content_title = ref('');
const categoryId = ref(null);
const watermark = ref(false);
const watermarkPos = ref('bottom-right');
const compress = ref(true);

const categories = ref([]);
const isLoadingCategories = ref(false);
const isUploading = ref(false);
const uploadError = ref('');

const watermarkPositions = ref([
    { label: 'Center', value: 'center' },
    { label: 'Top Left', value: 'top-left' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Bottom Right', value: 'bottom-right' }
]);

const loadCategories = async () => {
    isLoadingCategories.value = true;
    try {
        const getData = await $fetchAdmin('v1/admin/media-categories/all', {
            method: 'POST',
            body: { paginate: false, length: 100 }
        });
        categories.value = getData.data?.data || getData.data || [];
    } catch (e) {
        console.error('Failed to load categories', e);
    } finally {
        isLoadingCategories.value = false;
    }
};

onMounted(() => {
    loadCategories();
});

const handleFileSelect = (event) => {
    uploadError.value = '';
    processFiles(event.target.files);
};

const handleDrop = (event) => {
    isDragging.value = false;
    uploadError.value = '';
    processFiles(event.dataTransfer.files);
};

const processFiles = (selectedFiles) => {
    if (selectedFiles.length > 0) {
        files.value = Array.from(selectedFiles);
        // Clear old previews
        filePreviews.value.forEach(p => URL.revokeObjectURL(p.url));
        // Create new previews
        filePreviews.value = files.value.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            isImage: file.type.startsWith('image/'),
            isVideo: file.type.startsWith('video/'),
            url: URL.createObjectURL(file)
        }));
    }
};

const handleUpload = async () => {
    if (files.value.length === 0) {
        uploadError.value = 'Please select at least one file.';
        return;
    }

    // Validate if Category is mandatory? For safe side, it might be. If not, we just pass what we have.
    if (!categoryId.value) {
        uploadError.value = 'Category is required.';
        return;
    }

    try {
        isUploading.value = true;
        uploadError.value = '';

        const formData = new FormData();
        files.value.forEach((file) => {
            formData.append('files[]', file);
        });

        formData.append('cat_id', categoryId.value);
        if (content_title.value) {
            formData.append('content_title', content_title.value);
        }
        formData.append('watermark', watermark.value ? '1' : '0');
        if (watermark.value) {
            formData.append('watermark_pos', watermarkPos.value);
        }
        formData.append('compress', compress.value ? '1' : '0');

        const getData = await $fetchAdmin('v1/admin/media-galleries/upload', {
            method: 'POST',
            body: formData,
        });

        if (getData.status === true) {
            emit('uploadSuccess', getData.data);
            // Reset form
            files.value = [];
            filePreviews.value = [];
            content_title.value = '';
            categoryId.value = null;
        } else {
            uploadError.value = getData.message || 'Error uploading files.';
        }
    } catch (e) {
        if (e.response?._data?.message) {
            uploadError.value = e.response._data.message;
            if (e.response._data.errors) {
                // simple append of first error
                const firstKey = Object.keys(e.response._data.errors)[0];
                uploadError.value += ': ' + e.response._data.errors[firstKey][0];
            }
        } else {
            uploadError.value = 'An unexpected error occurred during upload.';
        }
    } finally {
        isUploading.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col gap-6 py-4">
        <!-- File Input Area -->
        <label for="media_upload_files" class="block border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer"
            :class="isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
            <input type="file" id="media_upload_files" multiple class="hidden" @change="handleFileSelect"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,video/mp4,video/avi,video/quicktime,video/x-ms-wmv,video/x-flv,video/webm" />
            <div class="flex flex-col items-center justify-center gap-3 pointer-events-none">
                <i class="pi pi-cloud-upload text-4xl" :class="isDragging ? 'text-sky-600' : 'text-sky-500'"></i>
                <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span v-if="isDragging" class="text-sky-600">Drop files here</span>
                    <span v-else>Click to browse or drag and drop files</span>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                    Images or Videos up to maximum allowed size
                </div>
            </div>
        </label>

        <!-- Previews -->
        <div v-if="filePreviews.length > 0" class="flex flex-wrap gap-4">
            <div v-for="(preview, index) in filePreviews" :key="index"
                class="relative group w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img v-if="preview.isImage" :src="preview.url" :alt="preview.name" class="w-full h-full object-cover" />
                <video v-else-if="preview.isVideo" :src="preview.url" class="w-full h-full object-cover" muted loop
                    playsinline @mouseover="$event.target.play()" @mouseleave="$event.target.pause()"></video>
                <div v-else class="text-xs text-center text-gray-500 break-all p-1">{{ preview.name }}</div>

                <div
                    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2 pointer-events-none">
                    <span class="text-[10px] text-white truncate">{{ preview.name }}</span>
                    <span class="text-[9px] text-gray-300">{{ preview.size }}</span>
                </div>
            </div>
        </div>

        <div v-if="uploadError"
            class="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-sm text-center">
            {{ uploadError }}
        </div>

        <!-- Options Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- File Name -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">File Name</label>
                <LazyInputText v-model="content_title" placeholder="Optional Custom Name" class="w-full" />
            </div>

            <!-- Category -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Category *</label>
                <Select v-model="categoryId" :options="categories" optionLabel="category_name" optionValue="id"
                    placeholder="Select a Category" class="w-full" :loading="isLoadingCategories" filter />
            </div>

            <!-- Compress Toggle -->
            <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Compress Image</label>
                <ToggleSwitch v-model="compress" />
            </div>

            <!-- Watermark Toggle -->
            <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Apply Watermark</label>
                <ToggleSwitch v-model="watermark" />
            </div>

            <!-- Watermark Position -->
            <div class="flex flex-col gap-2" :class="{ 'opacity-50 pointer-events-none': !watermark }">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Watermark Position</label>
                <Select v-model="watermarkPos" :options="watermarkPositions" optionLabel="label" optionValue="value"
                    placeholder="Position" class="w-full" />
            </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" label="Upload Media" icon="pi pi-upload" severity="success" class="px-8"
                :loading="isUploading" @click="handleUpload" />
        </div>
    </div>
</template>
