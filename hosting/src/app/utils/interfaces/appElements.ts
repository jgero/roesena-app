import { Timestamp } from '@angular/fire/firestore'

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
  date: Date;
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
  // should contain urls for thumb an full image here
}

export interface AppArticle extends AppElement {
  created: Date;
  title: string;
  content: string;
}

export interface StoreableArticle {
  ownerId: string;
  ownerName: string;
  created: Timestamp,
  title: string;
  content: string;
  tags: { [key: string]: boolean };
}

export interface StoreablePerson {
  groups: { [key: string]: boolean };
  isConfirmedMember: boolean;
  name: string;
}

export interface StoreableEvent {
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  startDate: Timestamp;
  tags: { [key: string]: boolean };
  deadline: Timestamp;
  participants: { [key: string]: { amount: number; name: string; hasUnseenChanges: boolean | null } };
}

export interface StoreableImage {
  ownerId: string;
  ownerName: string;
  created: Timestamp;
  tags: { [key: string]: boolean };
}
