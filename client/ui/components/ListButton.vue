<template>
    <button @click="list" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">list</button>
</template>

<script setup lang="ts">
import { Buffer } from 'buffer';
import { connectClient,getAuthSig, eyncryptToIPFS } from "~/composables/lit"
import { Market } from "~/composables/web3";
import { Content } from "~/interfaces";
import axios from 'axios';

const props = defineProps({
    content: {
        type: Object as () => Content,
        required: true,
    },
    price:{
        type:Number,
        required:true,
    },
    parchase_method:{
        type:Number,
        required:true,
    }
});


// @ts-ignore
window.Buffer = Buffer;

const list = (async ()=>{
    await connectClient();
    const authSig = await getAuthSig();
    const market = await new Market().connect();
    const tokenId = await market.incrementTokenId();
    const str = `{"title": "${props.content.title}" ,"content": "${props.content.content}","parchase_method": ${props.parchase_method},"price": ${props.price}}`
    console.log("tokenId: ", tokenId);
    
    const cid = await eyncryptToIPFS(authSig, tokenId, str);
    console.log("cid: ", cid);
    try{
        await market.listArticle(tokenId, props.parchase_method, props.price, cid);
        const data = {
            id:props.content.id,
            token_id:tokenId,
            price:props.price,
            purchase_method:props.parchase_method,
            ipfs_hash:cid
        }
        const res = await axios.post('http://localhost:8000/content/list',data)
        .then((res)=>{
            console.log(res.data.message);
        }).catch((e)=>{
            console.error(e.message);
            throw new Error(e);
        })
    }catch(e:any){
        console.error(e.message);
        throw new Error(e);
    }

})
</script>
