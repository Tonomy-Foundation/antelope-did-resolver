import { ResolverRegistry } from 'did-resolver';
import {
  createResolver,
} from './resolver';
import { AntelopeDIDResolutionOptions } from './types';
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

export function getResolver(options?: AntelopeDIDResolutionOptions): ResolverRegistry {
  return { eosio: createResolver(options), antelope: createResolver(options) } as any;
}
