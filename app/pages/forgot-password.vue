<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

useHead({
    title: 'Forgot Password | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type RecoveryStep = 1 | 2 | 3 | 4

type CitizenApiResponse<T = Record<string, unknown>> = {
    status?: boolean
    message?: string
    data?: T | { data?: T | null } | null
}

type ForgotPasswordData = {
    uid?: string | number | null
    id?: string | number | null
    email?: string | null
    cooldown_seconds?: string | number | null
}

type OtpVerifyData = {
    reset_token?: string | null
    uid?: string | number | null
}

const FORGOT_PASSWORD_ENDPOINT = 'v1/customer/forgot-password'
const OTP_VERIFY_ENDPOINT = 'v1/customer/otp-verify'
const SET_PASSWORD_ENDPOINT = 'v1/customer/set-password'
const OTP_DIGIT_COUNT = 6

const route = useRoute()
const currentStep = ref<RecoveryStep>(1)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmittingEmail = ref(false)
const isVerifyingOtp = ref(false)
const isSettingPassword = ref(false)
const isResendingOtp = ref(false)
const resendCooldownSeconds = ref(0)
const recoveryUid = ref('')
const verifiedOtp = ref('')
const resetToken = ref('')
let resendCooldownTimer: ReturnType<typeof setInterval> | null = null

const recovery = reactive({
    email: typeof route.query.email === 'string' ? route.query.email : '',
    otp: Array.from({ length: OTP_DIGIT_COUNT }, () => ''),
    password: '',
    confirmPassword: ''
})

const steps = [
    'Email',
    'Verify OTP',
    'Set Password',
    'Complete'
]

const normalizedEmail = computed(() => recovery.email.trim())
const enteredOtp = computed(() => recovery.otp.join(''))
const isAnyRequestLoading = computed(() => (
    isSubmittingEmail.value ||
    isVerifyingOtp.value ||
    isSettingPassword.value ||
    isResendingOtp.value
))

const passwordRequirements = computed(() => [
    { label: '8 characters', passed: recovery.password.length >= 8 },
    { label: 'Uppercase letter', passed: /[A-Z]/.test(recovery.password) },
    { label: 'Number', passed: /\d/.test(recovery.password) },
    { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(recovery.password) },
    {
        label: 'Passwords match',
        passed: Boolean(recovery.password && recovery.password === recovery.confirmPassword)
    }
])

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const getFirstValue = (...values: Array<number | string | null | undefined>) => {
    const value = values.find((item) => item !== null && item !== undefined && String(item).trim() !== '')
    return value === undefined ? '' : String(value).trim()
}

const getResponseData = <T extends Record<string, unknown>>(response: CitizenApiResponse<T> | null | undefined) => {
    const responseData = response?.data

    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return (responseData.data || {}) as T
    }

    return (responseData || {}) as T
}

const getUidFromResetToken = (token: string) => {
    try {
        const normalizedToken = token.replace(/-/g, '+').replace(/_/g, '/')
        const paddedToken = normalizedToken.padEnd(Math.ceil(normalizedToken.length / 4) * 4, '=')
        const payload = JSON.parse(atob(paddedToken))

        return getFirstValue(payload?.uid)
    } catch {
        return ''
    }
}

const getErrorMessage = (error: any, fallback: string) => {
    const data = error?.response?._data || error?.data || {}
    const errors = data?.errors || data?.data
    const firstErrorKey = errors && typeof errors === 'object' ? Object.keys(errors)[0] : ''
    const firstError = firstErrorKey
        ? Array.isArray(errors[firstErrorKey]) ? errors[firstErrorKey][0] : errors[firstErrorKey]
        : ''

    return firstError || data?.message || fallback
}

const setNotice = (title: string, message: string, tone: NoticeTone) => {
    notice.value = { title, message, tone }
}

const clearResendCooldown = () => {
    if (!resendCooldownTimer) return

    clearInterval(resendCooldownTimer)
    resendCooldownTimer = null
}

const startResendCooldown = (seconds?: number | string | null) => {
    clearResendCooldown()

    const cooldown = Number(seconds || 0)
    resendCooldownSeconds.value = Number.isFinite(cooldown) && cooldown > 0 ? cooldown : 0

    if (resendCooldownSeconds.value <= 0) return

    resendCooldownTimer = setInterval(() => {
        resendCooldownSeconds.value -= 1

        if (resendCooldownSeconds.value <= 0) {
            resendCooldownSeconds.value = 0
            clearResendCooldown()
        }
    }, 1000)
}

const resetOtp = () => {
    recovery.otp = Array.from({ length: OTP_DIGIT_COUNT }, () => '')
    verifiedOtp.value = ''
    resetToken.value = ''
}

const goToStep = (step: RecoveryStep) => {
    currentStep.value = step
    notice.value = null
}

const applyForgotPasswordResponse = (response: CitizenApiResponse<ForgotPasswordData>) => {
    const responseData = getResponseData<ForgotPasswordData>(response)

    recovery.email = getFirstValue(responseData.email, normalizedEmail.value)
    recoveryUid.value = getFirstValue(responseData.uid, responseData.id)
    resetOtp()
    startResendCooldown(responseData.cooldown_seconds)
    currentStep.value = 2

    setNotice(
        'OTP Sent',
        response?.message || `We sent a ${OTP_DIGIT_COUNT}-digit OTP to ${recovery.email}.`,
        'success'
    )
}

const submitEmail = async () => {
    if (!isValidEmail(normalizedEmail.value)) {
        setNotice('Email Required', 'Please enter the email address linked to your account.', 'warning')
        return
    }

    try {
        isSubmittingEmail.value = true
        notice.value = null

        const response = await $fetchCitizen<CitizenApiResponse<ForgotPasswordData>>(FORGOT_PASSWORD_ENDPOINT, {
            method: 'POST',
            body: {
                email: normalizedEmail.value
            }
        })

        if (response?.status === true) {
            applyForgotPasswordResponse(response)
            return
        }

        setNotice(
            'Request Failed',
            response?.message || 'Could not send the OTP. Please try again.',
            'error'
        )
    } catch (error: any) {
        setNotice('Request Failed', getErrorMessage(error, 'Could not send the OTP. Please try again.'), 'error')
    } finally {
        isSubmittingEmail.value = false
    }
}

const resendOtp = async () => {
    if (resendCooldownSeconds.value > 0 || isResendingOtp.value) return

    if (!isValidEmail(normalizedEmail.value)) {
        setNotice('Email Required', 'Please enter the email address linked to your account.', 'warning')
        currentStep.value = 1
        return
    }

    try {
        isResendingOtp.value = true
        notice.value = null

        const response = await $fetchCitizen<CitizenApiResponse<ForgotPasswordData>>(FORGOT_PASSWORD_ENDPOINT, {
            method: 'POST',
            body: {
                email: normalizedEmail.value
            }
        })

        if (response?.status === true) {
            applyForgotPasswordResponse(response)
            setNotice('OTP Sent Again', response?.message || 'A new verification code has been sent.', 'success')
            return
        }

        setNotice(
            'Resend Failed',
            response?.message || 'Could not resend OTP. Please try again.',
            'error'
        )
    } catch (error: any) {
        setNotice('Resend Failed', getErrorMessage(error, 'Could not resend OTP. Please try again.'), 'error')
    } finally {
        isResendingOtp.value = false
    }
}

const focusNextOtp = (event: Event, index: number) => {
    const input = event.target as HTMLInputElement
    recovery.otp[index] = input.value.replace(/\D/g, '').slice(0, 1)
    input.value = recovery.otp[index]

    if (recovery.otp[index] && input.nextElementSibling instanceof HTMLInputElement) {
        input.nextElementSibling.focus()
    }
}

const focusPreviousOtp = (event: Event, index: number) => {
    const input = event.target as HTMLInputElement

    if (
        event instanceof KeyboardEvent
        && event.key === 'Backspace'
        && !recovery.otp[index]
        && input.previousElementSibling instanceof HTMLInputElement
    ) {
        input.previousElementSibling.focus()
    }
}

const pasteOtp = (event: Event) => {
    if (!(event instanceof ClipboardEvent)) return

    const pastedOtp = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, OTP_DIGIT_COUNT).split('')

    if (!pastedOtp?.length) return

    event.preventDefault()
    recovery.otp = recovery.otp.map((_, index) => pastedOtp[index] || '')
}

