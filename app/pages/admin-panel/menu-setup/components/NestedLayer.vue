<script setup>
import { VueDraggableNext as draggable } from 'vue-draggable-next'
const NestedLayer = defineAsyncComponent(() => import('./NestedLayer'));
const TextInput = defineAsyncComponent(() => import('./TextInput'));

// Props
const props = defineProps({
	menus: Array,
	fromData: Object,
	handleClick: Function,
	depth: {
		type: Number,
		default: 0,
	},
})

// Emit
const emit = defineEmits(['event', 'deleteMenu', 'updateMenu'])

// Refs
const { menus, fromData, depth } = toRefs(props)

// ─── Depth-based colour palette ─────────────────────────────────────────────
const depthColors = [
	'#6366f1', // indigo   – level 0
	'#06b6d4', // cyan     – level 1
	'#f59e0b', // amber    – level 2
	'#10b981', // emerald  – level 3
	'#f43f5e', // rose     – level 4
	'#a855f7', // violet   – level 5
];
const depthColor = computed(() => depthColors[depth.value % depthColors.length]);
const nextDepth = computed(() => depth.value + 1);

// ─── Collapse state per item ─────────────────────────────────────────────────
const openChildren = ref({});
const toggleChildren = (id) => {
	openChildren.value[id] = !openChildren.value[id];
};
const isChildOpen = (id) => !!openChildren.value[id];

// ─── Delete ──────────────────────────────────────────────────────────────────
const isOpenConModal = ref(false);
const response_modal = ref({});
const deleteId = ref(null);
const deleteStatus = ref(null);

const openDeleteModal = (id, status) => {
	deleteId.value = id;
	deleteStatus.value = status;
	isOpenConModal.value = true;
};

const deleteHandler = async () => {
	response_modal.value = {};
	try {
		const getData = await $fetchAdmin(`v1/admin/tree-entity/delete-menu`, {
			method: 'POST',
			body: { id: deleteId.value, status: deleteStatus.value }
		});
		if (getData.status == true) {
			response_modal.value = getData;
			setTimeout(() => {
				emit('deleteMenu', deleteId.value);
			}, 2000);
		}
	} catch (e) {
		if (e.response?.status === 404 || e.response?.status === 409) {
			response_modal.value = e.response._data;
		}
	} finally {
		isOpenConModal.value = false;
	}
};

// ─── Form state ──────────────────────────────────────────────────────────────
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

