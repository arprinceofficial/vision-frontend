<script setup>
const RecursiveDropdown = defineAsyncComponent(() => import('./RecursiveDropdown.vue'));
const RecursiveMenuItem = defineAsyncComponent(() => import('./RecursiveMenuItem.vue'));

const props = defineProps({
    item: { type: Object, required: true },
    currentPath: { type: String, required: true },
    isExpanded: { type: Boolean, required: true },
    level: { type: Number, default: 0 },
});

const emit = defineEmits(['toggleMenu']);
const isMobile = ref(false);

onMounted(() => {
    isMobile.value = window.innerWidth < 768;
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768;
        if (isMobile.value && !props.isExpanded && props.item.is_open) closeDropdown();
    });
});

const handleClick = (item) => {
    if (item.child?.length) {
        if (isMobile.value && !props.isExpanded) return;
        emit('toggleMenu', item);
    }
};

const closeDropdown = () => {
    if (!props.isExpanded && props.item.is_open) emit('toggleMenu', props.item);
};

const handleLinkClick = (event) => {
    event.preventDefault();
    closeDropdown();
    const href = event.currentTarget.getAttribute('href');
    if (href) navigateTo(href);
};

const menuRef = ref(null);
const dropdownRef = ref(null);
const dropdownPosition = ref({ top: 0 });

onMounted(() => {
    const handleClickOutside = (event) => {
        if (!props.isExpanded && props.item.is_open &&
            menuRef.value && !menuRef.value.contains(event.target)) {
            closeDropdown();
        }
    };
    document.addEventListener('click', handleClickOutside);
    onUnmounted(() => document.removeEventListener('click', handleClickOutside));
    if (isMobile.value && !props.isExpanded && props.item.is_open) {
        nextTick(() => closeDropdown());
    }
});

watch(() => props.item.is_open, (newVal) => {
    if (newVal && !props.isExpanded && menuRef.value && !isMobile.value) {
        nextTick(() => {
            const rect = menuRef.value.getBoundingClientRect();
            dropdownPosition.value.top = rect.top;
            if (dropdownRef.value) {
                const dh = dropdownRef.value.offsetHeight;
                if (rect.top + dh > window.innerHeight) {
                    dropdownPosition.value.top = window.innerHeight - dh - 10;
                }
            }
        });
    }
});

const isPathMatch = (current, route) => {
    if (!route || route === '#') return false;
    if (current === route) return true;
    if (!current.startsWith(route)) return false;
    const nextChar = current.charAt(route.length);
    return nextChar === '/' || nextChar === '';
};

// Is this item or any descendant the active route?
const isActive = computed(() => {
    const check = (items) => items?.some(c =>
        isPathMatch(props.currentPath, c.route) || check(c.child)
    );
    return isPathMatch(props.currentPath, props.item.route) || check(props.item.child);
});
</script>

