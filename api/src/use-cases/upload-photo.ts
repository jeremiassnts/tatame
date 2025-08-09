import { Injectable } from '@nestjs/common';
import { Uploader } from '../services/uploader';
import { InvalidAttachmentTypeError } from './error/invalid-attachment-type';

interface UploadPhotoUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}
@Injectable()
export class UploadPhotoUseCase {
  constructor(private uploader: Uploader) {}
  async execute({ body, fileName, fileType }: UploadPhotoUseCaseRequest) {
    if (!/^(image\/(jpg|jpeg|png))$/.test(fileType)) {
      throw new InvalidAttachmentTypeError(fileType);
    }
    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
    });
    return { url };
  }
}
