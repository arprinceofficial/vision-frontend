<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Register | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const currentStep = ref(1)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const registration = reactive({
  email: '',
  firstName: '',
  lastName: '',
  phoneCode: '+44',
  phone: '',
  password: '',
  confirmPassword: '',
  otp: ['', '', '', '']
})

const stepTitles = [
  'Create Account',
  'Personal Details',
  'Contact Info',
  'Security',
  'Verification'
]

const validateStep = (step: number) => {
  if (step === 1 && (!registration.email || !registration.email.includes('@'))) {
    return 'Please enter a valid email address.'
  }
  if (step === 2 && (!registration.firstName || !registration.lastName)) {
    return 'Please fill out first and last name.'
  }
  if (step === 3 && !registration.phone) {
    return 'Please enter your mobile phone number.'
  }
  if (step === 4) {
    if (!registration.password || registration.password.length < 8) {
      return 'Password must be at least 8 characters long.'
    }
    if (registration.password !== registration.confirmPassword) {
      return 'Passwords do not match.'
    }
  }
  return ''
}

const goToStep = (step: number) => {
  const validation = validateStep(currentStep.value)

  if (step > currentStep.value && validation) {
    notice.value = {
      title: 'Check Details',
      message: validation,
      tone: 'warning'
    }
    return
  }

  currentStep.value = step
  notice.value = null
}

const focusNext = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  registration.otp[index] = input.value.replace(/\D/g, '').slice(0, 1)

  if (registration.otp[index] && input.nextElementSibling instanceof HTMLInputElement) {
    input.nextElementSibling.focus()
  }
}

