export declare const ROLES_KEY = "roles";
export type RoleType = 'USER' | 'ADMIN' | 'DEVELOPER' | 'COMPLEX';
export declare const Roles: (...roles: RoleType[]) => import("@nestjs/common").CustomDecorator<string>;