const getRecoveryIdentityPayload = () => ({
    ...(recoveryUid.value ? { uid: recoveryUid.value } : {}),
    email: normalizedEmail.value
})

const verifyOtp = async () => {
    if (enteredOtp.value.length !== OTP_DIGIT_COUNT || recovery.otp.some((digit) => !digit)) {
        setNotice('OTP Required', `Please enter the complete ${OTP_DIGIT_COUNT}-digit OTP from your email.`, 'warning')
        return
    }

    try {
        isVerifyingOtp.value = true
        notice.value = null

        const response = await $fetchCitizen<CitizenApiResponse<OtpVerifyData>>(OTP_VERIFY_ENDPOINT, {
            method: 'POST',
            body: {
                ...getRecoveryIdentityPayload(),
                req_otp: enteredOtp.value
            }
        })

        if (response?.status === true) {
            const responseData = getResponseData<OtpVerifyData>(response)

            verifiedOtp.value = enteredOtp.value
            resetToken.value = getFirstValue(responseData.reset_token)
            recoveryUid.value = getFirstValue(responseData.uid, recoveryUid.value, getUidFromResetToken(resetToken.value))

            if (!resetToken.value) {
                setNotice(
                    'Verification Failed',
                    'OTP was verified, but the reset token was missing. Please request a new OTP.',
                    'error'
                )
                return
            }

            currentStep.value = 3
            setNotice('OTP Verified', response?.message || 'Set a new password for your account.', 'success')
            return
        }

        setNotice(
            'Verification Failed',
            response?.message || 'OTP verification failed. Please try again.',
            'error'
        )
    } catch (error: any) {
        setNotice('Verification Failed', getErrorMessage(error, 'OTP verification failed. Please try again.'), 'error')
    } finally {
        isVerifyingOtp.value = false
    }
}

