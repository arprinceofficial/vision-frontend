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

const getInitialFormData = () => ({
    id: null,
    vehicle_id: '',
    name: '',
    vin: '',
    mileage: null,
    condition_grade: '',
    gallery: [],
    status: 0,
    engine: '',
    power: '',
    torque: '',
    seating_capacity: null,
    drive_type: '',
    transmission: '',
    year_from: null,
    three_d_image_url: '',
    video_path: '',
});

const formData = ref(getInitialFormData());
const isChecked = ref(false);

const normalizeGallery = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.image || item?.url || item?.path || '';
    }).filter(Boolean);
}

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            vehicle_id: value.vehicle_id || value.vehicle?.id || '',
            name: value.name || '',
            vin: value.vin || '',
            mileage: value.mileage ?? null,
            condition_grade: value.condition_grade || '',
            gallery: normalizeGallery(value.gallery),
            status: value.status || 0,
            engine: value.engine || '',
            power: value.power || '',
            torque: value.torque || '',
            seating_capacity: value.seating_capacity ?? null,
            drive_type: value.drive_type || '',
            transmission: value.transmission || '',
            year_from: value.year_from ?? null,
            three_d_image_url: value.three_d_image_url || '',
            video_path: value.video_path || '',
        };
        isChecked.value = value.status == 1 || value.status === true;
    } else {
        formData.value = getInitialFormData();
        isChecked.value = false;
    }
}, { immediate: true });

const isVehiclesLoading = ref(false);
const vehicles = ref([]);
const normalizeVehiclesResponse = (value) => {
    if (Array.isArray(value?.data?.data)) return value.data.data;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value)) return value;
    return [];
}
const loadVehicles = async () => {
    isVehiclesLoading.value = true;
    try {
        const getData = await $fetchAdmin('v1/admin/vehicles', {
            method: 'GET',
        });
        vehicles.value = normalizeVehiclesResponse(getData);
    } catch (e) {
        vehicles.value = [];
    } finally {
        isVehiclesLoading.value = false;
    }
};

onMounted(() => {
    loadVehicles();
});

const handleStatusChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
}

const setGallery = (photos) => {
    formData.value.gallery = photos;
}

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'gallery',
    'status',
]);

const isEmptyValue = (value) => value === null || value === undefined || value === '';

const validateForm = () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => isEmptyValue(formData.value[item]) && !skip_validations.value.includes(item));
    if (errors.length > 0) {
        errors.map(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return false;
    }

    return true;
}

const applyValidationErrors = (errorsSource) => {
    if (!errorsSource) return;

    for (const key in errorsSource) {
        if (Object.prototype.hasOwnProperty.call(errorsSource, key)) {
            validations_errors.value[key] = Array.isArray(errorsSource[key]) ? errorsSource[key][0] : errorsSource[key];
        }
    }
}

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
        }
    } else {
        response_modal.value = {
            status: e.response._data.status,
            message: e.response._data.message,
        }
    }
}

const isLoading = ref(false);
const response_modal = ref({});

const updateHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/vehicle-items/${props.item.id}`, {
            method: 'PUT',
            body: formData.value,
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
}

const createHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/vehicle-items`, {
            method: 'POST',
            body: formData.value,
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
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false"
        :style="{ width: '80rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Vehicle Item</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Vehicle</label>
                <Select v-model="formData.vehicle_id" :options="vehicles" filter optionLabel="name" optionValue="id"
                    placeholder="Select Vehicle" class="w-full" :loading="isVehiclesLoading"
                    @focus="validations_errors.vehicle_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.vehicle_id" />
            </div>

            <div>
                <label class="font-semibold">Name</label>
                <LazyInputText v-model="formData.name" class="w-full"
                    :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
            </div>

            <div>
                <label class="font-semibold">VIN</label>
                <LazyInputText v-model="formData.vin" class="w-full"
                    :class="validations_errors.vin ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.vin = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.vin" />
            </div>

            <div>
                <label class="font-semibold">Mileage</label>
                <InputNumber v-model="formData.mileage" class="w-full" :useGrouping="false" :maxFractionDigits="0"
                    :class="validations_errors.mileage ? 'border-[#f44336!important]' : ''"
                    @focus="validations_errors.mileage = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.mileage" />
            </div>

            <div>
                <label class="font-semibold">Condition Grade</label>
                <LazyInputText v-model="formData.condition_grade" class="w-full"
                    :class="validations_errors.condition_grade ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.condition_grade = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.condition_grade" />
            </div>

            <div>
                <label class="font-semibold">Engine</label>
                <LazyInputText v-model="formData.engine" class="w-full"
                    :class="validations_errors.engine ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.engine = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.engine" />
            </div>

            <div>
                <label class="font-semibold">Power</label>
                <LazyInputText v-model="formData.power" class="w-full"
                    :class="validations_errors.power ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.power = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.power" />
            </div>

            <div>
                <label class="font-semibold">Torque</label>
                <LazyInputText v-model="formData.torque" class="w-full"
                    :class="validations_errors.torque ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.torque = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.torque" />
            </div>

            <div>
                <label class="font-semibold">Seating Capacity</label>
                <InputNumber v-model="formData.seating_capacity" class="w-full" :useGrouping="false"
                    :maxFractionDigits="0"
                    :class="validations_errors.seating_capacity ? 'border-[#f44336!important]' : ''"
                    @focus="validations_errors.seating_capacity = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.seating_capacity" />
            </div>

            <div>
                <label class="font-semibold">Drive Type</label>
                <LazyInputText v-model="formData.drive_type" class="w-full"
                    :class="validations_errors.drive_type ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.drive_type = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.drive_type" />
            </div>

            <div>
                <label class="font-semibold">Transmission</label>
                <LazyInputText v-model="formData.transmission" class="w-full"
                    :class="validations_errors.transmission ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.transmission = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.transmission" />
            </div>

            <div>
                <label class="font-semibold">Year From</label>
                <InputNumber v-model="formData.year_from" class="w-full" :useGrouping="false" :maxFractionDigits="0"
                    :class="validations_errors.year_from ? 'border-[#f44336!important]' : ''"
                    @focus="validations_errors.year_from = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.year_from" />
            </div>

            <div>
                <label class="font-semibold">3D Image URL</label>
                <LazyInputText v-model="formData.three_d_image_url" class="w-full"
                    :class="validations_errors.three_d_image_url ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.three_d_image_url = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.three_d_image_url" />
            </div>

            <div>
                <label class="font-semibold">Video Path</label>
                <LazyInputText v-model="formData.video_path" class="w-full"
                    :class="validations_errors.video_path ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.video_path = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.video_path" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <label class="font-semibold block mb-3">Gallery</label>
                <MediaGallery :getPhoto="formData.gallery" :multiple="true" @set_photo="setGallery" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.gallery" />
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="isChecked" @change="handleStatusChange"
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

<style lang="scss" scoped></style>
