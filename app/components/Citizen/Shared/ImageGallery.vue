<script setup lang="ts">
type GalleryImage = {
    src: string
    alt?: string
    title?: string
    caption?: string
    class?: string
}

type GalleryImageInput = GalleryImage | string

const props = withDefaults(defineProps<{
    images: GalleryImageInput[]
    title?: string
    leadCaption?: string
    gridClass?: string
    tileClass?: string
}>(), {
    images: () => [],
    title: 'Photography',
    leadCaption: '',
    gridClass: 'grid grid-cols-1 gap-3 md:grid-cols-2',
    tileClass: 'h-[240px] sm:h-[280px]'
})

const viewerRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isOpen = ref(false)
const isFullscreen = ref(false)
let previousBodyOverflow = ''
let hasLockedBodyScroll = false

const normalizedImages = computed<GalleryImage[]>(() => (
    props.images
        .map((image, index) => {
            if (typeof image === 'string') {
                return {
                    src: image,
                    alt: `${props.title} image ${index + 1}`
                }
            }

            return {
                ...image,
                alt: image.alt || image.title || `${props.title} image ${index + 1}`
            }
        })
        .filter((image) => Boolean(image.src))
))

const hasMultipleImages = computed(() => normalizedImages.value.length > 1)
const currentImage = computed(() => normalizedImages.value[activeIndex.value] || normalizedImages.value[0])
const currentCaption = computed(() => (
    currentImage.value?.caption ||
    currentImage.value?.title ||
    currentImage.value?.alt ||
    props.title
))
const photoCountLabel = computed(() => (
    `${activeIndex.value + 1} / ${normalizedImages.value.length}`
))

const clampIndex = (index: number) => {
    const total = normalizedImages.value.length

    if (!total) return 0
    if (index < 0) return total - 1
    if (index >= total) return 0

    return index
}

const openGallery = (index: number) => {
    activeIndex.value = clampIndex(index)
    isOpen.value = true
}

const closeGallery = async () => {
    if (process.client && document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {})
    }

    isOpen.value = false
}

const showPreviousImage = () => {
    activeIndex.value = clampIndex(activeIndex.value - 1)
}

const showNextImage = () => {
    activeIndex.value = clampIndex(activeIndex.value + 1)
}

const toggleFullscreen = async () => {
    if (!process.client || !viewerRef.value) return

    if (!document.fullscreenElement) {
        await viewerRef.value.requestFullscreen?.().catch(() => {})
        return
    }

    await document.exitFullscreen().catch(() => {})
}

const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen.value) return

    if (event.key === 'Escape') {
        void closeGallery()
        return
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPreviousImage()
        return
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNextImage()
        return
    }

    if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        void toggleFullscreen()
    }
}

const handleFullscreenChange = () => {
    isFullscreen.value = Boolean(document.fullscreenElement)
}

watch(isOpen, (open) => {
    if (!process.client) return

    if (open) {
        previousBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        hasLockedBodyScroll = true
        return
    }

    if (hasLockedBodyScroll) {
        document.body.style.overflow = previousBodyOverflow
        hasLockedBodyScroll = false
    }
})

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
    if (!process.client) return

    window.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)

    if (document.fullscreenElement === viewerRef.value) {
        void document.exitFullscreen().catch(() => {})
    }

    if (hasLockedBodyScroll) {
        document.body.style.overflow = previousBodyOverflow
    }
})
</script>

