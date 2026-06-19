<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);
const { $slugify } = useNuxtApp();

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const isTruthy = (value) => value === true || value == 1;

const toInputValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const normalizeImageArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.image || item?.url || '';
    }).filter(Boolean);
};

const getDefaultExperienceSection = () => ({
    title: '',
    subtitle: '',
    list: [],
    button_text: '',
    images: [],
});

const getDefaultHistoricSection = () => ({
    title: '',
    graph_data: [],
});

const getDefaultMissionSection = () => ({
    title: '',
    about_title: '',
    about_description: '',
    about_image: '',
    charity_title: '',
    charity_description: '',
    charity_image: '',
});

const getDefaultStorySection = () => ({
    title: '',
    subtitle: '',
    details: [],
    button_text: '',
    button_link: '',
    image: '',
});

const getDefaultFormData = () => ({
    id: null,
    icon_item_id: '',
    icon_id: '',
    headline: '',
    subhead_line: '',
    total_shares: '',
    available_shares: '',
    share_price: '',
    is_exclusive: false,
    is_fractional: true,
    bg_image: '',
    summary_image: '',
    portfolio_image: '',
    status: false,
    slug: '',
    reveal_bg_image: '',
    item_name: '',
    item_second_name: '',
    item_details: '',
    item_3d_image: '',
    fanzone_bg_image: '',
    experience_section: getDefaultExperienceSection(),
    historic_section: getDefaultHistoricSection(),
    mission_section: getDefaultMissionSection(),
    story_section: getDefaultStorySection(),
});

const formData = ref(getDefaultFormData());
const validations_errors = ref({});

const normalizeExperienceSection = (section) => {
    const value = section || {};
    return {
        title: value.title || '',
        subtitle: value.subtitle || '',
        list: Array.isArray(value.list)
            ? value.list.map((item) => ({
                title: item?.title || '',
                description: item?.description || '',
            }))
            : [],
        button_text: value.button_text || '',
        images: normalizeImageArray(value.images),
    };
};

const normalizeHistoricSection = (section) => {
    const value = section || {};
    return {
        title: value.title || '',
        graph_data: Array.isArray(value.graph_data)
            ? value.graph_data.map((item) => ({
                year: toInputValue(item?.year),
                value: toInputValue(item?.value),
            }))
            : [],
    };
};

const normalizeMissionSection = (section) => {
    const value = section || {};
    return {
        title: value.title || '',
        about_title: value.about_title || '',
        about_description: value.about_description || '',
        about_image: value.about_image || '',
        charity_title: value.charity_title || '',
        charity_description: value.charity_description || '',
        charity_image: value.charity_image || '',
    };
};

const normalizeStorySection = (section) => {
    const value = section || {};
    return {
        title: value.title || '',
        subtitle: value.subtitle || '',
        details: Array.isArray(value.details)
            ? value.details.map((item) => ({
                title: item?.title || '',
                description: item?.description || '',
            }))
            : [],
        button_text: value.button_text || '',
        button_link: value.button_link || '',
        image: value.image || '',
    };
};

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            icon_item_id: value.icon_item_id || value.icon_item?.id || '',
            icon_id: value.icon_id || value.icon?.id || '',
            headline: value.headline || '',
            subhead_line: value.subhead_line || '',
            total_shares: toInputValue(value.total_shares ?? value.shares_total),
            available_shares: toInputValue(value.available_shares ?? value.shares_available),
            share_price: toInputValue(value.share_price ?? value.per_share_value),
            is_exclusive: isTruthy(value.is_exclusive),
            is_fractional: value.is_fractional === undefined ? true : isTruthy(value.is_fractional),
            bg_image: value.bg_image || '',
            summary_image: value.summary_image || '',
            portfolio_image: value.portfolio_image || '',
            status: isTruthy(value.status),
            slug: value.slug || '',
            reveal_bg_image: value.reveal_bg_image || '',
            item_name: value.item_name || '',
            item_second_name: value.item_second_name || '',
            item_details: value.item_details || '',
            item_3d_image: value.item_3d_image || '',
            fanzone_bg_image: value.fanzone_bg_image || '',
            experience_section: normalizeExperienceSection(value.experience_section),
            historic_section: normalizeHistoricSection(value.historic_section),
            mission_section: normalizeMissionSection(value.mission_section),
            story_section: normalizeStorySection(value.story_section),
        };
    } else {
        formData.value = getDefaultFormData();
    }
}, { immediate: true });

