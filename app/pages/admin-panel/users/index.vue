<script setup>
const AddEdit = defineAsyncComponent(() => import('./components/AddEdit.vue'));
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const { $optionsListAcIn } = useNuxtApp();

const optionsList = $optionsListAcIn();
const route = useRoute();
const status = ref(optionsList[0]);
const search = ref('');

const paginationConfig = ref({
    data: [],
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
        const getData = await $fetchAdmin(`v1/admin/users/all`, {
            method: 'POST',
            body: {
                paginate: true,
                page: route.query.page ? route.query.page : 1,
                length: 10,
                search: search.value,
                status: status.value.key == 'status' ? status.value.value : '',
                trashed: status.value.key == 'trashed' ? 'only' : '',
                role: 4 // Fetch Registered Users
            },
        });
        data.value = getData.data.data;
        permissions.value = getData.data.permissions;
        paginationConfig.value.data = getData.data.meta;
    } catch (e) {
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
        const getData = await $fetchAdmin(`v1/admin/users/${deleteId.value}`, {
            method: 'DELETE',
        });
        if (getData.status == true) {
            response_modal.value = getData;
            data.value = data.value.filter(item => item.id !== deleteId.value);
        }
    } catch (e) {
        // console.log('here 1',e.response);
        if (e.response?.status === 404 || e.response?.status === 409) {
            // console.log('here 2',e.response._data);
            response_modal.value = e.response._data;
        }
    } finally {
        isOpenConModal.value = false;
    }
};

const restoreHandler = async (id) => {
    response_modal.value = {};
    try {
        const getData = await $fetchAdmin(`v1/admin/users/restore/${id}`, {
            method: 'POST',
        });
        if (getData.status == true) {
            response_modal.value = getData;
            data.value = data.value.filter(item => item.id !== id);
        }
    } catch (e) {
        // console.log('here 1',e.response);
        if (e.response?.status === 404 || e.response?.status === 409) {
            // console.log('here 2',e.response._data);
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
                            <Select v-model="status" :options="optionsList" optionLabel="name" @change="onChangeHandler"
                                placeholder="Select" class="w-full md:w-auto" />
                        </div>
                    </div>
                </div>
                <Skeleton v-if="isLoading" width="7rem" height="2.5rem" borderRadius="10px"></Skeleton>
                <div v-else-if="permissions?.add" class="flex gap-2">
                    <Button label="Add New User" @click="$router.push('/admin-panel/users/add')" class="text-xs" />
                    <Button label="Invited User" @click="$router.push('/admin-panel/users/invited')" class="text-xs" severity="secondary" outlined />
                    <Button label="Export Users" class="text-xs" severity="secondary" outlined />
                    <Button label="Import" class="text-xs" severity="secondary" outlined />
                </div>
            </div>
            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="border-b border-gray-200">
                        <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 py-2 px-4">Registered Users
                        </h4>
                    </div>
                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto">
                                <thead class="sticky z-10 top-0">
                                    <tr>
                                        <th>
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Name</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Email</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Date of Birth</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>House No.</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Street</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Town/City</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Postcode</span>
                                            </div>
                                        </th>
                                        <th v-if="(permissions.edit || permissions.delete) || isLoading">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Action</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading">
                                    <tr v-for="(index) in 10" :key="index">
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <Skeleton width="100%"></Skeleton>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <Skeleton width="100%"></Skeleton>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <Skeleton width="100%"></Skeleton>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <Skeleton width="100%"></Skeleton>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <Skeleton width="100%"></Skeleton>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <Skeleton width="100%"></Skeleton>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <Skeleton width="100%"></Skeleton>
                                        </td>
                                        <td>
                                            <div class="flex justify-center items-center gap-2">
                                                <Skeleton size="1.5rem"></Skeleton>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(item, index) in data" :key="index">
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ item.user_info?.first_name }} {{ item.user_info?.last_name }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ item.email }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ item.user_info?.dob ? new Date(item.user_info.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'NA' }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ item.user_info?.house_no || 'NA' }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ item.user_info?.street || 'NA' }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ item.user_info?.pre_city || 'NA' }}</span>
                                        </td>
                                        <td class="text-gray-800 dark:text-gray-200 text-start">
                                            <span class="text-sm">{{ item.user_info?.pre_zip || 'NA' }}</span>
                                        </td>
                                        <td v-if="permissions.edit || permissions.delete">
                                            <div v-if="status.key == 'trashed' && permissions.delete"
                                                class="flex justify-center items-center gap-2">
                                                <i @click="restoreHandler(item.id)" v-if="permissions.delete"
                                                    class="fa-solid fa-trash-restore text-green-500 hover:text-green-800 cursor-pointer transition duration-150 ease-in-out"></i>
                                            </div>
                                            <div v-else class="flex justify-center items-center gap-2">
                                                <i @click="editHandler(item)" v-if="permissions.edit"
                                                    class="fa-solid fa-pen-to-square text-gray-800 dark:text-gray-200 hover:text-green-500 cursor-pointer transition duration-150 ease-in-out"></i>
                                                <!-- <i @click="openDeleteModal(item.id)"
                                                    class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i> -->
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <AddEdit :isOpenModal="isOpenModal" :item="item" :modalTitle="modalTitle" :data="data"
                        @close="cancelModal" @add_emit="receivedData" />
                    <LazyPagination v-if="!isLoading" class="px-4" :config="paginationConfig" />
                    <LazyConfirmModal :isOpenConModal="isOpenConModal" @confirm="deleteHandler"
                        @update:isOpenConModal="isOpenConModal = $event" />
                    <LazyResponseModal :response_modal="response_modal" />
                </div>
            </div>
        </div>
    </div>
</template>