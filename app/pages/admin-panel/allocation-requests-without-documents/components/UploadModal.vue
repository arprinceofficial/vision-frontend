<script setup>
import { ref, watch } from 'vue';

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

const isDragging = ref({
    subscription_agreement: false,
    terms_and_conditions: false
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
    processFile(file, field);
};

const handleFileDrop = (event, field) => {
    isDragging.value[field] = false;
    const file = event.dataTransfer?.files[0];
    processFile(file, field);
};

const processFile = (file, field) => {
    if (file && file.type === 'application/pdf') {
        formData.value[field] = file;
        fileNames.value[field] = file.name;
        validations_errors.value[field] = null;
    } else if (file) {
        validations_errors.value[field] = 'Only PDF files are allowed.';
    }
};

const removeFile = (field) => {
    formData.value[field] = null;
    fileNames.value[field] = '';
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
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '38rem' }" @update:visible="close" contentClass="p-0">
        <template #header>
            <div class="flex justify-between items-center w-full px-1">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                        <i class="pi pi-file-pdf text-indigo-600 dark:text-indigo-400 text-lg"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white m-0 leading-none">Upload Signed Documents</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">Upload the finalised PDF agreements for this allocation</p>
                    </div>
                </div>
                <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i class="pi pi-times"></i>
                </button>
            </div>
        </template>
        
        <div class="pt-2 px-1 pb-4">
            <div class="grid grid-cols-1 gap-6">
                <!-- Subscription Agreement -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Subscription Agreement <span class="text-red-500">*</span></label>
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">PDF</span>
                    </div>
                    
                    <div 
                        class="relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
                        :class="[
                            isDragging.subscription_agreement ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-4 ring-indigo-50 dark:ring-indigo-500/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500', 
                            validations_errors.subscription_agreement ? '!border-red-400 !bg-red-50 dark:!bg-red-500/10' : ''
                        ]"
                        @dragover.prevent="isDragging.subscription_agreement = true"
                        @dragleave.prevent="isDragging.subscription_agreement = false"
                        @drop.prevent="handleFileDrop($event, 'subscription_agreement')"
                        @click="!fileNames.subscription_agreement && $refs.subInput.click()"
                    >
                        <input type="file" ref="subInput" accept="application/pdf" class="hidden" @change="e => handleFileSelect(e, 'subscription_agreement')" />
                        
                        <div v-if="!fileNames.subscription_agreement" class="text-center pointer-events-none">
                            <div class="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center justify-center mx-auto mb-3">
                                <i class="pi pi-cloud-upload text-xl text-indigo-500"></i>
                            </div>
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-200"><span class="text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Only PDF documents are supported</p>
                        </div>
                        
                        <div v-else class="flex flex-col items-center w-full">
                            <div class="flex items-center justify-between w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-default">
                                <div class="flex items-center gap-3 overflow-hidden">
                                    <div class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                        <i class="pi pi-file-pdf text-red-500 text-lg"></i>
                                    </div>
                                    <div class="truncate text-left">
                                        <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" :title="fileNames.subscription_agreement">{{ fileNames.subscription_agreement }}</p>
                                        <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                                            <i class="pi pi-check-circle text-[10px]"></i> Ready to upload
                                        </p>
                                    </div>
                                </div>
                                <button @click.stop="removeFile('subscription_agreement')" class="p-2 ml-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Remove file">
                                    <i class="pi pi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="validations_errors.subscription_agreement" class="flex items-center gap-1.5 mt-2 text-red-500 text-sm font-medium">
                        <i class="pi pi-exclamation-circle text-sm"></i>
                        <span>{{ validations_errors.subscription_agreement }}</span>
                    </div>
                </div>
                
                <!-- Terms and Conditions -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <label class="block text-sm font-semibold text-gray-800 dark:text-gray-200">Terms and Conditions <span class="text-red-500">*</span></label>
                        <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">PDF</span>
                    </div>
                    
                    <div 
                        class="relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
                        :class="[
                            isDragging.terms_and_conditions ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-4 ring-indigo-50 dark:ring-indigo-500/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500', 
                            validations_errors.terms_and_conditions ? '!border-red-400 !bg-red-50 dark:!bg-red-500/10' : ''
                        ]"
                        @dragover.prevent="isDragging.terms_and_conditions = true"
                        @dragleave.prevent="isDragging.terms_and_conditions = false"
                        @drop.prevent="handleFileDrop($event, 'terms_and_conditions')"
                        @click="!fileNames.terms_and_conditions && $refs.termsInput.click()"
                    >
                        <input type="file" ref="termsInput" accept="application/pdf" class="hidden" @change="e => handleFileSelect(e, 'terms_and_conditions')" />
                        
                        <div v-if="!fileNames.terms_and_conditions" class="text-center pointer-events-none">
                            <div class="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center justify-center mx-auto mb-3">
                                <i class="pi pi-cloud-upload text-xl text-indigo-500"></i>
                            </div>
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-200"><span class="text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Only PDF documents are supported</p>
                        </div>
                        
                        <div v-else class="flex flex-col items-center w-full">
                            <div class="flex items-center justify-between w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-default">
                                <div class="flex items-center gap-3 overflow-hidden">
                                    <div class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                        <i class="pi pi-file-pdf text-red-500 text-lg"></i>
                                    </div>
                                    <div class="truncate text-left">
                                        <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" :title="fileNames.terms_and_conditions">{{ fileNames.terms_and_conditions }}</p>
                                        <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                                            <i class="pi pi-check-circle text-[10px]"></i> Ready to upload
                                        </p>
                                    </div>
                                </div>
                                <button @click.stop="removeFile('terms_and_conditions')" class="p-2 ml-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Remove file">
                                    <i class="pi pi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="validations_errors.terms_and_conditions" class="flex items-center gap-1.5 mt-2 text-red-500 text-sm font-medium">
                        <i class="pi pi-exclamation-circle text-sm"></i>
                        <span>{{ validations_errors.terms_and_conditions }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <template #footer>
            <div class="flex justify-end gap-3 w-full mt-2 pt-4 border-t border-gray-100 dark:border-gray-700 px-1">
                <button @click="close" class="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Cancel
                </button>
                <button 
                    @click="submit" 
                    :disabled="isSubmitting || !formData.subscription_agreement || !formData.terms_and_conditions"
                    class="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
                >
                    <i class="pi pi-spinner pi-spin" v-if="isSubmitting"></i>
                    <i class="pi pi-cloud-upload" v-else></i>
                    <span>{{ isSubmitting ? 'Uploading...' : 'Upload Documents' }}</span>
                </button>
            </div>
        </template>
    </Dialog>
</template>
