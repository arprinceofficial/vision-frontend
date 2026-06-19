<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close']);
const { $submitDateTimeFormat, $parseDateValue, $slugify } = useNuxtApp();

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const getDefaultFormData = () => ({
    id: null,
    icon_id: '',
    icon_item_id: '',
    headline: '',
    subhead_line: '',
    drop_name: '',
    slug: '',
    story_section: {
        headline: '',
        subhead_line: '',
        bg_image: '',
        description: '',
        button_text: '',
    },
    starting_price: '',
    bid_increment: '',
    drop_date: null,
    end_date: null,
    delivery_days: '',
    popcorn_threshold_minutes: '',
    popcorn_extension_minutes: '',
    is_exclusive: 0,
    profile_completion_required: 0,
    bg_image: '',
    summary_image: '',
    portfolio_image: '',
    congratulation_gallery: [],
    difference_bg_image: '',
    difference_cards: [],
    status: 0,
    media_clues: [],
});

const formData = ref(getDefaultFormData());

const isChecked = ref(false);
const isExclusiveChecked = ref(false);
const isProfileCompletionRequiredChecked = ref(false);

const normalizeMediaClues = (clues) => {
    if (!Array.isArray(clues)) return [];
    return clues.map((clue) => ({
        name: clue?.name || '',
        asset: clue?.asset || '',
        timer: $parseDateValue(clue?.timer),
    }));
};

const normalizeCongratulationGallery = (gallery) => {
    if (!Array.isArray(gallery)) return [];
    return gallery.map((item) => {
        if (typeof item === 'string') return item;
        return item?.image || item?.url || '';
    }).filter(Boolean);
};

const normalizeDifferenceCards = (cards) => {
    if (!Array.isArray(cards)) return [];
    return cards.map((c) => ({
        icon_first_name: c?.icon_first_name || '',
        image: c?.image || '',
        is_description: !!c?.is_description,
        description: c?.description || '',
    }));
};

const normalizeStorySection = (section) => {
    const value = Array.isArray(section) ? (section[0] || {}) : (section || {});
    return {
        headline: value?.headline || '',
        subhead_line: value?.subhead_line || '',
        bg_image: value?.bg_image || '',
        description: value?.description || '',
        button_text: value?.button_text || '',
    };
};

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            icon_id: value.icon_id || value.icon?.id || '',
            icon_item_id: value.icon_item_id || value.icon_item?.id || '',
            headline: value.headline || '',
            slug: value.slug || '',
            subhead_line: value.subhead_line || '',
            drop_name: value.drop_name || '',
            story_section: normalizeStorySection(value.story_section),
            starting_price: value.starting_price != null ? String(value.starting_price) : '',
            bid_increment: value.bid_increment != null ? String(value.bid_increment) : '',
            drop_date: $parseDateValue(value.drop_date),
            end_date: $parseDateValue(value.end_date),
            delivery_days: value.delivery_days != null ? String(value.delivery_days) : '',
            popcorn_threshold_minutes: value.popcorn_threshold_minutes != null ? String(value.popcorn_threshold_minutes) : '',
            popcorn_extension_minutes: value.popcorn_extension_minutes != null ? String(value.popcorn_extension_minutes) : '',
            is_exclusive: value.is_exclusive || 0,
            profile_completion_required: value.profile_completion_required || 0,
            bg_image: value.bg_image || '',
            summary_image: value.summary_image || '',
            portfolio_image: value.portfolio_image || '',
            congratulation_gallery: normalizeCongratulationGallery(value.congratulation_gallery),
            difference_bg_image: value.difference_bg_image || '',
            difference_cards: normalizeDifferenceCards(value.difference_cards),
            status: value.status || 0,
            media_clues: normalizeMediaClues(value.media_clues),
        };
        isExclusiveChecked.value = value.is_exclusive == 1;
        isProfileCompletionRequiredChecked.value = value.profile_completion_required == 1;
        isChecked.value = value.status == 1;
    } else {
        formData.value = getDefaultFormData();
        isExclusiveChecked.value = false;
        isProfileCompletionRequiredChecked.value = false;
        isChecked.value = false;
    }
}, { immediate: true });

// Auto-generate slug from `headline` when creating or when slug is empty
watch(() => formData.value.headline, (val) => {
    if (!val) return;
    if (props.modalTitle === 'Create' || !formData.value.slug) {
        formData.value.slug = $slugify(val);
    }
});

