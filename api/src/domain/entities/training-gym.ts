interface TrainingGymProps {
  id?: string;
  userId?: string;
  gymId: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class TrainingGym {
  private props: TrainingGymProps;

  constructor(props: TrainingGymProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
    };
  }

  get id(): string {
    return this.props.id!;
  }

  get userId(): string | undefined {
    return this.props.userId!;
  }

  get gymId(): string {
    return this.props.gymId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }
}
