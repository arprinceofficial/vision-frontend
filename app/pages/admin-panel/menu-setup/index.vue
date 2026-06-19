<script setup>
const NestedLayer = defineAsyncComponent(() => import('./components/NestedLayer'));
const TextInput = defineAsyncComponent(() => import('./components/TextInput'));
const SkeletonLoader = defineAsyncComponent(() => import('./components/SkeletonLoader'));
const AddNew = defineAsyncComponent(() => import('./components/AddNew'));
const ContentHeaderSection = defineAsyncComponent(() => import('./components/ContentHeaderSection'));

definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });

const form = ref({
    id: null,
    node_name: null,
    route_name: null,
    route_location: null,
    pid: null,
    icon: 'fas fa-upload',
    status: false,
    serials: null,
});

const loader = ref(false);
const menuData = ref([]);
const loadData = async () => {
    loader.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/tree-entity/build-menu`, {
            method: 'GET',
        });
        menuData.value = getData.data.data;
    } catch (e) {
        console.log('Get Message', e.message);
    } finally {
        loader.value = false;
    }
};

onMounted(() => {
    loadData();
});

const reset = () => {
    Object.assign(form.value, {
        id: null,
        node_name: null,
        route_name: null,
        route_location: null,
        pid: null,
        icon: 'fas fa-upload',
        status: false,
        serials: null,
    });
};

const store = () => {
    console.log('Storing form data:', form.value);
};
const updateForm = (e) => {
    menuData.value.push(e);
};

const isLoading = ref(false);
const response_modal = ref({});
const savemenu = async (adata) => {
    isLoading.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/tree-entity/update-menu`, {
            method: 'POST',
            body: adata
        });
        if (getData.status == true) {
            response_modal.value = getData;
        }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 409) {
            response_modal.value = e.response._data;
        }
    } finally {
        isLoading.value = false;
    }
};

const isOpenModal = ref(false);
const cancelModal = () => {
    isOpenModal.value = false;
}
const addNew = () => {
    isOpenModal.value = true;
}
</script>

<template>
    <div class="menu-setup-page mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-4">
        <!-- Page header -->
        <div class="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div class="flex items-center gap-3.5">
                <div
                    class="flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-xl shadow-[0_4px_14px_rgba(99,102,241,0.35)]">
                    <i class="fa fa-sitemap"></i>
                </div>
                <div>
                    <h1 class="text-[22px] font-bold text-slate-800 dark:text-slate-100 m-0 tracking-tight">Menu Setup
                    </h1>
                    <p class="text-[13px] text-slate-400 m-0">Manage and organise your navigation menus</p>
                </div>
            </div>
            <button type="button"
                class="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-[13px] font-medium shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] cursor-pointer border-0"
                @click="addNew">
                <i class="pi pi-plus text-sm"></i>
                Add New Menu
            </button>
        </div>

        <!-- Content card -->
        <div
            class="bg-white dark:bg-slate-950 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-slate-800 p-5">
            <div v-if="loader">
                <SkeletonLoader />
            </div>
            <div v-else>
                <!-- Legend -->
                <div
                    class="flex items-center gap-5 flex-wrap px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] mb-4">
                    <span class="flex items-center gap-1.5 text-xs text-slate-500">
                        <i class="fa fa-grip-vertical text-[11px] text-slate-400"></i> Drag to reorder
                    </span>
                    <span class="flex items-center gap-1.5 text-xs text-slate-500">
                        <i class="fa fa-chevron-right text-[11px] text-indigo-500"></i> Toggle children
                    </span>
                    <span class="flex items-center gap-1.5 text-xs text-slate-500">
                        <span class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_0_2px_#dcfce7]"></span> Active
                    </span>
                    <span class="flex items-center gap-1.5 text-xs text-slate-500">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_0_2px_#fee2e2]"></span> Inactive
                    </span>
                </div>

                <form @submit.prevent="savemenu">
                    <NestedLayer :menus="menuData" :fromData="form" @deleteMenu="loadData" @updateMenu="loadData" />
                    <LazyFloatingActionBtn :icon="'fa fa-check'" :loader="isLoading" @dataSubmit="savemenu(menuData)" />
                </form>
            </div>
        </div>

        <AddNew :isOpenModal="isOpenModal" @close="cancelModal" @dataSubmit="updateForm($event)" />
        <LazyResponseModal :response_modal="response_modal" />
    </div>
</template>
