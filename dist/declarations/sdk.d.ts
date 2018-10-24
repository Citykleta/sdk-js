import { BikesService, BusinessesService, TokensService, UsersService } from './intefaces';
export declare const enum HTTPMethod {
    PUT = "PUT",
    POST = "POST",
    GET = "GET",
    DELETE = "DELETE"
}
export * from './intefaces';
export interface SdkOptions {
    url?: string;
}
export interface Sdk {
    Users: (opts?: object) => UsersService;
    Bikes: (opts?: object) => BikesService;
    Businesses: (opts?: object) => BusinessesService;
    Tokens: (opts?: object) => TokensService;
}
export interface SDKFactory {
    (opts?: SdkOptions): Sdk;
}
export declare const sdk: (fetch: any, URL: any, btoa: any) => SDKFactory;
