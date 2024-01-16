import { AnyAction, PackedTransaction, Checksum256, Transaction, SigningRequest, Serializer } from "@wharfkit/session";
import { session } from "./config.js";


let lastNonce = 0;
let lastTimestamp = Date.now();

export function generateNonce() {
  const currentTimestamp = Date.now();
  if (currentTimestamp !== lastTimestamp) {
    lastNonce = 0;
    lastTimestamp = currentTimestamp;
  }
  return `${currentTimestamp}${lastNonce++}`;
}

export async function generateTransactionId(memo: string) {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(memo);
  return hasher.digest("hex");
  // // session.client.v1.chain.send_transaction2()
  // const {resolved, signatures, transaction, response} = await session.transact({action}, {broadcast: true});
  // // const transaction =
  // if ( !resolved ) throw new Error("No transaction");
  // if ( !transaction ) throw new Error("No transaction");
  // // const signed = await session.signTransaction(transaction);
  // console.log({response: response?.transaction_id})

  // const hasher = new Bun.CryptoHasher("sha256");
  // hasher.update(resolved.serializedTransaction.buffer);
  // const tx = hasher.digest("hex");
  // console.log({tx});
  // const response = await session.client.v1.chain.send_transaction2(resolved.transaction)
  // console.log({transaction_id: response.transaction_id});
}
