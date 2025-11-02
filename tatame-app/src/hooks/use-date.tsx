import { format, getDaysInMonth } from "date-fns";

export interface Month {
  label: string;
  value: number;
}

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}
export interface Day {
  date: number;
  dayOfWeek: DayOfWeek;
}

export function useDate() {
  function getYears() {
    const years = Array.from(
      { length: new Date().getFullYear() - 1950 },
      (_, index) => new Date().getFullYear() - index
    );
    return years;
  }

  function getMonths() {
    const months: Month[] = Array.from(
      { length: 12 },
      (_, index) => index + 1
    ).map((e) => ({
      label: new Date(0, e).toLocaleString("pt-BR", { month: "long" }),
      value: e,
    }));
    return months;
  }

  function getDaysOfMonth(month: number, year: number) {
    const qntDays = getDaysInMonth(new Date(year, month - 1));
    const days: Day[] = Array.from(
      { length: qntDays },
      (_, index) => index + 1
    ).map((e) => ({
      date: e,
      dayOfWeek: format(
        new Date(year, month - 1, e),
        "EEEE"
      ).toUpperCase() as DayOfWeek,
    }));
    return days;
  }
  return {
    getYears,
    getMonths,
    getDaysOfMonth,
  };
}
