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
    name: '',
    make: '',
    model: '',
    year: null,
    description: '',
    status: 0,
});

const formData = ref(getInitialFormData());
const isChecked = ref(false);

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            name: value.name,
            make: value.make,
            model: value.model,
            year: value.year,
            description: value.description,
            status: value.status,
        };
        isChecked.value = value.status == 1 || value.status === true;
    } else {
        formData.value = getInitialFormData();
        isChecked.value = false;
    }
});

const handleCheckboxChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
}
const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'status',
]);

const validateForm = () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => !formData.value[item] && !skip_validations.value.includes(item));
    if (errors.length > 0) {
        errors.map(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        console.log(validations_errors.value);
        return false;
    }

    return true;
}

const applyValidationErrors = (errorData) => {
    if (!errorData) return;

    for (const key in errorData) {
        if (errorData.hasOwnProperty(key)) {
            validations_errors.value[key] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
        }
    }
}

const handleSubmitError = (e) => {
    console.log('Get Message', e.message);
    if (e.response?.status === 404 || e.response?.status === 409 || e.response?.status === 422) {
        applyValidationErrors(e.response._data?.data);
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
        const getData = await $fetchAdmin(`v1/admin/vehicles/${props.item.id}`, {
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
        const getData = await $fetchAdmin(`v1/admin/vehicles`, {
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
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '60rem' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Vehicle</h4>
            </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Name</label>
                    <LazyInputText v-model="formData.name" class="w-full" placeholder="i.e. 911 Carrera"
                        :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.name = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Make</label>
                    <LazyInputText v-model="formData.make" class="w-full" placeholder="i.e. Porsche"
                        :class="validations_errors.make ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.make = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.make" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Model</label>
                    <LazyInputText v-model="formData.model" class="w-full" placeholder="i.e. Carrera"
                        :class="validations_errors.model ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.model = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.model" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Year</label>
                    <InputNumber v-model="formData.year" class="w-full" :useGrouping="false" :maxFractionDigits="0"
                        placeholder="i.e. 2025" :class="validations_errors.year ? 'border-[#f44336!important]' : ''"
                        autocomplete="off" @focus="validations_errors.year = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.year" />
                </div>
            </div>

            <div class="md:col-span-2 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Description</label>
                    <Textarea v-model="formData.description" class="w-full" rows="5"
                        placeholder="i.e. Write your vehicle description here"
                        :class="validations_errors.description ? 'border-[#f44336!important]' : ''"
                        autocomplete="off" @focus="validations_errors.description = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.description" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold min-w-16">Status</label>
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


<style lang="scss" scoped></style>
