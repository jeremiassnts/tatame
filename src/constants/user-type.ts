export const USER_TYPES = {
  STUDENT: {
    value: "STUDENT",
    label: "Aluno",
    description:
      "Acompanhe as aulas, conteúdos e faça check-in para marcar sua presença",
  },
  MANAGER: {
    value: "MANAGER",
    label: "Gestor",
    description: "Gerencie suas aulas e presença dos alunos",
  },
};

export type UserType = keyof typeof USER_TYPES;