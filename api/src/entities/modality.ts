export enum TypeOfGraduation {
  BELT = 'BELT',
}

interface ModalityProps {
  id?: string;
  name: string;
  type: TypeOfGraduation;
}

export class Modality {
  private props: ModalityProps;

  constructor(props: ModalityProps) {
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

  get type(): TypeOfGraduation {
    return this.props.type;
  }
}
