import { Module } from '@nestjs/common';
import { RespuestasRapidasController } from './respuestas-rapidas.controller';
import { RespuestasRapidasService } from './respuestas-rapidas.service';

@Module({
  controllers: [RespuestasRapidasController],
  providers: [RespuestasRapidasService],
  exports: [RespuestasRapidasService],
})
export class RespuestasRapidasModule {}
