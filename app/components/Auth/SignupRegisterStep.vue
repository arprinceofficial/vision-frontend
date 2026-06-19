<script setup>
const showPassword = ref(false);
const showConfirmPassword = ref(false);

defineProps({
    formData: {
        type: Object,
        required: true,
    },
    validationsErrors: {
        type: Object,
        required: true,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['submit']);
</script>

<template>
    <div class="w-full max-w-[420px] flex flex-col items-center">
        <h2 class="text-center mb-8 sm:mb-10 lg:mb-14 font-bebas-neue text-[clamp(1.85rem,5.8vw,3rem)] leading-[0.88] tracking-[-0.01em]">
            <span style="color: black;">ENTER YOUR EMAIL ADDRESS<br />TO JOIN </span>
            <span
                style="background: linear-gradient(165deg, #977b13 0%, #d4af37 100%); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                THE WATCH LIST
            </span>
        </h2>

        <form @submit.prevent="$emit('submit')" autocomplete="off" novalidate class="w-full flex flex-col gap-3 sm:gap-4">
            <input name="first_name" type="text" v-model="formData.first_name" placeholder="First Name"
                autocomplete="given-name" autocorrect="off" autocapitalize="off" spellcheck="false"
                class="w-full h-11 sm:h-12 px-5 sm:px-6 rounded-full font-roboto text-base sm:text-lg lg:text-[20px] outline-none placeholder-gray-500"
                @focus="validationsErrors.first_name = ''"
                style="background-color: white; color: black; box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);" />
            <p v-if="validationsErrors.first_name" class="w-full text-red-500 text-sm px-2 -mt-1">
                {{ validationsErrors.first_name }}
            </p>

            <input name="last_name" type="text" v-model="formData.last_name" placeholder="Last Name"
                autocomplete="family-name" autocorrect="off" autocapitalize="off" spellcheck="false"
                class="w-full h-11 sm:h-12 px-5 sm:px-6 rounded-full font-roboto text-base sm:text-lg lg:text-[20px] outline-none placeholder-gray-500"
                @focus="validationsErrors.last_name = ''"
                style="background-color: white; color: black; box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);" />
            <p v-if="validationsErrors.last_name" class="w-full text-red-500 text-sm px-2 -mt-1">
                {{ validationsErrors.last_name }}
            </p>

            <input name="email" type="email" v-model="formData.email" placeholder="Email Address"
                autocomplete="email" autocorrect="off" autocapitalize="off" spellcheck="false"
                class="w-full h-11 sm:h-12 px-5 sm:px-6 rounded-full font-roboto text-base sm:text-lg lg:text-[20px] outline-none placeholder-gray-500"
                @focus="validationsErrors.email = ''"
                style="background-color: white; color: black; box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);" />
            <p v-if="validationsErrors.email" class="w-full text-red-500 text-sm px-2 -mt-1">
                {{ validationsErrors.email }}
            </p>

            <div class="relative w-full">
                <input name="password" :type="showPassword ? 'text' : 'password'" v-model="formData.password" placeholder="Password"
                    autocomplete="new-password" autocorrect="off" autocapitalize="off" spellcheck="false"
                    class="w-full h-11 sm:h-12 pl-5 sm:pl-6 pr-12 rounded-full font-roboto text-base sm:text-lg lg:text-[20px] outline-none placeholder-gray-500"
                    @focus="validationsErrors.password = ''"
                    style="background-color: white; color: black; box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);" />
                <button type="button" @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-[#444955] hover:text-black transition-colors"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'">
                    <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C3.73 7.61 7.52 4.5 12 4.5C16.48 4.5 20.27 7.61 22 12C20.27 16.39 16.48 19.5 12 19.5C7.52 19.5 3.73 16.39 2 12Z"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M10.58 10.58C10.21 10.95 10 11.45 10 12C10 13.1 10.9 14 12 14C12.55 14 13.05 13.79 13.42 13.42"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.88 5.09C10.58 4.86 11.29 4.75 12 4.75C16.48 4.75 20.27 7.61 22 12C21.46 13.37 20.7 14.6 19.78 15.65"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.16 6.17C4.43 7.39 3.03 9.2 2 12C3.73 16.39 7.52 19.25 12 19.25C13.82 19.25 15.52 18.78 17.01 17.96"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <p v-if="validationsErrors.password" class="w-full text-red-500 text-sm px-2 -mt-1">
                {{ validationsErrors.password }}
            </p>

            <div class="relative w-full">
                <input name="password_confirmation" :type="showConfirmPassword ? 'text' : 'password'" v-model="formData.password_confirmation"
                    placeholder="Confirm Password" autocomplete="new-password" autocorrect="off" autocapitalize="off"
                    spellcheck="false"
                    class="w-full h-11 sm:h-12 pl-5 sm:pl-6 pr-12 rounded-full font-roboto text-base sm:text-lg lg:text-[20px] outline-none placeholder-gray-500"
                    @focus="validationsErrors.password_confirmation = ''"
                    style="background-color: white; color: black; box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);" />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-[#444955] hover:text-black transition-colors"
                    :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'">
                    <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12C3.73 7.61 7.52 4.5 12 4.5C16.48 4.5 20.27 7.61 22 12C20.27 16.39 16.48 19.5 12 19.5C7.52 19.5 3.73 16.39 2 12Z"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M10.58 10.58C10.21 10.95 10 11.45 10 12C10 13.1 10.9 14 12 14C12.55 14 13.05 13.79 13.42 13.42"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.88 5.09C10.58 4.86 11.29 4.75 12 4.75C16.48 4.75 20.27 7.61 22 12C21.46 13.37 20.7 14.6 19.78 15.65"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.16 6.17C4.43 7.39 3.03 9.2 2 12C3.73 16.39 7.52 19.25 12 19.25C13.82 19.25 15.52 18.78 17.01 17.96"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <p v-if="validationsErrors.password_confirmation" class="w-full text-red-500 text-sm px-2 -mt-1">
                {{ validationsErrors.password_confirmation }}
            </p>

            <div class="flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-8">
                <button type="submit" :disabled="isLoading"
                    class="w-full h-11 sm:h-12 rounded-full font-roboto text-lg sm:text-xl lg:text-[24px] flex justify-center items-center cursor-pointer"
                    style="color: black; background: linear-gradient(165deg, #BC9A1D 0%, #D4AF37 100%); box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.25);">
                    {{ isLoading ? 'Please wait...' : 'Sign Up' }}
                </button>
                <p class="text-sm text-gray-600 text-center">
                    Already have an account?
                    <NuxtLink to="/signin" class="text-blue-500 hover:underline">Sign In</NuxtLink>
                </p>
            </div>
        </form>
    </div>
</template>