watch(() => formData.value.headline, (value) => {
    if (!value) return;
    if (props.modalTitle === 'Create' || !formData.value.slug) {
        formData.value.slug = $slugify(value);
    }
});

const isIconItemsLoading = ref(false);
const iconItems = ref([]);
const loadIconItems = async () => {
    isIconItemsLoading.value = true;
    try {
        const getData = await $fetchAdmin('v1/admin/icon-items', {
            method: 'GET',
        });
        iconItems.value = Array.isArray(getData?.data?.data) ? getData.data.data : [];
    } catch (e) {
    } finally {
        isIconItemsLoading.value = false;
    }
};

const isIconsLoading = ref(false);
const iconList = ref([]);
const loadIcons = async () => {
    isIconsLoading.value = true;
    try {
        const getData = await $fetchAdmin('v1/admin/icons', {
            method: 'GET',
        });
        iconList.value = Array.isArray(getData?.data?.data) ? getData.data.data : [];
    } catch (e) {
    } finally {
        isIconsLoading.value = false;
    }
};

onMounted(() => {
    loadIconItems();
    loadIcons();
});

const setBgImage = (photo) => {
    formData.value.bg_image = photo;
};

const setSummaryImage = (photo) => {
    formData.value.summary_image = photo;
};

const setPortfolioImage = (photo) => {
    formData.value.portfolio_image = photo;
};

const setRevealBgImage = (photo) => {
    formData.value.reveal_bg_image = photo;
};

const setItem3dImage = (photo) => {
    formData.value.item_3d_image = photo;
};

const setFanzoneBgImage = (photo) => {
    formData.value.fanzone_bg_image = photo;
};

const setExperienceImages = (photos) => {
    formData.value.experience_section.images = photos;
};

const setMissionAboutImage = (photo) => {
    formData.value.mission_section.about_image = photo;
};

const setMissionCharityImage = (photo) => {
    formData.value.mission_section.charity_image = photo;
};

const setStoryImage = (photo) => {
    formData.value.story_section.image = photo;
};

const addExperienceListItem = () => {
    formData.value.experience_section.list.push({ title: '', description: '' });
};

const removeExperienceListItem = (index) => {
    formData.value.experience_section.list.splice(index, 1);
};

const addHistoricPoint = () => {
    formData.value.historic_section.graph_data.push({ year: '', value: '' });
};

const removeHistoricPoint = (index) => {
    formData.value.historic_section.graph_data.splice(index, 1);
};

const addStoryDetail = () => {
    formData.value.story_section.details.push({ title: '', description: '' });
};

const removeStoryDetail = (index) => {
    formData.value.story_section.details.splice(index, 1);
};

const requiredFields = [
    'icon_item_id',
    'icon_id',
    'headline',
    'subhead_line',
    'total_shares',
    'available_shares',
    'share_price',
    'slug',
    'item_name',
];

const validateForm = () => {
    validations_errors.value = {};
    const errors = requiredFields.filter((key) => (
        formData.value[key] === '' ||
        formData.value[key] === null ||
        formData.value[key] === undefined
    ));

    if (errors.length > 0) {
        errors.forEach((key) => {
            validations_errors.value[key] = `${key.replaceAll('_', ' ')} is required`;
        });
        return false;
    }

    return true;
};

const toNumber = (value) => {
    if (value === '' || value === null || value === undefined) return value;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? value : numberValue;
};