const isIconItemsLoading = ref(false);
const iconItems = ref([]);
const loadIconItems = async () => {
    isIconItemsLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/icon-items`, {
            method: 'GET',
        });
        iconItems.value = getData.data.data;
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
        const getData = await $fetchAdmin(`v1/admin/icons`, {
            method: 'GET',
        });
        iconList.value = getData.data.data;
    } catch (e) {
    } finally {
        isIconsLoading.value = false;
    }
};

onMounted(() => {
    loadIcons();
    loadIconItems();
});

const setBgImage = (photo) => {
    formData.value.bg_image = photo;
}

const setDifferenceBgImage = (photo) => {
    formData.value.difference_bg_image = photo;
}

const setStorySectionBgImage = (photo) => {
    if (!formData.value.story_section) {
        formData.value.story_section = normalizeStorySection(null);
    }
    formData.value.story_section.bg_image = photo;
}

const addDifferenceCard = () => {
    formData.value.difference_cards.push({ icon_first_name: '', image: '', is_description: false, description: '' });
}

const removeDifferenceCard = (index) => {
    formData.value.difference_cards.splice(index, 1);
}

const setDifferenceCardImage = (photo, index) => {
    if (!formData.value.difference_cards[index]) return;
    formData.value.difference_cards[index].image = photo;
}

const toggleDifferenceCardDescription = (index) => {
    if (!formData.value.difference_cards[index]) return;
    formData.value.difference_cards[index].is_description = !formData.value.difference_cards[index].is_description;
}

const setSummaryImage = (photo) => {
    formData.value.summary_image = photo;
}

const setPortfolioImage = (photo) => {
    formData.value.portfolio_image = photo;
}

const setCongratulationGallery = (photos) => {
    formData.value.congratulation_gallery = photos;
}

const handleStatusChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
}

const handleIsExclusiveChange = () => {
    formData.value.is_exclusive = isExclusiveChecked.value ? 1 : 0;
}

const handleProfileCompletionRequiredChange = () => {
    formData.value.profile_completion_required = isProfileCompletionRequiredChecked.value ? 1 : 0;
}

// Media Clues management
const addMediaClue = () => {
    formData.value.media_clues.push({ name: '', asset: '', timer: null });
}

const removeMediaClue = (index) => {
    formData.value.media_clues.splice(index, 1);
}

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'drop_name',
    'delivery_days',
    'is_exclusive',
    'profile_completion_required',
    'bg_image',
    'summary_image',
    'portfolio_image',
    'congratulation_gallery',
    'media_clues',
    'difference_bg_image',
    'difference_cards',
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

        // coerce numeric string inputs back to numbers for API
        ['starting_price', 'bid_increment', 'delivery_days', 'popcorn_threshold_minutes', 'popcorn_extension_minutes'].forEach((k) => {
            if (submitData[k] !== '' && submitData[k] !== null && submitData[k] !== undefined) {
                const num = Number(submitData[k])
                submitData[k] = Number.isNaN(num) ? submitData[k] : num
            }
        })

        submitData.drop_date = $submitDateTimeFormat(submitData.drop_date);
        submitData.end_date = $submitDateTimeFormat(submitData.end_date);

        // Format media clue timers for API (YYYY-MM-DD HH:mm:ss)
        if (Array.isArray(submitData.media_clues)) {
            submitData.media_clues = submitData.media_clues.map((clue) => ({
                ...clue,
                timer: clue?.timer ? $submitDateTimeFormat(clue.timer) : null,
            }));
        }

        // Keep image URL fields in the payload so backend receives selected image values
        // (MediaGallery provides image URLs; do not remove them here)

        // Format media clue timers for API (YYYY-MM-DD HH:mm:ss)
        if (Array.isArray(submitData.media_clues)) {
            submitData.media_clues = submitData.media_clues.map((clue) => ({
                ...clue,
                timer: clue?.timer ? $submitDateTimeFormat(clue.timer) : null,
            }));
        }

        const getData = await $fetchAdmin(`v1/admin/auctions/${props.item.id}`, {
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
        const submitData = { ...formData.value };

        // coerce numeric string inputs back to numbers for API
        ['starting_price', 'bid_increment', 'delivery_days', 'popcorn_threshold_minutes', 'popcorn_extension_minutes'].forEach((k) => {
            if (submitData[k] !== '' && submitData[k] !== null && submitData[k] !== undefined) {
                const num = Number(submitData[k])
                submitData[k] = Number.isNaN(num) ? submitData[k] : num
            }
        })

        submitData.drop_date = $submitDateTimeFormat(submitData.drop_date);
        submitData.end_date = $submitDateTimeFormat(submitData.end_date);

        const getData = await $fetchAdmin(`v1/admin/auctions`, {
            method: 'POST',
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
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '75rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Auction</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Icon</label>
                <Select v-model="formData.icon_id" :options="iconList" filter optionLabel="name" optionValue="id"
                    placeholder="Select Icon" class="w-full" :loading="isIconsLoading"
                    @focus="validations_errors.icon_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.icon_id" />
            </div>

            <div>
                <label class="font-semibold">Icon Item</label>
                <Select v-model="formData.icon_item_id" :options="iconItems" filter optionLabel="name" optionValue="id"
                    placeholder="Select Icon Item" class="w-full" :loading="isIconItemsLoading"
                    @focus="validations_errors.icon_item_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.icon_item_id" />
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
                <label class="font-semibold">Slug</label>
                <LazyInputText v-model="formData.slug" class="w-full"
                    :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.slug = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
            </div>

            <div>
                <label class="font-semibold">Drop Name</label>
                <LazyInputText v-model="formData.drop_name" class="w-full"
                    :class="validations_errors.drop_name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.drop_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.drop_name" />
            </div>

            <div>
                <label class="font-semibold">Starting Price</label>
                <LazyInputText v-model="formData.starting_price" type="number" class="w-full"
                    :class="validations_errors.starting_price ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.starting_price = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.starting_price" />
            </div>

            <div>
                <label class="font-semibold">Bid Increment</label>
                <LazyInputText v-model="formData.bid_increment" type="number" class="w-full"
                    :class="validations_errors.bid_increment ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.bid_increment = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.bid_increment" />
            </div>

            <div>
                <label class="font-semibold">Drop Date</label>
                <DatePicker v-model="formData.drop_date" showIcon fluid iconDisplay="input" :manualInput="false"
                    class="w-full" :class="validations_errors.drop_date ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.drop_date = ''" showTime hourFormat="24" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.drop_date" />
            </div>

            <div>
                <label class="font-semibold">End Date</label>
                <DatePicker v-model="formData.end_date" showIcon fluid iconDisplay="input" :manualInput="false"
                    class="w-full" :class="validations_errors.end_date ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.end_date = ''" showTime hourFormat="24" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.end_date" />
            </div>

            <div>
                <label class="font-semibold">Delivery Days</label>
                <LazyInputText v-model="formData.delivery_days" type="number" class="w-full"
                    :class="validations_errors.delivery_days ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.delivery_days = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.delivery_days" />
            </div>

            <div>
                <label class="font-semibold">Popcorn Threshold Minutes</label>
                <LazyInputText v-model="formData.popcorn_threshold_minutes" type="number" class="w-full"
                    :class="validations_errors.popcorn_threshold_minutes ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.popcorn_threshold_minutes = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.popcorn_threshold_minutes" />
            </div>

            <div>
                <label class="font-semibold">Popcorn Extension Minutes</label>
                <LazyInputText v-model="formData.popcorn_extension_minutes" type="number" class="w-full"
                    :class="validations_errors.popcorn_extension_minutes ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.popcorn_extension_minutes = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.popcorn_extension_minutes" />
            </div>

            <!-- Images Section -->
            <div
                class="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4">
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
            </div>

            <!-- Congratulation Gallery -->
            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <label class="font-semibold block mb-3">Congratulation Gallery</label>
                <MediaGallery :getPhoto="formData.congratulation_gallery" :multiple="true"
                    @set_photo="setCongratulationGallery" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.congratulation_gallery" />
            </div>

            <!-- Media Clues Section -->
            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Media Clues</label>
                    <Button type="button" label="Add Clue" icon="pi pi-plus" severity="success" @click="addMediaClue" />
                </div>

                <div v-if="formData.media_clues.length === 0" class="text-sm text-gray-500 mb-2">
                    No media clues added yet.
                </div>

                <div v-for="(clue, index) in formData.media_clues" :key="index"
                    class="border border-gray-200 rounded-lg p-4 mb-3">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-semibold text-sm">Clue {{ index + 1 }}</span>
                        <Button type="button" label="Remove" severity="danger" outlined size="small"
                            @click="removeMediaClue(index)" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="font-semibold text-sm">Name</label>
                            <LazyInputText v-model="clue.name" class="w-full" placeholder="Clue name"
                                autocomplete="off" />
                        </div>
                        <div>
                            <label class="font-semibold text-sm">Reveal Date</label>
                            <DatePicker v-model="clue.timer" class="w-full mt-1 h-[46px]" showTime hourFormat="24" />
                        </div>
                        <div>
                            <label class="font-semibold text-sm">Asset</label>
                            <MediaGallery :getPhoto="clue.asset" @set_photo="(photo) => clue.asset = photo" />
                        </div>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.media_clues" />
            </div>

            <!-- Difference Section -->
            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Difference Section</label>
                </div>

                <div class="mb-4">
                    <label class="font-semibold">Difference Background Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.difference_bg_image" @set_photo="setDifferenceBgImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.difference_bg_image" />
                </div>

                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Difference Cards</label>
                    <Button type="button" label="Add Card" icon="pi pi-plus" severity="success"
                        @click="addDifferenceCard" />
                </div>

                <div v-if="formData.difference_cards.length === 0" class="text-sm text-gray-500 mb-2">
                    No difference cards added yet.
                </div>

                <div v-for="(card, index) in formData.difference_cards" :key="index"
                    class="border border-gray-200 rounded-lg p-4 mb-3">
                    <div class="flex justify-between items-center mb-3">
                        <span class="font-semibold text-sm">Card {{ index + 1 }}</span>
                        <Button type="button" label="Remove" severity="danger" outlined size="small"
                            @click="removeDifferenceCard(index)" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="font-semibold text-sm">Icon First Name</label>
                            <LazyInputText v-model="card.icon_first_name" class="w-full" placeholder="First name"
                                autocomplete="off" />
                        </div>

                        <div>
                            <label class="font-semibold text-sm">Image</label>
                            <MediaGallery :getPhoto="card.image"
                                @set_photo="(photo) => setDifferenceCardImage(photo, index)" />
                        </div>

                        <div>
                            <label class="font-semibold text-sm">Has Description</label>
                            <ToggleSwitch v-model="card.is_description" />
                        </div>
                    </div>

                    <div v-if="card.is_description" class="mt-3">
                        <label class="font-semibold text-sm">Description</label>
                        <LazyInputText v-model="card.description" class="w-full" placeholder="Description"
                            autocomplete="off" />
                    </div>
                </div>

                <LazyInputError class="text-sm mt-1" :message="validations_errors.difference_cards" />
            </div>

            <!-- Story Section -->
            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Story Section</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Headline</label>
                        <LazyInputText v-model="formData.story_section.headline" class="w-full"
                            placeholder="Story headline" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Subhead Line</label>
                        <LazyInputText v-model="formData.story_section.subhead_line" class="w-full"
                            placeholder="Story subhead" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Button Text</label>
                        <LazyInputText v-model="formData.story_section.button_text" class="w-full"
                            placeholder="Button text" autocomplete="off" />
                    </div>
                </div>

                <div class="mt-4">
                    <label class="font-semibold text-sm">Description</label>
                    <Textarea v-model="formData.story_section.description" rows="3" class="w-full" autocomplete="off" />
                </div>

                <div class="mt-4">
                    <label class="font-semibold text-sm">Story Background Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.story_section.bg_image" @set_photo="setStorySectionBgImage" />
                    </div>
                </div>
            </div>

            <!-- Toggle Switches -->
            <div class="flex items-center gap-3">
                <label class="font-semibold">Is Exclusive</label>
                <ToggleSwitch v-model="isExclusiveChecked" @change="handleIsExclusiveChange"
                    @focus="validations_errors.is_exclusive = ''" />
            </div>

            <div class="flex items-center gap-3">
                <label class="font-semibold">Profile Completion Required</label>
                <ToggleSwitch v-model="isProfileCompletionRequiredChecked"
                    @change="handleProfileCompletionRequiredChange"
                    @focus="validations_errors.profile_completion_required = ''" />
            </div>

            <div class="flex items-center gap-3">
                <label class="font-semibold">Status</label>
                <ToggleSwitch v-model="isChecked" @change="handleStatusChange"
                    @focus="validations_errors.status = ''" />
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
