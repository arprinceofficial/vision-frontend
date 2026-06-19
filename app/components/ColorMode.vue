<script setup lang="ts">
const colorMode = useColorMode()
const isMounted = ref(false)

const modeConfig = computed(() => {
    switch (colorMode.preference) {
        case 'system':
            return {
                title: 'System',
                icon: 'eva:monitor-outline',
                next: 'light',
                iconClass: 'text-black dark:text-white',
            }
        case 'light':
            return {
                title: 'Light',
                icon: 'quill:sun',
                next: 'dark',
                iconClass: '',
            }
        case 'dark':
            return {
                title: 'Dark',
                icon: 'quill:moon',
                next: 'sepia',
                iconClass: 'text-white',
            }
        default:
            return {
                title: 'Sepia',
                icon: 'uiw:coffee',
                next: 'system',
                iconClass: '',
            }
    }
})

onMounted(() => {
    isMounted.value = true
})

const cycleColorMode = () => {
    colorMode.preference = modeConfig.value.next
}
</script>

<template>
    <div class="px-2 color_mode">
        <button
            v-if="isMounted"
            type="button"
            :title="modeConfig.title"
            class="inline-flex items-center justify-center"
            @click="cycleColorMode"
        >
            <Icon
                :name="modeConfig.icon"
                class="w-5 h-5 cursor-pointer"
                :class="modeConfig.iconClass"
            />
        </button>
        <span
            v-else
            class="inline-block w-5 h-5"
            aria-hidden="true"
        />
    </div>
</template>
