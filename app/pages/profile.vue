<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Investor Dashboard | The Car Crowd'
})

type TabId = 'profile' | 'allocations' | 'security'
type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const activeTab = ref<TabId>('profile')
const editingProfile = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)

const tabs: Array<{ id: TabId, label: string, icon: string }> = [
  { id: 'profile', label: 'Profile Information', icon: 'pi-user' },
  { id: 'allocations', label: 'My Allocations', icon: 'pi-briefcase' },
  { id: 'security', label: 'Change Password', icon: 'pi-lock' }
]

const profile = reactive({
  firstName: 'John',
  lastName: 'Doe',
  dob: '12/08/1988',
  building: 'Flat 12B',
  street: '22 Park Lane',
  town: 'London',
  postcode: 'W1K 1BE'
})

const password = reactive({
  current: '',
  next: '',
  confirm: ''
})

const allocations = [
  {
    title: 'Ferrari 365 GTB/4 Daytona',
    slots: '1 Syndicate Slot',
    code: 'TCC-DAYTONA-09',
    value: 'GBP 8,500.00',
    paymentStatus: 'Funded',
    paymentTone: 'emerald',
    verification: 'Docs Signed',
    verificationTone: 'text-emerald-600',
    image: '/frontend/assets/images/ferrari_berlinetta.png',
    action: 'Details',
    actionRoute: '/car-detail'
  },
  {
    title: 'Aston Martin V8 Vantage',
    slots: '1 Syndicate Slot',
    code: 'TCC-ASTON-12',
    value: 'GBP 4,000.00',
    paymentStatus: 'Awaiting Bank Transfer',
    paymentTone: 'amber',
    verification: 'Signature Pending',
    verificationTone: 'text-amber-600',
    image: '/frontend/assets/images/AstonMartin.jpg',
    action: 'Complete Checkout',
    actionRoute: '/payment'
  }
]

const setTab = (tab: TabId) => {
  activeTab.value = tab
  notice.value = null
}

const saveProfile = () => {
  editingProfile.value = false
  notice.value = {
    title: 'Changes Saved',
    message: 'Your profile information has been successfully updated.',
    tone: 'success'
  }
}

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
    message: 'Your account password has been changed successfully.',
    tone: 'success'
  }
}

const logout = () => {
  notice.value = {
    title: 'Session Ended',
    message: 'This prototype has logged you out locally. Redirecting to sign in.',
    tone: 'info'
  }
  window.setTimeout(() => {
    void navigateTo('/login')
  }, 700)
}

const allocationBadgeClass = (tone: string) => (
  tone === 'emerald'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-amber-200 bg-amber-50 text-amber-700'
)
</script>

