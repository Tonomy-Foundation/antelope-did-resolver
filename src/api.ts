import { APIClient, FetchProvider } from '@greymass/eosio';
import fetch from 'cross-fetch';

let api: APIClient;

export function getApi(url: string): APIClient {
    if (api) return api;

    api = new APIClient({
        url,
        provider: new FetchProvider(url, { fetch }),
    });
    if (!api) throw new Error('Could not create API client');
    return api;
}
