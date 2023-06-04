import { ResolverRegistry } from 'did-resolver';
import {
  resolve,
  antelopeChainRegistry,
  checkDID,
  fetchAccount,
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME,
  CONDITIONAL_PROOF_2022,
  createDIDDocument,
  createResolver,
} from './resolver';

export function getResolver(options?: {
  antelopeChainUrl?: string;
  fetch?: () => Promise<any>;
}): ResolverRegistry {
  return { eosio: resolve, antelope: createResolver(options) } as any;
}

export {
  antelopeChainRegistry,
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME,
  CONDITIONAL_PROOF_2022,
  createDIDDocument,
  checkDID,
  fetchAccount,
};
