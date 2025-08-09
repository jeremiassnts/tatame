interface GraduationColorProps {
  id?: string;
  name: string;
  modalityId: string;
}

export class GraduationColor {
  private props: GraduationColorProps;

  constructor(props: GraduationColorProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
    };
  }

  get id(): string {
    return this.props.id!;
  }

  get name(): string {
    return this.props.name;
  }

  get modalityId(): string {
    return this.props.modalityId;
  }
}
