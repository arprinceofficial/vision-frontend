<script setup>
import AddEdit from './components/AddEdit.vue';
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const vehicleOptionsList = [
    { name: 'All', value: '', key: '' },
    { name: 'Inactive', value: '0', key: 'status' },
    { name: 'Active', value: '1', key: 'status' },
    { name: 'Retail', value: '2', key: 'status' },
    { name: 'Basic', value: '3', key: 'status' },
    { name: 'Regular', value: '4', key: 'status' },
    { name: 'Upcoming', value: '5', key: 'status' },
    { name: 'On Live', value: '6', key: 'status' },
    { name: 'Trashed', value: 'only', key: 'trashed' },
];

const vehicleStatusMap = vehicleOptionsList.reduce((map, item) => {
    if (item.key === 'status') {
        map[item.value] = item.name;
    }
    return map;
}, {});

const route = useRoute();
const status = ref(vehicleOptionsList[0]);
const search = ref('');

const paginationConfig = ref({
    data: {},
    lang: 'en',
    align: 'center',
    action: ''
});
const isLoading = ref(false)
const data = ref([]);
const permissions = ref({});
const loadData = async () => {
    isLoading.value = true;
    permissions.value = {};
    try {
        const getData = await $fetchAdmin(`v1/admin/vehicles/all`, {
            method: 'POST',
            body: {
                paginate: true,
                page: route.query.page ? route.query.page : 1,
                length: 10,
                search: search.value,
                status: status.value.key == 'status' ? status.value.value : '',
                trashed: status.value.key == 'trashed' ? 'only' : '',
            },
        });
        data.value = getData?.data?.data || [];
        permissions.value = getData?.data?.permissions || {};
        paginationConfig.value.data = getData?.data?.meta || {};
    } catch (e) {
        data.value = [];
        permissions.value = {};
        paginationConfig.value.data = {};
        console.log('Get Message', e.message);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadData();
});
watch(() => route.query, (to) => {
    console.log('to', to);
    loadData();
})

const isActiveStatus = (value) => value === true || (Number(value) > 0 && Number(value) <= 6);
const getVehicleStatusName = (value) => {
    if (value === true) return vehicleStatusMap['1'];
    if (value === false) return vehicleStatusMap['0'];
    return vehicleStatusMap[String(value)] || '';
};

const isOpenModal = ref(false);
const item = ref({});
const modalTitle = ref('');
const editHandler = (i) => {
    modalTitle.value = 'Edit';
    isOpenModal.value = true;
    item.value = i
    console.log('editHandler', item);
}

const addNew = () => {
    item.value = {};
    modalTitle.value = 'Create';
    isOpenModal.value = true;
}

const receivedData = (d) => {
    console.log('receivedData', d);
    isOpenModal.value = false;
    modalTitle.value == 'Create' ?
        data.value.push(d) :
        data.value = data.value.map((item) => item.id == d.id ? d : item);
}
const cancelModal = () => {
    item.value = {};
    isOpenModal.value = false;
    console.log('isOpenModal', isOpenModal.value);
}

// Delete
const isOpenConModal = ref(false);
const response_modal = ref({});
const deleteId = ref(null);

