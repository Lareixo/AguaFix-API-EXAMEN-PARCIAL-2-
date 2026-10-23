import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import * as path from 'node:path';
import { envs } from '../config/envs';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.region = envs.aws.region || process.env.AWS_REGION || 'us-east-1';
    this.bucketName = envs.aws.bucketName || process.env.AWS_BUCKET_NAME || '';

    const accessKeyId = envs.aws.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = envs.aws.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;

    this.s3Client = new S3Client({
      region: this.region,
      ...(accessKeyId && secretAccessKey
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
          }
        : {}),
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException(
        'AWS S3 bucket name is not configured in environment variables (AWS_BUCKET_NAME)',
      );
    }

    const normalizedFolder = folder ? (folder.endsWith('/') ? folder : `${folder}/`) : '';
    const fileExt = file.originalname ? path.extname(file.originalname) : '';
    const baseName = file.originalname
      ? path.basename(file.originalname, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_')
      : 'upload';
    const key = `${normalizedFolder}${Date.now()}-${randomUUID()}-${baseName}${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to upload file to S3: ${error.message || error}`,
      );
    }
  }
}
