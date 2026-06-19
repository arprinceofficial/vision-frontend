<script setup>
const props = defineProps({
	id: {
		type: String,
	},
	type: {
		type: String,
		default: 'text',
	},
	error: {
		type: String,
		default: null,
	},
	label: {
		type: String,
		default: null,
	},
	modelValue: {
		type: String,
		default: '',
	},
	required: {
		type: Boolean,
		default: false,
	},
	placeholder: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
	<div class="flex flex-col gap-1.5">
		<!-- Label -->
		<label v-if="label" :for="id" class="text-[13px] font-medium text-slate-600 dark:text-slate-300 leading-none">
			{{ label }}
			<span v-if="required" class="text-red-500 ml-0.5">*</span>
		</label>

		<!-- Input -->
		<input :id="id" :type="type" :value="modelValue" :required="required" :placeholder="placeholder"
			v-bind="{ ...$attrs, class: null }"
			class="w-full px-3 py-2 text-[13px] text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border rounded-[10px] outline-none transition-all placeholder:text-slate-400 placeholder:italic"
			:class="error
				? 'border-red-400 ring-2 ring-red-400/20 focus:border-red-500 focus:ring-red-500/20'
				: 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'"
			@input="$emit('update:modelValue', $event.target.value)" />

		<!-- Error message -->
		<p v-if="error" class="flex items-center gap-1 text-[12px] text-red-500 mt-0.5">
			<i class="fas fa-circle-exclamation text-[10px]"></i>
			{{ error }}
		</p>
	</div>
</template>
