import { ResolverRegistry } from 'did-resolver';
import {
  resolve,
  antelopeChainRegistry,
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME,
} from './resolver';

export function getResolver(): ResolverRegistry {
  return { antelope: resolve };
}

export {
  antelopeChainRegistry,
  REGEX_ACCOUNT_NAME,
  REGEX_CHAIN_ID,
  REGEX_CHAIN_NAME,
};
