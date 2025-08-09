import { PasswordHasherService } from 'src/services/password-hasher.service';

export class FakePasswordHasher implements PasswordHasherService {
  async hash(plain: string): Promise<string> {
    return Promise.resolve(`hashed_${plain}`);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return Promise.resolve(hashed === `hashed_${plain}`);
  }
}
