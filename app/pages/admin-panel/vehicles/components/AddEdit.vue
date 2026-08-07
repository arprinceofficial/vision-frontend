<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close']);
const { $slugify } = useNuxtApp();

const activeTab = ref('basic');

const formTabs = [
    { key: 'basic', label: 'Basic Info', desc: 'Core vehicle info & description', icon: 'pi pi-info-circle' },
    { key: 'financials', label: 'Syndicate', desc: 'Syndicate total & allocation cost', icon: 'pi pi-dollar' },
    { key: 'media', label: 'Media & Gallery', desc: 'Asset images & highlights list', icon: 'pi pi-images' },
    { key: 'sections', label: 'Page Sections', desc: 'Custom content headers & bullets', icon: 'pi pi-file-edit' },
    { key: 'technical', label: 'Tech Details', desc: 'Engine specs, mileage, and gallery', icon: 'pi pi-cog' },
];

const statusOptions = [
    { name: 'Inactive', value: 0 },
    { name: 'Active', value: 1 },
    { name: 'Retail', value: 2 },
    { name: 'Basic', value: 3 },
    { name: 'Regular', value: 4 },
    { name: 'Upcoming', value: 5 },
    { name: 'On Live', value: 6 },
];

const currentTabIndex = computed(() => formTabs.findIndex(tab => tab.key === activeTab.value));
const isFirstTab = computed(() => currentTabIndex.value === 0);
const isLastTab = computed(() => currentTabIndex.value === formTabs.length - 1);

const nextTab = () => {
    if (currentTabIndex.value < formTabs.length - 1) {
        activeTab.value = formTabs[currentTabIndex.value + 1].key;
    }
};

const prevTab = () => {
    if (currentTabIndex.value > 0) {
        activeTab.value = formTabs[currentTabIndex.value - 1].key;
    }
};

const visible = computed({
    get: () => props.isOpenModal,
    set: (value) => {
        if (!value) emit('close');
    }
});

