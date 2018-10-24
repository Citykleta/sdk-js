import {
    BikeEntity, BikesService,
    BusinessEntity, BusinessesService, CreateTokenInput, CreateTokenResult,
    Listable,
    ListParam,
    ListResult, SDKService, TokensService,
    UserEntity, UsersService
} from './intefaces';

export const enum HTTPMethod {
    PUT = 'PUT',
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE'
}

export * from './intefaces';

interface Headers {
    Authorization?: string;
    'Content-Type': string;
}

export interface SdkOptions {
    url?: string;
}

const parseResponse = async <T>(response): Promise<T> => {
    if (response.ok === false) {
        throw {
            status: response.status,
            message: await response.json()
        };
    }
    return response.json();
};
const defaultUrl: string = 'https://api.citykleta.com';

export interface Sdk {
    Users: (opts?: object) => UsersService;
    Bikes: (opts?: object) => BikesService;
    Businesses: (opts?: object) => BusinessesService;
    Tokens: (opts?: object) => TokensService;
}

export interface SDKFactory {
    (opts?: SdkOptions): Sdk;
}

export const sdk = (fetch, URL, btoa): SDKFactory => ({url = defaultUrl}: SdkOptions = {url: 'https://api.citykleta.com'}) => {
    const baseUrl = () => new URL(url);
    const withUrl = (mixin) => Object.defineProperties(mixin, {
        url: {
            get() {
                return baseUrl().href;
            }
        }
    });
    const defaultHeaders = opts => {

        const headers: Headers = {
            'Content-Type': 'application/json'
        };

        if (opts.token) {
            headers.Authorization = `Bearer ${opts.token}`;
        } else if (opts.secret && opts.clientId) {
            headers.Authorization = `Basic ` + btoa(`${opts.clientId}:${opts.secret}`);
        }

        return headers;
    };
    const listable = <T>(path: string) => (opts = {}): Listable<T> => {
        const headers = defaultHeaders(opts);
        const baseUrl = new URL(url);
        return withUrl({
            async list({page = 1, size = 15}: ListParam = {page: 1, size: 15}): Promise<ListResult<T>> {
                const url = new URL(path, baseUrl);
                url.searchParams.append('page', page);
                url.searchParams.append('size', size);

                const response = await fetch(url.href, {
                    headers
                });

                return parseResponse<ListResult<T>>(response);
            },
            async one(id: number | string): Promise<T> {
                const url = new URL(`${path}/${id}`, baseUrl);
                const response = await fetch(url.href, {
                    headers
                });
                return parseResponse<T>(response);
            }
        });
    };

    return {
        Users: listable<UserEntity>('/users'),
        Bikes: listable<BikeEntity>('/bikes'),
        Businesses: listable<BusinessEntity>('/businesses'),
        Tokens(opts = {}) {
            const headers = defaultHeaders(opts);
            return withUrl({
                async create({username, password}: CreateTokenInput) {
                    const url = baseUrl();
                    url.pathname = `/tokens`;
                    const response = await fetch(url.href, {
                        method: HTTPMethod.POST,
                        headers,
                        body: JSON.stringify({
                            grant_type: 'password',
                            username,
                            password
                        })
                    });

                    return parseResponse<CreateTokenResult>(response);
                }
            });
        }
    };
};
