<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Change Password | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const isProfileViewReady = ref(false)
const isUpdatingPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const password = reactive({
  next: '',
  confirm: ''
})

const passwordRequirements = computed(() => [
  { label: '8 characters', passed: password.next.length >= 8 },
  { label: 'Uppercase letter', passed: /[A-Z]/.test(password.next) },
  { label: 'Number', passed: /\d/.test(password.next) },
  { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(password.next) },
  {
    label: 'Passwords match',
    passed: Boolean(password.next && password.next === password.confirm)
  }
])

const getPasswordChangeError = (error: any) => {
  const data = error?.response?._data || error?.data || {}
  const errors = data?.errors || data?.data
  const firstErrorKey = errors && typeof errors === 'object' ? Object.keys(errors)[0] : ''
  const firstError = firstErrorKey
    ? Array.isArray(errors[firstErrorKey]) ? errors[firstErrorKey][0] : errors[firstErrorKey]
    : ''

  return firstError || data?.message || 'Password update failed. Please try again.'
}

const updatePassword = async () => {
  if (!password.next || !password.confirm) {
    notice.value = {
      title: 'Missing Fields',
      message: 'Please fill out the new password and confirmation fields.',
      tone: 'warning'
    }
    return
  }

  const unmetRequirement = passwordRequirements.value.find((requirement) => !requirement.passed)
  if (unmetRequirement) {
    notice.value = {
      title: 'Password Check',
      message: `Please complete this requirement: ${unmetRequirement.label}.`,
      tone: 'warning'
    }
    return
  }

  try {
    isUpdatingPassword.value = true
    notice.value = null

    const response: any = await $fetchCitizen('v1/customer/manual-password-change', {
      method: 'POST',
      body: {
        password: password.next,
        password_confirmation: password.confirm
      }
    })

    if (response?.status === false) {
      notice.value = {
        title: 'Password Update Failed',
        message: response?.message || 'Password update failed. Please try again.',
        tone: 'error'
      }
      return
    }

    password.next = ''
    password.confirm = ''
    notice.value = {
      title: 'Password Updated',
      message: response?.message || 'Your account password has been changed.',
      tone: 'success'
    }
  } catch (error: any) {
    notice.value = {
      title: 'Password Update Failed',
      message: getPasswordChangeError(error),
      tone: 'error'
    }
  } finally {
    isUpdatingPassword.value = false
  }
}

onMounted(() => {
  window.requestAnimationFrame(() => {
    isProfileViewReady.value = true
  })
})
</script>

<template>
  <ClientOnly>
    <ProfileDashboardShell v-if="isProfileViewReady" active-section="security">
      <CitizenSharedActionNotice
        v-if="notice"
        class="mb-5"
        :title="notice.title"
        :message="notice.message"
        :tone="notice.tone"
      />

      <section class="rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-3 py-1.5 font-poppins text-[9px] font-black uppercase tracking-[0.18em] text-tccGold">
            <i class="pi pi-lock text-[10px]" aria-hidden="true" />
            Account Security
          </span>
          <h2 class="mt-3 font-poppins text-xl font-black text-white sm:text-2xl">Change Password</h2>
          <p class="mt-1 text-[13px] text-white/55">Update your authentication details below.</p>
        </div>

        <form class="mt-6 max-w-lg space-y-5" @submit.prevent="updatePassword">
          <div class="space-y-2">
            <label for="new_password" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">New Password</label>
            <div class="relative">
              <input id="new_password" v-model="password.next" :type="showNewPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Min. 8 characters" class="w-full rounded-xl border border-white/14 px-4 py-2.5 pr-12 text-[13px] focus:outline-none">
              <button
                type="button"
                class="absolute inset-y-0 right-4 flex items-center text-white/45 transition-colors hover:text-tccGold focus:outline-none"
                :aria-label="showNewPassword ? 'Hide new password' : 'Show new password'"
                @click="showNewPassword = !showNewPassword"
              >
                <i class="pi" :class="showNewPassword ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <label for="confirm_password" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Confirm New Password</label>
            <div class="relative">
              <input id="confirm_password" v-model="password.confirm" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Confirm password" class="w-full rounded-xl border border-white/14 px-4 py-2.5 pr-12 text-[13px] focus:outline-none">
              <button
                type="button"
                class="absolute inset-y-0 right-4 flex items-center text-white/45 transition-colors hover:text-tccGold focus:outline-none"
                :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i class="pi" :class="showConfirmPassword ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-2 text-[11px] text-white/65 sm:grid-cols-2">
            <div
              v-for="requirement in passwordRequirements"
              :key="requirement.label"
              class="flex items-center gap-2"
              :class="requirement.passed ? 'text-tccGold' : 'text-white/55'"
            >
              <i
                class="pi text-[10px]"
                :class="requirement.passed ? 'pi-check-circle' : 'pi-circle'"
                aria-hidden="true"
              />
              <span>{{ requirement.label }}</span>
            </div>
          </div>

          <button
            type="submit"
            class="w-full rounded-full bg-tccGold py-3 text-center font-poppins text-[10px] font-black uppercase tracking-[0.16em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="isUpdatingPassword"
          >
            {{ isUpdatingPassword ? 'Updating Password...' : 'Update Password' }}
          </button>
        </form>
      </section>
    </ProfileDashboardShell>
    <ProfileDashboardSkeleton v-else active-section="security" />

    <template #fallback>
      <ProfileDashboardSkeleton active-section="security" />
    </template>
  </ClientOnly>
</template>