const submitRegister = () => {
  if (registration.otp.some(value => !value)) {
    notice.value = {
      title: 'Code Required',
      message: 'Please enter the complete 4-digit verification code.',
      tone: 'warning'
    }
    return
  }

  notice.value = {
    title: 'Account Created',
    message: 'Your registration is complete. Redirecting to investor certification.',
    tone: 'success'
  }

  window.setTimeout(() => {
    void navigateTo('/investor-classification')
  }, 850)
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-between">
    <div class="grid flex-grow grid-cols-1 lg:grid-cols-12">
      <CitizenAuthHeroPanel description="Access high-performing alternative assets with ease. Create your membership profile to begin the onboarding checks." />

      <section class="flex items-center justify-center bg-white/5 p-8 sm:p-16 lg:col-span-7">
        <div class="restomod-panel w-full max-w-md space-y-8 rounded-[2rem] p-8">
          <div class="flex items-center justify-between border-b border-tccBorder pb-4">
            <div class="flex gap-2" aria-label="Registration progress">
              <span
                v-for="step in 5"
                :key="step"
                class="h-2.5 w-2.5 rounded-full transition-colors duration-300"
                :class="step <= currentStep ? 'bg-tccNavy' : 'bg-tccBorder'"
              />
            </div>
            <span class="font-poppins text-[10px] font-bold uppercase tracking-wider text-tccMutedGray">Step {{ currentStep }} of 5</span>
          </div>

          <CitizenSharedActionNotice
            v-if="notice"
            :title="notice.title"
            :message="notice.message"
            :tone="notice.tone"
          />

          <form class="space-y-6" @submit.prevent>
            <div v-show="currentStep === 1" class="space-y-6">
              <div class="space-y-2 text-center lg:text-left">
                <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ stepTitles[0] }}</span>
                <h1 class="font-poppins text-2xl font-semibold text-tccNavy">Let's Get Started</h1>
                <p class="text-xs text-tccMutedGray">In order to view our active classic car syndicates, please register below.</p>
              </div>

              <div class="space-y-1">
                <label for="reg-email" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Email Address</label>
                <input id="reg-email" v-model="registration.email" type="email" placeholder="john.doe@example.com" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
              </div>

              <button type="button" class="w-full rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow transition-colors hover:bg-tccNavy" @click="goToStep(2)">
                Continue &rarr;
              </button>
            </div>

            <div v-show="currentStep === 2" class="space-y-6">
              <div class="space-y-2 text-center lg:text-left">
                <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ stepTitles[1] }}</span>
                <h2 class="font-poppins text-2xl font-semibold text-tccNavy">What is Your Name?</h2>
                <p class="text-xs text-tccMutedGray">Please enter your legal first and last name.</p>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-1">
                  <label for="reg-first-name" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">First Name</label>
                  <input id="reg-first-name" v-model="registration.firstName" type="text" placeholder="John" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                </div>
                <div class="space-y-1">
                  <label for="reg-last-name" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Last Name</label>
                  <input id="reg-last-name" v-model="registration.lastName" type="text" placeholder="Doe" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                </div>
              </div>

              <div class="flex gap-3">
                <button type="button" class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy" @click="goToStep(1)">Back</button>
                <button type="button" class="flex-grow rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow transition-colors hover:bg-tccNavy" @click="goToStep(3)">
                  Continue &rarr;
                </button>
              </div>
            </div>

            <div v-show="currentStep === 3" class="space-y-6">
              <div class="space-y-2 text-center lg:text-left">
                <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ stepTitles[2] }}</span>
                <h2 class="font-poppins text-2xl font-semibold text-tccNavy">Your Mobile Number</h2>
                <p class="text-xs text-tccMutedGray">Required for profile verification and security alerts.</p>
              </div>

              <div class="space-y-1">
                <label for="reg-phone" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Phone Number</label>
                <div class="flex gap-2">
                  <select v-model="registration.phoneCode" class="rounded-lg border border-tccBorder bg-white px-3 py-2.5 text-sm focus:outline-none">
                    <option value="+44">GB (+44)</option>
                    <option value="+1">US (+1)</option>
                    <option value="+31">NL (+31)</option>
                    <option value="+49">DE (+49)</option>
                  </select>
                  <input id="reg-phone" v-model="registration.phone" type="tel" placeholder="712345678" class="min-w-0 flex-grow rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
                </div>
              </div>

              <div class="flex gap-3">
                <button type="button" class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy" @click="goToStep(2)">Back</button>
                <button type="button" class="flex-grow rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow transition-colors hover:bg-tccNavy" @click="goToStep(4)">
                  Continue &rarr;
                </button>
              </div>
            </div>

            <div v-show="currentStep === 4" class="space-y-6">
              <div class="space-y-2 text-center lg:text-left">
                <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ stepTitles[3] }}</span>
                <h2 class="font-poppins text-2xl font-semibold text-tccNavy">Create a Password</h2>
                <p class="text-xs text-tccMutedGray">Must contain min. 8 characters, an uppercase, a number, and a symbol.</p>
              </div>

              <div class="space-y-4">
                <div class="space-y-1">
                  <label for="reg-password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Password</label>
                  <div class="relative">
                    <input id="reg-password" v-model="registration.password" :type="showPassword ? 'text' : 'password'" placeholder="Password" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none">
                    <button type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
                      <i class="pi" :class="showPassword ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div class="space-y-1">
                  <label for="reg-confirm" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Confirm Password</label>
                  <div class="relative">
                    <input id="reg-confirm" v-model="registration.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm password" class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none">
                    <button type="button" class="absolute inset-y-0 right-3 flex items-center text-gray-400" :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'" @click="showConfirmPassword = !showConfirmPassword">
                      <i class="pi" :class="showConfirmPassword ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button type="button" class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy" @click="goToStep(3)">Back</button>
                <button type="button" class="flex-grow rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow transition-colors hover:bg-tccNavy" @click="goToStep(5)">
                  Continue &rarr;
                </button>
              </div>
            </div>

            <div v-show="currentStep === 5" class="space-y-6">
              <div class="space-y-2 text-center lg:text-left">
                <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">{{ stepTitles[4] }}</span>
                <h2 class="font-poppins text-2xl font-semibold text-tccNavy">Verify Email Code</h2>
                <p class="text-xs text-tccMutedGray">Enter the 4-digit code sent to your email inbox.</p>
              </div>

              <div class="flex justify-center gap-3 sm:gap-4">
                <input
                  v-for="(_, index) in registration.otp"
                  :key="index"
                  :value="registration.otp[index]"
                  type="text"
                  maxlength="1"
                  inputmode="numeric"
                  class="h-16 w-12 rounded-xl border border-tccBorder text-center font-poppins text-2xl font-semibold focus:outline-none focus:ring-1 focus:ring-tccNavy sm:w-14"
                  @input="focusNext($event, index)"
                >
              </div>

              <div class="flex gap-3">
                <button type="button" class="rounded-lg border border-tccBorder px-4 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy" @click="goToStep(4)">Back</button>
                <button type="button" class="flex-grow rounded-lg bg-tccGold py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-tccDarkNavy shadow transition-colors hover:bg-tccLightGold" @click="submitRegister">
                  Complete Signup &rarr;
                </button>
              </div>
            </div>

            <p class="text-center text-xs font-light text-gray-500">
              Already have an account?
              <a href="/login" class="ml-1 font-bold uppercase text-tccGold transition-colors hover:text-tccNavy">Log In</a>
            </p>
          </form>
        </div>
      </section>
    </div>

    <CitizenAuthStatsBar />
  </div>
</template>
