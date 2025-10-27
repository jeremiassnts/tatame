import { Module } from '@nestjs/common';
import { GymLogoImageSendingJob } from './gym-logo-image-sending-job';
import { UserProfileImageSendingJob } from './user-profile-image-sending-job';
import { DatabaseModule } from 'src/database/database.module';
import { UploadPhotoUseCase } from 'src/use-cases/upload-photo';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [
    GymLogoImageSendingJob,
    UserProfileImageSendingJob,
    UploadPhotoUseCase,
  ],
})
export class QueueModule {}
