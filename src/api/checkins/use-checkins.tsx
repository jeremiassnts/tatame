import { create } from "./create-checkin";
import { fetchAll } from "./fetch-all";
import { fetchAllByClassId } from "./fetch-all-by-class-id";
import { fetchByClassId } from "./fetch-by-class-id";
import { fetchLastCheckins } from "./fetch-last-checkins";
import { fetchLastMonthCheckins } from "./fetch-last-month-checkins";
import { remove } from "./remove-checkin";

export function useCheckins() {
  return {
    create,
    remove,
    fetchAll,
    fetchByClassId,
    fetchLastCheckins,
    fetchLastMonthCheckins,
    fetchAllByClassId,
  };
}
