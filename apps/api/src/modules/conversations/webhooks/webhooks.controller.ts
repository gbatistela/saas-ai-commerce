import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { WebhooksService } from './webhooks.service';
import { Public } from '../../../common/decorators/public.decorator';

// Excluido de Swagger: son endpoints para integraciones de terceros
// (Evolution API / Meta), no para clientes de la API propia.
@ApiExcludeController()
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('whatsapp')
  @HttpCode(HttpStatus.OK)
  async whatsapp(
    @Body() body: any,
    @Headers('apikey') apikey?: string,
    @Query('token') tokenQuery?: string,
  ) {
    const tokenEsperado = this.configService.get<string>(
      'channels.evolutionWebhookToken',
    );

    if (tokenEsperado && apikey !== tokenEsperado && tokenQuery !== tokenEsperado) {
      throw new UnauthorizedException('Token de Evolution API inválido');
    }

    await this.webhooksService.procesarWhatsapp(body);
    return { received: true };
  }

  @Public()
  @Get('instagram')
  verificarInstagram(
    @Query() query: Record<string, string>,
    @Res() res: Response,
  ) {
    const tokenEsperado =
      this.configService.get<string>('channels.instagramVerifyToken') ?? '';
    const challenge = this.webhooksService.verificarHandshakeInstagram(
      query,
      tokenEsperado,
    );

    if (challenge === null) {
      res.status(HttpStatus.FORBIDDEN).send();
      return;
    }

    res.status(HttpStatus.OK).send(challenge);
  }

  @Public()
  @Post('instagram')
  @HttpCode(HttpStatus.OK)
  async instagram(@Body() body: any) {
    await this.webhooksService.procesarInstagram(body);
    return { received: true };
  }
}
