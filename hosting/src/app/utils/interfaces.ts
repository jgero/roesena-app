import { Observable } from "rxjs";
import { Direction } from "./enums";

export interface GardeDef {
  year: number;
  active: string[];
  leaders: string[];
  title: string;
  show: string;
}

export interface appPerson {
  id: string;
  name: string;
  groups: string[];
  isConfirmedMember: boolean;
}

export interface appElementDAL {
  getByTags(tags: string[], limit?: number): Observable<appElement[]>;
  getAll(limit?: number): Observable<appElement[]>;
}

export interface paginatedDAL extends appElementDAL {
  getDocCount(): Observable<number>;
  getPage(limit: number, dir: Direction): Observable<appElement[]>;
}

export interface appElement {
  id: string;
  ownerId: string;
  ownerName: string;
  tags: string[];
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
