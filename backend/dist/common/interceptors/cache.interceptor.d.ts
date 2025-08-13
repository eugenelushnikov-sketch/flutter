import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CacheService } from '../../cache/cache.service';
export declare class RedisCacheInterceptor implements NestInterceptor {
    private readonly cache;
    private readonly ttlSeconds;
    constructor(cache: CacheService, ttlSeconds?: number);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
