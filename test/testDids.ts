export const testDids = [
  {
    did: 'did:antelope:eos:testnet:jungle:lioninjungle',
    expectedResult: {
      didResolutionMetadata: { contentType: 'application/did+ld+json' },
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3c-ccg.github.io/verifiable-conditions/contexts/verifiable-conditions-2021-v1.json',
        ],
        id: 'did:antelope:eos:testnet:jungle:lioninjungle',
        verificationMethod: [
          {
            id: 'did:antelope:eos:testnet:jungle:lioninjungle#active',
            controller: 'did:antelope:eos:testnet:jungle:lioninjungle',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'WNt2h22ZFXOkNM1pIWlYpcgijW/GvBs4QINdilx/uTE=',
              y: '//O1KeNzoGIfZsLNAHE8HCpIx4MAbzXCtEhGKbGhH88=',
              kid: 'PUB_K1_7WNGcLionsxCedB311Ciz9sWLWajHqsuvnecnZK8Q7J6CG43yf',
            },
          },
          {
            id: 'did:antelope:eos:testnet:jungle:lioninjungle#claim',
            controller: 'did:antelope:eos:testnet:jungle:lioninjungle',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: '9AVpaGiZpk5MsGsuuQnUzCe6Gg86zs+1TaCW0Qq+4oc=',
              y: 'egnBa/VYJnefRkPthAClOdiwZznwml6BCJtY+iNr2RI=',
              kid: 'PUB_K1_6jxYdUNLnmU9gMrcB7f6MWSjUNGLer68QKE9BiuXXn19skxkHe',
            },
          },
          {
            id: 'did:antelope:eos:testnet:jungle:lioninjungle#owner',
            controller: 'did:antelope:eos:testnet:jungle:lioninjungle',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'WNt2h22ZFXOkNM1pIWlYpcgijW/GvBs4QINdilx/uTE=',
              y: '//O1KeNzoGIfZsLNAHE8HCpIx4MAbzXCtEhGKbGhH88=',
              kid: 'PUB_K1_7WNGcLionsxCedB311Ciz9sWLWajHqsuvnecnZK8Q7J6CG43yf',
            },
          },
        ],
        service: [
          {
            id: 'https://jungle4.cryptolions.io',
            type: 'LinkedDomains',
            serviceEndpoint: 'https://jungle4.cryptolions.io',
          },
        ],
      },
      didDocumentMetadata: {},
    },
  },
  {
    did: 'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks',
    expectedResult: {
      didResolutionMetadata: {
        contentType: 'application/did+ld+json',
      },
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3c-ccg.github.io/verifiable-conditions/contexts/verifiable-conditions-2021-v1.json',
        ],
        id: 'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks',
        verificationMethod: [
          {
            id: 'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks#active',
            controller:
              'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'qtURTt2310JSW5rcRbGOIzIEJw/Hkya1wYtiOfPH5bQ=',
              y: 'IwCoN7GZWkNNKyyhG82iSclXM0kIVVHiwBKcXvMXmCo=',
              kid: 'PUB_K1_6Bj319bz279z7svm219K3sGMSyupYTxSHS4twhQuys5LVkdvT7',
            },
          },
          {
            id: 'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks#delphi',
            controller:
              'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'UU32ZoNV5F8+wZVboQo+70OGwlrq1LI8eMgLKR6FkX8=',
              y: '3YuUCMnonE77VmeEJ+9MP4dQVvhjOyGe0mvwrDAeaKY=',
              kid: 'PUB_K1_5WJAkq8dQULikFHKM8ZJRTRZsi5hXHXJ2mGJwhdCn9jACeiXEd',
            },
          },
          {
            id: 'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks#owner',
            controller:
              'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'qtURTt2310JSW5rcRbGOIzIEJw/Hkya1wYtiOfPH5bQ=',
              y: 'IwCoN7GZWkNNKyyhG82iSclXM0kIVVHiwBKcXvMXmCo=',
              kid: 'PUB_K1_6Bj319bz279z7svm219K3sGMSyupYTxSHS4twhQuys5LVkdvT7',
            },
          },
          {
            id: 'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks#rng',
            controller:
              'did:antelope:4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11:caleosblocks',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'mNlY09ZUonQSYzZpEpvfIN1s+2O3979oyHbYDzcvlBw=',
              y: 'YdyiZrVj9SjaBDkZP66/9uDsUT+Nsrm6ycuPMLgj0EI=',
              kid: 'PUB_K1_63ogBzScX6CAbsW1caxer6DcddkV1nLbNT3BAQPztgeSR1yg2S',
            },
          },
        ],
        service: [
          {
            id: 'https://telos.greymass.com',
            type: 'LinkedDomains',
            serviceEndpoint: 'https://telos.greymass.com',
          },
        ],
      },
      didDocumentMetadata: {},
    },
  },
  {
    did: 'did:antelope:eos:eoscanadacom',
    expectedResult: {
      didResolutionMetadata: {
        contentType: 'application/did+ld+json',
      },
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3c-ccg.github.io/verifiable-conditions/contexts/verifiable-conditions-2021-v1.json',
        ],
        id: 'did:antelope:eos:eoscanadacom',
        verificationMethod: [
          {
            id: 'did:antelope:eos:eoscanadacom#active',
            controller: 'did:antelope:eos:eoscanadacom',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: '0xMG4S6nDAGYjy6un2+l53+s0RC2t619/LqPDxyPcf0=',
              y: 'gRsWsrqWqnlr+jCDVeqatVjFghLADydjOlUPImBwhYs=',
              kid: 'PUB_K1_8SC96RUoYvM1X47isBBrebY1kjqVT4w37Q4tNNHtT8XN35v33D',
            },
          },
          {
            id: 'did:antelope:eos:eoscanadacom#blacklistops',
            controller: 'did:antelope:eos:eoscanadacom',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'dLOnSPgih47eVwlWAlrcm4wD1cJnjc+Jh/UFdlb29mw=',
              y: 'vwsVDd//tmPumdQ2Yo+TdozxbhGnyDMg3Htd52+SEw0=',
              kid: 'PUB_K1_7idX86zQ6M3mrzkGQ9MGHf4btSECmcTj4i8Le59ga7CpLxRu4s',
            },
          },
          {
            id: 'did:antelope:eos:eoscanadacom#claimer',
            controller: 'did:antelope:eos:eoscanadacom',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'RnFk1oqh28hDY2WHWUhQzAZYXjfvv0oR43h69RCCkIA=',
              y: 'e8aXe3M9xKgYsj6U+KOonbgEtjHGPDtAUavq9nY4lI8=',
              kid: 'PUB_K1_7NFuBesBKK5XHHLtzFxm7S57Eq11gUtndrsvq3Mt3XZNNT5cXo',
            },
          },
          {
            id: 'did:antelope:eos:eoscanadacom#day2day',
            controller: 'did:antelope:eos:eoscanadacom',
            type: 'ConditionalProof2022',
            threshold: 1,
            conditionWeightedThreshold: [
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#day2day-0',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaaa#active',
                },
                weight: 1,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#day2day-1',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaac#active',
                },
                weight: 1,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#day2day-2',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaaf#active',
                },
                weight: 1,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#day2day-3',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaag#active',
                },
                weight: 1,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#day2day-4',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaah#active',
                },
                weight: 1,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#day2day-5',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaai#active',
                },
                weight: 1,
              },
            ],
            relationshipParent: ['did:antelope:eos:eoscanadacom#active'],
          },
          {
            id: 'did:antelope:eos:eoscanadacom#eosforumdapp',
            controller: 'did:antelope:eos:eoscanadacom',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: {
              crv: 'secp256k1',
              kty: 'EC',
              x: 'XWelm/LA5OvSwDPBQT/dwxWZ1Li1BiYbP3w2yhkcb6k=',
              y: 'wfydp1B25ylTsaR+W1Wld6TVLnJHXGgC7AgJ50Y0FHM=',
              kid: 'PUB_K1_7YNS1swh6QWANkzGgFrjiX8E3u8WK5CK9GMAb6EzKVNZKnMUfs',
            },
          },
          {
            id: 'did:antelope:eos:eoscanadacom#owner',
            controller: 'did:antelope:eos:eoscanadacom',
            type: 'ConditionalProof2022',
            threshold: 5,
            conditionWeightedThreshold: [
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#owner-0',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaaa#active',
                },
                weight: 2,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#owner-1',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaab#active',
                },
                weight: 2,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#owner-2',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaac#active',
                },
                weight: 2,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#owner-3',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaad#active',
                },
                weight: 2,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#owner-4',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaae#active',
                },
                weight: 2,
              },
              {
                condition: {
                  id: 'did:antelope:eos:eoscanadacom#owner-5',
                  controller: 'did:antelope:eos:eoscanadacom',
                  type: 'ConditionalProof2022',
                  conditionDelegated: 'did:antelope:eos:eoscanadaaaf#active',
                },
                weight: 1,
              },
            ],
          },
        ],
        service: [
          {
            id: 'https://eos.greymass.com',
            type: 'LinkedDomains',
            serviceEndpoint: 'https://eos.greymass.com',
          },
          {
            id: 'https://eos.dfuse.eosnation.io',
            type: 'LinkedDomains',
            serviceEndpoint: 'https://eos.dfuse.eosnation.io',
          },
        ],
      },
      didDocumentMetadata: {},
    },
  },
  {
    did: 'did:wrongdidschema',
    expectedResult: {
      didResolutionMetadata: { error: 'invalidDid' },
      didDocument: null,
      didDocumentMetadata: {},
    },
  },
  {
    did: 'did:antelope:unknownchainid',
    expectedResult: {
      didResolutionMetadata: { error: 'invalidDid' },
      didDocument: null,
      didDocumentMetadata: {},
    },
  },
  {
    did: 'did:antelope:eos:unknownacc',
    expectedResult: {
      didResolutionMetadata: { error: 'notFound' },
      didDocument: null,
      didDocumentMetadata: {},
    },
  },
  {
    did: 'did:antelope:eos:invalidaccountname',
    expectedResult: {
      didResolutionMetadata: { error: 'invalidDid' },
      didDocument: null,
      didDocumentMetadata: {},
    },
  },
];