const openDeleteModal = (id) => {
    deleteId.value = id;
    isOpenConModal.value = true;
};
const deleteHandler = async () => {
    response_modal.value = {};
    try {
        const getData = await $fetchAdmin(`v1/admin/vehicles/${deleteId.value}`, {
            method: 'DELETE',
        });
        if (getData.status == true) {
            response_modal.value = getData;
            data.value = data.value.filter(item => item.id !== deleteId.value);
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
        const getData = await $fetchAdmin(`v1/admin/vehicles/restore/${id}`, {
            method: 'POST',
        });
        if (getData.status == true) {
            response_modal.value = getData;
            data.value = data.value.filter(item => item.id !== id);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 409) {
            response_modal.value = e.response._data;
        }
    } finally {
        isOpenConModal.value = false;
    }
}

const resetPagination = () => {
    const query = { ...route.query };
    delete query.page;
    navigateTo({ query }, { replace: true });
};

const onChangeHandler = () => {
    loadData();
    resetPagination();
}
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
                            <Select v-model="status" :options="vehicleOptionsList" optionLabel="name" @change="onChangeHandler"
                                placeholder="Select" class="w-full md:w-auto" />
                        </div>
                    </div>
                </div>
                <Skeleton v-if="isLoading" width="8rem" height="2.5rem" borderRadius="10px"></Skeleton>
                <Button v-else-if="permissions?.add" label="Create Vehicle" @click="addNew" class="text-xs" />
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="border-b border-gray-200">
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 py-2 px-4">Vehicles</h4>
                    </div>
                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto">
                                <thead class="sticky z-10 top-0">
                                    <tr>
                                        <th width="5%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Sl.</span>
                                            </div>
                                        </th>
                                        <th width="75%">
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Info</span>
                                            </div>
                                        </th>
                                        <th width="10%">
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
                                <tbody v-if="isLoading" class="">
                                    <tr v-for="(index) in 10" :key="index">
                                        <td class="text-center"><Skeleton width="2rem" class="mb-2 mx-auto" /></td>
                                        <td>
                                            <div class="flex items-center gap-4">
                                                <div class="flex flex-col gap-2">
                                                    <Skeleton width="12rem" class="mb-2" />
                                                    <Skeleton width="8rem" class="mb-2" />
                                                </div>
                                            </div>
                                        </td>
                                        <td><div class="flex justify-center"><Skeleton size="1.5rem" shape="circle" /></div></td>
                                        <td>
                                            <div class="flex justify-center items-center gap-2">
                                                <Skeleton size="1.5rem" />
                                                <Skeleton size="1.5rem" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else class="">
                                    <tr v-for="(item, index) in data" :key="index">
                                        <td class="text-gray-800 dark:text-gray-200 text-center">
                                            <span class="text-sm">{{ index + 1 }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <div class="flex items-center gap-4">
                                                <img v-if="item.asset_image || item.card_image || item.hero_image" :src="item.asset_image || item.card_image || item.hero_image" alt="Image" class="w-16 h-12 object-cover rounded shadow" />
                                                <div v-else class="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded shadow flex items-center justify-center min-w-[4rem]">
                                                    <i class="fa fa-image text-gray-400"></i>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
                                                    <p class="text-xs text-gray-500 mt-1">
                                                        Make: {{ item.make }}, Model: {{ item.model }}, Year: {{ item.year }}
                                                    </p>
                                                    <p class="text-xs text-gray-400 mt-0.5 truncate max-w-lg" :title="item.description" v-if="item.description">
                                                        {{ item.description }}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="flex justify-center items-center">
                                                <span class="px-2.5 py-1 text-xs rounded-full font-semibold border"
                                                    :class="{
                                                        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700': Number(item.status) === 0 || !item.status,
                                                        'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-850': Number(item.status) === 1,
                                                        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-850': Number(item.status) === 2,
                                                        'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-850': Number(item.status) === 3,
                                                        'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-850': Number(item.status) === 4,
                                                        'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-850': Number(item.status) === 5,
                                                        'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-850': Number(item.status) === 6
                                                    }">
                                                    {{ getVehicleStatusName(item.status) }}
                                                </span>
                                            </div>
                                        </td>
                                        <td v-if="permissions.edit || permissions.delete">
                                            <div v-if="status.key == 'trashed' && permissions.delete" class="flex justify-center items-center gap-2">
                                                <i @click="restoreHandler(item.id)"
                                                    class="fa-solid fa-trash-restore text-green-500 hover:text-green-800 cursor-pointer transition duration-150 ease-in-out" />
                                            </div>
                                            <div v-else class="flex justify-center items-center gap-2">
                                                <i @click="editHandler(item)" v-if="permissions.edit"
                                                    class="fa-solid fa-pen-to-square text-gray-600 dark:text-gray-400 hover:text-green-500 cursor-pointer transition duration-150 ease-in-out" />
                                                <i @click="openDeleteModal(item.id)" v-if="permissions.delete"
                                                    class="fa-solid fa-trash text-gray-600 dark:text-gray-400 hover:text-red-500 cursor-pointer transition duration-150 ease-in-out" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <AddEdit :isOpenModal="isOpenModal" :item="item" :modalTitle="modalTitle" :data="data"
                        @close="cancelModal" @add_emit="receivedData" />
                    <LazyPagination v-if="!isLoading && paginationConfig.data?.last_page" class="px-4"
                        :config="paginationConfig" />
                    <LazyConfirmModal :isOpenConModal="isOpenConModal" @confirm="deleteHandler"
                        @update:isOpenConModal="isOpenConModal = $event" />
                    <LazyResponseModal :response_modal="response_modal" />
                </div>
            </div>
        </div>
    </div>
</template>
