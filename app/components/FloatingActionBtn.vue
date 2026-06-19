<script setup>
const props = defineProps({
    position: String,
    loader: Boolean,
    icon: String,
    message: String
});

const emit = defineEmits(['dataSubmit', 'removeMessage']);

const getInterval = ref(null);

const content_submit = () => {
    if (!props.loader) {
        emit('dataSubmit');
    }
};

const remove_msg = () => {
    emit('removeMessage');
};

onMounted(() => {
    getInterval.value = setTimeout(() => {
        emit('removeMessage');
        clearTimeout(getInterval.value);
    }, 2000);
});
</script>

<template>
    <div class="w-full flex justify-end mt-3">
        <!-- Loading state -->
        <button v-if="loader" disabled
            class="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg cursor-not-allowed"
            :class="{ 'fixed bottom-5 right-5 z-50': position === 'fixed' }">
            <ProgressSpinner style="width: 22px; height: 22px" strokeWidth="8" animationDuration=".5s" />
        </button>

        <!-- Action button -->
        <button v-else
            class="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_6px_20px_rgba(99,102,241,0.45)] border-0 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-[0_8px_28px_rgba(99,102,241,0.55)] active:scale-95"
            :class="{ 'fixed bottom-5 right-5 z-50': position === 'fixed' }" @click="content_submit">
            <i :class="[icon, 'text-[16px]']"></i>
        </button>
    </div>

    <!-- Success toast -->
    <Transition enter-active-class="transition-[opacity,transform] duration-300 ease-out"
        leave-active-class="transition-[opacity,transform] duration-200 ease-in"
        enter-from-class="opacity-0 translate-y-2" leave-to-class="opacity-0 translate-y-2">
        <div v-if="message"
            class="fixed bottom-5 right-[10%] z-50 flex items-center gap-2.5 bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-[0_6px_20px_rgba(16,185,129,0.4)] pr-8">
            <i class="pi pi-check-circle text-base"></i>
            <span>{{ message }}</span>
            <button
                class="absolute top-1 right-1 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 hover:bg-emerald-700 border-0 cursor-pointer text-white transition-colors"
                @click="remove_msg">
                <i class="pi pi-times text-[9px]"></i>
            </button>
        </div>
    </Transition>
</template>
