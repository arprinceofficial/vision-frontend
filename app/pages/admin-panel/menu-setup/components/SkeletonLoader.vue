<template>
    <div class="space-y-4">
        <!-- Legend bar skeleton -->
        <div
            class="flex items-center gap-5 flex-wrap px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] animate-pulse">
            <Skeleton width="80px" height="14px" borderRadius="6px" />
            <Skeleton width="100px" height="14px" borderRadius="6px" />
            <Skeleton width="60px" height="14px" borderRadius="6px" />
            <Skeleton width="60px" height="14px" borderRadius="6px" />
        </div>

        <!-- Menu rows -->
        <ul class="list-none m-0 p-0 space-y-1.5">

            <!-- Row 1 (parent with children) -->
            <li class="relative">
                <div
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-pulse">
                    <Skeleton width="28px" height="28px" borderRadius="6px" class="flex-shrink-0" />
                    <Skeleton width="32px" height="32px" borderRadius="8px" class="flex-shrink-0" />
                    <div class="flex flex-col flex-1 min-w-0 gap-1">
                        <Skeleton width="140px" height="13px" borderRadius="6px" />
                        <Skeleton width="90px" height="11px" borderRadius="6px" />
                    </div>
                    <Skeleton width="52px" height="20px" borderRadius="20px" class="flex-shrink-0" />
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                        <Skeleton width="44px" height="30px" borderRadius="8px" />
                    </div>
                </div>

                <!-- Child level -->
                <div class="mt-1 pl-6 relative">
                    <span
                        class="absolute left-2.5 top-0 bottom-3 w-px bg-gradient-to-b from-indigo-300 to-transparent pointer-events-none" />
                    <ul class="list-none m-0 p-0 space-y-1.5">
                        <li class="relative">
                            <div
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-pulse">
                                <Skeleton width="28px" height="28px" borderRadius="6px" class="flex-shrink-0" />
                                <Skeleton width="32px" height="32px" borderRadius="8px" class="flex-shrink-0" />
                                <div class="flex flex-col flex-1 min-w-0 gap-1">
                                    <Skeleton width="110px" height="13px" borderRadius="6px" />
                                    <Skeleton width="70px" height="11px" borderRadius="6px" />
                                </div>
                                <Skeleton width="52px" height="20px" borderRadius="20px" class="flex-shrink-0" />
                                <div class="flex items-center gap-1 flex-shrink-0">
                                    <Skeleton width="30px" height="30px" borderRadius="8px" />
                                    <Skeleton width="30px" height="30px" borderRadius="8px" />
                                    <Skeleton width="44px" height="30px" borderRadius="8px" />
                                </div>
                            </div>
                        </li>
                        <li class="relative">
                            <div
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-pulse">
                                <Skeleton width="28px" height="28px" borderRadius="6px" class="flex-shrink-0" />
                                <Skeleton width="32px" height="32px" borderRadius="8px" class="flex-shrink-0" />
                                <div class="flex flex-col flex-1 min-w-0 gap-1">
                                    <Skeleton width="125px" height="13px" borderRadius="6px" />
                                    <Skeleton width="80px" height="11px" borderRadius="6px" />
                                </div>
                                <Skeleton width="52px" height="20px" borderRadius="20px" class="flex-shrink-0" />
                                <div class="flex items-center gap-1 flex-shrink-0">
                                    <Skeleton width="30px" height="30px" borderRadius="8px" />
                                    <Skeleton width="30px" height="30px" borderRadius="8px" />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>

            <!-- Row 2 (parent with children) -->
            <li class="relative">
                <div
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-pulse">
                    <Skeleton width="28px" height="28px" borderRadius="6px" class="flex-shrink-0" />
                    <Skeleton width="32px" height="32px" borderRadius="8px" class="flex-shrink-0" />
                    <div class="flex flex-col flex-1 min-w-0 gap-1">
                        <Skeleton width="160px" height="13px" borderRadius="6px" />
                        <Skeleton width="100px" height="11px" borderRadius="6px" />
                    </div>
                    <Skeleton width="52px" height="20px" borderRadius="20px" class="flex-shrink-0" />
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                        <Skeleton width="44px" height="30px" borderRadius="8px" />
                    </div>
                </div>

                <div class="mt-1 pl-6 relative">
                    <span
                        class="absolute left-2.5 top-0 bottom-3 w-px bg-gradient-to-b from-cyan-300 to-transparent pointer-events-none" />
                    <ul class="list-none m-0 p-0 space-y-1.5">
                        <li class="relative">
                            <div
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-pulse">
                                <Skeleton width="28px" height="28px" borderRadius="6px" class="flex-shrink-0" />
                                <Skeleton width="32px" height="32px" borderRadius="8px" class="flex-shrink-0" />
                                <div class="flex flex-col flex-1 min-w-0 gap-1">
                                    <Skeleton width="95px" height="13px" borderRadius="6px" />
                                    <Skeleton width="60px" height="11px" borderRadius="6px" />
                                </div>
                                <Skeleton width="52px" height="20px" borderRadius="20px" class="flex-shrink-0" />
                                <div class="flex items-center gap-1 flex-shrink-0">
                                    <Skeleton width="30px" height="30px" borderRadius="8px" />
                                    <Skeleton width="30px" height="30px" borderRadius="8px" />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>

            <!-- Row 3 (no children) -->
            <li>
                <div
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-pulse">
                    <Skeleton width="28px" height="28px" borderRadius="6px" class="flex-shrink-0" />
                    <Skeleton width="32px" height="32px" borderRadius="8px" class="flex-shrink-0" />
                    <div class="flex flex-col flex-1 min-w-0 gap-1">
                        <Skeleton width="120px" height="13px" borderRadius="6px" />
                        <Skeleton width="75px" height="11px" borderRadius="6px" />
                    </div>
                    <Skeleton width="52px" height="20px" borderRadius="20px" class="flex-shrink-0" />
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                    </div>
                </div>
            </li>

            <!-- Row 4 (no children) -->
            <li>
                <div
                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm animate-pulse">
                    <Skeleton width="28px" height="28px" borderRadius="6px" class="flex-shrink-0" />
                    <Skeleton width="32px" height="32px" borderRadius="8px" class="flex-shrink-0" />
                    <div class="flex flex-col flex-1 min-w-0 gap-1">
                        <Skeleton width="145px" height="13px" borderRadius="6px" />
                        <Skeleton width="85px" height="11px" borderRadius="6px" />
                    </div>
                    <Skeleton width="52px" height="20px" borderRadius="20px" class="flex-shrink-0" />
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                        <Skeleton width="30px" height="30px" borderRadius="8px" />
                    </div>
                </div>
            </li>
        </ul>

        <!-- FAB skeleton -->
        <div class="flex justify-end mt-4">
            <Skeleton width="52px" height="52px" borderRadius="50%" />
        </div>
    </div>
</template>