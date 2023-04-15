"use strict";

import * as fs from "fs";
import * as path from "path";

// J : pathを定義
// E : define path
const ROOT_PATH = path.resolve(__dirname, "..");
const ARTIFACTS = path.join(ROOT_PATH, "artifacts", "contracts");
const TEST_ARTIFACTS = path.join(ROOT_PATH, "artifacts", "contracts", "test");


interface ABI {
    abi: any;
    bytecode: string;
}

/**
 * J : 特定のコントラクトのABIを取得する
 * E : get specific ABI from artifacts
 *
 * @param {ContractEnum} CONTRACT the name of the contract
 * @returns { abi: any, bytecode: string }
 */
export function getAbi(CONTRACT: ContractEnum): ABI {
    let artifact_path;
    if ( CONTRACT.includes("Test") ) {
        artifact_path = TEST_ARTIFACTS;
    } else {
        artifact_path = ARTIFACTS;
    }
    let file = CONTRACT;
    const p = path.join(artifact_path, `${file}.sol`, `${CONTRACT}.json`);
    const str = fs.readFileSync(p).toString();
    const { abi, bytecode } = JSON.parse(str);

    return { abi, bytecode };
}

export enum ContractEnum {
    Market = "Market",
}

export enum TokenType {
    MATIC,
    FT
}
