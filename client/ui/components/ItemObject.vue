<template>
    <div class="w-full max-w-xs h-80 bg-white border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700 mt-5">
        <div class="h-44 w-full flex justify-center">
            <img
            class=" rounded-t-md max-w-full w-auto max-h-full h-auto"
            :src=content.thumbnail
            alt="product image"
            />
        </div>
        <div class="px-5 pb-5">
            <div>
                <h3 class="text-white text-lg lg:text-xl">{{ content.title }}</h3>
            </div>
            <div class="mt-3 flex justify-items-end justify-between">
                <div class="flex flex-col">
                    <NuxtLink
                        :to="`/collection/${content.user_address}`"
                        class="text-sky-300 mr-1 bg font-bold py-1 rounded-lg"
                    >
                        <Icon name="heroicons-outline:user" class="text-lg" />
                        <span>Auther</span>
                    </NuxtLink>
                    <span class="text-2xl font-bold text-gray-900">${{ content.price }}</span>
                </div>
                <div class="flex flex-col justify-end items-center">
                    <ModalButton
                        title="Open"
                        :buttonClass="modalButtonClass"
                        :content="content.content"
                        :price = "content.price"
                        :token_id = "content.token_id"
                        :content_id = "content.id"
                        :articleTitle="content.title"
                        :modalClass="modalClass"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Content } from "~/interfaces";
const props = defineProps({
    content: {
        type:  Object as () => Content,
        required: true,
    },
});

const modalButtonClass: Ref<string> = ref(
    "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
);

const modalClass: Ref<string> = ref(
    "flex flex-col max-w-xl min-h-min max-h-min h-5/6  w-11/12 p-4 bg-white border-current rounded-lg space-y-2 relative"
);
</script>

<style scoped lang="scss"></style>
