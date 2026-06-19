<script setup>
const props = defineProps({
    response_modal: {
        type: Object,
    }
});

const visible = ref(false);

let autoCloseTimer = null;

const clearAutoCloseTimer = () => {
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }
};

watch(() => props.response_modal, (newVal) => {
    // Show the modal immediately on any change.
    // When the payload does not yet include `status`, we treat it as a loading state.
    visible.value = true;
    clearAutoCloseTimer();

    const hasStatus = !!(newVal && typeof newVal === 'object' && 'status' in newVal);
    if (hasStatus) {
        autoCloseTimer = setTimeout(() => closeModal(), 3000);
    }
});

const closeModal = () => {
    clearAutoCloseTimer();
    visible.value = false;
};

// True only when a real response with a status has arrived
const hasData = computed(() =>
    props.response_modal && Object.keys(props.response_modal).length > 0 && 'status' in props.response_modal
);

const isSuccess = computed(() => props.response_modal?.status === true);

const messageLogs = computed(() => {
    let msgs = [];
    if (props.response_modal?.error) {
        for (const [key, value] of Object.entries(props.response_modal.error)) {
            msgs = [...msgs, ...value];
        }
    }
    return msgs;
});
</script>

<template>
    <Transition enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 translate-y-4 scale-95"
        leave-to-class="opacity-0 translate-y-4 scale-95">
        <div v-if="visible" class="fixed bottom-6 right-6 z-[9999] w-full max-w-sm" role="alert">
            <div class="relative flex items-start gap-4 px-4 py-4 rounded-2xl shadow-2xl border overflow-hidden bg-white dark:bg-slate-900"
                :class="!hasData
                    ? 'border-slate-200 dark:border-slate-700'
                    : isSuccess
                        ? 'border-emerald-200 dark:border-emerald-800'
                        : 'border-red-200 dark:border-red-900'">
                <!-- Left accent bar -->
                <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" :class="!hasData
                    ? 'bg-gradient-to-b from-indigo-400 to-indigo-500'
                    : isSuccess
                        ? 'bg-gradient-to-b from-emerald-400 to-emerald-500'
                        : 'bg-gradient-to-b from-red-400 to-red-500'"></div>

                <!-- ── Loading state ── -->
                <template v-if="!hasData">
                    <div
                        class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-sm">
                        <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0 pt-0.5">
                        <p class="text-[13px] font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">Processing…</p>
                        <p class="text-[13px] text-slate-400 dark:text-slate-500">Please wait a moment.</p>
                    </div>
                </template>

                <!-- ── Success / Error state ── -->
                <template v-else>
                    <!-- Icon -->
                    <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-white text-lg shadow-sm"
                        :class="isSuccess
                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-500'
                            : 'bg-gradient-to-br from-red-400 to-red-500'">
                        <i :class="isSuccess ? 'fas fa-check' : 'fas fa-circle-xmark'"></i>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0 pt-0.5">
                        <p class="text-[13px] font-semibold mb-0.5"
                            :class="isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'">
                            {{ isSuccess ? 'Success' : 'Error' }}
                        </p>
                        <p class="text-[13px] text-slate-600 dark:text-slate-300 leading-snug">
                            {{ response_modal?.message }}
                        </p>
                        <!-- Validation error list -->
                        <ul v-if="messageLogs.length" class="mt-1.5 space-y-0.5">
                            <li v-for="msg in messageLogs" :key="msg"
                                class="flex items-start gap-1.5 text-[12px] text-red-600 dark:text-red-400">
                                <i class="fas fa-circle-dot text-[8px] mt-1.5 flex-shrink-0"></i>
                                {{ msg }}
                            </li>
                        </ul>
                    </div>
                </template>

                <!-- Close button -->
                <button type="button"
                    class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs cursor-pointer border-0 bg-transparent"
                    @click="closeModal" title="Dismiss">
                    <i class="fas fa-times"></i>
                </button>

                <!-- Auto-dismiss progress bar -->
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800">
                    <div class="h-full rounded-full animate-[shrink_3s_linear_forwards]"
                        :class="!hasData ? 'bg-indigo-400' : isSuccess ? 'bg-emerald-400' : 'bg-red-400'"></div>
                </div>
            </div>
        </div>

    </Transition>
</template>


<style scoped>
@keyframes shrink {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}
</style>
