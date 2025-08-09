import { TokenEncrypterService } from 'src/domain/services/token-encrypter.service';

export class FakeEncrypter implements TokenEncrypterService {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return Promise.resolve(JSON.stringify(payload));
  }
}
