<script setup lang="ts">
definePageMeta({
    layout: false
})

type NoticeTone = 'success' | 'warning' | 'error' | 'info'

type CitizenApiResponse = {
    status?: boolean
    message?: string
    data?: unknown
    errors?: Record<string, string[] | string>
}

type ContactField = 'first_name' | 'last_name' | 'email' | 'message'

const CONTACT_ENDPOINT = 'v1/customer/investor-support'

const {
    pending: contactPagePending,
    status: contactPageStatus
} = useAsyncData<boolean>(
    'citizen-contact-page-ready',
    async () => true,
    {
        default: () => false,
        lazy: true,
        server: false
    }
)

const shouldShowContactSkeleton = computed(() => (
    contactPagePending.value ||
    contactPageStatus.value === 'idle' ||
    contactPageStatus.value === 'pending'
))

const contactForm = reactive<Record<ContactField, string>>({
    first_name: '',
    last_name: '',
    email: '',
    message: ''
})

const validations_errors = ref<Record<string, string>>({})
const notice = ref<{ title: string, message: string, tone: NoticeTone } | null>(null)
const isSubmitting = ref(false)
const requiredFields: ContactField[] = ['first_name', 'last_name', 'email', 'message']

const fieldLabels: Record<ContactField, string> = {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email Address',
    message: 'Message'
}

const getStringValue = (value: unknown) => (
    value === null || value === undefined ? '' : String(value).trim()
)

const getValidationErrors = (payload: any) => {
    const errors = payload?.errors || payload?.data

    if (!errors || typeof errors !== 'object' || Array.isArray(errors)) {
        return {}
    }

    return Object.entries(errors).reduce<Record<string, string>>((result, [key, value]) => {
        result[key] = Array.isArray(value)
            ? value.map((item) => getStringValue(item)).filter(Boolean).join(' ')
            : getStringValue(value)

        return result
    }, {})
}

const getFirstValidationMessage = (errors: Record<string, string>) => (
    Object.values(errors).find(Boolean) || ''
)

const setNotice = (title: string, message: string, tone: NoticeTone) => {
    notice.value = { title, message, tone }
}

