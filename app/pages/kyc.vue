<script setup lang="ts">
definePageMeta({
    layout: 'portal',
    middleware: ['auth-citizen']
})

useHead({
    title: 'KYC Identity Verification | Vision148'
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'
type SelectOption = {
    id: number | string
    label: string
    value: string
}

const citizen_user = citizenUser()
const { submitOnboardingKyc, skipOnboardingKyc } = citizenAuth()

const { data: gendersResponse, error: gendersError } = await useAsyncData('kyc-genders', () => (
    $fetchCMS('v1/cms/genders', {
        method: 'POST',
    })
))

const { data: identificationDocumentsResponse, error: identificationDocumentsError } = await useAsyncData(
    'kyc-identification-documents',
    () => $fetchCMS('v1/cms/identification-documents', {
        method: 'POST',
    })
)

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
const documentFile = ref<File | null>(null)
const imagePreviewUrl = ref('')
const isImagePreviewOpen = ref(false)
const errors = ref<Set<string>>(new Set())
const isSubmitting = ref(false)
const isSkipping = ref(false)

const getResponseItems = (response: any) => (
    Array.isArray(response?.data?.data) ? response.data.data : []
)

const genderOptions = computed<SelectOption[]>(() => (
    getResponseItems(gendersResponse.value)
        .filter((gender: any) => Number(gender?.status ?? 1) === 1)
        .map((gender: any) => ({
            id: gender.id,
            label: gender.gender_name,
            value: gender.gender_name,
        }))
        .filter((gender: SelectOption) => gender.id && gender.label && gender.value)
))

const identificationDocumentOptions = computed<SelectOption[]>(() => (
    getResponseItems(identificationDocumentsResponse.value)
        .map((document: any) => ({
            id: document.id,
            label: document.name,
            value: document.name,
        }))
        .filter((document: SelectOption) => document.id && document.label && document.value)
))

const fieldDataNotice = computed(() => {
    if (gendersError.value || identificationDocumentsError.value) {
        return {
            title: 'Unable To Load Form Options',
            message: 'Gender or identification document options could not be loaded. Please refresh and try again.',
            tone: 'error' as NoticeTone,
        }
    }

    if (!genderOptions.value.length || !identificationDocumentOptions.value.length) {
        return {
            title: 'Form Options Unavailable',
            message: 'Gender or identification document options are not available yet. Please refresh and try again.',
            tone: 'warning' as NoticeTone,
        }
    }

    return null
})

const activeNotice = computed(() => notice.value || fieldDataNotice.value)

const hasError = (key: string) => errors.value.has(key)

const getErrorMessage = (error: any, fallback: string) => (
    error?.response?._data?.message ||
    error?.data?.message ||
    fallback
)

const getFileDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
})

const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
const allowedImageExtensionPattern = /\.(jpe?g|png|webp)$/i
const maxImageFileSizeBytes = 2 * 1024 * 1024

const isImageFile = (file: File) => (
    allowedImageMimeTypes.includes(file.type) || allowedImageExtensionPattern.test(file.name)
)

const canPreviewAttachment = computed(() => Boolean(imagePreviewUrl.value && documentFile.value))

const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB'

    const units = ['B', 'KB', 'MB', 'GB']
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    const size = bytes / (1024 ** unitIndex)

    return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const selectedFileMeta = computed(() => {
    if (!documentFile.value) return ''

    return `Image - ${formatFileSize(documentFile.value.size)}`
})

const handleFile = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const selectedFile = input.files?.[0] || null

    documentFile.value = selectedFile
    fileName.value = selectedFile?.name || ''
    imagePreviewUrl.value = ''
    isImagePreviewOpen.value = false
    errors.value.delete('documentFile')

    if (!selectedFile) return

    if (!isImageFile(selectedFile)) {
        input.value = ''
        documentFile.value = null
        fileName.value = ''
        errors.value.add('documentFile')
        notice.value = {
            title: 'Unsupported File Type',
            message: 'Please upload a JPG, JPEG, PNG, or WEBP image.',
            tone: 'warning'
        }
        return
    }

    if (selectedFile.size > maxImageFileSizeBytes) {
        input.value = ''
        documentFile.value = null
        fileName.value = ''
        errors.value.add('documentFile')
        notice.value = {
            title: 'File Too Large',
            message: 'Please upload an image up to 2 MB.',
            tone: 'warning'
        }
        return
    }

    try {
        const previewUrl = await getFileDataUrl(selectedFile)
        if (documentFile.value === selectedFile) {
            imagePreviewUrl.value = previewUrl
        }
    } catch {
        notice.value = {
            title: 'Unable To Preview Image',
            message: 'The selected image could not be previewed, but you can choose another file.',
            tone: 'warning'
        }
    }
}

const openImagePreview = () => {
    if (!canPreviewAttachment.value) return
    isImagePreviewOpen.value = true
}

