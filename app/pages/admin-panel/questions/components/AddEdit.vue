<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);

const visible = computed({
    get: () => props.isOpenModal,
    set: (value) => {
        if (!value) emit('close');
    }
});

const toInputValue = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const toNumber = (value) => {
    if (value === '' || value === null || value === undefined) return value;
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? value : numberValue;
};

const normalizeOptions = (options) => {
    if (!Array.isArray(options)) return [];
    return options.map((option) => {
        if (typeof option === 'string') return option;
        return option?.label || option?.title || option?.text || option?.value || '';
    });
};

const getInitialFormData = () => ({
    id: null,
    quiz_type_id: '',
    type: '',
    title: '',
    question_text: '',
    question_description: '',
    options: [],
    correct_option: '',
});

const formData = ref(getInitialFormData());
const validations_errors = ref({});

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            quiz_type_id: value.quiz_type_id || value.quiz_type?.id || value.quizType?.id || '',
            type: value.type || '',
            title: value.title || '',
            question_text: value.question_text || '',
            question_description: value.question_description || '',
            options: normalizeOptions(value.options),
            correct_option: value.correct_option || '',
        };
    } else {
        formData.value = getInitialFormData();
    }
}, { immediate: true });

const isQuizTypesLoading = ref(false);
const quizTypes = ref([]);

const loadQuizTypes = async () => {
    isQuizTypesLoading.value = true;
    try {
        const getData = await $fetchAdmin('v1/admin/onboarding/quiz-types', {
            method: 'GET',
            query: {
                paginate: false,
            },
        });
        quizTypes.value = Array.isArray(getData?.data?.data) ? getData.data.data : [];
    } catch (e) {
        quizTypes.value = [];
    } finally {
        isQuizTypesLoading.value = false;
    }
};

onMounted(() => {
    loadQuizTypes();
});

const addOption = () => {
    formData.value.options.push('');
};

const removeOption = (index) => {
    formData.value.options.splice(index, 1);
};

const requiredFields = [
    'quiz_type_id',
    'type',
    'title',
    'question_text',
    'question_description',
    'correct_option',
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

const payload = computed(() => ({
    quiz_type_id: toNumber(formData.value.quiz_type_id),
    type: formData.value.type,
    title: formData.value.title,
    question_text: formData.value.question_text,
    question_description: formData.value.question_description,
    options: formData.value.options.filter(Boolean),
    correct_option: formData.value.correct_option,
}));

const applyValidationErrors = (errorData) => {
    if (!errorData) return;

    for (const key in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, key)) {
            validations_errors.value[key] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
        }
    }
};

const handleRequestError = (e) => {
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
        const getData = await $fetchAdmin(`v1/admin/onboarding/questions/${props.item.id}`, {
            method: 'PUT',
            body: payload.value,
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
        const getData = await $fetchAdmin('v1/admin/onboarding/questions', {
            method: 'POST',
            body: payload.value,
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
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '58rem', maxWidth: 'calc(100vw - 2rem)' }">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Question</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="font-semibold">Quiz Type</label>
                <Select v-model="formData.quiz_type_id" :options="quizTypes" filter optionLabel="name" optionValue="id"
                    placeholder="Select Quiz Type" class="w-full" :loading="isQuizTypesLoading"
                    :class="validations_errors.quiz_type_id ? 'border-[#f44336!important]' : ''"
                    @focus="validations_errors.quiz_type_id = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.quiz_type_id" />
            </div>

            <div>
                <label class="font-semibold">Type</label>
                <LazyInputText v-model="formData.type" class="w-full" placeholder="i.e. single_choice"
                    :class="validations_errors.type ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.type = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.type" />
            </div>

            <div class="sm:col-span-2">
                <label class="font-semibold">Title</label>
                <LazyInputText v-model="formData.title" class="w-full" placeholder="i.e. Investment Experience"
                    :class="validations_errors.title ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.title = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.title" />
            </div>

            <div class="sm:col-span-2">
                <label class="font-semibold">Question Text</label>
                <LazyInputText v-model="formData.question_text" class="w-full" placeholder="i.e. How experienced are you?"
                    :class="validations_errors.question_text ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.question_text = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.question_text" />
            </div>

            <div class="sm:col-span-2">
                <label class="font-semibold">Question Description</label>
                <Textarea v-model="formData.question_description" class="w-full"
                    placeholder="i.e. Add supporting context for this question"
                    :class="validations_errors.question_description ? 'border-[#f44336!important]' : ''" rows="3"
                    @focus="validations_errors.question_description = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.question_description" />
            </div>

            <div class="sm:col-span-2 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <label class="font-semibold">Options</label>
                    <Button type="button" label="Add Option" icon="pi pi-plus" severity="success" @click="addOption" />
                </div>

                <div v-if="formData.options.length === 0" class="text-sm text-gray-500 mb-2">
                    No options added yet.
                </div>

                <div v-for="(option, index) in formData.options" :key="index" class="flex items-center gap-2 mb-3">
                    <LazyInputText v-model="formData.options[index]" class="w-full" autocomplete="off"
                        :placeholder="`Option ${index + 1}`" />
                    <Button type="button" icon="pi pi-trash" severity="danger" outlined @click="removeOption(index)" />
                </div>
                <LazyInputError class="text-sm mt-1" :message="validations_errors.options" />
            </div>

            <div class="sm:col-span-2">
                <label class="font-semibold">Correct Option</label>
                <LazyInputText v-model="formData.correct_option" class="w-full" placeholder="i.e. option_a"
                    :class="validations_errors.correct_option ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.correct_option = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.correct_option" />
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
