import { ParsedDID, DIDResolutionResult, DIDDocument, ServiceEndpoint, Resolvable } from '@tonomy/did-resolver';
import { APIError, PublicKey, KeyType } from '@greymass/eosio';
import {
  AntelopeAccountPermission,
  AntelopeAccountResponse,
  Entry,
  Registry,
  MethodId,
  VerificationMethod,
  AntelopeDIDResolutionOptions,
} from './types';
import { createJWK, getCurveNamesFromType } from './utils';
import antelopeChainRegistry from './antelope-did-chain-registry.json';
import { getApi } from './api';

const PATTERN_ACCOUNT_NAME = `([a-z1-5.]{0,12}[a-z1-5])`;
const PATTERN_CHAIN_ID = `([A-Fa-f0-9]{64})`;
const PATTERN_CHAIN_NAME = `(([a-z1-5.]{0,12}[a-z1-5])((:[a-z1-5.]{0,12}[a-z1-5])+)?)`;

function toRegExp(pattern: string): RegExp {
  return new RegExp(`^${pattern}$`);
}

const REGEX_ACCOUNT_NAME = toRegExp(PATTERN_ACCOUNT_NAME);
const REGEX_CHAIN_ID = toRegExp(PATTERN_CHAIN_ID);
const REGEX_CHAIN_NAME = toRegExp(PATTERN_CHAIN_NAME);
const REGEX_ID_AND_SUBJECT = toRegExp(`${PATTERN_CHAIN_ID}:${PATTERN_ACCOUNT_NAME}`);
const REGEX_NAME_AND_SUBJECT = toRegExp(`${PATTERN_CHAIN_NAME}:${PATTERN_ACCOUNT_NAME}`);

const CONDITIONAL_PROOF_2022 = 'ConditionalProof2022';

export { antelopeChainRegistry, REGEX_ACCOUNT_NAME, REGEX_CHAIN_ID, REGEX_CHAIN_NAME, CONDITIONAL_PROOF_2022 };

function getResolutionError(error: string): DIDResolutionResult {
  return {
    didResolutionMetadata: { error },
    didDocument: null,
    didDocumentMetadata: {},
  };
}

export function checkDID(parsed: ParsedDID, registry: Registry): MethodId | undefined {
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
    for (const key of Object.keys(registry)) {
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
  _did: string,
  _parsed: ParsedDID,
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

async function createRpcFetchAccount(methodId: MethodId, service: any, options: AntelopeDIDResolutionOptions) {
  const endpoint = service.serviceEndpoint;

  try {
    return await getApi(endpoint).v1.chain.get_account(methodId.subject);
  } catch (e) {
    if (e instanceof APIError) {
      if (e.message.startsWith('Account not found at /v1/chain/get_account')) {
        return null;
      } else {
        throw e;
      }
    }
  }
}

function findServices(service: Array<ServiceEndpoint>, type: string): Array<ServiceEndpoint> {
  return service.filter((s: any) => (Array.isArray(s.type) ? s.type.includes(type) : s.type === type));
}

function createKeyMethod(baseId: string, i: number, did: string, key: string): VerificationMethod {
  const pubKey = PublicKey.from(key);

  const publicKeyJwk = createJWK(pubKey);
  const { verificationMethodType } = getCurveNamesFromType(pubKey);

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
  const delegatedChain = baseId.slice(0, baseId.lastIndexOf(methodId.subject) - 1);
  const accountMethod = {
    id: baseId + '-' + i,
    controller: did,
    type: CONDITIONAL_PROOF_2022,
    conditionDelegated: delegatedChain + ':' + account.permission.actor + '#' + account.permission.permission,
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
      (account) => account.permission.permission !== 'eosio.code'
    );

    let method: VerificationMethod;

    if (permission.required_auth.keys.length === 1 && permission.required_auth.accounts.length === 0) {
      method = createKeyMethod(baseId, 0, did, permission.required_auth.keys[0].key);
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

export function createResolver(options: { antelopeChainUrl?: string } = {}): any {
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
