import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarritoItemStorefrontDto {
  @ApiProperty({ description: 'Identificador de sesión anónima generado por el storefront' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad: number;
}
