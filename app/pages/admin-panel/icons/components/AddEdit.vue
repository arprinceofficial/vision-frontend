<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close']);
const StorySectionModal = defineAsyncComponent(() => import('./StorySectionModal.vue'));
const GlovesMomentSectionModal = defineAsyncComponent(() => import('./GlovesMomentSectionModal.vue'));
const DifferenceSectionModal = defineAsyncComponent(() => import('./DifferenceSectionModal.vue'));

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const formData = ref({
    id: null,
    icon: '',
    name: '',
    title: '',
    years_active: '',
    slug: '',
    headline: '',
    subhead_line: '',
    bg_image: '',
    bg_video: '',
    backdrop_video: '',
    button_text: '',
    story_so_far: '',
    icon_category_id: '',
    serial_number: '',
    story_section: [],
    gloves_moment_section: [],
    difference_section: [],
    is_home: 0,
    status: 0,
});

const isChecked = ref(false);
const isHomeChecked = ref(false);

const isStorySectionModalOpen = ref(false);
const isGlovesMomentSectionModalOpen = ref(false);
const isDifferenceSectionModalOpen = ref(false);

const openStorySectionModal = () => {
    isStorySectionModalOpen.value = true;
}

const closeStorySectionModal = () => {
    isStorySectionModalOpen.value = false;
}

const saveStorySection = (payload) => {
    formData.value.story_section = payload;
    closeStorySectionModal();
}

const openGlovesMomentSectionModal = () => {
    isGlovesMomentSectionModalOpen.value = true;
}

const closeGlovesMomentSectionModal = () => {
    isGlovesMomentSectionModalOpen.value = false;
}

const saveGlovesMomentSection = (payload) => {
    formData.value.gloves_moment_section = payload;
    closeGlovesMomentSectionModal();
}

const openDifferenceSectionModal = () => {
    isDifferenceSectionModalOpen.value = true;
}

const closeDifferenceSectionModal = () => {
    isDifferenceSectionModalOpen.value = false;
}

const saveDifferenceSection = (payload) => {
    formData.value.difference_section = payload;
    closeDifferenceSectionModal();
}

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            icon: value.icon || '',
            name: value.name || '',
            title: value.title || '',
            years_active: value.years_active || '',
            slug: value.slug || '',
            headline: value.headline || '',
            subhead_line: value.subhead_line || '',
            bg_image: value.bg_image || '',
            bg_video: value.bg_video || '',
            backdrop_video: value.backdrop_video || '',
            button_text: value.button_text || '',
            story_so_far: value.story_so_far || '',
            icon_category_id: value.icon_category_id || value.icon_category?.id || '',
            serial_number: value.serial_number || '',
            story_section: value.story_section || [],
            gloves_moment_section: value.gloves_moment_section || [],
            difference_section: value.difference_section || [],
            is_home: value.is_home || 0,
            status: value.status || 0,
        };
        isHomeChecked.value = value.is_home == 1;
        isChecked.value = value.status == 1;
    } else {
        formData.value = {
            id: null,
            icon: '',
            name: '',
            title: '',
            years_active: '',
            slug: '',
            headline: '',
            subhead_line: '',
            bg_image: '',
            bg_video: '',
            backdrop_video: '',
            button_text: '',
            story_so_far: '',
            icon_category_id: '',
            serial_number: '',
            story_section: [],
            gloves_moment_section: [],
            difference_section: [],
            is_home: 0,
            status: 0,
        };
        isHomeChecked.value = false;
        isChecked.value = false;
    }
}, { immediate: true });
const { $slugify } = useNuxtApp();

// Auto-generate slug from `name` when creating or when slug is empty
watch(() => formData.value.name, (val) => {
    if (!val) return;
    if (props.modalTitle === 'Create' || !formData.value.slug) {
        formData.value.slug = $slugify(val);
    }
});

const isCategoryLoading = ref(false);
const iconCategoryList = ref([]);

