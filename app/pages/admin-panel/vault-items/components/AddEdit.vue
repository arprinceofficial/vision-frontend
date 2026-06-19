<script setup>
const props = defineProps({
    isOpenModal: Boolean,
    modalTitle: String,
    item: Object,
    data: Array,
});

const emit = defineEmits(['add_emit', 'close']);
const { $submitDateTimeFormat, $parseDateValue } = useNuxtApp();

const visible = ref(props.isOpenModal);
watch(() => props.isOpenModal, (newVal) => {
    visible.value = newVal;
});

const formData = ref({
    id: null,
    icon_item_id: '',
    headline: '',
    subhead_line: '',
    price: '',
    starting_price: '',
    bid_increment: '',
    current_bid: '',
    drop_date: null,
    end_date: null,
    delivery_date: null,
    bg_image: '',
    summary_image: '',
    portfolio_image: '',
    is_reserved: 0,
    status: 0,
});

const isChecked = ref(false);
const isReservedChecked = ref(false);

watch(() => props.item, (value) => {
    if (value && Object.keys(value).length > 0) {
        validations_errors.value = {};
        formData.value = {
            id: value.id || null,
            icon_item_id: value.icon_item_id || value.icon_item?.id || '',
            headline: value.headline || '',
            subhead_line: value.subhead_line || '',
            price: value.price || '',
            starting_price: value.starting_price || '',
            bid_increment: value.bid_increment || '',
            current_bid: value.current_bid || '',
            drop_date: $parseDateValue(value.drop_date),
            end_date: $parseDateValue(value.end_date),
            delivery_date: $parseDateValue(value.delivery_date),
            bg_image: value.bg_image || '',
            summary_image: value.summary_image || '',
            portfolio_image: value.portfolio_image || '',
            is_reserved: value.is_reserved || 0,
            status: value.status || 0,
        };
        isReservedChecked.value = value.is_reserved == 1;
        isChecked.value = value.status == 1;
    } else {
        formData.value = {
            id: null,
            icon_item_id: '',
            headline: '',
            subhead_line: '',
            price: '',
            starting_price: '',
            bid_increment: '',
            current_bid: '',
            drop_date: null,
            end_date: null,
            delivery_date: null,
            bg_image: '',
            summary_image: '',
            portfolio_image: '',
            is_reserved: 0,
            status: 0,
        };
        isReservedChecked.value = false;
        isChecked.value = false;
    }
}, { immediate: true });

const isIconItemsLoading = ref(false);
const iconItems = ref([]);
const loadIconItems = async () => {
    isIconItemsLoading.value = true;
    try {
        const getData = await $fetchAdmin('v1/admin/icon-items', {
            method: 'GET',
        });
        iconItems.value = getData.data.data;
    } catch (e) {
    } finally {
        isIconItemsLoading.value = false;
    }
};

onMounted(() => {
    loadIconItems();
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

const handleStatusChange = () => {
    formData.value.status = isChecked.value ? 1 : 0;
};

const handleReservedChange = () => {
    formData.value.is_reserved = isReservedChecked.value ? 1 : 0;
};

const validations_errors = ref({});
const skip_validations = ref([
    'id',
    'bg_image',
    'summary_image',
    'portfolio_image',
    'is_reserved',
    'status',
]);

const isLoading = ref(false);
const response_modal = ref({});

const serializeSubmitData = () => {
    const submitData = { ...formData.value };
    submitData.drop_date = submitData.drop_date ? $submitDateTimeFormat(submitData.drop_date) : '';
    submitData.end_date = submitData.end_date ? $submitDateTimeFormat(submitData.end_date) : '';
    submitData.delivery_date = submitData.delivery_date ? $submitDateTimeFormat(submitData.delivery_date) : '';

    if (submitData.bg_image?.includes('http') || submitData.bg_image?.includes('https')) {
        delete submitData.bg_image;
    }
    if (submitData.summary_image?.includes('http') || submitData.summary_image?.includes('https')) {
        delete submitData.summary_image;
    }
    if (submitData.portfolio_image?.includes('http') || submitData.portfolio_image?.includes('https')) {
        delete submitData.portfolio_image;
    }

    return submitData;
};

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
        const submitData = serializeSubmitData();
        const getData = await $fetchAdmin(`v1/admin/vault-items/${props.item.id}`, {
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
    } finally {
        isLoading.value = false;
    }
};

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
        const submitData = serializeSubmitData();
        const getData = await $fetchAdmin('v1/admin/vault-items', {
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
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '80rem' }"
        @update:visible="$emit('close')">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">{{ modalTitle }} Vault Item</h4>
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
                <label class="font-semibold">Price</label>
                <LazyInputText v-model="formData.price" type="number" class="w-full"
                    :class="validations_errors.price ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.price = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.price" />
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
                <label class="font-semibold">Current Bid</label>
                <LazyInputText v-model="formData.current_bid" type="number" class="w-full"
                    :class="validations_errors.current_bid ? 'border-[#f44336!important]' : ''" autocomplete="off"
                    @focus="validations_errors.current_bid = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.current_bid" />
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
                <label class="font-semibold">Delivery Date</label>
                <DatePicker v-model="formData.delivery_date" showIcon fluid iconDisplay="input" :manualInput="false"
                    class="w-full" :class="validations_errors.delivery_date ? 'border-[#f44336!important]' : ''"
                    autocomplete="off" @focus="validations_errors.delivery_date = ''" />
                <LazyInputError class="text-sm mt-1" :message="validations_errors.delivery_date" />
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
            </div>

            <div class="flex items-center gap-3">
                <label class="font-semibold">Is Reserved</label>
                <ToggleSwitch v-model="isReservedChecked" @change="handleReservedChange"
                    @focus="validations_errors.is_reserved = ''" />
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
                            <i :class="modalTitle === 'Create' ? 'pi pi-plus-circle mr-2' : 'pi pi-refresh mr-2'" />
                        </template>
                    </Button>
                </template>
            </div>
        </template>
    </Dialog>
    <LazyResponseModal :response_modal="response_modal" />
</template>

<style lang="scss" scoped></style>
