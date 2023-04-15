<template>
    <VueFinalModal
        class="flex justify-center items-center"
        :content-class="modalClass"
    >
        <button
            class="ml-auto px-2 border border-gray-400 rounded-full flex items-center justify-center"
            @click="emit('confirm')"
        >
            ×
        </button>
        <h1 class="text-xl">
            {{ title }}
        </h1>
        <slot />
    </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
const props = defineProps({
    title:{
        type:String,
        require:true,
    },
    modalClass:{
        type:String,
        require:false,
    }
})

const emit = defineEmits<{
    (e: "confirm"): void;
}>();
</script>
