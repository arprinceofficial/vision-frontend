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

const toInputValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const getImagePath = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.image || value?.url || value?.path || '';
};

const normalizeImageArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map(getImagePath).filter(Boolean);
};

const normalizeStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.title || item?.text || item?.name || item?.value || item?.body || '';
    });
};

const normalizeCostBreakdown = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') {
            return { label: item, value: '' };
        }

        return {
            label: toInputValue(item?.label ?? item?.title ?? item?.name ?? item?.key),
            value: toInputValue(item?.value ?? item?.amount ?? item?.cost ?? item?.description),
        };
    });
};

const getInitialFormData = () => ({
    id: null,
    category: '',
    car_tag: '',
    sort_order: '',
    status: false,
    home_name: '',
    home_model: '',
    home_syndicate_total: '',
    shortdescription: '',
    home_car_image_path: '',
    name: '',
    model: '',
    marketing_photos: [],
    description: '',
    syndicate_total: '',
    the_syndicate: '',
    allocation_Cost: '',
    target_allocation: '',
    this_car_description: '',
    project_deck_pdf: '',
    engine: '',
    power: '',
    torque: '',
    transmission: '',
    seating_capacity: '',
    drive_type: '',
    mileage: '',
    year: '',
    how_it_works: [],
    hiw_yt_url: '',
    cost_breakdown: [],
});

const formData = ref(getInitialFormData());
const validations_errors = ref({});

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            category: value.category || '',
            car_tag: value.car_tag || '',
            sort_order: toInputValue(value.sort_order),
            status: isTruthy(value.status),
            home_name: value.home_name || '',
            home_model: value.home_model || '',
            home_syndicate_total: toInputValue(value.home_syndicate_total),
            shortdescription: value.shortdescription ?? value.short_description ?? '',
            home_car_image_path: getImagePath(value.home_car_image_path ?? value.home_car_image),
            name: value.name || '',
            model: value.model || '',
            marketing_photos: normalizeImageArray(value.marketing_photos ?? value.marketingPhotos),
            description: value.description || '',
            syndicate_total: toInputValue(value.syndicate_total),
            the_syndicate: value.the_syndicate || '',
            allocation_Cost: toInputValue(value.allocation_Cost ?? value.allocation_cost),
            target_allocation: toInputValue(value.target_allocation),
            this_car_description: value.this_car_description || '',
            project_deck_pdf: getImagePath(value.project_deck_pdf),
            engine: value.engine || '',
            power: toInputValue(value.power),
            torque: toInputValue(value.torque),
            transmission: value.transmission || '',
            seating_capacity: toInputValue(value.seating_capacity),
            drive_type: value.drive_type || '',
            mileage: toInputValue(value.mileage),
            year: toInputValue(value.year),
            how_it_works: normalizeStringArray(value.how_it_works),
            hiw_yt_url: value.hiw_yt_url || '',
            cost_breakdown: normalizeCostBreakdown(value.cost_breakdown),
        };
    } else {
        formData.value = getInitialFormData();
    }
}, { immediate: true });

const setImage = (field, photo) => {
    formData.value[field] = getImagePath(photo);
};

const setMarketingPhotos = (photos) => {
    formData.value.marketing_photos = normalizeImageArray(photos);
};

const addListItem = (field) => {
    formData.value[field].push('');
};

const removeListItem = (field, index) => {
    formData.value[field].splice(index, 1);
};

const addCostBreakdown = () => {
    formData.value.cost_breakdown.push({ label: '', value: '' });
};

const removeCostBreakdown = (index) => {
    formData.value.cost_breakdown.splice(index, 1);
};

