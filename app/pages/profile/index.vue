<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Profile Information | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const editingProfile = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const profile = reactive({
  firstName: 'Nayab',
  lastName: 'Navib Navib',
  dob: '12/08/1988',
  building: 'Flat 12B',
  street: '22 Park Lane',
  town: 'London',
  postcode: 'W1K 1BE'
})

const saveProfile = () => {
  editingProfile.value = false
  notice.value = {
    title: 'Changes Saved',
    message: 'Your profile information has been updated.',
    tone: 'success'
  }
}
</script>

<template>
  <ProfileDashboardShell active-section="profile">
    <CitizenSharedActionNotice
      v-if="notice"
      class="mb-5"
      :title="notice.title"
      :message="notice.message"
      :tone="notice.tone"
    />

    <section class="space-y-5 rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6">
      <div class="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-3 py-1.5 font-poppins text-[9px] font-black uppercase tracking-[0.18em] text-tccGold">
            <i class="pi pi-user text-[10px]" aria-hidden="true" />
            Investor Profile
          </span>
          <h2 class="mt-3 font-poppins text-xl font-black text-white sm:text-2xl">Profile Information</h2>
          <p class="mt-1 text-[13px] text-white/55">Manage your personal details and investor classification.</p>
        </div>
        <button
          v-if="!editingProfile"
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.16em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
          @click="editingProfile = true"
        >
          <i class="pi pi-pencil text-[10px]" aria-hidden="true" />
          Edit Info
        </button>
      </div>

      <form class="space-y-5" @submit.prevent="saveProfile">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label for="firstName" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">First Name</label>
            <input id="firstName" v-model="profile.firstName" :disabled="!editingProfile" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none disabled:opacity-75">
          </div>
          <div class="space-y-2">
            <label for="lastName" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Last Name</label>
            <input id="lastName" v-model="profile.lastName" :disabled="!editingProfile" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none disabled:opacity-75">
          </div>
          <div class="space-y-2">
            <label for="dob" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Date of Birth</label>
            <input id="dob" v-model="profile.dob" :disabled="!editingProfile" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none disabled:opacity-75">
          </div>
          <div class="space-y-2">
            <span class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Investor Class</span>
            <div class="flex min-h-11 items-center justify-between rounded-xl border border-tccGold/25 bg-tccGold/10 px-4 py-2.5 text-[13px]">
              <span class="font-semibold text-white">High Net Worth Investor</span>
              <span class="font-poppins text-[9px] font-black uppercase tracking-[0.14em] text-tccGold">
                <i class="pi pi-check-circle mr-1" aria-hidden="true" />
                Verified
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-4 border-t border-white/10 pt-5">
          <h3 class="font-poppins text-xs font-black uppercase tracking-[0.18em] text-tccGold">Primary Address</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label for="building" class="block text-[10px] font-semibold text-white/55">Building Name/No.</label>
              <input id="building" v-model="profile.building" :disabled="!editingProfile" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75">
            </div>
            <div class="space-y-2">
              <label for="street" class="block text-[10px] font-semibold text-white/55">Street Address</label>
              <input id="street" v-model="profile.street" :disabled="!editingProfile" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75">
            </div>
            <div class="space-y-2">
              <label for="town" class="block text-[10px] font-semibold text-white/55">Town/City</label>
              <input id="town" v-model="profile.town" :disabled="!editingProfile" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75">
            </div>
            <div class="space-y-2">
              <label for="postcode" class="block text-[10px] font-semibold text-white/55">Postcode</label>
              <input id="postcode" v-model="profile.postcode" :disabled="!editingProfile" class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75">
            </div>
          </div>
        </div>

        <div v-if="editingProfile" class="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="rounded-full border border-white/20 px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-tccGold hover:text-tccGold"
            @click="editingProfile = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-full bg-tccGold px-5 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  </ProfileDashboardShell>
</template>
