<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);
const { $slugify } = useNuxtApp();

const visible = computed({
    get: () => props.isOpenModal,
    set: (value) => {
        if (!value) emit('close');
    }
});

const isTruthy = (value) => value === true || value == 1;

const getImagePath = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.image || value?.url || value?.path || '';
};

const toInputValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const normalizeImageArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map(getImagePath).filter(Boolean);
};

const normalizeMetrics = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') {
            return { label: item, value: '' };
        }

        return {
            label: toInputValue(item?.label ?? item?.title ?? item?.name ?? item?.key),
            value: toInputValue(item?.value ?? item?.amount ?? item?.text ?? item?.description),
        };
    });
};

const getInitialFormData = () => ({
    id: null,
    status_label: '',
    title: '',
    slug: '',
    eyebrow: '',
    description: '',
    metrics: [],
    gallery: [],
    marque: '',
    image: '',
    alt: '',
    action: '',
    to: '',
    is_live: false,
    status: false,
});

const formData = ref(getInitialFormData());
const validations_errors = ref({});

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            status_label: value.status_label || '',
            title: value.title || '',
            slug: value.slug || '',
            eyebrow: value.eyebrow || '',
            description: value.description || '',
            metrics: normalizeMetrics(value.metrics),
            gallery: normalizeImageArray(value.gallery),
            marque: value.marque || '',
            image: getImagePath(value.image),
            alt: value.alt || '',
            action: value.action || '',
            to: value.to || '',
            is_live: isTruthy(value.is_live),
            status: isTruthy(value.status),
        };
    } else {
        formData.value = getInitialFormData();
    }
}, { immediate: true });

watch(() => formData.value.title, (value) => {
    if (!value) return;
    if (props.modalTitle === 'Create' || !formData.value.slug) {
        formData.value.slug = $slugify(value);
    }
});

const setImage = (photo) => {
    formData.value.image = getImagePath(photo);
};

const setGallery = (photos) => {
    formData.value.gallery = normalizeImageArray(photos);
};

const addMetric = () => {
    formData.value.metrics.push({ label: '', value: '' });
};

const removeMetric = (index) => {
    formData.value.metrics.splice(index, 1);
};

const requiredFields = [
    'status_label',
    'title',
    'slug',
    'eyebrow',
    'description',
    'marque',
    'image',
    'alt',
    'action',
    'to',
];

const isEmptyValue = (value) => value === null || value === undefined || value === '';

const validateForm = () => {
    validations_errors.value = {};
    const errors = requiredFields.filter((key) => isEmptyValue(formData.value[key]));

    if (errors.length > 0) {
        errors.forEach((key) => {
            validations_errors.value[key] = `${key.replaceAll('_', ' ')} is required`;
        });
        return false;
    }

    return true;
};

const serializeSubmitData = () => ({
    status_label: formData.value.status_label,
    title: formData.value.title,
    slug: formData.value.slug,
    eyebrow: formData.value.eyebrow,
    description: formData.value.description,
    metrics: formData.value.metrics.filter((item) => item.label || item.value),
    gallery: normalizeImageArray(formData.value.gallery),
    marque: formData.value.marque,
    image: formData.value.image,
    alt: formData.value.alt,
    action: formData.value.action,
    to: formData.value.to,
    is_live: formData.value.is_live ? 1 : 0,
    status: formData.value.status ? 1 : 0,
});

const applyValidationErrors = (errorData) => {
    if (!errorData) return;

    for (const key in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, key)) {
            validations_errors.value[key] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
        }
    }
};

const handleSubmitError = (e) => {
    if (e.response?.status === 404 || e.response?.status === 409 || e.response?.status === 422) {
        const errorsSource = e.response?._data?.data || e.response?._data?.errors;
        applyValidationErrors(errorsSource);
        if (!Object.keys(validations_errors.value).length) {
            response_modal.value = e.response._data;
        }
    } else if (!e.response?.status) {
        response_modal.value = {
            status: false,
            message: 'Something went wrong. Please try again later.',
        };
    } else {
        response_modal.value = {
            status: e.response._data.status,
            message: e.response._data.message,
        };
    }
};

const isLoading = ref(false);
const response_modal = ref({});

const updateHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/current-syndicates/${props.item.id}`, {
            method: 'PUT',
            body: serializeSubmitData(),
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleSubmitError(e);
    } finally {
        isLoading.value = false;
    }
};

const createHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin('v1/admin/current-syndicates', {
            method: 'POST',
            body: serializeSubmitData(),
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleSubmitError(e);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '76rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Current Syndicate</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-200 rounded-lg p-4">
                <div>
                    <label class="font-semibold">Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.image" @set_photo="setImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.image" />
                </div>

                <div>
                    <label class="font-semibold">Gallery</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.gallery" :multiple="true" @set_photo="setGallery" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.gallery" />
                </div>
            </div>

            <div>
                <label class="font-semibold">Title</label>
                <LazyInputText v-model="formData.title" class="w-full"
                    :class="validations_errors.title ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.title = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.title" />
            </div>

            <div>
                <label class="font-semibold">Slug</label>
                <LazyInputText v-model="formData.slug" class="w-full"
                    :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.slug = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
            </div>

            <div>
                <label class="font-semibold">Eyebrow</label>
                <LazyInputText v-model="formData.eyebrow" class="w-full"
                    :class="validations_errors.eyebrow ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.eyebrow = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.eyebrow" />
            </div>

            <div>
                <label class="font-semibold">Marque</label>
                <LazyInputText v-model="formData.marque" class="w-full"
                    :class="validations_errors.marque ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.marque = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.marque" />
            </div>

            <div>
                <label class="font-semibold">Status Label</label>
                <LazyInputText v-model="formData.status_label" class="w-full"
                    :class="validations_errors.status_label ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.status_label = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.status_label" />
            </div>

            <div>
                <label class="font-semibold">Alt</label>
                <LazyInputText v-model="formData.alt" class="w-full"
                    :class="validations_errors.alt ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.alt = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.alt" />
            </div>

            <div>
                <label class="font-semibold">Action</label>
                <LazyInputText v-model="formData.action" class="w-full"
                    :class="validations_errors.action ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.action = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.action" />
            </div>

            <div>
                <label class="font-semibold">To</label>
                <LazyInputText v-model="formData.to" class="w-full"
                    :class="validations_errors.to ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.to = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.to" />
            </div>

            <div class="sm:col-span-3">
                <label class="font-semibold">Description</label>
                <Textarea v-model="formData.description" class="w-full" rows="4"
                    :class="validations_errors.description ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.description = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.description" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Metrics</h5>
                    <Button type="button" label="Add Metric" class="text-xs" @click="addMetric" />
                </div>
                <div class="space-y-3">
                    <div v-for="(metric, index) in formData.metrics" :key="`metric-${index}`"
                        class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                        <LazyInputText v-model="metric.label" class="w-full" placeholder="Label" autocomplete="off" />
                        <LazyInputText v-model="metric.value" class="w-full" placeholder="Value" autocomplete="off" />
                        <i @click="removeMetric(index)"
                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.metrics" />
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Is Live</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="formData.is_live" @focus="validations_errors.is_live = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.is_live" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="formData.status" @focus="validations_errors.status = ''" />
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
