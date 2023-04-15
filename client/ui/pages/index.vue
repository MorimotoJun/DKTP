<template>
    <div class="flex flex-row flex-wrap lg:items-start items-center">
        <div class="w-1/3 flex justify-center" v-for="content in contents" :key="content.id">
            <ItemObject :content="content"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import axios from "axios";
import { Content } from "~/interfaces";

const contents:Ref<Content[]> = ref([]);

const test = async () => {
    (window as any).global = window;
    const client = new LitJsSdk.LitNodeClient({});
    await client.connect();
    (window as any).litNodeClient = client;
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "ethereum",
    });
    console.log(authSig);
};

onMounted(async()=>{
    axios.get('http://localhost:8000/contents').then((res)=>{
        contents.value = res.data.contents;
    }).catch((e)=>{
        console.error(e.message);
        throw new Error(e);
    })
})
</script>
