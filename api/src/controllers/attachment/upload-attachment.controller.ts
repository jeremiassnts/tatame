import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPhotoUseCase } from 'src/use-cases/upload-photo';

@Controller('/attachments')
@SetMetadata('isPublic', true)
export class UploadPhotoController {
  constructor(private uploadPhotoUseCase: UploadPhotoUseCase) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2mb
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const { url } = await this.uploadPhotoUseCase.execute({
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      });

      return {
        url,
      };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
