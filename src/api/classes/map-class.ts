import { Class } from "@/src/types/models";

export function mapToClassRow(item: any): Class {
  const instructor = item?.instructor
    ? [item.instructor.first_name ?? "", item.instructor.last_name ?? ""]
      .join(" ")
      .trim()
    : "";
  return {
    ...item,
    instructor_name: instructor,
  } as Class;
}
