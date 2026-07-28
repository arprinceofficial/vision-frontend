<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);
const { $slugify } = useNuxtApp();

const visible = computed({
    get: () => props.isOpenModal,
    set: (value) => {
        if (!value) emit('close');
    }
});

const getInitialFormData = () => ({
    id: null,
    slug: '',
    retail_status: '',
    name: '',
    subtitle: '',
    price: '',
    year: '',
    make: '',
    model: '',
    mileage: '',
    engine: '',
    transmission: '',
    drive_type: '',
    body: '',
    exterior_colour: '',
    interior_colour: '',
    location: '',
    vin: '',
    hero_image: '',
    card_image: '',
    excerpt: '',
    highlights: [],
    specs: [],
    sections: [],
    gallery: [],
    description: '',
});

const formData = ref(getInitialFormData());
const validations_errors = ref({});

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
        return item?.title || item?.text || item?.name || item?.value || '';
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

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            slug: value.slug || '',
            retail_status: value.retail_status || value.status || '',
            name: value.name || value.title || '',
            subtitle: value.subtitle || '',
            price: toInputValue(value.price),
            year: toInputValue(value.year),
            make: value.make || '',
            model: value.model || '',
            mileage: toInputValue(value.mileage),
            engine: value.engine || '',
            transmission: value.transmission || '',
            drive_type: value.drive_type || value.drive || '',
            body: value.body || '',
            exterior_colour: value.exterior_colour || value.exteriorColour || '',
            interior_colour: value.interior_colour || value.interiorColour || '',
            location: value.location || '',
            vin: value.vin || '',
            hero_image: getImagePath(value.hero_image || value.heroImage),
            card_image: getImagePath(value.card_image || value.cardImage),
            excerpt: value.excerpt || '',
            highlights: normalizeStringArray(value.highlights),
            specs: normalizeSpecs(value.specs),
            sections: normalizeSections(value.sections),
            gallery: normalizeGallery(value.gallery),
            description: value.description || '',
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

const setImage = (field, photo) => {
    formData.value[field] = getImagePath(photo);
};

const setGallery = (photos) => {
    formData.value.gallery = normalizeImageArray(photos);
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

const requiredFields = [
    'slug',
    'name',
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

const serializeSubmitData = () => ({
    slug: formData.value.slug,
    retail_status: formData.value.retail_status,
    name: formData.value.name,
    subtitle: formData.value.subtitle,
    price: formData.value.price,
    year: formData.value.year,
    make: formData.value.make,
    model: formData.value.model,
    mileage: formData.value.mileage,
    engine: formData.value.engine,
    transmission: formData.value.transmission,
    drive_type: formData.value.drive_type,
    body: formData.value.body,
    exterior_colour: formData.value.exterior_colour,
    interior_colour: formData.value.interior_colour,
    location: formData.value.location,
    vin: formData.value.vin,
    hero_image: formData.value.hero_image,
    card_image: formData.value.card_image,
    excerpt: formData.value.excerpt,
    highlights: formData.value.highlights.filter(Boolean),
    specs: formData.value.specs.filter((item) => item.label || item.value),
    sections: formData.value.sections
        .map((item) => ({
            heading: item.heading,
            paragraphs: item.paragraphs.filter(Boolean),
            bullets: item.bullets.filter(Boolean),
        }))
        .filter((item) => item.heading || item.paragraphs.length || item.bullets.length),
    gallery: normalizeImageArray(formData.value.gallery),
    description: formData.value.description,
});

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
        const getData = await $fetchAdmin(`v1/admin/retail-cars/${props.item.id}`, {
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
        const getData = await $fetchAdmin('v1/admin/retail-cars', {
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
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false"
        :style="{ width: '88rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Retail Car</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Name</label>
                <LazyInputText v-model="formData.name" class="w-full"
                    :class="validations_errors.name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.name" />
            </div>

            <div>
                <label class="font-semibold">Slug</label>
                <LazyInputText v-model="formData.slug" class="w-full"
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

            <div class="sm:col-span-3">
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
                <label class="font-semibold">Year</label>
                <LazyInputText v-model="formData.year" class="w-full" autocomplete="off"
                    @focus="validations_errors.year = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.year" />
            </div>

            <div>
                <label class="font-semibold">Mileage</label>
                <LazyInputText v-model="formData.mileage" class="w-full" autocomplete="off"
                    @focus="validations_errors.mileage = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.mileage" />
            </div>

            <div>
                <label class="font-semibold">Make</label>
                <LazyInputText v-model="formData.make" class="w-full" autocomplete="off"
                    @focus="validations_errors.make = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.make" />
            </div>

            <div>
                <label class="font-semibold">Model</label>
                <LazyInputText v-model="formData.model" class="w-full" autocomplete="off"
                    @focus="validations_errors.model = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.model" />
            </div>

            <div>
                <label class="font-semibold">VIN</label>
                <LazyInputText v-model="formData.vin" class="w-full" autocomplete="off"
                    @focus="validations_errors.vin = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.vin" />
            </div>

            <div>
                <label class="font-semibold">Engine</label>
                <LazyInputText v-model="formData.engine" class="w-full" autocomplete="off"
                    @focus="validations_errors.engine = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.engine" />
            </div>

            <div>
                <label class="font-semibold">Transmission</label>
                <LazyInputText v-model="formData.transmission" class="w-full" autocomplete="off"
                    @focus="validations_errors.transmission = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.transmission" />
            </div>

            <div>
                <label class="font-semibold">Drive Type</label>
                <LazyInputText v-model="formData.drive_type" class="w-full" autocomplete="off"
                    @focus="validations_errors.drive_type = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.drive_type" />
            </div>

            <div>
                <label class="font-semibold">Body</label>
                <LazyInputText v-model="formData.body" class="w-full" autocomplete="off"
                    @focus="validations_errors.body = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.body" />
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

            <div class="sm:col-span-3">
                <label class="font-semibold">Excerpt</label>
                <Textarea v-model="formData.excerpt" class="w-full" rows="3" autocomplete="off"
                    @focus="validations_errors.excerpt = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.excerpt" />
            </div>

            <div class="sm:col-span-3">
                <label class="font-semibold">Description</label>
                <Textarea v-model="formData.description" class="w-full" rows="4" autocomplete="off"
                    @focus="validations_errors.description = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.description" />
            </div>

            <div class="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4">
                <div>
                    <label class="font-semibold">Hero Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.hero_image" @set_photo="(photo) => setImage('hero_image', photo)" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.hero_image" />
                </div>

                <div>
                    <label class="font-semibold">Card Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.card_image" @set_photo="(photo) => setImage('card_image', photo)" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.card_image" />
                </div>

                <div>
                    <label class="font-semibold">Gallery</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.gallery" :multiple="true" @set_photo="setGallery" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.gallery" />
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
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

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Specs</h5>
                    <Button type="button" label="Add Spec" class="text-xs" @click="addSpec" />
                </div>
                <div class="space-y-3">
                    <div v-for="(spec, index) in formData.specs" :key="`spec-${index}`"
                        class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                        <LazyInputText v-model="spec.label" class="w-full" placeholder="Label" autocomplete="off" />
                        <LazyInputText v-model="spec.value" class="w-full" placeholder="Value" autocomplete="off" />
                        <i @click="removeSpec(index)"
                            class="fa-solid fa-trash text-red-500 hover:text-red-800 cursor-pointer transition duration-150 ease-in-out"></i>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.specs" />
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
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
