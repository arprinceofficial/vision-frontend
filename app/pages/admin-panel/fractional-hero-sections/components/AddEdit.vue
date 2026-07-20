<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close'])

const visible = ref(props.isOpenModal)
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal
})

const formData = ref({
    id: null,
    headline: '',
    subhead_line: '',
    bg_video: '',
    status: false,
})

const validations_errors = ref({})
const skip_validations = ref(['id', 'status'])

watch(
    () => props.item,
    (value) => {
        if (value && Object.keys(value).length > 0) {
            validations_errors.value = {}
            formData.value = {
                id: value.id || null,
                headline: value.headline || '',
                subhead_line: value.subhead_line || '',
                bg_video: value.bg_video || '',
                status: value.status === true || value.status == 1,
            }
        } else {
            formData.value = {
                id: null,
                headline: '',
                subhead_line: '',
                bg_video: '',
                status: false,
            }
        }
    },
    { immediate: true }
)

const isLoading = ref(false)
const response_modal = ref({})

const existingHeroId = computed(() => {
    if (!Array.isArray(props.data) || props.data.length === 0) return null
    return props.data[0]?.id || null
})

const isUpdateMode = computed(() => {
    if (props.modalTitle !== 'Create') return true
    return !!existingHeroId.value
})

const payload = computed(() => ({
    headline: formData.value.headline,
    subhead_line: formData.value.subhead_line,
    bg_video: formData.value.bg_video,
    status: !!formData.value.status,
}))

const validateForm = () => {
    validations_errors.value = {}
    const errors = Object.keys(formData.value).filter(
        (item) => !formData.value[item] && !skip_validations.value.includes(item)
    )
    if (errors.length > 0) {
        errors.map((item) => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`
        })
        return false
    }

    return true
}

const handleRequestError = (e) => {
    if (e.response?.status === 404 || e.response?.status === 422) {
        const errorsSource = e.response?._data?.data || e.response?._data?.errors
        if (errorsSource) {
            for (const key in errorsSource) {
                if (Object.prototype.hasOwnProperty.call(errorsSource, key)) {
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
}

const updateHandler = async () => {
    if (!validateForm()) return

    try {
        isLoading.value = true
        const id = props.item?.id || existingHeroId.value
        const getData = await $fetchAdmin(`v1/admin/fractional-hero-sections/${id}`, {
            method: 'PUT',
            body: payload.value,
        })
        response_modal.value = getData
        if (getData.status == true) {
            emit('add_emit', getData.data)
        }
    } catch (e) {
        handleRequestError(e)
    } finally {
        isLoading.value = false
    }
}

const createHandler = async () => {
    if (existingHeroId.value) {
        await updateHandler()
        return
    }

    if (!validateForm()) return

    try {
        isLoading.value = true
        const getData = await $fetchAdmin('v1/admin/fractional-hero-sections', {
            method: 'POST',
            body: payload.value,
        })
        response_modal.value = getData
        if (getData.status == true) {
            emit('add_emit', getData.data)
        }
    } catch (e) {
        handleRequestError(e)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '40rem', maxWidth: 'calc(100vw - 2rem)' }" @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ isUpdateMode ? 'Update' : 'Create' }} Fractional Hero Section</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Headline</label>
                    <LazyInputText
                        v-model="formData.headline"
                        class="w-full"
                        :class="validations_errors.headline ? 'border-[#f44336!important]' : ''"
                        autocomplete="off"
                        @focus="validations_errors.headline = ''"
                    />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.headline" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Subhead Line</label>
                    <LazyInputText
                        v-model="formData.subhead_line"
                        class="w-full"
                        :class="validations_errors.subhead_line ? 'border-[#f44336!important]' : ''"
                        autocomplete="off"
                        @focus="validations_errors.subhead_line = ''"
                    />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.subhead_line" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-2 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Background Video URL</label>
                    <LazyInputText
                        v-model="formData.bg_video"
                        class="w-full"
                        placeholder="https://example.com/videos/background-video.mp4"
                        :class="validations_errors.bg_video ? 'border-[#f44336!important]' : ''"
                        autocomplete="off"
                        @focus="validations_errors.bg_video = ''"
                    />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.bg_video" />
                </div>
            </div>

            <div class="flex items-end justify-start gap-4">
                <label class="font-semibold w-14 mb-2">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="formData.status" @focus="validations_errors.status = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.status" />
                </div>
            </div>
        </div>

        <template #footer class="flex justify-end gap-2 border-gray-200">
            <div class="flex justify-end items-center gap-3 border-gray-200">
                <Button v-if="isLoading" severity="secondary" style="cursor: not-allowed; width: 80px;">
                    <ProgressSpinner style="width: 25px; height: 25px" strokeWidth="8" animationDuration=".5s" />
                </Button>
                <template v-else>
                    <Button
                        type="button"
                        label="Cancel"
                        severity="danger"
                        outlined
                        class="transition-all duration-300 hover:scale-105"
                        @click="$emit('close')"
                    >
                        <template #icon="{ class: iconClass }">
                            <i class="pi pi-times-circle mr-2" :class="iconClass"></i>
                        </template>
                    </Button>
                    <Button
                        type="button"
                        :label="isUpdateMode ? 'Update' : 'Create'"
                        severity="success"
                        raised
                        class="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        @click="isUpdateMode ? updateHandler() : createHandler()"
                    >
                        <template #icon="{ class: iconClass }">
                            <i :class="isUpdateMode ? 'pi pi-refresh mr-2' : 'pi pi-plus-circle mr-2'"></i>
                        </template>
                    </Button>
                </template>
            </div>
        </template>
    </Dialog>
    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss" scoped></style>
