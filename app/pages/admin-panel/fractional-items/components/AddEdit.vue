<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);
const { $formatDateForApi, $parseDateValue, $slugify } = useNuxtApp();

const STATUS_DRAFT = 0;
const STATUS_UPCOMING = 1;
const STATUS_LIVE = 2;
const STATUS_SOLD = 3;
const STATUS_INACTIVE = 4;

const statusOptions = [
    { name: 'Draft', value: STATUS_DRAFT },
    { name: 'Upcoming', value: STATUS_UPCOMING },
    { name: 'Live', value: STATUS_LIVE },
    { name: 'Sold', value: STATUS_SOLD },
    { name: 'Inactive', value: STATUS_INACTIVE }
];

const formTabs = [
    { key: 'basic', label: 'Basic' },
    { key: 'analysis', label: 'Analysis' },
    { key: 'media', label: 'Media' },
    { key: 'sections', label: 'CMS Sections' },
    { key: 'lists', label: 'Lists & Chart' },
    { key: 'settings', label: 'Settings' },
];

const activeTab = ref('basic');

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
    if (newVal) {
        activeTab.value = 'basic';
    }
});

const isTruthy = (value) => value === true || value == 1;

const toInputValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const getImagePath = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.image || value?.url || value?.src || value?.path || value?.photo || value?.thumbnail_image || '';
};

const normalizeImageArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map(getImagePath).filter(Boolean);
};

const normalizeStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.title || item?.text || item?.name || item?.description || item?.body || item?.value || '';
    });
};

const normalizeNumberArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'object' && item !== null) {
            return toInputValue(item.value ?? item.year ?? item.id);
        }
        return toInputValue(item);
    });
};

const normalizeMetricArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') {
            return { label: item, value: '' };
        }

        return {
            label: toInputValue(item?.label ?? item?.title ?? item?.name ?? item?.key),
            value: toInputValue(item?.value ?? item?.amount ?? item?.text ?? item?.description),
        };
    });
};

const getDefaultNewsItem = () => ({
    title: '',
    date: '',
    day: '',
    month: '',
    author: '',
    image: '',
    excerpt: '',
});

const normalizeNewsArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string' || typeof item === 'number') {
            return {
                ...getDefaultNewsItem(),
                title: toInputValue(item),
            };
        }

        return {
            title: toInputValue(item?.title ?? item?.name),
            date: toInputValue(item?.date),
            day: toInputValue(item?.day),
            month: toInputValue(item?.month),
            author: toInputValue(item?.author),
            image: getImagePath(item?.image),
            excerpt: toInputValue(item?.excerpt ?? item?.description ?? item?.summary),
        };
    });
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
    assetable_type: 'vehicle',
    assetable_id: '',
    headline: '',
    subhead_line: '',
    total_shares: '',
    available_shares: '',
    share_price: '',
    total_value: '',
    historical_value: '',
    annual_fees: '',
    aum_trust_fee: '',
    portfolio_video: '',
    is_exclusive: false,
    is_fractional: true,
    bg_image: '',
    summary_image: '',
    portfolio_image: '',
    status: 0,
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
    conservative_case: '',
    aspirational_case: '',
    projected_value_image: '',
    analysis_summary_pdf: '',
    net_returns_title: '',
    funded_current_price: '',
    exit_value: '',
    exit_date: null,
    funded_at: null,
    key_points: [],
    opportunity_summary: [],
    investment_thesis_description: '',
    why_this_asset_description: '',
    trust_name: '',
    asset_name: '',
    asset_cost: '',
    asset_curation_fee: '',
    home_syndicate_total: '',
    holding_period: '',
    this_car_eyebrow: '',
    this_car_lead: '',
    this_car_conclusion: '',
    wider_market_eyebrow: '',
    wider_market_lead: '',
    wider_market_conclusion: '',
    net_returns_eyebrow: '',
    net_returns_lead: '',
    net_returns_conclusion: '',
    allocation_id: '',
    collection_name: '',
    cagr: '',
    short_title: '',
    hero_alt: '',
    gallery: [],
    this_car_paragraphs: [],
    this_car_metrics: [],
    wider_market_paragraphs: [],
    wider_market_metrics: [],
    net_returns_paragraphs: [],
    net_returns_metrics: [],
    news_ids: [],
    chart_years: [],
    chart_values: [],
    chart_title: '',
    chart_y_label: '',
    chart_currency: '',
    chart_suffix: '',
    chart_line_color: '',
    chart_point_color: '',
    chart_fill_color: '',
});

