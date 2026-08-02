import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShopifySyncService } from './shopify-sync.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('shopify')
@ApiBearerAuth()
@Controller('shopify')
export class ShopifyController {
  constructor(private readonly shopifySync: ShopifySyncService) {}

  @Post('sync')
  @Roles('OWNER', 'ADMIN')
  sincronizar(@CurrentUser() user: AuthenticatedUser) {
    return this.shopifySync.sincronizarCatalogo(user.empresaId);
  }
}
