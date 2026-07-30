"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.setGlobalPrefix('api/v1', {
        exclude: ['/'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: configService.get('nodeEnv') === 'production'
            ? []
            : true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SaaS AI Commerce API')
        .setDescription('API del backend — plataforma de IA para atención y ventas')
        .setVersion('0.1.0-mvp')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('port') || 3000;
    await app.listen(port);
    logger.log(`API corriendo en http://localhost:${port}/api/v1`);
    logger.log(`Documentación Swagger en http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map