const formData = ref(getDefaultFormData());
const validations_errors = ref({});

const isVehiclesLoading = ref(false);
const vehicles = ref([]);

const normalizeVehiclesResponse = (value) => {
    if (Array.isArray(value?.data?.data)) return value.data.data;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value)) return value;
    return [];
};

const loadVehicles = async () => {
    isVehiclesLoading.value = true;
    try {
        const getData = await $fetchAdmin('v1/admin/vehicles', {
            method: 'GET',
        });
        vehicles.value = normalizeVehiclesResponse(getData);
    } catch (e) {
        vehicles.value = [];
    } finally {
        isVehiclesLoading.value = false;
    }
};

onMounted(() => {
    loadVehicles();
});

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
            assetable_type: value.assetable_type || value.assetable?.type || '',
            assetable_id: (value.assetable_id ?? value.assetable?.id ?? value.icon_item_id ?? value.icon_item?.id) ? Number(value.assetable_id ?? value.assetable?.id ?? value.icon_item_id ?? value.icon_item?.id) : '',
            headline: value.headline || '',
            subhead_line: value.subhead_line || '',
            total_shares: toInputValue(value.total_shares ?? value.shares_total),
            available_shares: toInputValue(value.available_shares ?? value.shares_available),
            share_price: toInputValue(value.share_price ?? value.per_share_value),
            total_value: toInputValue(value.total_value),
            historical_value: toInputValue(value.historical_value),
            annual_fees: toInputValue(value.annual_fees),
            aum_trust_fee: toInputValue(value.aum_trust_fee),
            portfolio_video: value.portfolio_video || '',
            is_exclusive: isTruthy(value.is_exclusive),
            is_fractional: value.is_fractional === undefined ? true : isTruthy(value.is_fractional),
            bg_image: value.bg_image || '',
            summary_image: value.summary_image || '',
            portfolio_image: value.portfolio_image || '',
            status: Number(value.status ?? 0),
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
            conservative_case: value.conservative_case || '',
            aspirational_case: value.aspirational_case || '',
            projected_value_image: value.projected_value_image || '',
            analysis_summary_pdf: value.analysis_summary_pdf || '',
            net_returns_title: value.net_returns_title || '',
            funded_current_price: toInputValue(value.funded_current_price),
            exit_value: toInputValue(value.exit_value),
            exit_date: $parseDateValue(value.exit_date),
            funded_at: $parseDateValue(value.funded_at),
            key_points: normalizeStringArray(value.key_points),
            opportunity_summary: normalizeStringArray(value.opportunity_summary),
            investment_thesis_description: value.investment_thesis_description || '',
            why_this_asset_description: value.why_this_asset_description || '',
            trust_name: value.trust_name || '',
            asset_name: value.asset_name || '',
            asset_cost: toInputValue(value.asset_cost),
            asset_curation_fee: toInputValue(value.asset_curation_fee),
            home_syndicate_total: toInputValue(value.home_syndicate_total),
            holding_period: value.holding_period || '',
            this_car_eyebrow: value.this_car_eyebrow || '',
            this_car_lead: value.this_car_lead || '',
            this_car_conclusion: value.this_car_conclusion || '',
            wider_market_eyebrow: value.wider_market_eyebrow || '',
            wider_market_lead: value.wider_market_lead || '',
            wider_market_conclusion: value.wider_market_conclusion || '',
            net_returns_eyebrow: value.net_returns_eyebrow || '',
            net_returns_lead: value.net_returns_lead || '',
            net_returns_conclusion: value.net_returns_conclusion || '',
            allocation_id: value.allocation_id || '',
            collection_name: value.collection_name || '',
            cagr: value.cagr || '',
            short_title: value.short_title || '',
            hero_alt: value.hero_alt || '',
            gallery: normalizeImageArray(value.gallery),
            this_car_paragraphs: normalizeStringArray(value.this_car_paragraphs),
            this_car_metrics: normalizeMetricArray(value.this_car_metrics),
            wider_market_paragraphs: normalizeStringArray(value.wider_market_paragraphs),
            wider_market_metrics: normalizeMetricArray(value.wider_market_metrics),
            net_returns_paragraphs: normalizeStringArray(value.net_returns_paragraphs),
            net_returns_metrics: normalizeMetricArray(value.net_returns_metrics),
            news_ids: normalizeNewsArray(value.news_ids ?? value.news),
            chart_years: normalizeNumberArray(value.chart_years),
            chart_values: normalizeNumberArray(value.chart_values),
            chart_title: value.chart_title || '',
            chart_y_label: value.chart_y_label || '',
            chart_currency: value.chart_currency || '',
            chart_suffix: value.chart_suffix || '',
            chart_line_color: value.chart_line_color || '',
            chart_point_color: value.chart_point_color || '',
            chart_fill_color: value.chart_fill_color || '',
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

