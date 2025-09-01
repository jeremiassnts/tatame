export interface CheckInProps {
  id?: string;
  classId: string;
  userId: string;
  createdAt: Date;
  referenceDate: Date;
}

export class CheckIn {
  private props: CheckInProps;

  constructor(props: CheckInProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id!;
  }

  get classId(): string {
    return this.props.classId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get referenceDate(): Date {
    return this.props.referenceDate;
  }
}
