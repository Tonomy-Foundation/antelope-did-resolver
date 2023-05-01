import {
  ParsedDID,
  DIDResolutionResult,
  DIDDocument,
  ServiceEndpoint,
  Resolvable,
} from '@tonomy/did-resolver';
import { JsonRpc, RpcError } from 'eosjs';
import {
  AntelopeAccountPermission,
  AntelopeAccountResponse,
  Entry,
  Registry,
  MethodId,
  VerificationMethod,
  Jwk,
  ExtensibleSchema,
  AntelopeDIDResolutionOptions,
} from './types';
import { PublicKey } from 'eosjs/dist/eosjs-key-conversions';
import { KeyType } from 'eosjs/dist/eosjs-numeric';
import { ec } from 'elliptic';
import { bnToBase64Url } from './utils';
import antelopeChainRegistry from './antelope-did-chain-registry.json';

const PATTERN_ACCOUNT_NAME = `([a-z1-5.]{0,12}[a-z1-5])`;
const PATTERN_CHAIN_ID = `([A-Fa-f0-9]{64})`;
const PATTERN_CHAIN_NAME = `(([a-z1-5.]{0,12}[a-z1-5])((:[a-z1-5.]{0,12}[a-z1-5])+)?)`;

function toRegExp(pattern: string): RegExp {
  return new RegExp(`^${pattern}$`);
}

const REGEX_ACCOUNT_NAME = toRegExp(PATTERN_ACCOUNT_NAME);
const REGEX_CHAIN_ID = toRegExp(PATTERN_CHAIN_ID);
const REGEX_CHAIN_NAME = toRegExp(PATTERN_CHAIN_NAME);
const REGEX_ID_AND_SUBJECT = toRegExp(
  `${PATTERN_CHAIN_ID}:${PATTERN_ACCOUNT_NAME}`
);
const REGEX_NAME_AND_SUBJECT = toRegExp(
  `${PATTERN_CHAIN_NAME}:${PATTERN_ACCOUNT_NAME}`
);

const CONDITIONAL_PROOF_2022 = 'ConditionalProof2022';

export {
  antelopeChainRegistry,
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME,
  CONDITIONAL_PROOF_2022,
};

function getResolutionError(error: string): DIDResolutionResult {
  return {
    didResolutionMetadata: { error },
    didDocument: null,
    didDocumentMetadata: {},
  };
}

export function checkDID(
  parsed: ParsedDID,
  registry: Registry
): MethodId | undefined {
  // findChainByName
  const partsName = parsed.id.match(REGEX_NAME_AND_SUBJECT);
  if (partsName) {
    const entry = registry[partsName[1]];
    if (entry)
      return {
        chain: entry,
        subject: partsName[partsName.length - 1],
      };
    return undefined;
  }

  // findChainById
  const partsID = parsed.id.match(REGEX_ID_AND_SUBJECT);
  if (partsID) {
    for (let key of Object.keys(registry)) {
      const entry: Entry = registry[key];
      if (entry.chainId === partsID[1])
        return {
          chain: entry,
          subject: partsID[partsID.length - 1],
        };
    }
  }

  return undefined;
}

export async function fetchAccount(
  methodId: MethodId,
  did: string,
  parsed: ParsedDID,
  options: AntelopeDIDResolutionOptions
): Promise<AntelopeAccountResponse | null> {
  const serviceType = 'LinkedDomains';
  if (options.antelopeChainUrl) {
    return await createRpcFetchAccount(
      methodId,
      {
        serviceEndpoint: options.antelopeChainUrl,
      },
      options
    );
  }
  const services = findServices(methodId.chain.service, serviceType);

  for (const service of services as any) {
    return await createRpcFetchAccount(methodId, service, options);
  }
  return null;
}

async function createRpcFetchAccount(
  methodId: MethodId,
  service: any,
  options: AntelopeDIDResolutionOptions
) {
  const rpcOptions: ExtensibleSchema = {};
  if (options.fetch) rpcOptions.fetch = options.fetch;
  const endpoint = service.serviceEndpoint;
  const rpc = new JsonRpc(endpoint, rpcOptions);

  try {
    return await rpc.get_account(methodId.subject);
  } catch (e) {
    if (e instanceof RpcError) {
      const error = e.json;
      if (error.code === 500 && error.error?.code === 0 && error.error?.details[0]?.message?.startsWith('unknown key')) {
        // Antelope v3+ returns 500 error when account does not exist
        // Eosio v2 (with eosjs) returns null when account does not exist
        // TODO update to latest eosjs to fix this...???
        return null;
      }
    }

    console.error(JSON.stringify(e, null, 2));
    // then try other services in case of error.
  }
}

function findServices(
  service: Array<ServiceEndpoint>,
  type: string
): Array<ServiceEndpoint> {
  return service.filter((s: any) =>
    Array.isArray(s.type) ? s.type.includes(type) : s.type === type
  );
}

