export interface appEvent {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  authLevel: number;
  participants: { id: string; amount: number }[];
}

export interface appPerson {
  id: string;
  name: string;
  authLevel: number;
}

export interface appImage {
  id: string;
  title: string;
  tags: string[];
  ownerId: string;
}
