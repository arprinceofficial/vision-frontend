<script setup lang="ts">
const { citizen_user } = citizenAuth();
import InputError from '../Input/Error.vue'

type CmsListResponse = {
    data?: {
        data?: Array<Record<string, any>>
    }
}

type CmsPreferencesResponse = {
    data?: Array<Record<string, any>>
}

// ── Static assets ──────────────────────────────────────────────────────
const defaultAvatar = '/assets/images/profile/avatar.png'

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref(defaultAvatar)
const photoBase64 = ref<string | null>(null)

const isFormLoading = ref(true)
const isEditMode = ref(false)

const formData = reactive({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    dob: '',
    nationality_id: '',
    bio: '',
    twitter: '',
    instagram: '',
    tiktok: '',
    additional_links: [] as Array<{ title: string; url: string }>,
    favourite_category: '',
    favourite_icon: '',
    item_preferences: '',
    is_agree: true,
})

// ── Pre-fill from citizen_user ─────────────────────────────────────────
const prefillForm = () => {
    const response = citizen_user.value
    if (!response?.data) return

    const user = response.data
    const info = user.user_info || {}
    formData.username = user.username || ''
    formData.first_name = info.first_name || ''
    formData.last_name = info.last_name || ''
    formData.email = user.email || ''
    formData.mobile = user.mobile || ''
    formData.nationality_id = info.nationality_id ? String(info.nationality_id) : ''
    formData.bio = info.bio || ''
    formData.twitter = info.twitter || ''
    formData.instagram = info.instagram || ''
    formData.tiktok = info.tiktok || ''
    // Normalize additional_links to objects with title and url
    formData.additional_links = []
    if (info.additional_links && Array.isArray(info.additional_links)) {
        formData.additional_links = info.additional_links.map((item: any) => {
            if (!item) return { title: '', url: '' }
            if (typeof item === 'string') return { title: item, url: item }
            // item is object
            const title = item.title || item.name || ''
            const url = item.url || item.link || item.href || ''
            return { title: title || url, url: url || title }
        })
    }
    formData.favourite_category = info.favourite_category ? String(info.favourite_category) : ''
    formData.favourite_icon = info.favourite_icon ? String(info.favourite_icon) : ''
    formData.item_preferences = info.item_preferences ? String(info.item_preferences) : ''

    // Parse DOB (YYYY-MM-DD)
    if (info.dob) {
        const parts = info.dob.split('-')
        if (parts.length === 3) {
            dobYear.value = parts[0]
            dobMonth.value = parts[1]
            dobDay.value = parts[2]
        }
    }

    // Set avatar from photo
    if (info.photo) {
        avatarPreview.value = info.photo
    }

    isFormLoading.value = false
}

onMounted(() => {
    prefillForm()
})

watch(() => citizen_user.value, () => {
    prefillForm()
})

// ── Static options (months / days / years) ─────────────────────────────
const months = [
    { label: 'Month', value: '' },
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
]

const days = computed(() => [
    { label: 'Day', value: '' },
    ...Array.from({ length: 31 }, (_, index) => {
        const value = String(index + 1).padStart(2, '0')
        return { label: value, value }
    }),
])

const years = computed(() => {
    const currentYear = new Date().getFullYear()
    return [
        { label: 'Year', value: '' },
        ...Array.from({ length: 100 }, (_, index) => {
            const year = String(currentYear - index)
            return { label: year, value: year }
        }),
    ]
})

// ── DOB local state ────────────────────────────────────────────────────
const dobMonth = ref('')
const dobDay = ref('')
const dobYear = ref('')

watch([dobYear, dobMonth, dobDay], ([y, m, d]) => {
    formData.dob = (y && m && d) ? `${y}-${m}-${d}` : ''
})

// ── API: Countries (v1/cms/countries) ──────────────────────────────────
const countriesCache = useState<any[] | null>('profile-countries-cache', () => null)

