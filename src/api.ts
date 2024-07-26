import { APIClient, FetchProvider } from '@wharfkit/antelope';
import { FetchType } from './types';

export interface APIClientOptions {
    url: string;
    fetch?: FetchType;
}
export function getApi(options: APIClientOptions): APIClient {
    const provider = options.fetch ? new FetchProvider(options.url, { fetch: options.fetch }) : new FetchProvider(options.url);
    return new APIClient({
        url: options.url,
        provider,
    });
}
