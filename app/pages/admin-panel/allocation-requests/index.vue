<script setup>
const AddEdit = defineAsyncComponent(() => import('./components/AddEdit.vue'));
const RejectModal = defineAsyncComponent(() => import('./components/RejectModal.vue'));
const ViewModal = defineAsyncComponent(() => import('./components/ViewModal.vue'));
const UploadModal = defineAsyncComponent(() => import('./components/UploadModal.vue'));

definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const route = useRoute();
const router = useRouter();

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

const activeTab = ref('all');
const tabs = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Slots Requests' },
    { id: 'completed', label: 'Allotted Slots' },
    { id: 'rejected', label: 'Rejected Slots' },
    { id: 'missing_docs', label: 'Legacy Documents' }
];

const setTab = (tabId) => {
    activeTab.value = tabId;
    loadData(1);
};

const getStatusForTab = () => {
    switch(activeTab.value) {
        case 'pending': return '1'; // Pending Verification (or 0 for Pending Payment, but usually 1 is the main pending state)
        case 'completed': return '2';
        case 'rejected': return '3';
        default: return '';
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
        let endpoint = `v1/admin/allocation-requests`;
        let params = {
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

        if (activeTab.value === 'missing_docs') {
            endpoint = `v1/admin/allocation-requests-without-documents`;
        } else if (activeTab.value !== 'all') {
            params.status = getStatusForTab();
        }

        const getData = await $fetchAdmin(endpoint, {
            method: 'GET',
            params
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

// Upload Modal
const isOpenUploadModal = ref(false);
const selectedItemToUpload = ref(null);

const openUploadModal = (item) => {
    selectedItemToUpload.value = item;
    isOpenUploadModal.value = true;
};

const closeUploadModal = () => {
    selectedItemToUpload.value = null;
    isOpenUploadModal.value = false;
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
const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this request?')) return;
    try {
        const res = await $fetchAdmin(`v1/admin/allocation-requests/${id}/approve`, {
            method: 'POST'
        });
        if (res.success || res.status) {
            response_modal.value = { status: true, message: 'Request approved successfully.' };
            loadData(1);
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
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Allocation Requests</h3>
                </div>
                <Skeleton v-if="isLoading" width="8rem" height="2.5rem" borderRadius="10px"></Skeleton>
                <Button v-else-if="permissions?.add" label="Create Request" @click="addNew" class="text-xs" />
            </div>

            <div class="w-full flex flex-wrap md:flex-nowrap items-center gap-4 mb-4">
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
                <!-- Tabs Navigation -->
                <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto whitespace-nowrap">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.id"
                        @click="setTab(tab.id)"
                        :class="[
                            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                            activeTab === tab.id 
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <div class="border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="p-0">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto w-full text-left text-sm">
                                <thead class="sticky z-10 top-0 bg-[#1e2f4a] text-white">
                                    <tr>
                                        <th class="py-3 px-3 font-semibold">Reference</th>
                                        <th class="py-3 px-3 font-semibold">User</th>
                                        <th class="py-3 px-3 font-semibold">Car</th>
                                        <th class="py-3 px-3 font-semibold text-center">Slots</th>
                                        <th class="py-3 px-3 font-semibold">Amount</th>
                                        <th class="py-3 px-3 font-semibold text-center">Payment</th>
                                        <th class="py-3 px-3 font-semibold text-center">State</th>
                                        <th class="py-3 px-3 font-semibold text-center">Docs</th>
                                        <th class="py-3 px-3 font-semibold text-center">Created</th>
                                        <th class="py-3 px-3 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading">
                                    <tr v-for="index in 5" :key="index">
                                        <td v-for="col in 10" :key="col" class="py-3 px-3 text-center">
                                            <Skeleton width="100%" height="1.5rem"></Skeleton>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-if="data.length === 0">
                                        <td colspan="10" class="text-center py-6 text-gray-500">No requests found.</td>
                                    </tr>
                                    <tr v-for="(requestItem, index) in data" :key="index" class="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800" v-else>
                                        <!-- Reference -->
                                        <td class="py-3 px-3 text-gray-800 dark:text-gray-200">
                                            <span class="text-gray-500 font-medium">{{ requestItem.slug || 'N/A' }}</span>
                                        </td>
                                        
                                        <!-- User -->
                                        <td class="py-3 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="font-medium">{{ requestItem.user?.user_info?.first_name || requestItem.user?.first_name }} {{ requestItem.user?.user_info?.last_name || requestItem.user?.last_name }}</div>
                                            <div class="text-[11px] text-gray-500">{{ requestItem.user?.email }}</div>
                                        </td>
                                        
                                        <!-- Car -->
                                        <td class="py-3 px-3 text-gray-800 dark:text-gray-200">
                                            <div class="font-medium">{{ requestItem.fractional_item?.assetable?.asset_name || requestItem.fractional_item?.item_name || 'N/A' }}</div>
                                        </td>
                                        
                                        <!-- Slots -->
                                        <td class="py-3 px-3 text-center text-gray-800 dark:text-gray-200">
                                            <span class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-semibold">{{ requestItem.shares_count }}</span>
                                        </td>
                                        
                                        <!-- Amount -->
                                        <td class="py-3 px-3 text-gray-800 dark:text-gray-200 font-medium">
                                            {{ formatCurrency(requestItem.total_amount) }}
                                        </td>
                                        
                                        <!-- Payment Method -->
                                        <td class="py-3 px-3 text-center text-gray-600 dark:text-gray-300">
                                            <span class="border px-2 py-1 rounded-md text-[10px] whitespace-nowrap bg-white dark:bg-gray-800">{{ requestItem.payment_method || 'Bank Transfer' }}</span>
                                        </td>
                                        
                                        <!-- State/Status -->
                                        <td class="py-3 px-3 text-center">
                                            <div class="flex flex-col gap-1 items-center">
                                                <span class="px-2 py-1 rounded text-[10px] border font-bold whitespace-nowrap" :class="getStatusSeverity(requestItem.status)">
                                                    {{ getStatusLabel(requestItem.status) }}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <!-- Docs -->
                                        <td class="py-3 px-3 text-center">
                                            <span v-if="requestItem.documents_signed" class="bg-teal-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm whitespace-nowrap">
                                                <i class="fa-solid fa-file-signature mr-1"></i> Signed
                                            </span>
                                            <span v-else class="bg-gray-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm whitespace-nowrap">
                                                <i class="fa-solid fa-clock mr-1"></i> Pending
                                            </span>
                                        </td>
                                        
                                        <!-- Created -->
                                        <td class="py-3 px-3 text-center text-gray-600 dark:text-gray-300">
                                            <div class="flex flex-col text-[11px] font-medium leading-tight items-center">
                                                <span>{{ formatDate(requestItem.created_at).date }}</span>
                                                <span>{{ formatDate(requestItem.created_at).year }}</span>
                                                <span class="text-gray-400">{{ formatDate(requestItem.created_at).time }}</span>
                                            </div>
                                        </td>
                                        
                                        <!-- Actions -->
                                        <td class="py-3 px-3 text-center">
                                            <div class="flex justify-center items-center gap-1 flex-col sm:flex-row">
                                                <button v-if="permissions?.view" @click="viewHandler(requestItem)" class="text-xs bg-[#1e2f4a] text-white px-2 py-1.5 rounded hover:bg-gray-800 shadow-sm" title="View">
                                                    <i class="fa-solid fa-info-circle"></i>
                                                </button>
                                                <button v-if="permissions?.edit" @click="openUploadModal(requestItem)" class="text-xs bg-yellow-500 text-white px-2 py-1.5 rounded hover:bg-yellow-600 shadow-sm inline-block" title="Upload Documents">
                                                    <i class="fa-solid fa-upload"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <LazyPagination v-if="!isLoading && lastPage > 1" class="px-4" :config="paginationConfig" @loadData="loadData" />
                    <LazyResponseModal :response_modal="response_modal" />
                    
                    <AddEdit :isOpenModal="isOpenModal" :item="item" :modalTitle="modalTitle" @close="cancelModal" @add_emit="receivedData" />
                    <RejectModal :isOpenModal="isOpenRejectModal" @close="closeRejectModal" @submit="handleReject" />
                    <ViewModal :isOpenModal="isOpenViewModal" :item="selectedItemToView" @close="closeViewModal" />
                    <UploadModal :isOpenModal="isOpenUploadModal" :item="selectedItemToUpload" @close="closeUploadModal" @submit="loadData(1)" />
                </div>
            </div>
        </div>
    </div>
</template>
