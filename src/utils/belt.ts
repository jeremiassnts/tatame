import { DEGREES } from "../constants/degrees";

export function getBeltDegrees(value: string) {
  // @ts-ignore
  const beltDegrees = Object.keys(DEGREES[value]).map((key) => ({
    value: key,
    // @ts-ignore
    label: DEGREES[value][key],
  }));
  return beltDegrees;
}
