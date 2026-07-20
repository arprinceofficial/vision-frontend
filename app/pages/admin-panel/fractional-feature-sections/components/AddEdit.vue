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

const getInitialFormData = () => ({
    id: null,
    icon: '',
    title_white: '',
    title_color: '',
    button_text: '',
    button_link: '',
    status: false,
});

const formData = ref(getInitialFormData());

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'status',
]);

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            icon: value.icon || '',
            title_white: value.title_white || '',
            title_color: value.title_color || '',
            button_text: value.button_text || '',
            button_link: value.button_link || '',
            status: value.status === true || value.status == 1,
        };
    } else {
        formData.value = getInitialFormData();
    }
}, { immediate: true });

const isLoading = ref(false);
const response_modal = ref({});

const payload = computed(() => ({
    icon: formData.value.icon,
    title_white: formData.value.title_white,
    title_color: formData.value.title_color,
    button_text: formData.value.button_text,
    button_link: formData.value.button_link,
    status: !!formData.value.status,
}));

const validateForm = () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => !formData.value[item] && !skip_validations.value.includes(item));
    if (errors.length > 0) {
        errors.map(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return false;
    }

    return true;
};

const applyValidationErrors = (errorData) => {
    if (!errorData) return;

    for (const key in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, key)) {
            validations_errors.value[key] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
        }
    }
};

const handleRequestError = (e) => {
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

const updateHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/fractional-feature-sections/${props.item.id}`, {
            method: 'PUT',
            body: payload.value,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleRequestError(e);
    } finally {
        isLoading.value = false;
    }
};

const createHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin('v1/admin/fractional-feature-sections', {
            method: 'POST',
            body: payload.value,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleRequestError(e);
    } finally {
        isLoading.value = false;
    }
};

const setIcon = (photo) => {
    formData.value.icon = photo;
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '42rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Fractional Feature Section</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center gap-4 col-span-1 sm:col-span-2">
                <div>
                    <label class="font-semibold">Icon</label>
                    <div class="w-[200px] mt-2 max-w-full">
                        <MediaGallery :getPhoto="formData.icon" @set_photo="setIcon" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.icon" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Title White</label>
                    <LazyInputText v-model="formData.title_white" class="w-full"
                        :class="validations_errors.title_white ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.title_white = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.title_white" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Title Color</label>
                    <LazyInputText v-model="formData.title_color" class="w-full"
                        :class="validations_errors.title_color ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.title_color = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.title_color" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Button Text</label>
                    <LazyInputText v-model="formData.button_text" class="w-full"
                        :class="validations_errors.button_text ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.button_text = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.button_text" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Button Link</label>
                    <LazyInputText v-model="formData.button_link" class="w-full" placeholder="https://example.com"
                        :class="validations_errors.button_link ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.button_link = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.button_link" />
                </div>
            </div>

            <div class="flex items-end justify-start gap-4">
                <label class="font-semibold w-14 mb-2">Status</label>
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
