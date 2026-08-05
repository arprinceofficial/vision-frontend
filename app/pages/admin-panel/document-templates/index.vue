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
const isLoading = ref(false)
const data = ref([]);
const fractionalItems = ref([]);
const permissions = ref({ add: true, edit: true, delete: true, view: true });

const loadData = async () => {
    isLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/document-templates`, {
            method: 'GET',
        });
        const defaults = getData.defaults || [];
        const itemSpecific = [];
        for (const key in getData.item_specific) {
             itemSpecific.push(...getData.item_specific[key]);
        }
        data.value = [...defaults, ...itemSpecific];
        fractionalItems.value = getData.items || [];
    } catch (e) {
        console.log('Get Message', e.message);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    loadData();
});

const isOpenModal = ref(false);
const item = ref({});
const modalTitle = ref('');

const editHandler = (i) => {
    modalTitle.value = 'Edit';
    isOpenModal.value = true;
    item.value = i;
}

const addNew = () => {
    item.value = {};
    modalTitle.value = 'Create';
    isOpenModal.value = true;
}

const receivedData = (d) => {
    isOpenModal.value = false;
    loadData(); // Reload all to maintain structure
}

const cancelModal = () => {
    item.value = {};
    isOpenModal.value = false;
}

const isPreviewing = ref(false);
const previewTemplate = async (id) => {
    if (isPreviewing.value) return;
    try {
        isPreviewing.value = true;
        const res = await $fetchAdmin(`v1/admin/document-templates/${id}/preview`, {
            method: 'GET',
            responseType: 'blob'
        });
        const url = URL.createObjectURL(res);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
        console.error('Preview error', e);
        response_modal.value = { status: false, message: 'Failed to generate preview PDF.' };
    } finally {
        isPreviewing.value = false;
    }
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
        const getData = await $fetchAdmin(`v1/admin/document-templates/${deleteId.value}`, {
            method: 'DELETE',
        });
        if (getData.success == true) {
            response_modal.value = { status: true, message: getData.message };
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

const resetPagination = () => {
    const query = { ...route.query };
    delete query.page;
    navigateTo({ query }, { replace: true });
};

const onChangeHandler = () => {
    // loadData(); // Filtering not natively implemented in backend index yet
}

const formatType = (type) => {
    return type === 'subscription_agreement' ? 'Subscription Agreement' : 'Terms & Conditions';
}

</script>
<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
                <div class="w-full md:w-auto flex flex-wrap gap-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Document Templates</h3>
                </div>
                <Skeleton v-if="isLoading" width="8rem" height="2.5rem" borderRadius="10px"></Skeleton>
                <Button v-else-if="permissions?.add" label="Create Template" @click="addNew" class="text-xs" />
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto">
                                <thead class="sticky z-10 top-0">
                                    <tr>
                                        <th width="20%">
                                            <div class="flex flex-row items-center justify-start gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Name</span>
                                            </div>
                                        </th>
                                        <th width="20%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Document Type</span>
                                            </div>
                                        </th>
                                        <th width="15%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Variant</span>
                                            </div>
                                        </th>
                                        <th width="20%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Fractional Item</span>
                                            </div>
                                        </th>
                                        <th width="10%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Status</span>
                                            </div>
                                        </th>
                                        <th width="15%">
                                            <div class="flex flex-row items-center justify-center gap-2 text-gray-800 dark:text-gray-200">
                                                <span>Action</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading" class="">
                                    <tr v-for="(index) in 5" :key="index">
                                        <td v-for="col in 6" :key="col" class="text-center">
                                            <Skeleton width="5rem" class="mb-2 mx-auto"></Skeleton>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else class="">
                                    <tr v-for="(item, index) in data" :key="index">
                                        <td class="text-gray-800 dark:text-gray-200">{{ item.name }}</td>
                                        <td class="text-gray-800 dark:text-gray-200 text-center">{{ formatType(item.document_type) }}</td>
                                        <td class="text-gray-800 dark:text-gray-200 text-center">{{ item.variant }}</td>
                                        <td class="text-gray-800 dark:text-gray-200 text-center">
                                            <span v-if="item.fractionalItem">{{ item.fractionalItem.item_name }}</span>
                                            <span v-else class="text-gray-400 italic">Default</span>
                                        </td>
                                        <td>
                                            <div class="flex justify-center items-center">
                                                <span v-if="item.is_active" class="text-green-600"><i class="fa fa-power-off" aria-hidden="true"></i></span>
                                                <span v-else class="text-red-500"><i class="fa fa-power-off" aria-hidden="true"></i></span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="flex justify-center items-center gap-3">
                                                <a @click.prevent="previewTemplate(item.id)" title="Preview" v-if="permissions.view">
                                                    <i v-if="isPreviewing" class="pi pi-spinner pi-spin text-blue-500 mr-1"></i>
                                                    <i v-else class="fa-solid fa-eye text-blue-500 hover:text-blue-800 cursor-pointer transition duration-150 ease-in-out"></i>
                                                </a>
                                                <NuxtLink :to="`/admin-panel/document-templates/${item.id}/mappings`" v-if="permissions.edit" title="Manage Mappings">
                                                    <i class="fa-solid fa-list-check text-purple-500 hover:text-purple-800 cursor-pointer transition duration-150 ease-in-out"></i>
                                                </NuxtLink>
                                                <i @click="editHandler(item)" v-if="permissions.edit" title="Edit"
                                                    class="fa-solid fa-pen-to-square text-gray-800 dark:text-gray-200 hover:text-green-500 cursor-pointer transition duration-150 ease-in-out"></i>
                                                <i @click="openDeleteModal(item.id)" v-if="permissions.delete" title="Delete"
                                                    class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="data.length === 0">
                                        <td colspan="6" class="text-center py-4 text-gray-500">No templates found.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <AddEdit :isOpenModal="isOpenModal" :item="item" :fractionalItems="fractionalItems" :modalTitle="modalTitle" @close="cancelModal"
                        @add_emit="receivedData" />
                    <LazyConfirmModal :isOpenConModal="isOpenConModal" @confirm="deleteHandler"
                        @update:isOpenConModal="isOpenConModal = $event" />
                    <LazyResponseModal :response_modal="response_modal" />
                </div>
            </div>
        </div>
    </div>
</template>
