export interface ClassCancellationProps {
  id?: string;
  classId: string;
  referenceDate: Date;
  createdAt: Date;
}

export class ClassCancellation {
  private props: ClassCancellationProps;
  constructor(props: ClassCancellationProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
    };
  }

  get id(): string {
    return this.props.id!;
  }

  get classId(): string {
    return this.props.classId;
  }

  get referenceDate(): Date {
    return this.props.referenceDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