const submitPassword = async () => {
    const unmetRequirement = passwordRequirements.value.find((requirement) => !requirement.passed)

    if (unmetRequirement) {
        setNotice('Password Check', `Please complete this requirement: ${unmetRequirement.label}.`, 'warning')
        return
    }

    if (!resetToken.value) {
        setNotice('Reset Token Missing', 'Please verify your OTP again before setting a new password.', 'warning')
        currentStep.value = 2
        return
    }

    if (!recoveryUid.value) {
        setNotice('UID Missing', 'Please request a new OTP and verify it again before setting a new password.', 'warning')
        currentStep.value = 2
        return
    }

    try {
        isSettingPassword.value = true
        notice.value = null

        const response = await $fetchCitizen<CitizenApiResponse>(SET_PASSWORD_ENDPOINT, {
            method: 'POST',
            body: {
                uid: recoveryUid.value,
                reset_token: resetToken.value,
                password: recovery.password,
                password_confirmation: recovery.confirmPassword
            }
        })

        if (response?.status === true) {
            currentStep.value = 4
            notice.value = null
            return
        }

        setNotice(
            'Reset Failed',
            response?.message || 'Could not update your password. Please try again.',
            'error'
        )
    } catch (error: any) {
        setNotice('Reset Failed', getErrorMessage(error, 'Could not update your password. Please try again.'), 'error')
    } finally {
        isSettingPassword.value = false
    }
}

const restartFlow = () => {
    currentStep.value = 1
    recovery.email = ''
    resetOtp()
    recovery.password = ''
    recovery.confirmPassword = ''
    recoveryUid.value = ''
    resetToken.value = ''
    showPassword.value = false
    showConfirmPassword.value = false
    notice.value = null
    resendCooldownSeconds.value = 0
    clearResendCooldown()
}

onBeforeUnmount(() => {
    clearResendCooldown()
})
</script>

