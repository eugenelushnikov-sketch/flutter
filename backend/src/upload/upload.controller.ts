import { Body, Controller, Post } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from '../prisma/prisma.service';

@Controller('upload')
export class UploadController {
  private s3: S3Client;
  private bucket = process.env.S3_BUCKET || 'flatworthy-media';

  constructor(private readonly prisma: PrismaService) {
    this.s3 = new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      },
    });
  }

  @Post('signed-url')
  async signedUrl(@Body() dto: { key: string; type: string }) {
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: dto.key, ContentType: dto.type, ACL: 'public-read' as any });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 60 });
    return { url, bucket: this.bucket, key: dto.key };
  }

  @Post('complete')
  async complete(@Body() dto: { bucket: string; key: string; type: string; width?: number; height?: number }) {
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
}