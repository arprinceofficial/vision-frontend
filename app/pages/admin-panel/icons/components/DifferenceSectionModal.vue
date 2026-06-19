<script setup>
const props = defineProps({
    visible: Boolean,
    differenceSection: {
        type: [Array, Object],
        default: () => ([]),
    },
});

const emit = defineEmits(['update:visible', 'save']);

const getDefaultDifferenceSection = () => ({
    image: '',
    button_link: '',
    cards: [],
});

const normalizeDifferenceSection = (value) => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const section = value[0] || {};
        return {
            image: section.image || '',
            button_link: section.button_link || '',
            cards: Array.isArray(section.cards)
                ? section.cards.map((card) => ({
                    title_white: card?.title_white || '',
                    title_color: card?.title_color || '',
                    description: card?.description || '',
                }))
                : [],
        };
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return {
            image: value.image || '',
            button_link: value.button_link || '',
            cards: Array.isArray(value.cards)
                ? value.cards.map((card) => ({
                    title_white: card?.title_white || '',
                    title_color: card?.title_color || '',
                    description: card?.description || '',
                }))
                : [],
        };
    }

    return getDefaultDifferenceSection();
}

const draft = ref(getDefaultDifferenceSection());

watch(() => props.visible, (newVal) => {
    if (newVal) {
        draft.value = normalizeDifferenceSection(props.differenceSection);
    }
});

const closeModal = () => {
    emit('update:visible', false);
}

const saveModal = () => {
    emit('save', [
        {
            image: draft.value.image,
            button_link: draft.value.button_link,
            cards: draft.value.cards.map((card) => ({
                title_white: card.title_white,
                title_color: card.title_color,
                description: card.description,
            })),
        },
    ]);
    emit('update:visible', false);
}

const addCard = () => {
    draft.value.cards.push({
        title_white: '',
        title_color: '',
        description: '',
    });
}

const removeCard = (index) => {
    draft.value.cards.splice(index, 1);
}

const setDifferenceImage = (photo) => {
    draft.value.image = photo;
}
</script>

<template>
    <Dialog :visible="visible" modal :closable="false" :style="{ width: '70rem' }" @update:visible="closeModal">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">Difference Section</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="font-semibold">Image</label>
                <div class="w-[200px] mt-2">
                    <MediaGallery :getPhoto="draft.image" @set_photo="setDifferenceImage" />
                </div>
            </div>

            <div class="sm:col-span-2">
                <label class="font-semibold">Button Link</label>
                <LazyInputText v-model="draft.button_link" class="w-full" placeholder="i.e. /discover/difference" />
            </div>

            <div class="col-span-1 sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <h5 class="font-semibold">Cards</h5>
                    <Button type="button" label="Add Card" severity="success" @click="addCard" />
                </div>

                <div v-if="draft.cards.length === 0" class="text-sm text-gray-500">
                    No cards added yet.
                </div>

                <div v-for="(card, index) in draft.cards" :key="index" class="border border-gray-200 rounded-lg p-4 mb-4">
                    <div class="flex justify-between items-center mb-3">
                        <h6 class="font-semibold">Card {{ index + 1 }}</h6>
                        <Button type="button" label="Remove" severity="danger" outlined @click="removeCard(index)" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="font-semibold">Title</label>
                            <LazyInputText v-model="card.title_white" class="w-full" />
                        </div>
                        <!-- <div>
                            <label class="font-semibold">Title Color</label>
                            <LazyInputText v-model="card.title_color" class="w-full" />
                        </div> -->
                        <div class="sm:col-span-3">
                            <label class="font-semibold">Description</label>
                            <Textarea v-model="card.description" rows="3" class="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end items-center gap-3">
                <Button type="button" label="Cancel" severity="danger" outlined @click="closeModal" />
                <Button type="button" label="Save Difference" severity="success" @click="saveModal" />
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped></style>
