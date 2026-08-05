<script setup>
const props = defineProps({
    isOpenModal: { type: Boolean, required: true },
    requestId: { type: Number, default: null }
});
const emit = defineEmits(['close', 'submit']);

const visible = ref(props.isOpenModal);
const isSubmitting = ref(false);
const validations_errors = ref({});

const formData = ref({
    subscription_agreement: null,
    terms_and_conditions: null
});

const fileNames = ref({
    subscription_agreement: '',
    terms_and_conditions: ''
});

watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
    if (newVal) {
        formData.value = {
            subscription_agreement: null,
            terms_and_conditions: null
        };
        fileNames.value = {
            subscription_agreement: '',
            terms_and_conditions: ''
        };
        validations_errors.value = {};
    }
});

const handleFileSelect = (event, field) => {
    const file = event.target.files[0];
    if (file) {
        formData.value[field] = file;
        fileNames.value[field] = file.name;
        validations_errors.value[field] = null;
    }
};

const submit = async () => {
    validations_errors.value = {};
    let hasError = false;

    if (!formData.value.subscription_agreement) {
        validations_errors.value.subscription_agreement = 'Subscription Agreement is required.';
        hasError = true;
    }
    if (!formData.value.terms_and_conditions) {
        validations_errors.value.terms_and_conditions = 'Terms and Conditions is required.';
        hasError = true;
    }

    if (hasError || !props.requestId) return;

    isSubmitting.value = true;
    try {
        const submitData = new FormData();
        submitData.append('subscription_agreement', formData.value.subscription_agreement);
        submitData.append('terms_and_conditions', formData.value.terms_and_conditions);

        const res = await $fetchAdmin(`v1/admin/allocation-requests/${props.requestId}/upload-documents`, {
            method: 'POST',
            body: submitData
        });
        
        if (res.success || res.status) {
            emit('submit', res.data || res);
        }
    } catch (e) {
        console.error(e);
        if (e.response?._data?.errors || e.response?._data?.data) {
            const errs = e.response._data.errors || e.response._data.data;
            for (const key in errs) {
                if (errs.hasOwnProperty(key)) {
                    validations_errors.value[key] = errs[key][0] || errs[key];
                }
            }
        } else {
            alert(e.response?._data?.message || 'Error uploading documents');
        }
    } finally {
        isSubmitting.value = false;
    }
};

const close = () => {
    emit('close');
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '35rem' }" @update:visible="close">
        <template #header>
            <div class="flex justify-between items-center w-full">
                <span class="p-dialog-title text-xl font-bold">Upload Signed Documents</span>
                <i class="pi pi-times cursor-pointer hover:text-red-500" @click="close"></i>
            </div>
        </template>
        <div class="pt-4">
            <div class="grid grid-cols-1 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Subscription Agreement (PDF) <span class="text-red-500">*</span></label>
                    <div class="flex items-center gap-2">
                        <input type="file" ref="subInput" accept="application/pdf" class="hidden" @change="e => handleFileSelect(e, 'subscription_agreement')" />
                        <Button label="Choose File" icon="pi pi-upload" class="p-button-secondary p-button-sm" @click="$refs.subInput.click()" />
                        <span class="text-sm text-gray-600 truncate max-w-[200px]" :title="fileNames.subscription_agreement">{{ fileNames.subscription_agreement || 'No file chosen' }}</span>
                    </div>
                    <small v-if="validations_errors.subscription_agreement" class="p-error block mt-1">{{ validations_errors.subscription_agreement }}</small>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Terms and Conditions (PDF) <span class="text-red-500">*</span></label>
                    <div class="flex items-center gap-2">
                        <input type="file" ref="termsInput" accept="application/pdf" class="hidden" @change="e => handleFileSelect(e, 'terms_and_conditions')" />
                        <Button label="Choose File" icon="pi pi-upload" class="p-button-secondary p-button-sm" @click="$refs.termsInput.click()" />
                        <span class="text-sm text-gray-600 truncate max-w-[200px]" :title="fileNames.terms_and_conditions">{{ fileNames.terms_and_conditions || 'No file chosen' }}</span>
                    </div>
                    <small v-if="validations_errors.terms_and_conditions" class="p-error block mt-1">{{ validations_errors.terms_and_conditions }}</small>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2 w-full mt-4">
                <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger" @click="close" />
                <Button label="Upload" icon="pi pi-check" class="p-button-success" :loading="isSubmitting" @click="submit" />
            </div>
        </template>
    </Dialog>
</template>
