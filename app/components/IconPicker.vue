<script setup>
import fontLibrary from '~~/assets/json/fonts';

const props = defineProps({
    label: {
        type: String,
        default: 'Pick Your Icon',
    },
    modelValue: {
        type: String,
        default: 'fas fa-circle',
    },
    isOpenPicker: Boolean,
});

const emit = defineEmits(['update:modelValue', 'close']);

// States
const filterText = ref('');
const activeGlyph = ref(props.modelValue);
const isVisible = ref(false);

// Tabs Data
const tabs = [
    { id: 'all', title: 'All Icons', icon: 'fas fa-star-of-life', link: 'all' },
    { id: 'far', title: 'Regular', icon: 'fab fa-font-awesome-alt', link: fontLibrary.fontAwesome.variants.regular },
    { id: 'fas', title: 'Solid', icon: 'fab fa-font-awesome', link: fontLibrary.fontAwesome.variants.solid },
    { id: 'fab', title: 'Brands', icon: 'fab fa-font-awesome-flag', link: fontLibrary.fontAwesome.variants.brands },
    { id: 'social', title: 'Social', icon: 'fab fa-facebook', link: fontLibrary.fontAwesome.variants.social },
];

const activeTab = ref(tabs[0]);

const allGlyphs = [].concat(
    tabs[1].link.icons,
    tabs[2].link.icons,
    tabs[3].link.icons
);

const glyphs = computed(() => {
    let _glyphs = activeTab.value.id !== 'all' ? activeTab.value.link.icons : allGlyphs;
    if (filterText.value !== '') {
        const _filterText = filterText.value.toLowerCase();
        _glyphs = _glyphs.filter(item => item.substr(7, filterText.value.length) === _filterText);
    }
    return _glyphs;
});

const setActiveGlyph = (glyph) => { activeGlyph.value = glyph; };
const isActiveGlyph = (glyph) => activeGlyph.value === glyph;
const isActiveTab = (tab) => tab === activeTab.value.id;
const setActiveTab = (tab) => { activeTab.value = tab; };
const getGlyphName = (glyph) => glyph.replace(/f.. fa-/g, '').replace('-', ' ');

const findAndSetTabForIcon = (iconClass) => {
    for (let i = 1; i < tabs.length; i++) {
        const tab = tabs[i];
        if (tab.link.icons && tab.link.icons.includes(iconClass)) {
            activeTab.value = tab;
            nextTick(() => scrollToSelectedIcon(iconClass));
            return;
        }
    }
    activeTab.value = tabs[0];
    nextTick(() => scrollToSelectedIcon(iconClass));
};

