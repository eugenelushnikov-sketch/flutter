export declare const configuration: () => {
    port: number;
    databaseUrl: string;
    redisUrl: string;
    elasticUrl: string;
    jwt: {
        accessSecret: string;
        refreshSecret: string;
    };
    s3: {
        endpoint: string;
        bucket: string;
        accessKeyId: string;
        secretAccessKey: string;
        cdnBaseUrl: string;
        region: string;
    };
};
