import { sleep } from "bun";
import { generateMemo, transfer } from "./src/actions.js";
import { publicKey, session } from "./src/config.js";
import { generateNonce, generateTransactionId } from "./src/utils.js";
import logUpdate from "log-update";

const workc = "0000";
console.info(`EOS session: ${session.actor}@${session.permission} [${publicKey}]`)
console.info(`The current mining difficulty is ${workc}`);
console.info(`Expected to take 1-2 minutes to calculate...`);
const info = await session.client.v1.chain.get_info();

process.on("SIGINT", () => {
    console.log("Ctrl-C was pressed");
    process.exit();
});

let timestamp = Date.now();
let count = 0;
while (true) {
    const nonce = generateNonce();
    const memo = generateMemo(info.head_block_num.toNumber(), nonce);
    const action = transfer(memo);

    // compute transaction hash
    const {resolved} = await session.transact({action}, {broadcast: false});
    if ( !resolved ) throw new Error("No resolved transaction");
    const predictedTransactionHash = await generateTransactionId(resolved);

    // logging
    const now = Date.now();
    if ( now - timestamp > 100 ) {
        await sleep(1);
        logUpdate(`ℹ️ [${new Date().toISOString().split(".")[0]}] ${count} - ${predictedTransactionHash}`);
        timestamp = now;
    }

    if (predictedTransactionHash.startsWith(workc)) {
        const {response} = await session.transact({action}, {broadcast: true});
        console.info(`🔨 mining hash: ${response?.transaction_id}`);
        console.info(`✅ mining success`);
        process.exit();
    }
    count++;
}

