"use strict";

import detectEthereumProvider from "@metamask/detect-provider";

export const getProvider = async function (): Promise<any> {
    const provider: any = await detectEthereumProvider();
    if (provider) {
        return provider;
    } else {
        const metamaskUrl = "https://metamask.io/";
        const submit = window.confirm(
            `You need to install Metamask!\nDownload here→ 『${metamaskUrl}』`
        );
        if (submit) {
            window.open(metamaskUrl, "_blank");
        }
        console.error("require installing metamask");
        return;
    }
};
getProvider();

export const getCurrentAddress = async function (): Promise<string> {
    const provider: any = await getProvider();

    if (provider.selectedAddress === null) {
        throw new Error("address is empty");
    } else {
        const address: string = provider.selectedAddress;
        return address;
    }
};

export const metamaskRequestHandler = async function (
    method: string
): Promise<any> {
    const provider = await getProvider();
    try {
        //window.ethereum は　@metamask/providersでどうにかなる
        const response: any = await provider.request({
            method: method,
        });
        return response;
    } catch (err: any) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.error("Please connect to MetaMask.");
        } else {
            console.error(err.message);
        }
    }
};
