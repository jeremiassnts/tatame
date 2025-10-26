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
export class UploadGymLogoPhotoController {
  constructor(@InjectQueue('image-sending') private imageSendingQueue: Queue) {}

  @Post('/:gymId/gym')
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
    @Param('gymId') gymId: string,
  ) {
    if (!gymId) {
      throw new BadRequestException('Gym ID is required');
    }

    await this.imageSendingQueue.add(
      'gym-logo-image-sending',
      {
        gymId,
        file,
      },
      {
        attempts: 3,
      },
    );
  }
}
