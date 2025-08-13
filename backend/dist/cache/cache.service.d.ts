export declare class CacheService {
    private readonly logger;
    private readonly client;
    constructor();
    get<T = any>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds: number): Promise<void>;
    del(key: string): Promise<void>;
    delByPattern(pattern: string): Promise<void>;
}
