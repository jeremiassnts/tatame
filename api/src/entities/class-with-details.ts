import { ClassProps, DayOfWeek } from './class';

interface ClassWithDetailsProps extends ClassProps {
  gymName: string;
  instructorName: string;
  modalityName: string;
  cancellations: Date[];
}

export class ClassWithDetails {
  private props: ClassWithDetailsProps;

  constructor(props: ClassWithDetailsProps) {
    this.props = props;
  }

  get gymName(): string {
    return this.props.gymName;
  }

  get instructorName(): string {
    return this.props.instructorName;
  }

  get modalityName(): string {
    return this.props.modalityName;
  }

  get cancellations(): Date[] {
    return this.props.cancellations;
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
