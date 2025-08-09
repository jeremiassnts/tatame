import { PasswordHasherService } from 'src/services/password-hasher.service';
import { compare, hash } from 'bcryptjs';

export class BcryptHasher implements PasswordHasherService {
  compare(original: string, hashed: string): Promise<boolean> {
    return compare(original, hashed);
  }
  hash(password: string): Promise<string> {
    return hash(password, 8);
  }
}
