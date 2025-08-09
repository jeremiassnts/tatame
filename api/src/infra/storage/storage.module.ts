import { Module } from '@nestjs/common';
import { Uploader } from 'src/domain/storage/uploader';
import { R2Storage } from './r2-storage';
import { EnvModule } from 'src/env/env.module';

@Module({
  providers: [{ provide: Uploader, useClass: R2Storage }],
  exports: [Uploader],
  imports: [EnvModule],
})
export class StorageModule {}
