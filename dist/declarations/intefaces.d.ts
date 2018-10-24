export interface ListParam {
    size?: number;
    page?: number;
}
interface Entity {
    created_at: string;
    updated_at: string;
}
export interface BikeEntity extends Entity {
    id: number;
    brand: string;
    business_id: number;
}
export interface RoleEntity {
    id: number;
    title: string;
    permissions: Object;
}
export interface BusinessEntity extends Entity {
    id: number;
    name: string;
    bikes?: BikeEntity[];
}
export interface UserEntity extends Entity {
    id: number;
    email: string;
    role_id: number;
    role?: RoleEntity;
    businesses?: BusinessEntity[];
}
export interface ListResult<T> {
    count: number;
    items: T[];
}
export interface SDKService {
    readonly url: string;
}
export interface Listable<T> extends SDKService {
    list(params?: ListParam): Promise<ListResult<T>>;
    one(id: number | string): Promise<T>;
}
export interface CreateTokenInput {
    username: string;
    password: string;
}
export interface CreateTokenResult {
    access_token: string;
    token_type: string;
    expires_in: number;
    user_id: number;
    scope?: string;
    refresh_token?: string;
}
export interface UsersService extends Listable<UserEntity> {
}
export interface BikesService extends Listable<BikeEntity> {
}
export interface BusinessesService extends Listable<BusinessEntity> {
}
export interface TokensService extends SDKService {
    create(input: CreateTokenInput): Promise<CreateTokenResult>;
}
export {};
