<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isOpenModal: { type: Boolean, required: true },
    item: { type: Object, default: () => ({}) }
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

const close = () => {
    emit('close');
};

const handleFileSelect = (event, field) => {
    const file = event.target.files[0];
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

const triggerFileInput = (field) => {
    document.getElementById(`file-upload-${field}`).click();
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

    if (hasError || !props.item || !props.item.id) return;

    isSubmitting.value = true;
    try {
        const submitData = new FormData();
        submitData.append('subscription_agreement', formData.value.subscription_agreement);
        submitData.append('terms_and_conditions', formData.value.terms_and_conditions);

        const res = await $fetchAdmin(`v1/admin/allocation-requests/${props.item.id}/upload-documents`, {
            method: 'POST',
            body: submitData
        });
        
        if (res.success || res.status) {
            emit('submit', res.data || res);
            close();
        }
    } catch (e) {
        console.error(e);
        if (e.response && e.response._data && e.response._data.errors) {
            validations_errors.value = e.response._data.errors;
        }
    } finally {
        isSubmitting.value = false;
    }
};

const getInvestorName = (user) => {
    if (!user) return 'N/A';
    return user.username || user.user_info?.first_name || user.first_name || user.name || 'Investor';
};

const getCarName = (fractionalItem) => {
    if (!fractionalItem) return 'N/A';
    return fractionalItem.vehicle?.name || 
           (fractionalItem.vehicle?.make ? `${fractionalItem.vehicle.make} ${fractionalItem.vehicle.model}` : null) || 
           fractionalItem.item_name || 
           'N/A';
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '55rem' }" @update:visible="close"
        :pt="{
            root: { class: 'bg-[#1a202c] border border-gray-700 rounded-lg shadow-xl' },
            header: { class: 'bg-[#1e2f4a] text-white border-b border-gray-700 rounded-t-lg px-6 py-4' },
            content: { class: 'bg-[#1a202c] text-gray-200 px-6 py-6' }
        }"
    >
        <template #header>
            <div class="flex justify-between items-center w-full">
                <span class="text-xl font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    Upload Signed Documents
                </span>
                <i class="pi pi-times cursor-pointer hover:text-red-400 text-gray-300 transition-colors" @click="close"></i>
            </div>
        </template>

        <div class="space-y-6" v-if="item && item.id">
            <!-- Allocation Summary -->
            <div class="border border-gray-700 shadow-lg rounded-lg overflow-hidden bg-[#2d3748]">
                <div class="bg-[#1e2f4a] px-5 py-3 border-b border-gray-700 flex items-center gap-2">
                    <i class="fa-solid fa-list-check text-blue-400"></i>
                    <h4 class="text-white font-semibold text-sm tracking-wide">Allocation Summary</h4>
                </div>
                <div class="p-5 grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#1a202c]">
                    <div>
                        <div class="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Investor</div>
                        <div class="font-semibold text-gray-100">{{ getInvestorName(item.user) }} {{ item.user?.user_info?.last_name || item.user?.last_name || '' }}</div>
                        <div class="text-xs text-blue-400 mt-1">{{ item.user?.email || 'N/A' }}</div>
                    </div>
                    <div class="md:col-span-2">
                        <div class="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Car</div>
                        <div class="font-semibold text-gray-100 flex items-center gap-2">
                            <i class="fa-solid fa-car-side text-gray-500"></i>
                            {{ getCarName(item.fractional_item) }}
                        </div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Slots & Amount</div>
                        <div class="font-semibold text-gray-100">{{ item.shares_count || '0' }} Slot(s)</div>
                        <div class="text-sm text-green-400 mt-0.5 font-bold">£{{ item.total_amount ? parseFloat(item.total_amount).toFixed(2) : '0.00' }}</div>
                    </div>
                </div>
            </div>

            <!-- Upload Documents Section -->
            <div class="border border-gray-700 shadow-lg rounded-lg overflow-hidden bg-[#2d3748]">
                <div class="bg-[#edb84f] px-5 py-3 border-b border-[#dca640] flex items-center gap-2">
                    <i class="fa-solid fa-file-pdf text-white"></i>
                    <h4 class="text-white font-semibold text-sm tracking-wide">Document Upload</h4>
                </div>
                
                <div class="p-6 bg-[#1a202c]">
                    <div class="bg-blue-900/30 border border-blue-800/50 p-4 rounded-lg text-sm text-blue-200 flex items-start gap-3 mb-6 shadow-inner">
                        <i class="fa-solid fa-circle-info text-blue-400 mt-0.5 text-lg"></i>
                        <div>
                            <p class="font-medium text-blue-100 mb-1">Upload the physically signed PDF documents.</p>
                            <p class="text-xs text-blue-300">Both files must be in PDF format (max 10 MB each). Please ensure the signatures are clearly visible.</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <!-- Subscription Agreement Dropzone -->
                        <div 
                            class="relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 group flex flex-col items-center justify-center text-center cursor-pointer"
                            :class="[
                                fileNames.subscription_agreement ? 'border-green-500 bg-green-900/10' : 'border-gray-600 bg-gray-800 hover:border-blue-500 hover:bg-gray-800/80',
                                validations_errors.subscription_agreement ? 'border-red-500 bg-red-900/10' : ''
                            ]"
                            @click="triggerFileInput('subscription')"
                        >
                            <input 
                                type="file" 
                                id="file-upload-subscription"
                                accept="application/pdf"
                                @change="handleFileSelect($event, 'subscription_agreement')" 
                                class="hidden"
                            >
                            
                            <div v-if="fileNames.subscription_agreement" class="flex flex-col items-center">
                                <div class="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3 text-green-400">
                                    <i class="fa-solid fa-check text-xl"></i>
                                </div>
                                <h5 class="text-sm font-semibold text-gray-200 mb-1">Subscription Agreement</h5>
                                <p class="text-xs text-green-400 break-all px-4">{{ fileNames.subscription_agreement }}</p>
                            </div>
                            <div v-else class="flex flex-col items-center">
                                <div class="w-12 h-12 bg-gray-700 group-hover:bg-blue-900/40 rounded-full flex items-center justify-center mb-3 text-gray-400 group-hover:text-blue-400 transition-colors">
                                    <i class="fa-solid fa-cloud-arrow-up text-xl"></i>
                                </div>
                                <h5 class="text-sm font-semibold text-gray-200 mb-1">Subscription Agreement <span class="text-red-400">*</span></h5>
                                <p class="text-xs text-gray-500 mb-2">Click to browse (PDF only)</p>
                                <span class="px-3 py-1 bg-gray-700 text-xs rounded text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">Select File</span>
                            </div>
                            
                            <div v-if="validations_errors.subscription_agreement" class="absolute -bottom-6 left-0 text-xs text-red-400 flex items-center gap-1">
                                <i class="fa-solid fa-circle-exclamation"></i> {{ validations_errors.subscription_agreement }}
                            </div>
                        </div>

                        <!-- Terms & Conditions Dropzone -->
                        <div 
                            class="relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 group flex flex-col items-center justify-center text-center cursor-pointer"
                            :class="[
                                fileNames.terms_and_conditions ? 'border-green-500 bg-green-900/10' : 'border-gray-600 bg-gray-800 hover:border-blue-500 hover:bg-gray-800/80',
                                validations_errors.terms_and_conditions ? 'border-red-500 bg-red-900/10' : ''
                            ]"
                            @click="triggerFileInput('terms')"
                        >
                            <input 
                                type="file" 
                                id="file-upload-terms"
                                accept="application/pdf"
                                @change="handleFileSelect($event, 'terms_and_conditions')" 
                                class="hidden"
                            >
                            
                            <div v-if="fileNames.terms_and_conditions" class="flex flex-col items-center">
                                <div class="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3 text-green-400">
                                    <i class="fa-solid fa-check text-xl"></i>
                                </div>
                                <h5 class="text-sm font-semibold text-gray-200 mb-1">Terms & Conditions</h5>
                                <p class="text-xs text-green-400 break-all px-4">{{ fileNames.terms_and_conditions }}</p>
                            </div>
                            <div v-else class="flex flex-col items-center">
                                <div class="w-12 h-12 bg-gray-700 group-hover:bg-blue-900/40 rounded-full flex items-center justify-center mb-3 text-gray-400 group-hover:text-blue-400 transition-colors">
                                    <i class="fa-solid fa-cloud-arrow-up text-xl"></i>
                                </div>
                                <h5 class="text-sm font-semibold text-gray-200 mb-1">Terms & Conditions <span class="text-red-400">*</span></h5>
                                <p class="text-xs text-gray-500 mb-2">Click to browse (PDF only)</p>
                                <span class="px-3 py-1 bg-gray-700 text-xs rounded text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">Select File</span>
                            </div>
                            
                            <div v-if="validations_errors.terms_and_conditions" class="absolute -bottom-6 left-0 text-xs text-red-400 flex items-center gap-1">
                                <i class="fa-solid fa-circle-exclamation"></i> {{ validations_errors.terms_and_conditions }}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 pt-4 border-t border-gray-700 justify-end">
                        <button 
                            @click="close"
                            class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            @click="submit" 
                            :disabled="isSubmitting"
                            class="px-6 py-2.5 bg-[#edb84f] hover:bg-[#dca640] text-gray-900 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
                            <i v-else class="fa-solid fa-upload"></i>
                            Upload & Complete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>