const requiredFields = [
    'name',
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
    category: formData.value.category,
    car_tag: formData.value.car_tag,
    sort_order: formData.value.sort_order,
    status: formData.value.status ? 1 : 0,
    home_name: formData.value.home_name,
    home_model: formData.value.home_model,
    home_syndicate_total: formData.value.home_syndicate_total,
    shortdescription: formData.value.shortdescription,
    home_car_image_path: formData.value.home_car_image_path,
    name: formData.value.name,
    model: formData.value.model,
    marketing_photos: normalizeImageArray(formData.value.marketing_photos),
    description: formData.value.description,
    syndicate_total: formData.value.syndicate_total,
    the_syndicate: formData.value.the_syndicate,
    allocation_Cost: formData.value.allocation_Cost,
    target_allocation: formData.value.target_allocation,
    this_car_description: formData.value.this_car_description,
    project_deck_pdf: formData.value.project_deck_pdf,
    engine: formData.value.engine,
    power: formData.value.power,
    torque: formData.value.torque,
    transmission: formData.value.transmission,
    seating_capacity: formData.value.seating_capacity,
    drive_type: formData.value.drive_type,
    mileage: formData.value.mileage,
    year: formData.value.year,
    how_it_works: formData.value.how_it_works.filter(Boolean),
    hiw_yt_url: formData.value.hiw_yt_url,
    cost_breakdown: formData.value.cost_breakdown.filter((item) => item.label || item.value),
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
        const getData = await $fetchAdmin(`v1/admin/restoration-cars/${props.item.id}`, {
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
        const getData = await $fetchAdmin('v1/admin/restoration-cars', {
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
    <Dialog v-model:visible="visible" modal :closable="false"
        :style="{ width: '92rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Restoration Car</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-3">Home Summary</h5>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold">Category</label>
                        <LazyInputText v-model="formData.category" class="w-full" autocomplete="off"
                            @focus="validations_errors.category = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.category" />
                    </div>

                    <div>
                        <label class="font-semibold">Car Tag</label>
                        <LazyInputText v-model="formData.car_tag" class="w-full" autocomplete="off"
                            @focus="validations_errors.car_tag = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.car_tag" />
                    </div>

                    <div>
                        <label class="font-semibold">Sort Order</label>
                        <LazyInputText v-model="formData.sort_order" type="number" class="w-full" autocomplete="off"
                            @focus="validations_errors.sort_order = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.sort_order" />
                    </div>

                    <div>
                        <label class="font-semibold">Home Name</label>
                        <LazyInputText v-model="formData.home_name" class="w-full" autocomplete="off"
                            @focus="validations_errors.home_name = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.home_name" />
                    </div>

                    <div>
                        <label class="font-semibold">Home Model</label>
                        <LazyInputText v-model="formData.home_model" class="w-full" autocomplete="off"
                            @focus="validations_errors.home_model = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.home_model" />
                    </div>

                    <div>
                        <label class="font-semibold">Home Syndicate Total</label>
                        <LazyInputText v-model="formData.home_syndicate_total" type="number" step="0.01"
                            class="w-full" autocomplete="off" @focus="validations_errors.home_syndicate_total = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.home_syndicate_total" />
                    </div>

                    <div class="sm:col-span-2">
                        <label class="font-semibold">Short Description</label>
                        <Textarea v-model="formData.shortdescription" class="w-full" rows="3" autocomplete="off"
                            @focus="validations_errors.shortdescription = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.shortdescription" />
                    </div>

                    <div>
                        <label class="font-semibold">Status</label>
                        <div class="mt-2">
                            <ToggleSwitch v-model="formData.status" @focus="validations_errors.status = ''" />
                            <LazyInputError class="text-sm mt-1" :message="validations_errors.status" />
                        </div>
                    </div>

                    <div class="sm:col-span-3">
                        <label class="font-semibold">Home Car Image</label>
                        <div class="w-full mt-2">
                            <MediaGallery :getPhoto="formData.home_car_image_path"
                                @set_photo="(photo) => setImage('home_car_image_path', photo)" />
                        </div>
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.home_car_image_path" />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-3">Car Details</h5>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold">Name</label>
                        <LazyInputText v-model="formData.name" class="w-full"
                            :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                            @focus="validations_errors.name = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
                    </div>

                    <div>
                        <label class="font-semibold">Model</label>
                        <LazyInputText v-model="formData.model" class="w-full" autocomplete="off"
                            @focus="validations_errors.model = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.model" />
                    </div>

                    <div>
                        <label class="font-semibold">Year</label>
                        <LazyInputText v-model="formData.year" type="number" class="w-full" autocomplete="off"
                            @focus="validations_errors.year = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.year" />
                    </div>

                    <div>
                        <label class="font-semibold">Engine</label>
                        <LazyInputText v-model="formData.engine" class="w-full" autocomplete="off"
                            @focus="validations_errors.engine = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.engine" />
                    </div>

                    <div>
                        <label class="font-semibold">Power</label>
                        <LazyInputText v-model="formData.power" type="number" step="0.01" class="w-full"
                            autocomplete="off" @focus="validations_errors.power = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.power" />
                    </div>

                    <div>
                        <label class="font-semibold">Torque</label>
                        <LazyInputText v-model="formData.torque" type="number" step="0.01" class="w-full"
                            autocomplete="off" @focus="validations_errors.torque = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.torque" />
                    </div>

                    <div>
                        <label class="font-semibold">Transmission</label>
                        <LazyInputText v-model="formData.transmission" class="w-full" autocomplete="off"
                            @focus="validations_errors.transmission = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.transmission" />
                    </div>

                    <div>
                        <label class="font-semibold">Seating Capacity</label>
                        <LazyInputText v-model="formData.seating_capacity" type="number" class="w-full"
                            autocomplete="off" @focus="validations_errors.seating_capacity = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.seating_capacity" />
                    </div>

                    <div>
                        <label class="font-semibold">Drive Type</label>
                        <LazyInputText v-model="formData.drive_type" class="w-full" autocomplete="off"
                            @focus="validations_errors.drive_type = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.drive_type" />
                    </div>

                    <div>
                        <label class="font-semibold">Mileage</label>
                        <LazyInputText v-model="formData.mileage" type="number" class="w-full" autocomplete="off"
                            @focus="validations_errors.mileage = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.mileage" />
                    </div>

                    <div class="sm:col-span-3">
                        <label class="font-semibold">Description</label>
                        <Textarea v-model="formData.description" class="w-full" rows="4" autocomplete="off"
                            @focus="validations_errors.description = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.description" />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-3">Syndicate Details</h5>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="font-semibold">Syndicate Total</label>
                        <LazyInputText v-model="formData.syndicate_total" type="number" step="0.01" class="w-full"
                            autocomplete="off" @focus="validations_errors.syndicate_total = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.syndicate_total" />
                    </div>

                    <div>
                        <label class="font-semibold">Target Allocation</label>
                        <LazyInputText v-model="formData.target_allocation" type="number" step="0.01" class="w-full"
                            autocomplete="off" @focus="validations_errors.target_allocation = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.target_allocation" />
                    </div>

                    <div>
                        <label class="font-semibold">Allocation Cost</label>
                        <LazyInputText v-model="formData.allocation_Cost" type="number" step="0.01" class="w-full"
                            autocomplete="off" @focus="validations_errors.allocation_Cost = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.allocation_Cost" />
                    </div>

                    <div>
                        <label class="font-semibold">Project Deck PDF</label>
                        <LazyInputText v-model="formData.project_deck_pdf" class="w-full"
                            placeholder="https://example.com/project-deck.pdf" autocomplete="off"
                            @focus="validations_errors.project_deck_pdf = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.project_deck_pdf" />
                    </div>

                    <div class="sm:col-span-2">
                        <label class="font-semibold">The Syndicate</label>
                        <Textarea v-model="formData.the_syndicate" class="w-full" rows="4" autocomplete="off"
                            @focus="validations_errors.the_syndicate = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.the_syndicate" />
                    </div>

                    <div class="sm:col-span-2">
                        <label class="font-semibold">This Car Description</label>
                        <Textarea v-model="formData.this_car_description" class="w-full" rows="4" autocomplete="off"
                            @focus="validations_errors.this_car_description = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.this_car_description" />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-3">Media</h5>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="font-semibold">Marketing Photos</label>
                        <div class="w-full mt-2">
                            <MediaGallery :getPhoto="formData.marketing_photos" :multiple="true"
                                @set_photo="setMarketingPhotos" />
                        </div>
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.marketing_photos" />
                    </div>

                    <div>
                        <label class="font-semibold">How It Works YouTube URL</label>
                        <LazyInputText v-model="formData.hiw_yt_url" class="w-full"
                            placeholder="https://youtube.com/..." autocomplete="off"
                            @focus="validations_errors.hiw_yt_url = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.hiw_yt_url" />
                    </div>
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">How It Works</h5>
                    <Button type="button" label="Add Step" class="text-xs" @click="addListItem('how_it_works')" />
                </div>
                <div class="space-y-3">
                    <div v-for="(step, index) in formData.how_it_works" :key="`hiw-${index}`"
                        class="flex items-start gap-3">
                        <Textarea v-model="formData.how_it_works[index]" class="w-full" rows="2"
                            autocomplete="off" />
                        <i @click="removeListItem('how_it_works', index)"
                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out mt-3"></i>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.how_it_works" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Cost Breakdown</h5>
                    <Button type="button" label="Add Cost" class="text-xs" @click="addCostBreakdown" />
                </div>
                <div class="space-y-3">
                    <div v-for="(cost, index) in formData.cost_breakdown" :key="`cost-${index}`"
                        class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                        <LazyInputText v-model="cost.label" class="w-full" placeholder="Label" autocomplete="off" />
                        <LazyInputText v-model="cost.value" class="w-full" placeholder="Value" autocomplete="off" />
                        <i @click="removeCostBreakdown(index)"
                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.cost_breakdown" />
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
