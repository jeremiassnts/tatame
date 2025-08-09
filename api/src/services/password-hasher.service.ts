export abstract class PasswordHasherService {
  abstract compare(original: string, hashed: string): Promise<boolean>;
  abstract hash(password: string): Promise<string>;
}
