import { ResolvedSigningRequest } from "@wharfkit/session";

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

export async function generateTransactionId(resolved: ResolvedSigningRequest) {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(resolved?.serializedTransaction);
  return hasher.digest("hex");
}
