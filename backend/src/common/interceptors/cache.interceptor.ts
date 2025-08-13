import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../../cache/cache.service';
import crypto from 'crypto';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(private readonly cache: CacheService, private readonly ttlSeconds = 120) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    if (req.method !== 'GET') {
      return next.handle();
    }

    const keyBase = `${req.method}:${req.originalUrl}`;
    const key = `cache:${crypto.createHash('md5').update(keyBase).digest('hex')}`;
    const cached = await this.cache.get(key);
    if (cached) {
      res.setHeader('x-cache', 'HIT');
      return of(cached);
    }

    res.setHeader('x-cache', 'MISS');
    return next.handle().pipe(
      tap(async (data) => {
        await this.cache.set(key, data, this.ttlSeconds);
      }),
    );
  }
}