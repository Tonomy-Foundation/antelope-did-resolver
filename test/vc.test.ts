import { Resolver } from 'did-resolver';
import { createIssuer, getResolver } from '../src/index';
import { jest } from '@jest/globals';
import { JwtCredentialPayload, createVerifiableCredentialJwt, verifyCredential } from 'did-jwt-vc'
import { PrivateKey } from '@wharfkit/antelope';

jest.setTimeout(10000);

describe('VC tests', () => {
    const resolver = new Resolver(getResolver());
    const accountName = "mytest123tes";
    const privateKey = PrivateKey.from("PVT_K1_2Yn362S23hWaDuDjLawDB1ZByF8fqsZZXFUDPTHnk6tXX44D2R");
    const did = `did:antelope:eos:testnet:jungle:${accountName}`;
    const issuer = createIssuer(did, privateKey);

    it('create and verify VC', async () => {
        const vcPayload: JwtCredentialPayload = {
            sub: 'did:example:subject-of-vc',
            nbf: 1562950282,
            vc: {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential'],
                credentialSubject: {
                    degree: {
                        type: 'BachelorDegree',
                        name: 'Baccalauréat en musiques numériques'
                    }
                }
            }
        }

        const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer)
        expect(vcJwt).toBeDefined()

        const verifiedVC = await verifyCredential(vcJwt, resolver)
        expect(verifiedVC.verified).toBe(true)
        expect(verifiedVC.issuer).toBe(did)
    });
});