import { ResolverRegistry } from 'did-resolver';
import {
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

export function getResolver(options?: { antelopeChainUrl?: string; fetch?: () => Promise<any> }): ResolverRegistry {
  return { eosio: createResolver(options), antelope: createResolver(options) } as any;
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