const scrollToSelectedIcon = (iconClass) => {
    const container = document.querySelector('.ip-grid-scroll');
    const selectedIcon = document.querySelector(`[data-glyph="${iconClass}"]`);
    if (container && selectedIcon) {
        const containerRect = container.getBoundingClientRect();
        const iconRect = selectedIcon.getBoundingClientRect();
        const scrollTop = selectedIcon.offsetTop - container.offsetTop - (containerRect.height / 2) + (iconRect.height / 2);
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
};

const handlePreviewClick = () => {
    if (activeGlyph.value) scrollToSelectedIcon(activeGlyph.value);
};

const insert = () => {
    emit('update:modelValue', activeGlyph.value);
    emit('close');
    isVisible.value = false;
};

const closePicker = () => {
    emit('close');
    isVisible.value = false;
};

watch(() => props.isOpenPicker, (newVal) => {
    isVisible.value = newVal;
    if (newVal && props.modelValue) findAndSetTabForIcon(props.modelValue);
});

watch(() => props.modelValue, (newVal) => {
    activeGlyph.value = newVal;
    if (newVal && isVisible.value) findAndSetTabForIcon(newVal);
});
</script>

<template>
    <!-- Backdrop -->
    <Transition enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-150 ease-in" enter-from-class="opacity-0"
        leave-to-class="opacity-0">
        <div v-if="isVisible" class="fixed inset-0 bg-black/55 z-[9999] flex items-center justify-center p-4"
            @click.self="closePicker">
            <!-- Modal Card -->
            <div
                class="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col w-full max-w-4xl h-[82vh] max-h-[88vh] overflow-hidden">

                <!-- ── Header ── -->
                <div
                    class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <div class="flex items-center gap-3">
                        <!-- Icon badge — matches index.vue page-header style -->
                        <div
                            class="flex items-center justify-center w-11 h-11 rounded-[14px] bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-lg shadow-[0_4px_14px_rgba(99,102,241,0.35)] shrink-0">
                            <i class="fas fa-icons"></i>
                        </div>
                        <div>
                            <h2
                                class="text-lg font-bold text-slate-800 dark:text-slate-100 m-0 leading-tight tracking-tight">
                                {{ label }}</h2>
                            <p class="text-xs text-slate-400 mt-0.5 m-0">Browse and select an icon</p>
                        </div>
                    </div>
                    <!-- Close -->
                    <button type="button"
                        class="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400 cursor-pointer text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 hover:border-slate-300"
                        @click="closePicker" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- ── Body ── -->
                <div class="flex flex-1 min-h-0 overflow-hidden">

                    <!-- Sidebar -->
                    <aside
                        class="w-48 shrink-0 flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">

                        <!-- Tabs nav -->
                        <nav class="flex flex-col p-2 gap-0.5 flex-1">
                            <button type="button" v-for="tab in tabs" :key="tab.id"
                                class="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border-0 text-[13px] font-medium cursor-pointer text-left w-full transition-all"
                                :class="isActiveTab(tab.id)
                                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]'
                                    : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-700 dark:hover:text-indigo-300'"
                                @click="setActiveTab(tab)">
                                <i :class="[tab.icon, 'text-[14px] w-4 text-center shrink-0 transition-colors',
                                isActiveTab(tab.id) ? 'text-white' : 'text-slate-400 dark:text-slate-500']"></i>
                                <span>{{ tab.title }}</span>
                            </button>
                        </nav>

                        <!-- Selected icon preview -->
                        <div class="mx-2 mb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow overflow-hidden cursor-pointer transition-shadow shrink-0 hover:shadow-[0_4px_16px_rgba(99,102,241,0.18)]"
                            @click="handlePreviewClick" title="Click to scroll to icon">
                            <div
                                class="flex items-center justify-center px-3 py-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-slate-900">
                                <i :class="activeGlyph" class="text-5xl text-indigo-500"></i>
                            </div>
                            <div
                                class="p-2 text-[10px] text-slate-500 dark:text-slate-400 text-center break-all leading-snug">
                                {{ activeGlyph }}
                            </div>
                        </div>
                    </aside>

                    <!-- Icon Grid Area -->
                    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">

                        <!-- Search -->
                        <div class="relative px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
                            <i
                                class="fas fa-search absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none"></i>
                            <input v-model="filterText"
                                class="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-[10px] text-[13px] text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:italic focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-800"
                                placeholder="Filter icons by name…" />

                        </div>

                        <!-- Icons scroll -->
                        <div class="ip-grid-scroll flex-1 overflow-y-auto p-3">
                            <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                                <button type="button" v-for="glyph in glyphs" :key="glyph"
                                    class="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-lg transition-all min-w-0 overflow-hidden cursor-pointer"
                                    :class="isActiveGlyph(glyph)
                                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)]'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 hover:shadow-sm hover:-translate-y-px'"
                                    :data-glyph="glyph" :title="getGlyphName(glyph)" @click="setActiveGlyph(glyph)">
                                    <i :class="glyph"></i>
                                    <span class="text-[9px] truncate max-w-full capitalize">{{ getGlyphName(glyph)
                                    }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Footer ── -->
                <div
                    class="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
                    <button type="button"
                        class="px-5 py-2 rounded-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[13px] font-medium cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
                        @click="closePicker">
                        Cancel
                    </button>
                    <button type="button"
                        class="flex items-center gap-2 px-5 py-2 rounded-[10px] border-0 bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-[13px] font-semibold cursor-pointer shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)]"
                        @click="insert">
                        <i class="fas fa-check text-sm"></i>
                        Use Icon
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>
