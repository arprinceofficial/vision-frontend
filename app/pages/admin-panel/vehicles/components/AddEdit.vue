<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close']);
const { $slugify } = useNuxtApp();

const visible = computed({
    get: () => props.isOpenModal,
    set: (value) => {
        if (!value) emit('close');
    }
});

const isTruthy = (value) => value === true || value == 1;

const toInputNumber = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? null : numberValue;
};

const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return value;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? value : numberValue;
};

const toInputValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const getImagePath = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.image || value?.url || value?.path || '';
};

const normalizeImageArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map(getImagePath).filter(Boolean);
};

const normalizeGallery = (value) => {
    if (Array.isArray(value)) return normalizeImageArray(value);
    if (value && typeof value === 'object') {
        return normalizeImageArray([
            ...(Array.isArray(value.exterior) ? value.exterior : []),
            ...(Array.isArray(value.interior) ? value.interior : []),
            ...(Array.isArray(value.images) ? value.images : []),
        ]);
    }
    return [];
};

const normalizeStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.title || item?.text || item?.name || item?.value || item?.body || '';
    });
};

const normalizeSpecs = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => ({
        label: toInputValue(item?.label),
        value: toInputValue(item?.value),
    }));
};

const normalizeSections = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => ({
        heading: toInputValue(item?.heading || item?.title),
        paragraphs: normalizeStringArray(item?.paragraphs),
        bullets: normalizeStringArray(item?.bullets || item?.list),
    }));
};

const getInitialDetailData = () => ({
    name: '',
    vin: '',
    mileage: null,
    condition_grade: '',
    gallery: [],
    status: false,
    engine: '',
    power: null,
    torque: null,
    seating_capacity: null,
    drive_type: '',
    transmission: '',
    year_from: null,
    three_d_image_url: '',
    video_path: '',
});

const getInitialFormData = () => ({
    id: null,
    name: '',
    make: '',
    model: '',
    year: null,
    description: '',
    status: false,
    syndicate_name: '',
    syndicate_total: null,
    allocation_cost: null,
    target_allocation: null,
    asset_image: '',
    investment_thesis: '',
    slug: '',
    subtitle: '',
    price: '',
    body: '',
    exterior_colour: '',
    interior_colour: '',
    location: '',
    hero_image: '',
    card_image: '',
    excerpt: '',
    highlights: [],
    specs: [],
    sections: [],
    retail_status: '',
    detail: getInitialDetailData(),
});

const formData = ref(getInitialFormData());
const validations_errors = ref({});

const normalizeDetailData = (value = {}) => ({
    name: value.name || '',
    vin: value.vin || '',
    mileage: toInputNumber(value.mileage),
    condition_grade: value.condition_grade || '',
    gallery: normalizeGallery(value.gallery),
    status: isTruthy(value.status),
    engine: value.engine || '',
    power: toInputNumber(value.power),
    torque: toInputNumber(value.torque),
    seating_capacity: toInputNumber(value.seating_capacity),
    drive_type: value.drive_type || '',
    transmission: toInputValue(value.transmission),
    year_from: toInputNumber(value.year_from),
    three_d_image_url: value.three_d_image_url || '',
    video_path: value.video_path || '',
});

const getDetailSource = (value = {}) => ({
    ...value,
    ...(value.detail || {}),
});

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            name: value.name || '',
            make: value.make || '',
            model: value.model || '',
            year: toInputNumber(value.year),
            description: value.description || '',
            status: isTruthy(value.status),
            syndicate_name: value.syndicate_name ?? value.syndicateName ?? '',
            syndicate_total: toInputNumber(value.syndicate_total),
            allocation_cost: toInputNumber(value.allocation_cost ?? value.allocation_Cost),
            target_allocation: toInputNumber(value.target_allocation),
            asset_image: getImagePath(value.asset_image ?? value.assetImage),
            investment_thesis: value.investment_thesis ?? value.investmentThesis ?? '',
            slug: value.slug || '',
            subtitle: value.subtitle || '',
            price: toInputValue(value.price),
            body: value.body || '',
            exterior_colour: value.exterior_colour ?? value.exteriorColour ?? '',
            interior_colour: value.interior_colour ?? value.interiorColour ?? '',
            location: value.location || '',
            hero_image: getImagePath(value.hero_image ?? value.heroImage),
            card_image: getImagePath(value.card_image ?? value.cardImage),
            excerpt: value.excerpt || '',
            highlights: normalizeStringArray(value.highlights),
            specs: normalizeSpecs(value.specs),
            sections: normalizeSections(value.sections),
            retail_status: toInputValue(value.retail_status),
            detail: normalizeDetailData(getDetailSource(value)),
        };
    } else {
        formData.value = getInitialFormData();
    }
}, { immediate: true });

