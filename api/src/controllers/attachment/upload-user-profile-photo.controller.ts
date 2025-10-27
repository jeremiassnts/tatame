import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bullmq';

@Controller('/attachments')
@SetMetadata('isPublic', true)
export class UploadUserProfilePhotoController {
  constructor(@InjectQueue('image-sending') private imageSendingQueue: Queue) {}

  @Post('/:userId/user')
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
    @Param('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    await this.imageSendingQueue.add(
      'user-profile-image-sending',
      {
        userId,
        file,
      },
      {
        attempts: 3,
      },
    );
  }
}
