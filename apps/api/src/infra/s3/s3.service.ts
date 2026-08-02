import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const URL_EXPIRA_SEGUNDOS = 300; // 5 minutos para completar el PUT

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get<string>('s3.endpoint')!;
    this.bucket = this.configService.get<string>('s3.bucket')!;

    this.client = new S3Client({
      endpoint: this.endpoint,
      region: this.configService.get<string>('s3.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKey')!,
        secretAccessKey: this.configService.get<string>('s3.secretKey')!,
      },
      // MinIO no soporta direccionamiento virtual-hosted-style (bucket.host/key).
      forcePathStyle: true,
    });
  }

  /**
   * Genera una URL prefirmada para que el cliente (browser) suba el
   * archivo directo a MinIO con un PUT, sin pasar los bytes por nuestro
   * backend. Devuelve también la URL pública final para guardar en la
   * entidad Archivo una vez confirmada la subida.
   */
  async generarUrlSubida(
    empresaId: string,
    carpeta: string,
    nombreArchivo: string,
    contentType: string,
  ) {
    const extension = nombreArchivo.includes('.') ? nombreArchivo.split('.').pop() : undefined;
    const key = `${carpeta}/${empresaId}/${randomUUID()}${extension ? `.${extension}` : ''}`;

    const comando = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, comando, {
      expiresIn: URL_EXPIRA_SEGUNDOS,
    });

    return {
      uploadUrl,
      publicUrl: `${this.endpoint}/${this.bucket}/${key}`,
      key,
    };
  }
}
