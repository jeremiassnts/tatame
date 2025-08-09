export abstract class TokenEncrypterService {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: { expiresIn?: string },
  ): Promise<string>;
}