<template>
  <section class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <aside class="space-y-6 lg:col-span-1">
        <div class="relative overflow-hidden rounded-xl border border-white/10 bg-tccDarkNavy p-6 text-center text-white">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-tccNavy/40 via-tccDarkNavy to-tccDarkNavy" />
          <div class="relative z-10 space-y-3">
            <div class="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-tccGold bg-tccNavy/60">
              <span class="font-poppins text-3xl font-bold uppercase text-white">JD</span>
            </div>
            <div>
              <h1 class="font-poppins text-base font-semibold">John Doe</h1>
              <p class="text-xs text-white/60">john.doe@example.com</p>
            </div>
            <div class="space-y-1 pt-2 text-left">
              <div class="flex justify-between text-[10px] text-white/70">
                <span>Profile Completion</span>
                <span class="font-semibold text-tccGold">85%</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div class="h-1.5 rounded-full bg-tccGold" style="width: 85%;" />
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-1 rounded-xl border border-tccBorder bg-white p-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-poppins text-xs font-semibold text-tccNavy transition-colors hover:bg-stone-50"
            :class="activeTab === tab.id ? 'bg-stone-50' : ''"
            @click="setTab(tab.id)"
          >
            <i class="pi text-sm text-tccGold" :class="tab.icon" aria-hidden="true" />
            {{ tab.label }}
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-poppins text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
            @click="logout"
          >
            <i class="pi pi-sign-out text-sm text-red-500" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <div class="lg:col-span-3">
        <CitizenSharedActionNotice
          v-if="notice"
          class="mb-5"
          :title="notice.title"
          :message="notice.message"
          :tone="notice.tone"
        />

        <section v-if="activeTab === 'profile'" class="space-y-6 rounded-xl border border-tccBorder bg-white p-6 sm:p-8">
          <div class="flex flex-col gap-3 border-b border-tccBorder pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="font-poppins text-xl font-semibold text-tccNavy">Profile Details</h2>
              <p class="text-xs text-tccMutedGray">Manage your personal details and tax certifications</p>
            </div>
            <button
              v-if="!editingProfile"
              type="button"
              class="font-poppins text-xs font-bold text-tccGold transition-colors hover:text-tccNavy"
              @click="editingProfile = true"
            >
              <i class="pi pi-pencil mr-1" aria-hidden="true" />
              Edit Info
            </button>
          </div>

          <form class="space-y-6" @submit.prevent="saveProfile">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-1">
                <label for="firstName" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">First Name</label>
                <input id="firstName" v-model="profile.firstName" :disabled="!editingProfile" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-sm focus:outline-none disabled:bg-stone-50/50 disabled:opacity-75">
              </div>
              <div class="space-y-1">
                <label for="lastName" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Last Name</label>
                <input id="lastName" v-model="profile.lastName" :disabled="!editingProfile" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-sm focus:outline-none disabled:bg-stone-50/50 disabled:opacity-75">
              </div>
              <div class="space-y-1">
                <label for="dob" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Date of Birth</label>
                <input id="dob" v-model="profile.dob" :disabled="!editingProfile" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-sm focus:outline-none disabled:bg-stone-50/50 disabled:opacity-75">
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Tax Identification / Investor Class</label>
                <div class="flex items-center justify-between rounded-lg border border-tccBorder bg-stone-50 px-4 py-2 text-xs font-semibold text-tccNavy">
                  <span>High Net Worth Investor</span>
                  <span class="font-poppins text-[10px] uppercase text-emerald-600">
                    <i class="pi pi-check-circle mr-1" aria-hidden="true" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4 border-t border-tccBorder pt-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-tccNavy">Primary Address</h3>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="space-y-1">
                  <label for="building" class="block text-[11px] font-medium text-gray-500">Building Name/No.</label>
                  <input id="building" v-model="profile.building" :disabled="!editingProfile" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-xs disabled:bg-stone-50/50 disabled:opacity-75">
                </div>
                <div class="space-y-1">
                  <label for="street" class="block text-[11px] font-medium text-gray-500">Street Address</label>
                  <input id="street" v-model="profile.street" :disabled="!editingProfile" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-xs disabled:bg-stone-50/50 disabled:opacity-75">
                </div>
                <div class="space-y-1">
                  <label for="town" class="block text-[11px] font-medium text-gray-500">Town/City</label>
                  <input id="town" v-model="profile.town" :disabled="!editingProfile" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-xs disabled:bg-stone-50/50 disabled:opacity-75">
                </div>
                <div class="space-y-1">
                  <label for="postcode" class="block text-[11px] font-medium text-gray-500">Postcode</label>
                  <input id="postcode" v-model="profile.postcode" :disabled="!editingProfile" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-xs disabled:bg-stone-50/50 disabled:opacity-75">
                </div>
              </div>
            </div>

            <div v-if="editingProfile" class="flex items-center justify-end gap-3 border-t border-tccBorder pt-4">
              <button type="button" class="rounded-lg border border-tccBorder px-4 py-2 text-xs font-semibold transition-colors hover:bg-stone-50" @click="editingProfile = false">
                Cancel
              </button>
              <button type="submit" class="rounded-lg bg-tccGold px-5 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy transition-colors hover:bg-tccLightGold">
                Save Changes
              </button>
            </div>
          </form>
        </section>

        <section v-else-if="activeTab === 'allocations'" class="space-y-6 rounded-xl border border-tccBorder bg-white p-6 sm:p-8">
          <div>
            <h2 class="font-poppins text-xl font-semibold text-tccNavy">My Allocations</h2>
            <p class="text-xs text-tccMutedGray">Track active holdings, pending payments, or closed syndicates</p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-2 rounded-lg border border-tccBorder bg-tccLightBg p-3 text-xs font-semibold text-tccNavy">
              <i class="pi pi-wallet text-tccGold" aria-hidden="true" />
              Total Portfolio Allocation Value: GBP 12,500.00
            </div>

            <div class="overflow-x-auto rounded-lg border border-tccBorder">
              <table class="w-full min-w-[780px] border-collapse text-left">
                <thead>
                  <tr class="border-b border-tccBorder bg-stone-50 font-poppins text-[10px] font-bold uppercase text-tccNavy">
                    <th class="p-4">Asset Detail</th>
                    <th class="p-4">Ref Code</th>
                    <th class="p-4">Allocation Value</th>
                    <th class="p-4">Payment Status</th>
                    <th class="p-4">Verification</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-tccBorder text-xs font-light">
                  <tr v-for="allocation in allocations" :key="allocation.code" class="hover:bg-stone-50/50">
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <img :src="allocation.image" :alt="allocation.title" class="h-8 w-12 rounded border border-tccBorder object-cover">
                        <div>
                          <h3 class="font-semibold text-tccNavy">{{ allocation.title }}</h3>
                          <p class="text-[10px] text-gray-500">{{ allocation.slots }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="p-4 font-mono text-gray-500">{{ allocation.code }}</td>
                    <td class="p-4 font-semibold text-tccNavy">{{ allocation.value }}</td>
                    <td class="p-4">
                      <span class="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold" :class="allocationBadgeClass(allocation.paymentTone)">
                        <i class="pi pi-circle-fill text-[6px]" aria-hidden="true" />
                        {{ allocation.paymentStatus }}
                      </span>
                    </td>
                    <td class="p-4 text-[10px] font-semibold" :class="allocation.verificationTone">
                      <i class="pi pi-check-circle" aria-hidden="true" />
                      {{ allocation.verification }}
                    </td>
                    <td class="p-4 text-right">
                      <a :href="allocation.actionRoute" class="text-xs font-semibold text-tccNavy transition-colors hover:text-tccGold">
                        {{ allocation.action }} &rarr;
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section v-else class="space-y-6 rounded-xl border border-tccBorder bg-white p-6 sm:p-8">
          <div>
            <h2 class="font-poppins text-xl font-semibold text-tccNavy">Security &amp; Password</h2>
            <p class="text-xs text-tccMutedGray">Update your authentication details below</p>
          </div>

          <form class="max-w-md space-y-6" @submit.prevent="updatePassword">
            <div class="space-y-1">
              <label for="old_password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Current Password</label>
              <input id="old_password" v-model="password.current" type="password" placeholder="Current password" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
            </div>
            <div class="space-y-1">
              <label for="new_password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">New Password</label>
              <input id="new_password" v-model="password.next" type="password" placeholder="Min. 8 characters" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
            </div>
            <div class="space-y-1">
              <label for="confirm_password" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Confirm New Password</label>
              <input id="confirm_password" v-model="password.confirm" type="password" placeholder="Confirm password" class="w-full rounded-lg border border-tccBorder px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy">
            </div>

            <div class="pt-4">
              <button type="submit" class="w-full rounded-lg bg-tccGold py-3 text-center font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy shadow transition-colors hover:bg-tccLightGold">
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </section>
</template>
