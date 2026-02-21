import { Notification as NotificationRow } from "@/src/types/models";

export type Notification = NotificationRow & {
  sent_by_name: string;
  sent_by_image_url: string;
};
