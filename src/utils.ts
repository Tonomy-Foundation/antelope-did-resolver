import { PublicKey, KeyType, PrivateKey } from '@wharfkit/antelope';
import { secp256k1 } from '@noble/curves/secp256k1'
import { p256 } from '@noble/curves/p256'
import { ProjPointType } from '@noble/curves/abstract/weierstrass';
import { bytesToBase64url, ES256KSigner, ES256Signer, hexToBytes, Signer } from 'did-jwt';
import { Issuer } from 'did-jwt-vc';

export function createSigner(privateKey: PrivateKey): Signer {
  if (privateKey.type === KeyType.K1) {
    return ES256KSigner(privateKey.data.array);
  }

  if (privateKey.type === KeyType.R1 || privateKey.type === KeyType.WA) {
    return ES256Signer(privateKey.data.array);
  }

  throw new Error('Unsupported key type');
}

export function createIssuer(did: string, privateKey: PrivateKey): Issuer {
  return {
    did,
    signer: createSigner(privateKey),
    alg: privateKey.type === KeyType.K1 ? 'ES256K' : 'ES256',
  }
}

// Cannot import the following, so copying here
// import { bigintToBytes } from '../node_modules/did-jwt/src/util';
function bigintToBytes(n: bigint, minLength?: number): Uint8Array {
  return hexToBytes(n.toString(16), minLength)
}

export interface JWK {
  crv: string;
  kty: string;
  x: string;
  y: string;
  kid: string;

}

export function createJWK(publicKey: PublicKey): JWK {
  const { jwkCurve } = getCurveNamesFromType(publicKey);
  // copied from:
  // secp256k1 - https://github.com/decentralized-identity/did-jwt/pull/280/files#diff-c94d78b633b2fe38397047def271342090b3c8d81adf022a3a745af6d7b1c845R197
  // P-256 - https://github.com/decentralized-identity/did-jwt/pull/280/files#diff-c94d78b633b2fe38397047def271342090b3c8d81adf022a3a745af6d7b1c845R57
  const publicKeyPoint = toNobel(publicKey);
  return {
    crv: jwkCurve,
    kty: 'EC',
    x: bytesToBase64url(bigintToBytes(publicKeyPoint.x)),
    y: bytesToBase64url(bigintToBytes(publicKeyPoint.y)),
    kid: publicKey.toString(),
  }
}

export function getCurveNamesFromType(key: PublicKey): {
  jwkCurve: "secp256k1" | "P-256";
  verificationMethodType: "EcdsaSecp256k1VerificationKey2019" | "JsonWebKey2020"
} {
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
    default:
      throw new Error(`Unsupported key type: ${type}`);
  }
}

export function toNobel(publicKey: PublicKey): ProjPointType<bigint> {
  const { jwkCurve } = getCurveNamesFromType(publicKey);
  switch (jwkCurve) {
    case 'secp256k1':
      return secp256k1.ProjectivePoint.fromHex(publicKey.data.array);
    case 'P-256':
      return p256.ProjectivePoint.fromHex(publicKey.data.array);
    default:
      throw new Error(`Unsupported curve: ${jwkCurve}`);
  }
}