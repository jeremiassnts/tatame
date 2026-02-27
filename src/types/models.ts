export interface Asset {
  id: number;
  classId: number | null;
  title: string | null;
  content: string | null;
  type: string | null;
  validUntil: Date | null;
  createdAt: Date;
}

export interface Checkin {
  id: number;
  userId: number | null;
  classId: number | null;
  date: string | null;
  createdAt: Date;
  class?: Class;
}

export interface Graduation {
  id: number;
  userId: number;
  belt: string | null;
  degree: number | null;
  modality: string | null;
  createdAt: Date;
}

export interface Gym {
  id: number;
  name: string;
  address: string;
  logo: string | null;
  managerId: number | null;
  since: string;
  createdAt: Date;
}

export interface Class {
  id: number;
  gymId: number | null;
  instructorId: number | null;
  createdBy: number | null;
  day: string | null;
  start: string | null;
  end: string | null;
  modality: string | null;
  description: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  assets?: Asset[];
}

export interface Role {
  id: string;
  createdAt: Date;
}

export interface Version {
  id: number;
  appVersion: string | null;
  createdAt: Date;
  disabledAt: Date | null;
}

export interface AppStore {
  id: number;
  store: string | null;
  url: string | null;
  createdAt: Date;
  disabledAt: Date | null;
}

export interface Notification {
  id: number;
  sentBy: number | null;
  title: string | null;
  content: string | null;
  channel: string | null;
  status: string | null;
  recipients: string[] | null;
  viewedBy: string[] | null;
  sentAt: string | null;
  createdAt: string;
}

export interface User {
  id: number;
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
  birth: string | null;
  birthDay: string | null;
  gender: string | null;
  phone: string | null;
  instagram: string | null;
  role: string | null;
  gymId: number | null;
  expoPushToken: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  plan: string | null;
  approvedAt: string | null;
  deniedAt: string | null;
  migratedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
}
