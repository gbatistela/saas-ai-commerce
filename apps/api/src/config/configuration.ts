export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  channels: {
    // Token compartido que Evolution API debe enviar (header o query) para
    // validar que el webhook de WhatsApp viene de una instancia confiable.
    evolutionWebhookToken: process.env.EVOLUTION_WEBHOOK_TOKEN,
    // Token de verificación del handshake GET de Meta (Instagram Messaging).
    instagramVerifyToken: process.env.INSTAGRAM_VERIFY_TOKEN,
  },
});
