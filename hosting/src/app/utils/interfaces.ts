import { Observable } from "rxjs";

export interface appPerson {
  id: string;
  name: string;
  groups: string[];
  isConfirmedMember: boolean;
}

export interface appElementDAL {
  getByTags(tags: string[]): Observable<appElement[]>;
  getAll(limit?: number);
}

export interface appElement {
  id: string;
  ownerId: string;
  tags: string[];
}

export interface appEvent extends appElement {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  deadline: Date | null;
  participants: { id: string; amount: number }[];
}

export interface appImage extends appElement {
  created: Date;
}

export interface appArticle extends appElement {
  created: Date;
  title: string;
  content: string;
}
