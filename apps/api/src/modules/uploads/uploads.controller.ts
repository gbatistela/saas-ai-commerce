import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { S3Service } from '../../infra/s3/s3.service';
import { PresignedUploadDto } from './dto/presigned-upload.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned')
  @Roles('OWNER', 'ADMIN')
  async generarUrlSubida(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PresignedUploadDto,
  ) {
    return this.s3Service.generarUrlSubida(
      user.empresaId,
      dto.carpeta,
      dto.nombreArchivo,
      dto.contentType,
    );
  }
}
