import { z } from "zod";

export const classFormSchema = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  description: z.string().optional(),
  startTime: z.string().min(1, { message: "Horário de início é obrigatório" }),
  endTime: z.string().min(1, { message: "Horário de término é obrigatório" }),
  instructorId: z.string().min(1, { message: "Instrutor é obrigatório" }),
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  modalityId: z.string().min(1, { message: "Modalidade é obrigatória" }),
});

export const multiWeekDaysClassFormSchema = z.object({
  weekDays: z
    .array(z.string())
    .min(1, { message: "Selecione pelo menos um dia" }),
  ...classFormSchema.shape,
});

export const singleWeekDayClassFormSchema = z.object({
  weekDay: z.string().min(1, { message: "Selecione um dia" }),
  ...classFormSchema.shape,
});
