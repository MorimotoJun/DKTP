<template>
    <div>
        <button
            @click="connectToMetaMask"
            v-if="!address"
            :class="modalButtonClass"
        >
            connect
        </button>
        <button
            @click="DisconnectMetamask"
            v-if="address"
            :class="modalButtonClass"
        >
            {{ omitAddress }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import {
    metamaskRequestHandler,
    getCurrentAddress,
} from "~/composables/metamask";

import axios from "axios";

const modalButtonClass: Ref<string> = ref(
    "text-white bg-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
);

const address: Ref<string> = ref("");
const omitAddress: Ref<string> = ref("");

const emit = defineEmits(["addressConnect"]);

watchEffect(() => {
    if (address.value.length >= 0) {
        emit("addressConnect", address.value.length);
    }
});

onMounted(async () => {
    const currentAddress: string = await getCurrentAddress();
    register(currentAddress);
    setRefAddress(currentAddress);
});

const register = async function (address: string) {
    await axios
        .post("http://localhost:8000/user/register", { user_address: address })
        .then((res) => {
            console.log(res.data.message);
        })
        .catch((e) => {
            console.error(e.message);
            throw new Error(e);
        });
};

const connectToMetaMask = async function () {
    const method: string = "eth_requestAccounts";
    const accounts: any = await metamaskRequestHandler(method);
    if (accounts[0]) {
        const account: string = accounts[0];
        register(account);
        setRefAddress(account);
    }
};

const setRefAddress = async function (currentAddress: string): Promise<void> {
    address.value = currentAddress;
    omitAddress.value = `${currentAddress.slice(0, 4)}...${currentAddress.slice(
        -4
    )}`;
};

const DisconnectMetamask = function (): void {
    address.value = "";
    omitAddress.value = "";
};
</script>
