export interface appEvent {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  deadline: Date | null;
  tags: string[];
  participants: { id: string; amount: number }[];
}

export interface appPerson {
  id: string;
  name: string;
  authLevel: number;
}

export interface appImage {
  id: string;
  created: Date;
  tags: string[];
  ownerId: string;
}

export interface appArticle {
  id: string;
  ownerId: string;
  created: Date;
  title: string;
  content: string;
  tags: string[];
}
