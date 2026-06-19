<script setup>
const props = defineProps({
    isOpenConModal: Boolean,
    title: {
        type: String,
        default: 'Are you sure?'
    },
    message: {
        type: String,
        default: 'This action cannot be undone. Please confirm to proceed.'
    },
});
const emit = defineEmits(['confirm', 'update:isOpenConModal']);

const visible = ref(props.isOpenConModal);
const isLoading = ref(false);

watch(() => props.isOpenConModal, (newVal) => {
    visible.value = newVal;
});

const cancel = () => emit('update:isOpenConModal', false);

const confirmDelete = async () => {
    isLoading.value = true;
    try {
        await emit('confirm');
    } finally {
        isLoading.value = false;
        emit('update:isOpenConModal', false);
    }
};
</script>

<template>
    <Transition enter-active-class="transition-opacity duration-200 ease-out"
        leave-active-class="transition-opacity duration-150 ease-in" enter-from-class="opacity-0"
        leave-to-class="opacity-0">
        <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
            @click.self="cancel">
            <!-- Card -->
            <Transition enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="opacity-0 scale-95 -translate-y-2" leave-to-class="opacity-0 scale-95 -translate-y-2">
                <div v-if="visible"
                    class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden">
                    <!-- Top accent bar -->
                    <div class="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>

                    <!-- Body -->
                    <div class="px-6 pt-7 pb-5 flex flex-col items-center text-center">

                        <!-- Warning icon -->
                        <div class="relative mb-5">
                            <!-- Pulse ring -->
                            <span class="absolute inset-0 rounded-full bg-amber-400/20 animate-ping"></span>
                            <div
                                class="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 shadow-[0_4px_20px_rgba(251,191,36,0.4)]">
                                <i class="fas fa-triangle-exclamation text-white text-2xl"></i>
                            </div>
                        </div>

                        <!-- Title -->
                        <h3 class="text-[17px] font-bold text-slate-800 dark:text-slate-100 mb-1.5 leading-snug">
                            {{ props.title }}
                        </h3>
                        <p class="text-[13px] text-slate-400 dark:text-slate-500 leading-relaxed">
                            {{ props.message }}
                        </p>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-2.5 px-6 pb-5">

                        <!-- Loading -->
                        <button v-if="isLoading" type="button" disabled
                            class="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 text-[13px] font-medium cursor-not-allowed border border-slate-200 dark:border-slate-700">
                            <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Processing…
                        </button>

                        <template v-else>
                            <!-- Cancel -->
                            <button type="button"
                                class="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
                                @click="cancel">
                                <i class="fas fa-times text-sm"></i>
                                Cancel
                            </button>

                            <!-- Confirm -->
                            <button type="button"
                                class="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border-0 bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-[13px] font-semibold cursor-pointer shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)]"
                                @click="confirmDelete">
                                <i class="fas fa-check text-sm"></i>
                                Yes, Proceed
                            </button>
                        </template>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>
