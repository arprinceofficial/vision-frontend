<script setup>
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

const getStateLabel = (state) => {
    switch (parseInt(state)) {
        case 1: return 'What Happens Next';
        case 2: return 'Documents';
        case 3: return 'Syndicate Vote';
        case 4: return 'Cart';
        case 5: return 'Final Agreement';
        case 6: return 'Payment';
        default: return 'Unknown';
    }
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '45rem' }" @update:visible="close">
        <template #header>
            <div class="flex justify-between items-center w-full">
                <span class="p-dialog-title text-xl font-bold">Allocation Request Details</span>
                <i class="pi pi-times cursor-pointer hover:text-red-500" @click="close"></i>
            </div>
        </template>
        
        <div class="pt-4 pb-2" v-if="item && item.id">
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 sm:col-span-1 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">Request ID</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">#{{ item.id }}</div>
                </div>
                <div class="col-span-2 sm:col-span-1 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">Slug</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ item.slug }}</div>
                </div>
                
                <div class="col-span-2 sm:col-span-1 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">Status</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ getStatusLabel(item.status) }}</div>
                </div>
                <div class="col-span-2 sm:col-span-1 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">State (User Journey)</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ getStateLabel(item.state) || 'N/A' }}</div>
                </div>

                <div class="col-span-2 sm:col-span-1 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">Shares Count</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ item.shares_count }}</div>
                </div>
                <div class="col-span-2 sm:col-span-1 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">Total Amount</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ item.total_amount }}</div>
                </div>

                <div class="col-span-2 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">User</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">
                        {{ item.user?.first_name }} {{ item.user?.last_name }} ({{ item.user?.email }})
                    </div>
                </div>

                <div class="col-span-2 border-b pb-2">
                    <div class="text-sm text-gray-500 mb-1">Fractional Item</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">
                        {{ item.fractional_item?.assetable?.asset_name || item.fractional_item?.item_name || 'N/A' }}
                    </div>
                </div>

                <div class="col-span-2 sm:col-span-1 pb-2">
                    <div class="text-sm text-gray-500 mb-1">Payment Method</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ item.payment_method || 'N/A' }}</div>
                </div>
                <div class="col-span-2 sm:col-span-1 pb-2">
                    <div class="text-sm text-gray-500 mb-1">Created At</div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">{{ new Date(item.created_at).toLocaleString() }}</div>
                </div>
                
                <div class="col-span-2 border-b pb-2 mt-2">
                    <div class="text-sm text-gray-500 mb-2 font-bold uppercase tracking-wider">User Journey & Dates</div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-xs">
                            <span class="text-gray-500 block">Approved At</span>
                            <span class="font-semibold">{{ item.approved_at ? new Date(item.approved_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-500 block">Paid At</span>
                            <span class="font-semibold">{{ item.paid_at ? new Date(item.paid_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-500 block">Agreement Accepted</span>
                            <span class="font-semibold">{{ item.agreement_accepted_at ? new Date(item.agreement_accepted_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-500 block">Documents Viewed</span>
                            <span class="font-semibold">{{ item.documents_viewed_at ? new Date(item.documents_viewed_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-500 block">Documents Signed</span>
                            <span class="font-semibold">{{ item.document_signed_at ? new Date(item.document_signed_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-500 block">Syndicate Vote</span>
                            <span class="font-semibold">{{ item.syndicate_vote_at ? new Date(item.syndicate_vote_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-500 block">Cart Completed</span>
                            <span class="font-semibold">{{ item.cart_completed_at ? new Date(item.cart_completed_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                        <div class="text-xs">
                            <span class="text-gray-500 block">KYC Completed</span>
                            <span class="font-semibold">{{ item.kyc_completed_at ? new Date(item.kyc_completed_at).toLocaleString() : 'N/A' }}</span>
                        </div>
                    </div>
                </div>

                <div class="col-span-2 border-b pb-2 mt-2">
                    <div class="text-sm text-gray-500 mb-2 font-bold uppercase tracking-wider">Flags & Confirmations</div>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 text-[10px] rounded border" :class="item.agree_terms ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'">Agree Terms</span>
                        <span class="px-2 py-1 text-[10px] rounded border" :class="item.agree_documents ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'">Agree Documents</span>
                        <span class="px-2 py-1 text-[10px] rounded border" :class="item.agree_support ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'">Agree Support</span>
                        <span class="px-2 py-1 text-[10px] rounded border" :class="item.documents_sent ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500'">Documents Sent</span>
                        <span class="px-2 py-1 text-[10px] rounded border" :class="item.documents_signed ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500'">Documents Signed</span>
                        <span class="px-2 py-1 text-[10px] rounded border" :class="item.kyc_skipped ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-500'">KYC Skipped</span>
                    </div>
                </div>

                <div v-if="item.custom_note" class="col-span-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 mb-2">
                    <div class="text-sm text-yellow-700 dark:text-yellow-500 font-semibold mb-1">Custom Note</div>
                    <div class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ item.custom_note }}</div>
                </div>

                <div v-if="item.rejection_reason" class="col-span-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200">
                    <div class="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">Rejection Reason</div>
                    <div class="text-gray-800 dark:text-gray-200">{{ item.rejection_reason }}</div>
                </div>
            </div>
        </div>
        
        <template #footer>
            <div class="flex justify-end gap-2 w-full mt-4">
                <Button label="Close" icon="pi pi-times" class="p-button-secondary" @click="close" />
            </div>
        </template>
    </Dialog>
</template>
