import { FakeUploader } from 'test/storage/faker-uploader';
import { describe, beforeEach, it, expect } from 'vitest';
import { UploadPhotoUseCase } from './upload-photo';
import { InvalidAttachmentTypeError } from './error/invalid-attachment-type';

let sut: UploadPhotoUseCase;
let fakeUploader: FakeUploader;

describe('Upload and create attachments', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader();
    sut = new UploadPhotoUseCase(fakeUploader);
  });

  it('should be able to upload and create a file', async () => {
    const result = await sut.execute({
      fileName: 'test.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });
    expect(result.url).toEqual(expect.any(String));
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'test.png',
      }),
    );
  });

  it('should not be able to upload and create a file with invalid file type', async () => {
    await expect(() =>
      sut.execute({
        fileName: 'test.mp3',
        fileType: 'application/pdf',
        body: Buffer.from(''),
      }),
    ).rejects.toThrow(InvalidAttachmentTypeError);
    expect(fakeUploader.uploads).toHaveLength(0);
  });
});