const closeImagePreview = () => {
    isImagePreviewOpen.value = false
}

const refreshCitizenUser = async () => {
    const refreshedUser = await fetchCitizenCurrentUser()
    if (refreshedUser) {
        citizen_user.value = refreshedUser
    }
}

const navigateAfterKyc = () => {
    window.setTimeout(() => {
        void navigateTo('/profile')
    }, 900)
}

const isSuccessfulResponse = (response: any) => response?.status === true || response?.success === true

const getKycPayload = async () => ({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    dob: form.dob.trim(),
    gender: form.gender,
    country: form.country,
    buildingNo: form.buildingNo.trim(),
    addressLine: form.addressLine.trim(),
    town: form.town.trim(),
    postcode: form.postcode.trim(),
    documentType: form.documentType,
    attachment: documentFile.value ? imagePreviewUrl.value || await getFileDataUrl(documentFile.value) : '',
})

const skipKyc = async () => {
    if (isSkipping.value || isSubmitting.value) return

    isSkipping.value = true
    notice.value = null

    try {
        const response: any = await skipOnboardingKyc()

        if (!isSuccessfulResponse(response)) {
            notice.value = {
                title: 'Unable To Skip KYC',
                message: response?.message || 'Please try skipping KYC again.',
                tone: 'error'
            }
            return
        }

        await refreshCitizenUser()
        notice.value = {
            title: 'KYC Skipped',
            message: response?.message || 'Verification has been skipped for now.',
            tone: 'warning'
        }
        navigateAfterKyc()
    } catch (error: any) {
        notice.value = {
            title: 'Unable To Skip KYC',
            message: getErrorMessage(error, 'Please try skipping KYC again.'),
            tone: 'error'
        }
    } finally {
        isSkipping.value = false
    }
}

