import { DayOfWeek } from "../constants/week-days";

export interface WeekDay {
  title: string;
  shortTitle: string;
  isSelected: boolean;
  date: Date;
  dayOfWeek: DayOfWeek | undefined;
}
