import { PrismaService } from '../prisma/prisma.service';
export declare class UploadController {
    private readonly prisma;
    private s3;
    private bucket;
    constructor(prisma: PrismaService);
    signedUrl(dto: {
        key: string;
        type: string;
    }): Promise<{
        url: string;
        bucket: string;
        key: string;
    }>;
    complete(dto: {
        bucket: string;
        key: string;
        type: string;
        width?: number;
        height?: number;
    }): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        url: string;
        bucket: string;
        key: string;
        width: number | null;
        height: number | null;
    }>;
}
