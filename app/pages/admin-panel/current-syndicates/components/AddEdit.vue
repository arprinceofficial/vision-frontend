<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);

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

const getInitialFormData = () => ({
    id: null,
    status_label: '',
    title: '',
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

const setImage = (photo) => {
    formData.value.image = getImagePath(photo);
};

const requiredFields = [
    'status_label',
    'title',
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
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '48rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Current Syndicate</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
                <label class="font-semibold">Image</label>
                <div class="w-full mt-2">
                    <MediaGallery :getPhoto="formData.image" @set_photo="setImage" />
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.image" />
            </div>

            <div>
                <label class="font-semibold">Title</label>
                <LazyInputText v-model="formData.title" class="w-full"
                    :class="validations_errors.title ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.title = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.title" />
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
