export const configuration = () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  elasticUrl: process.env.ELASTIC_URL || 'http://localhost:9200',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh',
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    bucket: process.env.S3_BUCKET || 'flatworthy-media',
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
    cdnBaseUrl: process.env.CDN_BASE_URL || 'http://localhost:9000/flatworthy-media',
    region: process.env.S3_REGION || 'us-east-1',
  },
});