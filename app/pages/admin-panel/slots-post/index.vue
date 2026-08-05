<script setup>
const AddEdit = defineAsyncComponent(() => import('./components/AddEdit.vue'));
const RejectModal = defineAsyncComponent(() => import('./components/RejectModal.vue'));
const ViewModal = defineAsyncComponent(() => import('./components/ViewModal.vue'));

definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const route = useRoute();

const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: ''
});

const isLoading = ref(false);
const data = ref([]);
const response_modal = ref({});
const permissions = ref({ add: true, edit: true, delete: true, view: true });

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

const getStatusSeverity = (status) => {
    switch (parseInt(status)) {
        case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 1: return 'bg-blue-100 text-blue-800 border-blue-200';
        case 2: return 'bg-green-100 text-green-800 border-green-200';
        case 3: return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};


const formatCurrency = (value) => {
    if (!value) return '£0.00';
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return { date: 'N/A', year: '', time: '' };
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { date: `${day} ${month}`, year, time };
};

const loadData = async () => {
    isLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/slots-post`, {
            method: 'GET',
            params: {
                page: route.query.page || 1,
                length: 10,
            }
        });
        const list = getData?.data?.data ?? getData?.data ?? [];
        data.value = Array.isArray(list) ? list : [];
        paginationConfig.value.data = getData?.data?.meta ?? getData?.meta ?? [];
    } catch (e) {
        console.log('Get Message', e.message);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadData();
});

watch(() => route.query, () => {
    loadData();
});

// Create/Edit Modal
const isOpenModal = ref(false);
const item = ref({});
const modalTitle = ref('');

const addNew = () => {
    item.value = {};
    modalTitle.value = 'Create';
    isOpenModal.value = true;
};

const editHandler = (i) => {
    item.value = { ...i };
    modalTitle.value = 'Edit';
    isOpenModal.value = true;
};

const receivedData = (d) => {
    isOpenModal.value = false;
    loadData();
};

const cancelModal = () => {
    isOpenModal.value = false;
};

// View Modal
const isOpenViewModal = ref(false);
const selectedItemToView = ref(null);

const viewHandler = (item) => {
    selectedItemToView.value = { ...item };
    isOpenViewModal.value = true;
};

const closeViewModal = () => {
    selectedItemToView.value = null;
    isOpenViewModal.value = false;
};

// Reject Modal
const isOpenRejectModal = ref(false);
const selectedItemToReject = ref(null);

const openRejectModal = (item) => {
    selectedItemToReject.value = item;
    isOpenRejectModal.value = true;
};

const closeRejectModal = () => {
    selectedItemToReject.value = null;
    isOpenRejectModal.value = false;
};

const handleReject = async (reason) => {
    try {
        const res = await $fetchAdmin(`v1/admin/allocation-requests/${selectedItemToReject.value.id}/reject`, {
            method: 'POST',
            body: { reason }
        });
        if (res.success || res.status) {
            response_modal.value = { status: true, message: 'Request rejected successfully.' };
            closeRejectModal();
            loadData();
        }
    } catch (e) {
        response_modal.value = { status: false, message: e.response?._data?.message || 'Error rejecting request.' };
    }
};

// Approve action
const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this request?')) return;
    try {
        const res = await $fetchAdmin(`v1/admin/allocation-requests/${id}/approve`, {
            method: 'POST'
        });
        if (res.success || res.status) {
            response_modal.value = { status: true, message: 'Request approved successfully.' };
            loadData();
        }
    } catch (e) {
        response_modal.value = { status: false, message: e.response?._data?.message || 'Error approving request.' };
    }
};

// Verify Payment action
const handleVerifyPayment = async (id) => {
    if (!confirm('Are you sure you want to verify payment for this request?')) return;
    try {
        const res = await $fetchAdmin(`v1/admin/allocation-requests/${id}/verify-payment`, {
            method: 'POST'
        });
        if (res.success || res.status) {
            response_modal.value = { status: true, message: 'Payment verified successfully.' };
            loadData();
        }
    } catch (e) {
        response_modal.value = { status: false, message: e.response?._data?.message || 'Error verifying payment.' };
    }
};

</script>

<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
                <div class="w-full md:w-auto flex flex-wrap gap-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Total Slots</h3>
                </div>
                <Skeleton v-if="isLoading" width="8rem" height="2.5rem" borderRadius="10px"></Skeleton>
                <Button v-else-if="permissions?.add" label="Create Request" @click="addNew" class="text-xs" />
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">


                <div class="border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="p-0">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto w-full text-left text-sm">
                                <thead class="sticky z-10 top-0 bg-[#1e2f4a] text-white">
                                    <tr>
                                        <th class="py-3 px-3 font-semibold">ID / Slug</th>
                                        <th class="py-3 px-3 font-semibold">Car Name</th>
                                        <th class="py-3 px-3 font-semibold text-center">Total Slots</th>
                                        <th class="py-3 px-3 font-semibold text-center">Available Slots</th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading">
                                    <tr v-for="index in 5" :key="index">
                                        <td v-for="col in 4" :key="col" class="py-3 px-3 text-center">
                                            <Skeleton width="100%" height="1.5rem"></Skeleton>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(item, index) in data" :key="index" class="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <!-- ID / Slug -->
                                        <td class="py-3 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="font-bold">#{{ item.id }}</div>
                                            <span class="text-gray-500 text-xs font-medium">{{ item.slug || 'N/A' }}</span>
                                        </td>
                                        
                                        <!-- Car -->
                                        <td class="py-3 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="font-medium">{{ item.assetable?.asset_name || item.item_name || 'N/A' }}</div>
                                        </td>
                                        
                                        <!-- Total Slots -->
                                        <td class="py-3 px-3 text-center text-gray-800 dark:text-gray-200">
                                            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold">{{ item.total_shares || 0 }}</span>
                                        </td>

                                        <!-- Available Slots -->
                                        <td class="py-3 px-3 text-center text-gray-800 dark:text-gray-200">
                                            <span class="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-semibold">{{ item.available_shares || 0 }}</span>
                                        </td>
                                    </tr>
                                    <tr v-if="data.length === 0">
                                        <td colspan="4" class="text-center py-6 text-gray-500">No items found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <LazyPagination v-if="!isLoading && paginationConfig?.data?.last_page > 1" class="px-4" :config="paginationConfig" />
                    <LazyResponseModal :response_modal="response_modal" />
                    
                    <AddEdit :isOpenModal="isOpenModal" :item="item" :modalTitle="modalTitle" @close="cancelModal" @add_emit="receivedData" />
                    <RejectModal :isOpenModal="isOpenRejectModal" @close="closeRejectModal" @submit="handleReject" />
                    <ViewModal :isOpenModal="isOpenViewModal" :item="selectedItemToView" @close="closeViewModal" />
                </div>
            </div>
        </div>
    </div>
</template>
