<script setup>
import MediaGalleryModal from './MediaGalleryModal.vue';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

const props = defineProps({
    getPhoto: [String, Array],
    multiple: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['set_photo']);

const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const handleSelectMedia = (urlOrUrls) => {
    if (props.multiple) {
        // In multiple mode, merge new selections with existing ones (avoid duplicates)
        const current = Array.isArray(props.getPhoto) ? [...props.getPhoto] : [];
        if (Array.isArray(urlOrUrls)) {
            urlOrUrls.forEach((url) => {
                if (!current.includes(url)) current.push(url);
            });
        } else if (urlOrUrls && !current.includes(urlOrUrls)) {
            current.push(urlOrUrls);
        }
        emit('set_photo', current);
    } else {
        emit('set_photo', urlOrUrls);
    }
};

const removeMedia = (index) => {
    const current = Array.isArray(props.getPhoto) ? [...props.getPhoto] : [];
    current.splice(index, 1);
    emit('set_photo', current);
};

// Draggable list — wraps URLs into objects for vue-draggable-next
const dragList = ref([]);

// Sync props → local dragList
watch(() => props.getPhoto, (val) => {
    if (!props.multiple) return;
    const arr = Array.isArray(val) ? val : (val ? [val] : []);
    dragList.value = arr.map((url, i) => ({ url }));
}, { immediate: true, deep: true });

// When drag ends, emit the reordered URLs
const onDragEnd = () => {
    emit('set_photo', dragList.value.map((item) => item.url));
};

const isVideo = (url) => {
    if (!url) return false;
    const ext = url.split('.').pop().toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext);
};

// Single-mode computed (backward compatible)
const singleIsVideo = computed(() => {
    if (props.multiple) return false;
    if (!props.getPhoto || Array.isArray(props.getPhoto)) return false;
    return isVideo(props.getPhoto);
});
</script>

<template>
    <!-- MULTIPLE MODE -->
    <div v-if="multiple" class="photo_upload_block border border-gray-300 rounded-md p-3 bg-white dark:bg-gray-800">
        <div class="flex flex-wrap gap-3">
            <draggable
                :list="dragList"
                class="flex flex-wrap gap-3"
                ghost-class="drag-ghost"
                chosen-class="drag-chosen"
                drag-class="drag-active"
                :animation="200"
                @end="onDragEnd"
            >
                <template v-for="(element, index) in dragList" :key="index">
                    <div
                        class="relative group w-[120px] h-[120px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex-shrink-0 cursor-grab active:cursor-grabbing transition-transform duration-200">
                        <video v-if="isVideo(element.url)" :src="element.url" class="w-full h-full object-cover" muted loop
                            playsinline></video>
                        <img v-else class="w-full h-full object-cover" :src="element.url" />

                        <!-- Hover overlay with remove button -->
                        <div
                            class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all duration-300 gap-2">
                            <button type="button" @click.stop="removeMedia(index)"
                                class="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-colors">
                                <i class="pi pi-times text-xs"></i>
                            </button>
                        </div>

                        <!-- Index badge -->
                        <div
                            class="absolute top-1 left-1 bg-black/50 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                            {{ index + 1 }}
                        </div>

                        <!-- Drag handle indicator -->
                        <div
                            class="absolute bottom-1 right-1 bg-black/40 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <i class="pi pi-arrows-alt text-[10px]"></i>
                        </div>
                    </div>
                </template>
            </draggable>

            <!-- Add More button (outside draggable so it's not draggable) -->
            <div class="w-[120px] h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition flex-shrink-0"
                @click="openModal">
                <svg class="h-8 w-8 text-gray-400 mb-1" stroke="currentColor" fill="none" viewBox="0 0 48 48"
                    aria-hidden="true">
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="text-[11px] font-medium text-sky-600">
                    <i class="fa-solid fa-plus"></i> Add Media
                </span>
            </div>
        </div>

        <MediaGalleryModal v-model:visible="isModalOpen" :multiple="true" @selectMedia="handleSelectMedia" />
    </div>

    <!-- SINGLE MODE (original behavior) -->
    <div v-else class="photo_upload_block border border-gray-300 rounded-md p-3 max-w-[250px] bg-white dark:bg-gray-800">
        <div class="flex flex-col items-center justify-center gap-2 relative">
            <div v-if="getPhoto"
                class="relative cursor-pointer group w-full h-[150px] rounded-md overflow-hidden bg-gray-100 flex items-center justify-center"
                @click="openModal">
                <video v-if="singleIsVideo" :src="getPhoto" class="w-full h-full object-cover" muted loop playsinline></video>
                <img v-else class="w-full h-full object-cover" :src="getPhoto" />

                <div
                    class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all duration-300">
                    <div class="bg-sky-600 text-white rounded-xl gap-1 py-1 px-3 text-xs flex items-center shadow-lg">
                        <i class="fa fa-repeat"></i>
                        <span>Change Photo</span>
                    </div>
                </div>
            </div>
            <div v-else
                class="w-full h-[150px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                @click="openModal">
                <svg class="h-10 w-10 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48"
                    aria-hidden="true">
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="text-sm font-medium text-sky-600">
                    <i class="fa-solid fa-upload"></i> Choose Media
                </span>
            </div>
        </div>

        <MediaGalleryModal v-model:visible="isModalOpen" @selectMedia="handleSelectMedia" />
    </div>
</template>

<style scoped>
/* Drag-and-drop visual feedback */
.drag-ghost {
    opacity: 0.4;
    border: 2px dashed #0ea5e9 !important;
    border-radius: 0.5rem;
}

.drag-chosen {
    box-shadow: 0 0 0 2px #0ea5e9, 0 8px 25px rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    transform: scale(1.05);
}

.drag-active {
    opacity: 0.9;
    transform: rotate(2deg) scale(1.08);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}
</style>
