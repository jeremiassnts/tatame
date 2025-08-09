import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenEncrypterService } from 'src/domain/services/token-encrypter.service';
import { EnvService } from 'src/env/env.service';

@Injectable()
export class JwtEncrypter implements TokenEncrypterService {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}
  async encrypt(
    payload: Record<string, unknown>,
    options?: { expiresIn?: string },
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: Buffer.from(this.envService.get('JWT_PRIVATE_KEY'), 'base64'),
      algorithm: 'RS256',
      expiresIn: options?.expiresIn || '365d',
    });
  }
}
