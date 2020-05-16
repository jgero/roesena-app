import * as fbs from 'firebase/app';

export interface AppElement {
  id: string;
  ownerId: string;
  ownerName: string;
  tags: string[];
}

export interface AppPerson {
  id: string;
  name: string;
  groups: string[];
  isConfirmedMember: boolean;
}

export interface AppEvent extends AppElement {
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
  hasUnseenChanges: boolean | null;
}

export interface AppImage extends AppElement {
  created: Date;
}

export interface AppArticle extends AppElement {
  created: Date;
  title: string;
  content: string;
}

export interface StoreableArticle {
  ownerId: string;
  ownerName: string;
  created: fbs.firestore.Timestamp;
  title: string;
  content: string;
  tags: { [key: string]: boolean };
}
