import { DayOfWeek } from "../constants/date";

export interface WeekDay {
  title: string;
  shortTitle: string;
  isSelected: boolean;
  date: Date;
  dayOfWeek: DayOfWeek | undefined;
}
