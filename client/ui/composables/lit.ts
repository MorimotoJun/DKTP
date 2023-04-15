import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AuthSig, AccessControlConditions } from "@lit-protocol/types";
import { CHAIN_ID, NFT_CONTRACT_ADDRESS } from "./const";
import { Buffer } from 'buffer';


export const connectClient = async () => {
    const client = new LitJsSdk.LitNodeClient({});
    await client.connect();
    (window as any).litNodeClient = client;
};

export const getAuthSig = async(): Promise<AuthSig> =>{
  if ((window as any).authSig == undefined){
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: CHAIN_ID,
    });
    (window as any).authSig = authSig;
    return authSig;
  }
  return (window as any).authSig;
}

export const getAccessConditions = (tokenId: number): AccessControlConditions => {
  const accessControlConditions = [
    {
      contractAddress: NFT_CONTRACT_ADDRESS,
      standardContractType: "ERC1155",
      chain: CHAIN_ID,
      method: "balanceOf",
      parameters: [":userAddress", String(tokenId)],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
  return accessControlConditions;
}

export const eyncryptToIPFS = async (authSig: AuthSig, tokenId: number, content: string): Promise<string> => {
  if ((window as any).litNodeClient == undefined) {
      console.error("there is not lit client");
  }
  const client: LitJsSdk.LitNodeClient = (window as any).litNodeClient;
  const accessControlConditions = await getAccessConditions(tokenId);
  const cid = await LitJsSdk.encryptToIpfs({
      authSig: authSig,
      accessControlConditions: accessControlConditions,
      string: content,
      chain: CHAIN_ID,
      litNodeClient: client,
      infuraId: "2OEGMYjAng8LSQP5YhRHguvus3B",
      infuraSecretKey: "947df4391222e0a62e3bf99e7becc714"
  });
  return cid;
}

export const decryptToIPFS = async (authSig: AuthSig, cid: string): Promise<string | Uint8Array> => {
  if ((window as any).litNodeClient == undefined) {
      console.error("there is not lit client");
  }
  const client: LitJsSdk.LitNodeClient = (window as any).litNodeClient;
  // const result = await LitJsSdk.decryptFromIpfs({
  //     authSig: authSig,
  //     ipfsCid: cid,
  //     litNodeClient: client,
  // });
  const metadata = await (await fetch(`https://ipfs.io/ipfs/${cid}`)).json();
  const symmetricKey = await client.getEncryptionKey({
          accessControlConditions: metadata.accessControlConditions,
          evmContractConditions: metadata.evmContractConditions,
          solRpcConditions: metadata.solRpcConditions,
          unifiedAccessControlConditions: metadata.unifiedAccessControlConditions,
          toDecrypt: metadata.encryptedSymmetricKeyString,
          chain: metadata.chain,
          authSig,
    });
    if (metadata.encryptedString !== undefined) {

      // @ts-ignore
      window.Buffer = Buffer;
        const encryptedStringBlob = new Blob([Buffer.from(metadata.encryptedString)], { type: 'application/octet-stream' });
        const result = await (0, LitJsSdk.decryptString)(encryptedStringBlob, symmetricKey);
        return result;
    } else {
      throw new Error("metadata.encryptedString should be defined");
    }
}

