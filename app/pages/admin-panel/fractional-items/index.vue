<script setup>
const AddEdit = defineAsyncComponent(() => import('./components/AddEdit.vue'));
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const { $optionsList } = useNuxtApp();

const optionsList = $optionsList();
const route = useRoute();
const status = ref(optionsList[0]);
const search = ref('');

const paginationConfig = ref({
    data: [],
    lang: 'en',
    align: 'center',
    action: ''
});

const isLoading = ref(false);
const data = ref([]);
const permissions = ref({});
const response_modal = ref({});

const loadData = async () => {
    isLoading.value = true;
    permissions.value = {};
    try {
        const getData = await $fetchAdmin('v1/admin/fractional-items', {
            method: 'GET',
            query: {
                page: route.query.page ? route.query.page : 1,
                length: 10,
                search: search.value,
                status: status.value.key == 'status' ? status.value.value : '',
                trashed: status.value.key == 'trashed' ? 'only' : '',
            },
        });

        data.value = Array.isArray(getData?.data?.data) ? getData.data.data : [];
        paginationConfig.value.data = getData?.data?.meta || {};
        permissions.value = getData?.data?.permissions || {};
    } catch (e) {
        response_modal.value = {
            status: false,
            message: e?.response?._data?.message || 'Failed to load fractional items.',
        };
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

const isOpenModal = ref(false);
const item = ref({});
const modalTitle = ref('');

const editHandler = (row) => {
    modalTitle.value = 'Edit';
    isOpenModal.value = true;
    item.value = row;
};

const addNew = () => {
    item.value = {};
    modalTitle.value = 'Create';
    isOpenModal.value = true;
};

const receivedData = (row) => {
    isOpenModal.value = false;
    if (modalTitle.value == 'Create') {
        data.value.push(row);
        return;
    }
    data.value = data.value.map((existing) => existing.id == row.id ? row : existing);
};

const cancelModal = () => {
    item.value = {};
    isOpenModal.value = false;
};

const isOpenConModal = ref(false);
const deleteId = ref(null);

const openDeleteModal = (id) => {
    deleteId.value = id;
    isOpenConModal.value = true;
};

const deleteHandler = async () => {
    response_modal.value = {};
    try {
        const getData = await $fetchAdmin(`v1/admin/fractional-items/${deleteId.value}`, {
            method: 'DELETE',
        });
        if (getData.status == true) {
            response_modal.value = getData;
            data.value = data.value.filter(row => row.id !== deleteId.value);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 409) {
            response_modal.value = e.response._data;
        }
    } finally {
        isOpenConModal.value = false;
    }
};

const restoreHandler = async (id) => {
    response_modal.value = {};
    try {
        const getData = await $fetchAdmin(`v1/admin/fractional-items/restore/${id}`, {
            method: 'POST',
        });
        if (getData.status == true) {
            response_modal.value = getData;
            data.value = data.value.filter(row => row.id !== id);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 409) {
            response_modal.value = e.response._data;
        }
    } finally {
        isOpenConModal.value = false;
    }
};

const resetPagination = () => {
    const query = { ...route.query };
    delete query.page;
    navigateTo({ query }, { replace: true });
};

const onChangeHandler = () => {
    loadData();
    resetPagination();
};

const formatMoney = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return value;
    return numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '0';
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return value;
    return numberValue.toLocaleString('en-US');
};
</script>

<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
                <div class="w-full md:w-auto flex flex-wrap gap-4">
                    <div class="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto">
                        <div class="flex items-center gap-2 w-full md:w-auto">
                            <label for="search" class="text-gray-800 dark:text-gray-200">Search</label>
                            <LazyInputText type="text" v-model="search" @input="loadData" @keyup.enter="loadData"
                                class="w-full md:w-auto" />
                        </div>
                        <div class="flex items-center gap-3 w-full md:w-auto">
                            <label for="status" class="text-gray-800 dark:text-gray-200">Status</label>
                            <Select v-model="status" :options="optionsList" optionLabel="name" @change="onChangeHandler"
                                placeholder="Select" class="w-full md:w-auto" />
                        </div>
                    </div>
                </div>
                <Skeleton v-if="isLoading" width="7rem" height="2.5rem" borderRadius="10px" />
                <Button v-else-if="permissions?.add" label="Create" @click="addNew" class="text-xs" />
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="border-b border-gray-200">
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 py-2 px-4">Fractional Items</h4>
                    </div>

                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto">
                                <thead class="sticky z-10 top-0">
                                    <tr>
                                        <th width="16%">
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Item</span>
                                            </div>
                                        </th>
                                        <th width="24%">
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Headline</span>
                                            </div>
                                        </th>
                                        <th width="14%">
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Shares</span>
                                            </div>
                                        </th>
                                        <th width="12%">
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Share Price</span>
                                            </div>
                                        </th>
                                        <th width="12%">
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Live Status</span>
                                            </div>
                                        </th>
                                        <th width="12%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Flags</span>
                                            </div>
                                        </th>
                                        <th width="5%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Status</span>
                                            </div>
                                        </th>
                                        <th width="10%" v-if="(permissions.edit || permissions.delete) || isLoading">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Action</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody v-if="isLoading">
                                    <tr v-for="index in 10" :key="index">
                                        <td><Skeleton width="8rem" class="mb-2" /></td>
                                        <td><Skeleton width="12rem" class="mb-2" /></td>
                                        <td><Skeleton width="7rem" class="mb-2" /></td>
                                        <td><Skeleton width="6rem" class="mb-2" /></td>
                                        <td><Skeleton width="6rem" class="mb-2" /></td>
                                        <td><div class="flex justify-center"><Skeleton width="5rem" class="mb-2" /></div></td>
                                        <td><div class="flex justify-center"><Skeleton size="1.5rem" /></div></td>
                                        <td>
                                            <div class="flex justify-center items-center gap-2">
                                                <Skeleton size="1.5rem" />
                                                <Skeleton size="1.5rem" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                                <tbody v-else>
                                    <tr v-for="(row, index) in data" :key="index">
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm font-semibold">{{ row.item_name || row.icon_item?.name || row.icon_item_id }}</span>
                                            <p class="text-xs text-gray-500 mt-1">{{ row.icon_name || row.icon?.name || 'N/A' }}</p>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm font-semibold">{{ row.headline }}</span>
                                            <p class="text-xs text-gray-500 mt-1">{{ row.subhead_line }}</p>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ formatNumber(row.shares_available ?? row.available_shares) }}</span>
                                            <span class="text-xs text-gray-500"> / {{ formatNumber(row.shares_total ?? row.total_shares) }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ formatMoney(row.per_share_value ?? row.share_price) }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ row.live_status || 'N/A' }}</span>
                                        </td>
                                        <td class="text-center">
                                            <div class="flex justify-center items-center gap-2 flex-wrap">
                                                <span v-if="row.is_fractional" class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Fractional</span>
                                                <span v-if="row.is_exclusive" class="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">Exclusive</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="flex justify-center items-center">
                                                <span v-if="row.status == 1" class="text-green-600"><i class="fa fa-power-off" aria-hidden="true" /></span>
                                                <span v-else class="text-red-500"><i class="fa fa-power-off" aria-hidden="true" /></span>
                                            </div>
                                        </td>
                                        <td v-if="permissions.edit || permissions.delete">
                                            <div v-if="status.key == 'trashed' && permissions.delete" class="flex justify-center items-center gap-2">
                                                <i @click="restoreHandler(row.id)"
                                                    class="fa-solid fa-trash-restore text-green-500 hover:text-green-800 cursor-pointer transition duration-150 ease-in-out" />
                                            </div>
                                            <div v-else class="flex justify-center items-center gap-2">
                                                <i @click="editHandler(row)" v-if="permissions.edit"
                                                    class="fa-solid fa-pen-to-square text-gray-800 dark:text-gray-200 hover:text-green-500 cursor-pointer transition duration-150 ease-in-out" />
                                                <i @click="openDeleteModal(row.id)" v-if="permissions.delete"
                                                    class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="data.length === 0">
                                        <td :colspan="permissions.edit || permissions.delete ? 8 : 7" class="text-center text-sm text-gray-500 py-6">
                                            No fractional items found.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <AddEdit :isOpenModal="isOpenModal" :item="item" :modalTitle="modalTitle" :data="data"
                        @close="cancelModal" @add_emit="receivedData" />
                    <LazyPagination v-if="!isLoading && paginationConfig.data?.last_page" class="px-4" :config="paginationConfig" />
                    <LazyConfirmModal :isOpenConModal="isOpenConModal" @confirm="deleteHandler"
                        @update:isOpenConModal="isOpenConModal = $event" />
                    <LazyResponseModal :response_modal="response_modal" />
                </div>
            </div>
        </div>
    </div>
</template>
