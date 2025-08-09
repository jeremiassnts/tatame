interface GraduationProps {
  id?: string;
  colorId?: string;
  userId?: string;
  modalityId?: string;
  extraInfo?: string;
}

export class Graduation {
  private props: GraduationProps;

  constructor(props: GraduationProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
    };
  }

  get id(): string {
    return this.props.id!;
  }

  get colorId(): string | undefined {
    return this.props.colorId;
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  get modalityId(): string | undefined {
    return this.props.modalityId;
  }

  get extraInfo(): string | undefined {
    return this.props.extraInfo;
  }
}
