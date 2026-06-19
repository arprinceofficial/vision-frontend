<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);
const { $slugify } = useNuxtApp();

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const formData = ref({
    id: null,
    category_name: '',
    slug: '',
    parent_id: null,
    banner_image: '',
    icon: '',
    status: 0,
});

const isChecked = ref(false);

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            category_name: value.category_name || '',
            slug: value.slug || '',
            parent_id: value.parent_id || null,
            banner_image: value.banner_image || '',
            icon: value.icon || '',
            status: value.status || 0,
        };
        isChecked.value = value.status == 1;
    } else {
        formData.value = {
            id: null,
            category_name: '',
            slug: '',
            parent_id: null,
            banner_image: '',
            icon: '',
            status: 0,
        };
        isChecked.value = false;
    }
}, { immediate: true });

watch(() => formData.value.category_name, (value) => {
    if (!value) {
        formData.value.slug = '';
        return;
    }

    if (props.modalTitle === 'Create' || !formData.value.slug) {
        formData.value.slug = $slugify(value);
    }
});

const selectableParentCategories = computed(() => {
    const list = Array.isArray(props.data) ? props.data : [];
    return list.filter((row) => row.id !== formData.value.id);
});

const handleCheckboxChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
};

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'banner_image',
    'icon',
    'status',
    'parent_id',
]);

const isLoading = ref(false);
const response_modal = ref({});

const validateForm = () => {
    validations_errors.value = {};

    const errors = Object.keys(formData.value).filter(
        (item) => !formData.value[item] && !skip_validations.value.includes(item)
    );

    if (errors.length > 0) {
        errors.forEach((item) => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return false;
    }

    return true;
};

const mapBackendErrors = (e) => {
    if (e.response?.status === 404 || e.response?.status === 422 || e.response?.status === 409) {
        const errorsSource = e.response?._data?.data || e.response?._data?.errors;
        if (errorsSource) {
            for (const key in errorsSource) {
                if (Object.prototype.hasOwnProperty.call(errorsSource, key)) {
                    validations_errors.value[key] = errorsSource[key][0];
                }
            }
            return;
        }
    }

    if (!e.response?.status) {
        response_modal.value = {
            status: false,
            message: 'Something went wrong. Please try again later.',
        };
        return;
    }

    response_modal.value = {
        status: e.response._data?.status,
        message: e.response._data?.message || 'Something went wrong.',
    };
};

const updateHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/media-categories/${props.item.id}`, {
            method: 'PUT',
            body: formData.value,
        });

        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        mapBackendErrors(e);
    } finally {
        isLoading.value = false;
    }
};

const createHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin('v1/admin/media-categories', {
            method: 'POST',
            body: formData.value,
        });

        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        mapBackendErrors(e);
    } finally {
        isLoading.value = false;
    }
};

const setBannerImage = (photo) => {
    formData.value.banner_image = photo;
};

const setIconImage = (photo) => {
    formData.value.icon = photo;
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '46rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Media Category</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Category Name</label>
                    <LazyInputText v-model="formData.category_name" class="w-full"
                        :class="validations_errors.category_name ? 'border-[#f44336!important]' : ''"
                        autocomplete="off" @focus="validations_errors.category_name = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.category_name" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Slug</label>
                    <LazyInputText v-model="formData.slug" class="w-full"
                        :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.slug = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-2 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Parent Category</label>
                    <Select v-model="formData.parent_id" :options="selectableParentCategories" optionLabel="category_name"
                        optionValue="id" placeholder="Select" class="w-full" :showClear="true"
                        @focus="validations_errors.parent_id = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.parent_id" />
                </div>
            </div>

            <div>
                <label class="font-semibold">Banner Image</label>
                <div class="mt-2 w-full">
                    <MediaGallery :getPhoto="formData.banner_image" @set_photo="setBannerImage" />
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.banner_image" />
            </div>

            <div>
                <label class="font-semibold">Icon</label>
                <div class="mt-2 w-full">
                    <MediaGallery :getPhoto="formData.icon" @set_photo="setIconImage" />
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.icon" />
            </div>

            <div class="flex items-end justify-start gap-4">
                <label class="font-semibold w-14 mb-2">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="isChecked" @change="handleCheckboxChange"
                        @focus="validations_errors.status = ''" />
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
