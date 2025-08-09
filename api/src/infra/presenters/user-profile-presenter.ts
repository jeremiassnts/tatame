import { UserProfileData } from 'src/domain/repositories/users.repository';
import { GymPresenter } from './gym-presenter';

export class UserProfilePresenter {
  static toHttp(userProfile: UserProfileData) {
    return {
      user: {
        id: userProfile.user.id,
        name: userProfile.user.name,
        email: userProfile.user.email,
        profilePhotoUrl: userProfile.user.profilePhotoUrl,
        authorized: userProfile.user.authorized,
        birth: userProfile.user.birth,
        gender: userProfile.user.gender,
        createdAt: userProfile.user.createdAt,
        updatedAt: userProfile.user.updatedAt,
      },
      gym: userProfile.gym ? GymPresenter.toHttp(userProfile.gym) : null,
      graduations: userProfile.graduations.map((graduation) => ({
        id: graduation.id,
        colorId: graduation.colorId,
        userId: graduation.userId,
        modalityId: graduation.modalityId,
        extraInfo: graduation.extraInfo,
      })),
      roles: userProfile.roles.map((role) => ({
        id: role.id,
        role: role.role,
      })),
    };
  }
}
