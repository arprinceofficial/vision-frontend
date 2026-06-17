<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'KYC Identity Verification | The Car Crowd'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

const form = reactive({
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  country: '',
  buildingNo: '',
  addressLine: '',
  town: '',
  postcode: '',
  documentType: ''
})

const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const fileName = ref('')
const errors = ref<Set<string>>(new Set())

const fields = [
  { key: 'firstName', label: 'First Name', placeholder: 'John', type: 'text' },
  { key: 'lastName', label: 'Last Name', placeholder: 'Doe', type: 'text' },
  { key: 'dob', label: 'Date of Birth', placeholder: 'DD/MM/YYYY', type: 'text' },
  { key: 'buildingNo', label: 'Building Name or Number', placeholder: 'e.g. Flat 3A or House 12', type: 'text' },
  { key: 'addressLine', label: 'Address Line', placeholder: 'e.g. Northgate Business Centre', type: 'text' },
  { key: 'town', label: 'Town / City', placeholder: 'e.g. Newark', type: 'text' },
  { key: 'postcode', label: 'Postcode', placeholder: 'e.g. NG24 1EZ', type: 'text' }
] as const

const hasError = (key: string) => errors.value.has(key)

const handleFile = (event: Event) => {
  const input = event.target as HTMLInputElement
  fileName.value = input.files?.[0]?.name || ''
  errors.value.delete('documentFile')
}

const skipKyc = () => {
  notice.value = {
    title: 'KYC Skipped',
    message: 'Verification has been skipped for now. Full verification will still be required before final allocations can complete.',
    tone: 'warning'
  }
}

const submitKyc = () => {
  const nextErrors = new Set<string>()

  Object.entries(form).forEach(([key, value]) => {
    if (!String(value).trim()) {
      nextErrors.add(key)
    }
  })

  if (!fileName.value) {
    nextErrors.add('documentFile')
  }

  errors.value = nextErrors

  if (nextErrors.size) {
    notice.value = {
      title: 'Form Incomplete',
      message: 'Please fill out all fields and attach a valid identity document image before submitting.',
      tone: 'warning'
    }
    return
  }

  notice.value = {
    title: 'Identity Verified',
    message: 'Your mock AML database checks returned successfully. Redirecting to the dashboard.',
    tone: 'success'
  }

  window.setTimeout(() => {
    void navigateTo('/profile')
  }, 900)
}
</script>

<template>
  <CitizenOnboardingStepCard
    eyebrow="Onboarding Step 3"
    title="Identity Verification (KYC)"
    description="We are required by UK anti-money laundering laws to verify all members. Processed securely via Smart Search."
    max-width="max-w-4xl"
  >
    <form class="space-y-6" @submit.prevent="submitKyc">
      <CitizenSharedActionNotice
        v-if="notice"
        :title="notice.title"
        :message="notice.message"
        :tone="notice.tone"
      />

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          v-for="field in fields.slice(0, 3)"
          :key="field.key"
          class="space-y-1"
        >
          <label :for="field.key" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">{{ field.label }}</label>
          <input
            :id="field.key"
            v-model="form[field.key]"
            :type="field.type"
            :placeholder="field.placeholder"
            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
            :class="hasError(field.key) ? 'border-red-400 bg-red-50' : 'border-tccBorder'"
          >
        </div>

        <div class="space-y-1">
          <label for="gender" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Gender</label>
          <select
            id="gender"
            v-model="form.gender"
            class="w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
            :class="hasError('gender') ? 'border-red-400 bg-red-50' : 'border-tccBorder'"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div class="space-y-1 md:col-span-2">
          <label for="country" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Country of Residence</label>
          <select
            id="country"
            v-model="form.country"
            class="w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
            :class="hasError('country') ? 'border-red-400 bg-red-50' : 'border-tccBorder'"
          >
            <option value="">Select a Country</option>
            <option value="GBR">United Kingdom (GBR)</option>
            <option value="USA">United States of America (USA)</option>
            <option value="NLD">Netherlands (NLD)</option>
            <option value="DEU">Germany (DEU)</option>
          </select>
        </div>

        <div
          v-for="field in fields.slice(3)"
          :key="field.key"
          class="space-y-1"
        >
          <label :for="field.key" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">{{ field.label }}</label>
          <input
            :id="field.key"
            v-model="form[field.key]"
            :type="field.type"
            :placeholder="field.placeholder"
            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
            :class="hasError(field.key) ? 'border-red-400 bg-red-50' : 'border-tccBorder'"
          >
        </div>

        <div class="space-y-1">
          <label for="documentType" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Identification Document</label>
          <select
            id="documentType"
            v-model="form.documentType"
            class="w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
            :class="hasError('documentType') ? 'border-red-400 bg-red-50' : 'border-tccBorder'"
          >
            <option value="">Select ID Type</option>
            <option value="passport">Passport</option>
            <option value="driving-licence">Driving Licence</option>
            <option value="national-id">National ID Card</option>
          </select>
        </div>

        <div class="space-y-1">
          <label for="documentFile" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Upload ID Image (Front)</label>
          <input
            id="documentFile"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            class="w-full rounded-lg border px-4 py-2 text-xs file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-tccNavy file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-white hover:file:bg-tccDarkNavy"
            :class="hasError('documentFile') ? 'border-red-400 bg-red-50' : 'border-tccBorder'"
            @change="handleFile"
          >
          <p v-if="fileName" class="text-[11px] text-tccMutedGray">Selected: {{ fileName }}</p>
        </div>
      </div>

      <div class="rounded-lg border border-tccBorder bg-tccLightBg p-4 text-xs leading-relaxed text-tccNavy">
        <i class="pi pi-info-circle mr-1 text-[11px] text-tccGold" aria-hidden="true" />
        <strong>Optional Waiver:</strong> You can complete this KYC now or choose to skip and finish it within 2 weeks. Completed credentials enable faster SPV allocation approvals.
      </div>

      <div class="flex flex-col items-center gap-4 border-t border-tccBorder pt-4 sm:flex-row">
        <button
          type="button"
          class="w-full rounded-lg border border-tccBorder px-6 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy transition-colors hover:bg-stone-50 sm:w-auto"
          @click="skipKyc"
        >
          <i class="pi pi-forward mr-1 text-[10px]" aria-hidden="true" />
          Skip KYC for 2 weeks
        </button>
        <button
          type="submit"
          class="w-full rounded-lg bg-tccGold py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-tccDarkNavy shadow transition-colors hover:bg-tccLightGold sm:flex-grow"
        >
          Complete KYC Verification
        </button>
      </div>
    </form>
  </CitizenOnboardingStepCard>
</template>
