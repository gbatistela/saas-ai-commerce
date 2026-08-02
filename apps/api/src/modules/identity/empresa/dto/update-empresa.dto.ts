import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmpresaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rubro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  moneda?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description:
      'Número de WhatsApp conectado. Convención: la instancia de Evolution API debe llamarse igual que el slug de la empresa.',
  })
  @IsOptional()
  @IsString()
  telefonoWhatsapp?: string;

  @ApiPropertyOptional({ description: 'ID de la cuenta de Instagram Business conectada' })
  @IsOptional()
  @IsString()
  instagramAccountId?: string;

  @ApiPropertyOptional({ description: 'Dominio *.myshopify.com de la tienda' })
  @IsOptional()
  @IsString()
  shopifyShopDomain?: string;

  @ApiPropertyOptional({
    description:
      'Access token de una app privada/custom de Shopify (Admin API). Se guarda pero nunca se devuelve en las respuestas.',
  })
  @IsOptional()
  @IsString()
  shopifyAccessToken?: string;

  @ApiPropertyOptional({
    description:
      'API secret de la app de Shopify, usado para verificar la firma de los webhooks entrantes.',
  })
  @IsOptional()
  @IsString()
  shopifyWebhookSecret?: string;
}
