<script setup>
const props = defineProps({
    isOpenModal: { type: Boolean, required: true },
});
const emit = defineEmits(['close', 'submit']);

const visible = ref(props.isOpenModal);
const validations_errors = ref({});

watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
    if (newVal) {
        reason.value = '';
        validations_errors.value = {};
    }
});

const reason = ref('');

const submit = () => {
    validations_errors.value = {};
    if (!reason.value || reason.value.trim() === '') {
        validations_errors.value.reason = 'Reason is required.';
        return;
    }
    emit('submit', reason.value);
};

const close = () => {
    emit('close');
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '30rem' }" @update:visible="close">
        <template #header>
            <div class="flex justify-between items-center w-full">
                <span class="p-dialog-title text-xl font-bold">Reject Request</span>
                <i class="pi pi-times cursor-pointer hover:text-red-500" @click="close"></i>
            </div>
        </template>
        <div class="pt-4">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Reason for Rejection <span class="text-red-500">*</span></label>
                <Textarea v-model="reason" rows="4" class="w-full !border !border-gray-300 dark:!border-gray-600 rounded-md p-2" :class="{ '!border-red-500': validations_errors.reason }" placeholder="Enter reason..."></Textarea>
                <small v-if="validations_errors.reason" class="p-error">{{ validations_errors.reason }}</small>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2 w-full mt-2">
                <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger" @click="close" />
                <Button label="Reject" icon="pi pi-check" class="p-button-danger" @click="submit" />
            </div>
        </template>
    </Dialog>
</template>
