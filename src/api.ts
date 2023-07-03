import { APIClient, FetchProvider } from '@wharfkit/antelope';
import fetch from 'cross-fetch';

export function getApi(url: string): APIClient {
    return new APIClient({
        url,
        provider: new FetchProvider(url, { fetch }),
    });
}
