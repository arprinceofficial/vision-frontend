<script setup>
const props = defineProps({
	width: {
		type: String,
		default: "auto",
	},
	height: {
		type: String,
		default: "auto",
	},
})
</script>
<template>
	<div class="inline-flex items-center gap-2.5 sm:gap-3">
		<img src="/logo-4-BrrnFFbn.jpeg" alt="Syn Mod Build"
            class="h-10 w-10 object-contain rounded-sm" />
        <div class="flex flex-col gap-1 sm:gap-1.5 text-left font-poppins text-xs font-medium tracking-[0.28em] uppercase text-white leading-tight">
            <span>SYNDICATED</span>
            <span>RESTOMOD</span>
        </div>
	</div>
</template>
