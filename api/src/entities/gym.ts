interface GymProps {
  id?: string;
  name: string;
  address: string;
  managerId?: string;
  logo: string;
  since: Date;
}

export class Gym {
  private props: GymProps;

  constructor(props: GymProps) {
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

  get address(): string {
    return this.props.address;
  }

  get managerId(): string | undefined {
    return this.props.managerId;
  }

  get logo(): string {
    return this.props.logo;
  }

  get since(): Date {
    return this.props.since;
  }
  set logo(logo: string) {
    this.props.logo = logo;
  }
}
