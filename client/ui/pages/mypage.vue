<template>
    <div class="lg:flex">
        <UserInfo />
        <TabComponent :tabs="tabs" />
    </div>
</template>

<script setup lang="ts">
import { Tab,Content } from "~/interfaces";
import { getCurrentAddress } from "~/composables/metamask";
import axios from 'axios';

const tabs: Ref<Tab[]> = ref([]);

const contents:Ref<Content[]> = ref([]);

const unlisted :Ref<Content[]> = ref([]);
const listed :Ref<Content[]> = ref([]);
const bought :Ref<any> = ref(null);


onMounted(async()=>{
    await getCotent();
    await getBoughtCotent();
    pushTab();
})
const getCotent = (async()=>{
    await axios.get('http://localhost:8000/content/get',{
        params:{
            user_address: await getCurrentAddress(),
        }
    }).then((res)=>{
        contents.value = res.data.contents;
        sortContents();
    }).catch((e)=>{
        console.error(e.message);
        throw new Error(e);
    });
})

const getBoughtCotent = (async()=>{
    await axios.get('http://localhost:8000/buyhistory/get',{
        params:{
            user_address: await getCurrentAddress(),
        }
    }).then((res)=>{
        bought.value = res.data.contents;
    }).catch((e)=>{
        console.error(e.message);
        throw new Error(e);
    });
})

const sortContents = async()=>{
    unlisted.value = contents.value.filter(content => content.listed  === 0 && content.deleted === 0);
    listed.value = contents.value.filter(content => content.listed  === 1 && content.deleted === 0 );
}

const pushTab = (()=>{
    tabs.value.push(
    { title: "unlisted", contents: unlisted.value },
    { title: "listed", contents: listed.value },
    { title: "bought", contents: bought.value },
    );
    console.log(tabs.value);
})
</script>
