import { ResolverRegistry } from '@tonomy/did-resolver';
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
} from './resolver';

export function getResolver(): ResolverRegistry {
  return { eosio: resolve, antelope: resolve };
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
