import {
  DIDResolutionOptions,
  ParsedDID,
  Resolver,
  ServiceEndpoint,
  DIDResolutionMetadata,
  DIDDocumentMetadata,
} from 'did-resolver';

interface AntelopeAccountResponse {
  account_name: string;
  head_block_num: number;
  head_block_time: string;
  privileged: boolean;
  last_code_update: string;
  created: string;
  core_liquid_balance: string;
  ram_quota: number;
  net_weight: number;
  cpu_weight: number;
  net_limit: {
    used: number;
    available: number;
    max: number;
  };
  cpu_limit: {
    used: number;
    available: number;
    max: number;
  };
  ram_usage: number;
  permissions: [
    {
      perm_name: string;
      parent: string;
      required_auth: {
        threshold: number;
        keys: AntelopeKeyType[];
        accounts: AntelopeAccountPermission[];
        waits: [
          {
            wait_sec: number;
            weight: number;
          }
        ];
      };
    }
  ];
  total_resources: {
    owner: string;
    net_weight: string;
    cpu_weight: string;
    ram_bytes: number;
  };
  self_delegated_bandwidth: {
    from: string;
    to: string;
    net_weight: string;
    cpu_weight: string;
  };
  refund_request: {
    owner: string;
    request_time: string;
    net_amount: string;
    cpu_amount: string;
  };
  voter_info: {
    owner: string;
    proxy: string;
    producers: [string];
    staked: number;
    last_stake: number;
    last_vote_weight: string;
    proxied_vote_weight: string;
    is_proxy: number;
    flags1: number;
    reserved2: number;
    reserved3: string;
  };
  rex_info: any;
}

declare interface AntelopeKeyType {
  key: string;
  weight: number;
}

declare interface AntelopeAccountPermission {
  permission: {
    permission: string;
    actor: string;
  };
  weight: number;
}
declare interface ExtensibleSchema {
  [x: string]: any; // other properties possible depending on type
}

// Does not compile due to incompatibility with node_modules/did-resolver/lib/resolver.d.ts
interface VerificationMethod extends ExtensibleSchema {
  id: string;
  type: string;
  controller: string;
}

interface Service {
  id: string;
  type: string;
  serviceEndpoint: string;
}

interface Entry {
  chainId: string;
  service: Service[];
}

export interface AntelopeDIDResolutionOptions extends DIDResolutionOptions {
  fetch?: any;
  antelopeChainRegistry: Registry;
  antelopeChainUrl?: string;
}

export interface Registry {
  [chainName: string]: Entry;
}

export interface Jwk {
  crv: string;
  kty: string;
  x: string;
  y: string;
  kid: string;
}

interface MethodId {
  chain: Entry;
  subject: string;
}
