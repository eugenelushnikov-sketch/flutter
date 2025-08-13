import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: unknown, user: TUser, info: unknown, context: ExecutionContext): TUser {
    if (err || !user) {
      throw err || info;
    }
    return user;
  }
}