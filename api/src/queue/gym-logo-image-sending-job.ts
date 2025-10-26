import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ImageSendingJobData } from './types';
import { UploadPhotoUseCase } from 'src/use-cases/upload-photo';
import { GymsRepository } from 'src/database/repositories/gyms.repository';
import { BadRequestException } from '@nestjs/common';

@Processor('gym-logo-image-sending')
export class GymLogoImageSendingJob extends WorkerHost {
  constructor(
    private uploadPhotoUseCase: UploadPhotoUseCase,
    private gymsRepository: GymsRepository,
  ) {
    super();
  }
  async process(job: Job<ImageSendingJobData>): Promise<void> {
    const { entityId, file } = job.data;
    const { url } = await this.uploadPhotoUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    const gym = await this.gymsRepository.findById(entityId);
    if (!gym) {
      throw new BadRequestException('Gym not found');
    }

    gym.logo = url;
    await this.gymsRepository.update(gym);
  }
}
