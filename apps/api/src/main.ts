import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody: true expone req.rawBody (Buffer) además del body parseado,
  // necesario para verificar la firma HMAC de los webhooks de Shopify.
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Prefijo global de la API
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'], // healthcheck simple sin prefijo, útil para el VPS/Nginx
  });

  // Validación automática de DTOs en todos los endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // descarta propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // rechaza el request si vienen propiedades extra
      transform: true, // convierte tipos automáticamente (ej. string -> number)
    }),
  );

  // CORS: en desarrollo abierto, en producción restringir a los dominios
  // del admin panel y el storefront (ajustar vía env cuando se despliegue).
  app.enableCors({
    origin: configService.get<string>('nodeEnv') === 'production'
      ? [] // completar con los dominios reales en producción
      : true,
    credentials: true,
  });

  // Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('SaaS AI Commerce API')
    .setDescription('API del backend — plataforma de IA para atención y ventas')
    .setVersion('0.1.0-mvp')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);

  logger.log(`API corriendo en http://localhost:${port}/api/v1`);
  logger.log(`Documentación Swagger en http://localhost:${port}/api/docs`);
}

bootstrap();
