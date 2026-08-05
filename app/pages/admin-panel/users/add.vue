<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    house_no: '',
    street: '',
    town: '',
    postcode: '',
    date_of_birth: '',
    phone_number: '',
    investment_type: null,
    quiz_status: null,
    referral_code: ''
});

const investmentTypes = ref([
    { label: 'Retail', value: 'retail' },
    { label: 'Sophisticated', value: 'sophisticated' },
    { label: 'High Net Worth', value: 'high_net_worth' }
]);

const quizStatuses = ref([
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Failed', value: 'failed' }
]);

const isLoading = ref(false);
const response_modal = ref({});

const submitForm = async () => {
    isLoading.value = true;
    try {
        const payload = { ...form.value };
        payload.investment_type = payload.investment_type?.value || null;
        payload.quiz_status = payload.quiz_status?.value || null;

        const response = await $fetchAdmin('v1/admin/onboarding/invitations', {
            method: 'POST',
            body: payload
        });
        
        response_modal.value = {
            status: true,
            message: 'User invited successfully.'
        };
        
        setTimeout(() => {
            router.push('/admin-panel/users/invited');
        }, 1500);

    } catch (error) {
        response_modal.value = error.response?._data || { status: false, message: 'An error occurred' };
    } finally {
        isLoading.value = false;
    }
};

const goBack = () => {
    router.push('/admin-panel/users');
};
</script>
<template>
    <div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
        <div class="h-full w-full overflow-auto">
            <div class="w-full flex justify-between items-center mb-4">
                <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">Add User</h1>
                <div class="flex gap-2">
                    <Button label="Back to Users" @click="goBack" class="text-xs" severity="secondary" outlined />
                </div>
            </div>

            <div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 p-6">
                <form @submit.prevent="submitForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">First Name*</label>
                            <LazyInputText v-model="form.first_name" placeholder="Enter first name" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name*</label>
                            <LazyInputText v-model="form.last_name" placeholder="Enter last name" required />
                        </div>
                        <div class="flex flex-col gap-2 md:col-span-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email*</label>
                            <LazyInputText type="email" v-model="form.email" placeholder="Enter email" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">House No*</label>
                            <LazyInputText v-model="form.house_no" placeholder="Enter house no" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Street*</label>
                            <LazyInputText v-model="form.street" placeholder="Enter street" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Town*</label>
                            <LazyInputText v-model="form.town" placeholder="Enter town" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Postcode*</label>
                            <LazyInputText v-model="form.postcode" placeholder="Enter postcode" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth (dd/mm/yyyy)*</label>
                            <LazyInputText type="date" v-model="form.date_of_birth" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                            <LazyInputText v-model="form.phone_number" placeholder="Enter phone number" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Investment Type*</label>
                            <Select v-model="form.investment_type" :options="investmentTypes" optionLabel="label" placeholder="Select Investment Type" required />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Status*</label>
                            <Select v-model="form.quiz_status" :options="quizStatuses" optionLabel="label" placeholder="Select Quiz Status" required />
                        </div>
                        <div class="flex flex-col gap-2 md:col-span-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Referral Code (Optional)</label>
                            <LazyInputText v-model="form.referral_code" placeholder="Enter referral code" />
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-md text-sm border border-teal-200 dark:border-teal-800">
                        <i class="pi pi-info-circle mr-2"></i> <strong>Note:</strong> An invitation email will be sent to the user with a secure link to set up their password and complete account activation.
                    </div>

                    <div class="mt-6 flex justify-end">
                        <Button type="submit" label="Invite User" :loading="isLoading" class="px-8" />
                    </div>
                </form>
            </div>
        </div>
        <LazyResponseModal :response_modal="response_modal" />
    </div>
</template>