const { data: countriesData } = await useAsyncData<any[]>(
    'profile-countries',
    async () => {
        if (countriesCache.value?.length) return countriesCache.value
        try {
            const response = await $fetchCMS<CmsListResponse>('v1/cms/countries', { method: 'POST' })
            const payload = response?.data?.data ?? [];
            countriesCache.value = payload
            return payload
        } catch (error) {
            console.error('Failed to load countries:', error)
            return []
        }
    },
    { default: () => countriesCache.value ?? [] }
)

const countries = computed(() => [
    { en_short_name: 'Enter your country / location', id: '' },
    ...(countriesData.value ?? []),
])

// ── API: Favourite Category (v1/cms/icon-categories) ───────────────────
const categoriesCache = useState<any[] | null>('profile-categories-cache', () => null)

const { data: categoriesData } = await useAsyncData<any[]>(
    'profile-favourite-categories',
    async () => {
        if (categoriesCache.value?.length) return categoriesCache.value
        try {
            const response = await $fetchCMS<CmsListResponse>('v1/cms/icon-categories', { method: 'POST' })
            const payload = response?.data?.data ?? []
            categoriesCache.value = payload
            return payload
        } catch (error) {
            console.error('Failed to load icon categories:', error)
            return []
        }
    },
    { default: () => categoriesCache.value ?? [] }
)

const favouriteCategories = computed(() => [
    { title: 'Enter your favourite category', id: '' },
    ...(categoriesData.value ?? [])
])

// ── API: Favourite Icon (v1/cms/icons) ─────────────────────────────────
const iconsCache = useState<any[] | null>('profile-icons-cache', () => null)

const { data: iconsData } = await useAsyncData<any[]>(
    'profile-favourite-icons',
    async () => {
        if (iconsCache.value?.length) return iconsCache.value
        try {
            const response = await $fetchCMS<CmsListResponse>('v1/cms/icons', { method: 'POST' })
            const payload = response?.data?.data ?? [];
            iconsCache.value = payload
            return payload
        } catch (error) {
            console.error('Failed to load icons:', error)
            return []
        }
    },
    { default: () => iconsCache.value ?? [] }
)

const favourite_icons = computed(() => [
    { name: 'Enter your favourite icon', id: '' },
    ...(iconsData.value ?? [])
])

// ── API: Item Preferences (v1/cms/icon-items) ──────────────────────────
const itemPrefsCache = useState<any[] | null>('profile-item-prefs-cache', () => null)

const { data: itemPrefsData } = await useAsyncData<any[]>(
    'profile-item-preferences',
    async () => {
        if (itemPrefsCache.value?.length) return itemPrefsCache.value
        try {
            const response = await $fetchCMS<CmsPreferencesResponse>('v1/cms/icon-items', { method: 'POST' })
            const payload = response?.data ?? [];
            itemPrefsCache.value = payload
            return payload
        } catch (error) {
            console.error('Failed to load item preferences:', error)
            return []
        }
    },
    { default: () => itemPrefsCache.value ?? [] }
)

const item_preferencess = computed(() => [
    { name: 'Enter your item preference', id: '' },
    ...(itemPrefsData.value ?? [])
])

// ── Form helpers ───────────────────────────────────────────────────────
const openFilePicker = () => {
    fileInput.value?.click()
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const updateProfilePhoto = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    avatarPreview.value = URL.createObjectURL(file)
    photoBase64.value = await fileToBase64(file)
}

const addMoreLink = () => {
    formData.additional_links.push({ title: '', url: '' })
}

const removeMoreLink = (index: number) => {
    formData.additional_links.splice(index, 1)
}

// ── Validation & Submit (same pattern as AddEdit) ──────────────────────
const validations_errors = ref<Record<string, string>>({})
const skip_validations = ref([
    'bio',
    'twitter',
    'instagram',
    'tiktok',
    'additional_links',
    'is_agree',
    '',
    '',
])