const clearValidationError = (field: ContactField) => {
    if (!validations_errors.value[field]) return

    delete validations_errors.value[field]
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const validateContactForm = () => {
    validations_errors.value = {}

    requiredFields.forEach((field) => {
        if (!contactForm[field].trim()) {
            validations_errors.value[field] = `${fieldLabels[field]} is required`
        }
    })

    if (contactForm.email.trim() && !isValidEmail(contactForm.email.trim())) {
        validations_errors.value.email = 'Please enter a valid email address'
    }

    return !Object.keys(validations_errors.value).length
}

const resetContactForm = () => {
    contactForm.first_name = ''
    contactForm.last_name = ''
    contactForm.email = ''
    contactForm.message = ''
}

const submitContactForm = async () => {
    if (isSubmitting.value) return

    if (!validateContactForm()) {
        setNotice(
            'Message Not Sent',
            getFirstValidationMessage(validations_errors.value) || 'Please complete the required fields.',
            'warning'
        )
        return
    }

    try {
        isSubmitting.value = true
        notice.value = null

        const response = await $fetchCitizen<CitizenApiResponse>(CONTACT_ENDPOINT, {
            method: 'POST',
            body: {
                first_name: contactForm.first_name.trim(),
                last_name: contactForm.last_name.trim(),
                email: contactForm.email.trim(),
                message: contactForm.message.trim()
            }
        })

        const responseErrors = response?.status === false || response?.errors
            ? getValidationErrors(response)
            : {}

        if (response?.status === false || Object.keys(responseErrors).length) {
            validations_errors.value = responseErrors
            setNotice(
                'Message Not Sent',
                getFirstValidationMessage(responseErrors) || response?.message || 'Please check your details and try again.',
                'error'
            )
            return
        }

        resetContactForm()
        setNotice(
            'Message Sent',
            response?.message || 'Your message has been sent to investor support.',
            'success'
        )
    } catch (error: any) {
        const payload = error?.response?._data || error?.data || error
        const responseErrors = getValidationErrors(payload)

        validations_errors.value = responseErrors
        setNotice(
            'Message Not Sent',
            getFirstValidationMessage(responseErrors) || payload?.message || 'Something went wrong. Please try again.',
            'error'
        )
    } finally {
        isSubmitting.value = false
    }
}

useHead({
    title: 'Contact Investor Support | The Car Crowd'
})
</script>

<template>
    <div class="restomod-shell flex min-h-screen flex-col text-gray-900">
        <AppHeaderCitizen />

        <main class="flex-grow">
            <section class="mx-auto flex max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div class="restomod-panel w-full rounded-[2rem] p-6 sm:p-10">
                    <template v-if="shouldShowContactSkeleton">
                        <span class="sr-only">Loading contact page...</span>

                        <div class="mx-auto max-w-2xl space-y-3 text-center">
                            <span class="mx-auto block h-9 w-44 animate-pulse rounded-full bg-tccGold/25" />
                            <span class="mx-auto block h-11 w-full max-w-xl animate-pulse rounded-xl bg-white/10" />
                            <span class="mx-auto block h-4 w-full max-w-lg animate-pulse rounded-full bg-white/10" />
                            <span class="mx-auto block h-4 w-4/5 max-w-md animate-pulse rounded-full bg-white/10" />
                        </div>

                        <div class="mx-auto mt-8 max-w-2xl space-y-5">
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div v-for="field in ['first-name', 'last-name']" :key="field" class="space-y-2">
                                    <span class="block h-3 w-24 animate-pulse rounded-full bg-white/10" />
                                    <span
                                        class="block h-11 w-full animate-pulse rounded-lg border border-tccBorder bg-white/10" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <span class="block h-3 w-28 animate-pulse rounded-full bg-white/10" />
                                <span
                                    class="block h-11 w-full animate-pulse rounded-lg border border-tccBorder bg-white/10" />
                            </div>
                            <div class="space-y-2">
                                <span class="block h-3 w-20 animate-pulse rounded-full bg-white/10" />
                                <span
                                    class="block h-36 w-full animate-pulse rounded-lg border border-tccBorder bg-white/10" />
                            </div>
                            <span class="block h-12 w-full animate-pulse rounded-full bg-tccGold/70" />
                        </div>
                    </template>

                    <template v-else>
                        <div class="mx-auto max-w-2xl space-y-3 text-center">
                            <span class="restomod-eyebrow">Support Desk</span>
                            <h1 class="font-poppins text-4xl font-black leading-tight text-white">Contact Investor Support</h1>
                            <p class="text-sm font-light leading-relaxed text-tccMutedGray">
                                Send a message to The Car Crowd team for onboarding, payment, or document support.
                            </p>
                        </div>

                        <CitizenSharedActionNotice
                            v-if="notice"
                            class="mx-auto mt-6 max-w-2xl"
                            :title="notice.title"
                            :message="notice.message"
                            :tone="notice.tone"
                        />

                        <form class="mx-auto mt-8 max-w-2xl space-y-5" @submit.prevent="submitContactForm">
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div class="space-y-1">
                                    <label
                                        for="contact-first-name"
                                        class="block text-xs font-semibold uppercase tracking-wider text-tccNavy"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        id="contact-first-name"
                                        v-model="contactForm.first_name"
                                        type="text"
                                        autocomplete="given-name"
                                        class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm"
                                        :class="validations_errors.first_name ? 'border-[#f44336!important]' : ''"
                                        @focus="clearValidationError('first_name')"
                                    >
                                    <InputError
                                        v-if="validations_errors.first_name"
                                        :message="validations_errors.first_name"
                                        text_size="text-sm"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <label
                                        for="contact-last-name"
                                        class="block text-xs font-semibold uppercase tracking-wider text-tccNavy"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        id="contact-last-name"
                                        v-model="contactForm.last_name"
                                        type="text"
                                        autocomplete="family-name"
                                        class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm"
                                        :class="validations_errors.last_name ? 'border-[#f44336!important]' : ''"
                                        @focus="clearValidationError('last_name')"
                                    >
                                    <InputError
                                        v-if="validations_errors.last_name"
                                        :message="validations_errors.last_name"
                                        text_size="text-sm"
                                    />
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label
                                    for="contact-email"
                                    class="block text-xs font-semibold uppercase tracking-wider text-tccNavy"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="contact-email"
                                    v-model="contactForm.email"
                                    type="email"
                                    autocomplete="email"
                                    class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm"
                                    :class="validations_errors.email ? 'border-[#f44336!important]' : ''"
                                    @focus="clearValidationError('email')"
                                >
                                <InputError
                                    v-if="validations_errors.email"
                                    :message="validations_errors.email"
                                    text_size="text-sm"
                                />
                            </div>
                            <div class="space-y-1">
                                <label
                                    for="contact-message"
                                    class="block text-xs font-semibold uppercase tracking-wider text-tccNavy"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="contact-message"
                                    v-model="contactForm.message"
                                    rows="5"
                                    class="w-full rounded-lg border border-tccBorder px-4 py-2.5 text-sm"
                                    :class="validations_errors.message ? 'border-[#f44336!important]' : ''"
                                    @focus="clearValidationError('message')"
                                />
                                <InputError
                                    v-if="validations_errors.message"
                                    :message="validations_errors.message"
                                    text_size="text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-tccGold px-6 py-3.5 font-poppins text-xs font-bold uppercase tracking-wider text-tccDarkNavy disabled:cursor-wait disabled:opacity-70"
                                :disabled="isSubmitting"
                            >
                                <i v-if="isSubmitting" class="pi pi-spin pi-spinner text-sm" aria-hidden="true" />
                                <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                            </button>
                        </form>
                    </template>
                </div>
            </section>
        </main>

        <AppFooterPortal />
    </div>
</template>
