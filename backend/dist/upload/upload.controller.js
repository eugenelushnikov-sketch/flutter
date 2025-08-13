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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const prisma_service_1 = require("../prisma/prisma.service");
let UploadController = class UploadController {
    prisma;
    s3;
    bucket = process.env.S3_BUCKET || 'flatworthy-media';
    constructor(prisma) {
        this.prisma = prisma;
        this.s3 = new client_s3_1.S3Client({
            region: process.env.S3_REGION || 'us-east-1',
            endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
            forcePathStyle: true,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
                secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
            },
        });
    }
    async signedUrl(dto) {
        const command = new client_s3_1.PutObjectCommand({ Bucket: this.bucket, Key: dto.key, ContentType: dto.type, ACL: 'public-read' });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: 60 });
        return { url, bucket: this.bucket, key: dto.key };
    }
    async complete(dto) {
        const cdn = process.env.CDN_BASE_URL || '';
        const url = `${cdn}/${dto.key}`.replace(/\/+/, '/');
        const asset = await this.prisma.mediaAsset.create({
            data: {
                bucket: dto.bucket,
                key: dto.key,
                url,
                type: dto.type,
                width: dto.width,
                height: dto.height,
            },
        });
        return asset;
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('signed-url'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "signedUrl", null);
__decorate([
    (0, common_1.Post)('complete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "complete", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map