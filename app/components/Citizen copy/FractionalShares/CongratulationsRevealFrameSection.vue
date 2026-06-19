<script setup lang="ts">
const revealFrame = '/assets/images/citizen/fractional-shares/reveal-frame.png'
</script>

<template>
    <section class="relative h-[300px] overflow-hidden bg-black sm:h-[520px] lg:h-[827px]">
        <img :src="revealFrame" alt="Lewis Hamilton reveal film still"
            class="absolute inset-0 h-full w-full object-cover object-center">
        <div class="absolute inset-0 bg-black/15" />
    </section>
</template>
