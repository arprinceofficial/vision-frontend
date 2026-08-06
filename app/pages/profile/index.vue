<script setup lang="ts">
definePageMeta({
  layout: 'portal'
})

useHead({
  title: 'Profile Information | Vision148'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type Country = {
  id: number | string
  alpha_2_code?: string
  en_short_name?: string
  nationality?: string
}

type Gender = {
  id: number | string
  gender_name?: string
  name?: string
  status?: number | string | boolean
}

type NationalityOption = Country & {
  id: string
  code: string
  name: string
}

type GenderOption = Gender & {
  id: string
  name: string
}

type CmsListResponse<T> = {
  data?: {
    data?: T[]
  } | T[]
}

const editingProfile = ref(false)
const isProfileViewReady = ref(false)
const isSavingProfile = ref(false)
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const validations_errors = ref<Record<string, string>>({})
const { citizen_user } = citizenAuth()

const profile = reactive({
  username: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  ccode: '',
  mobile: '',
  photo: '',
  dob: '',
  gender: '',
  nationality_id: '',
  pre_country: '',
  pre_srteet_address: '',
  pre_city: '',
  pre_provience: '',
  pre_zip: ''
})

const countriesCache = useState<Country[] | null>('profile-countries-cache', () => null)
const { data: countriesData, pending: isCountriesLoading } = useAsyncData<Country[]>(
  'profile-countries',
  async () => {
    if (countriesCache.value?.length) return countriesCache.value

    try {
      const response = await $fetchCMS<CmsListResponse<Country>>('v1/cms/countries', { method: 'POST' })
      const payload = Array.isArray(response?.data) ? response.data : response?.data?.data ?? []
      countriesCache.value = payload
      return payload
    } catch (error) {
      console.error('Failed to load countries:', error)
      return []
    }
  },
  {
    default: () => countriesCache.value ?? [],
    lazy: true,
    server: false
  }
)

const gendersCache = useState<Gender[] | null>('profile-genders-cache', () => null)
const { data: gendersData, pending: isGendersLoading } = useAsyncData<Gender[]>(
  'profile-genders',
  async () => {
    if (gendersCache.value?.length) return gendersCache.value

    try {
      const response = await $fetchCMS<CmsListResponse<Gender>>('v1/cms/genders', { method: 'POST' })
      const payload = Array.isArray(response?.data) ? response.data : response?.data?.data ?? []
      gendersCache.value = payload
      return payload
    } catch (error) {
      console.error('Failed to load genders:', error)
      return []
    }
  },
  {
    default: () => gendersCache.value ?? [],
    lazy: true,
    server: false
  }
)

const currentUser = computed(() => getCitizenUserData(citizen_user.value))

const getStringValue = (value: unknown) => {
  if (value === null || value === undefined) return ''
  return String(value)
}

const formatInvestorClass = (value: unknown) => {
  const normalized = getStringValue(value).replace(/_/g, ' ').trim()
  if (!normalized) return 'Not Classified'
  return normalized
    .split(/\s+/)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')
    .replace(/\bHnw\b/g, 'HNW')
}

const decodeHtmlEntities = (value: unknown) => {
  const entityMap: Record<string, string> = {
    '&amp;': '&',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&Aring;': 'Å',
    '&aring;': 'å'
  }

  return getStringValue(value).replace(/&#(\d+);|&#x([\da-f]+);|&[a-zA-Z]+;/g, (entity, decimal, hex) => {
    if (decimal) return String.fromCharCode(Number(decimal))
    if (hex) return String.fromCharCode(parseInt(hex, 16))
    return entityMap[entity] || entity
  })
}

const countries = computed(() => countriesData.value ?? [])
const genders = computed(() => gendersData.value ?? [])

const getCountryOptionLabel = (country: Country) => {
  return decodeHtmlEntities(country.nationality || country.en_short_name || country.id)
}

const nationalityOptions = computed<NationalityOption[]>(() => (
  countries.value
    .map((country) => ({
      ...country,
      id: getStringValue(country.id),
      code: getStringValue(country.alpha_2_code).toLowerCase(),
      name: getCountryOptionLabel(country)
    }))
    .filter((country) => country.id && country.name)
))

const genderOptions = computed<GenderOption[]>(() => (
  genders.value
    .filter((gender) => Number(gender.status ?? 1) === 1)
    .map((gender) => ({
      ...gender,
      id: getStringValue(gender.id),
      name: decodeHtmlEntities(gender.gender_name || gender.name || gender.id)
    }))
    .filter((gender) => gender.id && gender.name)
))

const findOptionByIdOrName = <T extends { id: string, name: string }>(options: T[], value: string) => {
  const normalizedValue = value.trim().toLowerCase()
  if (!normalizedValue) return null

  return options.find((option) => (
    option.id.trim().toLowerCase() === normalizedValue ||
    option.name.trim().toLowerCase() === normalizedValue
  )) || null
}

const selectedNationality = computed<NationalityOption | null>({
  get: () => findOptionByIdOrName(nationalityOptions.value, profile.nationality_id),
  set: (country) => {
    profile.nationality_id = country?.id || ''
    clearValidationError('nationality_id')
  }
})

const selectedPrimaryCountry = computed<NationalityOption | null>({
  get: () => findOptionByIdOrName(nationalityOptions.value, profile.pre_country),
  set: (country) => {
    profile.pre_country = country?.id || ''
    clearValidationError('pre_country')
  }
})

const selectedGender = computed<GenderOption | null>({
  get: () => findOptionByIdOrName(genderOptions.value, profile.gender),
  set: (gender) => {
    profile.gender = gender?.id || ''
    clearValidationError('gender')
  }
})

const normalizedGenderId = computed(() => (
  findOptionByIdOrName(genderOptions.value, profile.gender)?.id || profile.gender
))

const normalizedNationalityId = computed(() => (
  findOptionByIdOrName(nationalityOptions.value, profile.nationality_id)?.id || profile.nationality_id
))

const normalizedPrimaryCountryId = computed(() => (
  findOptionByIdOrName(nationalityOptions.value, profile.pre_country)?.id || profile.pre_country
))

const investorClass = computed(() => {
  const formatted = formatInvestorClass(currentUser.value?.investment_type)
  return formatted === 'High Net Worth' ? 'High Net Worth Investor' : formatted
})

const investorVerificationLabel = computed(() => isTruthyApiFlag(currentUser.value?.is_self_certified) ? 'Verified' : 'Pending')

const prefillProfile = () => {
  const user = currentUser.value
  if (!user) return

  const info = user.user_info || {}
  profile.username = getStringValue(user.username)
  profile.first_name = getStringValue(info.first_name)
  profile.last_name = getStringValue(info.last_name)
  profile.middle_name = getStringValue(info.middle_name)
  profile.email = getStringValue(user.email)
  profile.ccode = getStringValue(user.ccode)
  profile.mobile = getStringValue(user.mobile)
  profile.photo = getStringValue(info.photo || user.photo)
  profile.dob = getStringValue(info.dob)
  profile.gender = getStringValue(info.gender_id || info.gender_info?.id || info.gender)
  profile.nationality_id = getStringValue(info.nationality_id || info.nationality_info?.id || info.nationality)
  profile.pre_country = getStringValue(info.pre_country)
  profile.pre_srteet_address = getStringValue(info.pre_srteet_address)
  profile.pre_city = getStringValue(info.pre_city)
  profile.pre_provience = getStringValue(info.pre_provience)
  profile.pre_zip = getStringValue(info.pre_zip)
}

const getProfileValidationErrors = (payload: any) => {
  const errors = payload?.errors || payload?.data
  if (!errors || typeof errors !== 'object' || Array.isArray(errors)) return {}

  return Object.entries(errors).reduce<Record<string, string>>((result, [key, value]) => {
    result[key] = Array.isArray(value)
      ? value.map((item) => getStringValue(item)).filter(Boolean).join(' ')
      : getStringValue(value)
    return result
  }, {})
}

const applyProfileUpdateError = (payload: any) => {
  const fieldErrors = getProfileValidationErrors(payload)
  validations_errors.value = fieldErrors
  const firstFieldError = Object.values(fieldErrors)[0]

  notice.value = {
    title: 'Profile Update Failed',
    message: firstFieldError || payload?.message || 'Profile update failed. Please try again.',
    tone: 'error'
  }
}

const clearValidationError = (field: string) => {
  if (!validations_errors.value[field]) return
  delete validations_errors.value[field]
}

const profileFieldErrorClass = (field: string) => (
  validations_errors.value[field] ? 'profile-field-error border-[#f44336!important]' : ''
)

const profileFieldErrorText = (field: string) => validations_errors.value[field] || ''

const handleProfileFieldFocus = (field: string) => {
  clearValidationError(field)
}

const validationErrorEntries = computed(() => (
  Object.entries(validations_errors.value).filter(([, message]) => Boolean(message))
))

const formatValidationFieldLabel = (field: string) => (
  field
    .replaceAll('_', ' ')
    .replace('srteet', 'street')
    .replace('provience', 'province')
    .replace(/\b\w/g, (char) => char.toUpperCase())
)

const getProfilePayload = () => ({
  ...profile,
  gender: normalizedGenderId.value,
  nationality_id: normalizedNationalityId.value,
  pre_country: normalizedPrimaryCountryId.value
})

const setProfilePhoto = (photo: string) => {
  profile.photo = photo
  clearValidationError('photo')
}

const cancelEdit = () => {
  prefillProfile()
  validations_errors.value = {}
  editingProfile.value = false
  notice.value = null
}

const saveProfile = async () => {
  try {
    isSavingProfile.value = true
    notice.value = null
    validations_errors.value = {}

    const response: any = await $fetchCitizen('v1/customer/manual-profile-update', {
      method: 'POST',
      body: getProfilePayload()
    })

    if (response?.status === false) {
      applyProfileUpdateError(response)
      return
    }

    const refreshedUser = await fetchCitizenCurrentUser()
    if (refreshedUser) {
      citizen_user.value = refreshedUser
      prefillProfile()
    }

    editingProfile.value = false
    validations_errors.value = {}
    notice.value = {
      title: 'Changes Saved',
      message: response?.message || 'Your profile information has been updated.',
      tone: 'success'
    }
  } catch (error: any) {
    applyProfileUpdateError(error?.response?._data || error?.data || error)
  } finally {
    isSavingProfile.value = false
  }
}

watch(
  () => citizen_user.value,
  () => {
    if (!editingProfile.value) {
      prefillProfile()
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.requestAnimationFrame(() => {
    prefillProfile()
    isProfileViewReady.value = true
  })
})
</script>

<template>
  <ClientOnly>
    <ProfileDashboardShell v-if="isProfileViewReady" active-section="profile">
      <CitizenSharedActionNotice v-if="notice" class="mb-5" :title="notice.title" :message="notice.message"
        :tone="notice.tone" />

      <div v-if="validationErrorEntries.length"
        class="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
        <p class="font-poppins text-[10px] font-black uppercase tracking-[0.18em] text-red-200">Validation Errors</p>
        <div class="mt-3 space-y-2">
          <p v-for="[field, message] in validationErrorEntries" :key="field">
            <span class="font-semibold text-red-100">{{ formatValidationFieldLabel(field) }}:</span>
            <span class="ml-1 text-red-100/85">{{ message }}</span>
          </p>
        </div>
      </div>

      <section
        class="space-y-5 rounded-2xl border border-white/12 bg-white/[0.06] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6">
        <div class="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              class="inline-flex items-center gap-2 rounded-full border border-tccGold/35 bg-tccGold/10 px-3 py-1.5 font-poppins text-[9px] font-black uppercase tracking-[0.18em] text-tccGold">
              <i class="pi pi-user text-[10px]" aria-hidden="true" />
              Investor Profile
            </span>
            <h2 class="mt-3 font-poppins text-xl font-black text-white sm:text-2xl">Profile Information</h2>
            <p class="mt-1 text-[13px] text-white/55">Manage your personal details and investor classification.</p>
          </div>
          <button v-if="!editingProfile" type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-tccGold px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.16em] text-tccDarkNavy transition-colors hover:bg-tccLightGold"
            @click="editingProfile = true">
            <i class="pi pi-pencil text-[10px]" aria-hidden="true" />
            Edit Info
          </button>
        </div>

        <form class="space-y-5" @submit.prevent="saveProfile">
          <div class="space-y-2">
            <label class="block text-[13px] font-black text-white">Upload Profile Image</label>
            <div class="profile-photo-upload w-full max-w-[250px]" :class="[
              !editingProfile || isSavingProfile ? 'pointer-events-none opacity-75' : '',
              validations_errors.photo ? 'profile-photo-upload-error' : ''
            ]">
              <PhotoBlockPhoto :getPhoto="profile.photo"
                button-color-class="bg-tccGold hover:bg-tccLightGold focus-visible:outline-tccGold"
                button-text-color-class="!text-black" @set_photo="setProfilePhoto" />
            </div>
            <LazyInputError :message="profileFieldErrorText('photo')" />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label for="first_name"
                class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">First Name</label>
              <input id="first_name" v-model="profile.first_name" :disabled="!editingProfile || isSavingProfile"
                class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none disabled:opacity-75"
                :class="profileFieldErrorClass('first_name')" @focus="handleProfileFieldFocus('first_name')">
              <LazyInputError :message="profileFieldErrorText('first_name')" />
            </div>
            <div class="space-y-2">
              <label for="last_name" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Last
                Name</label>
              <input id="last_name" v-model="profile.last_name" :disabled="!editingProfile || isSavingProfile"
                class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none disabled:opacity-75"
                :class="profileFieldErrorClass('last_name')" @focus="handleProfileFieldFocus('last_name')">
              <LazyInputError :message="profileFieldErrorText('last_name')" />
            </div>
            <div class="space-y-2">
              <label for="dob" class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Date of
                Birth</label>
              <input id="dob" v-model="profile.dob" type="date" :disabled="!editingProfile || isSavingProfile"
                class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] focus:outline-none disabled:opacity-75"
                :class="profileFieldErrorClass('dob')" @focus="handleProfileFieldFocus('dob')">
              <LazyInputError :message="profileFieldErrorText('dob')" />
            </div>
            <div class="space-y-2">
              <span class="block text-[10px] font-black uppercase tracking-[0.16em] text-white/55">Investor Class</span>
              <div
                class="flex min-h-11 items-center justify-between rounded-xl border border-tccGold/25 bg-tccGold/10 px-4 py-2.5 text-[13px]">
                <span class="font-semibold text-white">{{ investorClass }}</span>
                <span class="font-poppins text-[9px] font-black uppercase tracking-[0.14em] text-tccGold">
                  <i class="pi pi-check-circle mr-1" aria-hidden="true" />
                  {{ investorVerificationLabel }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-4 border-t border-white/10 pt-5">
            <h3 class="font-poppins text-xs font-black uppercase tracking-[0.18em] text-tccGold">Account Details</h3>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label for="username" class="block text-[10px] font-semibold text-white/55">Username</label>
                <input id="username" v-model="profile.username" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('username')" @focus="handleProfileFieldFocus('username')">
                <LazyInputError :message="profileFieldErrorText('username')" />
              </div>
              <div class="space-y-2">
                <label for="middle_name" class="block text-[10px] font-semibold text-white/55">Middle Name</label>
                <input id="middle_name" v-model="profile.middle_name" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('middle_name')" @focus="handleProfileFieldFocus('middle_name')">
                <LazyInputError :message="profileFieldErrorText('middle_name')" />
              </div>
              <div class="space-y-2">
                <label for="email" class="block text-[10px] font-semibold text-white/55">Email Address</label>
                <input id="email" v-model="profile.email" type="email" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('email')" @focus="handleProfileFieldFocus('email')">
                <LazyInputError :message="profileFieldErrorText('email')" />
              </div>
              <div class="space-y-2">
                <label for="ccode" class="block text-[10px] font-semibold text-white/55">Country Code</label>
                <input id="ccode" v-model="profile.ccode" type="tel" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('ccode')" @focus="handleProfileFieldFocus('ccode')">
                <LazyInputError :message="profileFieldErrorText('ccode')" />
              </div>
              <div class="space-y-2">
                <label for="mobile" class="block text-[10px] font-semibold text-white/55">Mobile</label>
                <input id="mobile" v-model="profile.mobile" type="tel" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('mobile')" @focus="handleProfileFieldFocus('mobile')">
                <LazyInputError :message="profileFieldErrorText('mobile')" />
              </div>
              <div class="space-y-2">
                <label for="gender" class="block text-[10px] font-semibold text-white/55">Gender</label>
                <Dropdown v-model="selectedGender" input-id="gender" :options="genderOptions" optionLabel="name"
                  placeholder="Select gender" class="profile-option-dropdown w-full"
                  panelClass="profile-option-dropdown-panel" :loading="isGendersLoading"
                  :disabled="!editingProfile || isSavingProfile || isGendersLoading"
                  :class="profileFieldErrorClass('gender')" @focus="handleProfileFieldFocus('gender')">
                  <template #value="slotProps">
                    <span v-if="slotProps.value" class="block truncate">{{ slotProps.value.name }}</span>
                    <span v-else class="block truncate text-white/45">{{ slotProps.placeholder }}</span>
                  </template>
                  <template #option="slotProps">
                    <span>{{ slotProps.option.name }}</span>
                  </template>
                </Dropdown>
                <LazyInputError :message="profileFieldErrorText('gender')" />
              </div>
              <div class="space-y-2">
                <label for="nationality_id" class="block text-[10px] font-semibold text-white/55">Nationality</label>
                <Dropdown v-model="selectedNationality" input-id="nationality_id" :options="nationalityOptions"
                  optionLabel="name" placeholder="Select nationality" class="profile-option-dropdown w-full"
                  panelClass="profile-option-dropdown-panel" filter :loading="isCountriesLoading"
                  :disabled="!editingProfile || isSavingProfile || isCountriesLoading"
                  :class="profileFieldErrorClass('nationality_id')" @focus="handleProfileFieldFocus('nationality_id')">
                  <template #value="slotProps">
                    <span v-if="slotProps.value" class="block truncate">{{ slotProps.value.name }}</span>
                    <span v-else class="block truncate text-white/45">{{ slotProps.placeholder }}</span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center gap-2">
                      <span v-if="slotProps.option.code" class="font-mono text-[10px] uppercase text-tccGold/70">{{
                        slotProps.option.code }}</span>
                      <span>{{ slotProps.option.name }}</span>
                    </div>
                  </template>
                </Dropdown>
                <LazyInputError :message="profileFieldErrorText('nationality_id')" />
              </div>
            </div>
          </div>

          <div class="space-y-4 border-t border-white/10 pt-5">
            <h3 class="font-poppins text-xs font-black uppercase tracking-[0.18em] text-tccGold">Primary Address</h3>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label for="pre_country" class="block text-[10px] font-semibold text-white/55">Country</label>
                <Dropdown v-model="selectedPrimaryCountry" input-id="pre_country" :options="nationalityOptions"
                  optionLabel="name" placeholder="Select country" class="profile-option-dropdown w-full"
                  panelClass="profile-option-dropdown-panel" filter :loading="isCountriesLoading"
                  :disabled="!editingProfile || isSavingProfile || isCountriesLoading"
                  :class="profileFieldErrorClass('pre_country')" @focus="handleProfileFieldFocus('pre_country')">
                  <template #value="slotProps">
                    <span v-if="slotProps.value" class="block truncate">{{ slotProps.value.name }}</span>
                    <span v-else class="block truncate text-white/45">{{ slotProps.placeholder }}</span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center gap-2">
                      <span v-if="slotProps.option.code" class="font-mono text-[10px] uppercase text-tccGold/70">{{
                        slotProps.option.code }}</span>
                      <span>{{ slotProps.option.name }}</span>
                    </div>
                  </template>
                </Dropdown>
                <LazyInputError :message="profileFieldErrorText('pre_country')" />
              </div>
              <div class="space-y-2">
                <label for="pre_srteet_address" class="block text-[10px] font-semibold text-white/55">Street
                  Address</label>
                <input id="pre_srteet_address" v-model="profile.pre_srteet_address"
                  :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('pre_srteet_address')"
                  @focus="handleProfileFieldFocus('pre_srteet_address')">
                <LazyInputError :message="profileFieldErrorText('pre_srteet_address')" />
              </div>
              <div class="space-y-2">
                <label for="pre_city" class="block text-[10px] font-semibold text-white/55">Town/City</label>
                <input id="pre_city" v-model="profile.pre_city" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('pre_city')" @focus="handleProfileFieldFocus('pre_city')">
                <LazyInputError :message="profileFieldErrorText('pre_city')" />
              </div>
              <div class="space-y-2">
                <label for="pre_provience" class="block text-[10px] font-semibold text-white/55">Province</label>
                <input id="pre_provience" v-model="profile.pre_provience" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('pre_provience')" @focus="handleProfileFieldFocus('pre_provience')">
                <LazyInputError :message="profileFieldErrorText('pre_provience')" />
              </div>
              <div class="space-y-2">
                <label for="pre_zip" class="block text-[10px] font-semibold text-white/55">Postcode</label>
                <input id="pre_zip" v-model="profile.pre_zip" :disabled="!editingProfile || isSavingProfile"
                  class="w-full rounded-xl border border-white/14 px-4 py-2.5 text-[13px] disabled:opacity-75"
                  :class="profileFieldErrorClass('pre_zip')" @focus="handleProfileFieldFocus('pre_zip')">
                <LazyInputError :message="profileFieldErrorText('pre_zip')" />
              </div>
            </div>
          </div>

          <div v-if="editingProfile"
            class="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button type="button"
              class="rounded-full border border-white/20 px-4 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-tccGold hover:text-tccGold"
              :disabled="isSavingProfile" @click="cancelEdit">
              Cancel
            </button>
            <button type="submit"
              class="rounded-full bg-tccGold px-5 py-2.5 font-poppins text-[10px] font-black uppercase tracking-[0.14em] text-tccDarkNavy transition-colors hover:bg-tccLightGold disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="isSavingProfile">
              {{ isSavingProfile ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </section>
    </ProfileDashboardShell>
    <ProfileDashboardSkeleton v-else active-section="profile" />

    <template #fallback>
      <ProfileDashboardSkeleton active-section="profile" />
    </template>
  </ClientOnly>
</template>

<style scoped>
:deep(.profile-photo-upload .photo_upload_block) {
  min-height: 210px;
  border-color: rgba(255, 255, 255, 0.74);
  background: rgba(10, 8, 6, 0.34);
  color: #f5f0e8;
}

:deep(.profile-photo-upload .signature_upload_block) {
  min-height: 136px;
}

:deep(.profile-photo-upload svg) {
  color: rgba(245, 240, 232, 0.72);
}

:deep(.profile-photo-upload label),
:deep(.profile-photo-upload span),
:deep(.profile-photo-upload p) {
  color: #f5f0e8;
}

:deep(.profile-photo-upload label span) {
  border-radius: 0.375rem;
  background: rgba(72, 92, 125, 0.62);
  padding: 0.125rem 0.25rem;
}

:deep(.profile-photo-upload .signature_area) {
  min-height: 128px;
}

:deep(.profile-photo-upload .signature_area img) {
  max-height: 128px;
  width: 100%;
  object-fit: cover;
}

:deep(.profile-photo-upload-error .photo_upload_block),
:deep(.profile-field-error) {
  border-color: #f44336 !important;
}

:deep(.profile-option-dropdown) {
  min-height: 2.75rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f5f0e8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

:deep(.profile-option-dropdown:not(.p-disabled):hover),
:deep(.profile-option-dropdown.p-focus) {
  border-color: rgba(247, 198, 0, 0.72);
}

:deep(.profile-option-dropdown .p-select-label) {
  padding: 0.625rem 1rem;
  color: #f5f0e8;
  font-size: 13px;
  line-height: 1.5;
}

:deep(.profile-option-dropdown .p-select-dropdown) {
  color: rgba(245, 240, 232, 0.72);
}

:global(.profile-option-dropdown-panel) {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #0a0806;
  color: #f5f0e8;
}

:global(.profile-option-dropdown-panel .p-select-option) {
  color: #f5f0e8;
}

:global(.profile-option-dropdown-panel .p-select-option.p-focus),
:global(.profile-option-dropdown-panel .p-select-option:hover) {
  background: rgba(247, 198, 0, 0.14);
  color: #f7c600;
}

:global(.profile-option-dropdown-panel .p-select-filter) {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.1);
  color: #f5f0e8;
}
</style>