<template>
    <div class="relative mb-0.5" ref="menuRef">

        <!-- ── Leaf / link item ── -->
        <NuxtLink v-if="item.route !== '#' || !item.child?.length" :to="item.route === '#' ? '' : item.route"
            class="group flex items-center gap-2.5 px-2.5 rounded-[10px] relative overflow-hidden no-underline transition-all duration-150"
            :class="[
                isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                isExpanded ? 'py-2' : 'py-2.5 justify-center',
                level > 0 ? 'py-1.5' : ''
            ]">
            <!-- Active bar -->
            <span v-if="isActive"
                class="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[3px] bg-gradient-to-b from-indigo-400 to-indigo-600" />

            <!-- Icon box -->
            <span
                class="flex items-center justify-center w-8 h-8 rounded-[9px] flex-shrink-0 transition-all duration-150"
                :class="isActive
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.4)]'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-50 group-hover:border-indigo-200'">
                <i
                    :class="[item.icon, 'text-[15px] transition-colors duration-150', isActive ? 'text-white' : 'text-gray-800 dark:text-gray-400 group-hover:text-indigo-500']" />
            </span>

            <!-- Label -->
            <span v-if="isExpanded" class="flex-1 text-[15px] truncate transition-colors duration-150"
                :class="isActive ? 'font-semibold text-gray-800 dark:text-gray-100' : 'font-medium text-gray-800 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-100'">{{
                    item.name }}</span>

            <!-- Tooltip when collapsed -->
            <span v-if="!isExpanded"
                class="hidden group-hover:block absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg whitespace-nowrap z-[9999] pointer-events-none">{{
                    item.name }}</span>
        </NuxtLink>

        <!-- ── Parent item (has children) ── -->
        <div v-else
            class="group flex items-center gap-2.5 px-2.5 rounded-[10px] relative overflow-hidden cursor-pointer transition-all duration-150"
            :class="[
                isActive || item.is_open
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                isExpanded ? 'py-2' : 'py-2.5 justify-center',
                level > 0 ? 'py-1.5' : ''
            ]" @click="handleClick(item)">
            <span v-if="isActive || item.is_open"
                class="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[3px] bg-gradient-to-b from-indigo-400 to-indigo-600" />

            <span
                class="flex items-center justify-center w-8 h-8 rounded-[9px] flex-shrink-0 transition-all duration-150"
                :class="isActive || item.is_open
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-[0_4px_12px_rgba(99,102,241,0.4)]'
                    : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-50 group-hover:border-indigo-200'">
                <i
                    :class="[item.icon, 'text-[15px] transition-colors duration-150', isActive || item.is_open ? 'text-white' : 'text-gray-800 dark:text-gray-400 group-hover:text-indigo-500']" />
            </span>

            <span v-if="isExpanded" class="flex-1 text-[15px] truncate transition-colors duration-150"
                :class="isActive || item.is_open ? 'font-semibold text-gray-800 dark:text-gray-100' : 'font-medium text-gray-800 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-100'">{{
                    item.name }}</span>

            <!-- Chevron -->
            <span v-if="isExpanded && item.child?.length"
                class="flex items-center justify-center w-[18px] h-[18px] rounded-md flex-shrink-0 transition-all duration-200"
                :class="item.is_open ? 'bg-indigo-100 dark:bg-indigo-900/40 rotate-90' : 'bg-slate-100 dark:bg-slate-800'">
                <i class="fa fa-chevron-right text-[8px]" :class="item.is_open ? 'text-indigo-500' : 'text-gray-400'" />
            </span>

            <!-- Tooltip when collapsed -->
            <span v-if="!isExpanded"
                class="hidden group-hover:block absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg whitespace-nowrap z-[9999] pointer-events-none">{{
                    item.name }}</span>
        </div>

        <!-- ── Children (expanded) ── -->
        <Transition enter-active-class="transition-opacity duration-200 ease-in-out"
            leave-active-class="transition-opacity duration-200 ease-in-out" enter-from-class="opacity-0"
            leave-to-class="opacity-0">
            <div v-if="item.child?.length && item.is_open && isExpanded" class="relative pl-3.5 pt-1 mt-0.5">
                <!-- Guide line -->
                <span
                    class="absolute left-[15px] top-1 bottom-2.5 w-px bg-gradient-to-b from-indigo-300/60 to-transparent rounded pointer-events-none" />
                <RecursiveMenuItem v-for="(child, idx) in item.child" :key="child.id ?? idx" :item="child"
                    :current-path="currentPath" :is-expanded="isExpanded" :level="level + 1"
                    @toggle-menu="$emit('toggleMenu', $event)" />
            </div>
        </Transition>

        <!-- ── Fly-out dropdown (collapsed) ── -->
        <Transition enter-active-class="transition-[opacity,transform] duration-[180ms] ease-in-out"
            leave-active-class="transition-opacity duration-150 ease-in-out" enter-from-class="opacity-0 -translate-x-2"
            enter-to-class="opacity-100 translate-x-0" leave-to-class="opacity-0">
            <div v-if="item.child?.length && !isExpanded && item.is_open && !isMobile" ref="dropdownRef"
                class="fixed left-[76px] min-w-[210px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[14px] shadow-[0_8px_32px_rgba(99,102,241,0.12),0_2px_8px_rgba(0,0,0,0.08)] z-[9999] p-2 overflow-y-auto"
                style="max-height: 70vh;" :style="{ top: `${dropdownPosition.top}px` }" @mouseleave="closeDropdown">
                <!-- Arrow -->
                <span
                    class="absolute -left-1.5 top-3.5 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-l border-b border-slate-200 dark:border-slate-700 rotate-45 rounded-[1px]" />
                <!-- Title -->
                <p
                    class="text-[11px] font-bold tracking-[0.6px] uppercase text-gray-400 px-2 pb-2 pt-1 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                    {{ item.name }}
                </p>
                <RecursiveDropdown v-for="child in item.child" :key="child.id" :item="child" :current-path="currentPath"
                    :level="0" @toggle-menu="$emit('toggleMenu', $event)" @link-click="handleLinkClick" />
            </div>
        </Transition>
    </div>
</template>
