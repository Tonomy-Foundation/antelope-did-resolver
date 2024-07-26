import { ParsedDID, DIDResolutionResult, DIDDocument, ServiceEndpoint, Resolvable } from 'did-resolver';
import { APIError, PublicKey } from '@wharfkit/antelope';
import { AccountObject } from '@wharfkit/antelope/src/api/v1/types';
import { PermissionLevelWeight } from '@wharfkit/antelope/src/chain/authority';
import { Entry, Registry, MethodId, VerificationMethod, AntelopeDIDResolutionOptions } from './types';
import { createJWK, getCurveNamesFromType } from './utils';
import antelopeChainRegistry from './antelope-did-chain-registry.json';
import { GetApiOptions, getApi } from './api';

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
): Promise<AccountObject | null> {
  const serviceType = 'LinkedDomains';

  if (options.antelopeChainUrl) {
    return await createRpcFetchAccount(methodId, {
      url: options.antelopeChainUrl,
      fetch: options.fetch,
    });
  }

  const services = findServices(methodId.chain.service, serviceType);

  for (const service of services as any) {
    return await createRpcFetchAccount(methodId, {
      url: service.serviceEndpoint,
      fetch: options.fetch
    });
  }

  return null;
}


async function createRpcFetchAccount(methodId: MethodId, options: GetApiOptions): Promise<AccountObject | null> {
  try {
    // @ts-expect-error AccountObject is not assignable to @wharfkit/antelope AccountObject
    return await getApi(options).v1.chain.get_account(methodId.subject);
  } catch (e) {
    if (e instanceof APIError && e.message.startsWith('Account Query Exception at /v1/chain/get_account')) {
      return null;
    } else {
      throw e;
    }
  }
}

function findServices(service: Array<ServiceEndpoint>, type: string): Array<ServiceEndpoint> {
  return service.filter((s: any) => (Array.isArray(s.type) ? s.type.includes(type) : s.type === type));
}

function createKeyMethod(baseId: string, i: number, did: string, pubKey: PublicKey): VerificationMethod {
  const { verificationMethodType } = getCurveNamesFromType(pubKey);

  return {
    id: baseId + '-' + i,
    controller: did,
    type: verificationMethodType,
    // NOTE: could also use `util.publicKeyHex(pubKey)` instead, but it is handy to have the kid property of the JWK for debugging
    publicKeyJwk: createJWK(pubKey),
  };
}

function createAccountMethod(
  baseId: string,
  methodId: MethodId,
  i: number,
  did: string,
  account: PermissionLevelWeight
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

export function createDIDDocument(methodId: MethodId, did: string, antelopeAccount: AccountObject): DIDDocument {
  const verificationMethod: VerificationMethod[] = [];

  for (const permission of antelopeAccount.permissions) {
    const baseId = did + '#' + permission.perm_name;

    permission.required_auth.accounts = permission.required_auth.accounts.filter(
      (account) => account.permission.permission.toString() !== 'eosio.code'
    );

    let method: VerificationMethod;

    if (permission.required_auth.keys.length === 1 && permission.required_auth.accounts.length === 0) {
      // @ts-expect-error PublicKey is not assignable to @wharfkit/antelope PublicKey
      method = createKeyMethod(baseId, 0, did, permission.required_auth.keys[0].key);
      method.id = baseId;
    } else {
      method = {
        id: baseId,
        controller: did,
        type: CONDITIONAL_PROOF_2022,
        threshold: permission.required_auth.threshold.toNumber(),
        conditionWeightedThreshold: [],
      };

      if (permission.parent.toString() !== '') {
        method.relationshipParent = [did + '#' + permission.parent.toString()];
      }

      let i = 0;

      for (const key of permission.required_auth.keys) {
        method.conditionWeightedThreshold.push({
          // @ts-expect-error PublicKey is not assignable to @wharfkit/antelope PublicKey
          condition: createKeyMethod(baseId, i, did, key.key),
          weight: key.weight.toNumber(),
        });
        i++;
      }

      for (const account of permission.required_auth.accounts) {
        method.conditionWeightedThreshold.push({
          condition: createAccountMethod(baseId, methodId, i, did, account),
          weight: account.weight.toNumber(),
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

export function createResolver(options: AntelopeDIDResolutionOptions = {}): any {
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
