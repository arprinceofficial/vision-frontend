<script setup>
const PermissionNode = defineAsyncComponent(() => import('./components/PermissionNode'));
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' });
const route = useRoute();

const form = reactive({
    viewPs: [],
    addPs: [],
    editPs: [],
    deletePs: [],
});

const loader = ref(false);
const permissions = ref([]);

const loadData = async () => {
    loader.value = true;
    try {
        const getData = await $fetchAdmin(`v1/admin/role-permissions/show/${route.params.id}`, {
            method: 'POST',
        });
        permissions.value = getData.data;
        permissions.value.forEach(item => {
            if (item.viewP) { form.viewPs.push(item.view); }
            if (item.addP) { form.addPs.push(item.add); }
            if (item.editP) { form.editPs.push(item.edit); }
            if (item.deleteP) { form.deletePs.push(item.delete); }
        });
    } catch (e) {
        console.log('Get Message', e.message);
    } finally {
        loader.value = false;
    }
};

onMounted(() => { loadData(); });

const response_modal = ref({});
const isLoading = ref(false);
const updateHandler = async () => {
    isLoading.value = true;
    response_modal.value = {};
    // Sync checkbox state back onto the flat permissions array
    permissions.value.forEach(perm => {
        perm.viewP = form.viewPs.includes(perm.view) ? perm.view : null;
        perm.addP = form.addPs.includes(perm.add) ? perm.add : null;
        perm.editP = form.editPs.includes(perm.edit) ? perm.edit : null;
        perm.deleteP = form.deletePs.includes(perm.delete) ? perm.delete : null;
    });
    try {
        const getData = await $fetchAdmin(
            `v1/admin/role-permissions/permission-update/${route.params.id}`,
            { method: 'POST', body: permissions.value }
        );
        if (getData.status == true) { response_modal.value = getData; }
    } catch (e) {
        if (e.response?.status === 404 || e.response?.status === 409) {
            response_modal.value = e.response._data;
        }
    } finally {
        isLoading.value = false;
    }
};

/**
 * Build a tree from the flat permissions array.
 * Nodes with pid == 0 are roots. Each node gets a `children` array.
 * This is fully recursive — any depth is supported.
 */
const permissionTree = computed(() => {
    const map = {};
    const roots = [];

    // 1. Build a map id → node (with empty children array)
    permissions.value.forEach(p => {
        map[p.id] = { ...p, children: [] };
    });

    // 2. Attach each node to its parent
    permissions.value.forEach(p => {
        if (p.pid == 0 || !map[p.pid]) {
            roots.push(map[p.id]);
        } else {
            map[p.pid].children.push(map[p.id]);
        }
    });

    return roots;
});

const goBackHandler = () => { navigateTo({ name: 'admin-panel-role' }); };
</script>

<template>
    <div class="rp-page">
        <div class="rp-card">
            <!-- Header -->
            <div class="rp-card__header">
                <div class="rp-card__icon">
                    <i class="fa fa-shield-alt"></i>
                </div>
                <div>
                    <h1 class="rp-card__title">Role Wise Admin Menu Permission</h1>
                    <p class="rp-card__sub">Toggle permissions at any nesting level</p>
                </div>
            </div>

            <!-- Body -->
            <div class="rp-card__body">

                <!-- ── Skeleton loader ── -->
                <div v-if="loader" class="rp-skeleton-list">
                    <div v-for="i in 5" :key="i" class="rp-skeleton-item">
                        <div class="rp-skeleton-row">
                            <Skeleton width="12rem" height="1.4rem" />
                            <div class="flex items-center gap-2">
                                <Skeleton width="2.5rem" height="1.2rem" />
                                <Skeleton size="1.4rem" />
                            </div>
                        </div>
                        <div class="rp-skeleton-children">
                            <div v-for="j in 3" :key="j" class="rp-skeleton-child">
                                <Skeleton width="9rem" height="1.1rem" />
                                <div class="flex gap-2">
                                    <Skeleton width="2rem" height="1.1rem" />
                                    <Skeleton size="1.2rem" />
                                    <Skeleton width="2rem" height="1.1rem" />
                                    <Skeleton size="1.2rem" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Permission tree ── -->
                <div v-else class="rp-tree">
                    <PermissionNode v-for="node in permissionTree" :key="node.id" :node="node" :form="form"
                        :depth="0" />
                </div>

                <!-- ── Footer actions ── -->
                <div class="rp-actions">
                    <Button v-if="isLoading" severity="secondary" style="cursor: not-allowed; width: 80px;">
                        <ProgressSpinner style="width: 25px; height: 25px" strokeWidth="8" animationDuration=".5s" />
                    </Button>
                    <template v-else>
                        <Button type="button" label="Go Back" icon="pi pi-arrow-left" iconPos="left"
                            @click="goBackHandler()" />
                        <Button type="button" label="Update" icon="pi pi-refresh" iconPos="left"
                            @click="updateHandler()" />
                    </template>
                </div>
            </div>

            <LazyResponseModal :response_modal="response_modal" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.rp-page {
    max-width: 900px;
    margin: 24px auto;
    padding: 0 12px;
}

/* ── Card ── */
.rp-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.07);
    border: 1px solid #e2e8f0;
    overflow: hidden;

    .dark & {
        background: #0f172a;
        border-color: #1e293b;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
    }

    &__header {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
        background: #f8fafc;

        .dark & {
            background: #1e293b;
            border-color: #334155;
        }
    }

    &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: linear-gradient(135deg, #6366f1, #818cf8);
        color: white;
        font-size: 18px;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.30);
    }

    &__title {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        letter-spacing: -0.2px;

        .dark & {
            color: #f1f5f9;
        }
    }

    &__sub {
        font-size: 12px;
        color: #94a3b8;
        margin: 2px 0 0;
    }

    &__body {
        padding: 16px 20px;
    }
}

/* ── Tree container ── */
.rp-tree {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* ── Actions ── */
.rp-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 16px;
    margin-top: 16px;
    border-top: 1px solid #e2e8f0;

    .dark & {
        border-color: #334155;
    }
}

/* ── Skeleton ── */
.rp-skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.rp-skeleton-item {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;

    .dark & {
        border-color: #334155;
    }
}

.rp-skeleton-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #f8fafc;

    .dark & {
        background: #1e293b;
    }
}

.rp-skeleton-children {
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #fff;

    .dark & {
        background: #0f172a;
    }
}

.rp-skeleton-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
}
</style>