import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AsignarConversacionDto {
  @ApiProperty({ description: 'ID del usuario interno al que se asigna la conversación' })
  @IsUUID()
  asignadoAId: string;
}
