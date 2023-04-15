<template>
    <div class="flex flex-col mt-2 lg:ml-4 w-full">
        <ul class="flex flex-wrap text-sm font-medium text-center border-b-2">
            <li
                class="mr-2"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="changeActiveTag(tab)"
                :class="{ 'active-style': activeTab === tab }"
            >
                <a
                    aria-current="page"
                    class="inline-block px-3 py-2 hover:border-b-2 border-teal-200 text-lg lg:text-xl"
                >
                    {{ tab.title }}</a
                >
            </li>
        </ul>
        <div v-if="activeTab" class="flex flex-row lg:items-start items-center flex-wrap">
            <div  v-for="content in activeTab.contents" :key="content.id" class="max-w-1/3 max-h-1/3  max-w-1/3 min-h-1/3 w-1/3 h-1/3">
                <MypageItem :content="content"/>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Tab } from "~/interfaces";
const props = defineProps({
    tabs: {
        type: Array as PropType<Tab[]>,
        default: [],
        required: true,
    },
});
const activeTab: Ref<Tab | null> = ref<Tab>(props.tabs[0] || null);

watchEffect(() => {
    activeTab.value = props.tabs[0];
})
const changeActiveTag = (tab: Tab) => {
    activeTab.value = tab;
    return activeTab.value;
};
</script>

<style scoped>
li {
    list-style-type: none;
}
.active-style {
    font-weight: bold;
    border-bottom: 3px solid rgb(45 212 191);
}
</style>
