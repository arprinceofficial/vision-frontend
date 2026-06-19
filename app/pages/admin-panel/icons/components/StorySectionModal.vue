<script setup>
const props = defineProps({
    visible: Boolean,
    storySection: {
        type: [Array, Object],
        default: () => ([]),
    },
});

const emit = defineEmits(['update:visible', 'save']);

const getDefaultStorySection = () => ({
    upper_part: {
        headline: '',
        subhead_line: '',
        bg_image: '',
    },
    cards: [],
});

const normalizeStorySection = (value) => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const section = value[0] || {};
        return {
            upper_part: {
                headline: section.upper_part?.headline || '',
                subhead_line: section.upper_part?.subhead_line || '',
                bg_image: section.upper_part?.bg_image || '',
            },
            cards: Array.isArray(section.cards)
                ? section.cards.map((card) => ({
                    type: card?.type || 'text',
                    image: card?.image || '',
                    title_white: card?.title_white || '',
                    title_color: card?.title_color || '',
                    button_text: card?.button_text || '',
                    button_link: card?.button_link || '',
                }))
                : [],
        };
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return {
            upper_part: {
                headline: value.upper_part?.headline || '',
                subhead_line: value.upper_part?.subhead_line || '',
                bg_image: value.upper_part?.bg_image || '',
            },
            cards: Array.isArray(value.cards)
                ? value.cards.map((card) => ({
                    type: card?.type || 'text',
                    image: card?.image || '',
                    title_white: card?.title_white || '',
                    title_color: card?.title_color || '',
                    button_text: card?.button_text || '',
                    button_link: card?.button_link || '',
                }))
                : [],
        };
    }

    return getDefaultStorySection();
}

const draft = ref(getDefaultStorySection());

watch(() => props.visible, (newVal) => {
    if (newVal) {
        draft.value = normalizeStorySection(props.storySection);
    }
});

const closeModal = () => {
    emit('update:visible', false);
}

const saveModal = () => {
    emit('save', [
        {
            upper_part: {
                headline: draft.value.upper_part.headline,
                subhead_line: draft.value.upper_part.subhead_line,
                bg_image: draft.value.upper_part.bg_image,
            },
            cards: draft.value.cards.map((card) => ({
                type: card.type,
                image: card.image,
                title_white: card.title_white,
                title_color: card.title_color,
                button_text: card.button_text,
                button_link: card.button_link,
            })),
        },
    ]);
    emit('update:visible', false);
}

const addStoryCard = () => {
    draft.value.cards.push({
        type: 'text',
        image: '',
        title_white: '',
        title_color: '',
        button_text: '',
        button_link: '',
    });
}

const removeStoryCard = (index) => {
    draft.value.cards.splice(index, 1);
}

const setUpperPartPhoto = (photo) => {
    draft.value.upper_part.bg_image = photo;
}

const setStoryCardImage = (index, photo) => {
    draft.value.cards[index].image = photo;
}
</script>

<template>
    <Dialog :visible="visible" modal :closable="false" :style="{ width: '75rem' }" @update:visible="closeModal">
        <template #header>
            <div class="flex items-center justify-center w-full gap-2">
                <h4 class="text-xl font-semibold">Story Section</h4>
            </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="col-span-1 sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <h5 class="font-semibold mb-3">UpperPart</h5>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="sm:col-span-1">
                        <label class="font-semibold">Background Image</label>
                        <div class="w-[220px] mt-2">
                            <MediaGallery :getPhoto="draft.upper_part.bg_image" @set_photo="setUpperPartPhoto" />
                        </div>
                    </div>
                    <div class="sm:col-span-1">
                        <label class="font-semibold">Headline</label>
                        <LazyInputText v-model="draft.upper_part.headline" class="w-full" placeholder="i.e. The Rise" />
                    </div>
                    <div class="sm:col-span-1">
                        <label class="font-semibold">Subhead Line</label>
                        <LazyInputText v-model="draft.upper_part.subhead_line" class="w-full"
                            placeholder="i.e. Built from grit" />
                    </div>
                </div>
            </div>

            <div class="col-span-1 sm:col-span-3 border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-center mb-3">
                    <h5 class="font-semibold">Cards</h5>
                    <Button type="button" label="Add Card" severity="success" @click="addStoryCard" />
                </div>

                <div v-if="draft.cards.length === 0" class="text-sm text-gray-500">
                    No cards added yet.
                </div>

                <div v-for="(card, index) in draft.cards" :key="index" class="border border-gray-200 rounded-lg p-4 mb-4">
                    <div class="flex justify-between items-center mb-3">
                        <h6 class="font-semibold">Card {{ index + 1 }}</h6>
                        <Button type="button" label="Remove" severity="danger" outlined @click="removeStoryCard(index)" />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="font-semibold">Type</label>
                            <Select v-model="card.type" :options="[{ name: 'Image', value: 'image' }, { name: 'Text', value: 'text' }]"
                                optionLabel="name" optionValue="value" class="w-full" />
                        </div>

                        <div v-if="card.type === 'image'">
                            <label class="font-semibold">Image</label>
                            <div class="w-full mt-2">
                                <MediaGallery :getPhoto="card.image" @set_photo="(photo) => setStoryCardImage(index, photo)" />
                            </div>
                        </div>

                        <div v-if="card.type === 'text'">
                            <label class="font-semibold">Icon Name (Color)</label>
                            <LazyInputText v-model="card.title_color" class="w-full" />
                        </div>
                        <div v-if="card.type === 'text'">
                            <label class="font-semibold">Description</label>
                            <LazyInputText v-model="card.title_white" class="w-full" />
                        </div>
                        <div v-if="card.type === 'text'">
                            <label class="font-semibold">Button Text</label>
                            <LazyInputText v-model="card.button_text" class="w-full" />
                        </div>
                        <div v-if="card.type === 'text'">
                            <label class="font-semibold">Button Link</label>
                            <LazyInputText v-model="card.button_link" class="w-full" placeholder="i.e. /icons/michael-jordan" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end items-center gap-3">
                <Button type="button" label="Cancel" severity="danger" outlined @click="closeModal" />
                <Button type="button" label="Save Story Section" severity="success" @click="saveModal" />
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped></style>
