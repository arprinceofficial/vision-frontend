<script setup>
const RecursiveMenuItem = defineAsyncComponent(() => import('./RecursiveMenuItem.vue'));

const route = useRoute();
const currentPath = computed(() => route.path);
const menuList = ref([]);
const isMenuLoading = ref(false);

const loadData = async () => {
    isMenuLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/tree-entity/main-menu`, { method: 'POST' });
        menuList.value = getData.data;
    } catch (e) {
        console.log('Get Message', e.message);
    } finally {
        isMenuLoading.value = false;
    }
};

const updateMenuState = () => {
    const setActiveState = (items) => {
        items.forEach((item) => {
            if (item.child && item.child.length) {
                item.is_open = item.child.some((child) => {
                    if (child.child && child.child.length) {
                        child.is_open = child.child.some(subChild => currentPath.value.startsWith(subChild.route));
                        return child.is_open || currentPath.value.startsWith(child.route);
                    }
                    return currentPath.value.startsWith(child.route);
                });
            }
        });
    };
    setActiveState(menuList.value);
};

watch(currentPath, () => { updateMenuState(); });

onMounted(async () => {
    await loadData();
    updateMenuState();
});

const toggleChildMenu = (item) => {
    if (item.child?.length) { item.is_open = !item.is_open; }
};

const hamburger_button = useState('hamburger_button', () => true);
const isMobile = useState('isMobile', () => false);

const closeSidebar = () => {
    if (isMobile.value) { hamburger_button.value = false; }
};

const checkWindowSize = () => {
    if (window?.innerWidth < 768) {
        hamburger_button.value = false;
        isMobile.value = true;
    } else {
        isMobile.value = false;
    }
};

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});
onBeforeUnmount(() => { window.removeEventListener('resize', checkWindowSize); });
watchEffect(() => { checkWindowSize(); });
</script>

<template>
    <!-- Mobile overlay -->
    <div v-if="isMobile && hamburger_button" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 transition-opacity"
        @click="closeSidebar" />

    <!-- Sidebar -->
    <aside
        class="fixed top-0 left-0 h-full flex flex-col z-20 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_20px_rgba(99,102,241,0.08)]"
        :class="[
            hamburger_button ? 'w-[280px]' : 'w-[68px]',
            !hamburger_button && isMobile ? '-translate-x-full' : 'translate-x-0'
        ]">
        <!-- Header -->
        <div class="flex items-center px-2.5 h-[60px] "
            :class="hamburger_button ? 'justify-between' : 'justify-center'">
            <NuxtLink :to="'/admin-panel'" class="min-w-0 overflow-hidden transition-all duration-200 flex justify-start items-center"
                :class="!hamburger_button ? 'opacity-0 w-0 pointer-events-none flex-none' : 'opacity-100 flex-1'">
                <!-- <LazyApplicationLogo :height="'40'" /> -->
                <p class="ml-2 text-lg font-bold text-gray-800 dark:text-white">Admin Portal</p>
            </NuxtLink>
            <button
                class="flex items-center justify-center w-[34px] h-[34px] rounded-[10px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm cursor-pointer transition-all duration-200 flex-shrink-0 hover:bg-indigo-50 hover:border-indigo-300 dark:hover:bg-gray-700 group"
                @click="hamburger_button = !hamburger_button" :title="hamburger_button ? 'Collapse' : 'Expand'">
                <i :class="hamburger_button ? 'fa fa-times' : 'fa fa-bars'"
                    class="text-[13px] text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>
        </div>

        <!-- Divider -->
        <div class="h-px mx-2 bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent flex-shrink-0" />

        <!-- Skeleton loading -->
        <div v-if="isMenuLoading" class="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2.5 space-y-1">
            <div v-for="i in 14" :key="i" class="flex items-center gap-2.5 px-2 py-2 rounded-[10px]"
                :class="hamburger_button ? 'min-h-[42px]' : 'justify-center min-h-[44px]'">
                <Skeleton :circle="!hamburger_button" :width="hamburger_button ? '2rem' : '1.6rem'"
                    :height="hamburger_button ? '1rem' : '1.6rem'" />
                <Skeleton v-if="hamburger_button" height="1rem" class="flex-1" />
            </div>
        </div>

        <!-- Menu -->
        <nav v-else
            class="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2.5 space-y-0.5 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
            <p v-if="hamburger_button"
                class="text-[9px] font-bold tracking-[1.2px] text-slate-400 uppercase px-2.5 pb-2 pt-1">
                Navigation
            </p>
            <RecursiveMenuItem v-for="(item, index) in menuList" :key="index" :item="item" :current-path="currentPath"
                :is-expanded="hamburger_button" @toggle-menu="toggleChildMenu" />
        </nav>

        <!-- Footer -->
        <div v-if="hamburger_button" class="flex-shrink-0 px-3.5 py-2.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-[10px] font-semibold tracking-[0.8px] uppercase text-slate-400">Admin Panel</span>
        </div>
    </aside>
</template>