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
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let CacheService = CacheService_1 = class CacheService {
    logger = new common_1.Logger(CacheService_1.name);
    client;
    constructor() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        this.client = new ioredis_1.default(redisUrl, { lazyConnect: false });
    }
    async get(key) {
        const raw = await this.client.get(key);
        return raw ? JSON.parse(raw) : null;
    }
    async set(key, value, ttlSeconds) {
        const payload = JSON.stringify(value);
        await this.client.set(key, payload, 'EX', ttlSeconds);
    }
    async del(key) {
        await this.client.del(key);
    }
    async delByPattern(pattern) {
        const stream = this.client.scanStream({ match: pattern, count: 100 });
        const keys = [];
        for await (const resultKeys of stream) {
            for (const key of resultKeys)
                keys.push(key);
        }
        if (keys.length)
            await this.client.del(...keys);
        this.logger.debug(`Invalidated ${keys.length} keys by pattern ${pattern}`);
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CacheService);
//# sourceMappingURL=cache.service.js.map