watch(() => formData.value.name, (value) => {
    if (!value) return;
    if (props.modalTitle === 'Create' || !formData.value.slug) {
        formData.value.slug = $slugify(value);
    }
});

const requiredFields = [
    'slug',
    'name',
    'make',
    'model',
    'year',
    'description',
];

const isEmptyValue = (value) => value === null || value === undefined || value === '';

const validateForm = () => {
    validations_errors.value = {};
    const errors = requiredFields.filter((key) => isEmptyValue(formData.value[key]));
    if (errors.length > 0) {
        errors.forEach((key) => {
            validations_errors.value[key] = `${key.replaceAll('_', ' ')} is required`;
        });
        return false;
    }

    return true;
};

const serializeDetailData = (value) => ({
    name: value.name,
    vin: value.vin,
    mileage: toNumber(value.mileage),
    condition_grade: value.condition_grade,
    gallery: normalizeGallery(value.gallery),
    status: !!value.status,
    engine: value.engine,
    power: toNumber(value.power),
    torque: toNumber(value.torque),
    seating_capacity: toNumber(value.seating_capacity),
    drive_type: value.drive_type,
    transmission: toNumber(value.transmission),
    year_from: toNumber(value.year_from),
    three_d_image_url: value.three_d_image_url,
    video_path: value.video_path,
});

const serializeSubmitData = () => {
    return {
        name: formData.value.name,
        make: formData.value.make,
        model: formData.value.model,
        year: toNumber(formData.value.year),
        description: formData.value.description,
        status: !!formData.value.status,
        syndicate_name: formData.value.syndicate_name,
        syndicate_total: toNumber(formData.value.syndicate_total),
        allocation_cost: toNumber(formData.value.allocation_cost),
        target_allocation: toNumber(formData.value.target_allocation),
        asset_image: formData.value.asset_image,
        investment_thesis: formData.value.investment_thesis,
        slug: formData.value.slug,
        subtitle: formData.value.subtitle,
        price: toNumber(formData.value.price),
        body: formData.value.body,
        exterior_colour: formData.value.exterior_colour,
        interior_colour: formData.value.interior_colour,
        location: formData.value.location,
        hero_image: formData.value.hero_image,
        card_image: formData.value.card_image,
        excerpt: formData.value.excerpt,
        highlights: formData.value.highlights.filter(Boolean),
        specs: formData.value.specs
            .filter((item) => item.label || item.value)
            .map((item) => ({
                label: item.label,
                value: item.value,
            })),
        sections: formData.value.sections
            .map((item) => ({
                heading: item.heading,
                paragraphs: item.paragraphs.filter(Boolean),
                bullets: item.bullets.filter(Boolean),
            }))
            .filter((item) => item.heading || item.paragraphs.length || item.bullets.length),
        retail_status: toNumber(formData.value.retail_status),
        detail: serializeDetailData(formData.value.detail),
    };
};

const applyValidationErrors = (errorData) => {
    if (!errorData) return;

    for (const key in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, key)) {
            validations_errors.value[key] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
        }
    }
};

