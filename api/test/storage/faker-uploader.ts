import { randomUUID } from 'crypto';
import { Uploader, UploadParams } from 'src/services/uploader';

interface Upload {
  fileName: string;
  url: string;
}
export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];
  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();
    this.uploads.push({
      fileName,
      url,
    });

    return Promise.resolve({ url });
  }
}
