import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDireccionDto {
  @ApiProperty({ example: 'Av. Corrientes' })
  @IsString()
  @IsNotEmpty()
  calle: string;

  @ApiPropertyOptional({ example: '1234' })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiProperty({ example: 'Buenos Aires' })
  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provincia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}
