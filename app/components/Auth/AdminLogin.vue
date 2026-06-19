<script setup>
import {
	LockClosedIcon,
	UserIcon
} from "@heroicons/vue/24/outline"

const password_open = ref(false)
const password_view_status = (status) => {
	password_open.value = status
}

const form = reactive({
	login_id: '',
	password: ''
});

const unauthorizedError = ref('');
const { login } = adminAuth();
const isLoading = ref(false);

const submit = async () => {
	isLoading.value = true;
	unauthorizedError.value = '';
	try {
		const response = await login(form);
		console.log(response.data.token);
		if (response) {
			window.location.href = '/admin-panel';
			return;
		}
	} catch (error) {
		if (error) {
			const err = error;
			// console.error('Login error: 1', err?.response?._data?.message);
			unauthorizedError.value = err?.response?._data?.message;
		} else {
			unauthorizedError.value = 'An unexpected error occurred. Please try again later.';
		}
	} finally {
		isLoading.value = false;
	}
}
const admin_user = adminUser();
</script>

<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
            
            <!-- Header Section -->
            <div class="flex flex-col items-center mb-8">
                <NuxtLink to="/" class="mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
                    <ApplicationLogo :width="'160px'" :height="'55px'" />
                </NuxtLink>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Admin Portal
                </h2>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Please sign in to your account
                </p>
            </div>

            <!-- Form Section -->
            <form @submit.prevent="submit" class="space-y-6">
                <div class="space-y-4">
                    <!-- User ID -->
                    <div>
                        <label for="login_id" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">User ID</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </div>
                            <LazyInputText id="login_id" type="text" v-model="form.login_id"
                                class="block w-full !pl-10 !pr-3 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                required placeholder="Enter your User ID" />
                        </div>
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LockClosedIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </div>
                            <LazyInputText id="password" :type="password_open ? 'text' : 'password'" v-model="form.password"
                                class="block w-full !pl-10 !pr-10 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                                required placeholder="Enter your password" />
                            <button type="button" @click="password_view_status(!password_open)"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none">
                                <i :class="['fas text-[15px]', password_open ? 'fa-eye' : 'fa-eye-slash']"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div>
                    <ButtonPrimary :disabled="isLoading"
                        class="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        :class="{ 'opacity-70 cursor-not-allowed': isLoading }">
                        <span v-if="!isLoading" class="flex items-center gap-2">
                            Sign In
                        </span>
                        <div v-else class="flex items-center justify-center">
                            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </ButtonPrimary>
                </div>

                <!-- Error Message -->
                <div class="min-h-[1.5rem] mt-2">
                    <LazyInputError :message="unauthorizedError" />
                </div>
            </form>
        </div>
    </div>
</template>
