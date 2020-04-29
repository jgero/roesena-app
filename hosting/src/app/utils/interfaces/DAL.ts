import { Observable } from "rxjs";

import { appElement } from "./appElements";
import { Direction } from "../enums";

export interface appElementDAL {
  getById(id: string): Observable<appElement | null>;
  getByTags(tags: string[], limit?: number): Observable<appElement[]>;
  getAll(limit?: number): Observable<appElement[]>;
}

export interface paginatedDAL extends appElementDAL {
  getDocCount(): Observable<number>;
  getPage(limit: number, dir: Direction): Observable<appElement[]>;
}
