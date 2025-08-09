import { randomUUID } from 'node:crypto';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  authToken?: string;
  profilePhotoUrl?: string;
  authorized: boolean;
  birth: Date;
  gender: Gender;
  updatedAt?: Date;
  createdAt: Date;
  stripeCustomerId?: string;
}

export enum UserRoles {
  MANAGER = 'MANAGER',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
      updatedAt: props.updatedAt ?? new Date(),
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id!;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  get authToken(): string | undefined {
    return this.props.authToken;
  }

  get profilePhotoUrl(): string | undefined {
    return this.props.profilePhotoUrl;
  }

  get authorized(): boolean {
    return this.props.authorized;
  }

  get birth(): Date {
    return this.props.birth;
  }

  get gender(): Gender {
    return this.props.gender;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get stripeCustomerId(): string | undefined {
    return this.props.stripeCustomerId;
  }

  set stripeCustomerId(stripeCustomerId: string) {
    this.props.stripeCustomerId = stripeCustomerId;
  }
}
