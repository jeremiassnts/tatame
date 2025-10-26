import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { GymLogoImageSendingJob } from './gym-logo-image-sending-job';
import { UserProfileImageSendingJob } from './user-profile-image-sending-job';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image-sending',
    }),
    DatabaseModule,
  ],
  providers: [GymLogoImageSendingJob, UserProfileImageSendingJob],
})
export class QueueModule {}