<template>
    <div v-if="normalizedImages.length" :class="gridClass">
        <figure
            v-for="(image, index) in normalizedImages"
            :key="`${image.src}-${index}`"
            class="restomod-image-card group relative overflow-hidden rounded-md border border-white/10 bg-white/5"
            :class="[tileClass, image.class]"
        >
            <button
                type="button"
                class="relative block h-full w-full cursor-zoom-in overflow-hidden text-left"
                :aria-label="`Open ${image.alt}`"
                @click="openGallery(index)"
            >
                <img :src="image.src" :alt="image.alt" class="h-full w-full object-cover opacity-90">
                <span
                    class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10 opacity-75 transition-opacity duration-300 group-hover:opacity-95"
                    aria-hidden="true"
                />
                <span
                    class="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-tccDeepBlack/80 text-tccGold opacity-0 shadow-lg shadow-black/30 backdrop-blur transition-all duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                >
                    <i class="pi pi-search-plus text-sm" />
                </span>
                <span
                    v-if="index === 0 && (leadCaption || image.title)"
                    class="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-full border border-white/15 bg-tccDeepBlack/80 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur"
                >
                    {{ leadCaption || image.title }}
                </span>
                <span
                    v-if="index === normalizedImages.length - 1 && normalizedImages.length > 1"
                    class="absolute bottom-4 right-4 rounded-full border border-tccGold/35 bg-tccGold/90 px-3 py-1.5 font-poppins text-[9px] font-black uppercase tracking-[0.16em] text-tccDarkNavy"
                >
                    {{ normalizedImages.length }} photos
                </span>
            </button>
        </figure>
    </div>

    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen && currentImage"
                ref="viewerRef"
                class="fixed inset-0 z-[9999] overflow-hidden bg-[#030303]/96 text-white backdrop-blur-xl"
                role="dialog"
                aria-modal="true"
                :aria-label="title"
            >
                <div class="absolute inset-0 opacity-20" aria-hidden="true">
                    <img :src="currentImage.src" :alt="currentImage.alt" class="h-full w-full scale-110 object-cover blur-3xl">
                    <div class="absolute inset-0 bg-gradient-to-b from-black via-tccDeepBlack/80 to-black" />
                </div>

                <div class="relative z-10 flex h-full min-h-0 flex-col">
                    <header
                        class="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl sm:px-6"
                    >
                        <div class="min-w-0">
                            <span class="font-poppins text-[10px] font-black uppercase tracking-[0.24em] text-tccGold">
                                {{ title }}
                            </span>
                            <h2 class="mt-1 truncate font-poppins text-base font-black text-white sm:text-xl">
                                {{ currentCaption }}
                            </h2>
                        </div>

                        <div class="flex shrink-0 items-center gap-2">
                            <span
                                class="hidden rounded-full border border-white/15 bg-white/10 px-3 py-2 font-poppins text-[10px] font-black text-white/70 sm:inline-flex"
                            >
                                {{ photoCountLabel }}
                            </span>
                            <button
                                type="button"
                                class="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-colors hover:border-tccGold hover:text-tccGold"
                                :aria-label="isFullscreen ? 'Exit full screen' : 'Enter full screen'"
                                :title="isFullscreen ? 'Exit full screen' : 'Full screen'"
                                @click="toggleFullscreen"
                            >
                                <i :class="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'" class="text-sm" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                class="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-colors hover:border-tccGold hover:text-tccGold"
                                aria-label="Close gallery"
                                title="Close"
                                @click="closeGallery"
                            >
                                <i class="pi pi-times text-sm" aria-hidden="true" />
                            </button>
                        </div>
                    </header>

                    <div class="relative flex min-h-0 flex-1 items-center justify-center px-4 py-5 sm:px-20 sm:py-8">
                        <button
                            v-if="hasMultipleImages"
                            type="button"
                            class="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white/85 shadow-2xl shadow-black/40 backdrop-blur transition-colors hover:border-tccGold hover:text-tccGold sm:left-6 sm:h-14 sm:w-14"
                            aria-label="Previous image"
                            title="Previous"
                            @click="showPreviousImage"
                        >
                            <i class="pi pi-chevron-left text-sm sm:text-base" aria-hidden="true" />
                        </button>

                        <div
                            class="relative flex h-full w-full max-w-7xl items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/35 shadow-[0_30px_120px_rgba(0,0,0,0.58)]"
                        >
                            <img
                                :src="currentImage.src"
                                :alt="currentImage.alt"
                                class="max-h-full max-w-full object-contain"
                            >
                        </div>

                        <button
                            v-if="hasMultipleImages"
                            type="button"
                            class="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white/85 shadow-2xl shadow-black/40 backdrop-blur transition-colors hover:border-tccGold hover:text-tccGold sm:right-6 sm:h-14 sm:w-14"
                            aria-label="Next image"
                            title="Next"
                            @click="showNextImage"
                        >
                            <i class="pi pi-chevron-right text-sm sm:text-base" aria-hidden="true" />
                        </button>
                    </div>

                    <footer class="shrink-0 border-t border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl sm:px-6">
                        <div class="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto pb-1">
                            <button
                                v-for="(image, index) in normalizedImages"
                                :key="`thumb-${image.src}-${index}`"
                                type="button"
                                class="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition-all sm:h-20 sm:w-32"
                                :class="activeIndex === index
                                    ? 'border-tccGold shadow-[0_0_0_2px_rgba(247,198,0,0.25)]'
                                    : 'border-white/15 opacity-55 hover:border-white/35 hover:opacity-100'"
                                :aria-label="`Open image ${index + 1}`"
                                @click="activeIndex = index"
                            >
                                <img :src="image.src" :alt="image.alt" class="h-full w-full object-cover">
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
