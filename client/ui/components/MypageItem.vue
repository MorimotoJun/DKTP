<template>
    <div class="max-w-xs border-2 bg-white border rounded-lg shadow bg-gray-800 border-gray-700 mt-5 mr-3">
        <div class="flex justify-center">
            <img
            class="rounded-t-md max-h-40 min-h-40"
            :src="content.thumbnail"
            alt="content image"
            />
        </div>
        <div class="mt-2 px-3 pb-3">
            <div>
                <h3 class="text-gray-900 text-lg lg:text-xl">{{ content.title }}</h3>
            </div>
            <div class="mt-3 flex justify-end">
                <div v-if="content.listed === 0 && content.deleted === 0" class="flex flex-col justify-end items-center">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="openModal">list</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="modal" class="z-40 fixed top-0 left-0 w-full h-full bg-slate-300 bg-opacity-80 flex justify-center items-center">
        <div class="z-50  bg-white lg:w-1/3 w-11/12 lg:h-1/3 h-1/5 max-h-1/3 rounded px-6 py-4 flex flex-col justify-between">
            <div class="flex justify-between flex-wrap">
                <label class="block mb-2 text-sm font-medium text-gray-900 w-2/3">price
                    <input v-model="price" type="number" :id="`price-${content.id}`" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="" required>
                </label>
                <label class="block mb-2 text-sm font-medium text-gray-900">crypto currency
                    <select
                    v-model="parchase_method"
                     id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                        <option value="0">MATIC</option>
                        <option value="1">FT</option>
                    </select>
                </label>
            </div>
            <div class="flex justify-end">
                <button @click="closeModal" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2">
                    cancel
                </button>
                <ListButton @closeModal="() => closeModal()" :content="content" :price="price" :parchase_method="parchase_method"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Content } from "~/interfaces";
const props = defineProps({
    content: {
        type: Object as () => Content,
        required: true,
    },
});

const price:Ref<number> = ref(0);
const parchase_method:Ref<number> = ref(0);

const modal:Ref<boolean> = ref(false);

const openModal =(()=>{
    modal.value = true;
})
const closeModal =(()=>{
    modal.value = false;
})

    
</script>