import { appEvent } from "src/app/utils/interfaces";
import { of, Observable } from "rxjs";

export class EventDalServiceStub {
  public dataArray: appEvent[] = [];
  constructor() {}

  getRespondables(): Observable<appEvent[]> {
    return of(this.dataArray);
  }

  getAll(limit?: number): Observable<appEvent[]> {
    return of(this.dataArray);
  }

  getForMonth(): Observable<appEvent[]> {
    return of(this.dataArray);
  }

  getById(id: string): Observable<appEvent | null> {
    return of(null);
  }
}