const handleSubmitError = (e) => {
    if (e.response?.status === 404 || e.response?.status === 409 || e.response?.status === 422) {
        const errorsSource = e.response?._data?.data || e.response?._data?.errors;
        applyValidationErrors(errorsSource);
        if (!Object.keys(validations_errors.value).length) {
            response_modal.value = e.response._data;
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

const isLoading = ref(false);
const response_modal = ref({});

const updateHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin(`v1/admin/vehicles/${props.item.id}`, {
            method: 'PUT',
            body: serializeSubmitData(),
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleSubmitError(e);
    } finally {
        isLoading.value = false;
    }
};

const createHandler = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        const getData = await $fetchAdmin('v1/admin/vehicles', {
            method: 'POST',
            body: serializeSubmitData(),
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
    } catch (e) {
        handleSubmitError(e);
    } finally {
        isLoading.value = false;
    }
};

const setImage = (field, photo) => {
    formData.value[field] = getImagePath(photo);
};

const setDetailGallery = (photos) => {
    formData.value.detail.gallery = normalizeGallery(photos);
};

const addListItem = (field) => {
    formData.value[field].push('');
};

const removeListItem = (field, index) => {
    formData.value[field].splice(index, 1);
};

const addSpec = () => {
    formData.value.specs.push({ label: '', value: '' });
};

const removeSpec = (index) => {
    formData.value.specs.splice(index, 1);
};

const addSection = () => {
    formData.value.sections.push({ heading: '', paragraphs: [''], bullets: [''] });
};

const removeSection = (index) => {
    formData.value.sections.splice(index, 1);
};

const addSectionListItem = (sectionIndex, field) => {
    formData.value.sections[sectionIndex][field].push('');
};

const removeSectionListItem = (sectionIndex, field, itemIndex) => {
    formData.value.sections[sectionIndex][field].splice(itemIndex, 1);
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false"
        :style="{ width: '88rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Vehicle</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Name</label>
                <LazyInputText v-model="formData.name" class="w-full" placeholder="i.e. 911 Carrera"
                    :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
            </div>

            <div>
                <label class="font-semibold">Slug</label>
                <LazyInputText v-model="formData.slug" class="w-full" placeholder="i.e. 1967-ford-mustang-fastback"
                    :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.slug = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
            </div>

            <div>
                <label class="font-semibold">Retail Status</label>
                <LazyInputText v-model="formData.retail_status" class="w-full"
                    :class="validations_errors.retail_status ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.retail_status = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.retail_status" />
            </div>

            <div>
                <label class="font-semibold">Make</label>
                <LazyInputText v-model="formData.make" class="w-full" placeholder="i.e. Porsche"
                    :class="validations_errors.make ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.make = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.make" />
            </div>

            <div>
                <label class="font-semibold">Model</label>
                <LazyInputText v-model="formData.model" class="w-full" placeholder="i.e. Carrera"
                    :class="validations_errors.model ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.model = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.model" />
            </div>

            <div>
                <label class="font-semibold">Year</label>
                <InputNumber v-model="formData.year" class="w-full" :useGrouping="false" :maxFractionDigits="0"
                    placeholder="i.e. 2025" :class="validations_errors.year ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.year = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.year" />
            </div>

            <div class="md:col-span-2">
                <label class="font-semibold">Subtitle</label>
                <LazyInputText v-model="formData.subtitle" class="w-full" autocomplete="off"
                    @focus="validations_errors.subtitle = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.subtitle" />
            </div>

            <div>
                <label class="font-semibold">Price</label>
                <LazyInputText v-model="formData.price" class="w-full" autocomplete="off"
                    @focus="validations_errors.price = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.price" />
            </div>

            <div>
                <label class="font-semibold">Exterior Colour</label>
                <LazyInputText v-model="formData.exterior_colour" class="w-full" autocomplete="off"
                    @focus="validations_errors.exterior_colour = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.exterior_colour" />
            </div>

            <div>
                <label class="font-semibold">Interior Colour</label>
                <LazyInputText v-model="formData.interior_colour" class="w-full" autocomplete="off"
                    @focus="validations_errors.interior_colour = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.interior_colour" />
            </div>

            <div>
                <label class="font-semibold">Location</label>
                <LazyInputText v-model="formData.location" class="w-full" autocomplete="off"
                    @focus="validations_errors.location = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.location" />
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="formData.status" @focus="validations_errors.status = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.status" />
                </div>
            </div>

            <div class="md:col-span-3">
                <label class="font-semibold">Excerpt</label>
                <Textarea v-model="formData.excerpt" class="w-full" rows="3" autocomplete="off"
                    @focus="validations_errors.excerpt = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.excerpt" />
            </div>

            <div class="md:col-span-3">
                <label class="font-semibold">Description</label>
                <Textarea v-model="formData.description" class="w-full" rows="4"
                    placeholder="i.e. Write your vehicle description here"
                    :class="validations_errors.description ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.description = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.description" />
            </div>

            <div class="md:col-span-3">
                <label class="font-semibold">Body</label>
                <Textarea v-model="formData.body" class="w-full" rows="5" autocomplete="off"
                    @focus="validations_errors.body = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.body" />
            </div>

            <div class="md:col-span-3">
                <label class="font-semibold">Investment Thesis</label>
                <Textarea v-model="formData.investment_thesis" class="w-full" rows="4" autocomplete="off"
                    @focus="validations_errors.investment_thesis = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.investment_thesis" />
            </div>

            <div class="md:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Syndicate Details</h5>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="font-semibold">Syndicate Name</label>
                        <LazyInputText v-model="formData.syndicate_name" class="w-full" autocomplete="off"
                            @focus="validations_errors.syndicate_name = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.syndicate_name" />
                    </div>

                    <div>
                        <label class="font-semibold">Syndicate Total</label>
                        <InputNumber v-model="formData.syndicate_total" class="w-full" :useGrouping="false"
                            :maxFractionDigits="2" @focus="validations_errors.syndicate_total = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.syndicate_total" />
                    </div>

                    <div>
                        <label class="font-semibold">Allocation Cost</label>
                        <InputNumber v-model="formData.allocation_cost" class="w-full" :useGrouping="false"
                            :maxFractionDigits="2" @focus="validations_errors.allocation_cost = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.allocation_cost" />
                    </div>

                    <div>
                        <label class="font-semibold">Target Allocation</label>
                        <InputNumber v-model="formData.target_allocation" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" @focus="validations_errors.target_allocation = ''" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.target_allocation" />
                    </div>
                </div>
            </div>

            <div class="md:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Media</h5>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold block mb-3">Asset Image</label>
                        <MediaGallery :getPhoto="formData.asset_image"
                            @set_photo="(photo) => setImage('asset_image', photo)" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.asset_image" />
                    </div>

                    <div>
                        <label class="font-semibold block mb-3">Hero Image</label>
                        <MediaGallery :getPhoto="formData.hero_image"
                            @set_photo="(photo) => setImage('hero_image', photo)" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.hero_image" />
                    </div>

                    <div>
                        <label class="font-semibold block mb-3">Card Image</label>
                        <MediaGallery :getPhoto="formData.card_image"
                            @set_photo="(photo) => setImage('card_image', photo)" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors.card_image" />
                    </div>
                </div>
            </div>

            <div class="md:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Highlights</h5>
                    <Button type="button" label="Add Highlight" class="text-xs" @click="addListItem('highlights')" />
                </div>
                <div class="space-y-3">
                    <div v-for="(highlight, index) in formData.highlights" :key="`highlight-${index}`"
                        class="flex items-center gap-3">
                        <LazyInputText v-model="formData.highlights[index]" class="w-full" autocomplete="off" />
                        <i @click="removeListItem('highlights', index)"
                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.highlights" />
            </div>

            <div class="md:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Specs</h5>
                    <Button type="button" label="Add Spec" class="text-xs" @click="addSpec" />
                </div>
                <div class="space-y-3">
                    <div v-for="(spec, index) in formData.specs" :key="`spec-${index}`"
                        class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                        <LazyInputText v-model="spec.label" class="w-full" placeholder="Label" autocomplete="off" />
                        <LazyInputText v-model="spec.value" class="w-full" placeholder="Value" autocomplete="off" />
                        <i @click="removeSpec(index)"
                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.specs" />
            </div>

            <div class="md:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Sections</h5>
                    <Button type="button" label="Add Section" class="text-xs" @click="addSection" />
                </div>
                <div class="space-y-5">
                    <div v-for="(section, sectionIndex) in formData.sections" :key="`section-${sectionIndex}`"
                        class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-center justify-between gap-3 mb-3">
                            <LazyInputText v-model="section.heading" class="w-full" placeholder="Heading"
                                autocomplete="off" />
                            <i @click="removeSection(sectionIndex)"
                                class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <div class="flex items-center justify-between gap-3 mb-2">
                                    <label class="font-semibold">Paragraphs</label>
                                    <Button type="button" label="Add Paragraph" class="text-xs"
                                        @click="addSectionListItem(sectionIndex, 'paragraphs')" />
                                </div>
                                <div class="space-y-3">
                                    <div v-for="(paragraph, paragraphIndex) in section.paragraphs"
                                        :key="`paragraph-${sectionIndex}-${paragraphIndex}`"
                                        class="flex items-start gap-3">
                                        <Textarea v-model="section.paragraphs[paragraphIndex]" class="w-full" rows="2" />
                                        <i @click="removeSectionListItem(sectionIndex, 'paragraphs', paragraphIndex)"
                                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out mt-3"></i>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="flex items-center justify-between gap-3 mb-2">
                                    <label class="font-semibold">Bullets</label>
                                    <Button type="button" label="Add Bullet" class="text-xs"
                                        @click="addSectionListItem(sectionIndex, 'bullets')" />
                                </div>
                                <div class="space-y-3">
                                    <div v-for="(bullet, bulletIndex) in section.bullets"
                                        :key="`bullet-${sectionIndex}-${bulletIndex}`"
                                        class="flex items-center gap-3">
                                        <LazyInputText v-model="section.bullets[bulletIndex]" class="w-full"
                                            autocomplete="off" />
                                        <i @click="removeSectionListItem(sectionIndex, 'bullets', bulletIndex)"
                                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.sections" />
            </div>

            <div class="md:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Detail</h5>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold">Name</label>
                        <LazyInputText v-model="formData.detail.name" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">VIN</label>
                        <LazyInputText v-model="formData.detail.vin" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Mileage</label>
                        <InputNumber v-model="formData.detail.mileage" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" />
                    </div>

                    <div>
                        <label class="font-semibold">Condition Grade</label>
                        <LazyInputText v-model="formData.detail.condition_grade" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Engine</label>
                        <LazyInputText v-model="formData.detail.engine" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Power</label>
                        <InputNumber v-model="formData.detail.power" class="w-full" :useGrouping="false" />
                    </div>

                    <div>
                        <label class="font-semibold">Torque</label>
                        <InputNumber v-model="formData.detail.torque" class="w-full" :useGrouping="false" />
                    </div>

                    <div>
                        <label class="font-semibold">Seating Capacity</label>
                        <InputNumber v-model="formData.detail.seating_capacity" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" />
                    </div>

                    <div>
                        <label class="font-semibold">Drive Type</label>
                        <LazyInputText v-model="formData.detail.drive_type" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Transmission</label>
                        <LazyInputText v-model="formData.detail.transmission" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Year From</label>
                        <InputNumber v-model="formData.detail.year_from" class="w-full" :useGrouping="false"
                            :maxFractionDigits="0" />
                    </div>

                    <div>
                        <label class="font-semibold">3D Image URL</label>
                        <LazyInputText v-model="formData.detail.three_d_image_url" class="w-full"
                            placeholder="https://example.com" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold">Video Path</label>
                        <LazyInputText v-model="formData.detail.video_path" class="w-full" autocomplete="off" />
                    </div>

                    <div class="flex items-center gap-4">
                        <label class="font-semibold">Status</label>
                        <div class="flex-auto">
                            <ToggleSwitch v-model="formData.detail.status" />
                        </div>
                    </div>

                    <div class="md:col-span-3">
                        <label class="font-semibold block mb-3">Gallery</label>
                        <MediaGallery :getPhoto="formData.detail.gallery" :multiple="true"
                            @set_photo="setDetailGallery" />
                        <LazyInputError class="text-sm mt-1" :message="validations_errors['detail.gallery']" />
                    </div>
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
    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss" scoped></style>
