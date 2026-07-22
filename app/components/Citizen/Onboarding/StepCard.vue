<script setup lang="ts">
defineProps<{
    eyebrow: string
    title: string
    description: string
    maxWidth?: string
}>()
</script>

<template>
    <section class="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full" :class="maxWidth || 'max-w-3xl'">
            <div class="restomod-panel space-y-8 rounded-[2rem] p-6 sm:p-10">
                <div class="space-y-2 text-center">
                    <span class="restomod-eyebrow">{{ eyebrow }}</span>
                    <h1 class="font-poppins text-3xl font-bold leading-tight text-white sm:text-4xl">{{ title }}</h1>
                    <p class="mx-auto max-w-lg text-sm leading-relaxed text-white/60">{{ description }}</p>
                </div>

                <slot />
            </div>
        </div>
    </section>
</template>
