import {
  DIDResolutionOptions,
  ParsedDID,
  Resolver,
  ServiceEndpoint,
  DIDResolutionMetadata,
  DIDDocumentMetadata,
} from 'did-resolver';

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
