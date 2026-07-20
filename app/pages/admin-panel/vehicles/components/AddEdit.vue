<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close']);

const visible = computed({
    get: () => props.isOpenModal,
    set: (value) => {
        if (!value) emit('close');
    }
});

const isTruthy = (value) => value === true || value == 1;

const toInputNumber = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? null : numberValue;
};

const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return value;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? value : numberValue;
};

const normalizeGallery = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.image || item?.url || item?.path || '';
    }).filter(Boolean);
};

const getInitialSpecData = () => ({
    name: '',
    vin: '',
    mileage: null,
    condition_grade: '',
    gallery: [],
    status: false,
    engine: '',
    power: null,
    torque: null,
    seating_capacity: null,
    drive_type: '',
    transmission: null,
    year_from: null,
    three_d_image_url: '',
    video_path: '',
});

const getInitialFormData = () => ({
    id: null,
    name: '',
    make: '',
    model: '',
    year: null,
    description: '',
    status: false,
    spec: getInitialSpecData(),
    detail: getInitialSpecData(),
});

const formData = ref(getInitialFormData());
const validations_errors = ref({});

const getSpecSource = (value, key) => value?.[key] || {};

const normalizeSpecData = (value = {}) => ({
    name: value.name || '',
    vin: value.vin || '',
    mileage: toInputNumber(value.mileage),
    condition_grade: value.condition_grade || '',
    gallery: normalizeGallery(value.gallery),
    status: isTruthy(value.status),
    engine: value.engine || '',
    power: toInputNumber(value.power),
    torque: toInputNumber(value.torque),
    seating_capacity: toInputNumber(value.seating_capacity),
    drive_type: value.drive_type || '',
    transmission: toInputNumber(value.transmission),
    year_from: toInputNumber(value.year_from),
    three_d_image_url: value.three_d_image_url || '',
    video_path: value.video_path || '',
});

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            name: value.name || '',
            make: value.make || '',
            model: value.model || '',
            year: toInputNumber(value.year),
            description: value.description || '',
            status: isTruthy(value.status),
            spec: normalizeSpecData(value),
            detail: normalizeSpecData(getSpecSource(value, 'detail')),
        };
    } else {
        formData.value = getInitialFormData();
    }
}, { immediate: true });