const serializeSubmitData = () => {
    const submitData = JSON.parse(JSON.stringify(formData.value));
    delete submitData.id;

    ['icon_item_id', 'icon_id', 'total_shares', 'available_shares', 'share_price'].forEach((key) => {
        submitData[key] = toNumber(submitData[key]);
    });

    submitData.status = submitData.status ? 1 : 0;
    submitData.is_exclusive = !!submitData.is_exclusive;
    submitData.is_fractional = !!submitData.is_fractional;

    submitData.experience_section = {
        ...submitData.experience_section,
        list: (submitData.experience_section?.list || []).filter((item) => item.title || item.description),
        images: normalizeImageArray(submitData.experience_section?.images || []),
    };

    submitData.historic_section = {
        ...submitData.historic_section,
        graph_data: (submitData.historic_section?.graph_data || [])
            .filter((item) => item.year !== '' || item.value !== '')
            .map((item) => ({
                year: toNumber(item.year),
                value: toNumber(item.value),
            })),
    };

    submitData.story_section = {
        ...submitData.story_section,
        details: (submitData.story_section?.details || []).filter((item) => item.title || item.description),
    };

    return submitData;
};

const isLoading = ref(false);
const response_modal = ref({});

const handleRequestError = (e) => {
    if (e.response?.status === 404 || e.response?.status === 422) {
        const errorsSource = e.response?._data?.data || e.response?._data?.errors;
        if (errorsSource) {
            for (const key in errorsSource) {
                if (Object.prototype.hasOwnProperty.call(errorsSource, key)) {
                    validations_errors.value[key] = errorsSource[key][0];
                }
            }
        }
    } else if (!e.response?.status) {
        response_modal.value = {
            status: false,
            message: 'Something went wrong. Please try again later.',
        };
    } else {
        response_modal.value = {
            status: e.response._data.status,
            message: e.response._data.message,
        };
    }
};

const updateHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/fractional-items/${props.item.id}`, {
            method: 'PUT',
            body: serializeSubmitData(),
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleRequestError(e);
    } finally {
        isLoading.value = false;
    }
};

const createHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin('v1/admin/fractional-items', {
            method: 'POST',
            body: serializeSubmitData(),
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleRequestError(e);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false"
        :style="{ width: '88rem', maxWidth: 'calc(100vw - 2rem)' }" @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Fractional Item</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Icon Item</label>
                <Select v-model="formData.icon_item_id" :options="iconItems" filter optionLabel="name" optionValue="id"
                    placeholder="Select Icon Item" class="w-full" :loading="isIconItemsLoading"
                    @focus="validations_errors.icon_item_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.icon_item_id" />
            </div>

            <div>
                <label class="font-semibold">Icon</label>
                <Select v-model="formData.icon_id" :options="iconList" filter optionLabel="name" optionValue="id"
                    placeholder="Select Icon" class="w-full" :loading="isIconsLoading"
                    @focus="validations_errors.icon_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.icon_id" />
            </div>

            <div>
                <label class="font-semibold">Slug</label>
                <LazyInputText v-model="formData.slug" class="w-full"
                    :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.slug = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
            </div>

            <div>
                <label class="font-semibold">Headline</label>
                <LazyInputText v-model="formData.headline" class="w-full"
                    :class="validations_errors.headline ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.headline = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.headline" />
            </div>

            <div>
                <label class="font-semibold">Subhead Line</label>
                <LazyInputText v-model="formData.subhead_line" class="w-full"
                    :class="validations_errors.subhead_line ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.subhead_line = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.subhead_line" />
            </div>

            <div>
                <label class="font-semibold">Item Name</label>
                <LazyInputText v-model="formData.item_name" class="w-full"
                    :class="validations_errors.item_name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.item_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.item_name" />
            </div>

            <div>
                <label class="font-semibold">Item Second Name</label>
                <LazyInputText v-model="formData.item_second_name" class="w-full" autocomplete="off"
                    @focus="validations_errors.item_second_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.item_second_name" />
            </div>

            <div>
                <label class="font-semibold">Total Shares</label>
                <LazyInputText v-model="formData.total_shares" type="number" class="w-full"
                    :class="validations_errors.total_shares ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.total_shares = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.total_shares" />
            </div>

            <div>
                <label class="font-semibold">Available Shares</label>
                <LazyInputText v-model="formData.available_shares" type="number" class="w-full"
                    :class="validations_errors.available_shares ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.available_shares = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.available_shares" />
            </div>

            <div>
                <label class="font-semibold">Share Price</label>
                <LazyInputText v-model="formData.share_price" type="number" step="0.01" class="w-full"
                    :class="validations_errors.share_price ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.share_price = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.share_price" />
            </div>

            <div class="sm:col-span-3">
                <label class="font-semibold">Item Details</label>
                <Textarea v-model="formData.item_details" rows="4" class="w-full" autocomplete="off" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.item_details" />
            </div>

            <div class="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4">
                <div>
                    <label class="font-semibold">Background Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.bg_image" @set_photo="setBgImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.bg_image" />
                </div>

                <div>
                    <label class="font-semibold">Summary Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.summary_image" @set_photo="setSummaryImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.summary_image" />
                </div>

                <div>
                    <label class="font-semibold">Portfolio Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.portfolio_image" @set_photo="setPortfolioImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.portfolio_image" />
                </div>

                <div>
                    <label class="font-semibold">Reveal Background Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.reveal_bg_image" @set_photo="setRevealBgImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.reveal_bg_image" />
                </div>

                <div>
                    <label class="font-semibold">Item 3D Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.item_3d_image" @set_photo="setItem3dImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.item_3d_image" />
                </div>

                <div>
                    <label class="font-semibold">Fanzone Background Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.fanzone_bg_image" @set_photo="setFanzoneBgImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.fanzone_bg_image" />
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Experience Section</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Title</label>
                        <LazyInputText v-model="formData.experience_section.title" class="w-full" autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">Subtitle</label>
                        <LazyInputText v-model="formData.experience_section.subtitle" class="w-full" autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">Button Text</label>
                        <LazyInputText v-model="formData.experience_section.button_text" class="w-full" autocomplete="off" />
                    </div>
                </div>

                <div class="mt-4">
                    <label class="font-semibold block mb-3">Images</label>
                    <MediaGallery :getPhoto="formData.experience_section.images" :multiple="true"
                        @set_photo="setExperienceImages" />
                </div>

                <div class="flex justify-between items-center mt-4 mb-3">
                    <label class="font-semibold">Experience List</label>
                    <Button type="button" label="Add Item" icon="pi pi-plus" severity="success" @click="addExperienceListItem" />
                </div>

                <div v-if="formData.experience_section.list.length === 0" class="text-sm text-gray-500 mb-2">
                    No experience list items added yet.
                </div>

                <div v-for="(experience, index) in formData.experience_section.list" :key="index"
                    class="border border-gray-200 rounded-lg p-4 mb-3">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-semibold text-sm">Item {{ index + 1 }}</span>
                        <Button type="button" label="Remove" severity="danger" outlined size="small"
                            @click="removeExperienceListItem(index)" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="font-semibold text-sm">Title</label>
                            <LazyInputText v-model="experience.title" class="w-full" autocomplete="off" />
                        </div>
                        <div>
                            <label class="font-semibold text-sm">Description</label>
                            <LazyInputText v-model="experience.description" class="w-full" autocomplete="off" />
                        </div>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.experience_section" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Historic Section</label>
                </div>

                <div>
                    <label class="font-semibold text-sm">Title</label>
                    <LazyInputText v-model="formData.historic_section.title" class="w-full" autocomplete="off" />
                </div>

                <div class="flex justify-between items-center mt-4 mb-3">
                    <label class="font-semibold">Graph Data</label>
                    <Button type="button" label="Add Point" icon="pi pi-plus" severity="success" @click="addHistoricPoint" />
                </div>

                <div v-if="formData.historic_section.graph_data.length === 0" class="text-sm text-gray-500 mb-2">
                    No graph points added yet.
                </div>

                <div v-for="(point, index) in formData.historic_section.graph_data" :key="index"
                    class="border border-gray-200 rounded-lg p-4 mb-3">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-semibold text-sm">Point {{ index + 1 }}</span>
                        <Button type="button" label="Remove" severity="danger" outlined size="small"
                            @click="removeHistoricPoint(index)" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="font-semibold text-sm">Year</label>
                            <LazyInputText v-model="point.year" type="number" class="w-full" autocomplete="off" />
                        </div>
                        <div>
                            <label class="font-semibold text-sm">Value</label>
                            <LazyInputText v-model="point.value" type="number" class="w-full" autocomplete="off" />
                        </div>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.historic_section" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Mission Section</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Title</label>
                        <LazyInputText v-model="formData.mission_section.title" class="w-full" autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">About Title</label>
                        <LazyInputText v-model="formData.mission_section.about_title" class="w-full" autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">Charity Title</label>
                        <LazyInputText v-model="formData.mission_section.charity_title" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-3">
                        <label class="font-semibold text-sm">About Description</label>
                        <Textarea v-model="formData.mission_section.about_description" rows="3" class="w-full"
                            autocomplete="off" />
                    </div>
                    <div class="sm:col-span-3">
                        <label class="font-semibold text-sm">Charity Description</label>
                        <Textarea v-model="formData.mission_section.charity_description" rows="3" class="w-full"
                            autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">About Image</label>
                        <div class="w-full mt-2">
                            <MediaGallery :getPhoto="formData.mission_section.about_image" @set_photo="setMissionAboutImage" />
                        </div>
                    </div>
                    <div>
                        <label class="font-semibold text-sm">Charity Image</label>
                        <div class="w-full mt-2">
                            <MediaGallery :getPhoto="formData.mission_section.charity_image" @set_photo="setMissionCharityImage" />
                        </div>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.mission_section" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Story Section</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Title</label>
                        <LazyInputText v-model="formData.story_section.title" class="w-full" autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">Subtitle</label>
                        <LazyInputText v-model="formData.story_section.subtitle" class="w-full" autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">Button Text</label>
                        <LazyInputText v-model="formData.story_section.button_text" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-semibold text-sm">Button Link</label>
                        <LazyInputText v-model="formData.story_section.button_link" class="w-full"
                            placeholder="https://example.com/story" autocomplete="off" />
                    </div>
                    <div>
                        <label class="font-semibold text-sm">Image</label>
                        <div class="w-full mt-2">
                            <MediaGallery :getPhoto="formData.story_section.image" @set_photo="setStoryImage" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mt-4 mb-3">
                    <label class="font-semibold">Story Details</label>
                    <Button type="button" label="Add Detail" icon="pi pi-plus" severity="success" @click="addStoryDetail" />
                </div>

                <div v-if="formData.story_section.details.length === 0" class="text-sm text-gray-500 mb-2">
                    No story details added yet.
                </div>

                <div v-for="(detail, index) in formData.story_section.details" :key="index"
                    class="border border-gray-200 rounded-lg p-4 mb-3">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-semibold text-sm">Detail {{ index + 1 }}</span>
                        <Button type="button" label="Remove" severity="danger" outlined size="small"
                            @click="removeStoryDetail(index)" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="font-semibold text-sm">Title</label>
                            <LazyInputText v-model="detail.title" class="w-full" autocomplete="off" />
                        </div>
                        <div>
                            <label class="font-semibold text-sm">Description</label>
                            <LazyInputText v-model="detail.description" class="w-full" autocomplete="off" />
                        </div>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.story_section" />
            </div>

            <div class="flex items-center gap-3">
                <label class="font-semibold">Is Exclusive</label>
                <ToggleSwitch v-model="formData.is_exclusive" @focus="validations_errors.is_exclusive = ''" />
            </div>

            <div class="flex items-center gap-3">
                <label class="font-semibold">Is Fractional</label>
                <ToggleSwitch v-model="formData.is_fractional" @focus="validations_errors.is_fractional = ''" />
            </div>

            <div class="flex items-center gap-3">
                <label class="font-semibold">Status</label>
                <ToggleSwitch v-model="formData.status" @focus="validations_errors.status = ''" />
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
    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss" scoped></style>
