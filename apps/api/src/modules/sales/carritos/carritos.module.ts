import { Module } from '@nestjs/common';
import { CarritosController } from './carritos.controller';
import { CarritosService } from './carritos.service';

@Module({
  controllers: [CarritosController],
  providers: [CarritosService],
  exports: [CarritosService],
})
export class CarritosModule {}
