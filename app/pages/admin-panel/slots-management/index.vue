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
    action: 'ajax'
});

const isLoading = ref(false);
const data = ref([]);
const response_modal = ref({});
const permissions = ref({ add: true, edit: true, delete: true, view: true });

const search = ref('');
const date = ref();
const lastPage = ref(1);

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

const loadData = async (page = 1) => {
    isLoading.value = true;
    try {
        const params = {
            page: page,
            length: 10,
        };

        if (search.value) {
            params.search = search.value;
        }

        if (date.value) {
            const dates = Array.isArray(date.value) ? date.value : [date.value];
            const formattedDates = dates.map(d => d ? new Date(d).toLocaleDateString('en-CA') : '').filter(Boolean);
            if (formattedDates.length > 0) {
                params.date = formattedDates.join(',');
            }
        }

        const getData = await $fetchAdmin(`v1/admin/slots-management`, {
            method: 'GET',
            params: params
        });
        const list = getData?.data?.data ?? getData?.data ?? [];
        data.value = Array.isArray(list) ? list : [];
        paginationConfig.value.data = getData?.data?.meta ?? getData?.meta ?? (getData?.data || []);
        lastPage.value = getData?.data?.last_page ?? getData?.meta?.last_page ?? 1;
    } catch (e) {
        console.log('Get Message', e.message);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadData(1);
});

const groupedData = computed(() => {
    const groups = {};
    if (!data.value || !data.value.length) return groups;
    
    data.value.forEach(req => {
        const carName = req.fractional_item?.assetable?.asset_name || req.fractional_item?.item_name || 'Unknown Item';
        if (!groups[carName]) {
            groups[carName] = [];
        }
        groups[carName].push(req);
    });
    return groups;
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
    loadData(1);
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
            loadData(1);
        }
    } catch (e) {
        response_modal.value = { status: false, message: e.response?._data?.message || 'Error rejecting request.' };
    }
};

// Approve action
const isOpenApproveModal = ref(false);
const itemToApprove = ref(null);

const handleApprove = (id) => {
    itemToApprove.value = id;
    isOpenApproveModal.value = true;
};

