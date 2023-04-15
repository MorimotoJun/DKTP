<template>
    <button :class="buttonClass" @click="show = true" >Open</button>
    <ModalConfirm
        v-model="show"
        :title="articleTitle"
        :modalClass="modalClass"
        @confirm="() => confirm()"
    >
        <div class="w-full snap-y overflow-y-auto pb-16">
            {{ content }}
        </div>
        <div
            class="flex justify-around w-full p-2 absolute bottom-0 left-0 bg-white rounded-bl-lg rounded-br-lg"
        >
            <p class="text-3xl font-bold text-gray-900">${{ price }}</p>
            <button  @click="purchase" class="w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Buy</button>
        </div>
    </ModalConfirm>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Market } from "~/composables/web3"
const props = defineProps({
    content: {
        type:  String,
        required: true,
    },
    articleTitle:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    buttonClass:{
        type:String,
        require:false
    },
    modalClass:{
        type:String,
        require:false
    },
    // @ts-ignore
    token_id:{
        type:Number,
        requierd:true,
    },
    content_id:{
        type:Number,
        require:true
    }
});

const show = ref(false);
function confirm() {
    show.value = false;
}


const purchase = (async () => {
    const tokenId:number = Number(props.token_id);
    const price:number = Number(props.price);
    const market = await new Market().connect();
    try{
         // @ts-ignore
         await market.purchaseArticle(tokenId, price);
         createBuyhistory("tekito_hash");
         navigateTo({
                path:`/item/${props.content_id}`,
            });
    }catch(e:any){
        console.error(e.message);
        throw new Error(e);
    }
})

const createBuyhistory = async(transaction_hash:string)=>{
    const data = {
        content_id: props.content_id,
        buyer: await getCurrentAddress(),
        tx_hash: transaction_hash,
    };
    axios
        .post("http://localhost:8000/buy_history/create", data)
        .then((res) => {
            console.log(res.data.message);
        })
        .catch((e: any) => {
            console.error(e.message);
            throw new Error();
        });

}
</script>
