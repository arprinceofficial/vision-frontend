<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    templateId: [Number, String],
    knownFields: Array,
})

const emit = defineEmits(['add_emit', 'close']);

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const dataTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Multiline', value: 'multiline' },
    { label: 'Date', value: 'date' },
    { label: 'Currency', value: 'currency' },
    { label: 'Image', value: 'image' },
];

const aligns = [
    { label: 'Left', value: 'L' },
    { label: 'Center', value: 'C' },
    { label: 'Right', value: 'R' },
];

const formData = ref({
    id: null,
    page_no: 1,
    field_key: '',
    label: '',
    data_type: 'text',
    pos_x: 0,
    pos_y: 0,
    width: 50,
    height: 10,
    font_family: 'helvetica',
    font_style: '',
    font_size: 10,
    align: 'L',
    format: '',
    fallback_value: '',
});

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id,
            page_no: value.page_no,
            field_key: value.field_key,
            label: value.label || '',
            data_type: value.data_type || 'text',
            pos_x: value.pos_x,
            pos_y: value.pos_y,
            width: value.width,
            height: value.height || null,
            font_family: value.font_family || 'helvetica',
            font_style: value.font_style || '',
            font_size: value.font_size || 10,
            align: value.align || 'L',
            format: value.format || '',
            fallback_value: value.fallback_value || '',
        };
    } else {
        formData.value = {
            id: null,
            page_no: 1,
            field_key: '',
            label: '',
            data_type: 'text',
            pos_x: 0,
            pos_y: 0,
            width: 50,
            height: 10,
            font_family: 'helvetica',
            font_style: '',
            font_size: 10,
            align: 'L',
            format: '',
            fallback_value: '',
        };
    }
}, { immediate: true });

const validations_errors = ref({});
const skip_validations = ref([
    'id', 'label', 'height', 'font_family', 'font_style', 'font_size', 'align', 'format', 'fallback_value'
]);

const isLoading = ref(false);
const response_modal = ref({});

const submitHandler = async () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => {
        return (formData.value[item] === null || formData.value[item] === '') && !skip_validations.value.includes(item);
    });

    if (errors.length > 0) {
        errors.forEach(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return;
    }

    let endpoint = `v1/admin/document-templates/${props.templateId}/mappings`;
    let method = 'POST';

    if (props.modalTitle === 'Update' || props.modalTitle === 'Edit') {
        endpoint = `v1/admin/document-field-mappings/${formData.value.id}`;
        method = 'PUT';
    }

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(endpoint, {
            method: method,
            body: formData.value,
        });

        response_modal.value = getData;
        if (getData.success == true || getData.status == true) {
            emit('add_emit', getData.mapping || getData.data);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 422 || e.response?.status === 409) {
            const errorData = e.response._data.errors || e.response._data.data;
            if (errorData) {
                for (const key in errorData) {
                    if (errorData.hasOwnProperty(key)) {
                        validations_errors.value[key] = errorData[key][0];
                    }
                }
            } else {
                response_modal.value = {
                    status: false,
                    message: e.response._data.message || 'Validation error',
                }
            }
        } else {
            response_modal.value = {
                status: false,
                message: 'Something went wrong. Please try again later.',
            }
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '60rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Field Mapping</h4>
            </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Field Key <span class="text-red-500">*</span></label>
                    <div class="relative">
                        <LazyInputText v-model="formData.field_key" class="w-full" list="known_fields_list"
                            :class="validations_errors.field_key ? 'border-[#f44336!important]' : ''" autocomplete="off"
                            @focus="validations_errors.field_key = ''" placeholder="e.g. user_name" />
                        <datalist id="known_fields_list">
                            <option v-for="kf in knownFields" :key="kf" :value="kf"></option>
                        </datalist>
                    </div>
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.field_key" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Label</label>
                    <LazyInputText v-model="formData.label" class="w-full"
                        @focus="validations_errors.label = ''" placeholder="Friendly name" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.label" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Data Type <span class="text-red-500">*</span></label>
                    <Select v-model="formData.data_type" :options="dataTypes" optionLabel="label" optionValue="value"
                        class="w-full" :class="validations_errors.data_type ? 'p-invalid' : ''"
                        @focus="validations_errors.data_type = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.data_type" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Page No <span class="text-red-500">*</span></label>
                    <InputNumber v-model="formData.page_no" class="w-full" :min="1"
                        :class="validations_errors.page_no ? 'p-invalid' : ''"
                        @focus="validations_errors.page_no = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.page_no" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">X Position (mm) <span class="text-red-500">*</span></label>
                    <InputNumber v-model="formData.pos_x" class="w-full" :min="0" :maxFractionDigits="2"
                        :class="validations_errors.pos_x ? 'p-invalid' : ''"
                        @focus="validations_errors.pos_x = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.pos_x" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Y Position (mm) <span class="text-red-500">*</span></label>
                    <InputNumber v-model="formData.pos_y" class="w-full" :min="0" :maxFractionDigits="2"
                        :class="validations_errors.pos_y ? 'p-invalid' : ''"
                        @focus="validations_errors.pos_y = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.pos_y" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Width (mm) <span class="text-red-500">*</span></label>
                    <InputNumber v-model="formData.width" class="w-full" :min="1" :maxFractionDigits="2"
                        :class="validations_errors.width ? 'p-invalid' : ''"
                        @focus="validations_errors.width = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.width" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Height (mm) <span class="text-gray-400 font-normal ml-1">Optional</span></label>
                    <InputNumber v-model="formData.height" class="w-full" :min="0" :maxFractionDigits="2"
                        @focus="validations_errors.height = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.height" />
                </div>
            </div>
            
            <div class="col-span-1 md:col-span-2 pt-4 border-t mt-2">
                <h5 class="text-sm font-semibold text-gray-500 mb-2">Styling & Formatting (Optional)</h5>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Font Size (pt)</label>
                    <InputNumber v-model="formData.font_size" class="w-full" :min="4" :max="72"
                        @focus="validations_errors.font_size = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.font_size" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Alignment</label>
                    <Select v-model="formData.align" :options="aligns" optionLabel="label" optionValue="value"
                        class="w-full" @focus="validations_errors.align = ''" />
                    <LazyInputError class="text-xs mt-1" :message="validations_errors.align" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Font Family</label>
                    <LazyInputText v-model="formData.font_family" class="w-full" placeholder="helvetica" />
                </div>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Font Style (e.g., B, I, U)</label>
                    <LazyInputText v-model="formData.font_style" class="w-full" placeholder="Leave empty for regular" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Format String (e.g. d/m/Y)</label>
                    <LazyInputText v-model="formData.format" class="w-full" placeholder="Optional format string" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold text-sm">Fallback Value</label>
                    <LazyInputText v-model="formData.fallback_value" class="w-full" placeholder="Value if data missing" />
                </div>
            </div>

        </div>

        <template #footer class="flex justify-end gap-2 border-gray-200">
            <div class="flex justify-end items-center gap-3 border-gray-200 mt-4">
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
                    <Button type="button" :label="modalTitle === 'Create' ? 'Create Mapping' : 'Update Mapping'" severity="success"
                        raised class="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        @click="submitHandler">
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
