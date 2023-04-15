<template>
    <!-- get parameter method -->
    <!-- $route.params.item_id -->

    <!-- star-button -->
    <div class="flex flex-col justify-center lg:w-2/4 w-full mx-auto">
        <div class="flex flex-row justify-end my-2">
            <button
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-1"
            >
                <Icon name="icons8:download" />
                <span>download</span>
            </button>
            <button
                class="border-yellow-400 border-2 rounded w-10 flex items-center justify-center"
            >
                <Icon name="fa6-solid:star" class="text-yellow-400 text-2xl" />
            </button>
        </div>
        <!-- title here -->
        <h1
            class="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-none tracking-tight text-gray-900"
        >
            {{ content.title }}
        </h1>
        <!-- article here -->
        <div v-html="content.content"></div>

        <!-- author infomation -->
    </div>
    <NuxtPage />
</template>

<script setup lang="ts">
import axios from 'axios';
import { Content } from "~/interfaces";
const router = useRoute();

const content:any = ref("");

onMounted(async()=>{
    axios.get('http://localhost:8000/content',{params:{
        content_id:router.params.item_id
    }}).then((res)=>{
        content.value = res.data.content.ipfs_hash;
        decrypt();
    }).catch((e:any)=>{
        console.error(e.message);
        throw new Error(e);
    })
})

const decrypt = (async () => {
    await connectClient();
    const authSig = await getAuthSig();
    let cid: string;
    cid=content.value;
    // @ts-ignore
    content.value = await decryptToIPFS(authSig, cid);
    content.value = JSON.parse(content.value);
})
</script>
