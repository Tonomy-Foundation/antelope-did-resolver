import BN from 'bn.js';
import * as uint8arrays from 'uint8arrays';

// Adapted from https://github.com/decentralized-identity/did-jwt/blob/056b2e422896436b781ecab2b466bacf72708d23/src/util.ts
export function bnToBase64Url(bn: BN): string {
  const bnString = bn.toString();
  const bi = BigInt(bnString);
  const biBytes = bigintToBytes(bi);

  return bytesToBase64(biBytes);
}

// Copied from https://github.com/decentralized-identity/did-jwt/blob/056b2e422896436b781ecab2b466bacf72708d23/src/util.ts
function bytesToBase64(b: Uint8Array): string {
  return uint8arrays.toString(b, 'base64pad');
}

// Adapted from https://github.com/decentralized-identity/did-jwt/blob/056b2e422896436b781ecab2b466bacf72708d23/src/util.ts
function bigintToBytes(n: bigint): Uint8Array {
  let b64 = n.toString(16);

  // Pad an extra '0' if the hex string is an odd length
  if (b64.length % 2 !== 0) {
    b64 = `0${b64}`;
  }

  return uint8arrays.fromString(b64, 'base16');
}
