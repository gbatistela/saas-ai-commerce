declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        url: string | undefined;
    };
    redis: {
        url: string | undefined;
    };
    jwt: {
        secret: string | undefined;
        expiresIn: string;
        refreshSecret: string | undefined;
        refreshExpiresIn: string;
    };
    s3: {
        endpoint: string | undefined;
        accessKey: string | undefined;
        secretKey: string | undefined;
        bucket: string | undefined;
        region: string | undefined;
    };
    openai: {
        apiKey: string | undefined;
    };
};
export default _default;