const confirmApproveAction = async () => {
    if (!itemToApprove.value) return;
    try {
        const res = await $fetchAdmin(`v1/admin/allocation-requests/${itemToApprove.value}/approve`, {
            method: 'POST'
        });
        if (res.success || res.status) {
            response_modal.value = { status: true, message: 'Request approved successfully.' };
            loadData(1);
        }
    } catch (e) {
        response_modal.value = { status: false, message: e.response?._data?.message || 'Error approving request.' };
    } finally {
        isOpenApproveModal.value = false;
        itemToApprove.value = null;
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
            loadData(1);
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
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Slots Requests</h3>
                </div>
                <Skeleton v-if="isLoading" width="8rem" height="2.5rem" borderRadius="10px"></Skeleton>
                <Button v-else-if="permissions?.add" label="Create Request" @click="addNew" class="text-xs" />
            </div>

            <div class="w-full flex flex-wrap md:flex-nowrap items-center gap-4 mb-8">
                <div class="flex items-center gap-2 w-full md:w-auto">
                    <label for="search" class="text-gray-800 dark:text-gray-200">Search</label>
                    <LazyInputText type="text" v-model="search" @keyup.enter="loadData(1)" class="w-full md:w-auto" placeholder="Search reference, user..." />
                </div>
                <div class="flex items-center gap-2 w-full md:w-auto">
                    <label class="text-gray-800 dark:text-gray-200">Date</label>
                    <DatePicker v-model="date" selectionMode="range" :manualInput="false" placeholder="Select Date Range" class="w-full md:w-auto" />
                </div>
                <Button label="Search" @click="loadData(1)" />
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="p-0">
                    <template v-if="isLoading">
                        <div v-for="i in 3" :key="i" class="mb-8">
                            <Skeleton width="150px" height="1.5rem" class="mb-2" />
                            <Skeleton width="100%" height="8rem" />
                        </div>
                    </template>
                    <template v-else>
                        <div v-if="Object.keys(groupedData).length === 0" class="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200">
                            No pending slots found.
                        </div>
                        
                        <div v-for="(requests, carName) in groupedData" :key="carName" class="mb-8">
                            <h4 class="text-[15px] text-gray-500 dark:text-gray-400 font-medium mb-2 px-1">{{ carName }}</h4>
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-xs whitespace-nowrap border-collapse">
                                    <thead class="bg-[#1e2f4a] text-white">
                                        <tr>
                                            <th class="py-2.5 px-3 font-semibold">User Name</th>
                                            <th class="py-2.5 px-3 font-semibold">Email</th>
                                            <th class="py-2.5 px-3 font-semibold">Number of Allocations</th>
                                            <th class="py-2.5 px-3 font-semibold">Reference ID</th>
                                            <th class="py-2.5 px-3 font-semibold">Allocation Amount</th>
                                            <th class="py-2.5 px-3 font-semibold">Payment Method</th>
                                            <th class="py-2.5 px-3 font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(requestItem, idx) in requests" :key="requestItem.id" 
                                            class="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            :class="idx % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'"
                                        >
                                            <td class="py-2.5 px-3 text-gray-800 dark:text-gray-200 font-medium">
                                                {{ requestItem.user?.user_info?.first_name || requestItem.user?.first_name || requestItem.user?.name || 'N/A' }} {{ requestItem.user?.user_info?.last_name || requestItem.user?.last_name || '' }}
                                            </td>
                                            <td class="py-2.5 px-3 text-gray-800 dark:text-gray-200">
                                                {{ requestItem.user?.email }}
                                            </td>
                                            <td class="py-2.5 px-3 text-gray-800 dark:text-gray-200">
                                                {{ requestItem.shares_count }}
                                            </td>
                                            <td class="py-2.5 px-3 text-gray-800 dark:text-gray-200 uppercase">
                                                {{ requestItem.slug || 'N/A' }}
                                            </td>
                                            <td class="py-2.5 px-3 text-gray-800 dark:text-gray-200">
                                                {{ formatCurrency(requestItem.total_amount) }}
                                            </td>
                                            <td class="py-2.5 px-3 text-gray-800 dark:text-gray-200">
                                                {{ requestItem.payment_method || 'Bank Transfer' }}
                                            </td>
                                            <td class="py-2.5 px-3 text-center">
                                                <div class="flex gap-2 items-center">
                                                    <button @click="viewHandler(requestItem)" class="px-2 py-1 bg-[#1e2f4a] hover:bg-gray-800 text-white text-xs rounded transition-colors shadow-sm" title="View Detail">
                                                        <i class="pi pi-info-circle"></i>
                                                    </button>
                                                    <button @click="handleApprove(requestItem.id)" class="px-3 py-1 bg-[#1e2f4a] hover:bg-gray-800 text-white text-xs rounded transition-colors shadow-sm">
                                                        Accept
                                                    </button>
                                                    <button @click="openRejectModal(requestItem)" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors shadow-sm">
                                                        Decline
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </template>
                </div>
                    
                    <LazyPagination v-if="!isLoading && lastPage > 1" class="px-4" :config="paginationConfig" @loadData="loadData" />
                    <LazyResponseModal :response_modal="response_modal" />
                    
                    <AddEdit :isOpenModal="isOpenModal" :item="item" :modalTitle="modalTitle" @close="cancelModal" @add_emit="receivedData" />
                    <RejectModal :isOpenModal="isOpenRejectModal" :item="selectedItemToReject"
                        @close="closeRejectModal" @submit="handleReject" />
                    <ViewModal :isOpenModal="isOpenViewModal" :item="selectedItemToView" @close="closeViewModal" />
                    
                    <ConfirmModal 
                        :isOpenConModal="isOpenApproveModal"
                        @update:isOpenConModal="isOpenApproveModal = $event"
                        title="Approve Request"
                        message="Are you sure you want to approve this allocation request? This action cannot be undone."
                        @confirm="confirmApproveAction"
                    />
                </div>
            </div>
        </div>
</template>
