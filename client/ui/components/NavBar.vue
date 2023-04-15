<template>
    <nav class="flex items-center justify-between flex-wrap bg-teal-400 py-2 px-4">
        <div class="flex items-center flex-shrink-0 text-white mr-4">
            <NuxtLink to="/" class="font-semibold text-xl tracking-tight"
                >
                <img class="w-28" src="~/assets/Transparent.png">
                </NuxtLink
            >
        </div>
        <div class="block" v-show="mobileView">
            <button
                class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
                @click="isOpen"
            >
                <svg
                    class="fill-current h-3 w-3"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </button>
        </div>
        <div
            class="w-full block flex-grow md:flex md:items-center md:w-auto"
            v-show="show"
        >
            <div class="text-sm md:flex-grow md:mx-5 mx-1 mt-1">
                <form>
                    <label
                        for="default-search"
                        class="mb-2 text-sm font-medium text-gray-100 sr-only"
                        >Search</label
                    >
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                        >
                            <svg
                                aria-hidden="true"
                                class="w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            class="block w-full p-4 pl-10 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-100 focus:border-blue-100"
                            placeholder="Search Mockups, Logos..."
                            required
                        />
                        <button
                            type="submit"
                            class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
            <div
                v-show="addressStatus"
                class="md:flex md:items-center md:w-auto md:justify-center"
            >
                <NuxtLink
                    to="/mypage"
                    class="block md:inline-block text-gray-100 md:text-white mr-4 md:bg-sky-500 text-white font-bold py-2 px-4 md:rounded-full"
                >
                    <span> Mypage </span>
                </NuxtLink>
                <NuxtLink
                    to="/item/create"
                    class="block md:inline-block text-gray-100 md:text-white mr-4 md:bg-sky-500 text-white font-bold py-2 px-4 md:rounded-full"
                >
                    <span>
                        <Icon name="icons8:pencil" class="text-xl" />
                        write
                    </span>
                </NuxtLink>
            </div>
            <div class="inline-block text-sm leading-none mt-4 md:mt-0">
                <ConnectMetamaskButton @addressConnect="changeConnecStatus" />
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
let show: Ref<boolean> = ref(true);
let mobileView: Ref<boolean> = ref(true);
let windowWidth: Ref<number> = ref(0);
let addressStatus: Ref<boolean> = ref(false);

const isOpen = () => (show.value = !show.value);

const calculateWindowWidth = (): void => {
    windowWidth.value = window.innerWidth;
    mobileView.value = windowWidth.value < 960;
    show.value = windowWidth.value > 960;
    return;
};

const changeConnecStatus = (addressLength: number): boolean => {
    if (addressLength > 0) {
        return (addressStatus.value = true);
    } else {
        return (addressStatus.value = false);
    }
};

onMounted(() => {
    calculateWindowWidth();
    window.addEventListener("resize", calculateWindowWidth);
});
</script>
