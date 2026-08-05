<script setup>
const MappingAddEdit = defineAsyncComponent(() => import('../components/MappingAddEdit.vue'));
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const route = useRoute();
const templateId = route.params.id;

const isLoading = ref(false)
const templateData = ref(null);
const data = ref([]);
const knownFields = ref([]);
const permissions = ref({ add: true, edit: true, delete: true, view: true });

const loadData = async () => {
    isLoading.value = true;
    try {
        const res = await $fetchAdmin(`v1/admin/document-templates/${templateId}`, {
            method: 'GET',
        });
        
        templateData.value = res.data;
        data.value = res.data.field_mappings || res.data.fieldMappings || [];
        knownFields.value = res.known_fields || [];
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
    loadData(); 
}

const cancelModal = () => {
    item.value = {};
    isOpenModal.value = false;
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
        const res = await $fetchAdmin(`v1/admin/document-field-mappings/${deleteId.value}`, {
            method: 'DELETE',
        });
        if (res.success == true || res.status == true) {
            response_modal.value = { status: true, message: 'Mapping deleted successfully.' };
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

</script>
<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            
            <div class="mb-4 flex items-center gap-2">
                <NuxtLink to="/admin-panel/document-templates" class="text-blue-500 hover:underline flex items-center gap-1">
                    <i class="pi pi-arrow-left text-sm"></i> Back to Templates
                </NuxtLink>
            </div>

            <div class="w-full flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-4">
                <div class="w-full md:w-auto flex flex-wrap gap-4">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">
                        Field Mappings <span v-if="templateData" class="text-gray-500 font-normal text-lg"> - {{ templateData.name }}</span>
                    </h3>
                </div>
                <Skeleton v-if="isLoading" width="8rem" height="2.5rem" borderRadius="10px"></Skeleton>
                <Button v-else-if="permissions?.add" label="Add Field Mapping" @click="addNew" class="text-xs" />
            </div>

            <div class="pb-2 flex flex-col justify-between w-full">
                <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
                    <div class="p-4">
                        <div class="custom_table overflow-auto border-b border-gray-200">
                            <table class="table table-auto">
                                <thead class="sticky z-10 top-0 bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th class="py-2 px-3 text-left w-12">Page</th>
                                        <th class="py-2 px-3 text-left">Field Key</th>
                                        <th class="py-2 px-3 text-left">Label</th>
                                        <th class="py-2 px-3 text-left">Type</th>
                                        <th class="py-2 px-3 text-center">Pos (X, Y)</th>
                                        <th class="py-2 px-3 text-center">Size (W x H)</th>
                                        <th class="py-2 px-3 text-center w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody v-if="isLoading">
                                    <tr v-for="index in 5" :key="index">
                                        <td v-for="col in 7" :key="col" class="py-2 px-3">
                                            <Skeleton width="100%" height="1.5rem"></Skeleton>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(item, index) in data" :key="index" class="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200 text-center font-semibold">{{ item.page_no }}</td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">
                                            <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm font-mono">{{ item.field_key }}</span>
                                        </td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200">{{ item.label || '-' }}</td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200 uppercase text-xs tracking-wider">{{ item.data_type }}</td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200 text-center">
                                            {{ item.pos_x }} , {{ item.pos_y }}
                                        </td>
                                        <td class="py-2 px-3 text-gray-800 dark:text-gray-200 text-center">
                                            {{ item.width }} x {{ item.height || 'Auto' }}
                                        </td>
                                        <td class="py-2 px-3 text-center">
                                            <div class="flex justify-center items-center gap-3">
                                                <i @click="editHandler(item)" v-if="permissions.edit" title="Edit"
                                                    class="fa-solid fa-pen-to-square text-gray-800 dark:text-gray-200 hover:text-green-500 cursor-pointer transition duration-150 ease-in-out"></i>
                                                <i @click="openDeleteModal(item.id)" v-if="permissions.delete" title="Delete"
                                                    class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="data.length === 0">
                                        <td colspan="7" class="text-center py-6 text-gray-500">No field mappings configured for this template.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <MappingAddEdit :isOpenModal="isOpenModal" :item="item" :templateId="templateId" :knownFields="knownFields" :modalTitle="modalTitle" @close="cancelModal"
                        @add_emit="receivedData" />
                    <LazyConfirmModal :isOpenConModal="isOpenConModal" @confirm="deleteHandler"
                        @update:isOpenConModal="isOpenConModal = $event" />
                    <LazyResponseModal :response_modal="response_modal" />
                </div>
            </div>
        </div>
    </div>
</template>
