import { appEvent } from "src/app/utils/interfaces";
import { of, Observable } from "rxjs";

export class EventDalServiceStub {
  constructor() {}

  getRespondables(): Observable<appEvent[]> {
    return of([]);
  }

  getAll(limit?: number): Observable<appEvent[]> {
    return of([]);
  }

  getForMonth(): Observable<appEvent[]> {
    return of([]);
  }

  getById(id: string): Observable<appEvent | null> {
    return of(null);
  }
}
