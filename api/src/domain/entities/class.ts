export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface ClassProps {
  id?: string;
  name: string;
  description: string;
  timeStart: Date;
  timeEnd: Date;
  dayOfWeek: DayOfWeek;
  address: string;
  active: boolean;
  gymId: string;
  userId: string;
  modalityId: string;
}

export class Class {
  private props: ClassProps;

  constructor(props: ClassProps) {
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

  get description(): string {
    return this.props.description;
  }

  get timeStart(): Date {
    return this.props.timeStart;
  }

  get timeEnd(): Date {
    return this.props.timeEnd;
  }

  get dayOfWeek(): DayOfWeek {
    return this.props.dayOfWeek;
  }

  get address(): string {
    return this.props.address;
  }

  get active(): boolean {
    return this.props.active;
  }

  get gymId(): string {
    return this.props.gymId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get modalityId(): string {
    return this.props.modalityId;
  }
}
