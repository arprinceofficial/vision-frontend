<script setup>
    import { ref } from 'vue'
    import PhotoTabs from '../tabs/PhotoTabs'
    import UploadImageBlock from '../upload/ImageBlock.vue'
    import UploadVideoCapture from '../upload/VideoCapture.vue'

    const open = ref(true)
    const emit = defineEmits(['photoPopupStatusUpdate', 'createImage'])

    const close_popup = () => {
        open.value = false
        emit('photoPopupStatusUpdate', false)
    }
    const sel_tab_index = ref(1)
    const sel_tab_item = (index) => {
        sel_tab_index.value = index
    }
    const create_image = (value) => {
        emit('createImage', value)
    }
</script>
<template>
    <Dialog v-model:visible="open" modal :style="{ width: '25rem' }" :closable="false" class="relative">
        <header class="text-lg font-semibold text-center">
            <div class="absolute right-[-1px] top-[-2px] z-50">
                <button @click="close_popup"
                    class="w-[40px] h-[47px] flex items-center justify-center bg-black/50 text-white cursor-pointer rounded-bl-[15px] rounded-tr-[12px] transition-all duration-300 focus:outline-none">
                    <i class="pi pi-times text-xl"></i>
                </button>
            </div>
        </header>
        <div class="flex flex-col items-center w-full">
            <PhotoTabs @selTabIndex="sel_tab_item" />
            <div class="mt-3 text-center sm:mt-5 w-full">
                <template v-if="sel_tab_index == 1">
                    <UploadImageBlock :width="240" :height="240" @createImage="create_image"
                        @closePopup="close_popup" />
                </template>
                <template v-else>
                    <UploadVideoCapture :width="300" :height="225" @createImage="create_image"
                        @closePopup="close_popup" />
                </template>
            </div>
        </div>
    </Dialog>
</template>