// Reset tab when modal opens
watch(() => props.isOpenModal, (newVal) => {
    if (newVal) {
        activeTab.value = 'basic';
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
    status: 0,
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
    status: 0,
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
    status: value.status !== undefined && value.status !== null ? Number(value.status) : 0,
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
            status: value.status !== undefined && value.status !== null ? Number(value.status) : 0,
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
    status: Number(value.status),
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
        status: Number(formData.value.status),
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

const setDetailVideo = (photo) => {
    formData.value.detail.video_path = getImagePath(photo);
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
    <Dialog v-model:visible="visible" modal :closable="false" :maximized="true"
        class="fullscreen-dialog-modern" maskClass="fullscreen-dialog-mask" @update:visible="$emit('close')">
        
        <div class="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 font-sans">
            <!-- Modern Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 shadow-sm">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <i class="pi pi-car text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {{ modalTitle }} Vehicle
                        </h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Manage vehicle profiles, specifications, syndicate data, and gallery assets
                        </p>
                    </div>
                </div>
                
                <button type="button" 
                    class="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150" 
                    @click="$emit('close')">
                    <i class="pi pi-times text-sm"></i>
                </button>
            </div>

            <!-- Stepper Content Container -->
            <div class="flex-1 flex overflow-hidden">
                <!-- Left Sidebar Timeline / Steps -->
                <div class="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col justify-between overflow-y-auto hidden md:flex">
                    <div class="space-y-6">
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
                            Steps & Progress
                        </span>
                        
                        <div class="relative flex flex-col gap-8 pl-1">
                            <!-- Connecting Line -->
                            <div class="absolute left-[1.125rem] top-3 bottom-3 w-[2px] bg-gray-200 dark:bg-gray-800 z-0"></div>
                            
                            <div class="absolute left-[1.125rem] top-3 w-[2px] bg-emerald-500 transition-all duration-500 z-0" 
                                :style="{ height: `${(currentTabIndex / (formTabs.length - 1)) * 90}%` }"></div>

                            <!-- Steps -->
                            <button v-for="(tab, index) in formTabs" :key="tab.key" type="button"
                                class="relative flex items-start gap-4 text-left group focus:outline-none"
                                @click="activeTab = tab.key">
                                
                                <div class="relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300"
                                    :class="[
                                        activeTab === tab.key 
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' 
                                            : index < currentTabIndex 
                                                ? 'border-emerald-500 bg-emerald-500 text-white' 
                                                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-400 group-hover:border-gray-400'
                                    ]"
                                    style="width: 26px; height: 26px; min-width: 26px; min-height: 26px;">
                                    <i v-if="index < currentTabIndex" class="pi pi-check text-[10px] font-bold"></i>
                                    <span v-else class="text-[10px] font-bold">{{ index + 1 }}</span>
                                </div>

                                <div class="flex flex-col">
                                    <span class="text-sm font-semibold transition-colors duration-200"
                                        :class="[
                                            activeTab === tab.key 
                                                ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                                                : index < currentTabIndex 
                                                    ? 'text-gray-900 dark:text-gray-100 font-medium' 
                                                    : 'text-gray-500 dark:text-gray-400'
                                        ]">
                                        {{ tab.label }}
                                    </span>
                                    <span class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                                        {{ tab.desc }}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div class="border-t border-gray-100 dark:border-gray-800 pt-4 mt-6">
                        <div class="flex items-center gap-2 text-xs text-gray-400">
                            <i class="pi pi-shield"></i>
                            <span>Validated & secure changes</span>
                        </div>
                    </div>
                </div>

                <!-- Main Form Inputs Area -->
                <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 md:p-10">
                    <div class="w-full space-y-6">
                        
                        <div class="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                                {{ formTabs[currentTabIndex].label }}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ formTabs[currentTabIndex].desc }}
                            </p>
                        </div>

                        <!-- Basic Tab Content -->
                        <div v-show="activeTab === 'basic'" class="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800/80 shadow-sm">
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

                            <div class="sm:col-span-2">
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

                            <div>
                                <label class="font-semibold">Status</label>
                                <Select v-model="formData.status" :options="statusOptions" optionLabel="name" optionValue="value"
                                    class="w-full" placeholder="Select Status" @focus="validations_errors.status = ''" />
                                <LazyInputError class="text-sm mt-1" :message="validations_errors.status" />
                            </div>

                            <div class="sm:col-span-3">
                                <label class="font-semibold">Excerpt</label>
                                <Editor v-model="formData.excerpt" editorStyle="height: 120px" class="w-full" />
                                <LazyInputError class="text-sm mt-1" :message="validations_errors.excerpt" />
                            </div>

                            <div class="sm:col-span-3">
                                <label class="font-semibold">Description</label>
                                <Editor v-model="formData.description" editorStyle="height: 180px" class="w-full" />
                                <LazyInputError class="text-sm mt-1" :message="validations_errors.description" />
                            </div>

                            <div class="sm:col-span-3">
                                <label class="font-semibold">Body</label>
                                <Editor v-model="formData.body" editorStyle="height: 180px" class="w-full" />
                                <LazyInputError class="text-sm mt-1" :message="validations_errors.body" />
                            </div>

                            <div class="sm:col-span-3">
                                <label class="font-semibold">Investment Thesis</label>
                                <Editor v-model="formData.investment_thesis" editorStyle="height: 180px" class="w-full" />
                                <LazyInputError class="text-sm mt-1" :message="validations_errors.investment_thesis" />
                            </div>
                        </div>

                        <!-- Financials Tab Content -->
                        <div v-show="activeTab === 'financials'" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
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

                        <!-- Media Tab Content -->
                        <div v-show="activeTab === 'media'" class="grid grid-cols-1 gap-6">
                            <div class="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
                                <h5 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Media Images</h5>
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

                            <div class="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
                                <div class="flex items-center justify-between gap-3 mb-3">
                                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Highlights</h5>
                                    <Button type="button" icon="pi pi-plus" severity="success" @click="addListItem('highlights')" />
                                </div>
                                <div class="space-y-3">
                                    <div v-for="(highlight, index) in formData.highlights" :key="`highlight-${index}`"
                                        class="flex items-center gap-3">
                                        <LazyInputText v-model="formData.highlights[index]" class="w-full" autocomplete="off" />
                                        <Button type="button" icon="pi pi-trash" severity="danger" outlined @click="removeListItem('highlights', index)" />
                                    </div>
                                </div>
                                <LazyInputError class="text-sm mt-1" :message="validations_errors.highlights" />
                            </div>

                            <div class="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
                                <div class="flex items-center justify-between gap-3 mb-3">
                                    <h5 class="font-semibold text-gray-800 dark:text-gray-100">Specs</h5>
                                    <Button type="button" icon="pi pi-plus" severity="success" @click="addSpec" />
                                </div>
                                <div class="space-y-3">
                                    <div v-for="(spec, index) in formData.specs" :key="`spec-${index}`"
                                        class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                                        <LazyInputText v-model="spec.label" class="w-full" placeholder="Label" autocomplete="off" />
                                        <LazyInputText v-model="spec.value" class="w-full" placeholder="Value" autocomplete="off" />
                                        <Button type="button" icon="pi pi-trash" severity="danger" outlined @click="removeSpec(index)" />
                                    </div>
                                </div>
                                <LazyInputError class="text-sm mt-1" :message="validations_errors.specs" />
                            </div>
                        </div>

                        <!-- Sections Tab Content -->
                        <div v-show="activeTab === 'sections'" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
                            <div class="flex items-center justify-between gap-3 mb-3">
                                <h5 class="font-semibold text-gray-800 dark:text-gray-100">Sections</h5>
                                <Button type="button" icon="pi pi-plus" severity="success" @click="addSection" />
                            </div>
                            <div class="space-y-5">
                                <div v-for="(section, sectionIndex) in formData.sections" :key="`section-${sectionIndex}`"
                                    class="border border-gray-200 dark:border-gray-850 rounded-xl p-6 bg-gray-50 dark:bg-gray-955 shadow-inner">
                                    <div class="flex items-center justify-between gap-3 mb-3">
                                        <LazyInputText v-model="section.heading" class="w-full" placeholder="Heading"
                                            autocomplete="off" />
                                        <Button type="button" icon="pi pi-trash" severity="danger" outlined @click="removeSection(sectionIndex)" />
                                    </div>

                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <div class="flex items-center justify-between gap-3 mb-2">
                                                <label class="font-semibold">Paragraphs</label>
                                                <Button type="button" icon="pi pi-plus" severity="success"
                                                    @click="addSectionListItem(sectionIndex, 'paragraphs')" />
                                            </div>
                                            <div class="space-y-3">
                                                <div v-for="(paragraph, paragraphIndex) in section.paragraphs"
                                                    :key="`paragraph-${sectionIndex}-${paragraphIndex}`"
                                                    class="flex items-start gap-3">
                                                    <Editor v-model="section.paragraphs[paragraphIndex]" editorStyle="height: 100px" class="w-full" />
                                                    <Button type="button" icon="pi pi-trash" severity="danger" outlined @click="removeSectionListItem(sectionIndex, 'paragraphs', paragraphIndex)" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex items-center justify-between gap-3 mb-2">
                                                <label class="font-semibold">Bullets</label>
                                                <Button type="button" icon="pi pi-plus" severity="success"
                                                    @click="addSectionListItem(sectionIndex, 'bullets')" />
                                            </div>
                                            <div class="space-y-3">
                                                <div v-for="(bullet, bulletIndex) in section.bullets"
                                                    :key="`bullet-${sectionIndex}-${bulletIndex}`"
                                                    class="flex items-center gap-3">
                                                    <LazyInputText v-model="section.bullets[bulletIndex]" class="w-full"
                                                        autocomplete="off" />
                                                    <Button type="button" icon="pi pi-trash" severity="danger" outlined @click="removeSectionListItem(sectionIndex, 'bullets', bulletIndex)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <LazyInputError class="text-sm mt-1" :message="validations_errors.sections" />
                        </div>

                        <!-- Technical Details Tab Content -->
                        <div v-show="activeTab === 'technical'" class="w-full border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-sm">
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
                                    <div class="w-full mt-2">
                                        <MediaGallery :getPhoto="formData.detail.video_path" @set_photo="setDetailVideo" />
                                    </div>
                                </div>

                                <div>
                                    <label class="font-semibold">Status</label>
                                    <Select v-model="formData.detail.status" :options="statusOptions" optionLabel="name" optionValue="value"
                                        class="w-full" placeholder="Select Status" />
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
                </div>
            </div>

            <!-- Footer area with buttons -->
            <div class="flex justify-between items-center px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 shadow-md">
                <!-- Left side: Cancel -->
                <Button type="button" label="Cancel" severity="danger" outlined
                    class="transition-all duration-300 hover:scale-105 border border-red-500/30 hover:bg-red-55 dark:hover:bg-red-950/20" 
                    @click="$emit('close')">
                    <template #icon="{ class: iconClass }">
                        <i class="pi pi-times-circle mr-2" :class="iconClass"></i>
                    </template>
                </Button>
                
                <!-- Right side: Prev, Next, Submit -->
                <div class="flex items-center gap-3">
                    <Button v-if="isLoading" severity="secondary" style="cursor: not-allowed; width: 80px;">
                        <ProgressSpinner style="width: 25px; height: 25px" strokeWidth="8" animationDuration=".5s" />
                    </Button>
                    <template v-else>
                        <Button v-if="!isFirstTab" type="button" label="Previous" severity="secondary" outlined
                            class="border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            @click="prevTab">
                            <template #icon="{ class: iconClass }">
                                <i class="pi pi-arrow-left mr-2" :class="iconClass"></i>
                            </template>
                        </Button>
                        
                        <Button v-if="!isLastTab" type="button" label="Next" severity="success"
                            class="bg-emerald-500 hover:bg-emerald-600 border-none transition text-white font-semibold"
                            @click="nextTab">
                            <template #icon="{ class: iconClass }">
                                <i class="pi pi-arrow-right ml-2" :class="iconClass"></i>
                            </template>
                        </Button>

                        <Button type="button" :label="modalTitle === 'Create' ? 'Create Vehicle' : 'Update Vehicle'" 
                            :severity="isLastTab ? 'success' : 'secondary'"
                            :outlined="!isLastTab"
                            raised class="transition duration-150 hover:shadow-lg font-semibold"
                            @click="modalTitle === 'Create' ? createHandler() : updateHandler()">
                            <template #icon="{ class: iconClass }">
                                <i :class="modalTitle === 'Create' ? 'pi pi-plus-circle mr-2' : 'pi pi-refresh mr-2'"></i>
                            </template>
                        </Button>
                    </template>
                </div>
            </div>
        </div>
    </Dialog>
    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss">
.fullscreen-dialog-mask {
    padding: 0 !important;
}

.fullscreen-dialog-modern {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;

    .p-dialog-content {
        padding: 0 !important;
        overflow: hidden !important;
        background: transparent !important;
        height: 100% !important;
        max-height: 100% !important;
    }
    
    .p-dialog-header, .p-dialog-footer {
        display: none !important;
    }

    // Force full-width block layout for input components and labels inside the dialog
    .p-inputnumber, .p-inputnumber input, .p-colorpicker, .p-editor-container {
        width: 100% !important;
    }

    label {
        display: block !important;
        margin-bottom: 0.5rem !important;
    }
}
</style>