const submitKyc = async () => {
    if (isSubmitting.value || isSkipping.value) return

    const nextErrors = new Set<string>()

    Object.entries(form).forEach(([key, value]) => {
        if (!String(value).trim()) {
            nextErrors.add(key)
        }
    })

    if (!fileName.value || !documentFile.value || documentFile.value.size > maxImageFileSizeBytes) {
        nextErrors.add('documentFile')
    }

    errors.value = nextErrors

    if (nextErrors.size) {
        notice.value = {
            title: 'Form Incomplete',
            message: 'Please fill out all fields and attach a JPG, JPEG, PNG, or WEBP image up to 2 MB.',
            tone: 'warning'
        }
        return
    }

    isSubmitting.value = true
    notice.value = null

    try {
        const response: any = await submitOnboardingKyc(await getKycPayload())

        if (!isSuccessfulResponse(response)) {
            notice.value = {
                title: 'Unable To Submit',
                message: response?.message || 'Please try submitting your KYC again.',
                tone: 'error'
            }
            return
        }

        await refreshCitizenUser()
        notice.value = {
            title: 'Identity Verification Submitted',
            message: response?.message || 'Your KYC information has been submitted successfully.',
            tone: 'success'
        }
        navigateAfterKyc()
    } catch (error: any) {
        notice.value = {
            title: 'Unable To Submit',
            message: getErrorMessage(error, 'Please try submitting your KYC again.'),
            tone: 'error'
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <CitizenOnboardingStepCard eyebrow="Onboarding Step 3" title="Identity Verification (KYC)"
        description="We are required by UK anti-money laundering laws to verify all members. Processed securely via Smart Search."
        max-width="max-w-4xl">
        <ClientOnly>
            <form class="space-y-6" @submit.prevent="submitKyc">
                <CitizenSharedActionNotice v-if="activeNotice" :title="activeNotice.title"
                    :message="activeNotice.message" :tone="activeNotice.tone" />

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="space-y-1">
                        <label for="firstName"
                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">
                            First Name
                        </label>
                        <input id="firstName" v-model="form.firstName" type="text" placeholder="John"
                            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('firstName') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                    </div>

                    <div class="space-y-1">
                        <label for="lastName" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">
                            Last Name
                        </label>
                        <input id="lastName" v-model="form.lastName" type="text" placeholder="Doe"
                            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('lastName') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                    </div>

                    <div class="space-y-1">
                        <label for="dob" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">
                            Date of Birth
                        </label>
                        <input id="dob" v-model="form.dob" type="date"
                            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('dob') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                    </div>

                    <div class="space-y-1">
                        <label for="gender"
                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Gender</label>
                        <select id="gender" v-model="form.gender"
                            class="w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :disabled="isSubmitting || isSkipping || !genderOptions.length"
                            :class="hasError('gender') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                            <option value="">Select Gender</option>
                            <option v-for="gender in genderOptions" :key="gender.id" :value="gender.value">
                                {{ gender.label }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-1 md:col-span-2">
                        <label for="country"
                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Country of
                            Residence</label>
                        <select id="country" v-model="form.country"
                            class="w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('country') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                            <option value="">Select a Country</option>
                            <option value="GBR">United Kingdom (GBR)</option>
                            <option value="USA">United States of America (USA)</option>
                            <option value="NLD">Netherlands (NLD)</option>
                            <option value="DEU">Germany (DEU)</option>
                        </select>
                    </div>

                    <div class="space-y-1">
                        <label for="buildingNo"
                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">
                            Building Name or Number
                        </label>
                        <input id="buildingNo" v-model="form.buildingNo" type="text"
                            placeholder="e.g. Flat 3A or House 12"
                            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('buildingNo') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                    </div>

                    <div class="space-y-1">
                        <label for="addressLine"
                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">
                            Address Line
                        </label>
                        <input id="addressLine" v-model="form.addressLine" type="text"
                            placeholder="e.g. Northgate Business Centre"
                            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('addressLine') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                    </div>

                    <div class="space-y-1">
                        <label for="town" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">
                            Town / City
                        </label>
                        <input id="town" v-model="form.town" type="text" placeholder="e.g. Newark"
                            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('town') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                    </div>

                    <div class="space-y-1">
                        <label for="postcode" class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">
                            Postcode
                        </label>
                        <input id="postcode" v-model="form.postcode" type="text" placeholder="e.g. NG24 1EZ"
                            class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :class="hasError('postcode') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                    </div>

                    <div class="space-y-1">
                        <label for="documentType"
                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Identification
                            Document</label>
                        <select id="documentType" v-model="form.documentType"
                            class="w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-tccNavy"
                            :disabled="isSubmitting || isSkipping || !identificationDocumentOptions.length"
                            :class="hasError('documentType') ? 'border-red-400 bg-red-50' : 'border-tccBorder'">
                            <option value="">Select ID Type</option>
                            <option v-for="document in identificationDocumentOptions" :key="document.id"
                                :value="document.value">
                                {{ document.label }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-1">
                        <label for="documentFile"
                            class="block text-xs font-semibold uppercase tracking-wider text-tccNavy">Upload ID
                            Image</label>
                        <input id="documentFile" type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            class="w-full rounded-lg border px-4 py-2 text-xs file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-tccNavy file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-white hover:file:bg-tccDarkNavy"
                            :class="hasError('documentFile') ? 'border-red-400 bg-red-50' : 'border-tccBorder'"
                            @change="handleFile">
                        <p class="text-[11px] text-tccMutedGray">JPG, JPEG, PNG, or WEBP only. Max 2 MB.</p>
                        <div v-if="fileName" class="rounded-lg border border-tccBorder bg-white/[0.055] p-3 shadow-sm">
                            <div class="flex items-center gap-3">
                                <button v-if="canPreviewAttachment" type="button"
                                    class="group relative grid h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black"
                                    :aria-label="`Preview ${fileName}`" @click="openImagePreview">
                                    <img :src="imagePreviewUrl" :alt="fileName"
                                        class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105">
                                    <span
                                        class="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-tccGold opacity-0 transition-opacity group-hover:opacity-100">
                                        Preview
                                    </span>
                                </button>

                                <div v-else
                                    class="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/10">
                                    <i class="pi pi-file text-xl text-white/70" aria-hidden="true" />
                                </div>

                                <div class="min-w-0 flex-1">
                                    <p class="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                                        Selected file
                                    </p>
                                    <button v-if="canPreviewAttachment" type="button"
                                        class="mt-1 block max-w-full truncate text-left text-xs font-semibold text-tccGold underline-offset-2 transition-colors hover:text-tccLightGold hover:underline"
                                        :aria-label="`Preview ${fileName}`" @click="openImagePreview">
                                        {{ fileName }}
                                    </button>
                                    <p v-else class="mt-1 truncate text-xs font-semibold text-white/75">
                                        {{ fileName }}
                                    </p>
                                    <p class="mt-1 text-[11px] text-tccMutedGray">{{ selectedFileMeta }}</p>
                                </div>

                                <button v-if="canPreviewAttachment" type="button"
                                    class="hidden shrink-0 rounded-full border border-tccMutedGold px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-tccGold transition-colors hover:bg-tccGold hover:text-tccDarkNavy sm:inline-flex"
                                    @click="openImagePreview">
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg border border-tccBorder bg-tccLightBg p-4 text-xs leading-relaxed text-tccNavy">
                    <i class="pi pi-info-circle mr-1 text-[11px] text-tccGold" aria-hidden="true" />
                    <strong>Optional Waiver:</strong> You can complete this KYC now or choose to skip and finish it
                    within 2
                    weeks. Completed credentials enable faster SPV allocation approvals.
                </div>

                <div class="flex flex-col items-center gap-4 border-t border-tccBorder pt-4 sm:flex-row">
                    <button type="button"
                        class="w-full rounded-lg border border-tccBorder px-6 py-3 font-poppins text-xs font-bold uppercase tracking-wider text-tccNavy transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                        :disabled="isSubmitting || isSkipping" @click="skipKyc">
                        <i class="pi pi-forward mr-1 text-[10px]" aria-hidden="true" />
                        <span v-if="isSkipping">Skipping...</span>
                        <span v-else>Skip KYC for 2 weeks</span>
                    </button>
                    <button type="submit"
                        class="w-full rounded-lg bg-tccGold py-3.5 text-center font-poppins text-xs font-bold uppercase tracking-widest text-tccDarkNavy shadow transition-colors hover:bg-tccLightGold disabled:cursor-not-allowed disabled:opacity-70 sm:flex-grow"
                        :disabled="isSubmitting || isSkipping">
                        <span v-if="isSubmitting">Submitting KYC...</span>
                        <span v-else>Complete KYC Verification</span>
                    </button>
                </div>
            </form>

            <Teleport to="body">
                <Transition enter-active-class="transition-opacity duration-200 ease-out"
                    leave-active-class="transition-opacity duration-150 ease-in" enter-from-class="opacity-0"
                    leave-to-class="opacity-0">
                    <div v-if="isImagePreviewOpen && imagePreviewUrl"
                        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
                        @click.self="closeImagePreview">
                        <div
                            class="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/18 bg-tccLightBg shadow-2xl">
                            <div class="flex items-center justify-between gap-4 border-b border-white/12 px-4 py-3">
                                <p
                                    class="min-w-0 truncate text-xs font-semibold uppercase tracking-wider text-white/70">
                                    {{ fileName }}
                                </p>
                                <button type="button"
                                    class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/14 bg-white/10 text-white/70 transition-colors hover:border-tccGold hover:text-tccGold"
                                    aria-label="Close image preview" @click="closeImagePreview">
                                    <i class="pi pi-times text-xs" aria-hidden="true" />
                                </button>
                            </div>
                            <div class="max-h-[78vh] overflow-auto bg-black p-3">
                                <img :src="imagePreviewUrl" :alt="fileName || 'Selected ID image preview'"
                                    class="mx-auto max-h-[72vh] w-auto rounded-lg object-contain">
                            </div>
                        </div>
                    </div>
                </Transition>
            </Teleport>

            <template #fallback>
                <div class="space-y-6" aria-busy="true">
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <div class="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                            <div class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                            <div class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                            <div class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-16 animate-pulse rounded-full bg-white/10" />
                            <div
                                class="flex h-[42px] w-full items-center justify-end rounded-lg border border-white/10 bg-white/10 px-4">
                                <div class="h-3 w-3 animate-pulse rounded bg-white/15" />
                            </div>
                        </div>

                        <div class="space-y-2 md:col-span-2">
                            <div class="h-3 w-40 animate-pulse rounded-full bg-white/10" />
                            <div
                                class="flex h-[42px] w-full items-center justify-end rounded-lg border border-white/10 bg-white/10 px-4">
                                <div class="h-3 w-3 animate-pulse rounded bg-white/15" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-44 animate-pulse rounded-full bg-white/10" />
                            <div class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                            <div class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                            <div class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                            <div class="h-[42px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10" />
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-40 animate-pulse rounded-full bg-white/10" />
                            <div
                                class="flex h-[42px] w-full items-center justify-end rounded-lg border border-white/10 bg-white/10 px-4">
                                <div class="h-3 w-3 animate-pulse rounded bg-white/15" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div class="h-3 w-40 animate-pulse rounded-full bg-white/10" />
                            <div
                                class="flex h-[42px] w-full items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4">
                                <div class="h-7 w-20 animate-pulse rounded bg-white/15" />
                                <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                            </div>
                        </div>
                    </div>

                    <div class="rounded-lg border border-white/10 bg-white/10 p-4">
                        <div class="flex items-start gap-2">
                            <div class="mt-0.5 h-3 w-3 animate-pulse rounded-full bg-tccGold/30" />
                            <div class="space-y-2">
                                <div class="h-3 w-80 max-w-[70vw] animate-pulse rounded-full bg-white/10" />
                                <div class="h-3 w-64 max-w-[62vw] animate-pulse rounded-full bg-white/10" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col items-center gap-4 border-t border-tccBorder pt-4 sm:flex-row">
                        <div
                            class="h-[46px] w-full animate-pulse rounded-lg border border-white/10 bg-white/10 sm:w-36" />
                        <div class="h-[46px] w-full animate-pulse rounded-lg bg-tccGold/35 sm:flex-grow" />
                    </div>
                </div>
            </template>
        </ClientOnly>
    </CitizenOnboardingStepCard>
</template>
