# Antelope DID Resolver

This library is intended to use Antelope accounts as fully self managed [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) and wrap them in a [DID Document](https://w3c-ccg.github.io/did-spec/#did-documents)

It supports the proposed [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/) spec from the [W3C Credentials Community Group](https://w3c-ccg.github.io).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

The DID specification can be found at [antelope-did-registry](https://github.com/Tonomy-Foundation/antelope-did-spec).

## Contributions

Contributors:

- Jack Tanner | Tonomy Foundation
- Jonas Walter
- Sebastian Montero <sebastian@m1ghty.io>
- Sana Rauf | Block One
- Julius Rahaus
- Rebal Alhaqash | Tonomy Foundation

<!-- Make sure images have 75 pixel height -->
[![Gimly](./assets/gimly.jpg)](https://gimly.io)
![](./assets/filler.png)
[![Europechain](./assets/europechain.png)](https://europechain.io)
![](./assets/filler.png)
[![Digital Scarcity](./assets/digital-scarcity.jpeg)](https://digitalscarcity.io)
![](./assets/filler.png)
[![rewired.one](./assets/rewired.png)](https://www.rewired.one)
![](./assets/filler.png)
[![Block One](./assets/block-one.png)](https://block.one)

## DID method

The [DID Method](https://w3c.github.io/did-core/#methods) schema can be consumed in either of the following two formats:

1. Registered chain name schema
2. Chain-id schema

For example:

- `did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:example`
- `did:antelope:telos:example`

both resolve the same DID from the Telos blockchain.

## DID Document

The did resolver takes the Antelope account name and retreives it's permission data from the blockchain to make the DID document.

```json
{
    "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3c-ccg.github.io/verifiable-conditions/contexts/verifiable-conditions-2021-v1.json"
    ],
    "id": "did:antelope:eos:testnet:jungle:lioninjungle",
    "verificationMethod": [
        {
            "id": "did:antelope:eos:testnet:jungle:lioninjungle#active",
            "controller": "did:antelope:eos:testnet:jungle:lioninjungle",
            "type": "VerifiableCondition",
            "threshold": 1,
            "conditionWeightedThreshold": [
                {
                    "condition": {
                        "id": "did:antelope:eos:testnet:jungle:lioninjungle#active-0",
                        "controller": "did:antelope:eos:testnet:jungle:lioninjungle",
                        "type": "EcdsaSecp256k1VerificationKey2019",
                        "publicKeyJwk": {
                            "crv": "secp256k1",
                            "kty": "EC",
                            "x": "jbXSqQffgSNrtF4SBriENexUuXstjPDRFV_3PRCFU7o",
                            "y": "J20YqTFJgZ3P5KXZBEcOmWX-Nxaqogtt4NyWtvx8Ryk",
                            "kid": "PUB_K1_7ueKyvQJpBLVjuNgLedAgJakw3bLyd4GBx1N4jXswpBhE5SbJK"
                        }
                    },
                    "weight": 1
                }
            ],
            "relationshipParent": [
                "did:antelope:eos:testnet:jungle:lioninjungle#owner"
            ]
        },
        {
            "id": "did:antelope:eos:testnet:jungle:lioninjungle#owner",
            "controller": "did:antelope:eos:testnet:jungle:lioninjungle",
            "type": "VerifiableCondition",
            "threshold": 1,
            "conditionWeightedThreshold": [
                {
                    "condition": {
                        "id": "did:antelope:eos:testnet:jungle:lioninjungle#owner-0",
                        "controller": "did:antelope:eos:testnet:jungle:lioninjungle",
                        "type": "EcdsaSecp256k1VerificationKey2019",
                        "publicKeyJwk": {
                            "crv": "secp256k1",
                            "kty": "EC",
                            "x": "jbXSqQffgSNrtF4SBriENexUuXstjPDRFV_3PRCFU7o",
                            "y": "J20YqTFJgZ3P5KXZBEcOmWX-Nxaqogtt4NyWtvx8Ryk",
                            "kid": "PUB_K1_7ueKyvQJpBLVjuNgLedAgJakw3bLyd4GBx1N4jXswpBhE5SbJK"
                        }
                    },
                    "weight": 1
                }
            ]
        }
    ],
    "service": [
        {
            "id": "https://jungle4.cryptolions.io",
            "type": "LinkedDomains",
            "serviceEndpoint": "https://jungle4.cryptolions.io"
        }
    ]
}
```

Note this uses the [`Verifiable Conditions`](https://github.com/Gimly-Blockchain/verifiable-conditions) verification method type.

## Building a DID document

The DID document is built from the account data on the Antelope blockchain.

## Resolving a DID document

### Resolving from pre-registered Antelope chains

```javascript
import { Resolver } from 'did-resolver'
import { getResolver } from '@tonomy/antelope-did-resolver'

async function resolve() {
  const didResolver = new Resolver(getResolver())

  const didDoc = await didResolver.resolve('did:antelope:eos:example');
}
```

### Resolving with a custom Antelope chain or custom API

```javascript
import { Resolver } from 'did-resolver'
import { getResolver } from '@tonomy/antelope-did-resolver'

async function resolve() {

  // Multiple entries can exist for multiple antelope chains
  const config = {
    eos: {
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        service: [
            {
                id: "https://eos.greymass.com",
                type: [
                    LinkedDomains
                ],
                serviceEndpoint: "https://eos.greymass.com"
            }
        ]
    }
  }
  const didResolver = new Resolver(getResolver(config))

  const didDoc = await didResolver.resolve('did:antelope:eos:example');
}
```
