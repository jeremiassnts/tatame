import { User } from 'src/entities/user';

export class UserPresenter {
  static toHttp({ id, name, email }: User) {
    return {
      id,
      name,
      email,
    };
  }
}
