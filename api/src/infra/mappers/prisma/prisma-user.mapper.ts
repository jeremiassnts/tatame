import { User as PrismaUser, Prisma } from '@prisma/client';
import { User, Gender } from '../../../domain/entities/user';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      authToken: raw.authToken ?? undefined,
      profilePhotoUrl: raw.profilePhotoUrl ?? undefined,
      authorized: raw.authorized,
      birth: raw.birth,
      gender: raw.gender as Gender,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      stripeCustomerId: raw.stripeCustomerId ?? undefined,
    });
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      authToken: user.authToken ?? null,
      profilePhotoUrl: user.profilePhotoUrl ?? null,
      authorized: user.authorized,
      birth: user.birth,
      gender: user.gender,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stripeCustomerId: user.stripeCustomerId ?? null,
    };
  }
}
