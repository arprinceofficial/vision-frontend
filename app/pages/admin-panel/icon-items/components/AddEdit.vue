<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close']);

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const formData = ref({
    id: null,
    name: '',
    slug: '',
    gallery: [],
    videos: [],
    status: 0,
});

const isChecked = ref(false);

const normalizeGallery = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.image || item?.url || '';
    }).filter(Boolean);
}

const normalizeVideos = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.video || item?.url || '';
    }).filter(Boolean);
}

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            name: value.name || '',
            slug: value.slug || '',
            gallery: normalizeGallery(value.gallery),
            videos: normalizeVideos(value.videos),
            status: value.status || 0,
        };
        isChecked.value = value.status == 1;
    } else {
        formData.value = {
            id: null,
            name: '',
            slug: '',
            gallery: [],
            videos: [],
            status: 0,
        };
        isChecked.value = false;
    }
}, { immediate: true });

const isIconsLoading = ref(false);
const iconList = ref([]);
const loadIcons = async () => {
    isIconsLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/icons`, {
            method: 'GET',
        });
        iconList.value = getData.data.data;
    } catch (e) {
    } finally {
        isIconsLoading.value = false;
    }
};

onMounted(() => {
    loadIcons();
});

const handleStatusChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
}

const setGallery = (photos) => {
    formData.value.gallery = photos;
}

const setVideos = (videos) => {
    formData.value.videos = videos;
}

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'gallery',
    'videos',
    'status',
]);

const isLoading = ref(false);
const response_modal = ref({});

const updateHandler = async () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => !formData.value[item] && !skip_validations.value.includes(item));
    if (errors.length > 0) {
        errors.map(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return;
    }

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/icon-items/${props.item.id}`, {
            method: 'PUT',
            body: formData.value,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 422) {
            const errorsSource = e.response?._data?.data || e.response?._data?.errors;
            if (errorsSource) {
                for (const key in errorsSource) {
                    if (errorsSource.hasOwnProperty(key)) {
                        validations_errors.value[key] = errorsSource[key][0];
                    }
                }
            }
        } else if (!e.response?.status) {
            response_modal.value = {
                status: false,
                message: 'Something went wrong. Please try again later.',
            }
        } else {
            response_modal.value = {
                status: e.response._data.status,
                message: e.response._data.message,
            }
        }
    } finally {
        isLoading.value = false;
    }
}

const createHandler = async () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => !formData.value[item] && !skip_validations.value.includes(item));
    if (errors.length > 0) {
        errors.map(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return;
    }

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/icon-items`, {
            method: 'POST',
            body: formData.value,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 422) {
            const errorsSource = e.response?._data?.data || e.response?._data?.errors;
            if (errorsSource) {
                for (const key in errorsSource) {
                    if (errorsSource.hasOwnProperty(key)) {
                        validations_errors.value[key] = errorsSource[key][0];
                    }
                }
            }
        } else if (!e.response?.status) {
            response_modal.value = {
                status: false,
                message: 'Something went wrong. Please try again later.',
            }
        } else {
            response_modal.value = {
                status: e.response._data.status,
                message: e.response._data.message,
            }
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '75rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Icon Item</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Name</label>
                <LazyInputText v-model="formData.name" class="w-full" :class="validations_errors.name ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
            </div>

            <div>
                <label class="font-semibold">Slug</label>
                <LazyInputText v-model="formData.slug" class="w-full" :class="validations_errors.slug ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.slug = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
            </div>


            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <label class="font-semibold block mb-3">Gallery</label>
                <MediaGallery :getPhoto="formData.gallery" :multiple="true" @set_photo="setGallery" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.gallery" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <label class="font-semibold block mb-3">Videos</label>
                <MediaGallery :getPhoto="formData.videos" :multiple="true" @set_photo="setVideos" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.videos" />
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="isChecked" @change="handleStatusChange" @focus="validations_errors.status = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.status" />
                </div>
            </div>
        </div>

        <template #footer class="flex justify-end gap-2 border-gray-200">
            <div class="flex justify-end items-center gap-3 border-gray-200">
                <Button v-if="isLoading" severity="secondary" style="cursor: not-allowed; width: 80px;">
                    <ProgressSpinner style="width: 25px; height: 25px" strokeWidth="8" animationDuration=".5s" />
                </Button>
                <template v-else>
                    <Button type="button" label="Cancel" severity="danger" outlined
                        class="transition-all duration-300 hover:scale-105" @click="$emit('close')">
                        <template #icon="{ class: iconClass }">
                            <i class="pi pi-times-circle mr-2" :class="iconClass"></i>
                        </template>
                    </Button>
                    <Button type="button" :label="modalTitle === 'Create' ? 'Create' : 'Update'" severity="success"
                        raised class="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        @click="modalTitle === 'Create' ? createHandler() : updateHandler()">
                        <template #icon="{ class: iconClass }">
                            <i :class="modalTitle === 'Create' ? 'pi pi-plus-circle mr-2' : 'pi pi-refresh mr-2'"></i>
                        </template>
                    </Button>
                </template>
            </div>
        </template>
    </Dialog>
    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss" scoped></style>