const setProjectedValueImage = (photo) => {
    formData.value.projected_value_image = photo;
};

const setExperienceImages = (photos) => {
    formData.value.experience_section.images = photos;
};

const setGallery = (photos) => {
    formData.value.gallery = normalizeImageArray(photos);
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

const setNewsImage = (index, photo) => {
    formData.value.news_ids[index].image = getImagePath(photo);
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

const addListItem = (field) => {
    formData.value[field].push('');
};

const removeListItem = (field, index) => {
    formData.value[field].splice(index, 1);
};

const addMetricItem = (field) => {
    formData.value[field].push({ label: '', value: '' });
};

const removeMetricItem = (field, index) => {
    formData.value[field].splice(index, 1);
};

const addNewsItem = () => {
    formData.value.news_ids.push(getDefaultNewsItem());
};

const removeNewsItem = (index) => {
    formData.value.news_ids.splice(index, 1);
};

const requiredFields = [
    'assetable_type',
    'assetable_id',
    'headline',
    'subhead_line',
    'total_shares',
    'available_shares',
    'share_price',
    'total_value',
    'bg_image',
    'slug',
    'item_name',
    'item_second_name',
    'item_details',
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
        activeTab.value = 'basic';
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
    return {
        assetable_type: formData.value.assetable_type,
        assetable_id: toNumber(formData.value.assetable_id),
        headline: formData.value.headline,
        subhead_line: formData.value.subhead_line,
        total_shares: toNumber(formData.value.total_shares),
        available_shares: toNumber(formData.value.available_shares),
        share_price: toNumber(formData.value.share_price),
        total_value: toNumber(formData.value.total_value),
        historical_value: toNumber(formData.value.historical_value),
        annual_fees: toNumber(formData.value.annual_fees),
        aum_trust_fee: toNumber(formData.value.aum_trust_fee),
        portfolio_video: formData.value.portfolio_video,
        is_exclusive: !!formData.value.is_exclusive,
        is_fractional: !!formData.value.is_fractional,
        bg_image: formData.value.bg_image,
        summary_image: formData.value.summary_image,
        portfolio_image: formData.value.portfolio_image,
        status: formData.value.status,
        slug: formData.value.slug,
        reveal_bg_image: formData.value.reveal_bg_image,
        item_name: formData.value.item_name,
        item_second_name: formData.value.item_second_name,
        item_details: formData.value.item_details,
        item_3d_image: formData.value.item_3d_image,
        fanzone_bg_image: formData.value.fanzone_bg_image,
        experience_section: {
            ...formData.value.experience_section,
            list: (formData.value.experience_section?.list || []).filter((item) => item.title || item.description),
            images: normalizeImageArray(formData.value.experience_section?.images || []),
        },
        historic_section: {
            ...formData.value.historic_section,
            graph_data: (formData.value.historic_section?.graph_data || [])
                .filter((item) => item.year !== '' || item.value !== '')
                .map((item) => ({
                    year: toNumber(item.year),
                    value: toNumber(item.value),
                })),
        },
        mission_section: formData.value.mission_section,
        story_section: {
            ...formData.value.story_section,
            details: (formData.value.story_section?.details || []).filter((item) => item.title || item.description),
        },
        conservative_case: formData.value.conservative_case,
        aspirational_case: formData.value.aspirational_case,
        projected_value_image: formData.value.projected_value_image,
        analysis_summary_pdf: formData.value.analysis_summary_pdf,
        net_returns_title: formData.value.net_returns_title,
        funded_current_price: toNumber(formData.value.funded_current_price),
        exit_value: toNumber(formData.value.exit_value),
        exit_date: $formatDateForApi(formData.value.exit_date),
        funded_at: $formatDateForApi(formData.value.funded_at),
        key_points: formData.value.key_points.filter(Boolean),
        opportunity_summary: formData.value.opportunity_summary.filter(Boolean),
        investment_thesis_description: formData.value.investment_thesis_description,
        why_this_asset_description: formData.value.why_this_asset_description,
        trust_name: formData.value.trust_name,
        asset_name: formData.value.asset_name,
        asset_cost: toNumber(formData.value.asset_cost),
        asset_curation_fee: toNumber(formData.value.asset_curation_fee),
        home_syndicate_total: toNumber(formData.value.home_syndicate_total),
        holding_period: formData.value.holding_period,
        this_car_eyebrow: formData.value.this_car_eyebrow,
        this_car_lead: formData.value.this_car_lead,
        this_car_conclusion: formData.value.this_car_conclusion,
        wider_market_eyebrow: formData.value.wider_market_eyebrow,
        wider_market_lead: formData.value.wider_market_lead,
        wider_market_conclusion: formData.value.wider_market_conclusion,
        net_returns_eyebrow: formData.value.net_returns_eyebrow,
        net_returns_lead: formData.value.net_returns_lead,
        net_returns_conclusion: formData.value.net_returns_conclusion,
        allocation_id: formData.value.allocation_id,
        collection_name: formData.value.collection_name,
        cagr: formData.value.cagr,
        short_title: formData.value.short_title,
        hero_alt: formData.value.hero_alt,
        gallery: normalizeImageArray(formData.value.gallery),
        this_car_paragraphs: formData.value.this_car_paragraphs.filter(Boolean),
        this_car_metrics: formData.value.this_car_metrics.filter((item) => item.label || item.value),
        wider_market_paragraphs: formData.value.wider_market_paragraphs.filter(Boolean),
        wider_market_metrics: formData.value.wider_market_metrics.filter((item) => item.label || item.value),
        net_returns_paragraphs: formData.value.net_returns_paragraphs.filter(Boolean),
        net_returns_metrics: formData.value.net_returns_metrics.filter((item) => item.label || item.value),
        news_ids: formData.value.news_ids.filter((item) => (
            item.title ||
            item.date ||
            item.day ||
            item.month ||
            item.author ||
            item.image ||
            item.excerpt
        )),
        chart_years: formData.value.chart_years.filter((item) => item !== '').map(toNumber),
        chart_values: formData.value.chart_values.filter((item) => item !== '').map(toNumber),
        chart_title: formData.value.chart_title,
        chart_y_label: formData.value.chart_y_label,
        chart_currency: formData.value.chart_currency,
        chart_suffix: formData.value.chart_suffix,
        chart_line_color: formData.value.chart_line_color,
        chart_point_color: formData.value.chart_point_color,
        chart_fill_color: formData.value.chart_fill_color,
    };
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
        :style="{ width: '76rem', maxWidth: 'calc(100vw - 1.5rem)' }" @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Fractional Item</h4>
            </div>
        </template>

        <div class="space-y-4">
            <div class="overflow-x-auto border-b border-gray-200 dark:border-gray-700">
                <div class="flex min-w-max gap-2 pb-2" role="tablist">
                    <button v-for="tab in formTabs" :key="tab.key" type="button"
                        class="rounded-md border px-4 py-2 text-sm font-semibold transition-colors"
                        :class="activeTab === tab.key
                            ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-600 dark:border-gray-700 dark:text-gray-200'"
                        @click="activeTab = tab.key">
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <div class="max-h-[70vh] overflow-y-auto pr-1">
                <div v-show="activeTab === 'basic'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">


            <div>
                <label class="font-semibold">Vehicle <span class="text-red-500">*</span></label>
                <Select v-model="formData.assetable_id" :options="vehicles" filter optionLabel="name" optionValue="id"
                    placeholder="Select Vehicle" class="w-full" :loading="isVehiclesLoading"
                    :class="validations_errors.assetable_id ? 'border-[#f44336!important]' : ''"
                    @focus="validations_errors.assetable_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.assetable_id" />
            </div>

            <div>
                <label class="font-semibold">Slug <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.slug" class="w-full"
                    :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.slug = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
            </div>

            <div>
                <label class="font-semibold">Headline <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.headline" class="w-full"
                    :class="validations_errors.headline ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.headline = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.headline" />
            </div>

            <div>
                <label class="font-semibold">Subhead Line <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.subhead_line" class="w-full"
                    :class="validations_errors.subhead_line ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.subhead_line = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.subhead_line" />
            </div>

            <div>
                <label class="font-semibold">Item Name <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.item_name" class="w-full"
                    :class="validations_errors.item_name ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.item_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.item_name" />
            </div>

            <div>
                <label class="font-semibold">Item Second Name <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.item_second_name" class="w-full" autocomplete="off"
                    @focus="validations_errors.item_second_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.item_second_name" />
            </div>

            <div>
                <label class="font-semibold">Total Shares <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.total_shares" type="number" class="w-full"
                    :class="validations_errors.total_shares ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.total_shares = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.total_shares" />
            </div>

            <div>
                <label class="font-semibold">Available Shares <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.available_shares" type="number" class="w-full"
                    :class="validations_errors.available_shares ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.available_shares = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.available_shares" />
            </div>

            <div>
                <label class="font-semibold">Share Price <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.share_price" type="number" step="0.01" class="w-full"
                    :class="validations_errors.share_price ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.share_price = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.share_price" />
            </div>

            <div>
                <label class="font-semibold">Total Value <span class="text-red-500">*</span></label>
                <LazyInputText v-model="formData.total_value" type="number" step="0.01" class="w-full"
                    :class="validations_errors.total_value ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.total_value = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.total_value" />
            </div>

            <div>
                <label class="font-semibold">Historical Value</label>
                <LazyInputText v-model="formData.historical_value" type="number" step="0.01" class="w-full"
                    :class="validations_errors.historical_value ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.historical_value = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.historical_value" />
            </div>

            <div>
                <label class="font-semibold">Annual Fees</label>
                <LazyInputText v-model="formData.annual_fees" type="number" step="0.01" class="w-full"
                    :class="validations_errors.annual_fees ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.annual_fees = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.annual_fees" />
            </div>

            <div>
                <label class="font-semibold">AUM Trust Fee</label>
                <LazyInputText v-model="formData.aum_trust_fee" type="number" step="0.01" class="w-full"
                    :class="validations_errors.aum_trust_fee ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.aum_trust_fee = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.aum_trust_fee" />
            </div>

            <div>
                <label class="font-semibold">Net Returns Title</label>
                <LazyInputText v-model="formData.net_returns_title" class="w-full" autocomplete="off"
                    @focus="validations_errors.net_returns_title = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.net_returns_title" />
            </div>

            <div>
                <label class="font-semibold">Funded Current Price</label>
                <LazyInputText v-model="formData.funded_current_price" type="number" step="0.01" class="w-full"
                    autocomplete="off" @focus="validations_errors.funded_current_price = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.funded_current_price" />
            </div>

            <div>
                <label class="font-semibold">Exit Value</label>
                <LazyInputText v-model="formData.exit_value" type="number" step="0.01" class="w-full"
                    autocomplete="off" @focus="validations_errors.exit_value = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.exit_value" />
            </div>

            <div>
                <label class="font-semibold">Exit Date</label>
                <DatePicker v-model="formData.exit_date" showIcon fluid iconDisplay="input" :manualInput="false"
                    class="w-full" autocomplete="off" @focus="validations_errors.exit_date = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.exit_date" />
            </div>

            <div>
                <label class="font-semibold">Funded At</label>
                <DatePicker v-model="formData.funded_at" showIcon fluid iconDisplay="input" :manualInput="false"
                    class="w-full" autocomplete="off" @focus="validations_errors.funded_at = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.funded_at" />
            </div>

            <div>
                <label class="font-semibold">Trust Name</label>
                <LazyInputText v-model="formData.trust_name" class="w-full" autocomplete="off"
                    @focus="validations_errors.trust_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.trust_name" />
            </div>

            <div>
                <label class="font-semibold">Asset Name</label>
                <LazyInputText v-model="formData.asset_name" class="w-full" autocomplete="off"
                    @focus="validations_errors.asset_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.asset_name" />
            </div>

            <div>
                <label class="font-semibold">Asset Cost</label>
                <LazyInputText v-model="formData.asset_cost" type="number" step="0.01" class="w-full"
                    autocomplete="off" @focus="validations_errors.asset_cost = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.asset_cost" />
            </div>

            <div>
                <label class="font-semibold">Asset Curation Fee</label>
                <LazyInputText v-model="formData.asset_curation_fee" type="number" step="0.01" class="w-full"
                    autocomplete="off" @focus="validations_errors.asset_curation_fee = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.asset_curation_fee" />
            </div>

            <div>
                <label class="font-semibold">Home Syndicate Total</label>
                <LazyInputText v-model="formData.home_syndicate_total" type="number" step="0.01" class="w-full"
                    autocomplete="off" @focus="validations_errors.home_syndicate_total = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.home_syndicate_total" />
            </div>

            <div>
                <label class="font-semibold">Holding Period</label>
                <LazyInputText v-model="formData.holding_period" class="w-full" autocomplete="off"
                    @focus="validations_errors.holding_period = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.holding_period" />
            </div>

            <div>
                <label class="font-semibold">Allocation ID</label>
                <LazyInputText v-model="formData.allocation_id" class="w-full" autocomplete="off"
                    @focus="validations_errors.allocation_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.allocation_id" />
            </div>

            <div>
                <label class="font-semibold">Collection Name</label>
                <LazyInputText v-model="formData.collection_name" class="w-full" autocomplete="off"
                    @focus="validations_errors.collection_name = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.collection_name" />
            </div>

            <div>
                <label class="font-semibold">CAGR</label>
                <LazyInputText v-model="formData.cagr" class="w-full" autocomplete="off"
                    @focus="validations_errors.cagr = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.cagr" />
            </div>

            <div>
                <label class="font-semibold">Short Title</label>
                <LazyInputText v-model="formData.short_title" class="w-full" autocomplete="off"
                    @focus="validations_errors.short_title = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.short_title" />
            </div>

            <div class="sm:col-span-2">
                <label class="font-semibold">Hero Alt</label>
                <LazyInputText v-model="formData.hero_alt" class="w-full" autocomplete="off"
                    @focus="validations_errors.hero_alt = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.hero_alt" />
            </div>

            <div class="sm:col-span-3">
                <label class="font-semibold">Item Details <span class="text-red-500">*</span></label>
                <Textarea v-model="formData.item_details" rows="4" class="w-full" autocomplete="off" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.item_details" />
            </div>

            <div class="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="font-semibold">Investment Thesis Description</label>
                    <Textarea v-model="formData.investment_thesis_description" rows="4" class="w-full"
                        autocomplete="off" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.investment_thesis_description" />
                </div>

                <div>
                    <label class="font-semibold">Why This Asset Description</label>
                    <Textarea v-model="formData.why_this_asset_description" rows="4" class="w-full"
                        autocomplete="off" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.why_this_asset_description" />
                </div>
            </div>

            <div class="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="font-semibold">Conservative Case</label>
                    <Textarea v-model="formData.conservative_case" rows="3" class="w-full" autocomplete="off" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.conservative_case" />
                </div>

                <div>
                    <label class="font-semibold">Aspirational Case</label>
                    <Textarea v-model="formData.aspirational_case" rows="3" class="w-full" autocomplete="off" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.aspirational_case" />
                </div>
            </div>
                </div>

                <div v-show="activeTab === 'analysis'" class="grid grid-cols-1 gap-4">
            <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">This Car Analysis</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Eyebrow</label>
                        <LazyInputText v-model="formData.this_car_eyebrow" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-semibold text-sm">Lead</label>
                        <Textarea v-model="formData.this_car_lead" rows="2" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-3">
                        <label class="font-semibold text-sm">Conclusion</label>
                        <Textarea v-model="formData.this_car_conclusion" rows="3" class="w-full" autocomplete="off" />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Paragraphs</label>
                            <Button type="button" label="Add Paragraph" icon="pi pi-plus" severity="success"
                                @click="addListItem('this_car_paragraphs')" />
                        </div>
                        <div v-for="(paragraph, index) in formData.this_car_paragraphs" :key="index"
                            class="flex items-center gap-2 mb-3">
                            <LazyInputText v-model="formData.this_car_paragraphs[index]" class="w-full" autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeListItem('this_car_paragraphs', index)" />
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Metrics</label>
                            <Button type="button" label="Add Metric" icon="pi pi-plus" severity="success"
                                @click="addMetricItem('this_car_metrics')" />
                        </div>
                        <div v-for="(metric, index) in formData.this_car_metrics" :key="index"
                            class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-3">
                            <LazyInputText v-model="metric.label" class="w-full" placeholder="Label" autocomplete="off" />
                            <LazyInputText v-model="metric.value" class="w-full" placeholder="Value" autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeMetricItem('this_car_metrics', index)" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Wider Market Analysis</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Eyebrow</label>
                        <LazyInputText v-model="formData.wider_market_eyebrow" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-semibold text-sm">Lead</label>
                        <Textarea v-model="formData.wider_market_lead" rows="2" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-3">
                        <label class="font-semibold text-sm">Conclusion</label>
                        <Textarea v-model="formData.wider_market_conclusion" rows="3" class="w-full" autocomplete="off" />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Paragraphs</label>
                            <Button type="button" label="Add Paragraph" icon="pi pi-plus" severity="success"
                                @click="addListItem('wider_market_paragraphs')" />
                        </div>
                        <div v-for="(paragraph, index) in formData.wider_market_paragraphs" :key="index"
                            class="flex items-center gap-2 mb-3">
                            <LazyInputText v-model="formData.wider_market_paragraphs[index]" class="w-full"
                                autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeListItem('wider_market_paragraphs', index)" />
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Metrics</label>
                            <Button type="button" label="Add Metric" icon="pi pi-plus" severity="success"
                                @click="addMetricItem('wider_market_metrics')" />
                        </div>
                        <div v-for="(metric, index) in formData.wider_market_metrics" :key="index"
                            class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-3">
                            <LazyInputText v-model="metric.label" class="w-full" placeholder="Label" autocomplete="off" />
                            <LazyInputText v-model="metric.value" class="w-full" placeholder="Value" autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeMetricItem('wider_market_metrics', index)" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Net Returns Analysis</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Eyebrow</label>
                        <LazyInputText v-model="formData.net_returns_eyebrow" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-2">
                        <label class="font-semibold text-sm">Lead</label>
                        <Textarea v-model="formData.net_returns_lead" rows="2" class="w-full" autocomplete="off" />
                    </div>
                    <div class="sm:col-span-3">
                        <label class="font-semibold text-sm">Conclusion</label>
                        <Textarea v-model="formData.net_returns_conclusion" rows="3" class="w-full" autocomplete="off" />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Paragraphs</label>
                            <Button type="button" label="Add Paragraph" icon="pi pi-plus" severity="success"
                                @click="addListItem('net_returns_paragraphs')" />
                        </div>
                        <div v-for="(paragraph, index) in formData.net_returns_paragraphs" :key="index"
                            class="flex items-center gap-2 mb-3">
                            <LazyInputText v-model="formData.net_returns_paragraphs[index]" class="w-full"
                                autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeListItem('net_returns_paragraphs', index)" />
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Metrics</label>
                            <Button type="button" label="Add Metric" icon="pi pi-plus" severity="success"
                                @click="addMetricItem('net_returns_metrics')" />
                        </div>
                        <div v-for="(metric, index) in formData.net_returns_metrics" :key="index"
                            class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-3">
                            <LazyInputText v-model="metric.label" class="w-full" placeholder="Label" autocomplete="off" />
                            <LazyInputText v-model="metric.value" class="w-full" placeholder="Value" autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeMetricItem('net_returns_metrics', index)" />
                        </div>
                    </div>
                </div>
            </div>
                </div>

                <div v-show="activeTab === 'media'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4">
                <div>
                    <label class="font-semibold">Background Image <span class="text-red-500">*</span></label>
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
                    <label class="font-semibold">Portfolio Video</label>
                    <LazyInputText v-model="formData.portfolio_video" class="w-full mt-2"
                        placeholder="https://example.com/video.mp4" autocomplete="off"
                        @focus="validations_errors.portfolio_video = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.portfolio_video" />
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

                <div>
                    <label class="font-semibold">Projected Value Image</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.projected_value_image" @set_photo="setProjectedValueImage" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.projected_value_image" />
                </div>

                <div>
                    <label class="font-semibold">Gallery</label>
                    <div class="w-full mt-2">
                        <MediaGallery :getPhoto="formData.gallery" :multiple="true" @set_photo="setGallery" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.gallery" />
                </div>

                <div>
                    <label class="font-semibold">Analysis Summary PDF</label>
                    <LazyInputText v-model="formData.analysis_summary_pdf" class="w-full mt-2"
                        placeholder="https://example.com/analysis.pdf" autocomplete="off"
                        @focus="validations_errors.analysis_summary_pdf = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.analysis_summary_pdf" />
                </div>
            </div>
                </div>

                <div v-show="activeTab === 'sections'" class="grid grid-cols-1 gap-4">
            <div class="border border-gray-200 rounded-lg p-4">
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
                </div>

                <div v-show="activeTab === 'lists'" class="grid grid-cols-1 gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-3">
                        <label class="font-semibold">Key Points</label>
                        <Button type="button" label="Add Point" icon="pi pi-plus" severity="success"
                            @click="addListItem('key_points')" />
                    </div>

                    <div v-if="formData.key_points.length === 0" class="text-sm text-gray-500 mb-2">
                        No key points added yet.
                    </div>

                    <div v-for="(point, index) in formData.key_points" :key="index" class="flex items-center gap-2 mb-3">
                        <LazyInputText v-model="formData.key_points[index]" class="w-full" autocomplete="off" />
                        <Button type="button" icon="pi pi-trash" severity="danger" outlined
                            @click="removeListItem('key_points', index)" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.key_points" />
                </div>

                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-3">
                        <label class="font-semibold">Opportunity Summary</label>
                        <Button type="button" label="Add Summary" icon="pi pi-plus" severity="success"
                            @click="addListItem('opportunity_summary')" />
                    </div>

                    <div v-if="formData.opportunity_summary.length === 0" class="text-sm text-gray-500 mb-2">
                        No opportunity summary items added yet.
                    </div>

                    <div v-for="(summary, index) in formData.opportunity_summary" :key="index" class="flex items-center gap-2 mb-3">
                        <LazyInputText v-model="formData.opportunity_summary[index]" class="w-full" autocomplete="off" />
                        <Button type="button" icon="pi pi-trash" severity="danger" outlined
                            @click="removeListItem('opportunity_summary', index)" />
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.opportunity_summary" />
                </div>

                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-3">
                        <label class="font-semibold">News</label>
                        <Button type="button" label="Add News" icon="pi pi-plus" severity="success"
                            @click="addNewsItem" />
                    </div>

                    <div v-if="formData.news_ids.length === 0" class="text-sm text-gray-500 mb-2">
                        No news items added yet.
                    </div>

                    <div v-for="(newsItem, index) in formData.news_ids" :key="index"
                        class="border border-gray-200 rounded-lg p-4 mb-3">
                        <div class="flex justify-between items-center mb-3">
                            <span class="font-semibold text-sm">News {{ index + 1 }}</span>
                            <Button type="button" label="Remove" severity="danger" outlined size="small"
                                @click="removeNewsItem(index)" />
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="font-semibold text-sm">Title</label>
                                <LazyInputText v-model="newsItem.title" class="w-full" autocomplete="off" />
                            </div>
                            <div>
                                <label class="font-semibold text-sm">Date</label>
                                <LazyInputText v-model="newsItem.date" class="w-full" placeholder="May 28, 2026"
                                    autocomplete="off" />
                            </div>
                            <div>
                                <label class="font-semibold text-sm">Day</label>
                                <LazyInputText v-model="newsItem.day" class="w-full" placeholder="28" autocomplete="off" />
                            </div>
                            <div>
                                <label class="font-semibold text-sm">Month</label>
                                <LazyInputText v-model="newsItem.month" class="w-full" placeholder="May" autocomplete="off" />
                            </div>
                            <div>
                                <label class="font-semibold text-sm">Author</label>
                                <LazyInputText v-model="newsItem.author" class="w-full" autocomplete="off" />
                            </div>
                            <div>
                                <label class="font-semibold text-sm">Image</label>
                                <div class="w-full mt-2">
                                    <MediaGallery :getPhoto="newsItem.image" @set_photo="setNewsImage(index, $event)" />
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label class="font-semibold text-sm">Excerpt</label>
                                <Textarea v-model="newsItem.excerpt" rows="3" class="w-full" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.news_ids" />
                </div>
            </div>

            <div class="sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Chart Section</label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="font-semibold text-sm">Chart Title</label>
                        <LazyInputText v-model="formData.chart_title" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Y Label</label>
                        <LazyInputText v-model="formData.chart_y_label" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Currency</label>
                        <LazyInputText v-model="formData.chart_currency" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Suffix</label>
                        <LazyInputText v-model="formData.chart_suffix" class="w-full" autocomplete="off" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Line Color</label>
                        <ColorPicker v-model="formData.chart_line_color" class="w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Point Color</label>
                        <ColorPicker v-model="formData.chart_point_color" class="w-full" />
                    </div>

                    <div>
                        <label class="font-semibold text-sm">Fill Color</label>
                        <ColorPicker v-model="formData.chart_fill_color" class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Chart Years</label>
                            <Button type="button" label="Add Year" icon="pi pi-plus" severity="success"
                                @click="addListItem('chart_years')" />
                        </div>
                        <div v-for="(year, index) in formData.chart_years" :key="index" class="flex items-center gap-2 mb-3">
                            <LazyInputText v-model="formData.chart_years[index]" type="number" class="w-full" autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeListItem('chart_years', index)" />
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-semibold">Chart Values</label>
                            <Button type="button" label="Add Value" icon="pi pi-plus" severity="success"
                                @click="addListItem('chart_values')" />
                        </div>
                        <div v-for="(value, index) in formData.chart_values" :key="index" class="flex items-center gap-2 mb-3">
                            <LazyInputText v-model="formData.chart_values[index]" type="number" step="0.01" class="w-full"
                                autocomplete="off" />
                            <Button type="button" icon="pi pi-trash" severity="danger" outlined
                                @click="removeListItem('chart_values', index)" />
                        </div>
                    </div>
                </div>
            </div>
                </div>

                <div v-show="activeTab === 'settings'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <Select v-model="formData.status" :options="statusOptions" optionLabel="name" optionValue="value" placeholder="Select Status" @change="validations_errors.status = ''" class="w-40" />
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
