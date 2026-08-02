<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Login | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const route = useRoute()
const { login } = citizenAuth()
const forgotPasswordUrl = computed(() => {
    const normalizedEmail = email.value.trim()

    return normalizedEmail ? `/forgot-password?email=${encodeURIComponent(normalizedEmail)}` : '/forgot-password'
})

onMounted(() => {
    if (route.query.registered === 'success') {
        notice.value = {
            title: 'Signup Successful',
            message: typeof route.query.message === 'string' ? route.query.message : 'Success.',
            tone: 'success'
        }
    }
})

const applyLoginError = (error: any) => {
    const message = error?.response?._data?.message || error?.data?.message || 'Login failed. Please try again.'
    const errors = error?.response?._data?.errors || error?.response?._data?.data
    const firstErrorKey = errors ? Object.keys(errors)[0] : ''
    const firstError = firstErrorKey
        ? Array.isArray(errors[firstErrorKey]) ? errors[firstErrorKey][0] : errors[firstErrorKey]
        : ''

    notice.value = {
        title: 'Login Failed',
        message: firstError || message,
        tone: 'error'
    }
}

const submitLogin = async () => {
    if (!email.value || !password.value) {
        notice.value = {
            title: 'Missing Credentials',
            message: 'Please enter your email address and password.',
            tone: 'warning'
        }
        return
    }

    try {
        isSubmitting.value = true
        notice.value = null

        const response: any = await login({
            email: email.value.trim(),
            password: password.value,
        })

        if (response?.status === true) {
            const targetRoute = getCustomerOnboardingRoute(response) || '/'

            notice.value = {
                title: 'Login Successful',
                message: response?.message || 'User Login successfully.',
                tone: 'success'
            }

            window.setTimeout(() => {
                void navigateTo(targetRoute)
            }, 650)
            return
        }

        notice.value = {
            title: 'Login Failed',
            message: response?.message || 'Login failed. Please try again.',
            tone: 'error'
        }
    } catch (error: any) {
        applyLoginError(error)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="flex min-h-screen flex-col justify-between">
        <div class="grid flex-grow grid-cols-1 lg:grid-cols-12">
            <CitizenAuthHeroPanel
                description="Access high-performing alternative assets with ease. Log in to manage your portfolio, track live syndicates, and secure allocations." />

            <section class="flex items-center justify-center bg-white/5 p-8 sm:p-16 lg:col-span-7">
                <div class="restomod-panel w-full max-w-md space-y-8 rounded-[2rem] p-8">
                    <div class="space-y-2 text-center lg:text-left">
                        <span class="restomod-eyebrow">Platform Sign In</span>
                        <h1 class="font-poppins text-4xl font-black leading-tight text-white">Welcome Back</h1>
                        <p class="text-sm text-white/60">Sign in with your registered credentials below</p>
                    </div>

                    <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                        :tone="notice.tone" />

                    <ClientOnly>
                        <form class="space-y-6" @submit.prevent="submitLogin">
                            <div class="space-y-4">
                                <div class="space-y-1">
                                    <label for="email"
                                        class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Email
                                        Address</label>
                                    <input id="email" v-model="email" type="email" required
                                        placeholder="john.doe@example.com"
                                        class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                                </div>

                                <div class="space-y-1">
                                    <div class="flex items-center justify-between">
                                        <label for="password"
                                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Password</label>
                                        <NuxtLink :to="forgotPasswordUrl"
                                            class="text-[11px] font-semibold text-tccGold transition-colors hover:text-tccLightGold">
                                            Forgot Password?
                                        </NuxtLink>
                                    </div>
                                    <div class="relative">
                                        <input id="password" v-model="password"
                                            :type="showPassword ? 'text' : 'password'" required placeholder="Password"
                                            class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                                        <button type="button"
                                            class="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-tccNavy"
                                            :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                            @click="showPassword = !showPassword">
                                            <i class="pi" :class="showPassword ? 'pi-eye' : 'pi-eye-slash'"
                                                aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit"
                                class="w-full rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy disabled:cursor-not-allowed disabled:opacity-70"
                                :disabled="isSubmitting">
                                <span v-if="isSubmitting">Signing In...</span>
                                <span v-else>Sign In &rarr;</span>
                            </button>

                            <p class="pt-2 text-center text-xs font-light text-gray-500">
                                Don't have an account?
                                <NuxtLink to="/register"
                                    class="ml-1 font-bold uppercase text-tccGold transition-colors hover:text-tccLightGold">Register
                                    Now</NuxtLink>
                            </p>
                        </form>

                        <template #fallback>
                            <div class="space-y-6" aria-busy="true">
                                <div class="space-y-4">
                                    <div class="space-y-2">
                                        <div class="h-3 w-28 animate-pulse rounded-full bg-white/10" />
                                        <div
                                            class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between">
                                            <div class="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                                            <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                                        </div>
                                        <div
                                            class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                                    </div>
                                </div>
                                <div
                                    class="h-[46px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                                <div class="mx-auto h-3 w-48 animate-pulse rounded-full bg-white/10" />
                            </div>
                        </template>
                    </ClientOnly>
                </div>
            </section>
        </div>

        <CitizenAuthStatsBar />
    </div>
</template>
