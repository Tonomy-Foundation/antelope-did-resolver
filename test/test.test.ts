import BN from 'bn.js';
// import { toString } from 'uint8arrays';

describe('Test it', () => {
    it('Converts a BN to a base64url', async () => {
        // console.log(toString(new Uint8Array([1, 2, 3]), 'base64pad'));
        const bigNumStart = new BN('1234567890');

        console.log(bigNumStart.toString());
    });
});
