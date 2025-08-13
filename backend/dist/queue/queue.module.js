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
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const indexing_processor_1 = require("./indexing.processor");
const email_processor_1 = require("./email.processor");
let QueueModule = class QueueModule {
    constructor() { }
    async onModuleInit() { }
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'BULLMQ_CONNECTION',
                useFactory: () => {
                    const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
                    return connection;
                },
            },
            {
                provide: 'INDEXING_QUEUE',
                useFactory: (connection) => new bullmq_1.Queue('indexingQueue', { connection }),
                inject: ['BULLMQ_CONNECTION'],
            },
            {
                provide: 'MEDIA_QUEUE',
                useFactory: (connection) => new bullmq_1.Queue('mediaQueue', { connection }),
                inject: ['BULLMQ_CONNECTION'],
            },
            {
                provide: 'EMAIL_QUEUE',
                useFactory: (connection) => new bullmq_1.Queue('emailQueue', { connection }),
                inject: ['BULLMQ_CONNECTION'],
            },
            indexing_processor_1.IndexingProcessor,
            email_processor_1.EmailProcessor,
        ],
        exports: ['INDEXING_QUEUE', 'MEDIA_QUEUE', 'EMAIL_QUEUE'],
    }),
    __metadata("design:paramtypes", [])
], QueueModule);
//# sourceMappingURL=queue.module.js.map