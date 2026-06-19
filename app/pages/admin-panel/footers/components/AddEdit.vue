<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
})

const emit = defineEmits(['add_emit', 'close']);

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

// Always ensure options are arrays
const toArray = (val) => (Array.isArray(val) ? val : (val ? Object.values(val) : []));

// Normalize model by option value type (string/number)
const normalizeByOptionType = (val, opts, valueKey) => {
    if (val === null || val === undefined) return val;
    const sample = toArray(opts)[0]?.[valueKey];
    if (sample === undefined) return val;
    return typeof sample === 'number' ? Number(val) : String(val);
};

const { $linkTypeList } = useNuxtApp();
const linkTypeList = $linkTypeList();

// Footer group types
const isLoadingGroupTypes = ref(false);
const footerGroupTypes = ref([]);

// Computed arrays for Select
const linkTypeOptions = computed(() => toArray(linkTypeList));
const footerGroupTypeOptions = computed(() => toArray(footerGroupTypes.value));

const loadFooterGroupTypes = async () => {
    isLoadingGroupTypes.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/footer-group-types/all`, { method: 'POST' });
        // Accept both {data: []} and {data: {data: []}} or plain array/object map
        footerGroupTypes.value = toArray(getData?.data?.data ?? getData?.data ?? []);
    } catch (e) {
        console.log('Get Message', e.message);
        footerGroupTypes.value = [];
    } finally {
        isLoadingGroupTypes.value = false;
    }
};

// Load footer group types on component mount
onMounted(() => {
    loadFooterGroupTypes();
});

const formData = ref({
    id: null,
    title: '',
    link: '',
    link_type: null,
    group_type_id: null,
    content: '',
    status: 0,
});
const isChecked = ref(false);

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            title: value.title ?? '',
            link: isType2(value.link_type)
                ? stripContentPrefix(value.link ?? '')
                : (isType1(value.link_type)
                    ? stripSlashPrefix(value.link ?? '')
                    : (value.link ?? '')),
            // normalize with current option types
            link_type: normalizeByOptionType(value.link_type, linkTypeOptions.value, 'value'),
            group_type_id: normalizeByOptionType(value.group_type_id, footerGroupTypeOptions.value, 'id'),
            content: value.content ?? '',
            status: value.status,
        };
        isChecked.value = value.status == 1 || value.status === true;
    } else {
        formData.value = {
            id: null,
            title: '',
            link: '',
            link_type: null,
            group_type_id: null,
            content: '',
            status: 0,
        };
        isChecked.value = false;
    }
});

// If options arrive after item, re-normalize model types once
watch([linkTypeOptions, footerGroupTypeOptions], () => {
    formData.value.link_type = normalizeByOptionType(formData.value.link_type, linkTypeOptions.value, 'value');
    formData.value.group_type_id = normalizeByOptionType(formData.value.group_type_id, footerGroupTypeOptions.value, 'id');
});

const handleCheckboxChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
}
const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'status',
    'content',
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
        console.log(validations_errors.value);
        return;
    }

    try {
        isLoading.value = true;
        const payload = {
            ...formData.value,
            link: isType2(formData.value.link_type)
                ? withContentPrefix(formData.value.link)
                : (isType1(formData.value.link_type)
                    ? withSlashPrefix(formData.value.link)
                    : formData.value.link),
        };
        const getData = await $fetchAdmin(`v1/admin/footers/${props.item.id}`, {
            method: 'PUT',
            body: payload,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
        if (getData.status == true) {
            response_modal.value = getData;
        }
    } catch (e) {
        console.log('Get Message', e.message);
        // console.log('Get response',e.response);
        if (e.response?.status === 404 || e.response?.status === 409 || e.response?.status === 422) {
            console.log('here 1', e.response);
            if (e.response?.status === 404 || e.response?.status === 409 || e.response?.status === 422) {
                // console.log('here 2', e.response._data.data);
                for (const key in e.response._data.data) {
                    if (e.response._data.data.hasOwnProperty(key)) {
                        const value = e.response._data.data[key][0];
                        validations_errors.value[key] = value;
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
        console.log(validations_errors.value);
        return;
    }

    try {
        isLoading.value = true;
        const payload = {
            ...formData.value,
            link: isType2(formData.value.link_type)
                ? withContentPrefix(formData.value.link)
                : (isType1(formData.value.link_type)
                    ? withSlashPrefix(formData.value.link)
                    : formData.value.link),
        };
        const getData = await $fetchAdmin(`v1/admin/footers`, {
            method: 'POST',
            body: payload,
        });
        response_modal.value = getData;
        if (getData.status == true) {
            emit('add_emit', getData.data);
        }
        if (getData.status == true) {
            response_modal.value = getData;
        }
    } catch (e) {
        console.log('Get Message', e.message);
        // console.log('Get response',e.response);
        if (e.response?.status === 404 || e.response?.status === 409 || e.response?.status === 422) {
            console.log('here 1', e.response);
            if (e.response?.status === 404 || e.response?.status === 409 || e.response?.status === 422) {
                // console.log('here 2', e.response._data.data);
                for (const key in e.response._data.data) {
                    if (e.response._data.data.hasOwnProperty(key)) {
                        const value = e.response._data.data[key][0];
                        validations_errors.value[key] = value;
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

// Helpers for content link handling
const CONTENT_PREFIX = '/content';
const isType2 = (val) => Number(val) === 2;
// Add type 1 helpers
const isType1 = (val) => Number(val) === 1;
const stripSlashPrefix = (val) => {
    if (typeof val !== 'string') return '';
    let s = val.trim();
    while (s.startsWith('/')) s = s.slice(1);
    return s;
};
const withSlashPrefix = (val) => {
    const clean = stripSlashPrefix(val ?? '');
    return `/${clean}`;
};

const stripContentPrefix = (val) => {
    if (typeof val !== 'string') return '';
    let s = val.trim();
    if (s.startsWith(CONTENT_PREFIX)) {
        s = s.slice(CONTENT_PREFIX.length);
    }
    while (s.startsWith('/')) {
        s = s.slice(1);
    }
    return s;
};
const withContentPrefix = (val) => {
    const clean = stripContentPrefix(val ?? '');
    return clean ? `${CONTENT_PREFIX}/${clean}` : CONTENT_PREFIX;
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '50rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold dark:text-gray-100">{{ modalTitle }} Footer</h4>
            </div>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold dark:text-gray-200">Title</label>
                    <LazyInputText v-model="formData.title" class="w-full dark:bg-gray-700 dark:text-gray-200" placeholder="i.e. Example Tag"
                        :class="validations_errors.title ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.title = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.title" />
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold dark:text-gray-200">Group Type</label>
                    <div v-if="isLoadingGroupTypes" class="w-full h-[42px] bg-white dark:bg-gray-700 rounded-md animate-pulse flex items-center px-3 border border-gray-200 dark:border-gray-600">
                        <div class="w-24 h-4 bg-gray-100 dark:bg-gray-600 rounded"></div>
                        <div class="ml-auto w-4 h-4 bg-gray-100 dark:bg-gray-600 rounded"></div>
                    </div>
                    <Select v-else v-model="formData.group_type_id"
                        :options="footerGroupTypeOptions"
                        optionLabel="name" optionValue="id"
                        placeholder="Select Group Type" class="w-full dark:bg-gray-700"
                        :class="validations_errors.group_type_id ? 'border-[#f44336!important]' : ''"
                        @focus="validations_errors.group_type_id = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.group_type_id" />
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold dark:text-gray-200">Link Type</label>
                    <Select v-model="formData.link_type"
                        :options="linkTypeOptions"
                        optionLabel="name" optionValue="value"
                        placeholder="Select Link Type" class="w-full dark:bg-gray-700"
                        :class="validations_errors.link_type ? 'border-[#f44336!important]' : ''"
                        @focus="validations_errors.link_type = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.link_type" />
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold dark:text-gray-200">Slug</label>
                    <LazyInputText v-model="formData.link" class="w-full dark:bg-gray-700 dark:text-gray-200" placeholder="i.e. example-slug"
                        :class="validations_errors.link ? 'border-[#f44336!important]' : ''" autocomplete="off"
                        @focus="validations_errors.link = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.link" />
                </div>
            </div>
            <div v-if="formData.link_type == 2" class="col-span-1 sm:col-span-2 flex items-center gap-4">
                <div class="flex-auto">
                    <label class="font-semibold dark:text-gray-200">Content</label>
                    <Editor v-model="formData.content" class="w-full" editorStyle="height: 200px" rows="5" cols="30" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.content" />
                </div>
            </div>
            <div class="flex items-center gap-4">
                <label class="font-semibold w-24 dark:text-gray-200">Status</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="isChecked" @change="handleCheckboxChange"
                        @focus="validations_errors.status = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.status" />
                </div>
            </div>
        </div>

        <template #footer class="flex justify-end gap-2 border-gray-200 dark:border-gray-700">
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