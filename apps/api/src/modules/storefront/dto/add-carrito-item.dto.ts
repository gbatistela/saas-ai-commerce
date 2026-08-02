import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddCarritoItemDto {
  @ApiProperty({ description: 'Identificador de sesión anónima generado por el storefront' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty()
  @IsUUID()
  varianteId: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad: number;
}
