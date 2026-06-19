<script setup>
const props = defineProps({
    isOpenModal: { type: Boolean, default: false },
    item: { type: Object, default: () => ({}) },
    categories: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'updated']);

const formData = ref({
    content_title: '',
    cat_id: null,
    status: true
});
const isLoading = ref(false);
const errorMsg = ref('');

watch(() => props.isOpenModal, (newVal) => {
    if (newVal && props.item) {
        formData.value.content_title = props.item.content_title || '';
        formData.value.cat_id = props.item.cat_id || null;
        formData.value.status = props.item.status === 1 || props.item.status === true;
        errorMsg.value = '';
    }
});

const handleSave = async () => {
    isLoading.value = true;
    errorMsg.value = '';
    try {
        const payload = {
            ...formData.value,
            status: formData.value.status ? 1 : 0
        };
        const response = await $fetchAdmin(`v1/admin/media-galleries/${props.item.id}`, {
            method: 'PUT',
            body: payload
        });

        if (response.status === true || response.data) {
            emit('updated', response.data || formData.value);
        } else {
            errorMsg.value = response.message || 'Failed to update media.';
        }
    } catch (e) {
        errorMsg.value = e.response?._data?.message || e.message || 'An error occurred while updating.';
    } finally {
        isLoading.value = false;
    }
};

const close = () => {
    emit('close');
};
</script>

<template>
    <Dialog :visible="isOpenModal" modal header="Edit Media Details" :style="{ width: '400px' }" @update:visible="close"
        :draggable="false">
        <div class="flex flex-col gap-4 py-4">
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm text-gray-700 dark:text-gray-200">Content Title</label>
                <LazyInputText v-model="formData.content_title" placeholder="Enter title" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm text-gray-700 dark:text-gray-200">Category</label>
                <Select v-model="formData.cat_id" :options="categories" optionLabel="category_name" optionValue="id"
                    placeholder="Select Category" class="w-full" filter />
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-semibold text-sm text-gray-700 dark:text-gray-200">Status</label>
                <div class="flex items-center gap-3">
                    <ToggleSwitch v-model="formData.status" />
                    <span class="text-sm font-medium" :class="formData.status ? 'text-green-600' : 'text-gray-500'">{{ formData.status ? 'Active' : 'Inactive' }}</span>
                </div>
            </div>

            <div v-if="errorMsg" class="p-2 bg-red-100 text-red-700 rounded text-sm text-center">
                {{ errorMsg }}
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cancel" icon="pi pi-times" text severity="secondary" @click="close" />
                <Button label="Save Changes" icon="pi pi-check" @click="handleSave" :loading="isLoading" />
            </div>
        </template>
    </Dialog>
</template>
