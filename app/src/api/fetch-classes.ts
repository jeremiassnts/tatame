import { getHours, getMinutes, getSeconds, set } from "date-fns";
import axiosClient from "../lib/axios";

export interface Class {
  id: string;
  name: string;
  description: string;
  timeStart: Date;
  timeEnd: Date;
  dayOfWeek: string;
  address: string;
  active: boolean;
  gymId: string;
  userId: string;
  modalityId: string;
  gymName: string;
  instructorName: string;
  modalityName: string;
  cancellations: Date[];
}

export async function fetchClasses(accessToken: string) {
  const { data } = await axiosClient.get<{ classes: Class[] }>("/classes", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  var formattedClasses = data.classes
    .map((c) => {
      let timeStart = new Date(c.timeStart);
      let timeEnd = new Date(c.timeEnd);
      const today = new Date();

      timeStart = set(today, {
        hours: getHours(timeStart),
        minutes: getMinutes(timeStart),
        seconds: 0,
        milliseconds: 0,
      });

      timeEnd = set(today, {
        hours: getHours(timeEnd),
        minutes: getMinutes(timeEnd),
        seconds: 0,
        milliseconds: 0,
      });

      return {
        ...c,
        timeStart,
        timeEnd,
      };
    })
    .sort((a, b) => {
      return new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime();
    });

  return formattedClasses;
}
