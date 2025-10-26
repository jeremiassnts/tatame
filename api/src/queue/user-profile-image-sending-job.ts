import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ImageSendingJobData } from './types';
import { UploadPhotoUseCase } from 'src/use-cases/upload-photo';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { UserNotFoundError } from 'src/use-cases/error/user-not-found.error';

@Processor('user-profile-image-sending')
export class UserProfileImageSendingJob extends WorkerHost {
  constructor(
    private uploadPhotoUseCase: UploadPhotoUseCase,
    private usersRepository: UsersRepository,
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

    const user = await this.usersRepository.findById(entityId);
    if (!user) {
      throw new UserNotFoundError();
    }

    user.profilePhotoUrl = url;
    await this.usersRepository.update(user);
  }
}
