<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Change Password | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const password = reactive({
  current: '',
  next: '',
  confirm: ''
})

const updatePassword = () => {
  if (!password.current || !password.next || !password.confirm) {
    notice.value = {
      title: 'Missing Fields',
      message: 'Please fill out all password fields.',
      tone: 'warning'
    }
    return
  }

  if (password.next !== password.confirm) {
    notice.value = {
      title: 'Password Mismatch',
      message: 'Confirm password does not match the new password.',
      tone: 'error'
    }
    return
  }

  password.current = ''
  password.next = ''
  password.confirm = ''
  notice.value = {
    title: 'Password Updated',
    message: 'Your account password has been changed.',
    tone: 'success'
  }
}
</script>

<template>
  <ProfileDashboardShell active-section="security">
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
          <label for="old_password" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Current Password</label>
          <input id="old_password" v-model="password.current" type="password" placeholder="Current password" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none">
        </div>
        <div class="space-y-2">
          <label for="new_password" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">New Password</label>
          <input id="new_password" v-model="password.next" type="password" placeholder="Min. 8 characters" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none">
        </div>
        <div class="space-y-2">
          <label for="confirm_password" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Confirm New Password</label>
          <input id="confirm_password" v-model="password.confirm" type="password" placeholder="Confirm password" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none">
        </div>

        <button
          type="submit"
          class="w-full rounded-full bg-tccGold py-3 text-center font-poppins text-[10px] font-black uppercase tracking-[0.16em] text-tccDarkNavy shadow-lg shadow-tccGold/20 transition-colors hover:bg-tccLightGold"
        >
          Update Password
        </button>
      </form>
    </section>
  </ProfileDashboardShell>
</template>
