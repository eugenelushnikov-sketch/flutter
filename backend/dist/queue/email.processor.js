"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
let EmailProcessor = EmailProcessor_1 = class EmailProcessor {
    logger = new common_1.Logger(EmailProcessor_1.name);
    async onModuleInit() {
        const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
        new bullmq_1.Worker('emailQueue', async (job) => {
            this.logger.log(`Email job: ${job.name} -> ${JSON.stringify(job.data)}`);
        }, { connection });
        this.logger.log('Email worker started');
    }
};
exports.EmailProcessor = EmailProcessor;
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, common_1.Injectable)()
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map