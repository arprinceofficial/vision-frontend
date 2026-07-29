<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);
const { $formatDateForApi, $parseDateValue, $slugify } = useNuxtApp();

const visible = computed({
    get: () => props.isOpenModal,
    set: (value) => {
        if (!value) emit('close');
    }
});

const isTruthy = (value) => value === true || value == 1;

const getImagePath = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.image || value?.url || value?.path || '';
};

const toInputValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const normalizeStringArray = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => {
        if (typeof item === 'string') return item;
        return item?.title || item?.text || item?.name || item?.value || '';
    });
};

const getInitialFormData = () => ({
    id: null,
    blog_title: '',
    slug: '',
    details: '',
    category: '',
    date: null,
    read_time: '',
    image: '',
    excerpt: '',
    author: '',
    stat: '',
    body: [],
    takeaways: [],
    is_featured: false,
    status: false,
});

const formData = ref(getInitialFormData());
const validations_errors = ref({});

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            blog_title: value.blog_title || value.title || '',
            slug: value.slug || '',
            details: value.details || '',
            category: value.category || '',
            date: $parseDateValue(value.date),
            read_time: value.read_time || value.readTime || '',
            image: getImagePath(value.image),
            excerpt: value.excerpt || '',
            author: value.author || '',
            stat: toInputValue(value.stat),
            body: normalizeStringArray(value.body),
            takeaways: normalizeStringArray(value.takeaways),
            is_featured: isTruthy(value.is_featured),
            status: isTruthy(value.status),
        };
    } else {
        formData.value = getInitialFormData();
    }
}, { immediate: true });

watch(() => formData.value.blog_title, (value) => {
    if (!value) return;
    if (props.modalTitle === 'Create' || !formData.value.slug) {
        formData.value.slug = $slugify(value);
    }
});

const setImage = (photo) => {
    formData.value.image = getImagePath(photo);
};

const addListItem = (field) => {
    formData.value[field].push('');
};

const removeListItem = (field, index) => {
    formData.value[field].splice(index, 1);
};

const requiredFields = [
    'blog_title',
    'slug',
    'details',
    'category',
    'date',
    'read_time',
    'image',
    'excerpt',
    'author',
    'stat',
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
    blog_title: formData.value.blog_title,
    slug: formData.value.slug,
    details: formData.value.details,
    category: formData.value.category,
    date: $formatDateForApi(formData.value.date),
    read_time: formData.value.read_time,
    image: formData.value.image,
    excerpt: formData.value.excerpt,
    author: formData.value.author,
    stat: formData.value.stat,
    body: formData.value.body.filter(Boolean),
    takeaways: formData.value.takeaways.filter(Boolean),
    is_featured: formData.value.is_featured ? 1 : 0,
    status: formData.value.status ? 1 : 0,
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
        const getData = await $fetchAdmin(`v1/admin/blog-infos/${props.item.id}`, {
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
        const getData = await $fetchAdmin('v1/admin/blog-infos', {
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
        :style="{ width: '76rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Blog Info</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-3">
                <label class="font-semibold">Image</label>
                <div class="w-full mt-2">
                    <MediaGallery :getPhoto="formData.image" @set_photo="setImage" />
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.image" />
            </div>

            <div>
                <label class="font-semibold">Blog Title</label>
                <LazyInputText v-model="formData.blog_title" class="w-full"
                    :class="validations_errors.blog_title ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.blog_title = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.blog_title" />
            </div>

            <div>
                <label class="font-semibold">Slug</label>
                <LazyInputText v-model="formData.slug" class="w-full"
                    :class="validations_errors.slug ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.slug = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.slug" />
            </div>

            <div>
                <label class="font-semibold">Category</label>
                <LazyInputText v-model="formData.category" class="w-full"
                    :class="validations_errors.category ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.category = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.category" />
            </div>

            <div>
                <label class="font-semibold">Date</label>
                <DatePicker v-model="formData.date" showIcon fluid iconDisplay="input" :manualInput="false"
                    class="w-full" :class="validations_errors.date ? 'border-[#f44336!important]' : ''"
                    @focus="validations_errors.date = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.date" />
            </div>

            <div>
                <label class="font-semibold">Read Time</label>
                <LazyInputText v-model="formData.read_time" class="w-full"
                    :class="validations_errors.read_time ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.read_time = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.read_time" />
            </div>

            <div>
                <label class="font-semibold">Author</label>
                <LazyInputText v-model="formData.author" class="w-full"
                    :class="validations_errors.author ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.author = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.author" />
            </div>

            <div>
                <label class="font-semibold">Stat</label>
                <LazyInputText v-model="formData.stat" class="w-full"
                    :class="validations_errors.stat ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.stat = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.stat" />
            </div>

            <div class="sm:col-span-2">
                <label class="font-semibold">Excerpt</label>
                <Textarea v-model="formData.excerpt" class="w-full" rows="4"
                    :class="validations_errors.excerpt ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.excerpt = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.excerpt" />
            </div>

            <div class="sm:col-span-3">
                <label class="font-semibold">Details</label>
                <Editor v-model="formData.details" editorStyle="height: 220px" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.details" />
            </div>

            <div class="sm:col-span-3">
                <div class="flex items-center justify-between gap-4 mb-2">
                    <label class="font-semibold">Body</label>
                    <Button type="button" label="Add Body" severity="secondary" size="small" outlined
                        @click="addListItem('body')" />
                </div>
                <div v-if="formData.body.length" class="space-y-3">
                    <div v-for="(paragraph, index) in formData.body" :key="`body-${index}`"
                        class="flex items-start gap-2">
                        <Textarea v-model="formData.body[index]" class="w-full" rows="3" autocomplete="off"
                            @focus="validations_errors.body = ''" />
                        <Button type="button" severity="danger" outlined rounded aria-label="Remove body paragraph"
                            @click="removeListItem('body', index)">
                            <template #icon>
                                <i class="pi pi-trash"></i>
                            </template>
                        </Button>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.body" />
            </div>

            <div class="sm:col-span-3">
                <div class="flex items-center justify-between gap-4 mb-2">
                    <label class="font-semibold">Takeaways</label>
                    <Button type="button" label="Add Takeaway" severity="secondary" size="small" outlined
                        @click="addListItem('takeaways')" />
                </div>
                <div v-if="formData.takeaways.length" class="space-y-3">
                    <div v-for="(takeaway, index) in formData.takeaways" :key="`takeaway-${index}`"
                        class="flex items-center gap-2">
                        <LazyInputText v-model="formData.takeaways[index]" class="w-full" autocomplete="off"
                            @focus="validations_errors.takeaways = ''" />
                        <Button type="button" severity="danger" outlined rounded aria-label="Remove takeaway"
                            @click="removeListItem('takeaways', index)">
                            <template #icon>
                                <i class="pi pi-trash"></i>
                            </template>
                        </Button>
                    </div>
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.takeaways" />
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Featured</label>
                <div class="flex-auto">
                    <ToggleSwitch v-model="formData.is_featured" @focus="validations_errors.is_featured = ''" />
                    <LazyInputError class="text-sm mt-1" :message="validations_errors.is_featured" />
                </div>
            </div>

            <div class="flex items-center gap-4">
                <label class="font-semibold">Status</label>
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
