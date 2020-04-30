import { Observable } from "rxjs";

import { Direction } from "../enums";
import { appElement } from "./appElements";

export interface appElementDAL extends DAL {
  getById(id: string): Observable<appElement | null>;
  getBySearchStrings(tags: string[], limit?: number): Observable<appElement[]>;
  getAll(limit?: number): Observable<appElement[]>;
}

export interface DAL {
  getById(id: string): Observable<any | null>;
  getBySearchStrings(tags: string[], limit?: number): Observable<any[]>;
  getAll(limit?: number): Observable<any[]>;
}

export interface paginatedDAL extends DAL {
  getDocCount(): Observable<number>;
  getPage(limit: number, dir: Direction): Observable<any[]>;
}
