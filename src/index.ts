import { ResolverRegistry } from 'did-resolver';
import {
  createResolver,
} from './resolver';
export {
  antelopeChainRegistry,
  checkDID,
  fetchAccount,
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME,
  CONDITIONAL_PROOF_2022,
  createDIDDocument,
} from './resolver';
export * from './utils';
export function getResolver(options?: { antelopeChainUrl?: string; fetch?: () => Promise<any> }): ResolverRegistry {
  return { eosio: createResolver(options), antelope: createResolver(options) } as any;
}
