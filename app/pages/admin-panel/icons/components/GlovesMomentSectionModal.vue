<script setup>
const props = defineProps({
    visible: Boolean,
    glovesMomentSection: {
        type: [Array, Object],
        default: () => ([]),
    },
});

const emit = defineEmits(['update:visible', 'save']);

const getDefaultGlovesMomentSection = () => ({
    title_white: '',
    title_color: '',
    image_slider: [],
});

const normalizeGlovesMomentSection = (value) => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const section = value[0] || {};
        return {
            title_white: section.title_white || '',
            title_color: section.title_color || '',
            image_slider: normalizeImageSlider(section.image_slider),
        };
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return {
            title_white: value.title_white || '',
            title_color: value.title_color || '',
            image_slider: normalizeImageSlider(value.image_slider),
        };
    }

    return getDefaultGlovesMomentSection();
}

const normalizeImageSlider = (slider) => {
    if (!Array.isArray(slider)) return [];
    return slider.map((slide) => {
        // Support both old format { image, caption } and new format (plain URL string)
        if (typeof slide === 'string') return slide;
        return slide?.image || slide?.url || '';
    }).filter(Boolean);
}

const draft = ref(getDefaultGlovesMomentSection());

watch(() => props.visible, (newVal) => {
    if (newVal) {
        draft.value = normalizeGlovesMomentSection(props.glovesMomentSection);
    }
});

const closeModal = () => {
    emit('update:visible', false);
}

const saveModal = () => {
    emit('save', [
        {
            title_white: draft.value.title_white,
            title_color: draft.value.title_color,
            image_slider: draft.value.image_slider.map((url) => ({
                image: url,
            })),
        },
    ]);
    emit('update:visible', false);
}

const setSliderImages = (photos) => {
    draft.value.image_slider = photos;
}
</script>

<template>
    <Dialog :visible="visible" modal :closable="false" :style="{ width: '70rem' }" @update:visible="closeModal">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">Moment Section</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
                <label class="font-semibold">Title White</label>
                <LazyInputText v-model="draft.title_white" class="w-full" placeholder="i.e. Defining" />
            </div>
            <div class="sm:col-span-1">
                <label class="font-semibold">Title Color</label>
                <LazyInputText v-model="draft.title_color" class="w-full" placeholder="i.e. Moments" />
            </div>

            <div class="col-span-1 sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <label class="font-semibold block mb-3">Image Slider</label>
                <MediaGallery :getPhoto="draft.image_slider" :multiple="true" @set_photo="setSliderImages" />
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end items-center gap-3">
                <Button type="button" label="Cancel" severity="danger" outlined @click="closeModal" />
                <Button type="button" label="Save Gloves Moment" severity="success" @click="saveModal" />
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped></style>
