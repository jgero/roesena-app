export interface appElement {
  id: string;
  ownerId: string;
  ownerName: string;
  tags: string[];
}

export interface appPerson {
  id: string;
  name: string;
  groups: string[];
  isConfirmedMember: boolean;
}

export interface appEvent extends appElement {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  deadline: Date | null;
  participants: Participant[];
}

export interface Participant {
  id: string;
  amount: number;
  name: string;
}

export interface appImage extends appElement {
  created: Date;
}

export interface appArticle extends appElement {
  created: Date;
  title: string;
  content: string;
}
