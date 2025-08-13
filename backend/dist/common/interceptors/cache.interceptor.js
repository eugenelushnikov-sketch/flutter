"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("../../cache/cache.service");
const crypto_1 = __importDefault(require("crypto"));
let RedisCacheInterceptor = class RedisCacheInterceptor {
    cache;
    ttlSeconds;
    constructor(cache, ttlSeconds = 120) {
        this.cache = cache;
        this.ttlSeconds = ttlSeconds;
    }
    async intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        if (req.method !== 'GET') {
            return next.handle();
        }
        const keyBase = `${req.method}:${req.originalUrl}`;
        const key = `cache:${crypto_1.default.createHash('md5').update(keyBase).digest('hex')}`;
        const cached = await this.cache.get(key);
        if (cached) {
            res.setHeader('x-cache', 'HIT');
            return (0, rxjs_1.of)(cached);
        }
        res.setHeader('x-cache', 'MISS');
        return next.handle().pipe((0, operators_1.tap)(async (data) => {
            await this.cache.set(key, data, this.ttlSeconds);
        }));
    }
};
exports.RedisCacheInterceptor = RedisCacheInterceptor;
exports.RedisCacheInterceptor = RedisCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService, Object])
], RedisCacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map