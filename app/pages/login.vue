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
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const submitLogin = () => {
  if (!email.value || !password.value) {
    notice.value = {
      title: 'Missing Credentials',
      message: 'Please enter your email address and password.',
      tone: 'warning'
    }
    return
  }

  notice.value = {
    title: 'Login Successful',
    message: 'Redirecting to your dashboard.',
    tone: 'success'
  }

  window.setTimeout(() => {
    void navigateTo('/profile')
  }, 650)
}

const forgotPassword = () => {
  notice.value = {
    title: 'Reset Password',
    message: email.value
      ? `A reset link would be sent to ${email.value} in the connected app.`
      : 'Enter your email address first, then request a reset link.',
    tone: 'info'
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col justify-between">
    <div class="grid flex-grow grid-cols-1 lg:grid-cols-12">
      <CitizenAuthHeroPanel description="Access high-performing alternative assets with ease. Log in to manage your portfolio, track live syndicates, and secure allocations." />

      <section class="flex items-center justify-center bg-white p-8 sm:p-16 lg:col-span-7">
        <div class="w-full max-w-md space-y-8">
          <div class="space-y-2 text-center lg:text-left">
            <span class="font-poppins text-xs font-bold uppercase tracking-widest text-tccGold">Platform Sign In</span>
            <h1 class="font-poppins text-3xl font-semibold text-tccNavy">Welcome Back</h1>
            <p class="text-xs text-tccMutedGray">Sign in with your registered credentials below</p>
          </div>

          <CitizenSharedActionNotice
            v-if="notice"
            :title="notice.title"
            :message="notice.message"
            :tone="notice.tone"
          />

          <form class="space-y-6" @submit.prevent="submitLogin">
            <div class="space-y-4">
              <div class="space-y-1">
                <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Email Address</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                >
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Password</label>
                  <button type="button" class="text-[11px] font-semibold text-tccGold transition-colors hover:text-tccNavy" @click="forgotPassword">
                    Forgot Password?
                  </button>
                </div>
                <div class="relative">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="Password"
                    class="w-full rounded-lg border border-tccBorder px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                  >
                  <button
                    type="button"
                    class="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-tccNavy"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="showPassword = !showPassword"
                  >
                    <i class="pi" :class="showPassword ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" class="w-full rounded-lg bg-tccDarkNavy py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-tccNavy">
              Sign In &rarr;
            </button>

            <p class="pt-2 text-center text-xs font-light text-gray-500">
              Don't have an account?
              <a href="/register" class="ml-1 font-bold uppercase text-tccGold transition-colors hover:text-tccNavy">Register Now</a>
            </p>
          </form>
        </div>
      </section>
    </div>

    <CitizenAuthStatsBar />
  </div>
</template>
