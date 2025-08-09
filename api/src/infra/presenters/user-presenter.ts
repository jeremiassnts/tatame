import { User } from 'src/domain/entities/user';

export class UserPresenter {
  static toHttp({ id, name, email }: User) {
    return {
      id,
      name,
      email,
    };
  }
}
