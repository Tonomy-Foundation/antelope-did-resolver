import { Resolver } from '@tonomy/did-resolver';
import { getResolver } from '../src/index';
import { testDids } from './testDids';
import { jest } from '@jest/globals';

jest.setTimeout(10000);

describe('resolver tests', () => {
  const resolver = new Resolver(getResolver());
  const responses = testDids.map(({ did, expectedResult }) => ({
    did,
    expectedResult,
    asyncResponse: resolver.resolve(did),
  }));

  describe('Dids resolve to DIDResolutionResult', () => {
    responses.forEach(({ did, asyncResponse }) => {
      it(`did: ${did}`, async () => {
        const response = await asyncResponse;

        expect(response).toHaveProperty('didDocument');
        expect(response).toHaveProperty('didDocumentMetadata');
        expect(response).toHaveProperty('didResolutionMetadata');
      });
    });
  });

  describe('didResolutionMetadata matches contentType if didDocument is present', () => {
    responses.forEach(({ did, asyncResponse }) => {
      it(`did: ${did}`, async () => {
        const response = await asyncResponse;

        if (response.didDocument)
          expect(response.didResolutionMetadata).toEqual({
            contentType: 'application/did+ld+json',
          });
      });
    });
  });

  describe('didResolutionMetadata has error if and only if didDocument is null', () => {
    responses.forEach(({ did, asyncResponse }) => {
      it(`did: ${did}`, async () => {
        const response = await asyncResponse;

        if (response.didDocument === null) expect(response.didResolutionMetadata).toHaveProperty('error');
        else if ('error' in response.didResolutionMetadata) expect(response.didDocument).toEqual(null);
      });
    });
  });

  describe('response matches expected results exactly', () => {
    responses.forEach(({ did, asyncResponse, expectedResult }) => {
      it(`did: ${did}`, async () => {
        const response = await asyncResponse;

        expect(response).toEqual(expectedResult);
      });
    });
  });
});
