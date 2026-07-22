<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Forgot Password | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type RecoveryStep = 1 | 2 | 3 | 4

const route = useRoute()
const currentStep = ref<RecoveryStep>(1)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const recovery = reactive({
  email: typeof route.query.email === 'string' ? route.query.email : '',
  otp: ['', '', '', ''],
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

const setNotice = (title: string, message: string, tone: NoticeTone) => {
  notice.value = { title, message, tone }
}

const goToStep = (step: RecoveryStep) => {
  currentStep.value = step
  notice.value = null
}

const submitEmail = () => {
  if (!isValidEmail(normalizedEmail.value)) {
    setNotice('Email Required', 'Please enter the email address linked to your account.', 'warning')
    return
  }

  recovery.email = normalizedEmail.value
  recovery.otp = ['', '', '', '']
  currentStep.value = 2
  setNotice('OTP Sent', `We sent a 4-digit OTP to ${recovery.email}.`, 'success')
}

const resendOtp = () => {
  recovery.otp = ['', '', '', '']
  setNotice('OTP Sent Again', `A new OTP has been sent to ${recovery.email}.`, 'success')
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

  const pastedOtp = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, recovery.otp.length).split('')

  if (!pastedOtp?.length) return

  event.preventDefault()
  recovery.otp = recovery.otp.map((_, index) => pastedOtp[index] || '')
}

const verifyOtp = () => {
  if (enteredOtp.value.length !== recovery.otp.length) {
    setNotice('OTP Required', 'Please enter the complete 4-digit OTP from your email.', 'warning')
    return
  }

  currentStep.value = 3
  setNotice('OTP Verified', 'Set a new password for your account.', 'success')
}

const submitPassword = () => {
  const unmetRequirement = passwordRequirements.value.find((requirement) => !requirement.passed)

  if (unmetRequirement) {
    setNotice('Password Check', `Please complete this requirement: ${unmetRequirement.label}.`, 'warning')
    return
  }

  currentStep.value = 4
  notice.value = null
}

const restartFlow = () => {
  currentStep.value = 1
  recovery.email = ''
  recovery.otp = ['', '', '', '']
  recovery.password = ''
  recovery.confirmPassword = ''
  showPassword.value = false
  showConfirmPassword.value = false
  notice.value = null
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-between">
    <div class="grid flex-grow grid-cols-1 lg:grid-cols-12">
      <CitizenAuthHeroPanel description="Recover secure access to your member account and return to your portfolio, syndicates, and onboarding checks." />

      <section class="flex items-center justify-center bg-white/5 p-8 sm:p-16 lg:col-span-7">
        <div class="restomod-panel w-full max-w-md space-y-8 rounded-[2rem] p-8">
          <div class="flex items-center justify-between border-b border-tccBorder pb-4">
            <div class="flex gap-2" aria-label="Password recovery progress">
              <span
                v-for="(step, index) in steps"
                :key="step"
                class="h-2.5 w-2.5 rounded-full transition-colors duration-300"
                :class="index + 1 <= currentStep ? 'bg-tccNavy' : 'bg-tccBorder'"
              />
            </div>
            <span class="font-poppins text-[10px] font-bold uppercase tracking-wider text-tccMutedGray">
              {{ currentStep === 4 ? 'Complete' : `Step ${currentStep} of ${steps.length}` }}
            </span>
          </div>

          <CitizenSharedActionNotice
            v-if="notice"
            :title="notice.title"
            :message="notice.message"
            :tone="notice.tone"
          />

          <form v-if="currentStep === 1" class="space-y-6" @submit.prevent="submitEmail">
            <div class="space-y-2 text-center lg:text-left">
              <span class="restomod-eyebrow">Account Recovery</span>
              <h1 class="font-poppins text-4xl font-black leading-tight text-white">Forgot Password</h1>
              <p class="text-sm leading-relaxed text-white/60">Enter your registered email and we will send an OTP to verify your account.</p>
            </div>

            <div class="space-y-1">
              <label for="forgot-email" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Email Address</label>
              <input
                id="forgot-email"
                v-model="recovery.email"
                type="email"
                required
                autocomplete="email"
                placeholder="john.doe@example.com"
                class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
              >
            </div>

            <button type="submit" class="w-full rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy">
              Send OTP &rarr;
            </button>

            <p class="pt-2 text-center text-xs font-light text-gray-500">
              Remembered your password?
              <a href="/login" class="ml-1 font-bold uppercase text-tccGold transition-colors hover:text-tccLightGold">Log In</a>
            </p>
          </form>

          <form v-else-if="currentStep === 2" class="space-y-6" @submit.prevent="verifyOtp">
            <div class="space-y-2 text-center lg:text-left">
              <span class="restomod-eyebrow">Verify Email</span>
              <h1 class="font-poppins text-3xl font-black leading-tight text-white">Enter OTP</h1>
              <p class="text-sm leading-relaxed text-white/60">Use the 4-digit OTP sent to {{ recovery.email }}.</p>
            </div>

            <div class="flex justify-center gap-3 sm:gap-4">
              <input
                v-for="(_, index) in recovery.otp"
                :key="index"
                :value="recovery.otp[index]"
                type="text"
                maxlength="1"
                inputmode="numeric"
                autocomplete="one-time-code"
                class="h-16 w-12 rounded-xl border border-tccBorder text-center font-poppins text-2xl font-semibold focus:outline-none focus:ring-1 focus:ring-tccNavy sm:w-14"
                @input="focusNextOtp($event, index)"
                @keydown="focusPreviousOtp($event, index)"
                @paste="pasteOtp"
              >
            </div>

            <div class="flex gap-3">
              <button type="button" class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy" @click="goToStep(1)">Back</button>
              <button type="submit" class="flex-grow rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy">
                Verify OTP &rarr;
              </button>
            </div>

            <button type="button" class="block w-full text-center text-xs font-bold uppercase text-tccGold transition-colors hover:text-tccLightGold" @click="resendOtp">
              Resend OTP
            </button>
          </form>

          <form v-else-if="currentStep === 3" class="space-y-6" @submit.prevent="submitPassword">
            <div class="space-y-2 text-center lg:text-left">
              <span class="restomod-eyebrow">New Password</span>
              <h1 class="font-poppins text-3xl font-black leading-tight text-white">Set Password</h1>
              <p class="text-sm leading-relaxed text-white/60">Create a new password for {{ recovery.email }}.</p>
            </div>

            <div class="space-y-4">
              <div class="space-y-1">
                <label for="new-password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">New Password</label>
                <div class="relative">
                  <input
                    id="new-password"
                    v-model="recovery.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="new-password"
                    placeholder="New password"
                    class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                  >
                  <button
                    type="button"
                    class="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-tccLightGold"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <i class="pi" :class="showPassword ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div class="space-y-1">
                <label for="confirm-password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Confirm Password</label>
                <div class="relative">
                  <input
                    id="confirm-password"
                    v-model="recovery.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    autocomplete="new-password"
                    placeholder="Confirm password"
                    class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                  >
                  <button
                    type="button"
                    class="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-tccLightGold"
                    :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i class="pi" :class="showConfirmPassword ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2 text-[11px] text-white/65 sm:grid-cols-2">
              <div
                v-for="requirement in passwordRequirements"
                :key="requirement.label"
                class="flex items-center gap-2"
                :class="requirement.passed ? 'text-tccGold' : 'text-white/55'"
              >
                <i class="pi text-[10px]" :class="requirement.passed ? 'pi-check-circle' : 'pi-circle'" aria-hidden="true" />
                <span>{{ requirement.label }}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <button type="button" class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy" @click="goToStep(2)">Back</button>
              <button type="submit" class="flex-grow rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy">
                Update Password &rarr;
              </button>
            </div>
          </form>

          <div v-else class="space-y-7 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-tccGold/40 bg-tccGold/10 text-tccGold">
              <i class="pi pi-check text-2xl" aria-hidden="true" />
            </div>

            <div class="space-y-2">
              <span class="restomod-eyebrow mx-auto">Password Updated</span>
              <h1 class="font-poppins text-3xl font-black leading-tight text-white">Reset Complete</h1>
              <p class="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
                Your password has been reset successfully. You can now sign in with your new credentials.
              </p>
            </div>

            <div class="space-y-3">
              <a href="/login" class="block w-full rounded-lg bg-tccGold py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-tccDarkNavy shadow-lg transition-colors hover:bg-tccLightGold">
                Back to Login
              </a>
              <button type="button" class="text-xs font-bold uppercase text-tccGold transition-colors hover:text-tccLightGold" @click="restartFlow">
                Reset Another Password
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <CitizenAuthStatsBar />
  </div>
</template>
