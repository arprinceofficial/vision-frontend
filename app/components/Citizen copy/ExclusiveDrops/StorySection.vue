<script setup lang="ts">
const { citizen_user } = citizenAuth()
const router = useRouter()

type StorySectionData = {
    bg_image?: string
    headline?: string
    subhead_line?: string
    description?: string
    button_text?: string
}

type FollowingResponse = {
    data?: {
        data?: Array<{
            id?: number | string
            is_followed?: boolean
        }>
    }
}

type ToggleFollowResponse = {
    status?: boolean
    message?: string
    data?: {
        followed?: boolean
        icon_id?: number | string
    }
}

const fallbackStory = {
    bg_image: '/assets/images/citizen/exclusive-drops/exclusive-image-large.png',
    headline: 'johnny nelson',
    subhead_line: 'the story so far',
    description:
        'Johnny Nelson is a former British professional boxer and the longest-reigning cruiserweight world champion in history. He dominated the division from 1999 to 2005, defending his WBO (World Boxing Organisation) title a record 13 times.\n\nNelson is known for his resilience and technical skill, he became one of the most respected figures in British boxing.',
    button_text: 'Follow Johnny'
}

const props = defineProps<{
    storySection?: StorySectionData
    slug?: string
    iconId?: number | string
}>()

const isIconFollowed = ref(false)
const isTogglingIcon = ref(false)
const response_modal = ref({})

const normalizeIconId = (id?: number | string | null) => String(id ?? '')

const storyImage = computed(() => props.storySection?.bg_image || fallbackStory.bg_image)
const storyHeadline = computed(() => props.storySection?.headline || fallbackStory.headline)
const storySubheadline = computed(() => props.storySection?.subhead_line || fallbackStory.subhead_line)
const storyDescription = computed(() => props.storySection?.description || fallbackStory.description)
const primaryButtonText = computed(() => props.storySection?.button_text || fallbackStory.button_text)
const followButtonText = computed(() => {
    if (!props.iconId) return primaryButtonText.value
    return isIconFollowed.value ? 'Unfollow' : 'Follow'
})
const exclusiveDropLink = computed(() => {
    const slug = props.slug?.trim()
    return slug ? `/exclusive-drop/${slug}` : '/exclusive-drop'
})

const loadIconFollowState = async () => {
    if (!citizen_user.value || !props.iconId) {
        isIconFollowed.value = false
        return
    }

    try {
        const response = await $fetchCitizen<FollowingResponse>('v1/customer/icons/my-following', {
            method: 'POST',
        })

        const followedIcons = response?.data?.data ?? []
        const iconId = normalizeIconId(props.iconId)
        isIconFollowed.value = followedIcons.some((icon) => (
            normalizeIconId(icon.id) === iconId && icon.is_followed !== false
        ))
    } catch (error) {
        console.error('Failed to load followed icons:', error)
        isIconFollowed.value = false
    }
}

const toggleIconFollow = async () => {
    if (!citizen_user.value) {
        await router.push('/signin')
        return
    }

    const iconId = normalizeIconId(props.iconId)
    if (!iconId || isTogglingIcon.value) return

    isTogglingIcon.value = true

    try {
        const response = await $fetchCitizen<ToggleFollowResponse>(`v1/customer/icons/${iconId}/follow/toggle`, {
            method: 'POST',
        })

        if (response?.status) {
            isIconFollowed.value = Boolean(response.data?.followed)
        }

        response_modal.value = response || {
            status: false,
            message: 'Failed to update follow status. Please try again.',
        }
    } catch (error: any) {
        response_modal.value = error?.response?._data || error?.data || {
            status: false,
            message: 'Failed to update follow status. Please try again.',
        }
    } finally {
        isTogglingIcon.value = false
    }
}

onMounted(() => {
    loadIconFollowState()
})

watch(() => [citizen_user.value, props.iconId], () => {
    loadIconFollowState()
})
</script>

<template>
    <section
        class="relative isolate min-h-[720px] overflow-hidden bg-black [font-family:var(--font-family-Body)] sm:min-h-[860px] lg:h-[2367px]">
        <img :src="storyImage" alt="The story so far"
            class="absolute inset-y-0 left-1/2 h-full w-full -translate-x-1/2 object-cover lg:w-[94.5rem] lg:max-w-none lg:object-fill" />
        <div class="absolute inset-0 bg-black/35" />

        <div
            class="relative mx-auto flex min-h-[inherit] w-full max-w-[1512px] items-end px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:items-start lg:px-[72px] lg:pt-12">
            <div class="max-w-[620px]">
                <p class="bg-clip-text text-[clamp(2rem,5.2vw,4.9375rem)] uppercase leading-[0.8] text-transparent"
                    style="font-family: 'Bebas Neue', sans-serif; background-image: linear-gradient(165deg, rgb(188, 154, 29) 0%, rgb(212, 175, 55) 100%); text-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                    {{ storyHeadline }}
                </p>

                <p class="text-[clamp(2.7rem,7.4vw,7.6875rem)] uppercase leading-[0.8] text-white/90"
                    style="font-family: 'Bebas Neue', sans-serif; text-shadow: 0 4px 24px rgba(0,0,0,0.25);">
                    {{ storySubheadline }}
                </p>

                <p class="mt-5 whitespace-pre-line text-[clamp(1rem,1.45vw,1.25rem)] leading-[1.3] text-[#d0d1d4]">{{
                    storyDescription }}</p>

                <div class="mt-8 flex w-full max-w-[360px] flex-col gap-4">
                    <button type="button" :disabled="isTogglingIcon"
                        class="h-14 w-full rounded-[999px] text-[clamp(1rem,1.5vw,1.125rem)] text-white shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
                        style="font-family: 'Roboto', sans-serif; border: 1px solid rgba(255,255,255,0.18) !important; background-color: rgba(0,0,0,0.55) !important; background-image: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.45) 100%) !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.25);"
                        @click="toggleIconFollow">
                        {{ isTogglingIcon ? 'Please wait...' : followButtonText }}
                    </button>

                    <NuxtLink :to="'/icons'"
                        class="h-12 w-full rounded-[999px] bg-[linear-gradient(165deg,rgb(188,154,29)_0%,rgb(212,175,55)_100%)] text-[clamp(1rem,1.7vw,1.25rem)] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] px-4"
                        style="font-family: 'Roboto', sans-serif;">
                        <span class="flex items-center justify-center h-full w-full">
                            Meet Our Icons
                        </span>
                    </NuxtLink>
                    <NuxtLink :to="exclusiveDropLink"
                        class="h-12 w-full rounded-[999px] bg-[linear-gradient(165deg,rgb(188,154,29)_0%,rgb(212,175,55)_100%)] text-[clamp(1rem,1.7vw,1.25rem)] text-black shadow-[0_4px_24px_rgba(0,0,0,0.25)] px-4"
                        style="font-family: 'Roboto', sans-serif;">
                        <span class="flex items-center justify-center h-full w-full">
                            Exclusive Drop
                        </span>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <LazyResponseModal :response_modal="response_modal" />
    </section>
</template>
