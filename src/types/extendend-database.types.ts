import { Database } from "./database.types";

export type BaseClassRow = Database["public"]["Tables"]["class"]["Row"];
export interface ClassRow extends BaseClassRow {
  instructor: Database["public"]["Tables"]["users"]["Row"] | null;
  gym: Database["public"]["Tables"]["gyms"]["Row"];
  instructor_name: string | null;
  assets: Database["public"]["Tables"]["assets"]["Row"][] | null;
}

export type BaseGymRow = Database["public"]["Tables"]["gyms"]["Row"];