<template>
    <div class="flex min-h-screen flex-col justify-between">
        <div class="grid flex-grow grid-cols-1 lg:grid-cols-12">
            <CitizenAuthHeroPanel
                description="Recover secure access to your member account and return to your portfolio, syndicates, and onboarding checks." />

            <section class="flex items-center justify-center bg-white/5 p-8 sm:p-16 lg:col-span-7">
                <div class="restomod-panel w-full max-w-md space-y-8 rounded-[2rem] p-8">
                    <div class="flex items-center justify-between border-b border-tccBorder pb-4">
                        <div class="flex gap-2" aria-label="Password recovery progress">
                            <span v-for="(step, index) in steps" :key="step"
                                class="h-2.5 w-2.5 rounded-full transition-colors duration-300"
                                :class="index + 1 <= currentStep ? 'bg-tccGold' : 'bg-white/15'" />
                        </div>
                        <span class="font-poppins text-[10px] font-bold uppercase tracking-wider text-white/50">
                            {{ currentStep === 4 ? 'Complete' : `Step ${currentStep} of ${steps.length}` }}
                        </span>
                    </div>

                    <CitizenSharedActionNotice v-if="notice" :title="notice.title" :message="notice.message"
                        :tone="notice.tone" />

                    <ClientOnly>
                        <form v-if="currentStep === 1" class="space-y-6" @submit.prevent="submitEmail">
                            <div class="space-y-2 text-center lg:text-left">
                                <span class="restomod-eyebrow">Account Recovery</span>
                                <h1 class="font-poppins text-4xl font-black leading-tight text-white">Forgot Password
                                </h1>
                                <p class="text-sm leading-relaxed text-white/60">Enter your registered email and we will
                                    send an OTP to verify your account.</p>
                            </div>

                            <div class="space-y-1">
                                <label for="forgot-email"
                                    class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Email
                                    Address</label>
                                <input id="forgot-email" v-model="recovery.email" type="email" required
                                    autocomplete="email" placeholder="john.doe@example.com"
                                    class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                            </div>

                            <button type="submit"
                                class="w-full rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy disabled:cursor-not-allowed disabled:opacity-70"
                                :disabled="isSubmittingEmail">
                                <span v-if="isSubmittingEmail">Sending OTP...</span>
                                <span v-else>Send OTP &rarr;</span>
                            </button>

                            <p class="pt-2 text-center text-xs font-light text-gray-500">
                                Remembered your password?
                                <a href="/login"
                                    class="ml-1 font-bold uppercase text-tccGold transition-colors hover:text-tccLightGold">Log
                                    In</a>
                            </p>
                        </form>

                        <form v-else-if="currentStep === 2" class="space-y-6" @submit.prevent="verifyOtp">
                            <div class="space-y-2 text-center lg:text-left">
                                <span class="restomod-eyebrow">Verify Email</span>
                                <h1 class="font-poppins text-3xl font-black leading-tight text-white">Enter OTP</h1>
                                <p class="text-sm leading-relaxed text-white/60">Use the {{ OTP_DIGIT_COUNT }}-digit OTP
                                    sent to {{ recovery.email }}.</p>
                            </div>

                            <div class="flex justify-center gap-2 sm:gap-3">
                                <input v-for="(_, index) in recovery.otp" :key="index" :value="recovery.otp[index]"
                                    type="text" maxlength="1" inputmode="numeric" autocomplete="one-time-code"
                                    class="h-14 w-10 rounded-xl border border-tccBorder text-center font-poppins text-xl font-semibold focus:outline-none focus:ring-1 focus:ring-tccNavy sm:h-16 sm:w-12 sm:text-2xl"
                                    :disabled="isAnyRequestLoading" @input="focusNextOtp($event, index)"
                                    @keydown="focusPreviousOtp($event, index)" @paste="pasteOtp">
                            </div>

                            <div class="flex gap-3">
                                <button type="button"
                                    class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy disabled:cursor-not-allowed disabled:opacity-60"
                                    :disabled="isAnyRequestLoading" @click="goToStep(1)">Back</button>
                                <button type="submit"
                                    class="flex-grow rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy disabled:cursor-not-allowed disabled:opacity-70"
                                    :disabled="isAnyRequestLoading">
                                    <span v-if="isVerifyingOtp">Verifying...</span>
                                    <span v-else>Verify OTP &rarr;</span>
                                </button>
                            </div>

                            <button type="button"
                                class="block w-full text-center text-xs font-bold uppercase text-tccGold transition-colors hover:text-tccLightGold disabled:cursor-not-allowed disabled:opacity-60"
                                :disabled="isAnyRequestLoading || resendCooldownSeconds > 0" @click="resendOtp">
                                <span v-if="isResendingOtp">Sending Code...</span>
                                <span v-else-if="resendCooldownSeconds > 0">Resend OTP in {{ resendCooldownSeconds
                                    }}s</span>
                                <span v-else>Resend OTP</span>
                            </button>
                        </form>

                        <form v-else-if="currentStep === 3" class="space-y-6" @submit.prevent="submitPassword">
                            <div class="space-y-2 text-center lg:text-left">
                                <span class="restomod-eyebrow">New Password</span>
                                <h1 class="font-poppins text-3xl font-black leading-tight text-white">Set Password</h1>
                                <p class="text-sm leading-relaxed text-white/60">Create a new password for {{
                                    recovery.email }}.</p>
                            </div>

                            <div class="space-y-4">
                                <div class="space-y-1">
                                    <label for="new-password"
                                        class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">New
                                        Password</label>
                                    <div class="relative">
                                        <input id="new-password" v-model="recovery.password"
                                            :type="showPassword ? 'text' : 'password'" required
                                            autocomplete="new-password" placeholder="New password"
                                            class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                                        <button type="button"
                                            class="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-tccLightGold"
                                            :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                            :disabled="isSettingPassword" @click="showPassword = !showPassword">
                                            <i class="pi" :class="showPassword ? 'pi-eye' : 'pi-eye-slash'"
                                                aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                <div class="space-y-1">
                                    <label for="confirm-password"
                                        class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Confirm
                                        Password</label>
                                    <div class="relative">
                                        <input id="confirm-password" v-model="recovery.confirmPassword"
                                            :type="showConfirmPassword ? 'text' : 'password'" required
                                            autocomplete="new-password" placeholder="Confirm password"
                                            class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                                        <button type="button"
                                            class="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-tccLightGold"
                                            :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                                            :disabled="isSettingPassword" @click="showConfirmPassword = !showConfirmPassword">
                                            <i class="pi" :class="showConfirmPassword ? 'pi-eye' : 'pi-eye-slash'"
                                                aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-2 text-[11px] text-white/65 sm:grid-cols-2">
                                <div v-for="requirement in passwordRequirements" :key="requirement.label"
                                    class="flex items-center gap-2"
                                    :class="requirement.passed ? 'text-tccGold' : 'text-white/55'">
                                    <i class="pi text-[10px]"
                                        :class="requirement.passed ? 'pi-check-circle' : 'pi-circle'"
                                        aria-hidden="true" />
                                    <span>{{ requirement.label }}</span>
                                </div>
                            </div>

                            <div class="flex gap-3">
                                <button type="button"
                                    class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy disabled:cursor-not-allowed disabled:opacity-60"
                                    :disabled="isSettingPassword" @click="goToStep(2)">Back</button>
                                <button type="submit"
                                    class="flex-grow rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy disabled:cursor-not-allowed disabled:opacity-70"
                                    :disabled="isSettingPassword">
                                    <span v-if="isSettingPassword">Updating Password...</span>
                                    <span v-else>Update Password &rarr;</span>
                                </button>
                            </div>
                        </form>

                        <div v-else class="space-y-7 text-center">
                            <div
                                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-tccGold/40 bg-tccGold/10 text-tccGold">
                                <i class="pi pi-check text-2xl" aria-hidden="true" />
                            </div>

                            <div class="space-y-2">
                                <span class="restomod-eyebrow mx-auto">Password Updated</span>
                                <h1 class="font-poppins text-3xl font-black leading-tight text-white">Reset Complete</h1>
                                <p class="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
                                    Your password has been reset successfully. You can now sign in with your new
                                    credentials.
                                </p>
                            </div>

                            <div class="space-y-3">
                                <a href="/login"
                                    class="block w-full rounded-lg bg-tccGold py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-tccDarkNavy shadow-lg transition-colors hover:bg-tccLightGold">
                                    Back to Login
                                </a>
                                <button type="button"
                                    class="text-xs font-bold uppercase text-tccGold transition-colors hover:text-tccLightGold"
                                    @click="restartFlow">
                                    Reset Another Password
                                </button>
                            </div>
                        </div>

                        <template #fallback>
                            <div class="space-y-6" aria-busy="true">
                                <div class="space-y-2 text-center lg:text-left">
                                    <div class="mx-auto h-3 w-32 animate-pulse rounded-full bg-white/10 lg:mx-0" />
                                    <div class="mx-auto h-8 w-56 animate-pulse rounded-lg bg-white/10 lg:mx-0" />
                                    <div
                                        class="mx-auto h-3 w-full max-w-xs animate-pulse rounded-full bg-white/10 lg:mx-0" />
                                </div>

                                <div class="space-y-2">
                                    <div class="h-3 w-28 animate-pulse rounded-full bg-white/10" />
                                    <div
                                        class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                                </div>

                                <div
                                    class="h-[46px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                                <div class="mx-auto h-3 w-44 animate-pulse rounded-full bg-white/10" />
                            </div>
                        </template>
                    </ClientOnly>
                </div>
            </section>
        </div>

        <CitizenAuthStatsBar />
    </div>
</template>
