<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isOpenModal: { type: Boolean, required: true },
    item: { type: Object, default: () => ({}) }
});
const emit = defineEmits(['close']);

const visible = ref(props.isOpenModal);

watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const close = () => {
    emit('close');
};

const getStatusLabel = (status) => {
    switch (parseInt(status)) {
        case 0: return 'Pending Payment';
        case 1: return 'Pending Verification';
        case 2: return 'Completed';
        case 3: return 'Cancelled/Rejected';
        default: return 'Unknown';
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
                    <i class="fa-solid fa-file-invoice"></i>
                    Allocation Request Details
                </span>
                <i class="pi pi-times cursor-pointer hover:text-red-400 text-gray-300 transition-colors" @click="close"></i>
            </div>
        </template>
        
        <div class="space-y-4 pt-2 pb-2" v-if="item && item.id">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- User Details -->
                <div class="border border-gray-700 shadow-lg rounded-lg overflow-hidden bg-[#2d3748]">
                    <div class="bg-[#1e2f4a] px-4 py-3 border-b border-gray-700 flex items-center gap-2">
                        <i class="fa-solid fa-user text-blue-400"></i>
                        <h4 class="text-white font-semibold text-sm tracking-wide">User Details</h4>
                    </div>
                    <div class="p-4 grid grid-cols-2 gap-y-3 bg-[#1a202c]">
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Name</div>
                        <div class="text-sm font-semibold text-gray-100">{{ getInvestorName(item.user) }} {{ item.user?.user_info?.last_name || item.user?.last_name || '' }}</div>
                        
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</div>
                        <div class="text-sm text-blue-400">{{ item.user?.email || 'N/A' }}</div>
                        
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone</div>
                        <div class="text-sm text-gray-200">{{ item.user?.user_info?.phone_number || item.user?.phone || 'N/A' }}</div>
                    </div>
                </div>

                <!-- Fractional Item -->
                <div class="border border-gray-700 shadow-lg rounded-lg overflow-hidden bg-[#2d3748]">
                    <div class="bg-[#41b0b5] px-4 py-3 border-b border-[#369599] flex items-center gap-2">
                        <i class="fa-solid fa-car text-white"></i>
                        <h4 class="text-white font-semibold text-sm tracking-wide">Fractional Item</h4>
                    </div>
                    <div class="p-4 grid grid-cols-2 gap-y-3 bg-[#1a202c]">
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Car</div>
                        <div class="text-sm text-gray-100 font-semibold">{{ getCarName(item.fractional_item) }}</div>
                        
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Item Name</div>
                        <div class="text-sm text-gray-200">{{ item.fractional_item?.item_name || 'N/A' }}</div>
                    </div>
                </div>

                <!-- Allocation Details -->
                <div class="border border-gray-700 shadow-lg rounded-lg overflow-hidden bg-[#2d3748]">
                    <div class="bg-[#2eb981] px-4 py-3 border-b border-[#269f6f] flex items-center gap-2">
                        <i class="fa-solid fa-coins text-white"></i>
                        <h4 class="text-white font-semibold text-sm tracking-wide">Allocation Details</h4>
                    </div>
                    <div class="p-4 grid grid-cols-2 gap-y-3 bg-[#1a202c]">
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Number of Slots</div>
                        <div class="text-sm text-gray-100 font-semibold">{{ item.shares_count || '0' }}</div>
                        
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Amount paid</div>
                        <div class="text-sm text-green-400 font-bold">£{{ item.total_amount ? parseFloat(item.total_amount).toFixed(2) : '0.00' }}</div>
                        
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Payment Method</div>
                        <div class="text-sm text-gray-200 capitalize">{{ (item.payment_method || 'Bank Transfer').replace('_', ' ') }}</div>
                    </div>
                </div>

                <!-- Reference Details -->
                <div class="border border-gray-700 shadow-lg rounded-lg overflow-hidden bg-[#2d3748]">
                    <div class="bg-[#edb84f] px-4 py-3 border-b border-[#dca640] flex items-center gap-2">
                        <i class="fa-solid fa-hashtag text-white"></i>
                        <h4 class="text-white font-semibold text-sm tracking-wide">Reference Details</h4>
                    </div>
                    <div class="p-4 grid grid-cols-2 gap-y-3 bg-[#1a202c]">
                        <div class="text-xs text-gray-400 font-medium uppercase tracking-wider">Reference</div>
                        <div class="text-sm text-gray-200 font-medium">{{ item.slug || 'N/A' }}</div>
                    </div>
                </div>
            </div>

            <!-- Documents List -->
            <div class="mt-4 border border-gray-700 shadow-lg rounded-lg overflow-hidden bg-[#2d3748]">
                <div class="bg-[#4d5966] text-white px-4 py-3 font-semibold flex items-center gap-2">
                    <i class="pi pi-file"></i> Documents List
                </div>
                <div class="p-4 bg-[#1a202c]">
                    <div class="flex items-center gap-2 text-sm text-gray-200 bg-gray-800 border border-gray-700 p-3 rounded-lg w-fit shadow-inner">
                        <i class="pi pi-file-pdf text-red-400 text-lg"></i>
                        <span class="font-medium">document generated .pdf</span>
                    </div>
                </div>
            </div>
            
            <!-- Custom Note / Rejection Reason -->
            <div class="flex flex-wrap gap-4 mt-4" v-if="item.rejection_reason || item.custom_note">
                <div v-if="item.custom_note" class="w-full bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/50 mb-2 shadow-inner">
                    <div class="text-xs text-yellow-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-note-sticky"></i> Custom Note
                    </div>
                    <div class="text-gray-200 whitespace-pre-wrap text-sm">{{ item.custom_note }}</div>
                </div>

                <div v-if="item.rejection_reason" class="w-full bg-red-900/20 p-4 rounded-lg border border-red-700/50 shadow-inner">
                    <div class="text-xs text-red-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-circle-exclamation"></i> Rejection Reason
                    </div>
                    <div class="text-gray-200 text-sm">{{ item.rejection_reason }}</div>
                </div>
            </div>
            
            <div class="flex justify-end mt-6 border-t border-gray-700 pt-4">
                <button 
                    @click="close"
                    class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    </Dialog>
</template>