const requiredFields = [
    'name',
    'make',
    'model',
    'year',
    'description',
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

const serializeSpecData = (value) => ({
    name: value.name,
    vin: value.vin,
    mileage: toNumber(value.mileage),
    condition_grade: value.condition_grade,
    gallery: normalizeGallery(value.gallery),
    status: !!value.status,
    engine: value.engine,
    power: toNumber(value.power),
    torque: toNumber(value.torque),
    seating_capacity: toNumber(value.seating_capacity),
    drive_type: value.drive_type,
    transmission: toNumber(value.transmission),
    year_from: toNumber(value.year_from),
    three_d_image_url: value.three_d_image_url,
    video_path: value.video_path,
});

const serializeTopLevelSpecData = (value) => ({
    vin: value.vin,
    mileage: toNumber(value.mileage),
    condition_grade: value.condition_grade,
    gallery: normalizeGallery(value.gallery),
    engine: value.engine,
    power: toNumber(value.power),
    torque: toNumber(value.torque),
    seating_capacity: toNumber(value.seating_capacity),
    drive_type: value.drive_type,
    transmission: toNumber(value.transmission),
    year_from: toNumber(value.year_from),
    three_d_image_url: value.three_d_image_url,
    video_path: value.video_path,
});

const serializeSubmitData = () => {
    const spec = serializeTopLevelSpecData(formData.value.spec);

    return {
        name: formData.value.name,
        make: formData.value.make,
        model: formData.value.model,
        year: toNumber(formData.value.year),
        description: formData.value.description,
        status: !!formData.value.status,
        ...spec,
        detail: serializeSpecData(formData.value.detail),
    };
};

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
        const getData = await $fetchAdmin(`v1/admin/vehicles/${props.item.id}`, {
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
        const getData = await $fetchAdmin('v1/admin/vehicles', {
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

const specSections = [
    { key: 'spec', title: 'Vehicle Specs', galleryError: 'gallery' },
    { key: 'detail', title: 'Detail', galleryError: 'detail.gallery' },
];

const setGallery = (sectionKey, photos) => {
    formData.value[sectionKey].gallery = photos;
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false"
        :style="{ width: '88rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Vehicle</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Name</label>
                <LazyInputText v-model="formData.name" class="w-full" placeholder="i.e. 911 Carrera"
                    :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
            </div>

            <div>
                <label class="font-semibold">Make</label>
                <LazyInputText v-model="formData.make" class="w-full" placeholder="i.e. Porsche"
                    :class="validations_errors.make ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.make = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.make" />
            </div>

            <div>
                <label class="font-semibold">Model</label>
                <LazyInputText v-model="formData.model" class="w-full" placeholder="i.e. Carrera"
                    :class="validations_errors.model ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.model = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.model" />
            </div>

            <div>
                <label class="font-semibold">Year</label>
                <InputNumber v-model="formData.year" class="w-full" :useGrouping="false" :maxFractionDigits="0"
                    placeholder="i.e. 2025" :class="validations_errors.year ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.year = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.year" />
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="formData.status" @focus="validations_errors.status = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.status" />
                </div>
            </div>

            <div class="md:col-span-3">
                <label class="font-semibold">Description</label>
                <Textarea v-model="formData.description" class="w-full" rows="4"
                    placeholder="i.e. Write your vehicle description here"
                    :class="validations_errors.description ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.description = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.description" />
            </div>

            <div v-for="section in specSections" :key="section.key"
                class="md:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">{{ section.title }}</h5>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-if="section.key !== 'spec'">
                        <label class="font-semibold">Name</label>
                        <LazyInputText v-model="formData[section.key].name" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">VIN</label>
                        <LazyInputText v-model="formData[section.key].vin" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Mileage</label>
                        <InputNumber v-model="formData[section.key].mileage" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" />
                    </div>

                    <div>
                        <label class="font-semibold">Condition Grade</label>
                        <LazyInputText v-model="formData[section.key].condition_grade" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Engine</label>
                        <LazyInputText v-model="formData[section.key].engine" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Power</label>
                        <InputNumber v-model="formData[section.key].power" class="w-full" :useGrouping="false" />
                    </div>

                    <div>
                        <label class="font-semibold">Torque</label>
                        <InputNumber v-model="formData[section.key].torque" class="w-full" :useGrouping="false" />
                    </div>

                    <div>
                        <label class="font-semibold">Seating Capacity</label>
                        <InputNumber v-model="formData[section.key].seating_capacity" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" />
                    </div>

                    <div>
                        <label class="font-semibold">Drive Type</label>
                        <LazyInputText v-model="formData[section.key].drive_type" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Transmission</label>
                        <InputNumber v-model="formData[section.key].transmission" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" />
                    </div>

                    <div>
                        <label class="font-semibold">Year From</label>
                        <InputNumber v-model="formData[section.key].year_from" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" />
                    </div>

                    <div>
                        <label class="font-semibold">3D Image URL</label>
                        <LazyInputText v-model="formData[section.key].three_d_image_url" class="w-full"
                            placeholder="https://example.com" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Video Path</label>
                        <LazyInputText v-model="formData[section.key].video_path" class="w-full" autocomplete="off" />
                    </div>

                    <div v-if="section.key !== 'spec'" class="flex items-center gap-4">
                        <label class="font-semibold">Status</label>
                        <div class="flex-auto">
                            <ToggleSwitch v-model="formData[section.key].status" />
                        </div>
                    </div>

                    <div class="md:col-span-3">
                        <label class="font-semibold block mb-3">Gallery</label>
                        <MediaGallery :getPhoto="formData[section.key].gallery" :multiple="true"
                            @set_photo="(photos) => setGallery(section.key, photos)" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors[section.galleryError]" />
                    </div>
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
