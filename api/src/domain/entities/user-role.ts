import { randomUUID } from 'crypto';

export enum Role {
  MANAGER = 'MANAGER',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

interface UserRoleProps {
  id?: string;
  userId?: string;
  role: Role;
}

export class UserRole {
  private props: UserRoleProps;

  constructor(props: UserRoleProps) {
    this.props = {
      ...props,
      id: props.id ?? randomUUID(),
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  get role(): Role {
    return this.props.role;
  }
}
