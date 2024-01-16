import { AnyAction } from "@wharfkit/session"
import { session } from "./config.js"

export function transfer(memo: string): AnyAction {
    return {
        account: "eosio.token",
        name: "transfer",
        authorization: [session.permissionLevel],
        data: {
            from: session.actor,
            to: "eosio.null",
            quantity: "0.0001 EOS",
            memo,
        }
    }
}

export function generateMemo(block: number, nonce: string|number) {
    return `{"p":"drops","op":"mint","tick":"seeds","amt":"10000","block":"${block}","nonce":"${nonce}"}`
}