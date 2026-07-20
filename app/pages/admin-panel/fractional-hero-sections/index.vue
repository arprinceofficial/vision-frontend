<script setup>
const AddEdit = defineAsyncComponent(() => import('./components/AddEdit.vue'))
definePageMeta({ middleware: ['auth-admin'], layout: 'admin' })

const isLoading = ref(false)
const data = ref([])
const permissions = ref({})
const response_modal = ref({})

const heroItem = computed(() => data.value[0] || null)
const hasHeroSection = computed(() => !!heroItem.value)

const isActiveStatus = (status) => status === true || status == 1

const loadData = async () => {
	isLoading.value = true
	permissions.value = {}
	try {
		const getData = await $fetchAdmin('v1/admin/fractional-hero-sections', {
			method: 'GET',
		})
		data.value = Array.isArray(getData?.data?.data) ? getData.data.data : []
		permissions.value = getData?.data?.permissions || {}
	} catch (e) {
		response_modal.value = {
			status: false,
			message: e?.response?._data?.message || 'Failed to load fractional hero section.',
		}
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	loadData()
})

const isOpenModal = ref(false)
const item = ref({})
const modalTitle = ref('')

const openEditHandler = (row) => {
	modalTitle.value = 'Update'
	isOpenModal.value = true
	item.value = row
}

const openManageModal = () => {
	if (hasHeroSection.value) {
		openEditHandler(heroItem.value)
		return
	}

	item.value = {}
	modalTitle.value = 'Create'
	isOpenModal.value = true
}

const receivedData = (row) => {
	isOpenModal.value = false
	if (!hasHeroSection.value) {
		data.value = [row]
		return
	}

	data.value = data.value.map((existing) => (existing.id == row.id ? row : existing))
}

const cancelModal = () => {
	item.value = {}
	isOpenModal.value = false
}
</script>

<template>
	<div class="h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-6">
		<div class="h-full w-full overflow-auto">
			<div class="w-full flex flex-wrap justify-between items-center gap-4 mb-4">
				<div>
					<h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">Fractional Hero Section</h2>
				</div>
				<!-- <Skeleton v-if="isLoading" width="10rem" height="2.5rem" borderRadius="10px" />
				<Button
					v-else-if="permissions?.add || permissions?.edit"
					:label="hasHeroSection ? 'Update Fractional Hero Section' : 'Create Fractional Hero Section'"
					@click="openManageModal"
					class="text-xs"
				/> -->
			</div>

			<div class="pb-2 flex flex-col justify-between w-full">
				<div class="mt-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
					<div class="border-b border-gray-200">
						<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 py-2 px-4">
							Current Fractional Hero Section
						</h4>
					</div>

					<div class="p-4">
						<div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<Skeleton height="8rem" borderRadius="12px" />
							<Skeleton height="8rem" borderRadius="12px" />
						</div>

						<div
							v-else-if="hasHeroSection"
							class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5"
						>
							<div class="flex flex-wrap justify-between items-start gap-4">
								<div class="space-y-4 min-w-0">
									<div>
										<p class="text-xs uppercase tracking-wide text-gray-500">Headline</p>
										<h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 break-words">
											{{ heroItem.headline }}
										</h3>
									</div>

									<div>
										<p class="text-xs uppercase tracking-wide text-gray-500">Subhead Line</p>
										<p class="text-sm text-gray-700 dark:text-gray-300 break-words">
											{{ heroItem.subhead_line || 'N/A' }}
										</p>
									</div>

									<div>
										<p class="text-xs uppercase tracking-wide text-gray-500">Background Video</p>
										<a
											v-if="heroItem.bg_video"
											:href="heroItem.bg_video"
											target="_blank"
											class="text-blue-500 hover:underline break-all text-sm"
										>
											{{ heroItem.bg_video }}
										</a>
										<span v-else class="text-sm text-gray-400">N/A</span>
									</div>
								</div>

								<div class="flex flex-col items-end gap-3">
									<span
										class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
										:class="isActiveStatus(heroItem.status) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
									>
										{{ isActiveStatus(heroItem.status) ? 'Active' : 'Inactive' }}
									</span>
									<Button v-if="permissions?.edit" label="Edit" class="text-xs" @click="openEditHandler(heroItem)" />
								</div>
							</div>
						</div>

						<div
							v-else
							class="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8 text-center"
						>
							<div class="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
								<i class="fa-solid fa-bullhorn text-gray-600 dark:text-gray-200"></i>
							</div>
							<h5 class="text-base font-semibold text-gray-800 dark:text-gray-100">No Fractional Hero Section Yet</h5>
							<p class="text-sm text-gray-500 mt-1 mb-4">Create the first fractional hero section to activate this module.</p>
							<Button v-if="permissions?.add" label="Create Fractional Hero Section" class="text-xs" @click="openManageModal" />
						</div>
					</div>

					<AddEdit
						:isOpenModal="isOpenModal"
						:item="item"
						:modalTitle="modalTitle"
						:data="data"
						@close="cancelModal"
						@add_emit="receivedData"
					/>
					<LazyResponseModal :response_modal="response_modal" />
				</div>
			</div>
		</div>
	</div>
</template>
