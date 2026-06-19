<script setup>
	defineProps({
		modelValue: {
			type: String,
			required: true
		}
	});

	defineEmits(['update:modelValue']);

	const input = ref(null);

	onMounted(() => {
		if (input.value.hasAttribute('autofocus')) {
			input.value.focus();
		}
	});

	defineExpose({ focus: () => input.value.focus() });
</script>

<template>
	<input
		class="mt-1 flex w-full items-center rounded-md border border-solid border-[#00d6b0] p-3 text-sm transition-colors duration-200 [box-shadow:0px_1px_3px_0px_rgba(0,_0,_0,_0.05)] focus:border-[#00d6b0] focus:outline-none focus:ring-1 focus:ring-[#00d6b0] focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#52525b] dark:bg-black dark:text-gray-300"
		:value="modelValue"
		@input="$emit('update:modelValue', $event.target.value)"
		ref="input" />
</template>
