<script setup>
const RecursiveDropdown = defineAsyncComponent(() => import('./RecursiveDropdown.vue'));

const props = defineProps({
    item: { type: Object, required: true },
    currentPath: { type: String, required: true },
    level: { type: Number, default: 0 },
});

const emit = defineEmits(['toggle-menu', 'link-click']);

const handleItemClick = () => {
    if (props.item.child?.length) emit('toggle-menu', props.item);
};

const emitLinkClick = (event) => { emit('link-click', event); };

const isActive = computed(() => {
    const check = (children) => {
        if (!children?.length) return false;
        return children.some(c =>
            props.currentPath === c.route ||
            (c.route && c.route !== '#' && props.currentPath.startsWith(c.route)) ||
            check(c.child)
        );
    };
    return props.currentPath === props.item.route ||
        (props.item.route && props.item.route !== '#' && props.currentPath.startsWith(props.item.route)) ||
        check(props.item.child);
});
</script>

<template>
    <div class="relative mb-0.5">
        <div class="relative" :class="level > 0 ? 'pl-[18px]' : ''">

            <!-- Guide connectors for nested items -->
            <template v-if="level > 0">
                <span
                    class="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-300/50 to-transparent pointer-events-none" />
                <span class="absolute left-[7px] top-4 w-2.5 h-px bg-indigo-300/50 pointer-events-none" />
            </template>

            <!-- ── Leaf item ── -->
            <NuxtLink v-if="!item.child?.length" :to="item.route === '#' ? '' : item.route"
                class="group relative flex items-center gap-2 py-1.5 px-2 rounded-[9px] no-underline transition-all duration-150"
                :class="isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.18)]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'" @click="emitLinkClick">
                <!-- Active dot -->
                <span v-if="isActive"
                    class="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(129,140,248,0.8)]" />

                <span
                    class="flex items-center justify-center w-[26px] h-[26px] rounded-[7px] flex-shrink-0 transition-all duration-150"
                    :class="isActive
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.4)]'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-50 group-hover:border-indigo-200'">
                    <i
                        :class="[item.icon, 'text-[11px] transition-colors duration-150', isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-500']" />
                </span>

                <span class="flex-1 text-[12.5px] truncate transition-colors duration-150"
                    :class="isActive ? 'font-semibold text-slate-800 dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100'">{{
                        item.name }}</span>
            </NuxtLink>

            <!-- ── Parent item (has children) ── -->
            <div v-else
                class="group relative flex items-center gap-2 py-1.5 px-2 rounded-[9px] cursor-pointer transition-all duration-150"
                :class="isActive || item.is_open
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.18)]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'" @click="handleItemClick">
                <span v-if="isActive || item.is_open"
                    class="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(129,140,248,0.8)]" />

                <span
                    class="flex items-center justify-center w-[26px] h-[26px] rounded-[7px] flex-shrink-0 transition-all duration-150"
                    :class="isActive || item.is_open
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.4)]'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-50 group-hover:border-indigo-200'">
                    <i
                        :class="[item.icon, 'text-[11px] transition-colors duration-150', isActive || item.is_open ? 'text-white' : 'text-slate-500 group-hover:text-indigo-500']" />
                </span>

                <span class="flex-1 text-[12.5px] truncate transition-colors duration-150"
                    :class="isActive || item.is_open ? 'font-semibold text-slate-800 dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100'">{{
                        item.name }}</span>

                <span
                    class="flex items-center justify-center w-4 h-4 rounded-[5px] flex-shrink-0 transition-all duration-200"
                    :class="item.is_open ? 'bg-indigo-100 dark:bg-indigo-900/40 rotate-90' : 'bg-slate-100 dark:bg-slate-800'">
                    <i class="fa fa-chevron-right text-[7px]"
                        :class="item.is_open ? 'text-indigo-500' : 'text-slate-400'" />
                </span>
            </div>

            <!-- ── Recursive children ── -->
            <div v-if="item.child?.length && item.is_open" class="mt-0.5 pl-1.5">
                <RecursiveDropdown v-for="(childItem, idx) in item.child" :key="childItem.id ?? idx" :item="childItem"
                    :current-path="currentPath" :level="level + 1" @toggle-menu="$emit('toggle-menu', $event)"
                    @link-click="$emit('link-click', $event)" />
            </div>
        </div>
    </div>
</template>
