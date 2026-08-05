<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    fractionalItems: Array
})

const emit = defineEmits(['add_emit', 'close']);

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const documentTypes = [
    { label: 'Subscription Agreement', value: 'subscription_agreement' },
    { label: 'Terms and Conditions', value: 'terms_and_conditions' },
];

const formData = ref({
    id: null,
    name: '',
    document_type: '',
    variant: '',
    fractional_item_id: null,
    is_active: 1,
});

const selectedFile = ref(null);
const filePreviewName = ref('');

const isChecked = ref(true);

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id,
            name: value.name,
            document_type: value.document_type,
            variant: value.variant,
            fractional_item_id: value.fractional_item_id,
            is_active: value.is_active,
        };
        isChecked.value = value.is_active == 1 ? true : false;
        selectedFile.value = null;
        filePreviewName.value = 'Existing PDF file (Upload new to replace)';
    } else {
        formData.value = {
            id: null,
            name: '',
            document_type: '',
            variant: '',
            fractional_item_id: null,
            is_active: 1,
        };
        isChecked.value = true;
        selectedFile.value = null;
        filePreviewName.value = '';
    }
}, { immediate: true });

const handleCheckboxChange = () => {
    formData.value.is_active = isChecked.value ? 1 : 0;
}

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed');
            event.target.value = '';
            return;
        }
        selectedFile.value = file;
        filePreviewName.value = file.name;
        validations_errors.value.template_file = '';
    }
}

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'is_active',
    'fractional_item_id',
]);

const isLoading = ref(false);
const response_modal = ref({});

const submitHandler = async () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => {
        return (formData.value[item] === null || formData.value[item] === '') && !skip_validations.value.includes(item);
    });

    if (props.modalTitle === 'Create' && !selectedFile.value) {
        validations_errors.value['template_file'] = 'Template file is required';
        errors.push('template_file');
    }

    if (errors.length > 0) {
        errors.forEach(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return;
    }

    const payload = new FormData();
    for (const key in formData.value) {
        if (formData.value[key] !== null && formData.value[key] !== '') {
            payload.append(key, formData.value[key]);
        }
    }
    
    // Add file if selected
    if (selectedFile.value) {
        payload.append('template_file', selectedFile.value);
    }
    
    // Check if it's an update, Laravel needs _method=PUT with FormData
    let endpoint = `v1/admin/document-templates`;
    if (props.modalTitle === 'Update' || props.modalTitle === 'Edit') {
        endpoint = `v1/admin/document-templates/${formData.value.id}`;
        payload.append('_method', 'PUT');
    }

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(endpoint, {
            method: 'POST', // Always POST for FormData to support files
            body: payload,
        });

        response_modal.value = getData;
        if (getData.success == true || getData.status == true) {
            emit('add_emit', getData.data);
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
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '50rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Document Template</h4>
            </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-4 col-span-1 md:col-span-2">
                <div class="flex-auto">
                    <label class="font-semibold">Name <span class="text-red-500">*</span></label>
                    <LazyInputText v-model="formData.name" class="w-full"
                        :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.name = ''" placeholder="e.g. Default Subscription Agreement" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Document Type <span class="text-red-500">*</span></label>
                    <Select v-model="formData.document_type" :options="documentTypes" optionLabel="label" optionValue="value"
                        placeholder="Select Type" class="w-full" :class="validations_errors.document_type ? 'p-invalid' : ''"
                        @focus="validations_errors.document_type = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.document_type" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Variant <span class="text-red-500">*</span></label>
                    <LazyInputText v-model="formData.variant" class="w-full"
                        :class="validations_errors.variant ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.variant = ''" placeholder="e.g. default, UK, USA" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.variant" />
                </div>
            </div>

            <div class="flex items-center gap-4 col-span-1 md:col-span-2">
                <div class="flex-auto">
                    <label class="font-semibold">Fractional Item (Optional)</label>
                    <Select v-model="formData.fractional_item_id" :options="fractionalItems" optionLabel="item_name" optionValue="id"
                        placeholder="Select Item (Leave empty for default)" class="w-full" showClear />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.fractional_item_id" />
                </div>
            </div>

            <div class="flex items-center gap-4 col-span-1 md:col-span-2">
                <div class="flex-auto">
                    <label class="font-semibold">Template PDF <span v-if="modalTitle === 'Create'" class="text-red-500">*</span></label>
                    
                    <div class="file_upload p-4 relative w-full border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 dark:bg-gray-800">
                        <label class="cursor-pointer flex flex-col items-center justify-center">
                            <i class="pi pi-file-pdf text-3xl text-red-500 mb-2"></i>
                            <span class="text-gray-600 dark:text-gray-400 font-medium hover:text-sky-500 transition-colors">
                                {{ filePreviewName ? filePreviewName : 'Click to select a PDF file' }}
                            </span>
                            <input type="file" accept="application/pdf" class="hidden" @change="handleFileChange">
                        </label>
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.template_file" />
                </div>
            </div>

            <div class="flex items-center gap-4 md:mt-4 col-span-1 md:col-span-2">
                <label class="font-semibold w-24">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="isChecked" @change="handleCheckboxChange" />
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