const isLoading = ref(false);
const updateHandler = async (data) => {
	isLoading.value = true;
	try {
		const getData = await $fetchAdmin(`v1/admin/tree-entity/${data.id}`, {
			method: 'PUT',
			body: data
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

// ─── Edit form ───────────────────────────────────────────────────────────────
const editingId = ref(null);
const edit_item = (element) => {
	if (editingId.value === element.id) {
		editingId.value = null;
	} else {
		editingId.value = element.id;
		form.value = { ...element };
	}
};

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
	editingId.value = null;
};

// ─── Icon picker ─────────────────────────────────────────────────────────────
const isOpenPicker = ref(false);
const OpenPicker = () => { isOpenPicker.value = true; }
const cancelPicker = () => { isOpenPicker.value = false; }
</script>

<template>
	<!-- Drag ghost / active styles injected globally (can't be done with Tailwind scoped) -->
	<draggable class="list-none m-0 p-0 min-h-[8px]" handle=".section_drag_cross" tag="ul" :list="menus"
		:group="{ name: 'g1' }" :animation="200" :force-fallback="false">
		<template v-for="element in menus" :key="element.id">
			<li class="relative mb-1.5">

				<!-- Depth connector dot -->
				<span v-if="depth > 0"
					class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-70 pointer-events-none"
					:style="{ background: depthColor }" />

				<!-- ── Main Row ── -->
				<div class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border-[1.5px] transition-all duration-200 relative cursor-default group"
					:class="element.status == 1
						? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-400 hover:-translate-y-px'
						: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'" :style="{ '--depth-color': depthColor }">
					<!-- Depth accent bar -->
					<span
						class="absolute left-1.5 top-[20%] bottom-[20%] w-[3.5px] rounded-[4px] opacity-40 group-hover:opacity-100 transition-opacity duration-200"
						:style="{ background: depthColor }" />

					<!-- Drag handle -->
					<span
						class="flex items-center justify-center w-[26px] h-[26px] text-slate-400 cursor-grab active:cursor-grabbing rounded-md flex-shrink-0 transition-colors duration-150 hover:text-slate-600 hover:bg-slate-100 section_drag_cross"
						title="Drag to reorder">
						<i class="fa fa-grip-vertical text-[11px]"></i>
					</span>

					<!-- Depth level badge -->
					<span v-if="depth > 0"
						class="text-[9px] font-extrabold px-1.5 py-px rounded-[10px] border flex-shrink-0 uppercase tracking-[0.3px]"
						:style="{ background: depthColor + '20', color: depthColor, borderColor: depthColor + '40' }">L{{
							depth }}</span>

					<!-- Icon box -->
					<span
						class="flex items-center justify-center w-[30px] h-[30px] rounded-lg flex-shrink-0 text-[12px] transition-transform duration-150 group-hover:scale-105"
						:class="element.status == 1
							? 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600'
							: 'bg-gradient-to-br from-red-50 to-red-100 text-red-500'">
						<i :class="element.icon"></i>
					</span>

					<!-- Name & route -->
					<div class="flex flex-col flex-1 min-w-0 gap-px">
						<span
							class="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
							{{ element.node_name }}
							<span v-if="element.menus && element.menus.length > 0"
								class="text-[9px] font-extrabold px-1.5 py-px rounded-[10px]"
								:style="{ background: depthColor + '20', color: depthColor }">{{ element.menus.length
								}}</span>
						</span>
						<span v-if="element.route_name" class="text-[10px] text-slate-400 truncate">
							{{ element.route_name }}
						</span>
					</div>

					<!-- Status badge -->
					<span
						class="px-2.5 py-px rounded-full text-[9px] font-bold tracking-[0.5px] uppercase flex-shrink-0 border"
						:class="element.status == 1
							? 'bg-emerald-50 text-emerald-700 border-emerald-200'
							: 'bg-red-50 text-red-700 border-red-200'">{{ element.status == 1 ? 'Active' : 'Inactive' }}</span>

					<!-- Actions -->
					<div class="flex items-center gap-2 flex-shrink-0">
						<!-- Edit -->
						<button type="button"
							class="flex items-center justify-center w-7 h-7 rounded-lg border text-[10px] cursor-pointer transition-all duration-150 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:scale-110"
							:class="{ 'bg-emerald-500 !text-white border-emerald-500': editingId === element.id }"
							title="Edit" @click="edit_item(element)"><i class="fa fa-pencil"></i></button>

						<!-- Delete -->
						<button v-if="element.status == 1" type="button"
							class="flex items-center justify-center w-7 h-7 rounded-lg border text-[10px] cursor-pointer transition-all duration-150 bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110"
							title="Delete" @click="openDeleteModal(element.id, 0)"><i class="fa fa-trash"></i></button>

						<!-- Restore -->
						<button v-else type="button"
							class="flex items-center justify-center w-7 h-7 rounded-lg border text-[10px] cursor-pointer transition-all duration-150 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-110"
							title="Restore" @click="openDeleteModal(element.id, 1)"><i class="fa fa-undo"></i></button>

						<!-- Toggle children (always visible) -->
						<button type="button"
							class="flex items-center justify-center w-7 h-7 rounded-lg border text-[9px] cursor-pointer transition-all duration-150 px-2"
							:class="isChildOpen(element.id)
								? 'scale-105'
								: 'bg-violet-50 text-indigo-500 border-indigo-200 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 hover:scale-105'"
							:style="isChildOpen(element.id)
								? { background: depthColors[nextDepth % depthColors.length] + '20', color: depthColors[nextDepth % depthColors.length], borderColor: depthColors[nextDepth % depthColors.length] + '50' }
								: {}" :title="isChildOpen(element.id) ? 'Collapse children' : 'Expand / add children'"
							@click="toggleChildren(element.id)">
							<i class="fa fa-chevron-right text-[9px] transition-transform duration-200"
								:class="{ 'rotate-90': isChildOpen(element.id) }"></i>
						</button>
					</div>
				</div>

				<!-- ── Inline Edit Form ── -->
				<Transition enter-active-class="transition-[opacity,transform] duration-300 ease-out"
					leave-active-class="transition-[opacity,transform] duration-200 ease-in"
					enter-from-class="opacity-0 -translate-y-1" leave-to-class="opacity-0 -translate-y-1">
					<div v-if="editingId === element.id"
						class="my-1.5 ml-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-l-[3px]"
						:style="{ borderLeftColor: depthColor }">
						<form @submit.prevent="updateHandler(form)">
							<div class="grid grid-cols-2 gap-2.5 mb-2.5 max-sm:grid-cols-1">
								<TextInput v-model="form.node_name" :error="form.errors?.node_name" class="w-full"
									label="Name" placeholder="i.e Name" />
								<TextInput v-model="form.route_name" :error="form.errors?.route_name" class="w-full"
									label="Route" placeholder="i.e Route" />
								<TextInput v-model="form.route_location" :error="form.errors?.route_location"
									class="w-full" label="Api Route Permission"
									placeholder="i.e Api Route Permission" />
								<div class="flex items-end gap-2">
									<TextInput v-model="form.icon" :error="form.errors?.icon" class="w-full"
										label="Icon" placeholder="i.e Icon" disabled />

									<!-- Icon Picker Trigger -->
									<button type="button"
										class="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-[10px] border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(99,102,241,0.3)] group"
										@click="OpenPicker" title="Choose icon">
										<span
											class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-sm shadow-sm group-hover:bg-white group-hover:text-indigo-600 transition-all duration-200">
											<i :class="form.icon"></i>
										</span>
										<span class="hidden sm:inline whitespace-nowrap">Pick Icon</span>
									</button>

									<LazyIconPicker :isOpenPicker="isOpenPicker" :modelValue="form.icon"
										@close="cancelPicker" @update:modelValue="form.icon = $event" />
								</div>

							</div>
							<div class="flex justify-end gap-2 mt-1">
								<!-- Loading state -->
								<button v-if="isLoading" type="button" disabled
									class="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 text-[13px] font-medium cursor-not-allowed border border-slate-200 dark:border-slate-700">
									<svg class="animate-spin w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg"
										fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
											stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
									</svg>
									Saving…
								</button>

								<template v-else>
									<!-- Cancel -->
									<button type="button"
										class="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-red-200 bg-red-50 text-red-600 text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:-translate-y-px hover:shadow-md dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
										@click="reset">
										<i class="fas fa-times text-sm"></i>
										Cancel
									</button>

									<!-- Save -->
									<button type="button"
										class="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border-0 bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-[13px] font-semibold cursor-pointer shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)]"
										@click="updateHandler(form)">
										<i class="fas fa-check text-sm"></i>
										Save
									</button>
								</template>
							</div>

						</form>
					</div>
				</Transition>

				<!--
				  v-show (not v-if) so the DOM node stays alive while drag is hovering.
				  No max-height transition — avoids layout thrash on first child drop.
				-->
				<div v-show="isChildOpen(element.id)" class="mt-1 pl-5 relative">
					<!-- Vertical guide line -->
					<span
						class="absolute left-2.5 top-1 bottom-2.5 w-0.5 rounded pointer-events-none opacity-30 transition-opacity duration-200 group-hover:opacity-60"
						:style="{ background: depthColors[nextDepth % depthColors.length] }" />

					<!--
					  Empty drop zone — v-show keeps it in DOM.
					  pointer-events:none lets drag events through to <draggable>.
					-->
					<div v-show="!element.menus || element.menus.length === 0"
						class="flex items-center gap-2 px-3.5 py-2.5 mb-1 border-2 border-dashed rounded-[10px] text-[11px] font-medium pointer-events-none select-none animate-pulse"
						:style="{ borderColor: depthColors[nextDepth % depthColors.length] + '60', color: depthColors[nextDepth % depthColors.length] }">
						<i class="fa fa-arrow-down text-[11px]"></i>
						<span>Drop items here to nest</span>
					</div>

					<!-- Recursive -->
					<NestedLayer :menus="element.menus || []" :fromData="fromData" :depth="nextDepth"
						@deleteMenu="$emit('deleteMenu', $event)" @updateMenu="$emit('updateMenu', $event)" />
				</div>

			</li>
		</template>
	</draggable>

	<LazyConfirmModal :isOpenConModal="isOpenConModal" @confirm="deleteHandler"
		@update:isOpenConModal="isOpenConModal = $event" />
	<LazyResponseModal :response_modal="response_modal" />
</template>