import BN from 'bn.js';
import * as uint8arrays from 'uint8arrays';
import { PublicKey, PrivateKey, KeyType } from '@greymass/eosio';
import elliptic from 'elliptic';

const secp256k1 = new elliptic.ec('secp256k1');

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

export function createJWK(publicKey: PublicKey) {
  const ecPubKey = toElliptic(publicKey);

  const { jwkCurve } = getCurveNamesFromType(publicKey);

  const publicKeyJwk = {
    crv: jwkCurve,
    kty: 'EC',
    x: bnToBase64Url(ecPubKey.getPublic().getX() as any),
    y: bnToBase64Url(ecPubKey.getPublic().getY() as any),
    kid: publicKey.toString(),
  };

  return publicKeyJwk;
}

export function getCurveNamesFromType(key: PublicKey): { jwkCurve: string; verificationMethodType: string } {
  const type = key.type;

  switch (type) {
    case KeyType.K1:
      return {
        jwkCurve: 'secp256k1',
        verificationMethodType: 'EcdsaSecp256k1VerificationKey2019',
      };
    case KeyType.R1:
      return { jwkCurve: 'P-256', verificationMethodType: 'JsonWebKey2020' };
    case KeyType.WA:
      return { jwkCurve: 'P-256', verificationMethodType: 'JsonWebKey2020' };
  }
}

export function toElliptic(key: PrivateKey | PublicKey): elliptic.ec.KeyPair {
  let ecKeyPair: elliptic.ec.KeyPair;

  if (key instanceof PublicKey) {
    ecKeyPair = secp256k1.keyFromPublic(key.data.array);
  } else {
    ecKeyPair = secp256k1.keyFromPrivate(key.data.array);
  }

  validateKey(ecKeyPair);

  return ecKeyPair;
}

function validateKey(keyPair: elliptic.ec.KeyPair) {
  const result = keyPair.validate();

  if (!result.result) {
    throw new Error(`Key not valid with reason ${result.reason}`);
  }
}