function getCurveNamesFromType(
  type: KeyType
): { jwkCurve: string; verificationMethodType: string } {
  switch (type) {
    case KeyType.k1:
      return {
        jwkCurve: 'secp256k1',
        verificationMethodType: 'EcdsaSecp256k1VerificationKey2019',
      };
    case KeyType.r1:
      return { jwkCurve: 'P-256', verificationMethodType: 'JsonWebKey2020' };
    case KeyType.wa:
      return { jwkCurve: 'P-256', verificationMethodType: 'JsonWebKey2020' };
  }

  throw new Error('Key type not supported');
}

function createKeyMethod(
  baseId: string,
  i: number,
  did: string,
  key: string
): VerificationMethod {
  const pubKey = PublicKey.fromString(key);
  const ecPubKey: ec.KeyPair = pubKey.toElliptic();

  if (!pubKey.isValid()) throw new Error('Key is not valid');

  const { jwkCurve, verificationMethodType } = getCurveNamesFromType(
    pubKey.getType()
  );

  const publicKeyJwk: Jwk = {
    crv: jwkCurve,
    kty: 'EC',
    x: bnToBase64Url(ecPubKey.getPublic().getX()),
    y: bnToBase64Url(ecPubKey.getPublic().getY()),
    kid: pubKey.toString(),
  };

  const keyMethod: VerificationMethod = {
    id: baseId + '-' + i,
    controller: did,
    type: verificationMethodType,
    publicKeyJwk,
  };

  return keyMethod;
}

function createAccountMethod(
  baseId: string,
  methodId: MethodId,
  i: number,
  did: string,
  account: AntelopeAccountPermission
): VerificationMethod {
  const delegatedChain = baseId.slice(
    0,
    baseId.lastIndexOf(methodId.subject) - 1
  );
  const accountMethod = {
    id: baseId + '-' + i,
    controller: did,
    type: CONDITIONAL_PROOF_2022,
    conditionDelegated:
      delegatedChain +
      ':' +
      account.permission.actor +
      '#' +
      account.permission.permission,
  };
  return accountMethod;
}

export function createDIDDocument(
  methodId: MethodId,
  did: string,
  antelopeAccount: AntelopeAccountResponse
): DIDDocument {
  const verificationMethod: VerificationMethod[] = [];
  for (const permission of antelopeAccount.permissions) {
    const baseId = did + '#' + permission.perm_name;

    permission.required_auth.accounts = permission.required_auth.accounts.filter(
      account => account.permission.permission !== 'eosio.code'
    );

    let method: VerificationMethod;
    if (
      permission.required_auth.keys.length === 1 &&
      permission.required_auth.accounts.length === 0
    ) {
      method = createKeyMethod(
        baseId,
        0,
        did,
        permission.required_auth.keys[0].key
      );
      method.id = baseId;
    } else {
      method = {
        id: baseId,
        controller: did,
        type: CONDITIONAL_PROOF_2022,
        threshold: permission.required_auth.threshold,
        conditionWeightedThreshold: [],
      };

      if (permission.parent !== '') {
        method.relationshipParent = [did + '#' + permission.parent];
      }

      let i = 0;
      for (const key of permission.required_auth.keys) {
        method.conditionWeightedThreshold.push({
          condition: createKeyMethod(baseId, i, did, key.key),
          weight: key.weight,
        });
        i++;
      }

      for (const account of permission.required_auth.accounts) {
        method.conditionWeightedThreshold.push({
          condition: createAccountMethod(baseId, methodId, i, did, account),
          weight: account.weight,
        });
        i++;
      }
    }
    verificationMethod.push(method);
  }

  const doc = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3c-ccg.github.io/verifiable-conditions/contexts/verifiable-conditions-2021-v1.json',
    ],
    id: did,
    verificationMethod,
    service: methodId.chain.service,
  };

  return doc as any;
}

export async function resolve(
  did: string,
  parsed: ParsedDID,
  // @ts-ignore(TS6133 declared but never used)
  resolver: Resolvable,
  options: AntelopeDIDResolutionOptions
): Promise<DIDResolutionResult> {
  const registry: Registry = {
    ...antelopeChainRegistry,
    ...options.antelopeChainRegistry,
  };

  let methodId = checkDID(parsed, registry);
  if (options.antelopeChainUrl) {
    const [chainId, subject] = parsed.id.split(':');
    methodId = {
      chain: {
        chainId,
        service: [],
      },
      subject,
    };
  }
  if (!methodId) {
    // invalid method-specific-id OR no matching chain in the registry
    return getResolutionError('invalidDid');
  }

  const antelopeAccount = await fetchAccount(methodId, did, parsed, options);

  if (!antelopeAccount) {
    return getResolutionError('notFound');
  }

  const didDoc = createDIDDocument(methodId, parsed.did, antelopeAccount);
  return {
    didResolutionMetadata: { contentType: 'application/did+ld+json' },
    didDocument: didDoc,
    didDocumentMetadata: {},
  };
}

export function createResolver(
  options: { antelopeChainUrl?: string } = {}
): any {
  return function (
    did: string,
    parsed: ParsedDID,
    // @ts-ignore(TS6133 declared but never used)
    resolver: Resolvable,
    antelopeOptions: AntelopeDIDResolutionOptions
  ) {
    return resolve(did, parsed, resolver, { ...antelopeOptions, ...options });
  };
}
