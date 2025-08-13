import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type RoleType = 'USER' | 'ADMIN' | 'DEVELOPER' | 'COMPLEX';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);