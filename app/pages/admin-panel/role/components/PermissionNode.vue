<!-- 
  PermissionNode.vue — Recursive node for the Role Permission tree.
  Renders one permission item with an accordion for its children (infinite depth).
  Props:
    node    — a single permission object (with a `children` array added by the parent)
    form    — the reactive form object { viewPs, addPs, editPs, deletePs }
    depth   — current nesting level (0 = root), used for indentation styling
-->
<script setup>
const PermissionNode = defineAsyncComponent(() => import('./PermissionNode'));

const props = defineProps({
    node: { type: Object, required: true },
    form: { type: Object, required: true },
    depth: { type: Number, default: 0 },
});

const hasChildren = computed(() => props.node.children && props.node.children.length > 0);

const isOpen = ref(false);
const toggle = () => { isOpen.value = !isOpen.value; };

// Depth colour palette — same convention as the menu-setup pages
const depthColors = [
    '#6366f1', // indigo
    '#06b6d4', // cyan
    '#f59e0b', // amber
    '#10b981', // emerald
    '#f43f5e', // rose
    '#a855f7', // violet
];
const depthColor = computed(() => depthColors[props.depth % depthColors.length]);
</script>

<template>
    <!-- Wrapper gives left-border indent per depth level -->
    <div class="pn-node" :class="[depth > 0 ? 'pn-node--child' : 'pn-node--root']"
        :style="depth > 0 ? { borderLeftColor: depthColor } : {}">
        <!-- ── Row ── -->
        <div class="pn-row" :class="{ 'pn-row--clickable': hasChildren }" @click="hasChildren ? toggle() : undefined">
            <!-- Depth indicator dot -->
            <span v-if="depth > 0" class="pn-dot" :style="{ background: depthColor }" />

            <!-- Name -->
            <span class="pn-name">
                {{ node.node_name }}
                <span v-if="hasChildren" class="pn-badge" :style="{ background: depthColor + '20', color: depthColor }">
                    {{ node.children.length }}
                </span>
            </span>

            <!-- Spacer -->
            <span class="pn-spacer" />

            <!-- Checkboxes — parents show View only; leaves show all four -->
            <div class="pn-checks" @click.stop>
                <label v-if="node.view" class="pn-check-item">
                    <span class="pn-check-label">View</span>
                    <Checkbox :id="'p_view-' + node.view" v-model="form.viewPs" :value="node.view" />
                </label>
                <template v-if="!hasChildren">
                    <label v-if="node.add" class="pn-check-item">
                        <span class="pn-check-label">Add</span>
                        <Checkbox :id="'p_add-' + node.add" v-model="form.addPs" :value="node.add" />
                    </label>
                    <label v-if="node.edit" class="pn-check-item">
                        <span class="pn-check-label">Edit</span>
                        <Checkbox :id="'p_edit-' + node.edit" v-model="form.editPs" :value="node.edit" />
                    </label>
                    <label v-if="node.delete" class="pn-check-item">
                        <span class="pn-check-label">Del</span>
                        <Checkbox :id="'p_delete-' + node.delete" v-model="form.deletePs" :value="node.delete" />
                    </label>
                </template>
            </div>

            <!-- Chevron for accordion (only when has children) -->
            <span v-if="hasChildren" class="pn-chevron" :style="{ color: depthColor }">
                <i class="fa fa-chevron-right pn-chevron-icon" :class="{ 'pn-chevron-icon--open': isOpen }" />
            </span>
        </div>

        <!-- ── Children (recursive) ── -->
        <transition name="pn-expand">
            <div v-if="hasChildren && isOpen" class="pn-children">
                <PermissionNode v-for="child in node.children" :key="child.id" :node="child" :form="form"
                    :depth="depth + 1" />
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
/* ── Node wrapper ── */
.pn-node {
    margin-bottom: 4px;

    &--root {
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        overflow: hidden;
        background: #fff;
        transition: box-shadow 0.18s ease;

        &:hover {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
        }

        .dark & {
            background: #1e293b;
            border-color: #334155;
        }
    }

    &--child {
        border-left: 3px solid #6366f1;
        border-radius: 8px;
        background: #f8fafc;
        overflow: hidden;
        transition: border-left-color 0.2s;

        .dark & {
            background: #0f172a;
        }
    }
}

/* ── Row ── */
.pn-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    transition: background 0.15s;

    &--clickable {
        cursor: pointer;

        &:hover {
            background: #f1f5f9;

            .dark & {
                background: #1e293b;
            }
        }
    }
}

/* ── Depth dot ── */
.pn-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    opacity: 0.75;
}

/* ── Name ── */
.pn-name {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;

    .dark & {
        color: #f1f5f9;
    }
}

/* ── Child count badge ── */
.pn-badge {
    font-size: 9px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 10px;
}

.pn-spacer {
    flex: 1;
}

/* ── Checkboxes ── */
.pn-checks {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.pn-check-item {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
}

.pn-check-label {
    font-size: 11px;
    color: #64748b;
    white-space: nowrap;

    .dark & {
        color: #94a3b8;
    }
}

/* ── Chevron ── */
.pn-chevron {
    flex-shrink: 0;
    width: 20px;
    display: flex;
    justify-content: center;
}

.pn-chevron-icon {
    font-size: 10px;
    transition: transform 0.25s ease;

    &--open {
        transform: rotate(90deg);
    }
}

/* ── Children container ── */
.pn-children {
    padding: 4px 8px 6px 16px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;

    .dark & {
        border-color: #334155;
        background: #0f172a;
    }
}

/* ── Expand transition — opacity only, no max-height thrash ── */
.pn-expand-enter-active,
.pn-expand-leave-active {
    transition: opacity 0.22s ease;
    overflow: hidden;
}

.pn-expand-enter-from,
.pn-expand-leave-to {
    opacity: 0;
}

.pn-expand-enter-to,
.pn-expand-leave-from {
    opacity: 1;
}
</style>