const loadIconCategories = async () => {
    isCategoryLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/icon-categories`, {
            method: 'GET',
        });
        iconCategoryList.value = getData.data.data;
    } catch (e) {
    } finally {
        isCategoryLoading.value = false;
    }
};

onMounted(() => {
    loadIconCategories();
});

const setPhoto = (photo) => {
    formData.value.bg_image = photo;
}

const handleStatusChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
}

const handleIsHomeChange = () => {
    formData.value.is_home = isHomeChecked.value ? 1 : 0;
}

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'icon',
    'bg_image',
    'is_home',
    'serial_number',
    'status',
]);

const isLoading = ref(false);
const response_modal = ref({});

const updateHandler = async () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => !formData.value[item] && !skip_validations.value.includes(item));
    if (errors.length > 0) {
        errors.map(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return;
    }

    try {
        isLoading.value = true;
        const submitData = { ...formData.value };
        // if (submitData.bg_image?.includes('http') || submitData.bg_image?.includes('https')) {
        //     delete submitData.bg_image;
        // }
        const getData = await $fetchAdmin(`v1/admin/icons/${props.item.id}`, {
            method: 'PUT',
            body: submitData,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 422) {
            const errorsSource = e.response?._data?.data || e.response?._data?.errors;
            if (errorsSource) {
                for (const key in errorsSource) {
                    if (errorsSource.hasOwnProperty(key)) {
                        validations_errors.value[key] = errorsSource[key][0];
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
        isLoading.value = false;
    }
}

const createHandler = async () => {
    validations_errors.value = {};
    const errors = Object.keys(formData.value).filter(item => !formData.value[item] && !skip_validations.value.includes(item));
    if (errors.length > 0) {
        errors.map(item => {
            validations_errors.value[item] = `${item.replaceAll('_', ' ')} is required`;
        });
        return;
    }

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/icons`, {
            method: 'POST',
            body: formData.value,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 422) {
            const errorsSource = e.response?._data?.data || e.response?._data?.errors;
            if (errorsSource) {
                for (const key in errorsSource) {
                    if (errorsSource.hasOwnProperty(key)) {
                        validations_errors.value[key] = errorsSource[key][0];
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
        isLoading.value = false;
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '70rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Icon</h4>
            </div>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Icon</label>
                    <LazyInputText v-model="formData.icon" class="w-full" placeholder="i.e. star"
                        :class="validations_errors.icon ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.icon = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.icon" />
                </div>
            </div> -->

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Name</label>
                    <LazyInputText v-model="formData.name" class="w-full" placeholder="i.e. Michael Jordan"
                        :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.name = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Title</label>
                    <LazyInputText v-model="formData.title" class="w-full" placeholder="i.e. The GOAT"
                        :class="validations_errors.title ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.title = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.title" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Years Active</label>
                    <LazyInputText v-model="formData.years_active" class="w-full" placeholder="i.e. 1984-2003"
                        :class="validations_errors.years_active ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.years_active = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.years_active" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Slug</label>
                    <LazyInputText v-model="formData.slug" class="w-full" placeholder="i.e. michael-jordan"
                        :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.slug = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-2 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Headline</label>
                    <LazyInputText v-model="formData.headline" class="w-full" placeholder="i.e. Built different"
                        :class="validations_errors.headline ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.headline = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.headline" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-1 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Subhead Line</label>
                    <LazyInputText v-model="formData.subhead_line" class="w-full" placeholder="i.e. Legacy in motion"
                        :class="validations_errors.subhead_line ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.subhead_line = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.subhead_line" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-2 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Background Video</label>
                    <LazyInputText v-model="formData.bg_video" class="w-full" placeholder="i.e. https://..."
                        :class="validations_errors.bg_video ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.bg_video = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.bg_video" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-1 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Backdrop Video</label>
                    <LazyInputText v-model="formData.backdrop_video" class="w-full" placeholder="i.e. https://..."
                        :class="validations_errors.backdrop_video ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.backdrop_video = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.backdrop_video" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Button Text</label>
                    <LazyInputText v-model="formData.button_text" class="w-full" placeholder="i.e. Explore Story"
                        :class="validations_errors.button_text ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.button_text = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.button_text" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Icon Category</label>
                    <Select v-model="formData.icon_category_id" :options="iconCategoryList" filter optionLabel="title"
                        placeholder="Select Category" optionValue="id" class="w-full"
                        :loading="isCategoryLoading" @focus="validations_errors.icon_category_id = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.icon_category_id" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Serial Number</label>
                    <LazyInputText v-model="formData.serial_number" class="w-full" placeholder="i.e. 1"
                        :class="validations_errors.serial_number ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.serial_number = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.serial_number" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-3 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Story So Far</label>
                    <Textarea v-model="formData.story_so_far" rows="4" class="w-full"
                        placeholder="i.e. Long-form summary..."
                        :class="validations_errors.story_so_far ? 'border-[#f44336!important]' : ''"
                        @focus="validations_errors.story_so_far = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.story_so_far" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-3 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Story Section</label>
                    <div class="flex items-center gap-3 mt-2">
                        <Button type="button" label="Edit Story Section" severity="secondary"
                            @click="openStorySectionModal" />
                        <span class="text-sm text-gray-500">
                            Cards: {{ (Array.isArray(formData.story_section) && formData.story_section[0]?.cards)
                                ? formData.story_section[0].cards.length
                                : 0 }}
                        </span>
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.story_section" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-3 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Moment Section</label>
                    <div class="flex items-center gap-3 mt-2">
                        <Button type="button" label="Edit Moment Section" severity="secondary"
                            @click="openGlovesMomentSectionModal" />
                        <span class="text-sm text-gray-500">
                            Slides: {{ (Array.isArray(formData.gloves_moment_section) && formData.gloves_moment_section[0]?.image_slider)
                                ? formData.gloves_moment_section[0].image_slider.length
                                : 0 }}
                        </span>
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.gloves_moment_section" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-3 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Difference Section</label>
                    <div class="flex items-center gap-3 mt-2">
                        <Button type="button" label="Edit Difference Section" severity="secondary"
                            @click="openDifferenceSectionModal" />
                        <span class="text-sm text-gray-500">
                            Cards: {{ (Array.isArray(formData.difference_section) && formData.difference_section[0]?.cards)
                                ? formData.difference_section[0].cards.length
                                : 0 }}
                        </span>
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.difference_section" />
                </div>
            </div>

            <div class="col-span-1 sm:col-span-3 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold">Icon Pick Moment Image</label>
                    <div class="w-[250px]">
                        <MediaGallery :getPhoto="formData.bg_image" @set_photo="setPhoto" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.bg_image" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Is Home</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="isHomeChecked" @change="handleIsHomeChange"
                        @focus="validations_errors.is_home = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.is_home" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="isChecked" @change="handleStatusChange"
                        @focus="validations_errors.status = ''" />
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
                    <Button type="button" label="Cancel" severity="danger" outlined
                        class="transition-all duration-300 hover:scale-105" @click="$emit('close')">
                        <template #icon="{ class: iconClass }">
                            <i class="pi pi-times-circle mr-2" :class="iconClass"></i>
                        </template>
                    </Button>
                    <Button type="button" :label="modalTitle === 'Create' ? 'Create' : 'Update'" severity="success"
                        raised class="transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        @click="modalTitle === 'Create' ? createHandler() : updateHandler()">
                        <template #icon="{ class: iconClass }">
                            <i :class="modalTitle === 'Create' ? 'pi pi-plus-circle mr-2' : 'pi pi-refresh mr-2'"></i>
                        </template>
                    </Button>
                </template>
            </div>
        </template>
    </Dialog>

    <StorySectionModal :visible="isStorySectionModalOpen" :storySection="formData.story_section"
        @update:visible="isStorySectionModalOpen = $event" @save="saveStorySection" />

    <GlovesMomentSectionModal :visible="isGlovesMomentSectionModalOpen"
        :glovesMomentSection="formData.gloves_moment_section"
        @update:visible="isGlovesMomentSectionModalOpen = $event" @save="saveGlovesMomentSection" />

    <DifferenceSectionModal :visible="isDifferenceSectionModalOpen"
        :differenceSection="formData.difference_section"
        @update:visible="isDifferenceSectionModalOpen = $event" @save="saveDifferenceSection" />

    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss" scoped></style>
