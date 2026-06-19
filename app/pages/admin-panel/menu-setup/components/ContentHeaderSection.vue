<script setup>
const props = defineProps({
    title: String,
    icon: String,
});
</script>

<template>
    <div class="flex items-center gap-2 px-4 h-9 text-sm font-semibold border-b border-[#ddd] bg-[#f7f7f7]">
        <i :class="icon"></i>
        <span>{{ title }}</span>
    </div>
</template>
