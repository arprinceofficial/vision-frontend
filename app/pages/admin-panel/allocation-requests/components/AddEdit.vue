<script setup>
const props = defineProps({
    isOpenModal: { type: Boolean, required: true },
    modalTitle: { type: String, default: 'Create' },
    item: { type: Object, default: () => ({}) }
});
const emit = defineEmits(['close', 'add_emit']);

const visible = ref(props.isOpenModal);
const isSubmitting = ref(false);
const validations_errors = ref({});

const users = ref([]);
const fractionalItems = ref([]);

const fetchData = async () => {
    try {
        const itemRes = await $fetchAdmin('v1/admin/fractional-items', {
            method: 'GET',
            query: { length: 100 }
        });
        if (itemRes) {
            fractionalItems.value = itemRes?.data?.data || itemRes?.data || (Array.isArray(itemRes) ? itemRes : []);
        }

        const userRes = await $fetchAdmin('v1/admin/users/all', {
            method: 'POST',
            body: { paginate: false }
        });
        if (userRes) {
            users.value = userRes?.data?.data || userRes?.data || (Array.isArray(userRes) ? userRes : []);
        }
    } catch (e) {
        console.error('Error fetching dropdown data', e);
    }
}

onMounted(() => {
    fetchData();
});

const formData = ref({
    id: null,
    fractional_item_id: null,
    user_id: null,
    shares_count: null,
    payment_method: 'bank_transfer',
    status: 0,
    state: 1,
    custom_note: ''
});

watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

watch(() => props.item, (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
        formData.value = {
            id: newVal.id,
            fractional_item_id: newVal.fractional_item_id,
            user_id: newVal.user_id,
            shares_count: newVal.shares_count,
            payment_method: newVal.payment_method || 'bank_transfer',
            status: newVal.status ?? 0,
            state: newVal.state ?? 1,
            custom_note: newVal.custom_note || ''
        };
    } else {
        formData.value = {
            id: null,
            fractional_item_id: null,
            user_id: null,
            shares_count: null,
            payment_method: 'bank_transfer',
            status: 0,
            state: 1,
            custom_note: ''
        };
    }
    validations_errors.value = {};
}, { immediate: true });

const submit = async () => {
    validations_errors.value = {};
    let hasError = false;

    if (!formData.value.fractional_item_id) { validations_errors.value.fractional_item_id = 'Fractional Item ID is required.'; hasError = true; }
    if (!formData.value.user_id) { validations_errors.value.user_id = 'User ID is required.'; hasError = true; }
    if (!formData.value.shares_count) { validations_errors.value.shares_count = 'Shares count is required.'; hasError = true; }

    if (hasError) return;

    isSubmitting.value = true;
    validations_errors.value = {};

    let endpoint = `v1/admin/allocation-requests`;
    let method = 'POST';
    if (formData.value.id && props.modalTitle === 'Edit') {
        endpoint = `v1/admin/allocation-requests/${formData.value.id}`;
        method = 'PUT'; // Assumes backend supports PUT or you can use POST with _method=PUT
    }

    try {
        const res = await $fetchAdmin(endpoint, {
            method: method,
            body: formData.value
        });

        if (res.success || res.status) {
            emit('add_emit', res.data || res);
        }
    } catch (e) {
        console.error(e);
        if (e.response?._data?.errors || e.response?._data?.data) {
            const errs = e.response._data.errors || e.response._data.data;
            for (const key in errs) {
                if (errs.hasOwnProperty(key)) {
                    validations_errors.value[key] = errs[key][0] || errs[key];
                }
            }
        } else {
            alert(e.response?._data?.message || 'Error saving request');
        }
    } finally {
        isSubmitting.value = false;
    }
};

const close = () => {
    emit('close');
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '45rem' }" @update:visible="close">
        <template #header>
            <div class="flex justify-between items-center w-full">
                <span class="p-dialog-title text-xl font-bold">{{ modalTitle }} Allocation Request</span>
                <i class="pi pi-times cursor-pointer hover:text-red-500" @click="close"></i>
            </div>
        </template>
        <div class="pt-4 pb-2 max-h-[70vh] overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Fractional Item <span
                            class="text-red-500">*</span></label>
                    <select v-model="formData.fractional_item_id"
                        class="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        :class="{ '!border-red-500': validations_errors?.fractional_item_id }">
                        <option :value="null" disabled>Select Fractional Item</option>
                        <option v-for="fi in fractionalItems" :key="fi.id" :value="fi.id">
                            {{ fi.id }} - {{ fi.item_name || fi.short_title || fi.headline || 'Item ' + fi.id }}
                        </option>
                    </select>
                    <small v-if="validations_errors?.fractional_item_id" class="p-error">{{
                        validations_errors?.fractional_item_id }}</small>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">User <span
                            class="text-red-500">*</span></label>
                    <select v-model="formData.user_id"
                        class="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        :class="{ '!border-red-500': validations_errors?.user_id }">
                        <option :value="null" disabled>Select User</option>
                        <option v-for="user in users" :key="user.id" :value="user.id">
                            {{ user.id }} - {{ user.user_info?.first_name || user.username || 'User' }} {{
                                user.user_info?.last_name || '' }} ({{ user.email }})
                        </option>
                    </select>
                    <small v-if="validations_errors?.user_id" class="p-error">{{ validations_errors?.user_id }}</small>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Shares Count <span
                            class="text-red-500">*</span></label>
                    <InputText type="number" v-model="formData.shares_count"
                        class="w-full !border !border-gray-300 dark:!border-gray-600"
                        :class="{ '!border-red-500': validations_errors?.shares_count }"
                        placeholder="Number of shares" />
                    <small v-if="validations_errors?.shares_count" class="p-error">{{ validations_errors?.shares_count
                    }}</small>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Payment
                        Method</label>
                    <select v-model="formData.payment_method"
                        class="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="stripe">Stripe</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
                    <select v-model="formData.status"
                        class="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option :value="0">Pending Payment</option>
                        <option :value="1">Pending Verification</option>
                        <option :value="2">Completed</option>
                        <option :value="3">Cancelled/Rejected</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">State (User
                        Journey)</label>
                    <select v-model="formData.state"
                        class="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option :value="1">What Happens Next</option>
                        <option :value="2">Documents</option>
                        <option :value="3">Syndicate Vote</option>
                        <option :value="4">Cart</option>
                        <option :value="5">Final Agreement</option>
                        <option :value="6">Payment</option>
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Custom Note</label>
                    <textarea v-model="formData.custom_note" rows="3"
                        class="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Any internal notes..."></textarea>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2 w-full mt-4">
                <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-danger" @click="close" />
                <Button label="Save" icon="pi pi-check" class="p-button-success" :loading="isSubmitting"
                    @click="submit" />
            </div>
        </template>
    </Dialog>
</template>
