import { Days } from "../constants/date";

export function formatTime(time: string | null) {
  if (!time) return "";
  return time.split(":")[0] + ":" + time.split(":")[1];
}

export function formatDay(day: string | null) {
  if (!day) return "";
  return Days.find((d) => d.value === day)?.label;
}