const isLoading = ref(false)
const response_modal = ref<Record<string, any>>({})

const submitForm = async () => {
    validations_errors.value = {}
    const errors = Object.keys(formData).filter(
        item => !formData[item as keyof typeof formData] && !skip_validations.value.includes(item)
    )
    console.log('Validation errors:', errors) // Debug log for validation errors
    if (errors.length > 0) {
        errors.forEach(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`
        })
        return
    }

    // Validate additional_links entries: each must have title and url when present
    if (formData.additional_links && formData.additional_links.length) {
        for (let i = 0; i < formData.additional_links.length; i++) {
            const entry = formData.additional_links[i]
            if (!entry || !entry.title || !entry.url) {
                if (!entry || !entry.title) {
                    validations_errors.value[`additional_links.${i}.title`] = 'Title is required'
                }
                if (!entry || !entry.url) {
                    validations_errors.value[`additional_links.${i}.url`] = 'URL is required'
                }
            }
        }

        // If we added any additional_links validation errors, abort
        const hasALinksErrors = Object.keys(validations_errors.value).some(k => k.startsWith('additional_links'))
        if (hasALinksErrors) return
    }

    try {
        isLoading.value = true
        const userId = citizen_user.value?.data?.user_info?.id || citizen_user.value?.data?.id
        const submitData: Record<string, any> = { ...formData }

        // Attach base64 photo if changed
        if (photoBase64.value) {
            submitData.photo = photoBase64.value
        }

        const getData: any = await $fetchCitizen(`v1/customer/account-details/${userId}`, {
            method: 'POST',
            body: submitData,
        })
        response_modal.value = getData
    } catch (e: any) {
        if (e.response?.status === 404 || e.response?.status === 422) {
            const errorsSource = e.response?._data?.data || e.response?._data?.errors
            if (errorsSource) {
                for (const key in errorsSource) {
                    if (errorsSource.hasOwnProperty(key)) {
                        validations_errors.value[key] = errorsSource[key][0]
                    }
                }
            }
        } else if (!e.response?.status) {
            response_modal.value = {
                status: false,
                message: 'Something went wrong. Please try again later.',
            }
        } else {
            response_modal.value = {
                status: e.response._data.status,
                message: e.response._data.message,
            }
        }
    } finally {
        isLoading.value = false
    }
}

onBeforeUnmount(() => {
    if (avatarPreview.value?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview.value)
    }
})
</script>

<template>
    <section class="bg-black pb-[88px]">
        <!-- <pre>{{ citizen_user }}</pre> -->
        <div class="mx-auto w-full max-w-[1512px] px-4 pt-[36px] sm:px-6 sm:pt-[56px] lg:px-[74px] lg:pt-[98px]">
            <div
                class="overflow-hidden rounded-[24px] bg-white px-4 shadow-[0_2px_24px_rgba(0,0,0,0.25)] sm:px-8 lg:px-12">

                <!-- ── Skeleton Loader ── -->
                <div v-if="isFormLoading" class="mx-auto w-full max-w-[1268px] animate-pulse">
                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <div class="mx-auto h-10 w-64 rounded bg-gray-200" />
                    </div>
                    <div class="flex flex-col items-center py-8 lg:py-[72px]">
                        <div class="h-[160px] w-[160px] rounded-full bg-gray-200 lg:h-[200px] lg:w-[200px]" />
                        <div class="mt-8 h-12 w-56 rounded-full bg-gray-200" />
                        <div class="mt-12 w-full max-w-[532px]">
                            <div class="mx-auto mb-4 h-5 w-24 rounded bg-gray-200" />
                            <div class="h-[50px] w-full rounded-[8px] bg-gray-200" />
                        </div>
                    </div>
                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <div class="mx-auto h-10 w-52 rounded bg-gray-200" />
                    </div>
                    <div class="grid grid-cols-1 gap-x-6 gap-y-8 py-8 md:grid-cols-2 lg:py-[60px]">
                        <div v-for="i in 6" :key="i">
                            <div class="mb-4 h-5 w-32 rounded bg-gray-200" />
                            <div class="h-[50px] w-full rounded-[8px] bg-gray-200" />
                        </div>
                        <div class="md:col-span-2">
                            <div class="mb-4 h-5 w-16 rounded bg-gray-200" />
                            <div class="h-[148px] w-full rounded-[8px] bg-gray-200" />
                        </div>
                    </div>
                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <div class="mx-auto h-10 w-48 rounded bg-gray-200" />
                    </div>
                    <div class="grid grid-cols-1 gap-x-4 gap-y-8 py-8 xl:grid-cols-4 lg:py-[60px]">
                        <div v-for="i in 4" :key="i">
                            <div class="mb-4 h-5 w-24 rounded bg-gray-200" />
                            <div class="h-[50px] w-full rounded-[8px] bg-gray-200" />
                        </div>
                    </div>
                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <div class="mx-auto h-10 w-36 rounded bg-gray-200" />
                    </div>
                    <div class="grid grid-cols-1 gap-x-4 gap-y-8 py-8 xl:grid-cols-3 lg:py-[60px]">
                        <div v-for="i in 3" :key="i">
                            <div class="mb-4 h-5 w-36 rounded bg-gray-200" />
                            <div class="h-[50px] w-full rounded-[8px] bg-gray-200" />
                        </div>
                    </div>
                    <div class="flex flex-col items-center gap-6 pb-12 pt-6 lg:pb-[98px]">
                        <div class="h-6 w-72 rounded bg-gray-200" />
                        <div class="h-12 w-[280px] rounded-full bg-gray-200" />
                    </div>
                </div>

                <!-- ── Actual Form ── -->
                <form v-else @submit.prevent="submitForm" class="mx-auto w-full max-w-[1268px]">
                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <h2
                            class="[font-family:var(--font-family-Headings)] text-[34px] uppercase leading-[0.84] tracking-[-0.03em] text-[#111215] sm:text-[40px] lg:text-[48px]">
                            Profile Photo
                        </h2>
                    </div>

                    <div class="flex flex-col items-center py-8 lg:py-[72px]">
                        <div
                            class="h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-[#444955] lg:h-[200px] lg:w-[200px]">
                            <img :src="avatarPreview" alt="Profile preview" class="h-full w-full object-cover" />
                        </div>

                        <button v-if="isEditMode" type="button"
                            class="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(155deg,rgba(255,255,255,0)_29.076%,rgba(255,255,255,0.1)_70.924%),linear-gradient(90deg,#dadbdd_0%,#dadbdd_100%)] px-8 text-[16px] leading-5 text-black shadow-[0_4px_20px_rgba(0,0,0,0.12)] lg:text-[24px] lg:leading-[30px]"
                            @click="openFilePicker">
                            Upload profile photo
                        </button>

                        <input ref="fileInput" type="file" accept="image/*" class="hidden"
                            @change="updateProfilePhoto" />

                        <div class="mt-12 w-full max-w-[532px]">
                            <label class="mb-4 block text-center text-[16px] leading-5 text-[#111215]">
                                Username<span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.username" type="text" placeholder="Enter your user name"
                                :disabled="!isEditMode"
                                class="h-[50px] w-full rounded-[8px] border border-[#d0d1d4] bg-white px-4 text-center text-[16px] leading-5 text-[#444955] outline-none transition placeholder:text-[#a1a4aa] focus:border-[#977b13] disabled:bg-gray-50 disabled:cursor-not-allowed"
                                :class="validations_errors.username ? 'border-[#f44336!important]' : ''"
                                @focus="validations_errors.username = ''" />
                        </div>
                    </div>

                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <h2
                            class="[font-family:var(--font-family-Headings)] text-[34px] uppercase leading-[0.84] tracking-[-0.03em] text-[#111215] sm:text-[40px] lg:text-[48px]">
                            Profile Details
                        </h2>
                        <button type="button"
                            class="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-2 text-[14px] font-medium transition"
                            :class="isEditMode ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-[linear-gradient(147deg,#977b13_28.673%,#d4af37_71.327%)] text-black shadow-[0_2px_12px_rgba(0,0,0,0.15)]'"
                            @click="isEditMode = !isEditMode">
                            <i :class="isEditMode ? 'pi pi-times' : 'pi pi-pencil'" class="text-[12px]" />
                            {{ isEditMode ? 'Cancel Edit' : 'Edit Profile' }}
                        </button>
                    </div>

                    <div class="grid grid-cols-1 gap-x-6 gap-y-8 py-8 md:grid-cols-2 lg:py-[60px]">
                        <div>
                            <label class="mb-4 block text-[16px] leading-5 text-[#111215]">First Name<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.first_name" type="text" placeholder="Enter your first name"
                                :disabled="!isEditMode"
                                class="profile-input disabled:bg-gray-50 disabled:cursor-not-allowed"
                                :class="validations_errors.first_name ? 'border-[#f44336!important]' : ''"
                                @focus="validations_errors.first_name = ''" />
                            <InputError v-if="validations_errors.first_name" :message="validations_errors.first_name"
                                text_size="text-sm" />
                        </div>
                        <div>
                            <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Last Name<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.last_name" type="text" placeholder="Enter your last name"
                                :disabled="!isEditMode"
                                class="profile-input disabled:bg-gray-50 disabled:cursor-not-allowed"
                                :class="validations_errors.last_name ? 'border-[#f44336!important]' : ''"
                                @focus="validations_errors.last_name = ''" />
                            <InputError v-if="validations_errors.last_name" :message="validations_errors.last_name"
                                text_size="text-sm" />
                        </div>

                        <div>
                            <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Email Address
                                <span v-if="citizen_user?.data?.email_verified_at"
                                    class="ml-1 text-xs text-green-600">(Verified)</span>
                            </label>
                            <input v-model="formData.email" type="email" placeholder="mail@gmail.com" disabled
                                class="profile-input disabled:bg-gray-50 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                            <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Phone Number<span
                                    class="text-red-500">*</span></label>
                            <div class="flex h-[50px] items-center rounded-[8px] border border-[#d0d1d4] px-4"
                                :class="validations_errors.mobile ? 'border-[#f44336!important]' : ''">
                                <!-- <div class="flex h-full items-center gap-4 pr-4">
                                    <img :src="phoneFlag" alt="" class="h-6 w-6 rounded-sm object-cover" />
                                    <span class="h-full w-px bg-[#d0d1d4]" />
                                </div> -->
                                <input v-model="formData.mobile" type="tel" placeholder="Enter your telephone number"
                                    :disabled="!isEditMode"
                                    class="h-full w-full border-0 bg-white text-[16px] leading-5 text-[#444955] outline-none placeholder:text-[#a1a4aa] disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    :class="validations_errors.mobile ? 'border-[#f44336!important]' : ''"
                                    @focus="validations_errors.mobile = ''" />
                            </div>
                            <InputError v-if="validations_errors.mobile" :message="validations_errors.mobile"
                                text_size="text-sm" />
                        </div>

                        <div>
                            <label class="mb-4 block text-[16px] leading-5 text-[#111215]">DOB (Date of birth)</label>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="profile-select-wrap">
                                    <select v-model="dobMonth"
                                        class="profile-select disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        :disabled="!isEditMode"
                                        :class="validations_errors.dob ? 'border-[#f44336!important]' : ''"
                                        @focus="validations_errors.dob = ''">
                                        <option v-for="option in months" :key="option.value || option.label"
                                            :value="option.value" :disabled="option.value === ''">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                    <i class="pi pi-chevron-down profile-chevron" />
                                </div>
                                <div class="profile-select-wrap">
                                    <select v-model="dobDay"
                                        class="profile-select disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        :disabled="!isEditMode"
                                        :class="validations_errors.dob ? 'border-[#f44336!important]' : ''"
                                        @focus="validations_errors.dob = ''">
                                        <option v-for="option in days" :key="option.value || option.label"
                                            :value="option.value" :disabled="option.value === ''">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                    <i class="pi pi-chevron-down profile-chevron" />
                                </div>
                                <div class="profile-select-wrap">
                                    <select v-model="dobYear"
                                        class="profile-select disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        :disabled="!isEditMode"
                                        :class="validations_errors.dob ? 'border-[#f44336!important]' : ''"
                                        @focus="validations_errors.dob = ''">
                                        <option v-for="option in years" :key="option.value || option.label"
                                            :value="option.value" :disabled="option.value === ''">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                    <i class="pi pi-chevron-down profile-chevron" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Country / Location<span
                                    class="text-red-500">*</span></label>
                            <div class="profile-select-wrap">
                                <select v-model="formData.nationality_id"
                                    class="profile-select disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    :disabled="!isEditMode"
                                    :class="validations_errors.nationality_id ? 'border-[#f44336!important]' : ''"
                                    @focus="validations_errors.nationality_id = ''">
                                    <option v-for="option in countries" :key="option.id" :value="option.id"
                                        :disabled="option.id === ''">
                                        {{ option.en_short_name }}
                                    </option>
                                </select>
                                <i class="pi pi-chevron-down profile-chevron" />
                            </div>
                            <InputError v-if="validations_errors.nationality_id"
                                :message="validations_errors.nationality_id" text_size="text-sm" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Bio</label>
                            <textarea v-model="formData.bio" rows="6" placeholder="Enter your bio here"
                                :disabled="!isEditMode"
                                class="min-h-[148px] w-full rounded-[8px] border border-[#d0d1d4] bg-white px-4 py-6 text-[16px] leading-5 text-[#444955] outline-none transition placeholder:text-[#a1a4aa] focus:border-[#977b13] disabled:bg-gray-50 disabled:cursor-not-allowed"
                                :class="validations_errors.bio ? 'border-[#f44336!important]' : ''"
                                @focus="validations_errors.bio = ''" />
                        </div>
                    </div>

                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <h2
                            class="[font-family:var(--font-family-Headings)] text-[34px] uppercase leading-[0.84] tracking-[-0.03em] text-[#111215] sm:text-[40px] lg:text-[48px]">
                            Social Details
                        </h2>
                    </div>

                    <div class="py-8 lg:py-[60px]">
                        <div class="grid grid-cols-1 gap-x-4 gap-y-8 xl:grid-cols-4">
                            <div>
                                <label class="mb-4 block text-[16px] leading-5 text-[#111215]">X</label>
                                <input v-model="formData.twitter" type="text" placeholder="https://www.x.com/"
                                    :disabled="!isEditMode"
                                    class="profile-input disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    :class="validations_errors.twitter ? 'border-[#f44336!important]' : ''"
                                    @focus="validations_errors.twitter = ''" />
                            </div>
                            <div>
                                <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Instagram</label>
                                <input v-model="formData.instagram" type="text" :disabled="!isEditMode"
                                    placeholder="https://www.instagram.com/"
                                    class="profile-input disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    :class="validations_errors.instagram ? 'border-[#f44336!important]' : ''"
                                    @focus="validations_errors.instagram = ''" />
                            </div>
                            <div>
                                <label class="mb-4 block text-[16px] leading-5 text-[#111215]">TikTok</label>
                                <input v-model="formData.tiktok" type="text" placeholder="https://www.tiktok.com/"
                                    :disabled="!isEditMode"
                                    class="profile-input disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    :class="validations_errors.tiktok ? 'border-[#f44336!important]' : ''"
                                    @focus="validations_errors.tiktok = ''" />
                            </div>
                            <div>
                                <label class="mb-4 block text-[16px] leading-5 text-[#111215] opacity-0">Add
                                    more</label>
                                <button type="button"
                                    class="flex h-[50px] w-full items-center gap-4 rounded-[8px] border border-[#d0d1d4] px-4 text-left text-[16px] leading-5 text-[#444955] transition hover:border-[#977b13]"
                                    @click="addMoreLink">
                                    <svg class="h-6 w-6 text-[#444955]" viewBox="0 0 24 24" fill="none"
                                        aria-hidden="true">
                                        <path
                                            d="M8 3.75H16C18.3472 3.75 20.25 5.65279 20.25 8V16C20.25 18.3472 18.3472 20.25 16 20.25H8C5.65279 20.25 3.75 18.3472 3.75 16V8C3.75 5.65279 5.65279 3.75 8 3.75Z"
                                            stroke="currentColor" stroke-width="1.5" />
                                        <path d="M12 8V16" stroke="currentColor" stroke-width="1.5"
                                            stroke-linecap="round" />
                                        <path d="M8 12H16" stroke="currentColor" stroke-width="1.5"
                                            stroke-linecap="round" />
                                    </svg>
                                    <span>Add more link</span>
                                </button>
                            </div>
                        </div>

                        <div v-if="formData.additional_links.length" class="mt-6 grid grid-cols-1 gap-4">
                            <div v-for="(link, index) in formData.additional_links" :key="`extra-link-${index}`"
                                class="flex w-full flex-col gap-2">
                                <div class="flex w-full items-center gap-3">
                                    <input v-model="link.title" type="text" placeholder="Title"
                                        class="profile-input"
                                        @focus="validations_errors['additional_links.'+index+'.title'] = ''" />

                                    <input v-model="link.url" type="url" placeholder="https://example.com/"
                                        class="profile-input"
                                        @focus="validations_errors['additional_links.'+index+'.url'] = ''" />

                                    <button v-if="isEditMode" type="button"
                                        class="h-[50px] rounded-[8px] border border-[#d0d1d4] px-4 text-[14px] leading-5 text-[#444955] transition hover:border-[#977b13]"
                                        @click="removeMoreLink(index)">
                                        Remove
                                    </button>
                                </div>

                                <div class="flex w-full items-start gap-4">
                                    <InputError v-if="validations_errors['additional_links.'+index+'.title']"
                                        :message="validations_errors['additional_links.'+index+'.title']" text_size="text-sm" />
                                    <InputError v-if="validations_errors['additional_links.'+index+'.url']"
                                        :message="validations_errors['additional_links.'+index+'.url']" text_size="text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-b border-[#dadbdd] py-8 text-center lg:py-[32px]">
                        <h2
                            class="[font-family:var(--font-family-Headings)] text-[34px] uppercase leading-[0.84] tracking-[-0.03em] text-[#111215] sm:text-[40px] lg:text-[48px]">
                            About You
                        </h2>
                    </div>

                    <div class="py-8 lg:py-[60px]">
                        <div class="grid grid-cols-1 gap-x-4 gap-y-8 xl:grid-cols-3">
                            <div>
                                <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Favourite Category<span
                                        class="text-red-500">*</span></label>
                                <div class="profile-select-wrap">
                                    <select v-model="formData.favourite_category"
                                        class="profile-select disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        :disabled="!isEditMode"
                                        :class="validations_errors.favourite_category ? 'border-[#f44336!important]' : ''"
                                        @focus="validations_errors.favourite_category = ''">
                                        <option v-for="option in favouriteCategories" :key="option.id"
                                            :value="option.id" :disabled="option.id === ''">
                                            {{ option.title }}
                                        </option>
                                    </select>
                                    <i class="pi pi-chevron-down profile-chevron" />
                                </div>
                            </div>
                            <div>
                                <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Favourite Icon<span
                                        class="text-red-500">*</span></label>
                                <div class="profile-select-wrap">
                                    <select v-model="formData.favourite_icon"
                                        class="profile-select disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        :disabled="!isEditMode"
                                        :class="validations_errors.favourite_icon ? 'border-[#f44336!important]' : ''"
                                        @focus="validations_errors.favourite_icon = ''">
                                        <option v-for="option in favourite_icons" :key="option.id" :value="option.id"
                                            :disabled="option.id === ''">
                                            {{ option.name }}
                                        </option>
                                    </select>
                                    <i class="pi pi-chevron-down profile-chevron" />
                                </div>
                            </div>
                            <div>
                                <label class="mb-4 block text-[16px] leading-5 text-[#111215]">Item Preferences<span
                                        class="text-red-500">*</span></label>
                                <div class="profile-select-wrap">
                                    <select v-model="formData.item_preferences"
                                        class="profile-select disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        :disabled="!isEditMode"
                                        :class="validations_errors.item_preferences ? 'border-[#f44336!important]' : ''"
                                        @focus="validations_errors.item_preferences = ''">
                                        <option v-for="option in item_preferencess" :key="option.id" :value="option.id"
                                            :disabled="option.id === ''">
                                            {{ option.name }}
                                        </option>
                                    </select>
                                    <i class="pi pi-chevron-down profile-chevron" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="isEditMode" class="flex flex-col items-center gap-6 pb-12 pt-6 lg:pb-[98px]">
                        <label
                            class="flex cursor-pointer items-center gap-4 text-center text-[14px] leading-5 text-[#444955] sm:text-[16px]">
                            <span
                                class="relative flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#444955]">
                                <input v-model="formData.is_agree" type="checkbox" class="peer sr-only" />
                                <svg class="h-4 w-4 text-[#444955] opacity-0 transition peer-checked:opacity-100"
                                    viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M6 12.5L10 16.5L18 8.5" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </span>
                            <span>
                                I agree to the
                                <span class="font-semibold"> Terms of Service </span>
                                and
                                <span class="font-semibold"> Privacy Policy</span>
                            </span>
                        </label>

                        <button v-if="!isLoading" type="submit"
                            class="inline-flex h-12 min-w-[220px] items-center justify-center rounded-full bg-[linear-gradient(147deg,#977b13_28.673%,#d4af37_71.327%)] px-8 text-[18px] font-medium leading-[30px] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] lg:min-w-[280px] lg:text-[24px]">
                            Complete Profile
                        </button>
                        <button v-else type="button" disabled
                            class="inline-flex h-12 min-w-[220px] items-center justify-center rounded-full bg-gray-300 px-8 text-[18px] font-medium leading-[30px] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] lg:min-w-[280px] lg:text-[24px] cursor-not-allowed">
                            <svg class="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <LazyResponseModal :response_modal="response_modal" />
    </section>
</template>

<style scoped>
.profile-input {
    width: 100%;
    height: 50px;
    border: 1px solid #d0d1d4;
    border-radius: 8px;
    background: #fff;
    padding: 0 16px;
    color: #444955;
    font-size: 16px;
    line-height: 20px;
    outline: none;
    transition: border-color 0.2s ease;
}

.profile-input::placeholder {
    color: #a1a4aa;
}

.profile-input:focus,
.profile-select:focus {
    border-color: #977b13;
}

.profile-select-wrap {
    position: relative;
}

.profile-select {
    width: 100%;
    height: 50px;
    appearance: none;
    border: 1px solid #d0d1d4;
    border-radius: 8px;
    background: #fff;
    padding: 0 40px 0 16px;
    color: #444955;
    font-size: 16px;
    line-height: 20px;
    outline: none;
    transition: border-color 0.2s ease;
}

.profile-chevron {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    pointer-events: none;
    color: #444955;
    font-size: 12px;
}
</style>
