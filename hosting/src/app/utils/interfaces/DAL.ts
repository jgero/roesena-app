import { Observable } from 'rxjs';

import { Direction } from '../enums';
import { AppElement } from './appElements';

export interface AppElementDAL extends DAL {
  getById(id: string): Observable<AppElement | null>;
  getBySearchStrings(tags: string[], limit?: number): Observable<AppElement[]>;
  getAll(limit?: number): Observable<AppElement[]>;
}

export interface DAL {
  getById(id: string): Observable<any | null>;
  getBySearchStrings(tags: string[], limit?: number): Observable<any[]>;
  getAll(limit?: number): Observable<any[]>;
}

export interface PaginatedDAL extends DAL {
  getDocCount(): Observable<number>;
  getPage(limit: number, dir: Direction): Observable<any[]>;
}
