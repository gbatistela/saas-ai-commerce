import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DireccionCheckoutDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  calle: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiProperty()
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
}

export class CheckoutStorefrontDto {
  @ApiProperty({ description: 'Identificador de sesión anónima generado por el storefront' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: DireccionCheckoutDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DireccionCheckoutDto)
  direccion?: DireccionCheckoutDto;
}
